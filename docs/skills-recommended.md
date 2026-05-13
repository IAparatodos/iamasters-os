# Skills recomendadas — Capa 2 (on-demand)

Las **18 skills core** que vienen preinstaladas con iAmasters OS están en el README. Este documento lista las **skills opcionales** que puedes añadir cuando las necesites con `/install-skill <github-url>`.

> **Filosofía**: max 30 skills, no 1000. Inflar el catálogo paraliza al miembro nuevo. Esta lista es **curada y opinada** — solo skills validadas en producción ≥2 semanas. No es exhaustiva ni inclusiva.

> Última revisión: 2026-05-08 (v0.4.3)

---

## Cómo instalar una skill de esta lista

```
# Dentro de Claude Code en tu repo iAmasters OS:
/install-skill https://github.com/<owner>/<skill-repo>
```

El comando:
1. Clona la skill a `.claude/skills/<categoria>/<nombre>/` localmente
2. Valida estructura (SKILL.md presente, YAML frontmatter, descripción ≥50 chars)
3. Te pregunta si quieres globalizarla a `~/.claude/skills/` (skill compartida entre repos)

---

## Marketing — texto y campañas

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `copywriting` | Copy de landing pages y emails con humanizer gate y validación de no-fabricación | ⭐ Fácil |
| `copy-editing` | Edita y mejora copy existente, proofreading, sweep de claridad | ⭐ Fácil |
| `content-strategy` | Plan de contenido (qué escribir, frecuencia, distribución) | ⭐⭐ Media |
| `email-sequence` | Drip campaigns, secuencias de bienvenida, lifecycle, abandoned cart | ⭐⭐ Media |
| `email-marketing-bible` | Knowledge base de email marketing (908 fuentes, 4.798 insights) | ⭐ Fácil |
| `social-content` | LinkedIn, X/Twitter, Instagram, TikTok, Facebook | ⭐ Fácil |
| `ad-creative` | Variaciones de copy de ads (headlines, descriptions, primary text) | ⭐⭐ Media |
| `launch-strategy` | Plan de lanzamiento de producto, feature, beta, ProductHunt | ⭐⭐⭐ Avanzada |
| `paid-ads` | Google Ads, Meta, LinkedIn, X — campañas, ROAS, CPA | ⭐⭐⭐ Avanzada |
| `cold-email` | B2B prospecting emails con follow-ups | ⭐⭐ Media |

## CRO — conversión

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `page-cro` | Optimizar homepage, landing, pricing, feature pages | ⭐⭐ Media |
| `form-cro` | Formularios contacto/lead/demo (NO signup) | ⭐⭐ Media |
| `signup-flow-cro` | Optimización registration / signup / trial activation | ⭐⭐⭐ Avanzada |
| `popup-cro` | Modales, exit-intent, banners, slide-ins | ⭐⭐ Media |
| `paywall-upgrade-cro` | Paywalls, upgrade screens, upsells, feature gates | ⭐⭐⭐ Avanzada |
| `onboarding-cro` | Activación post-signup, time-to-value | ⭐⭐⭐ Avanzada |
| `ab-test-setup` | Diseñar e implementar A/B tests | ⭐⭐ Media |

## SEO

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `seo-audit` | Audit técnico SEO completo | ⭐⭐ Media |
| `ai-seo` | AEO/GEO/LLMO — optimizar para citaciones de LLMs | ⭐⭐ Media |
| `schema-markup` | JSON-LD, structured data, rich snippets | ⭐⭐⭐ Avanzada |
| `programmatic-seo` | Páginas SEO a escala con templates + datos | ⭐⭐⭐ Avanzada |

## Estrategia y producto

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `pricing-strategy` | Decisiones de precio, packaging, freemium, free trial | ⭐⭐ Media |
| `referral-program` | Programas de referidos, afiliados, viral loops | ⭐⭐ Media |
| `product-marketing-context` | Document de positioning, ICP, foundational context | ⭐⭐ Media |
| `marketing-ideas` | Generación de ideas de marketing y growth | ⭐ Fácil |
| `marketing-psychology` | Aplicar principios psicológicos a marketing | ⭐⭐ Media |
| `churn-prevention` | Cancellation flows, save offers, recovery | ⭐⭐⭐ Avanzada |
| `revops` | Lead lifecycle, marketing-to-sales handoff, scoring | ⭐⭐⭐ Avanzada |
| `sales-enablement` | Pitch decks, one-pagers, objection handling | ⭐⭐ Media |
| `running-marketing-campaigns` | Plan completo end-to-end de campañas | ⭐⭐⭐ Avanzada |

