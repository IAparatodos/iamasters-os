# Publicar en WordPress — receta técnica (codigoadria / multi-marca)

Credenciales en `~/iamasters-os/.env`: `WP_URL`, `WP_USER`, `WP_APP_PASSWORD` (application password, basic auth).
**`curl`/`wget` están bloqueados → usar `node + fetch` o `python3 + urllib`.** Categoría "General" de codigoadria = **13**.

## Gotchas aprendidos (NO repetir errores)
1. **Forzar `"status":"draft"` en CADA llamada de update.** Una actualización solo de `content` llegó a publicar el post sin querer. En cada POST a `/wp/v2/posts/{id}` incluir siempre `status:"draft"` hasta que el usuario decida publicar/programar.
2. **Embed de vídeo SIEMPRE responsive** (wrapper `padding-bottom:56.25%` + iframe absoluto al 100%). Nunca el `width="500" height="281"` fijo (se ve pequeñísimo).
3. **Rank Math SIEMPRE** (ver [[feedback-rankmath-siempre]]). Endpoint `rankmath/v1/updateMeta`.
4. **Enlazado interno SIEMPRE**: 3-5 enlaces contextuales + caja `.rel` "Sigue por aquí". En el diseño `cad-art` salen en turquesa (visibles).
5. **FAQ schema** (`FAQPage` JSON-LD) debe coincidir **palabra por palabra** con la FAQ visible. WordPress conserva `<script>`/`<style>` porque el usuario admin tiene `unfiltered_html`.
6. **"En corto" (resumen citable) al principio** del post — imprescindible para GEO.
7. El editor abierto del usuario queda **desactualizado** tras editar por API: recordarle cerrar/reabrir la pestaña y descartar el autoguardado del navegador si Gutenberg lo ofrece.

## 1) Crear post (borrador) con imagen destacada
```python
import os, json, base64, urllib.request
env = {k.strip(): v.strip().strip('"').strip("'") for k,v in
       (l.split("=",1) for l in open("/Users/adrihosan/iamasters-os/.env")
        if l.strip() and not l.startswith("#") and "=" in l)}
WP = env["WP_URL"].rstrip("/")
auth = base64.b64encode(f'{env["WP_USER"]}:{env["WP_APP_PASSWORD"].replace(" ","")}'.encode()).decode()

# subir imagen destacada
def upload_media(path, alt):
    body = open(path,"rb").read(); fn = os.path.basename(path)
    r = urllib.request.Request(f"{WP}/wp-json/wp/v2/media", data=body, method="POST")
    r.add_header("Authorization", f"Basic {auth}")
    r.add_header("Content-Type", "image/png")
    r.add_header("Content-Disposition", f'attachment; filename="{fn}"')
    m = json.load(urllib.request.urlopen(r))
    meta = json.dumps({"alt_text": alt}).encode()
    r2 = urllib.request.Request(f"{WP}/wp-json/wp/v2/media/{m['id']}", data=meta, method="POST")
    r2.add_header("Authorization", f"Basic {auth}"); r2.add_header("Content-Type","application/json")
    try: urllib.request.urlopen(r2).read()
    except Exception: pass
    return m["id"]

media_id = upload_media("/ruta/miniatura.png", "alt SEO con la keyword")
post = {"title": TITULO, "slug": SLUG, "status": "draft", "categories": [13],
        "featured_media": media_id, "content": CONTENT_HTML, "excerpt": EXCERPT}
req = urllib.request.Request(f"{WP}/wp-json/wp/v2/posts", data=json.dumps(post).encode(), method="POST")
req.add_header("Authorization", f"Basic {auth}"); req.add_header("Content-Type","application/json")
out = json.load(urllib.request.urlopen(req))
print("id", out["id"], out["status"], f"{WP}/wp-admin/post.php?post={out['id']}&action=edit")
```

## 2) Rank Math (SIEMPRE)
```python
payload = {"objectID": POST_ID, "objectType": "post", "meta": {
  "rank_math_focus_keyword": "keyword principal, secundaria, otra",
  "rank_math_title": "Título SEO ≤60 con la keyword | Marca",
  "rank_math_description": "Meta description ≤155 con la keyword."}}
req = urllib.request.Request(f"{WP}/wp-json/rankmath/v1/updateMeta",
      data=json.dumps(payload).encode(), method="POST")
req.add_header("Authorization", f"Basic {auth}"); req.add_header("Content-Type","application/json")
print(urllib.request.urlopen(req).read())   # OK ~ {"slug":true,...}  (no se ve por REST, normal)
```

## 3) Enlazado interno — descubrir destinos
```python
def get(path): return json.load(urllib.request.urlopen(
    urllib.request.Request(f"{WP}{path}", headers={"Authorization": f"Basic {auth}"})))
posts = get("/wp-json/wp/v2/posts?per_page=30&_fields=id,title,link")
pages = get("/wp-json/wp/v2/pages?per_page=40&_fields=id,title,link")
# elegir 3-5 temáticamente afines y enlazarlos con anchor natural en el cuerpo + caja .rel
```

## 4) FAQ schema (tras crear el post)
Añadir como bloque `wp:html` al final del `content`:
```html
<!-- wp:html --><script type="application/ld+json">{ FAQPage ... }</script><!-- /wp:html -->
```
El texto de cada `acceptedAnswer` = el de la FAQ visible, idéntico.

## 5) Editar contenido sin publicar
Traer `content.raw` con `?context=edit`, modificar, y POST con `{"content": nuevo, "status":"draft"}`.
