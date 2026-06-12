---
name: marketing-video-publish
version: 1.1.0
description: Prepara el paquete completo de publicación de un vídeo o clase de curso, multi-marca. Genera DOS entregables HTML editables — ficha-youtube.html (subida a YouTube) y redes-metricool.html (difusión) — con título y etiquetas validados con VidIQ, frase gancho + suscripción, descripción, comentario fijado, tarjetas, pantallas finales, cuestionario, y copies de redes (LinkedIn, Instagram, Facebook, X, Telegram, WhatsApp) con teaser + estreno + recordatorio. Lee el perfil de marca de brands/<slug>.json. IMPORTANTE: la transcripción/MP3 NO está disponible hasta que el vídeo está editado → prepara TODO lo demás primero y PIDE la transcripción para los tiempos. Invócala con "dame los htmls para publicar en youtube", "publica el vídeo", "paquete de YouTube", "textos del vídeo", "prepara la clase".
---

# marketing-video-publish · v1.1

Convierte un vídeo (o clase de curso) en un paquete de publicación + difusión, consistente y sin reinventarlo cada vez. **Multi-marca**: toda la personalización vive en `brands/<slug>.json`.

## Cuándo se invoca
- "dame los htmls para publicar en youtube", "publica el vídeo", "prepárame el paquete / los textos del vídeo", "metadatos / descripción del vídeo", "copies de redes del vídeo".
- También para **clases de curso** (misma ficha de YouTube; si la clase es privada, omite lo que no aplique).

## ⚠️ FLUJO REAL — la transcripción va AL FINAL (regla de Ricardo)

La transcripción / el MP3 **no existen hasta que el vídeo está editado**. Por eso:

1. Cuando te pidan "los htmls para publicar", **prepara TODO lo que NO depende del audio**:
   título (VidIQ), frase gancho, suscripción, descripción (cuerpo), etiquetas, hashtags, comentario fijado, copies de redes (teaser + estreno + recordatorio), WhatsApp, pantallas finales, y la **estructura** de tarjetas y cuestionario.
2. Lo que SÍ depende del audio queda como **⏳ pendiente de transcripción**:
   **capítulos/timestamps**, **minutos de las tarjetas (CTAs)**, **minutos del cuestionario**.
3. Entrega los 2 HTML con esos huecos marcados y **PIDE explícitamente la transcripción o el MP3** ("cuando tengas el vídeo editado, pásame el MP3/transcripción y relleno los tiempos").
4. **Nunca inventes timestamps.** Cuando llegue el audio, transcribe (ver paso Transcripción) y rellena solo esos huecos.

## Dependencias
- **VidIQ MCP**: `vidiq_keyword_research` (etiquetas), `vidiq_score_title`, `vidiq_generate_titles`, `vidiq_score_thumbnail`, `vidiq_user_channels`. **Úsalo para TODO lo de YouTube.**
- **Skill `youtube`** (`~/.claude/skills/youtube/`): playbooks de metadata/seo/thumbnail/hook. Cárgalos, no los reescribas.
- **ffmpeg/ffprobe** (duración, extraer audio).
- **Transcripción**: en esta máquina NO hay whisper local. Usar la **API de OpenAI** (`whisper-1`, `OPENAI_API_KEY` en `~/iamasters-os/.env`), endpoint `/v1/audio/transcriptions`, `response_format=verbose_json`, `timestamp_granularities[]=segment`.
- **gen-image.py** (gpt-image) para miniaturas/badges si hace falta.

## Inputs
1. **Carpeta del vídeo** + tema/título de trabajo. (El archivo de vídeo/MP3 puede NO estar todavía.)
2. **Marca** → `brands/<slug>.json` (default `codigo-adria`; si no se sabe, preguntar).
3. Enlaces relevantes (curso, lead magnet, landing) — normalmente ya en el perfil.

## Paso 0 · Cargar perfil de marca
Lee `brands/<slug>.json`: diseño, `youtube`, `subscribe` (bloque + bit.ly), `leadMagnet`, `socials` (handles EXACTOS), `telegramGroup`, `whatsappGroups`, `landings`, `rules`. **Nunca inventes handles ni estilos.** Si falta un dato, pregunta.

## Pipeline (sin transcripción)

### 1 · Título + frase gancho (VidIQ)
- `vidiq_keyword_research` con 2-4 semillas del tema → keyword principal real.
- `vidiq_score_title` al título propuesto (pasa `channelId`). `vidiq_generate_titles` para variantes A/B con score; valida que encajen, no copies a ciegas. Quédate el de mayor score como principal y deja 3-4 alternativas con su nota.
- **Frase gancho**: 1ª línea de la descripción (lo que se ve en SERP/feed). Complementa el título, NO lo repite; mete la keyword.

### 2 · Descripción de YouTube (orden fijo)
1. **Frase gancho**.
2. **Bloque suscripción** (`subscribe.text` + `subscribe.url`).
3. Cuerpo (historia + qué enseña + qué NO hace).
4. Curso (con los módulos si aplica) → `landings.curso-automatizaciones`.
5. Lead magnet → `leadMagnet`.
6. **📌 CAPÍTULOS** → ⏳ pendiente de transcripción (placeholder).
7. Herramientas.
8. **📺 Sígueme** → handles de `socials` (todos).
9. Hashtags (3-5; los 3 primeros importan por orden).