## Analítica y crecimiento

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `analytics-tracking` | GA4, conversion tracking, UTMs, event tracking | ⭐⭐ Media |
| `saas-revenue-growth-metrics` | ARPU, MRR, ARR, churn, NRR, expansion, cohorts | ⭐⭐ Media |
| `competitive-ads-extractor` | Extraer ads de competidores (Facebook/LinkedIn ad library) | ⭐⭐ Media |
| `competitor-alternatives` | Páginas comparativa "X vs Y" para SEO + sales | ⭐⭐ Media |
| `free-tool-strategy` | Free tools como growth driver | ⭐⭐⭐ Avanzada |

## Operaciones (de plugin externo `operations:*`)

Estas skills vienen del plugin `operations:*` de la suite de Cowork. Disponibles si tienes el plugin instalado:

- `operations:process-optimization` — analizar y mejorar procesos
- `operations:runbook` — crear runbooks operacionales
- `operations:status-report` — reportes con KPIs, riesgos, action items
- `operations:risk-assessment` — identificar y mitigar riesgos
- `operations:capacity-plan` — planificación de capacidad
- `operations:vendor-review` — evaluación de proveedores
- `operations:change-request` — solicitudes de cambio con análisis impacto
- `operations:compliance-tracking` — tracking compliance + audit prep
- `operations:process-doc` — documentación de procesos (RACI, SOPs)

## Tooling y archivos (oficiales Anthropic)

| Skill | Para qué | Dificultad |
|---|---|:-:|
| `anthropic-skills:docx` | Crear, leer, editar Word docs | ⭐ Fácil |
| `anthropic-skills:xlsx` | Manipular spreadsheets (xlsx, xlsm, csv, tsv) | ⭐ Fácil |
| `anthropic-skills:pptx` | Crear y editar presentaciones | ⭐ Fácil |
| `anthropic-skills:pdf` | Leer, combinar, dividir, marcar PDFs | ⭐ Fácil |

> Las 4 skills de manejo de archivos office vienen oficialmente desde Anthropic. Recomendación: instalarlas SIEMPRE que el operador trabaje con clientes que mandan Excel/Word/PDF/PPT (mayoría).

## Para sectores específicos

Si la lista de skills no cubre tu vertical, mira si hay plantilla más específica:

- **Médicos / Dental**: combinar `web-legal-audit` para RGPD + plantilla para clínicas
- **Inmobiliarias**: combinar `programmatic-seo` + skills de local SEO
- **B2B SaaS**: combinar `revops` + `saas-revenue-growth-metrics` + `pricing-strategy`
- **E-commerce**: combinar `paywall-upgrade-cro` + `email-sequence` + `analytics-tracking`
- **Educación / Formación online**: combinar `email-sequence` (cohortes) + `launch-strategy` (cada lanzamiento) + `churn-prevention` (retención)

---

## Alternativa lean: claude-code-second-brain

Si **prefieres empezar más minimal** (sin clonar todo iAmasters OS), existe una alternativa más liviana del mismo autor de Sinapsis:

> 🧠 **[claude-code-second-brain](https://github.com/Luispitik/claude-code-second-brain)** por [Luis Pitik](https://github.com/Luispitik)
>
> Pegas un prompt en Claude Code → te entrevista por secciones → genera un sistema de archivos persistente: CLAUDE.md master + `context/me.md, work.md, team.md, current-priorities.md, goals.md` + `decisions-log.md`. **Es la versión lean** de lo que hace iAmasters OS.

### Cuándo elegir uno u otro

| Caso | Mejor opción |
|---|---|
| Quieres empezar minimal, sin skills curadas | **second-brain** |
| Quieres skills marketing/CRO/SEO ya instaladas | **iamasters-os** |
| Trabajas con múltiples clientes con brand context distinta | **iamasters-os** (templates verticales) |
| Solo necesitas memoria persistente | **second-brain** |
| Quieres comunidad + actualizaciones curadas | **iamasters-os** |
| Eres muy técnico y quieres rolar tu propio sistema | **second-brain** + tus skills propias |

iAmasters OS adopta el patrón de "context sectorizado + decisions-log" de second-brain con crédito explícito. Son productos hermanos del mismo autor (Luis), no competencia.

---

## Cómo proponer una skill nueva al catálogo

Si has creado o encontrado una skill que crees que merece estar en este catálogo:

1. Asegúrate de que cumple los criterios:
   - Sirve a ≥3 avatares iAmasters
   - Output útil sin contexto previo del operador
   - No depende de integraciones privadas (Skool, Wixin, etc.)
   - No depende de información confidencial
   - Validada en producción ≥2 semanas

2. Abre un issue o PR en [`iamasters-academy/iamasters-os`](https://github.com/iamasters-academy/iamasters-os) con:
   - Link a la skill
   - 1-2 ejemplos de uso real
   - Categoría sugerida
   - Por qué encaja en Capa 2

3. El maintainer (Angel) la revisa. Las que pasan se añaden al catálogo en próxima release.

## Cómo retirar una skill del catálogo

Si una skill se vuelve obsoleta, deprecated, o el autor la abandona, abre un issue. Las skills en este catálogo se renuevan trimestralmente.
