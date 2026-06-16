# wp-content-mcp

MCP **read-only** que expone un sitio de **contenido WordPress** (páginas + blog)
para que un LLM responda sobre la marca. **Sin credenciales** (REST pública).
Configurado por defecto para **Solidker** (superficie sólida: encimeras y lavabos).

## Por qué este motor (y no el de catálogo)

Solidker NO tiene WooCommerce ni fichas de producto: es WordPress de contenido
(46 artículos de blog + páginas informativas como "Qué es el solid surface",
"Lavabos", "Encimeras", "Para profesionales", "Contacto · Presupuesto"). Este
motor expone justo eso.

## Tools

| Tool | Qué hace |
|---|---|
| `paginas` | Páginas informativas (oculta legales e índice de blog) |
| `pagina` | Texto completo de una página (`id`/`slug`/`url`) |
| `articulos` | Artículos del blog (opcional por categoría) |
| `articulo` | Texto completo de un artículo (`id`/`slug`/`url`) |
| `buscar` | Busca por texto en artículos + páginas |
| `ultimos_articulos` | Últimos artículos publicados |
| `categorias` | Categorías del blog |
| `hello_solidker` | Healthcheck |

## Uso

```bash
cp .env.example .env      # ajusta WP_BASE_URL / BRAND / HIDE_PAGES
npm install
npm run smoke             # valida contra la web en vivo
npm start                 # modo local (stdio) para Claude Code
npm run start:http        # modo web (HTTP) para publicar
```

## Multi-sitio

Motor genérico de contenido WP: para otro sitio, `.env.otra` con su `WP_BASE_URL`
y `ENV_FILE=.env.otra`.

## Despliegue

Mismo procedimiento que los otros MCP (cPanel → Setup Node.js App, Node ≥ 18,
startup `src/http.js`; ver `../woo-catalog/DEPLOY.md`). **Aviso:** solidker.com
está en Host-Fusion **hf04**, cuyo loopback está cerrado (mismo caso que Código
AdrIA) — si se hospeda en hf04 no podrá leerse a sí mismo hasta que Host-Fusion
habilite el loopback. Alternativa: hospedar en hf01 (donde el loopback funciona).
