# woo-catalog-mcp

Servidor **MCP de solo lectura** que expone el escaparate de una tienda
WooCommerce + WordPress: **productos, categorías, posts del blog y FAQs**.
Inspirado en el MCP público de `mcp.boluda.com`, pero para catálogo.

## Idea clave (seguridad)

```
Usuario externo ──(sin claves)──▶  woo-catalog-mcp  ──(app-password, privada)──▶  WordPress
   solo ve 9 tools de lectura         este servidor          la credencial vive
   producto_actual / faqs / ...       filtra a campos         SOLO aquí dentro
                                       seguros de frontend
```

- **El consumidor no necesita credenciales.** La Application Password vive solo
  en el `.env` del servidor y se usa únicamente para **leer**.
- Cada respuesta pasa por un **whitelist de campos** (`src/format.js`): salen
  nombre, precio, foto, link, categorías… y **nunca** pedidos, clientes, SKU
  interno, stock (salvo que `EXPOSE_STOCK=true`), ni metadatos sensibles.
- No se expone el MCP de administración del sitio: este es un servidor aparte.

## Tools

| Tool | Parámetros | Devuelve |
|---|---|---|
| `producto_actual` | — | Último producto publicado |
| `ultimos_productos` | `limit?` | Últimos N productos |
| `buscar_productos` | `query`, `categoria?`, `limit?` | Productos que casan |
| `categorias_productos` | `limit?` | Categorías de producto |
| `ultimos_posts` | `limit?` | Últimas entradas del blog |
| `buscar_posts` | `query`, `limit?` | Entradas que casan |
| `categorias_blog` | `limit?` | Categorías del blog |
| `faqs` | `id`, `tipo` (`producto`\|`post`), `auto?` | FAQs de ese producto/post |
| `hello_<marca>` | — | Healthcheck |

## Puesta en marcha

```bash
cd mcp-servers/woo-catalog
npm install
cp .env.example .env        # rellena WP_BASE_URL, WP_USERNAME, WP_APP_PASSWORD
npm run smoke               # prueba de conexión (muestra una muestra de cada dominio)
```

### Application Password

WP Admin → **Usuarios → tu perfil → Application Passwords** → crea una
(p. ej. "mcp-catalogo"). Copia el valor (`xxxx xxxx xxxx ...`) a `WP_APP_PASSWORD`.
Con un usuario de rol bajo basta: el servidor solo lee.

## Conectar a Claude Code (`.mcp.json`)

```json
{
  "mcpServers": {
    "adrihosan-catalogo": {
      "command": "node",
      "args": ["mcp-servers/woo-catalog/src/index.js"],
      "env": { "ENV_FILE": "mcp-servers/woo-catalog/.env" }
    }
  }
}
```

## Clonar a otra tienda (p. ej. solidker)

Mismo código, distinto `.env`:

```bash
cp .env.example .env.solidker     # con las credenciales de solidker
ENV_FILE=.env.solidker npm run smoke
```

Y otra entrada en `.mcp.json` apuntando a `ENV_FILE=...env.solidker`.

> Nota: solidker hoy **no** expone `wc/store/v1` y su CPT no está en REST pública.
> Para que funcione necesita la WooCommerce REST v3 / wp-abilities accesibles con
> su Application Password (igual que adrihosan).
