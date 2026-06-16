// Núcleo compartido del MCP de cursos de Código AdrIA. Read-only sobre la REST
// pública de WordPress. buildServer() devuelve un McpServer para conectar a
// cualquier transporte: stdio (index.js) o HTTP (http.js).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { config, clampLimit, isCourseCategory, normalizeName } from "./config.js";
import { wp, resolveCategory } from "./wp.js";
import { plain, shapeCourse, shapeClass, shapeCategory } from "./format.js";

const ok = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});
const fail = (e) => ({
  isError: true,
  content: [{ type: "text", text: `Error: ${e.message || String(e)}` }],
});

// Categorías-curso (las que agrupan clases), ordenadas por nº de clases.
async function courseCategories() {
  const { data } = await wp.categories({
    per_page: 100,
    orderby: "count",
    order: "desc",
    hide_empty: true,
  });
  return (data || []).filter((c) => isCourseCategory(c.name));
}

// Empareja una categoría-curso con su página comercial (CPT course) por nombre.
function matchCoursePage(categoryName, coursePages) {
  const key = normalizeName(categoryName);
  if (!key) return null;
  return (
    coursePages.find((p) => {
      const pk = normalizeName(p.title?.rendered);
      return pk && (pk === key || pk.includes(key) || key.includes(pk));
    }) || null
  );
}

export function buildServer() {
  const server = new McpServer({
    name: `codigoadria-courses-${config.brandSlug}`,
    version: "0.1.0",
  });

  // ── Cursos ────────────────────────────────────────────────────────────────
  server.tool(
    "cursos",
    `Lista los cursos de ${config.brandName}: cada curso es una categoría "Curso *" con sus clases, cruzada con su página de curso (descripción).`,
    {},
    async () => {
      try {
        const [cats, pages] = await Promise.all([
          courseCategories(),
          wp.courses({ per_page: 50 }).then((r) => r.data || []),
        ]);
        const cursos = cats.map((c) => {
          const page = matchCoursePage(c.name, pages);
          return {
            curso: c.name,
            categoria_id: c.id,
            categoria_slug: c.slug,
            num_clases: c.count,
            descripcion: page
              ? plain(page.content?.rendered, 500) ||
                plain(page.excerpt?.rendered, 300)
              : null,
            pagina_curso: page?.link || null,
          };
        });
        return ok({ brand: config.brandName, total: cursos.length, cursos });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Detalle de un curso (descripción + sus clases) ─────────────────────────
  server.tool(
    "curso",
    `Detalle de un curso de ${config.brandName}: descripción + listado de sus clases. Indica la categoría por id, slug o nombre (p.ej. "Curso Claude").`,
    {
      id: z.number().int().positive().optional(),
      slug: z.string().optional(),
      nombre: z.string().optional(),
      limit: z.number().int().min(1).max(config.maxLimit).optional(),
    },
    async ({ id, slug, nombre, limit }) => {
      try {
        const cat = await resolveCategory({ id, slug, query: nombre });
        if (!cat) throw new Error("No encontré ese curso (categoría).");
        const [posts, pages] = await Promise.all([
          wp.posts({
            categories: cat.id,
            per_page: clampLimit(limit ?? config.maxLimit),
            orderby: "date",
            order: "asc",
          }),
          wp.courses({ per_page: 50 }).then((r) => r.data || []),
        ]);
        const page = matchCoursePage(cat.name, pages);
        return ok({
          curso: cat.name,
          categoria_id: cat.id,
          num_clases: cat.count,
          es_curso: isCourseCategory(cat.name),
          descripcion: page ? shapeCourse(page).description : null,
          pagina_curso: page?.link || null,
          clases: (posts.data || []).map((p) => shapeClass(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Clases de un curso ─────────────────────────────────────────────────────
  server.tool(
    "clases",
    `Lista las clases (posts) de un curso de ${config.brandName}. Indica la categoría por id, slug o nombre.`,
    {
      id: z.number().int().positive().optional(),
      slug: z.string().optional(),
      nombre: z.string().optional(),
      limit: z.number().int().min(1).max(config.maxLimit).optional(),
    },
    async ({ id, slug, nombre, limit }) => {
      try {
        const cat = await resolveCategory({ id, slug, query: nombre });
        if (!cat) throw new Error("No encontré ese curso (categoría).");
        const { data } = await wp.posts({
          categories: cat.id,
          per_page: clampLimit(limit ?? config.maxLimit),
          orderby: "date",
          order: "asc",
        });
        return ok({
          curso: cat.name,
          categoria_id: cat.id,
          total: cat.count,
          clases: (data || []).map((p) => shapeClass(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Una clase con su texto completo ────────────────────────────────────────
  server.tool(
    "clase",
    `Devuelve el texto completo (público) de una clase de ${config.brandName}. El vídeo es restringido y no se incluye. Acepta id, slug o url.`,
    {
      id: z.number().int().positive().optional(),
      slug: z.string().optional(),
      url: z.string().url().optional(),
    },
    async ({ id, slug, url }) => {
      try {
        let post;
        if (id) {
          post = (await wp.postById(id)).data;
        } else {
          const s = slug || (url ? url.replace(/\/+$/, "").split("/").pop() : "");
          if (!s) throw new Error("Indica 'id', 'slug' o 'url'.");
          const { data } = await wp.posts({ slug: s });
          post = data?.[0];
        }
        if (!post) throw new Error("Clase no encontrada.");
        return ok(shapeClass(post, { full: true }));
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Buscar clases ──────────────────────────────────────────────────────────
  server.tool(
    "buscar_clases",
    `Busca clases de ${config.brandName} por texto. Opcionalmente dentro de un curso (categoría por id/slug/nombre).`,
    {
      query: z.string().min(1),
      curso: z.string().optional(),
      categoria_id: z.number().int().positive().optional(),
      limit: z.number().int().min(1).max(config.maxLimit).optional(),
    },
    async ({ query, curso, categoria_id, limit }) => {
      try {
        let catId = categoria_id;
        if (!catId && curso) {
          const cat = await resolveCategory({ query: curso });
          catId = cat?.id;
        }
        const { data } = await wp.posts({
          search: query,
          categories: catId,
          per_page: clampLimit(limit),
          orderby: "relevance",
        });
        return ok({
          query,
          curso: curso || null,
          results: (data || []).map((p) => shapeClass(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Últimas clases publicadas ──────────────────────────────────────────────
  server.tool(
    "ultimas_clases",
    `Las últimas clases publicadas en ${config.brandName} (todas las categorías).`,
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
          clases: (data || []).map((p) => shapeClass(p)),
        });
      } catch (e) {
        return fail(e);
      }
    }
  );

  // ── Categorías (curso vs general) ──────────────────────────────────────────
  server.tool(
    "categorias",
    `Lista las categorías de ${config.brandName}, marcando cuáles son cursos y cuáles generales.`,
    {},
    async () => {
      try {
        const { data } = await wp.categories({
          per_page: 100,
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

  // ── Healthcheck ────────────────────────────────────────────────────────────
  server.tool(
    `hello_${config.brandSlug}`,
    `Comprueba que el MCP de cursos de ${config.brandName} responde.`,
    {},
    async () => {
      try {
        const { data } = await wp.courses({ per_page: 1 });
        return ok({
          ok: true,
          brand: config.brandName,
          base_url: config.baseUrl,
          reachable: Array.isArray(data),
          tools: [
            "cursos",
            "curso",
            "clases",
            "clase",
            "buscar_clases",
            "ultimas_clases",
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
