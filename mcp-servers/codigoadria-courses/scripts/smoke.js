#!/usr/bin/env node
// Prueba de humo SIN transporte MCP: llama a la REST pública con tu .env y
// muestra una muestra de cada dominio. Valida red + estructura de cursos.
//   node scripts/smoke.js
import { config, isCourseCategory, normalizeName } from "../src/config.js";
import { wp, resolveCategory } from "../src/wp.js";
import { shapeClass, shapeCategory } from "../src/format.js";

const line = (t) =>
  console.log(`\n── ${t} ${"─".repeat(Math.max(0, 50 - t.length))}`);

async function main() {
  console.log(`Marca: ${config.brandName}  ·  ${config.baseUrl}`);

  // Sanidad del normalizador de acentos (no debe romper).
  console.log(
    "normalizeName('Curso Código AdrIA') →",
    normalizeName("Curso Código AdrIA")
  );

  line("categorias (curso vs general)");
  const cats = await wp
    .categories({ per_page: 100, orderby: "count", order: "desc", hide_empty: true })
    .then((r) => r.data || []);
  for (const c of cats.map(shapeCategory))
    console.log(`  [${c.tipo === "curso" ? "CURSO" : "gen. "}] ${c.name} (${c.num_clases})`);

  const courseCats = cats.filter((c) => isCourseCategory(c.name));
  line(`cursos detectados: ${courseCats.length}`);
  console.log(courseCats.map((c) => c.name).join(" · "));

  line("curso → clases (primer curso)");
  const first = courseCats[0];
  if (first) {
    const posts = await wp.posts({
      categories: first.id,
      per_page: 3,
      orderby: "date",
      order: "asc",
    });
    console.log(`Curso: ${first.name} (${first.count} clases)`);
    for (const p of (posts.data || []).map((x) => shapeClass(x)))
      console.log(`  • ${p.title}  → ${p.url}`);
  }

  line("clase con texto completo (1ª del primer curso)");
  if (first) {
    const one = (await wp.posts({ categories: first.id, per_page: 1, orderby: "date", order: "asc" })).data?.[0];
    if (one) {
      const full = shapeClass(one, { full: true });
      console.log(`${full.title}\n  curso: ${full.course}\n  texto (chars): ${full.text.length}\n  muestra: ${full.text.slice(0, 140)}…`);
    }
  }

  line("resolveCategory('Claude')");
  const r = await resolveCategory({ query: "Claude" });
  console.log(r ? `→ [${r.id}] ${r.name} (${r.count} clases)` : "(no encontrada)");

  console.log("\n✅ Smoke OK");
}

main().catch((e) => {
  console.error("\n❌ Smoke falló:", e.message);
  process.exit(1);
});
