#!/usr/bin/env node
// Modo WEB (Streamable HTTP): expone el MCP en una URL pública para que
// cualquier LLM/cliente se conecte. Sin estado de sesión (stateless) y abierto:
// todas las tools son SOLO LECTURA sobre datos ya públicos, así que es seguro.
//
// Endpoints:
//   POST /mcp     → protocolo MCP (Streamable HTTP)
//   GET  /health  → healthcheck simple
//
// Variables: PORT (lo inyecta el hosting; por defecto 3000).
import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
import { buildServer } from "./server.js";

// Passenger/cPanel a veces pasa PORT como una RUTA de socket (no un número).
// listen() acepta ambos, así que NO lo convertimos a entero.
const PORT = process.env.PORT || 3000;
const MCP_PATH = process.env.MCP_PATH || "/mcp";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version"
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 1_000_000) reject(new Error("Body demasiado grande"));
    });
    req.on("end", () => {
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
    req.on("error", reject);
  });
}

const httpServer = createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ ok: true, brand: config.brandName, transport: "http" })
    );
    return;
  }

  if (url.pathname !== MCP_PATH) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32700, message: e.message },
          id: null,
        })
      );
      return;
    }

    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32603, message: e.message },
            id: null,
          })
        );
      }
    }
    return;
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
});

httpServer.listen(PORT, () => {
  console.error(
    `[wp-content-mcp] ${config.brandName} listo (HTTP, read-only) en :${PORT}${MCP_PATH} sobre ${config.baseUrl}`
  );
});
