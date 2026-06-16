#!/usr/bin/env node
// Prueba de humo SIN transporte MCP: llama a la REST pública con tu .env.
//   node scripts/smoke.js
import { config } from "../src/config.js";
import { wp } from "../src/wp.js";
import { shapePage, shapePost, shapeCategory } from "../src/format.js";

const line = (t) =>
  console.log(`\n── ${t} ${"─".repeat(Math.max(0, 50 - t.length))}`);

async function main() {
  console.log(`Marca: ${config.brandName}  ·  ${config.baseUrl}`);

  line("paginas (informativas)");
  const pages = await wp.pages({ per_page: 100, status: "publish" });
  const visibles = (pages.data || []).filter(
    (p) => !config.hidePages.includes(String(p.slug).toLowerCase())
  );
  for (const p of visibles.map((x) => shapePage(x)))
    console.log(`  • ${p.title}  → ${p.slug}`);

  line("ultimos_articulos");
  const posts = await wp.posts({ per_page: 3, orderby: "date", order: "desc" });
  for (const p of (posts.data || []).map((x) => shapePost(x)))
    console.log(`  • ${p.title}`);

  line("articulo con texto completo");
  const one = (posts.data || [])[0];
  if (one) {
    const full = shapePost(one, { full: true });
    console.log(`${full.title}\n  chars: ${full.text.length}\n  muestra: ${full.text.slice(0, 140)}…`);
  }

  line("categorias");
  const cats = await wp.categories({ per_page: 10, orderby: "count", order: "desc", hide_empty: true });
  console.log((cats.data || []).map((c) => `${shapeCategory(c).name} (${c.count})`).join(" · "));

  console.log("\n✅ Smoke OK");
}

main().catch((e) => {
  console.error("\n❌ Smoke falló:", e.message);
  process.exit(1);
});
