import dotenv from "dotenv";

// ENV_FILE=.env.otra para reutilizar el motor con otro sitio de contenido WP.
dotenv.config({ path: process.env.ENV_FILE || ".env" });

const num = (name, fallback) => {
  const v = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(v) ? v : fallback;
};

export const config = {
  // Todo público: sin credenciales. Solo la URL base del WordPress.
  baseUrl: (process.env.WP_BASE_URL || "https://www.solidker.com").replace(
    /\/+$/,
    ""
  ),
  brandName: process.env.BRAND_NAME?.trim() || "Solidker",
  brandSlug: (process.env.BRAND_SLUG?.trim() || "solidker")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_"),
  // Slugs de páginas a ocultar en `paginas` (legales, índice de blog…).
  hidePages: (process.env.HIDE_PAGES || "privacy-policy,aviso-legal,blog")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  defaultLimit: num("DEFAULT_LIMIT", 10),
  maxLimit: num("MAX_LIMIT", 50),
};

export function clampLimit(limit) {
  const n = Number.isFinite(limit) ? Math.floor(limit) : config.defaultLimit;
  return Math.max(1, Math.min(config.maxLimit, n));
}
