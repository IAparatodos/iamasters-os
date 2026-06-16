# codigoadria-courses-mcp

MCP **read-only** que expone los cursos de **Código AdrIA** (WordPress + Tutor LMS)
para que cualquier LLM consulte cursos, temario y clases. **Sin credenciales**: usa
solo la REST pública de WordPress.

## Modelo de datos (cómo está montado el sitio)

- Cada **curso** es una **categoría** de posts cuyo nombre empieza por `Curso ` —
  `Curso ChatGPT`, `Curso Gemini`, `Curso Claude`, `Curso IA GRATIS`,
  `Curso de Automatizaciones`. (Las demás categorías son generales.)
- Las **clases** son los **posts** de esa categoría. El **texto es público**; el
  **vídeo está restringido** y no se incluye.
- Las **páginas de curso** (CPT `courses`) aportan la descripción comercial y se
  cruzan con su categoría por nombre.

## Tools

| Tool | Qué hace |
|---|---|
| `cursos` | Lista los cursos (categoría + descripción + nº de clases) |
| `curso` | Detalle de un curso: descripción + sus clases (`id`/`slug`/`nombre`) |
| `clases` | Las clases de un curso |
| `clase` | Texto completo (público) de una clase (`id`/`slug`/`url`) |
| `buscar_clases` | Busca clases por texto (opcional dentro de un curso) |
| `ultimas_clases` | Últimas clases publicadas |
| `categorias` | Categorías marcando curso vs general |
| `hello_codigoadria` | Healthcheck |

## Uso

```bash
cp .env.example .env      # ajusta WP_BASE_URL / BRAND si hace falta
npm install
npm run smoke             # valida contra la web en vivo
npm start                 # modo local (stdio) para Claude Code
npm run start:http        # modo web (HTTP) para publicar en una URL
```

## Modos

- **Local (stdio)** → `src/index.js`. Lo usa Claude Code en tu máquina.
- **Web (HTTP)** → `src/http.js`. Para publicar en `https://mcp.codigoadria.com/mcp`.
  Mismo procedimiento de despliegue que el MCP de Adrihosan (ver
  `../woo-catalog/DEPLOY.md`): cPanel → Setup Node.js App, Node ≥ 18, startup
  `src/http.js`. Aquí **no hay env vars secretas** (todo público), así que el
  despliegue es aún más simple.

## Multi-sitio

El motor es genérico: para otra academia WordPress, copia `.env` a
`.env.otra` con su `WP_BASE_URL` y arranca con `ENV_FILE=.env.otra`.
