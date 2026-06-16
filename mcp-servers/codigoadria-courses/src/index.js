#!/usr/bin/env node
// Modo LOCAL (stdio): Claude Code lanza este proceso en tu máquina.
// Para el modo web (URL pública), usa http.js.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config.js";
import { buildServer } from "./server.js";

const server = buildServer();
const transport = new StdioServerTransport();
await server.connect(transport);
console.error(
  `[codigoadria-courses-mcp] ${config.brandName} listo (stdio, read-only) sobre ${config.baseUrl}`
);
