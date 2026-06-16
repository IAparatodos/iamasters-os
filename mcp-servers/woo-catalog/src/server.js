// Núcleo compartido del MCP. Define todas las tools (read-only) y devuelve un
// McpServer listo para conectar a CUALQUIER transporte: stdio (index.js, local)
// o HTTP (http.js, web). Una instancia nueva por conexión.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { config, clampLimit } from "./config.js";
import { wc, wp, fetchHtml } from "./wp.js";
import {
  shapeProduct,
  shapeProductCategory,
  shapePost,
  shapePostCategory,
} from "./format.js";
import { extractFaqFromHtml } from "./faq.js";

const ok = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});
const fail = (e) => ({
  isError: true,
  content: [{ type: "text", text: `Error: ${e.message || String(e)}` }],
});

export function buildServer() {
  const server = new McpServer({
    name: `woo-catalog-${config.brandSlug}`,
    version: "0.1.0",
  });

// ── Productos ───────────────────────────────────────────────────────────────
server.tool(
  "producto_actual",
  `Devuelve el último producto publicado en ${config.brandName} (el más reciente).`,
  {},
  async () => {
    try {
      const list = await wc.products({
        per_page: 1,
        orderby: "date",
        order: "desc",
        status: "publish",
      });
      const product = list?.[0] ? shapeProduct(list[0]) : null;
      return ok({ brand: config.brandName, product });
    } catch (e) {
      return fail(e);
    }
  }
);

server.tool(
  "ultimos_productos",
  `Lista los últimos productos publicados en ${config.brandName}.`,
  { limit: z.number().int().min(1).max(config.maxLimit).optional() },
  async ({ limit }) => {
    try {
      const list = await wc.products({
        per_page: clampLimit(limit),
        orderby: "date",
        order: "desc",
        status: "publish",
      });
      return ok((list || []).map(shapeProduct));
    } catch (e) {
      return fail(e);
    }
  }
);

server.tool(
  "buscar_productos",
  `Busca productos en ${config.brandName} por nombre/descripción, opcionalmente filtrando por categoría (slug o id).`,
  {
    query: z.string().min(1),
    categoria: z.string().optional(),
    limit: z.number().int().min(1).max(config.maxLimit).optional(),
  },
  async ({ query, categoria, limit }) => {
    try {
      const list = await wc.products({
        search: query,
        category: categoria,
        per_page: clampLimit(limit),
        status: "publish",
      });
      return ok({ query, results: (list || []).map(shapeProduct) });
    } catch (e) {
      return fail(e);
    }
  }
);

server.tool(
  "categorias_productos",
  `Lista las categorías de producto de ${config.brandName} (las más pobladas primero).`,
  { limit: z.number().int().min(1).max(100).optional() },
  async ({ limit }) => {
    try {
      const list = await wc.productCategories({
        per_page: Math.min(limit || 50, 100),
        orderby: "count",
        order: "desc",
        hide_empty: true,
      });
      return ok((list || []).map(shapeProductCategory));
    } catch (e) {
      return fail(e);
    }
  }
);

// ── Blog ────────────────────────────────────────────────────────────────────
server.tool(
  "ultimos_posts",
  `Lista las últimas entradas del blog de ${config.brandName}.`,
  { limit: z.number().int().min(1).max(config.maxLimit).optional() },
  async ({ limit }) => {
    try {
      const list = await wp.posts({
        per_page: clampLimit(limit),
        orderby: "date",
        order: "desc",
        status: "publish",
      });
      return ok((list || []).map(shapePost));
    } catch (e) {
      return fail(e);
    }
  }
);

server.tool(
  "buscar_posts",
  `Busca entradas del blog de ${config.brandName} por texto.`,
  {
    query: z.string().min(1),
    limit: z.number().int().min(1).max(config.maxLimit).optional(),
  },
  async ({ query, limit }) => {
    try {
      const list = await wp.posts({
        search: query,
        per_page: clampLimit(limit),
        status: "publish",
      });
      return ok({ query, results: (list || []).map(shapePost) });
    } catch (e) {
      return fail(e);
    }
  }
);

server.tool(
  "categorias_blog",
  `Lista las categorías del blog de ${config.brandName}.`,
  { limit: z.number().int().min(1).max(100).optional() },
  async ({ limit }) => {
    try {
      const list = await wp.categories({
        per_page: Math.min(limit || 50, 100),
        orderby: "count",
        order: "desc",
        hide_empty: true,
      });
      return ok((list || []).map(shapePostCategory));
    } catch (e) {
      return fail(e);
    }
  }
);

// ── FAQs (se leen del JSON-LD FAQPage publicado en la propia página) ─────────
server.tool(
  "faqs",
  `Devuelve las preguntas frecuentes (FAQ) de ${config.brandName}. ` +
    `Sin argumentos devuelve las FAQ generales de la tienda` +
    (config.faqPageUrl ? ` (${config.faqPageUrl})` : "") +
    `. También acepta id (+ tipo: producto|post|pagina) o una url directa. ` +
    `Lee el schema FAQPage de la página pública.`,
  {
    id: z.number().int().positive().optional(),
    tipo: z.enum(["producto", "post", "pagina"]).default("producto"),
    url: z.string().url().optional(),
  },
  async ({ id, tipo, url }) => {
    try {
      let pageUrl = url;
      if (!pageUrl) {
        if (!id) {
          // Sin id ni url → FAQ generales de la tienda (página configurada).
          if (!config.faqPageUrl)
            throw new Error(
              "No hay FAQ generales configuradas (FAQ_PAGE_URL vacío). Indica 'id' (+ 'tipo') o una 'url'."
            );
          pageUrl = config.faqPageUrl;
        } else if (tipo === "post") {
          pageUrl = (await wp.postById(id)).link;
        } else if (tipo === "pagina") {
          pageUrl = (await wp.pageById(id)).link;
        } else {
          pageUrl = (await wc.productById(id)).permalink;
        }
      }
      const html = await fetchHtml(pageUrl);
      const faqs = extractFaqFromHtml(html);
      return ok({
        scope: !url && !id ? "general" : tipo,
        url: pageUrl,
        count: faqs.length,
        faqs,
        ...(faqs.length === 0
          ? { note: "Esta página no publica FAQs (schema FAQPage vacío)." }
          : {}),
      });
    } catch (e) {
      return fail(e);
    }
  }
);

// ── Healthcheck ─────────────────────────────────────────────────────────────
server.tool(
  `hello_${config.brandSlug}`,
  `Comprueba que el MCP de catálogo de ${config.brandName} responde.`,
  {},
  async () => {
    try {
      const probe = await wc.products({ per_page: 1, status: "publish" });
      return ok({
        ok: true,
        brand: config.brandName,
        base_url: config.baseUrl,
        catalog_reachable: Array.isArray(probe),
        tools: [
          "producto_actual",
          "ultimos_productos",
          "buscar_productos",
          "categorias_productos",
          "ultimos_posts",
          "buscar_posts",
          "categorias_blog",
          "faqs",
        ],
      });
    } catch (e) {
      return fail(e);
    }
  }
);

  return server;
}
