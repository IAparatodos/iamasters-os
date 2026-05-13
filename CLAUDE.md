# iAmasters OS — CLAUDE.md (project root)

> Sistema operativo agéntico para operadores de IA.
> Sinapsis v4.5 (engine) + capa OS (brand context, agent context, skills curadas, multi-cliente).

## Session Entry — EXECUTE ON FIRST MESSAGE OF EVERY SESSION

### Paths absolutos (relativos a este repo)
- **Skills del OS**: `.claude/skills/`
- **Commands del OS**: `.claude/commands/`
- **Brand context**: `brand-context/` (voice, positioning, ICP, assets)
- **Agent context sectorizado**: `context/` (me.md, work.md, team.md, current-priorities.md, goals.md, decisions-log.md, learnings.md, soul.md)
- **Proyectos**: `projects/` (por skill, `projects/briefs/<nombre>/`, `projects/welcome/`, `projects/six-hats/`, `projects/visual/`)
- **Clientes**: `clients/<nombre>/` (con `clients/_templates/` para nuevos)
- **Docs operativos**: `docs/`
- **Vendored**: `vendor/sinapsis/` (engine de memoria), `vendor/cognito/` (sistema operativo de pensamiento de Luis Pitik)

### Paths Sinapsis (engine global del operador)
- **Skills root global**: `~/.claude/skills/` (Sinapsis instalado por install.sh)
- **Operator state**: `~/.claude/skills/_operator-state.json` (perfil del operador)
- **Instincts**: `~/.claude/skills/_instincts-index.json` (lo aprendido)
- **Daily summaries**: `~/.claude/skills/_daily-summaries/`
- **Catalog**: `~/.claude/skills/_catalog.json`

### MANDATORY first action
Antes de responder al primer mensaje del usuario, debes:

1. Leer `~/.claude/skills/_operator-state.json` (Sinapsis: perfil del operador, decisiones, lecciones).
2. Leer los 5 archivos sectorizados de `context/` si existen: `me.md`, `work.md`, `team.md`, `current-priorities.md`, `goals.md` (capa OS).
3. Leer `context/decisions-log.md` (últimas 5 entradas) para mantener coherencia con decisiones previas.
4. Comprobar `synapsis-bridge` siguiente:

### Detección de primer arranque (onboarding)
Si `~/.claude/skills/_operator-state.json` NO existe o tiene `needsOnboarding: true`:
- → invoca la skill `meta-onboarding-wizard` que está en `.claude/skills/_meta/meta-onboarding-wizard/`.

Si existe pero `context/me.md` NO existe (o está vacío):
- → invoca `meta-onboarding-wizard` para llenar el contexto sectorizado.

Si existe `context/me.md` pero `~/.claude/skills/_operator-state.json` tiene `welcomeCompleted: false`:
- → invoca `welcome-quick-win` para entregar el primer wow del usuario.

Si existe pero `brand-context/voice/voice-profile.md` NO existe:
- → invoca `meta-start-here` para arrancar el flujo de brand context.

Si todo está creado:
- → ejecuta el ritual normal de `/start-here` (resumen del día anterior + propuesta de tarea).

### Session continuity (operativa diaria)
Cuando todo está configurado:
1. Lee `synapsis/daily-summaries/<TODAY>.md` o `<YESTERDAY>.md` (Sinapsis daily summary multi-proyecto)
2. Lee `context/learnings.md` (capa OS: feedback consolidado de skills)
3. Comprueba si hay proyectos abiertos en `projects/briefs/*/brief.md` con `status: active`
4. Saluda con: "Ayer dejaste X. Sigues con Y o cambias?"

## Sobre el sistema

### Sinapsis (engine de memoria)
Sinapsis es el sistema que hace que Claude Code aprenda de ti. Vive instalado en `~/.claude/` (no en este repo). El repo lo trae vendored en `vendor/sinapsis/` para instalación.

Sinapsis te da:
- **Operator state**: tu identidad, stack, decisiones — persiste en TODOS los proyectos que abras
- **Instincts**: patrones aprendidos que se inyectan automáticamente cuando aplican
- **Passive rules**: guardrails técnicos (seguridad, calidad, workflow)
- **Skills on-demand**: solo carga las skills relevantes (~2.800 tokens vs ~25.000)
- **Dream cycle**: limpieza periódica de memoria (duplicados, stale, contradicciones)
- **Dashboard** (`/dashboard-sinapsis`): métricas reales del sistema

