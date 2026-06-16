import { config } from "./config.js";

// REST pública de WordPress — sin credenciales.
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
      "User-Agent": "wp-content-mcp/0.1 (+public-rest)",
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
  posts: (params) => get("/wp-json/wp/v2/posts", { _embed: "1", ...params }),
  postById: (id) => get(`/wp-json/wp/v2/posts/${id}`, { _embed: "1" }),
  pages: (params) => get("/wp-json/wp/v2/pages", { _embed: "1", ...params }),
  pageById: (id) => get(`/wp-json/wp/v2/pages/${id}`, { _embed: "1" }),
  categories: (params) => get("/wp-json/wp/v2/categories", params),
};

// Resuelve un post/página por id, slug o url.
export async function resolveContent(kind, { id, slug, url }) {
  const api = kind === "pagina" ? wp.pages : wp.posts;
  const byId = kind === "pagina" ? wp.pageById : wp.postById;
  if (id) return (await byId(id)).data;
  const s = slug || (url ? url.replace(/\/+$/, "").split("/").pop() : "");
  if (!s) throw new Error("Indica 'id', 'slug' o 'url'.");
  const { data } = await api({ slug: s });
  return data?.[0] || null;
}

// Resuelve una categoría por id, slug o texto.
export async function resolveCategory({ id, slug, query }) {
  if (id) return (await wp.categories({ include: id })).data?.[0] || null;
  if (slug) return (await wp.categories({ slug })).data?.[0] || null;
  if (query) {
    const { data } = await wp.categories({ search: query, per_page: 100 });
    if (!data?.length) return null;
    const exact = data.find(
      (c) => c.name.toLowerCase() === String(query).toLowerCase()
    );
    return exact || data.sort((a, b) => b.count - a.count)[0];
  }
  return null;
}
