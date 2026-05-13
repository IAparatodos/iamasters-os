#!/bin/bash
# ============================================================
#  iAmasters OS — Installer (macOS / Linux / Windows-bash)
#  Sistema operativo agéntico para operadores de IA
#  https://github.com/iamasters-academy/iamasters-os
# ============================================================
#
# Salida estructurada (parseable por Claude Code agent):
#   [OK]    <componente>            — completado
#   [SKIP]  <componente> · <motivo> — ya estaba o no aplica
#   [WARN]  <componente> · <motivo> — sigue, pero con limitación
#   [ERROR] <componente> · <motivo> — bloqueante, abort
#
# Idempotente: ejecutar varias veces NO rompe nada.
# ============================================================

set -e

# ── Output helpers ──
ok()    { echo "[OK]    $*"; }
skip()  { echo "[SKIP]  $*"; }
warn()  { echo "[WARN]  $*"; }
error() { echo "[ERROR] $*" >&2; exit 1; }
info()  { echo ">>      $*"; }

# ── Paths ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SINAPSIS_VENDOR="$REPO_ROOT/vendor/sinapsis"
CLAUDE_HOME="$HOME/.claude"

echo ""
echo "============================================================"
echo "  iAmasters OS — Installer v0.5.1"
echo "  Repo: $REPO_ROOT"
echo "============================================================"
echo ""

# ── Step 1: Detect OS ──
info "[1/7] Detectando sistema operativo..."

OS_TYPE="unknown"
case "$(uname -s)" in
    Darwin*)  OS_TYPE="macos";  ok "Sistema: macOS ($(uname -m))" ;;
    Linux*)   OS_TYPE="linux";  ok "Sistema: Linux ($(uname -m))" ;;
    MINGW*|MSYS*|CYGWIN*)
              OS_TYPE="windows-bash"
              warn "Sistema: Windows + Git Bash detectado"
              warn "Sistema: algunos comandos pueden fallar — usa WSL para mejor experiencia"
              ;;
    *)        warn "Sistema desconocido: $(uname -s) — continuamos pero algo puede fallar" ;;
esac

# ── Step 2: Prerequisites ──
info "[2/7] Comprobando prerequisitos..."

# Git
if ! command -v git &> /dev/null; then
    error "Git no encontrado. Es imprescindible. Instálalo en https://git-scm.com"
fi
ok "Git: $(git --version | awk '{print $3}')"

# Node.js
if ! command -v node &> /dev/null; then
    warn "Node.js no encontrado · instala en https://nodejs.org (≥18) para que las skills JS funcionen"
else
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        warn "Node.js $NODE_VERSION es viejo · recomendado ≥18"
    else
        ok "Node.js: v$NODE_VERSION"
    fi
fi

# Python 3
if ! command -v python3 &> /dev/null; then
    warn "Python 3 no encontrado · algunos hooks Sinapsis requieren python3"
else
    ok "Python: $(python3 --version | awk '{print $2}')"
fi

# Claude Code
# Detectamos varios paths posibles porque Claude Desktop no expone CLI estándar
if command -v claude &> /dev/null; then
    ok "Claude CLI presente en PATH"
else
    if [ -d "/Applications/Claude.app" ] || [ -d "$HOME/Applications/Claude.app" ]; then
        ok "Claude Desktop detectado (macOS app, CLI no requerido)"
    elif [ -n "$CLAUDE_DESKTOP" ] || [ -n "$CLAUDECODE" ]; then
        ok "Variables de entorno Claude Code detectadas (ejecutándote desde Code)"
    else
        warn "Claude Code/Desktop no detectado en PATH · si lo tienes instalado, ignora este aviso"
    fi
fi

# ── Step 3: Sinapsis vendor ──
info "[3/7] Comprobando Sinapsis (engine de memoria)..."

if [ ! -d "$SINAPSIS_VENDOR" ]; then
    error "vendor/sinapsis/ no encontrado · el repo no está completo, vuelve a clonarlo"
fi

# Detectar si ya está instalada Sinapsis global
SINAPSIS_INSTALLED=false
if [ -f "$CLAUDE_HOME/skills/_catalog.json" ] || [ -f "$CLAUDE_HOME/skills/_operator-state.json" ]; then
    SINAPSIS_INSTALLED=true
    skip "Sinapsis: ya instalado en $CLAUDE_HOME/skills/ (no toco nada)"
fi