Comandos Sinapsis útiles (instalados global):
- `/system-status` — estado general
- `/evolve` — graduar instinct draft → confirmed → permanent
- `/instinct-status` — instincts activos por dominio
- `/passive-status` — reglas pasivas
- `/eod` — resumen end-of-day multi-proyecto
- `/dream` — ciclo de hygiene de memoria
- `/analyze-session` — review de propuestas aprendidas

### Capa OS (este repo)
Lo que aporta este repo encima de Sinapsis:

**Brand Context (`brand-context/`)** — estática, una sola vez:
- Voice profile + 3 registros (A formal / B divulgativo / C cercano)
- Positioning (ángulo, mercado, diferencial)
- ICP (cliente ideal, lenguaje, buying triggers)
- Brand assets (logos, colores, fuentes — Firecrawl scraping)

**Agent Context (`context/`)** — dinámica, evoluciona:
- `soul.md` — personalidad del agente (cómo respondes)
- `user.md` — el operador en contexto del repo (preferencias visuales en docs, ejemplos del día a día)
- `learnings.md` — feedback consolidado de skills

**Skills curadas (`.claude/skills/`)** — 23 skills core por categoría:
- `_meta/` — sistema (skill-creator, onboarding-wizard, **deep-dive**, start-here, wrap-up, welcome-quick-win, six-hats, decisions-log, health-check, find-skills)
- `_meta/_optional/` — cognito (activable on-demand)
- `marketing/` — brand-voice, positioning, icp, copywriting, content-repurposing, email-sequence
- `automation/` — n8n-to-claude, n8n-builder
- `strategy/` — web-research
- `tools/` — humanizer, firecrawl-scraper, output-verifier
- `visualization/` — visual-explainer

Skills oficiales Anthropic (`docx`, `xlsx`, `pdf`, `pptx`): NO se vendorean (licencia source-available). Se instalan vía `/plugin install anthropic-skills` en Claude Code. El comando `/aprende` día 4 lo guía.

**Niveles de proyecto**:
1. **Single task** — pregunta directa. Output a `projects/<skill-name>/<fecha>-<titulo>/`.
2. **Planned project** — scoping conversation. Output a `projects/briefs/<nombre>/` con `brief.md`.
3. **GSD project** — multi-fase. `.planning/` en el cliente o raíz. Una a la vez.

**Multi-cliente**:
- `clients/<nombre>/` con su propio brand-context, context, projects
- Skills se copian del root al cliente en cada update (no se heredan, sí se sincronizan)
- `CLAUDE.md` se hereda del repo raíz; cliente puede añadir override en `clients/<nombre>/CLAUDE.md`
- Templates en `clients/_templates/` para cuatro verticales

## Skills registry (auto-mantenido)

Lista canónica de skills instaladas en este repo (Capa 1, v0.5.0 = 23 skills core + 1 opcional):

<!-- skills-registry-start -->

### `_meta/` — sistema (10)

| Skill | Descripción corta |
|---|---|
| `meta-skill-creator` | Crea skills nuevas siguiendo el patrón canónico |
| `meta-onboarding-wizard` | Entrevista express conversacional adaptativa (8 dimensiones críticas) tras instalar |
| `meta-deep-dive` | Entrevista profunda (22-25 dimensiones) conversacional adaptativa — segunda fase del onboarding |
| `meta-start-here` | Ritual diario de inicio |
| `meta-wrap-up` | Ritual diario de cierre |
| `welcome-quick-win` | Primera tarea garantizada en 5 min — el "primer wow" |
| `six-hats` | Método 6 sombreros de Edward de Bono |
| `decisions-log` | Diario append-only de decisiones (inspirado en second-brain de Luis) |
| `health-check` | Diagnóstico del OS — invocada vía `/doctor` |
| `find-skills` | Descoverabilidad de skills por intent en lenguaje natural |

### `_meta/_optional/` — activables on-demand (1)

| Skill | Cómo activar |
|---|---|
| `cognito` | `/install-skill cognito` — Sistema Operativo de Pensamiento de Luis Pitik |

### `marketing/` — voz, contenido y conversión (6)

| Skill | Descripción corta |
|---|---|
| `marketing-brand-voice` | Voice profile + 3 registros A/B/C |
| `marketing-positioning` | Análisis de posicionamiento competitivo |
| `marketing-icp` | Cliente ideal: dolores, lenguaje, buying triggers |
| `marketing-copywriting` | Copy con humanizer gate obligatorio |
| `marketing-content-repurposing` | Distribución multiplataforma |
| `marketing-email-sequence` | Secuencias de email (welcome, nurture, win-back, lifecycle) — vendoreada de coreyhaines31/marketingskills (MIT) |

