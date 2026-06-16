import { config } from "./config.js";

// Single server-side credential (WP Application Password) authenticates the
// three read paths we use: WooCommerce REST v3, WP REST v2, and the
// wp-abilities run route (for FAQ meta). Consumers never see it.
const authHeader =
  "Basic " +
  Buffer.from(`${config.username}:${config.appPassword}`).toString("base64");

async function request(path, { params, method = "GET", body } = {}) {
  const url = new URL(`${config.baseUrl}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg = json?.message || text?.slice(0, 200) || res.statusText;
    throw new Error(`WP ${method} ${path} → ${res.status}: ${msg}`);
  }
  return json;
}

// ── WooCommerce ────────────────────────────────────────────────────────────
export const wc = {
  products: (params) => request("/wp-json/wc/v3/products", { params }),
  productById: (id) => request(`/wp-json/wc/v3/products/${id}`),
  productCategories: (params) =>
    request("/wp-json/wc/v3/products/categories", { params }),
};

// ── WordPress core ─────────────────────────────────────────────────────────
export const wp = {
  posts: (params) =>
    request("/wp-json/wp/v2/posts", { params: { _embed: "1", ...params } }),
  postById: (id) => request(`/wp-json/wp/v2/posts/${id}`),
  categories: (params) => request("/wp-json/wp/v2/categories", { params }),
  pageById: (id) => request(`/wp-json/wp/v2/pages/${id}`),
};

// Public page fetch (no auth) — used to read FAQPage JSON-LD from the frontend.
export async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "woo-catalog-mcp/0.1 (+frontend-faq)" },
  });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}