### 3 · Etiquetas y hashtags (≠)
- **Etiquetas (tags)**: campo aparte. `vidiq_keyword_research` → **~8-12 etiquetas, lideradas por la keyword principal, NO llenar a 500 car** (papel mínimo según YouTube).
- **Hashtags**: en la descripción, 3-5, los 3 primeros se ven sobre el título.

### 4 · Comentario fijado
1 CTA claro (curso o lead magnet) + pregunta para activar comentarios. Coherente con lo que promete el vídeo.

### 5 · Tarjetas, pantallas finales, cuestionario
- **Tarjetas (cards)**: estructura (Tarjeta + Teaser ≤30 car + Destino). Los **minutos = ⏳ pendiente de transcripción**. Tarjeta con enlace externo requiere **YPP + web verificada**; si no, solo vídeo/lista/canal/suscripción.
- **Pantallas finales**: suscribirse + vídeo (siguiente/mejor) + lista de reproducción + (opcional) enlace.
- **Cuestionario**: 3 preguntas con respuesta ✅; los **minutos = ⏳ pendiente**.

### 6 · Redes (redes-metricool.html)
Por plataforma de `socials`: **LinkedIn, Instagram, Facebook, X** con **teaser (mañana ~10:00) + estreno (19:00)**; **Telegram** (grupo fieles) y **WhatsApp** con **tono técnico/insider**; + **Recordatorio** (día siguiente). Reglas:
- **UN SOLO enlace por post** (el del vídeo). El curso/lead magnet NO va como 2º enlace; si se menciona, en texto sin URL.
- Instagram: "link en bio" (uno).
- WhatsApp: recorrer `whatsappGroups`, un mensaje por grupo según su `tone`, sin hashtags.

## Paso final · Generar los 2 HTML editables
Genera en la carpeta del vídeo:
- **`ficha-youtube.html`** — Frase gancho · Título (+ alternativas VidIQ con score) · Descripción · Etiquetas · Hashtags · Comentario fijado · Tarjetas · Pantallas finales · Cuestionario.
- **`redes-metricool.html`** — LinkedIn · Instagram · Facebook · X · Telegram · WhatsApp · Recordatorio.

Patrón de los HTML (copiar el de un vídeo ya hecho, p.ej. `video-youtube-2-atencion-cliente/`):
- Estilo de marca (Poppins, turquesa/petróleo), responsive, `@media print`.
- **Barra de edición** fija: `✏️ Modo edición` (toggle `contentEditable` sobre `[data-edit]`), `💾 Descargar` (baja el HTML editado), `↺ Restaurar`. Autoguardado en `localStorage`.
- **Botón Copiar** por bloque.
- En redes: campo arriba para **pegar la URL** y "Aplicar URL a todo" → sustituye `[URL VÍDEO]` en todos los posts.
- Marca los huecos pendientes con **⏳** bien visible.

Ábrelos al terminar. Luego **pide la transcripción/MP3** para los tiempos.

## Cuando llegue el audio · Transcripción → rellenar tiempos
```
ffprobe -v error -show_entries format=duration -of default=nokey=1:noprint_wrappers=1 "VIDEO_o_MP3"
# extraer audio limpio del MP4 si el MP3 da problemas:
ffmpeg -y -i "VIDEO.mp4" -vn -ar 16000 -ac 1 -b:a 64k audio16k.mp3
```
Transcribir con OpenAI `whisper-1` (verbose_json, segmentos). **Whisper se va en bucle** ("...una...una...") con audio largo/comprimido a baja tasa → **trocear en chunks de ~90 s** y desplazar los timestamps por el offset del chunk; así un trozo malo no contamina el resto. De los segmentos saca:
- **Capítulos reales** (1.º en 00:00, ≥3, cada uno >10 s; último no en los últimos 10 s).
- **Minuto de cada CTA hablado** → tiempos de las tarjetas.
- Conceptos para el **cuestionario** → su minuto.
Rellena SOLO los huecos ⏳ en `ficha-youtube.html`. Borra los audios temporales (deja el original).

## Quality gates
1. **Datos reales**: capítulos del transcript, score de título VidIQ, keywords con volumen. Nada inventado; timestamps solo con audio.
2. **Un enlace por post** de redes. Handles y diseño = los del perfil.
3. **Etiquetas pocas** (≤~12) y separadas de los hashtags.
4. **Frase gancho + suscripción** al inicio de la descripción.
5. Copia local guardada; los 2 HTML abiertos.

## Output
- `<carpeta>/ficha-youtube.html` y `<carpeta>/redes-metricool.html` (editables).
- `transcripcion-limpia.txt` (cuando haya audio).
- (Opcional) post de blog vía skill `marketing-blog-geo`.

## Multi-marca
Añadir marca = copiar `brands/_template.json` → `brands/<slug>.json` y rellenar. Sin tocar la skill. Marcas: `codigo-adria` (lista); a futuro `adrihosan`, `solidker`, clientes.
