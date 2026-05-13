# Changelog

Todos los cambios notables a iAmasters OS se documentan aquí.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Próximas versiones (en backlog)
- v0.6.0: skills nativas en español (meeting-notes, proposal-writer, youtube-transcript, linkedin-posts) reescritas con voice profile del operador
- v0.7.0: dashboard del OS (pendiente decidir si se integra con dashboard Sinapsis)
- v1.0.0: release pública estable + vídeos Loom integrados + landing en iamastersacademy.com/os

---

## v0.5.1 — Onboarding profundo y conversacional (2026-05-13)

> **Visión**: el wizard inicial era un formulario disfrazado de conversación (14 preguntas predefinidas, respuestas planas). Esta release lo convierte en una entrevista real adaptativa, con profundización dinámica según las respuestas. Y añade una segunda fase opcional (`meta-deep-dive`) que profundiza 22-25 dimensiones residuales en ~25 min.

### Changed — `meta-onboarding-wizard` reescrita

- **De formulario a entrevista conversacional adaptativa**. Ya no hay preguntas literales en el SKILL.md — solo **8 dimensiones críticas** que el agente cubre dinámicamente.
- **Reglas de profundización explícitas**: cuándo insistir (respuesta corta, abstracta, cifra sin contexto, adjetivo sin ejemplo) vs cuándo pasar (respuesta rica, fatiga del usuario, "no sé" honesto).
- **Repertorio de 6 técnicas conversacionales** en `references/tecnicas-conversacionales.md`: pedir ejemplo concreto, 5 whys ligero (máx 2 niveles), inversión, espejo corto, anclaje temporal, aceptar el "no sé".
- **Anti-formulario explícito** documentado: prohibido numerar preguntas visibles al usuario, anunciar la siguiente pregunta, doble pregunta por turno, tono terapéutico, emojis durante la entrevista, juicio implícito, validación falsa tipo "qué buena pregunta".
- **Definición de "done"** clara por dimensión en `references/dimensiones-express.md` — cada dimensión exige dato sólido (no genérico, no evasivo) antes de cerrar el wizard.
- Tiempo objetivo del express: 10-12 min (sin cambios respecto a versión anterior, pero ahora con info más valiosa por turno).

### Added — `meta-deep-dive` (skill nueva)

- **Segunda fase del onboarding** — opcional pero recomendada al día siguiente del wizard inicial.
- Profundiza **22-25 dimensiones residuales** organizadas en 4 bloques:
  - **A · Persona profunda** (7): horario productivo, interrupciones, contexto vital, motivadores profundos, drenadores, estilo de comunicación con IA, palabras/tonos prohibidos.
  - **B · Negocio profundo** (6): salud financiera (rango), margen, ticket medio, diferencial real, side projects, fricciones del modelo.
  - **C · Equipo y clientes** (6, condicional): tamaño equipo, roles + dinámica, comunicación interna, delegación, clientes top, clientes problemáticos.
  - **D · Foco profundo** (6): decisión pendiente, meta 3 años profesional, meta 3 años vital, miedo profesional, métrica semanal, definición personal de éxito.
- **Idempotente**: si el operador para a la mitad, `operator-state.deepDiveProgress` guarda el avance. Retoma donde se quedó.
- **Branching condicional**: si trabaja solo, el bloque equipo se reduce a 2 dimensiones (clientes top + problemáticos).
- **Checkpoints cada 7 dimensiones**: oportunidad de pausar sin perder progreso.
- Tarda ~25-30 min total.
- Reglas de profundización y técnicas conversacionales idénticas al wizard inicial — `references/tecnicas-conversacionales.md` duplicada para autocontención.

### Added — `/deep-dive` (slash command nuevo)

- Invoca `meta-deep-dive` con detección automática de estado: primera vez vs retomar vs ya completado.
- Avisa si el operador no ha hecho aún el onboarding inicial (lo redirige al wizard).

### Changed — `meta-start-here` actualizada

