import { config } from "./config.js";

// Todo se lee de la REST pública de WordPress — sin credenciales. El vídeo de
// cada clase está restringido en el front; aquí solo tocamos el texto público.
async function get(path, params) {
  const url = new URL(`${config.baseUrl}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "")
        url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "codigoadria-courses-mcp/0.1 (+public-rest)",
    },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const msg = json?.message || text?.slice(0, 160) || res.statusText;
    throw new Error(`WP GET ${path} → ${res.status}: ${msg}`);
  }
  return {
    data: json,
    total: parseInt(res.headers.get("x-wp-total") || "", 10) || undefined,
  };
}

export const wp = {
  // Páginas de curso (CPT `courses`) — descripción comercial del curso.
  courses: (params) =>
    get("/wp-json/wp/v2/courses", { _embed: "1", ...params }),
  courseById: (id) =>
    get(`/wp-json/wp/v2/courses/${id}`, { _embed: "1" }),
  // Clases = posts. El temario de un curso son los posts de su categoría.
  posts: (params) => get("/wp-json/wp/v2/posts", { _embed: "1", ...params }),
  postById: (id) => get(`/wp-json/wp/v2/posts/${id}`, { _embed: "1" }),
  // Categorías: las "Curso *" agrupan las clases de cada curso.
  categories: (params) => get("/wp-json/wp/v2/categories", params),
};

// Resuelve una categoría a partir de id, slug o texto del nombre.
export async function resolveCategory({ id, slug, query }) {
  if (id) {
    const { data } = await wp.categories({ include: id });
    return Array.isArray(data) ? data[0] : data;
  }
  if (slug) {
    const { data } = await wp.categories({ slug });
    return data?.[0] || null;
  }
  if (query) {
    const { data } = await wp.categories({ search: query, per_page: 100 });
    if (!data?.length) return null;
    // Prefiere coincidencia exacta de nombre; si no, la más poblada.
    const exact = data.find(
      (c) => c.name.toLowerCase() === String(query).toLowerCase()
    );
    return exact || data.sort((a, b) => b.count - a.count)[0];
  }
  return null;
}
