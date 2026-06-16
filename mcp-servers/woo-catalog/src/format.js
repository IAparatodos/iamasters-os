import { config } from "./config.js";

// Strip HTML and decode a handful of common entities, then trim length.
export function plain(html, max = 280) {
  if (!html) return "";
  const text = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

const names = (arr) =>
  Array.isArray(arr) ? arr.map((t) => t?.name).filter(Boolean) : [];

// ── Whitelist shapers — only frontend-safe fields leave the server ──────────

export function shapeProduct(p) {
  const out = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    url: p.permalink,
    image_url: p.images?.[0]?.src || null,
    gallery: (p.images || []).slice(1).map((i) => i.src),
    type: p.type,
    price: p.price,
    regular_price: p.regular_price,
    sale_price: p.sale_price || null,
    on_sale: !!p.on_sale,
    currency: config.currency,
    categories: names(p.categories),
    tags: names(p.tags),
    average_rating: p.average_rating,
    rating_count: p.rating_count,
    short_description: plain(p.short_description, 200),
    date: p.date_created,
  };
  if (config.exposeStock) out.stock_status = p.stock_status;
  return out;
}

export function shapeProductCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    parent: c.parent || 0,
    count: c.count,
    image_url: c.image?.src || null,
    description: plain(c.description, 160),
  };
}

export function shapePost(p) {
  const media = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  const terms = (p._embedded?.["wp:term"] || []).flat();
  return {
    id: p.id,
    title: plain(p.title?.rendered, 160),
    url: p.link,
    excerpt: plain(p.excerpt?.rendered, 240),
    image_url: media,
    categories: terms
      .filter((t) => t?.taxonomy === "category")
      .map((t) => t.name),
    date: p.date,
  };
}

export function shapePostCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    parent: c.parent || 0,
    count: c.count,
    url: c.link,
    description: plain(c.description, 160),
  };
}