- Detecta `deepDiveCompleted: false` + `onboardingDate > 12h` y muestra **recordatorio breve** (1 línea) al final del saludo diario hasta que el operador complete la deep-dive.
- No es intrusivo: aparece como PD, no como bloqueo del flow normal.

### Filosofía v0.5.1

- **La diferencia entre output decente y output que parece tuyo está en el contexto que el sistema tiene de ti**. Una entrevista de 14 preguntas planas genera contexto plano. Una entrevista adaptativa de 30+ preguntas dinámicas genera contexto que el sistema puede usar para hablar como tú.
- **Honestidad sobre el coste de tiempo**: el wizard inicial sigue siendo ~10 min (no inflar el primer wow). La deep-dive (~25 min) es opcional, separada, recomendada al día siguiente.
- **No formularios disfrazados**: si el agente termina haciendo las mismas preguntas en el mismo orden a todos los operadores, hemos fallado. La entrevista tiene que sentirse como conversación humana, no como tour guiado.

### Counts post-v0.5.1

| Categoría | v0.5.0 | v0.5.1 |
|---|---:|---:|
| `_meta/` | 9 | **10** (+meta-deep-dive) |
| Resto | 13 | 13 |
| **Total core** | **22** | **23** |
| Opcional | 1 (cognito) | 1 (cognito) |
| Slash commands | 7 | **8** (+`/deep-dive`) |

---

## v0.5.0 — Sistema vivo + skills automation/email/strategy + /aprende (2026-05-13)

> **Visión**: convertir iAmasters OS en un **sistema vivo** que crece con la comunidad. Cierre del feedback de Fernando Montero sobre v0.4.3 con decisiones tomadas explícitamente (vendoreo selectivo, plugins Anthropic vía marketplace, comando educativo `/aprende`).

### Added — Skills nuevas vendoreadas (3, todas MIT con ORIGIN.md)

- **`marketing-email-sequence`** — secuencias welcome/nurture/win-back/lifecycle. Vendoreada de [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT, Corey Haines). Renombrada de `email-sequence` para seguir convención iAmasters OS.
- **`strategy-web-research`** — research profundo multi-fuente con subagentes. Vendoreada de [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) (MIT, LangChain Inc.). Renombrada de `web-research`.
- **`automation-n8n-to-claude`** — migra workflows n8n/Make al ecosistema Claude. Vendoreada del catálogo personal de Angel Aparicio (iAmasters Automations).

### Added — Skill nueva escrita desde cero (1)

- **`automation-n8n-builder`** — crea, valida y despliega workflows n8n desde Claude usando el MCP `n8n-mcp`. Incluye patrones comunes (webhook→procesar→notificar, schedule→leer→reportar, etc.) y guardrails sobre cuándo NO usar n8n.

### Added — Slash command nuevo

- **`/aprende`** — tour interactivo de 5 días para alumnos que empiezan desde cero. Idempotente vía marker en `context/learn-progress.json`. Currículum:
  - **Día 1**: qué es una skill, cómo Claude las activa sola, demo en vivo
  - **Día 2**: brand context (voice, ICP, positioning) — output personal vs genérico
  - **Día 3**: multi-cliente con `/add-client`
  - **Día 4**: catálogo (plugins Anthropic, `/install-skill`, `/install-mcp`)
  - **Día 5**: flujo end-to-end real (reunión → notas → propuesta → email)

### Changed — Cognito mueve a opcional

- **`cognito` movida a `.claude/skills/_meta/_optional/cognito/`**. No se instala automáticamente. Se activa con `/install-skill cognito` cuando el alumno conoce los fundamentos. Razón: feedback de Fernando — para alguien que abre el OS por primera vez, cognito es ruido conceptual.
- **`/install-skill`** ampliado: si el argumento NO es URL sino nombre simple (ej. `cognito`), busca en `_optional/` y activa.
- **`scripts/install.sh`** YA NO copia cognito automáticamente — solo muestra mensaje informativo.

### Changed — tool-visual-explainer mueve a visualization/

- **`tool-visual-explainer`** movida de `tools/` → `visualization/`. Razón: las carpetas `operations/`, `strategy/` y `visualization/` existían vacías en v0.4.3 (bug documental detectado por Fernando). Ahora `visualization/` tiene contenido coherente.

