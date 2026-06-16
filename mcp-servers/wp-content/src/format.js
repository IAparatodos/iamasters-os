// HTML → texto plano legible (quita scripts/estilos/iframes y entidades).
export function plain(html, max = Infinity) {
  if (!html) return "";
  let t = String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(iframe|video)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  t = t
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;|&#039;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "–")
    .replace(/&#8230;/g, "…")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length > max) return t.slice(0, max - 1).trimEnd() + "…";
  return t;
}

const embeddedTerms = (o) =>
  (o?._embedded?.["wp:term"] || []).flat().filter(Boolean);
const featuredImage = (o) =>
  o?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

// Página informativa. `full:true` incluye el texto completo.
export function shapePage(p, { full = false } = {}) {
  return {
    id: p.id,
    title: plain(p.title?.rendered, 200),
    slug: p.slug,
    url: p.link,
    summary: plain(p.excerpt?.rendered, 320) || plain(p.content?.rendered, 320),
    ...(full ? { text: plain(p.content?.rendered, 8000) } : {}),
  };
}

// Artículo del blog. `full:true` incluye el texto completo.
export function shapePost(p, { full = false } = {}) {
  return {
    id: p.id,
    title: plain(p.title?.rendered, 200),
    slug: p.slug,
    url: p.link,
    date: p.date,
    categories: embeddedTerms(p)
      .filter((t) => t.taxonomy === "category")
      .map((t) => t.name),
    image_url: featuredImage(p),
    summary: plain(p.excerpt?.rendered, 320),
    ...(full ? { text: plain(p.content?.rendered, 8000) } : {}),
  };
}

export function shapeCategory(c) {
  return { id: c.id, name: c.name, slug: c.slug, num_articulos: c.count };
}
