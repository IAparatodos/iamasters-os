import dotenv from "dotenv";

// Allow ENV_FILE=.env.solidker to swap brands without touching code.
dotenv.config({ path: process.env.ENV_FILE || ".env" });

function required(name) {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env y rellénala.`
    );
  }
  return v.trim();
}

const num = (name, fallback) => {
  const v = parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(v) ? v : fallback;
};

export const config = {
  baseUrl: required("WP_BASE_URL").replace(/\/+$/, ""),
  username: required("WP_USERNAME"),
  appPassword: required("WP_APP_PASSWORD"),
  brandName: process.env.BRAND_NAME?.trim() || "Tienda",
  brandSlug: (process.env.BRAND_SLUG?.trim() || "tienda")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_"),
  defaultLimit: num("DEFAULT_LIMIT", 5),
  maxLimit: num("MAX_LIMIT", 20),
  exposeStock: String(process.env.EXPOSE_STOCK).toLowerCase() === "true",
  currency: process.env.CURRENCY?.trim() || "EUR",
  // Página general de FAQs (schema FAQPage). Fuente por defecto de la tool `faqs`
  // cuando no se pasa id ni url. Vacío = sin página general.
  faqPageUrl: process.env.FAQ_PAGE_URL?.trim().replace(/\/+$/, "") || "",
};

export function clampLimit(limit) {
  const n = Number.isFinite(limit) ? Math.floor(limit) : config.defaultLimit;
  return Math.max(1, Math.min(config.maxLimit, n));
}