### Changed — Filosofía "Sistema vivo" explícita en README

- Nueva sección 🌱 **Sistema vivo** en README explicando que el catálogo crece con la comunidad (ciclo 4-6 semanas). Refuerza el proceso de propuesta y retirada de skills documentado en `docs/skills-recommended.md`.
- Cadencia esperada de release menor: cada 4-6 semanas con skills validadas por la comunidad.

### Changed — Plugins oficiales Anthropic vía marketplace (NO vendoreados)

- **Decisión legal**: las 4 skills oficiales de Anthropic (`docx`, `xlsx`, `pdf`, `pptx`) tienen licencia **"source-available", NO open source** (verificado en `skills/docx/LICENSE.txt` del repo `anthropics/skills`). **No se pueden redistribuir** en este repo MIT.
- **Solución**: documentar instalación vía marketplace oficial dentro de Claude Code (`/plugin install anthropic-skills`). El usuario las recibe directamente de Anthropic, no de este repo. Ventaja añadida: cuando Anthropic actualiza, el usuario las recibe sin esperar release.
- **Integración**: día 4 del comando `/aprende` guía al alumno paso a paso para activarlas.

### Added — Showcase pre-poblado

- **`projects/_showcase/`** — 4 outputs reales generados con datos sintéticos para que el alumno vea qué tipo de resultado produce el sistema antes de generar el suyo:
  1. **Post LinkedIn** — preview visual simulando LinkedIn nativo
  2. **Secuencia de bienvenida** (5 emails) — HTML interactivo desplegable
  3. **Resumen de reunión kick-off** — HTML con temas, action items y riesgos
  4. **Propuesta comercial** — HTML branded premium estilo Sintaxis Lab
- Caso unificado: consultora ficticia "Marta Sánchez" trabajando con "Logística del Norte SL". Coherencia entre outputs muestra cómo el brand context atraviesa todas las skills.
- Borrable sin afectar nada: `rm -rf projects/_showcase/`.

### Fixed — Inconsistencias documentales detectadas en revisión Fernando

- **`docs/quickstart.md`** ya no menciona skills inexistentes (`operations-meeting-notes`, `strategy-competitor-monitor`). Sustituidas por ejemplos con skills que sí existen.
- **Recuento de skills**: README y CLAUDE.md ahora dicen 22 skills core (era 18 anunciadas pero descuadradas con el sistema real).
- **Carpetas vacías**: `operations/` y `strategy/` ya no son fantasmas — `strategy/` tiene `strategy-web-research`. `operations/` se mantiene vacía hasta v0.6.0 (donde entran las versiones nativas en español).

### Filosofía v0.5.0

- **Vendoreo selectivo, no a ciegas**: de 6 skills sugeridas por Fernando, solo 2 pasaron auditoría (Haiku-evaluated): email-sequence y web-research. Las otras 4 (meeting-notes, proposal-writer, youtube-transcript, linkedin-posts) están en backlog v0.6.0 para reescritura nativa en español con voice profile.
- **Cumplimiento legal explícito**: dos decisiones de licencia tomadas (Sinapsis pasa a MIT por acuerdo con Luis Pitik · skills oficiales Anthropic vía marketplace, no copiadas). Cero zonas grises.
- **Sistema vivo como narrativa**: el repo no es producto cerrado. Cada release menor incorpora 1-3 skills validadas por la comunidad.
- **Educación incluida**: el alumno desde cero tiene un tutorial guiado (`/aprende`) y un showcase de referencia (`projects/_showcase/`). No depende de vídeos externos.

### Counts post-v0.5.0

| Categoría | v0.4.3 | v0.5.0 |
|---|---:|---:|
| `_meta/` | 10 (con cognito) | 9 |
| `_meta/_optional/` | 0 | 1 (cognito) |
| `marketing/` | 5 | 6 (+email-sequence) |
| `automation/` | 0 | 2 (nuevo) |
| `strategy/` | 0 | 1 (nuevo) |
| `tools/` | 4 | 3 (-visual-explainer) |
| `visualization/` | 0 | 1 (+visual-explainer) |
| **Total core** | **18** | **22** |
| Plugins Anthropic | — | 4 (via marketplace) |

