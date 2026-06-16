import { isCourseCategory } from "./config.js";

// HTML → texto plano legible (quita scripts/estilos/iframes de vídeo y entidades).
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

const featuredImage = (o) =>
  o?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
const embeddedTerms = (o) =>
  (o?._embedded?.["wp:term"] || []).flat().filter(Boolean);

// Página de curso (CPT `courses`).
export function shapeCourse(c) {
  return {
    id: c.id,
    title: plain(c.title?.rendered, 200),
    slug: c.slug,
    url: c.link,
    description:
      plain(c.content?.rendered, 800) || plain(c.excerpt?.rendered, 400),
    image_url: featuredImage(c),
  };
}

// Clase = post. `full:true` incluye el texto largo (público) de la clase.
export function shapeClass(p, { full = false } = {}) {
  const cats = embeddedTerms(p)
    .filter((t) => t.taxonomy === "category")
    .map((t) => t.name);
  const text = plain(p.content?.rendered, full ? 6000 : 0);
  return {
    id: p.id,
    title: plain(p.title?.rendered, 200),
    slug: p.slug,
    url: p.link,
    date: p.date,
    course: cats.find(isCourseCategory) || null,
    categories: cats,
    summary: plain(p.excerpt?.rendered, 320),
    ...(full
      ? {
          text,
          note: "Texto público de la clase. El vídeo es de acceso restringido y no se incluye.",
        }
      : {}),
  };
}

// Categoría con su tipo (curso | general) y nº de clases.
export function shapeCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    tipo: isCourseCategory(c.name) ? "curso" : "general",
    num_clases: c.count,
  };
}
