// Núcleo compartido del MCP de contenido WordPress. Read-only sobre la REST
// pública. buildServer() devuelve un McpServer para stdio (index.js) o HTTP
// (http.js). Configurado para Solidker por defecto (sitio de contenido).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { config, clampLimit } from "./config.js";
import { wp, resolveContent, resolveCategory } from "./wp.js";
import { shapePage, shapePost, shapeCategory } from "./format.js";

const ok = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});
const fail = (e) => ({
  isError: true,
  content: [{ type: "text", text: `Error: ${e.message || String(e)}` }],
});

export function buildServer() {
  const server = new McpServer({
    name: `wp-content-${config.brandSlug}`,
    version: "0.1.0",
  });

  // ── Páginas informativas ────────────────────────────────────────────────────
  server.tool(
    "paginas",
    `Lista las páginas informativas de ${config.brandName} (qué ofrece, servicios, contacto). Oculta legales e índice de blog.`,
    {},
    async () => {
      try {
        const { data } = await wp.pages({
          per_page: 100,
          orderby: "menu_order",
          order: "asc",
          status: "publish",
        });
        const paginas = (data || [])
          .filter((p) => !config.hidePages.includes(String(p.slug).toLowerCase()))
          .map((p) => shapePage(p));
        return ok({ brand: config.brandName, total: paginas.length, paginas });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Una página con texto completo ────────────────────────────────────────────
  server.tool(
    "pagina",
    `Devuelve el texto completo de una página de ${config.brandName}. Acepta id, slug o url.`,
    {
      id: z.number().int().positive().optional(),
      slug: z.string().optional(),
      url: z.string().url().optional(),
    },
    async ({ id, slug, url }) => {
      try {
        const page = await resolveContent("pagina", { id, slug, url });
        if (!page) throw new Error("Página no encontrada.");
        return ok(shapePage(page, { full: true }));
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Artículos del blog ───────────────────────────────────────────────────────
  server.tool(
    "articulos",
    `Lista los artículos del blog de ${config.brandName}. Opcional: filtrar por categoría (slug/id/nombre).`,
    {
      categoria: z.string().optional(),
      categoria_id: z.number().int().positive().optional(),
      limit: z.number().int().min(1).max(config.maxLimit).optional(),
    },
    async ({ categoria, categoria_id, limit }) => {
      try {
        let catId = categoria_id;
        if (!catId && categoria) {
          const cat = await resolveCategory({ query: categoria });
          catId = cat?.id;
        }
        const { data, total } = await wp.posts({
          categories: catId,
          per_page: clampLimit(limit),
          orderby: "date",
          order: "desc",
          status: "publish",
        });
        return ok({
          brand: config.brandName,
          total,
          articulos: (data || []).map((p) => shapePost(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Un artículo con texto completo ───────────────────────────────────────────
  server.tool(
    "articulo",
    `Devuelve el texto completo de un artículo del blog de ${config.brandName}. Acepta id, slug o url.`,
    {
      id: z.number().int().positive().optional(),
      slug: z.string().optional(),
      url: z.string().url().optional(),
    },
    async ({ id, slug, url }) => {
      try {
        const post = await resolveContent("articulo", { id, slug, url });
        if (!post) throw new Error("Artículo no encontrado.");
        return ok(shapePost(post, { full: true }));
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Buscar (artículos + páginas) ─────────────────────────────────────────────
  server.tool(
    "buscar",
    `Busca por texto en los artículos y páginas de ${config.brandName}.`,
    {
      query: z.string().min(1),
      limit: z.number().int().min(1).max(config.maxLimit).optional(),
    },
    async ({ query, limit }) => {
      try {
        const n = clampLimit(limit);
        const [posts, pages] = await Promise.all([
          wp.posts({ search: query, per_page: n }).then((r) => r.data || []),
          wp.pages({ search: query, per_page: n }).then((r) => r.data || []),
        ]);
        return ok({
          query,
          articulos: posts.map((p) => shapePost(p)),
          paginas: pages
            .filter((p) => !config.hidePages.includes(String(p.slug).toLowerCase()))
            .map((p) => shapePage(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Últimos artículos ────────────────────────────────────────────────────────
  server.tool(
    "ultimos_articulos",
    `Los últimos artículos publicados en el blog de ${config.brandName}.`,
    { limit: z.number().int().min(1).max(config.maxLimit).optional() },
    async ({ limit }) => {
      try {
        const { data } = await wp.posts({
          per_page: clampLimit(limit),
          orderby: "date",
          order: "desc",
          status: "publish",
        });
        return ok({
          brand: config.brandName,
          articulos: (data || []).map((p) => shapePost(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Categorías del blog ──────────────────────────────────────────────────────
  server.tool(
    "categorias",
    `Lista las categorías del blog de ${config.brandName}.`,
    { limit: z.number().int().min(1).max(100).optional() },
    async ({ limit }) => {
      try {
        const { data } = await wp.categories({
          per_page: Math.min(limit || 50, 100),
          orderby: "count",
          order: "desc",
          hide_empty: true,
        });
        return ok((data || []).map(shapeCategory));
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Healthcheck ──────────────────────────────────────────────────────────────
  server.tool(
    `hello_${config.brandSlug}`,
    `Comprueba que el MCP de contenido de ${config.brandName} responde.`,
    {},
    async () => {
      try {
        const { data } = await wp.posts({ per_page: 1 });
        return ok({
          ok: true,
          brand: config.brandName,
          base_url: config.baseUrl,
          reachable: Array.isArray(data),
          tools: [
            "paginas",
            "pagina",
            "articulos",
            "articulo",
            "buscar",
            "ultimos_articulos",
            "categorias",
          ],
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  return server;
}