---

## v0.4.3 — Plug-and-play conversacional (2026-05-08)

> **Visión**: convertir la instalación de iAmasters OS en una experiencia conversacional. El miembro pega una URL en Claude Code y el sistema sabe qué hacer. Cero terminal manual, primer entregable garantizado en ~15-20 min.

### Added — Skills nuevas

- **`_meta/welcome-quick-win`** — primera tarea garantizada en 5 min tras el onboarding. Pide URL pública del usuario (LinkedIn / web), ejecuta análisis de posicionamiento, genera 3 hooks LinkedIn + plan semana, todo empaquetado en HTML autocontenido y compartible. Es la skill que entrega el "primer wow".
- **`_meta/six-hats`** — método de los 6 sombreros de Edward de Bono. Analiza decisiones desde 6 perspectivas separadas (proceso, datos, riesgos, oportunidades, creatividad, intuición). Universal y útil para cualquier emprendedor que toma decisiones grandes.
- **`_meta/decisions-log`** — diario append-only de decisiones del operador. Inspirado directamente en [`Luispitik/claude-code-second-brain`](https://github.com/Luispitik/claude-code-second-brain) de Luis Pitik (con crédito explícito en SKILL.md y README). Mantiene a Claude coherente entre sesiones.
- **`_meta/health-check`** — diagnóstico completo del OS. Verifica entorno, Sinapsis, brand-context, context sectorizado, skills curadas, settings, API keys. Devuelve reporte 🟢🟡🔴 con auto-fixes.
- **`_meta/cognito`** (wrapper) — Sistema Operativo de Pensamiento de Luis Pitik vendoreado en `vendor/cognito/`. El installer la copia a `~/.claude/skills/cognito/` la primera vez. Mantenida intacta.
- **`_meta/find-skills`** — descoverabilidad. Te ayuda a encontrar skills cuando el catálogo crezca por intent en lenguaje natural.
- **`tools/tool-visual-explainer`** — genera HTML autocontenido y bonito para outputs compartibles (sin JS, móvil-first, paleta naranja iAmasters). Invocada por welcome-quick-win, six-hats, marketing-positioning, etc.

### Added — Slash commands

- **`/doctor`** — invoca `_meta/health-check` con presentación 🟢🟡🔴 + propuesta auto-fix
- (Pendiente v0.5.0: `/welcome` y `/cognito-mode` como aliases explícitos)

### Changed — Refactor crítico

- **`AGENTS.md`** completamente reescrito. Sección principal nueva: "Si eres Claude Code y recibes el prompt URL canónico" con workflow paso-a-paso (clone → install → onboarding → welcome). Sección cross-tool conservada al final.
- **`README.md`** rediseñado con:
  - Sección "🚀 Instalación en 30 segundos" al inicio con prompt URL canónico copy-paste destacado
  - Sección "💰 Coste real" transparente sobre Anthropic Pro/Max ($20-200/mes) — comunicación honesta antes que el miembro choque con la factura
  - Lista de 18 skills core preinstaladas (12 v0.4.2 + 6 nuevas)
  - Renovado bloque créditos con autoría correcta (Luis Pitik, De Bono, Anthropic skills)
- **`scripts/install.sh`** robustecido:
  - Detección OS (macOS / Linux / Windows-bash)
  - Salida estructurada parseable: `[OK]`, `[SKIP]`, `[WARN]`, `[ERROR]` (Claude Code agent puede leer el output y reaccionar)
  - Idempotente: ejecutar varias veces no rompe nada
  - Crea `context/decisions-log.md` con header canónico
  - Crea `projects/welcome/` directorio
  - Step 7 nuevo: copia `vendor/cognito/` a `~/.claude/skills/cognito/` si no existe
- **`meta-onboarding-wizard`** completamente reescrito:
  - Entrevista por bloques temáticos (no todo de golpe — patrón second-brain)
  - Llena 5 archivos sectorizados: `context/me.md`, `work.md`, `team.md`, `current-priorities.md`, `goals.md` (en lugar de `user.md` monolítico)
  - Pregunta cognito mode (guiado / completo) y guarda en operator-state
  - Lanza `welcome-quick-win` al cerrar para garantizar primer wow

### Added — Documentación

- **`docs/skills-recommended.md`** rediseñado:
  - Catálogo Capa 2 con ~30 skills opcionales agrupadas por categoría
  - Sección "Alternativa lean: claude-code-second-brain" con tabla "cuándo elegir uno u otro" — referencia y respeta a Luis
  - Procesos de propuesta y retirada de skills del catálogo
- **`context/README.md`** nuevo, explicando el patrón sectorizado
- **`brand-context/README.md`** explicando qué skill genera cada archivo

### Refactor — context/ sectorizado

- `context/user.md` monolítico → 5 archivos sectorizados creados por el wizard:
  - `me.md` — identidad personal (nombre, ubicación, descripción profesional)
  - `work.md` — negocio, servicios, revenue, stack
  - `team.md` — equipo (puede estar vacío si trabaja solo)
  - `current-priorities.md` — foco del mes, cuello de botella
  - `goals.md` — objetivos 12 meses
- `context/decisions-log.md` nuevo (creado por install.sh con header)
- `context/soul.md` y `context/learnings.md` mantenidos

### Vendored

- **`vendor/cognito/`** — sistema cognito de Luis Pitik vendoreado intacto (sin modificar). Incluye SKILL.md, modes/, phases/, profiles/, hooks/, commands/, integrations/, templates/, config/. Excluido: tests/, .git/, .github/.

### Filosofía v0.4.3

- **No inflar el catálogo**: pasamos de 12 → 18 skills core (todas validadas), no a 19 con sprint a ciegas. Catálogo Capa 2 disponible on-demand.
- **Validación antes que construcción**: el experimento de Sesión 1 (Angel + URL canónico en Claude Desktop limpio) confirmó que el flow funcionará. Sprint v0.5.0 esperará a feedback real de uso, no a planificación a ciegas.
- **Crédito explícito a Luis Pitik**: tres de las skills nuevas (decisions-log inspirada en second-brain, cognito vendoreada intacta, find-skills) referencian a Luis con atribución completa. Coherente con regla de las 6 capas de atribución.

---

## v0.4.2 — Migración a org iamasters-academy + datos finales (2026-05-07)

### Changed
- **Repo migrado**: `angelapaia/iamasters-os` → `iamasters-academy/iamasters-os`
  - Nueva URL: https://github.com/iamasters-academy/iamasters-os
  - GitHub mantiene redirects automáticos del URL anterior
- **Atribución corregida** en todos los archivos del repo:
  - "iAmasters Academy" → "IA Masters Academy" (3 palabras separadas, según logo oficial)
  - Email gmail → `aaparicio@iamastersacademy.com` (corporativo)
  - Copyright `2026` → `2025-2026` (incluye año fundación academia)
  - Añadida entidad legal: AASC Associates (a brand of)
  - Añadido LinkedIn: linkedin.com/in/angel-aparicio92/
  - Añadido GitHub Org link: @iamasters-academy
- **Logo añadido**: `assets/logo.png` (2.4 MB, 1536×1024 PNG RGBA transparente). Mostrado en header del README, header del HTML team-presentation y footer del HTML.
- **README header rediseñado**: logo centrado + título + subtitle + 5 badges centrados.
- **LICENSE** ampliada con sección "Trademark notice" (marcas de AASC Associates).
- **CITATION.cff** version bumpeada a 0.4.2 con URLs actualizadas a la org nueva.

### Added
- **`assets/logo.png`** — logo oficial IA Masters Academy
- **Sweep global** automatizado para reemplazar referencias antiguas en todos los .md, .html, .cff, .json, .sh del repo

### Brand assets central
El logo y futuros assets viven en
`Empresa/01-IA Masters/07-Equipo/brand-assets/iamasters-academy-logo.png`
como fuente única de verdad. Cada repo nuevo lo copia desde ahí siguiendo el
checklist `captacion-shared/07-Equipo/repo-attribution-checklist.md`.

---

## v0.4.1 — Atribución y propiedad (2026-05-07)

### Added
- **LICENSE actualizado** con copyright "© 2026 Angel Aparicio · IA Masters Academy" + sección Authorship & Maintenance + bloque Vendored components clarificando licencia Sinapsis + bloque How to cite
- **README badges** (5): version, license, sinapsis-engine, maintained-by-angel-aparicio, by-iamasters-academy
- **README sección "Sobre el proyecto"** con tabla de autoría + cómo citar + nota de marca + code ownership
- **`.github/CODEOWNERS`** con `* @angelapaia` global + paths específicos
- **`CITATION.cff`** formato académico con datos completos + preferred-citation + referencia a Sinapsis vendored
- **GitHub repo metadata** actualizado: description con atribución, homepage a comunidad iAmasters, 7 topics (claude-code, agentic-os, sinapsis, ai-operator, skills-on-demand, iamasters, castellano)
- **Footer team-presentation.html** con copyright, links propios, nota de marcas

Aplica las 6 capas estándar de atribución documentadas en el repo
compartido del equipo (`captacion-shared/07-Equipo/repo-attribution-checklist.md`).

---

## v0.4.0 — Marketplace local + MCPs curados (2026-05-07)

### Added
- **`/install-skill <github-url>`** comando para instalar skills externas con validación previa:
  - Descarga a `/tmp/iamasters-os-skill-validate-<hash>/`
  - Valida estructura (SKILL.md, YAML frontmatter, name kebab-case, description 50-500 chars)
  - Detecta verbos de intención en description (afecta activación)
  - Comprueba scripts por patrones peligrosos (rm -rf /, eval, dd if=, mkfs, etc.)
  - Detecta credenciales hardcoded (regex API keys, tokens)
  - Comprueba conflicto con skills locales del mismo nombre
  - Output: report con OK/WARN/ERROR + recomendaciones de instalación
- **`/install-mcp <name>`** comando para instalar MCP servers:
  - Lista curada en `docs/mcps-curated.md` (top 5 + 5 útiles + warnings)
  - Configura `.mcp.json` con templates probados
  - Mode custom para URLs no curadas (con warnings)
- **`scripts/validate-skill.sh`** ejecuta toda la validación
- **`docs/mcps-curated.md`** lista mantenida de 10 MCPs útiles para operadores IA:
  - ⭐ Top 5: context7, github, supabase, notion, firecrawl
  - 🔧 Útiles: linear, gmail (read-only), slack, filesystem
  - ⚠️ MCPs a evitar (write redes sociales sin gates, scopes opacos)
  - Patrón de token budget (5-7 MCPs activos máximo)
- **`docs/skills-recommended.md`** lista de skills externas validadas:
  - Anthropic core: skill-creator, visual-explainer, pdf, docx, xlsx
  - Marketing: content-strategy, social-content, email-marketing-bible, ad-creative
  - Operations: marketing-psychology, product-management, saas-revenue-growth-metrics
  - Tech: nextjs-*, vercel-deployment, tailwind-design-system, web-security-audit
  - ⚠️ Skills a evitar (sin description clara, duplicadas, "todo en uno")
- **`docs/multi-client-guide.md`** guía operativa multi-cliente:
  - Cuándo usar / no usar
  - Estructura herencia CLAUDE.md
  - Skills custom por cliente vs skills globales del repo
  - Best practices de seguridad: separación de info entre clientes
  - Troubleshooting típico

### Decisiones de diseño
- Validate-skill.sh siempre crea TMP dir y NO elimina automáticamente (operador puede inspeccionar manualmente)
- Hardcoded secrets detection usa regex permissivo (puede haber falsos positivos, mejor warning que false-negative)
- MCP install no toca .mcp.json sin confirmación explícita del operador
- Curated lists son opinionated: solo skills/MCPs con experiencia real >2 semanas

---

## v0.3.0 — Multi-cliente + scripts de gestión (2026-05-07)

### Added
- **4 templates verticales completos** en `clients/_templates/`:
  - `freelance-ia/` — operador IA solo, ticket 5-50K€/proyecto
  - `agencia-marketing/` — pequeña agencia, MRR recurrente
  - `formador-online/` — coach/educador, ticket 200-2000€
  - `consultoria-b2b/` — high-ticket 30-300K€/engagement
- Cada template incluye: README específico + voice-profile + positioning + ICP + soul + user (template) — 6 archivos × 4 templates = 24 archivos
- **`scripts/add-client.sh`** — crea cliente nuevo desde template o vacío:
  - Valida nombre kebab-case
  - Clona template + reemplaza placeholders `{{CLIENT_NAME}}`
  - Genera `clients/<nombre>/CLAUDE.md` con overrides específicos
  - Output: estructura completa lista para configurar
- **`scripts/update.sh`** — actualiza repo desde upstream con conflict resolution:
  - 4 escenarios manejados: nada cambia / upstream actualiza / local modificó / conflicto
  - Backup automático en `.backup/<timestamp>/` antes de tocar nada
  - User data (brand-context, context, projects, clients, .env) NUNCA se sobrescribe
  - Skills locales modificadas: prompt caso por caso (keep / use upstream / diff / skip)
  - Vendor sinapsis + system files: safe to update

### Notas operativas
- Heredancia CLAUDE.md: el del cliente añade overrides al del raíz, no lo sustituye
- Skills se copian al cliente (no se heredan automáticamente); se sincronizan con `update.sh`
- El operador puede crear skills custom dentro de `clients/<nombre>/.claude/skills/` que sólo aplican a ese cliente

---

## v0.2.0 — Skills marketing core (2026-05-07)

### Added
- **8 skills nuevas** siguiendo patrón canónico del meta-skill-creator:
  - `tool-humanizer` — detector + reescritor anti-AI con `references/ai-tells.md`
  - `tool-output-verifier` — gate 4-checks (humanizer + brand-voice + length + factuality)
  - `tool-firecrawl-scraper` — wrapper Firecrawl con degradación graceful
  - `marketing-brand-voice` — voice profile + 3 registros A/B/C (formal/divulgativo/cercano)
  - `marketing-positioning` — análisis competidores + 3-5 ángulos + recomendación
  - `marketing-icp` — perfil cliente ideal completo con buying triggers + lenguaje + anti-ICP
  - `marketing-copywriting` — generador con voice + register auto + 2-3 variaciones por output
  - `marketing-content-repurposing` — 1 fuente → 5-8 piezas multiplataforma con calendar
- **Patrón de skill collaboration** documentado: copywriting → output-verifier → humanizer
- **Plataform limits reference** mantenido con 30+ plataformas

### Decisiones de diseño
- Todas las skills marketing-* invocan tool-output-verifier obligatoriamente como gate
- Humanizer score thresholds varían por plataforma (email premium ≥8, WhatsApp ≥6)
- Brand voice se compone de 3 registros separados, no 1 generic
- Firecrawl es opcional: si falta API key, fallback a WebFetch con warning

---

## v0.1.0 — esqueleto + Sinapsis (2026-05-07)

**Objetivo**: repo clonable que instale Sinapsis y deje preparada la capa OS para construir encima.

### Added
- Estructura completa de carpetas
- Sinapsis v4.5 vendored en `vendor/sinapsis/`
- `install.sh` que delega a Sinapsis y luego inicializa capa OS
- README, CLAUDE.md, AGENTS.md, LICENSE, .gitignore, .env.example
- Meta-skills v0: `meta-skill-creator`, `meta-onboarding-wizard`, `meta-start-here`, `meta-wrap-up`
- Plantillas vacías de brand-context y context

---

## Versionado de Sinapsis vendored

| iAmasters OS | Sinapsis vendored |
|---|---|
| v0.1.0 | v4.5.0 |

Cuando Sinapsis publique nueva versión upstream, se actualiza vendor con un commit dedicado.
