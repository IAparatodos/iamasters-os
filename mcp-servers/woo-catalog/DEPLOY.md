# Desplegar el MCP de Adrihosan en su hosting (Host-Fusion / cPanel)

Objetivo: que el MCP esté en una **URL pública** (`https://mcp.adrihosan.com/mcp`)
para que cualquier LLM/cliente se conecte. El server es **solo lectura**, así que
es seguro dejarlo abierto.

Hosting detectado: **Host-Fusion** (LiteSpeed + PHP 8.3, cPanel, soporte Node.js + SSH).

---

## Modos del server

- **Local (stdio)** → `npm start` (`src/index.js`). Es el que usa Claude Code en tu Mac.
- **Web (HTTP)** → `npm run start:http` (`src/http.js`). Es el que se publica online.
  - `POST /mcp` → protocolo MCP
  - `GET /health` → healthcheck

El puerto lo pone el hosting con la variable `PORT` (no la fijes tú en cPanel).

---

## Pasos en cPanel (camino A: mismo hosting)

### 1. Subdominio
cPanel → **Dominios / Subdominios** → crea `mcp.adrihosan.com`.
Apunta su *Document Root* a una carpeta, p.ej. `/home/usuario/mcp-adrihosan`.

### 2. Subir el código
Sube SOLO la carpeta `mcp-servers/woo-catalog` a esa ruta (vía Git, SSH o el
Administrador de archivos). NO subas `node_modules` ni `.env` por el navegador:
- `node_modules` se instala en el paso 4.
- `.env` se crea en el paso 5 (lleva credenciales).

### 3. Crear la app Node
cPanel → **Setup Node.js App** → *Create Application*:
- **Node.js version**: 18 o superior
- **Application mode**: Production
- **Application root**: la carpeta del paso 1
- **Application URL**: `mcp.adrihosan.com`
- **Application startup file**: `src/http.js`

### 4. Instalar dependencias
En la pantalla de la app, botón **Run NPM Install** (o por SSH: entra al
*virtualenv* que indica cPanel y `npm install`).

### 5. Variables de entorno (.env)
Crea el `.env` en la carpeta (copia de `.env.example`) con las credenciales reales:
```
WP_BASE_URL=https://www.adrihosan.com
WP_USERNAME=usuario_wp
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
BRAND_NAME=Adrihosan
BRAND_SLUG=adrihosan
FAQ_PAGE_URL=https://www.adrihosan.com/preguntas-frecuentes-adrihosan/
```
> La `WP_APP_PASSWORD` se genera en WP Admin → Usuarios → tu perfil → Application Passwords.
> Solo se usa para LECTURA y vive solo en el servidor.

### 6. Arrancar / reiniciar
Botón **Restart** de la app. Comprueba:
- `https://mcp.adrihosan.com/health` → `{"ok":true,...}`

> ⚠️ **Gotcha real (cPanel Node Selector):** las Environment variables NO pueden
> tener **espacios en el valor** — cPanel las inyecta sin comillas y rompen el
> arranque (`export: '=...': no es un identificador válido` → la app no recibe las
> variables → 503). La `WP_APP_PASSWORD` de WordPress se muestra con espacios pero
> **van quitados** (`qqh8 7hqM ...` → `qqh87hqM...`; WP los ignora igual).
> Y elige **Node.js ≥ 18** (con Node 10 el server se cae: usa `fetch`, ESM, etc.).

---

## Cómo se conecta otra persona (cualquier LLM/cliente)

En su `.mcp.json` (Claude Code / Claude Desktop / etc.):
```json
{
  "mcpServers": {
    "adrihosan": {
      "type": "http",
      "url": "https://mcp.adrihosan.com/mcp"
    }
  }
}
```
Sin credenciales: el MCP solo expone catálogo, posts y FAQs (todo público, read-only).

---

## Alternativas (si el camino A falla)

- **Camino B — cloud + subdominio**: hospedar `src/http.js` en Railway/Render y
  apuntar `mcp.adrihosan.com` (CNAME) a ese servicio. Mismo resultado de cara al usuario.
- **Camino C — plugin WordPress**: reescribir las tools como *abilities* del MCP
  que ya expone WordPress (`wp-json/mcp`). Más trabajo (PHP) y ojo: ese endpoint
  también puede ESCRIBIR, así que habría que exponer solo lo read-only.

## Multi-marca (Solidker, etc.)
El código es genérico. Para otra tienda: nuevo subdominio + nueva app Node con su
propio `.env` (`ENV_FILE=.env.solidker`). El código no se duplica conceptualmente.
