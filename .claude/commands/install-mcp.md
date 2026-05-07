---
description: Instala MCP server en .mcp.json del proyecto desde la lista curada o URL custom. Configura permisos y env vars.
---

# /install-mcp

Instala un MCP server (Model Context Protocol) en este proyecto.

## Uso

### Modo 1 · Desde lista curada (recomendado)
```
/install-mcp <name>
```

Ejemplos:
- `/install-mcp context7`
- `/install-mcp supabase`
- `/install-mcp github`

Lista completa: ver `docs/mcps-curated.md`.

### Modo 2 · MCP custom desde URL
```
/install-mcp custom <github-url>
```

## Process

### Paso 1 · Validar input

Si el nombre está en la lista curada (`docs/mcps-curated.md`):
- Cargar la configuración recomendada
- Verificar prerequisitos (env vars necesarias, plan API)

Si es URL custom:
- Avisar al usuario sobre risk (no validado por iAmasters)
- Pedir confirmación
- Inspeccionar repo para detectar package.json o setup.json del MCP

### Paso 2 · Comprobar `.mcp.json`

```bash
cat .mcp.json 2>/dev/null
```

Si no existe → crear nuevo
Si existe → leer para detectar conflictos (mismo MCP ya instalado)

### Paso 3 · Configurar entrada

Estructura típica de `.mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=$SUPABASE_PROJECT_REF"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "$SUPABASE_ACCESS_TOKEN"
      }
    }
  }
}
```

### Paso 4 · Verificar variables de entorno

Si el MCP requiere `$VARS`:
- Comprobar `.env` (sin commitear)
- Si faltan vars → preguntar al operador o derivar al doc del MCP

### Paso 5 · Permisos

Algunos MCPs requieren permisos extra en `.claude/settings.json`. Comprobar:
- ¿Necesita acceso al sistema de archivos? → añadir `Read` patterns
- ¿Hace API calls salientes? → revisar deny list de Bash

### Paso 6 · Test

Tras instalar:
- Reiniciar Claude Code (Ctrl+C × 2 + claude)
- Probar el MCP con prompt simple ("usa el MCP de [nombre] para...")
- Si activa correctamente: confirmar
- Si no: revisar logs y derivar a docs del MCP

### Paso 7 · Documentar

- Append en `context/learnings.md` bajo `## install-mcp`:
  ```
  - YYYY-MM-DD: instalado MCP <name> para <caso>
  ```
- Update `CLAUDE.md` mencionando MCP activo (sección "Apps externas conectadas")

## Edge cases

- **MCP requiere instalación global de un paquete npm**: avisar al operador, dar comando `npm install -g`, NO ejecutar automáticamente
- **MCP cambia su API**: la lista curada se actualiza con el repo. `git pull` para latest config
- **MCP custom no validado**: marcar en `.mcp.json` con comentario `_unverified: true`
- **MCP causa loop infinito o timeout**: removerlo de `.mcp.json` y reportar issue

## Implementación

Este comando es interpretativo. Lee `docs/mcps-curated.md` y aplica la configuración recomendada del MCP elegido. Si no está en la lista curada, deriva al instalador genérico con warnings.
