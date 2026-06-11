---
description: Actualiza iAmasters OS a la última versión desde GitHub, preservando tus skills, brand-context, context y projects. Uso — /actualiza
---

# /actualiza

Trae la última versión del OS y la instala sin tocar nada tuyo.

## Proceso

1. Confirmar que estamos dentro de un repo iamasters-os (existe `vendor/sinapsis/` y `CLAUDE.md` con "iAmasters OS"). Si no, avisar y parar.
2. Avisar al usuario qué versión tiene ahora (badge del README o `version` de `CITATION.cff`) y que vas a actualizar.
3. Ejecutar, en este orden:
   ```bash
   git pull --ff-only
   bash scripts/update.sh
   ```
4. `update.sh` ya preserva: tus skills propias, `brand-context/`, `context/`, `projects/`, `clients/` y `loops/`. Solo actualiza el código del OS, las skills curadas y Sinapsis vendored. NUNCA sobrescribe tu contenido.
5. Si `git pull` falla por cambios locales sin commitear, NO forzar: explicar al usuario qué archivos tiene modificados y preguntar antes de hacer nada (sus cosas mandan).
6. Al terminar, mostrar un resumen corto de qué cambió (leer el `## [Unreleased]` / última versión del `CHANGELOG.md`) y sugerir `/doctor` si algo se ve raro.

## Disparadores en lenguaje natural

Activa este flujo también cuando el usuario diga, sin el comando:
"actualízate", "actualiza el OS", "actualízate a la última versión", "tráete los cambios nuevos", "ponme la última versión de iAmasters OS", "update".