### `automation/` — automatización y migración (2)

| Skill | Descripción corta |
|---|---|
| `automation-n8n-to-claude` | Migra workflows n8n/Make al ecosistema Claude (autor: Angel · iAmasters) |
| `automation-n8n-builder` | Crea workflows n8n desde Claude usando MCP `n8n-mcp` |

### `strategy/` — investigación y estrategia (1)

| Skill | Descripción corta |
|---|---|
| `strategy-web-research` | Research profundo con subagentes — vendoreada de langchain-ai/deepagents (MIT) |

### `tools/` — utilidades transversales (3)

| Skill | Descripción corta |
|---|---|
| `tool-firecrawl-scraper` | Wrapper Firecrawl con fallback manual |
| `tool-humanizer` | Quita patrones AI-tell del output |
| `tool-output-verifier` | Gate de calidad (humanizer + voice + length) antes de entregar |

### `visualization/` — outputs compartibles (1)

| Skill | Descripción corta |
|---|---|
| `tool-visual-explainer` | Genera HTML autocontenido compartible (sin JS, móvil-first) |

### Plugins Anthropic (instalación vía marketplace)

| Skill | Cómo activar |
|---|---|
| `docx`, `xlsx`, `pdf`, `pptx` | `/plugin install anthropic-skills` dentro de Claude Code. NO se vendorean (licencia source-available). El comando `/aprende` día 4 te guía. |

### Slash commands

`/start-here` · `/wrap-up` · `/doctor` · `/add-client` · `/install-skill` · `/install-mcp` · `/aprende` · `/deep-dive`

### Capa 2 — on-demand library

Ver [`docs/skills-recommended.md`](docs/skills-recommended.md) para ~30 skills opcionales (marketing, CRO, SEO, estrategia, operations) instalables vía `/install-skill <github-url>`.

<!-- skills-registry-end -->

## Niveles de proyecto — heartbeat

Al iniciar cada sesión, comprueba `projects/briefs/*/brief.md`:
- Si hay `status: active`, recuérdale al usuario qué dejó abierto.
- Si hay un `.planning/` en raíz o en algún cliente, indica que hay un GSD project en marcha.
- Si terminó algo (`status: done`), pregunta si lo archivamos.

## Cómo registrar skills nuevas (auto)

Cuando se añade una skill nueva en `.claude/skills/<categoria>/<nombre>/`:
- `/start-here` la detecta y registra en `synapsis/skills-catalog.json`
- `/wrap-up` actualiza el registry de este CLAUDE.md
- El comando `/install-skill <github-url>` la valida antes de añadirla

Si una skill se elimina:
- `/start-here` lo detecta y propone limpiar referencias en CLAUDE.md, README, etc.

## Permisos (recordatorio)

`.claude/settings.json` viene con permisos seguros por defecto:
- ✅ Read files, run dev server, git operations, edit files dentro del repo
- ❌ Install packages globalmente, delete files, send to internet, leer .env

Si necesitas más permisos: `claude` con `--dangerously-skip-permissions` (solo para tareas isoladas) o edita `settings.json`.

## Idioma

- **Operativa con el usuario**: castellano por defecto
- **Comentarios técnicos en código**: inglés (estándar dev)
- **Commits**: conventional commits en inglés
- **Outputs entregables al cliente**: en el idioma del cliente (detectar de su brand-context)

## Convenciones del repo

- Carpetas en kebab-case (`brand-context`, `clients`, `projects`)
- Archivos markdown en kebab-case con extensión `.md`
- Skills en kebab-case con prefijo de categoría: `marketing-brand-voice`, `tool-humanizer`, `meta-skill-creator`
- Outputs por fecha: `YYYY-MM-DD-titulo-corto/`
- Variables de entorno en `.env` (nunca commitear; ver `.env.example`)

## Cuándo NO usar el OS

Casos donde es mejor abrir Claude Code en otro lado y no en este repo:
- Editar el código de tu propia app (abre la app)
- Resolver un bug puntual sin necesidad de brand context
- Una sesión exploratoria que no quieres que ensucie tu memory

Para casos donde sí lo usas:
- Crear contenido (LinkedIn, X, blog, email, video script)
- Trabajar con un cliente (entras en `clients/<nombre>/`)
- Análisis estratégico (positioning, competidores, trending)
- Generar deliverables que requieran brand voice consistente

## Soporte y comunidad

- Issues: https://github.com/iamasters/iamasters-os/issues *(privado en v0)*
- Sinapsis upstream: https://github.com/Luispitik/sinapsis