if ! $SINAPSIS_INSTALLED; then
    if [ ! -f "$SINAPSIS_VENDOR/install.sh" ]; then
        error "vendor/sinapsis/install.sh no encontrado · vuelve a clonar el repo"
    fi
    info "Ejecutando vendor/sinapsis/install.sh..."
    cd "$SINAPSIS_VENDOR"
    bash install.sh || error "Sinapsis install.sh falló · revisa el output anterior"
    cd "$REPO_ROOT"
    ok "Sinapsis instalado en $CLAUDE_HOME"
fi

# ── Step 4: OS layer · brand-context y context ──
info "[4/7] Inicializando capa OS..."

# Crear directorios necesarios (idempotente)
mkdir -p "$REPO_ROOT/projects" "$REPO_ROOT/projects/briefs" "$REPO_ROOT/projects/welcome"
mkdir -p "$REPO_ROOT/context"
mkdir -p "$REPO_ROOT/brand-context/voice" "$REPO_ROOT/brand-context/positioning" "$REPO_ROOT/brand-context/icp" "$REPO_ROOT/brand-context/assets"

# .gitkeep para tracking
for empty_dir in "projects/briefs" "projects/welcome" "brand-context/voice" "brand-context/positioning" "brand-context/icp" "brand-context/assets"; do
    [ ! -f "$REPO_ROOT/$empty_dir/.gitkeep" ] && touch "$REPO_ROOT/$empty_dir/.gitkeep" || true
done
ok "Directorios proyecto creados/verificados"

# Soul.md (estático — no lo crea el wizard, lo creamos aquí)
if [ ! -f "$REPO_ROOT/context/soul.md" ]; then
    cat > "$REPO_ROOT/context/soul.md" <<'EOF'
# Soul · personalidad del agente

> Cómo respondes al usuario. Esto es estático (cambia poco).

## Tono
- Directo, sin rodeos
- Cálido pero no efusivo
- 2-3 opciones máx con recomendación, no listas exhaustivas

## Idioma
- Castellano siempre con el operador
- Outputs cliente en el idioma configurado en `me.md`

## Lo que NO haces
- Vender humo
- Inflar palabras vacías
- Ejecutar acciones destructivas sin confirmar

---
*Última actualización: instalación inicial · este archivo lo modificas tú a tu gusto*
EOF
    ok "context/soul.md creado"
else
    skip "context/soul.md · ya existe"
fi

# Decisions log (con header canónico)
if [ ! -f "$REPO_ROOT/context/decisions-log.md" ]; then
    cat > "$REPO_ROOT/context/decisions-log.md" <<'EOF'
# Decisions log

