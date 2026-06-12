---
name: marketing-blog-geo
version: 1.0.0
description: Genera y publica (como borrador) un post de blog optimizado para GEO con el formato de marca "cad-art" — bloque resumen "En corto" citable, diseño de marca, vídeo embebido a tamaño grande (responsive), enlazado interno visible, FAQ + FAQ schema (JSON-LD), CTA, imagen destacada y Rank Math relleno. Multi-marca (lee brands/<slug>.json de marketing-video-publish). A partir de la transcripción/tema de un vídeo o de un tema suelto, escribe un artículo de ~2000 palabras siguiendo la Gema SEO y lo deja listo en WordPress. Invócala con "haz el post del blog", "publica el artículo", "el vídeo al blog", "post GEO".
---

# marketing-blog-geo · v1.0

Convierte un vídeo (o un tema) en un **post de blog GEO** con el formato exacto que usa Código AdrIA, y lo deja en **borrador** en WordPress listo para revisar. Es el "paso blog" del pipeline; lo invoca también `marketing-video-publish`.

## Cuándo se invoca
- "haz el post del blog", "publica el artículo", "el vídeo al blog", "post GEO", "artículo del vídeo".
- Norma de marca: **cada vídeo va también al blog**.

## Inputs
1. **Fuente**: transcripción del vídeo (preferida) o URL de YouTube + tema; o un tema suelto.
2. **Marca** → `../marketing-video-publish/brands/<slug>.json` (blog.category, site, landings, diseño, rules). Default `codigo-adria`.
3. **Imagen destacada**: la miniatura del vídeo (o una imagen del tema).

## Reglas de redacción (Gema SEO senior)
- **Una sola keyword principal**, inferida del contenido y **validada con VidIQ** (`vidiq_keyword_research`): liderar con lo que se busca de verdad, no con jerga de marca. Usarla en título, primeras líneas y "En corto", sin forzar.
- **~2000 palabras**. **Expandir, no resumir**: ejemplos y aplicaciones prácticas.
- Tono adaptado a la energía del vídeo; nunca genérico. Prohibido "en este post hablaremos de…".
- Encabezados naturales. Cada párrafo con intención; nada de relleno.

## Estructura obligatoria (plantilla `assets/cad-art-template.html`)
Todo va en bloques `<!-- wp:html -->`, dentro de `<div class="cad-art">` con su `<style>` (reusar el de la plantilla, idéntico a los posts existentes). Orden:
1. **`.tldr` "En corto"** — 2-4 frases que **respondan directamente a la keyword** (es lo que la IA citará). Con 1 enlace interno.
2. **Embed del vídeo** (si es post de vídeo) — responsive 16:9, **a todo el ancho**. Nunca tamaño fijo.
3. **Intro** (2-3 párrafos con gancho, sin fórmulas manidas).
4. **Bloque del experimento/Prompt** si el vídeo lo tiene (caja `.rel`).
5. **Cuerpo** en `<h2>`/`<p>` + listas `<ol class="steps">`, tarjetas `.grid/.card` cuando aporten. Insertar **3-5 enlaces internos contextuales** (anchors naturales) — en `cad-art` salen en turquesa, visibles.
6. **FAQ** (`<div class="qa"><h3>…</h3><p>…</p></div>`, 3+ preguntas) — refuerza el GEO.
7. **`.cta`** a la landing del servicio.
8. **`.rel` "Sigue por aquí"** con enlaces internos relacionados.

## Publicación (ver `references/publish-wp.md`)
1. Inferir keyword (VidIQ) → escribir el artículo → montar el HTML `cad-art`.
2. **Subir la miniatura como imagen destacada** (con `alt` que lleve la keyword).
3. **Crear el post como `status:"draft"`**, categoría del perfil, con `featured_media`, `excerpt` SEO.
4. **Rank Math SIEMPRE**: focus keyword (+ secundarias) + título SEO + meta description (`rankmath/v1/updateMeta`).
5. **Enlazado interno**: consultar posts/páginas existentes y enlazar 3-5 + caja `.rel`.
6. **FAQ schema** (`FAQPage` JSON-LD) en un `wp:html` final, **idéntico** a la FAQ visible.
7. Abrir el editor y avisar al usuario de **recargar la pestaña** (la suya queda vieja).

## Gotchas (no repetir)
- **Forzar `status:"draft"` en cada update** (una edición de solo `content` llegó a publicar el post).
- Embed **responsive**, nunca 500px fijo.
- El editor abierto del usuario se queda desactualizado tras editar por API.
- `curl/wget` bloqueados → `node+fetch` o `python3+urllib`.

## Quality gates
1. Keyword única validada; ~2000 palabras; "En corto" presente y citable.
2. Imagen destacada + embed grande + Rank Math relleno + FAQ schema = FAQ visible.
3. 3-5 enlaces internos visibles (turquesa) + caja relacionados.
4. Post en **borrador** (nunca publicar sin que el usuario lo pida).

## Output
- Post en WordPress (borrador) con su URL de edición.
- Copia local del `.md`/HTML del artículo en la carpeta del proyecto del vídeo.

Relacionado: [[project-skill-video-publish]], [[feedback-rankmath-siempre]]. Referencias: `references/publish-wp.md`, `assets/cad-art-template.html`.
