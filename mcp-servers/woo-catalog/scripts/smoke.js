#!/usr/bin/env node
// Prueba de humo SIN transporte MCP: llama directamente a las APIs con tu .env
// y muestra una muestra de cada dominio. Útil para validar credenciales/red.
//   node scripts/smoke.js
import { config } from "../src/config.js";
import { wc, wp, fetchHtml } from "../src/wp.js";
import {
  shapeProduct,
  shapeProductCategory,
  shapePost,
  shapePostCategory,
} from "../src/format.js";
import { extractFaqFromHtml } from "../src/faq.js";

const line = (t) => console.log(`\n── ${t} ${"─".repeat(Math.max(0, 50 - t.length))}`);

async function main() {
  console.log(`Marca: ${config.brandName}  ·  ${config.baseUrl}`);

  line("producto_actual");
  const prods = await wc.products({ per_page: 1, orderby: "date", order: "desc", status: "publish" });
  const first = prods?.[0];
  console.log(first ? shapeProduct(first) : "(sin productos)");

  line("categorias_productos (top 3)");
  const pcats = await wc.productCategories({ per_page: 3, orderby: "count", order: "desc", hide_empty: true });
  console.log((pcats || []).map(shapeProductCategory));

  line("ultimos_posts (1)");
  const posts = await wp.posts({ per_page: 1, orderby: "date", order: "desc", status: "publish" });
  console.log((posts || []).map(shapePost));

  line("categorias_blog (top 3)");
  const ccats = await wp.categories({ per_page: 3, orderby: "count", order: "desc", hide_empty: true });
  console.log((ccats || []).map(shapePostCategory));

  if (first) {
    line(`faqs del producto ${first.id} (JSON-LD frontend)`);
    try {
      const html = await fetchHtml(first.permalink);
      const faqs = extractFaqFromHtml(html);
      console.log(`${faqs.length} FAQ(s)`, faqs.slice(0, 3));
    } catch (e) {
      console.log(`(faqs no disponibles: ${e.message})`);
    }
  }

  if (config.faqPageUrl) {
    line("faqs generales (FAQ_PAGE_URL, modo por defecto)");
    try {
      const html = await fetchHtml(config.faqPageUrl);
      const faqs = extractFaqFromHtml(html);
      console.log(`${faqs.length} FAQ(s)`, faqs.slice(0, 3).map((f) => f.question));
    } catch (e) {
      console.log(`(faqs generales no disponibles: ${e.message})`);
    }
  }

  console.log("\n✅ Smoke OK");
}

main().catch((e) => {
  console.error("\n❌ Smoke falló:", e.message);
  process.exit(1);
});