Diario append-only de decisiones del operador.
Patrón inspirado en [claude-code-second-brain](https://github.com/Luispitik/claude-code-second-brain) de Luis Pitik.

> Esta skill (`decisions-log`) se invoca automáticamente cuando
> tomas una decisión estratégica. También puedes invocarla
> manualmente: "registra esta decisión".

---
EOF
    ok "context/decisions-log.md creado (header canónico)"
else
    skip "context/decisions-log.md · ya existe"
fi

# Learnings (vacío, lo llenan las skills)
if [ ! -f "$REPO_ROOT/context/learnings.md" ]; then
    cat > "$REPO_ROOT/context/learnings.md" <<'EOF'
# Learnings

Feedback consolidado de skills, append-only.
Cada sección corresponde a una skill que registró algo aprendido.

> Lo mantiene la skill `meta-wrap-up` al cerrar sesión.

---
EOF
    ok "context/learnings.md creado"
else
    skip "context/learnings.md · ya existe"
fi

# Los 5 archivos sectorizados (me, work, team, priorities, goals) los crea el WIZARD,
# no este script. Aquí solo dejamos un README explicativo en context/.
if [ ! -f "$REPO_ROOT/context/README.md" ]; then
    cat > "$REPO_ROOT/context/README.md" <<'EOF'
# context/

Contexto sectorizado del operador (patrón inspirado en [second-brain](https://github.com/Luispitik/claude-code-second-brain)).

Los archivos siguientes los crea automáticamente la skill `meta-onboarding-wizard` la primera vez que abres Claude Code en este repo:

- `me.md` — identidad personal (nombre, ubicación, descripción profesional)
- `work.md` — negocio, servicios, revenue, stack
- `team.md` — equipo (puede estar vacío si trabajas solo)
- `current-priorities.md` — foco del mes, cuello de botella
- `goals.md` — objetivos 12 meses

Y los siguientes ya existen y se mantienen automáticamente:

- `soul.md` — personalidad del agente (estática)
- `decisions-log.md` — diario append-only de decisiones (skill `decisions-log`)
- `learnings.md` — feedback de skills (skill `meta-wrap-up`)

Si quieres editarlos a mano: adelante, el wizard solo los crea la primera vez.
EOF
    ok "context/README.md creado"
fi

# ── Step 5: Brand context README ──
info "[5/7] Inicializando brand-context/..."

if [ ! -f "$REPO_ROOT/brand-context/README.md" ]; then
    cat > "$REPO_ROOT/brand-context/README.md" <<'EOF'
# brand-context/

Tu marca: voz, posicionamiento, ICP, assets.

Los archivos los generan estas skills (no se llenan en la instalación):

- `marketing-brand-voice` → `voice/voice-profile.md`, `voice/samples.md`, `voice/register-{a,b,c}-*.md`
- `marketing-positioning` → `positioning/positioning.md`
- `marketing-icp` → `icp/icp.md`
- `marketing-brand-voice` (con Firecrawl) → `assets/` (logos, colores, fuentes auto-extraídos)

Los puedes generar tras el onboarding ejecutando `/start-here` y eligiendo "configurar brand voice".
EOF
    ok "brand-context/README.md creado"
else
    skip "brand-context/README.md · ya existe"
fi

# ── Step 6: .env from .env.example ──
info "[6/7] Verificando .env..."

if [ ! -f "$REPO_ROOT/.env" ]; then
    if [ -f "$REPO_ROOT/.env.example" ]; then
        cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
        ok ".env creado desde .env.example (rellena las claves cuando las tengas)"
    else
        warn ".env.example no encontrado · skill skipping"
    fi
else
    skip ".env · ya existe (no se sobrescribe)"
fi

# ── Step 7: Vendored skills opcionales (cognito) → NO se instalan por defecto ──
info "[7/8] Skills opcionales..."

# Desde v0.5.0 cognito ya NO se copia automáticamente.
# Vive en .claude/skills/_meta/_optional/cognito y se activa con:
#   /install-skill cognito
# Razón: para alguien que abre el OS por primera vez es ruido conceptual.
# Recomendado activarla tras la primera semana de uso, cuando ya conoce los básicos.

if [ -d "$REPO_ROOT/.claude/skills/_meta/_optional/cognito" ]; then
    skip "cognito · disponible en _optional/ — activar con /install-skill cognito cuando quieras"
fi

# ── Step 8: Final verification ──
info "[8/8] Verificación final..."

ISSUES=0
[ ! -d "$CLAUDE_HOME/skills" ] && ISSUES=$((ISSUES+1)) && warn "verify: $CLAUDE_HOME/skills no existe"
[ ! -f "$REPO_ROOT/CLAUDE.md" ] && ISSUES=$((ISSUES+1)) && error "verify: CLAUDE.md no existe en repo (corrupto)"
[ ! -f "$REPO_ROOT/.claude/settings.json" ] && ISSUES=$((ISSUES+1)) && warn "verify: .claude/settings.json no existe"
[ ! -d "$REPO_ROOT/.claude/skills/_meta" ] && ISSUES=$((ISSUES+1)) && warn "verify: .claude/skills/_meta no existe"

if [ $ISSUES -eq 0 ]; then
    ok "Verificación final: todo en orden"
else
    warn "Verificación final: $ISSUES avisos · ejecuta /doctor en Claude Code para diagnóstico completo"
fi

# ── Done ──
echo ""
echo "============================================================"
echo "  ✓ iAmasters OS instalado en: $REPO_ROOT"
echo "============================================================"
echo ""
echo "  Siguiente paso:"
echo "    1. Asegúrate de tener Claude Desktop con plan Pro o Max"
echo "    2. Abre la tab Code en Claude Desktop"
echo "    3. Usa 'Open folder' y selecciona: $REPO_ROOT"
echo "    4. La primera vez se ejecutará el onboarding wizard automáticamente"
echo ""
echo "  Comandos útiles dentro de Claude Code:"
echo "    /aprende      — Tour de 5 días (alumnos desde cero)"
echo "    /welcome      — Genera tu primer entregable (5 min)"
echo "    /doctor       — Diagnóstico del OS"
echo "    /start-here   — Ritual de inicio diario"
echo "    /wrap-up      — Cierre de sesión + commit"
echo ""
echo "  Plugins oficiales Anthropic (recomendado activar):"
echo "    /plugin install anthropic-skills"
echo "    Te da: docx, xlsx, pdf, pptx (manejo de archivos office)"
echo ""
echo "  Si vienes del prompt URL conversacional:"
echo "    Claude Code ya está procesando · sigue sus instrucciones"
echo ""
exit 0
