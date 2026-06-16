import dotenv from "dotenv";

// ENV_FILE=.env.otracademia para reutilizar el motor con otro sitio de cursos.
dotenv.config({ path: process.env.ENV_FILE || ".env" });

const num = (name, fallback) => {
  const v = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(v) ? v : fallback;
};

export const config = {
  // Todo público: no hacen falta credenciales. Solo la URL base del WordPress.
  baseUrl: (process.env.WP_BASE_URL || "https://www.codigoadria.com").replace(
    /\/+$/,
    ""
  ),
  brandName: process.env.BRAND_NAME?.trim() || "Código AdrIA",
  brandSlug: (process.env.BRAND_SLUG?.trim() || "codigoadria")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_"),
  // Una categoría es "un curso" si su nombre empieza por este prefijo.
  coursePrefix: process.env.COURSE_CATEGORY_PREFIX?.trim() || "Curso ",
  defaultLimit: num("DEFAULT_LIMIT", 10),
  maxLimit: num("MAX_LIMIT", 50),
};

export function clampLimit(limit) {
  const n = Number.isFinite(limit) ? Math.floor(limit) : config.defaultLimit;
  return Math.max(1, Math.min(config.maxLimit, n));
}

// Una categoría cuenta como curso si empieza por "Curso " (singular + espacio):
// incluye "Curso ChatGPT/Gemini/Claude/IA GRATIS/de Automatizaciones" y deja
// fuera "Cursos Academia…", "General", "Imagen", "IA para empresas".
export function isCourseCategory(name) {
  return /^curso\s/i.test(String(name || ""));
}

// Normaliza un nombre para emparejar categoría-curso con su página (CPT course).
export function normalizeName(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^curso(s)?\b/i, "")
    .replace(/[^a-z0-9]+/g, "");
}
