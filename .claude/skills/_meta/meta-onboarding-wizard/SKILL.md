---
name: meta-onboarding-wizard
description: Lanza el onboarding inicial cuando un operador instala iAmasters OS por primera vez. NO es un formulario — es una entrevista conversacional adaptativa que cubre 8 dimensiones críticas (identidad, negocio, foco, objetivos) profundizando dinámicamente según las respuestas. Llena los archivos sectorizados context/me.md, work.md, team.md, current-priorities.md, goals.md + configura defaults inteligentes + ofrece modo cognito + cierra anunciando la skill `meta-deep-dive` para profundizar el día siguiente. Solo se ejecuta UNA vez por instalación.
---

# meta-onboarding-wizard

> **Filosofía**: esto NO es un formulario con 15 preguntas predefinidas. Es una entrevista conversacional. Las preguntas concretas las decide el agente en cada turno, según la respuesta anterior. Lo que está fijo son las **dimensiones a cubrir** (qué información tiene que quedar capturada) y las **reglas de profundización** (cómo decide si insistir o pasar a otra dimensión).
>
> El express cubre solo las **8 dimensiones mínimas críticas** para que el OS quede operativo. La skill `meta-deep-dive` (al día siguiente, opcional pero recomendada) cubre las 22 dimensiones restantes.

## Cuándo se invoca

- `~/.claude/skills/_operator-state.json` tiene `needsOnboarding: true`
- O bien: operator-state existe pero `context/me.md` no existe o está vacío
- O bien: el usuario pide explícitamente "vuelve a hacerme el onboarding"

NO se invoca cuando:
- `context/me.md` ya está rellenado (pasa al flujo `meta-start-here`)
- Hay daily summary del día anterior (continuidad normal)

## Las 8 dimensiones críticas que TIENE que capturar

Lee también [`references/dimensiones-express.md`](references/dimensiones-express.md) para el detalle de qué información concreta debe quedar en cada una.

| # | Dimensión | Bloque | Archivo destino |
|:--|---|---|---|
| 1 | Identidad básica (nombre + 1 frase pro) | A · Persona | `context/me.md` |
| 2 | Ubicación + idioma | A · Persona | `context/me.md` |
| 3 | Negocio principal (qué hace) | B · Negocio | `context/work.md` |
| 4 | Modelo de ingresos | B · Negocio | `context/work.md` |
| 5 | Cliente ideal (descripción inicial) | B · Negocio | `context/work.md` |
| 6 | Stack diario | B · Negocio | `context/work.md` |
| 7 | Foco del mes (1-3 prioridades) | D · Foco | `context/current-priorities.md` |
| 8 | Objetivo a 12 meses | D · Foco | `context/goals.md` |

**Definición de "done"**: cada dimensión tiene al menos 1 dato sólido capturado (no "todavía no sé", no respuesta vacía, no genérica tipo "ayudar a la gente").

**Tiempo objetivo**: 10-12 minutos. Si tarda más, algo va mal con la profundización (probablemente estás insistiendo demasiado en una dimensión).

## Reglas de profundización

Las preguntas concretas las decide el agente en cada turno. Para cada respuesta del usuario, aplica estas reglas:

### Señales que piden profundizar (haz 1 follow-up, no más)

| Señal en la respuesta | Movimiento |
|---|---|
| Respuesta de menos de 15 palabras en una dimensión clave | "Cuéntame más" o pide ejemplo concreto |
| Cifra sin contexto ("facturo 30K") | Pregunta tendencia (creciendo/plano/cayendo) o ticket medio |
| Adjetivo abstracto ("equipo problemático", "cliente difícil") | Pide ejemplo de la última semana |
| Nombre propio mencionado al pasar ("Pilar está saturada") | Anota mentalmente y pregunta el rol/relación |
| Generalidad sin sustancia ("ayudo a la gente con su negocio") | Reformula: "¿gente cómo? Si tuviera que pintar a tu cliente perfecto, ¿cómo es?" |
| Contradicción aparente entre dos respuestas | Pide clarificación 1 línea, sin juicio ni debate |

### Señales que piden NO profundizar (pasa a la siguiente dimensión)

| Señal | Movimiento |
|---|---|
| Respuesta rica y completa (>50 palabras con datos concretos) | Salta a siguiente dimensión. No insistas |
| Usuario dice "no sé", "todavía no", "después" en una dimensión | Acepta. Apunta "(por definir)" y propón skill concreta para resolverlo luego |
| Respuestas cortas seguidas (3+ turnos) | Señal de fatiga. Acelera, salta dimensiones que tengan dato mínimo |
| Usuario muestra urgencia ("siguiente", "ya está", "pasa") | Respeta. Cierra el wizard antes de que abandone |

### Cuando una dimensión no aplica

- Usuario es solo curioso, sin negocio activo → marca `avatar: "curioso"`, salta dimensiones 3-6 con "(no aplica todavía)", marca operator-state.
- Usuario tiene varios negocios paralelos → captura el principal en `work.md`, anota los otros en sección "Negocios paralelos" sin profundizar (eso es para deep-dive).

## Técnicas conversacionales permitidas

Lee [`references/tecnicas-conversacionales.md`](references/tecnicas-conversacionales.md) para el detalle de cada una con ejemplos en castellano.

Repertorio mínimo:
1. **Pedir ejemplo concreto** — "dame un ejemplo de la última semana"
2. **5 whys ligero** — máximo 2 niveles de profundidad
3. **Inversión** — "y si no consigues eso, ¿qué pasa?"
4. **Espejo corto** — "entonces lo principal es X. ¿Vamos a Y?"
5. **Anclaje temporal** — "¿esto te pasaba hace un año también?"

## Anti-formulario (prohibido explícitamente)

- ❌ Decir "pregunta 3 de 10" o cualquier numeración visible al usuario
- ❌ Anunciar la siguiente pregunta antes de hacerla
- ❌ Hacer 2 preguntas en el mismo turno (excepto al inicio: "¿cómo te llamas y dónde vives?")
- ❌ Listas de bullets en TUS respuestas durante la entrevista (solo al cerrar el resumen final)
- ❌ Repetir literalmente la respuesta del usuario "para confirmar" (suena a bot)
- ❌ Anunciar "ahora pasamos al bloque B" — los bloques son interna del wizard, no del usuario
- ❌ Usar emojis (excepto en el cierre final, ahí están permitidos)

## Process

### Paso 1 · Apertura

Mensaje exacto:

```
Bienvenido a iAmasters OS.

Antes de generarte nada, necesito conocerte un poco. No es un
formulario — es una conversación rápida. Te pregunto, me cuentas,
y si algo me parece interesante te pido más detalle.

Tarda ~10 minutos y solo se hace una vez. Al cerrar te genero
tu primer entregable real para que veas el sistema funcionando.

¿Empezamos? Dime tu nombre y dónde vives.
```

Espera respuesta. NO esperes "sí/vamos/ok" — la apertura ya pide datos.

### Paso 2 · Entrevista adaptativa

Recorre las 8 dimensiones en este orden lógico (pero NO lo anuncies al usuario):

1. **Identidad** (nombre + 1 frase pro) — sale de la respuesta a la apertura. Si solo dio nombre y ciudad, pregunta la frase pro.
2. **Ubicación + idioma** — ya está si dijo ciudad. Si no, pregúntala.
3. **Negocio principal** — "¿A qué te dedicas? Cuéntamelo como se lo contarías a alguien en una cena."
4. **Modelo de ingresos** — derivado del paso 3. Si no quedó claro, "¿de qué viene el dinero hoy? Servicios, productos, suscripciones, mix..."
5. **Cliente ideal** — "Pinta a tu cliente perfecto. Sector, tamaño, momento en el que llegan a ti, lo que sea." Aplica reglas de profundización si la respuesta es genérica.
6. **Stack diario** — "¿Con qué herramientas trabajas día a día? Las imprescindibles."
7. **Foco del mes** — "¿En qué estás centrado ESTE mes? Si tuvieras que elegir 2-3 cosas que llevarte por delante."
8. **Objetivo 12 meses** — "Mírate dentro de 12 meses. ¿Qué tiene que pasar para que digas 'el año mereció la pena'?"

Para cada respuesta, aplica las **reglas de profundización**. Sigue las **técnicas conversacionales**. Respeta el **anti-formulario**.

**Importante**: si una respuesta cubre 2 dimensiones de golpe (ej. el usuario en el paso 3 ya menciona su modelo de ingresos), márcalas ambas como capturadas y pasa a la siguiente sin cubrir.

### Paso 3 · Escritura de archivos sectorizados

Solo cuando las 8 dimensiones tienen dato sólido, escribe los archivos. **Nunca durante la entrevista**.

Estructura de cada archivo: ver [`references/dimensiones-express.md`](references/dimensiones-express.md) sección "Plantillas de output".

Archivos a crear:
- `context/me.md` (dimensiones 1-2)
- `context/work.md` (dimensiones 3-6)
- `context/current-priorities.md` (dimensión 7)
- `context/goals.md` (dimensión 8)

También inicializa con header canónico (si no existen):
- `context/team.md` (vacío, indica que se llena en deep-dive o cuando contrate)
- `context/decisions-log.md` (header inspirado en second-brain de Luis Pitik)
- `context/learnings.md` (header)
- `context/soul.md` (personalidad del agente — copia el bloque estándar)

### Paso 4 · Configuración técnica rápida

3 preguntas seguidas (estas SÍ son rápidas y directas — son técnicas, no exploratorias):

1. "¿Tu nivel técnico? Cero (nunca tocaste terminal) / intermedio / avanzado"
2. "¿Idioma de outputs hacia tus clientes? Castellano / inglés / bilingüe / otro"
3. "¿Tienes Firecrawl API key? Si no, te la salto y el sistema funciona igual con fallback manual."

Guarda en `~/.claude/skills/_operator-state.json`:
- `needsOnboarding: false`
- `onboardingDate: <fecha actual>`
- `welcomeCompleted: false`
- `deepDiveCompleted: false`  ← NUEVO en v0.5
- `firecrawlAvailable: true|false`
- `cognitoMode: "guiado"` (default; puede cambiarse después con `/cognito-mode`)
- `technicalLevel: <respuesta>`
- `clientOutputLanguage: <respuesta>`

Si nivel técnico = cero: ajusta `.claude/settings.json` para permisos más conservadores y plan-mode por defecto.

### Paso 5 · Lanzamiento de welcome-quick-win

Mensaje:

```
🎉 Setup mínimo completo. Tengo:

  ✓ Tu identidad y dónde estás
  ✓ Tu negocio principal y a quién sirves
  ✓ Tu stack diario
  ✓ Tu foco este mes y tu meta a 12 meses

Voy a generarte tu primer entregable real ahora. ~5 min. Te queda
un HTML compartible.

¿Vamos?
```

Si "sí": invoca skill `welcome-quick-win`.
Si "no" o "después": cierra el wizard, marca `welcomeCompleted: false` (se disparará en la siguiente sesión).

### Paso 6 · Anuncio de la deep-dive

Tras `welcome-quick-win` (o si el usuario dijo "después"), mensaje de cierre:

```
Última cosa antes de cerrar.

Lo de hoy ha sido el mínimo. El sistema ya funciona, pero te
conoce todavía superficialmente. Si quieres que los outputs salgan
realmente en tu voz y con tu criterio, hay una skill que se llama
`meta-deep-dive` que profundiza otras 20-25 áreas: tus ritmos, tu
modelo financiero, tu equipo, tus miedos, tu definición de éxito.

Tarda ~25 minutos. Lo recomiendo para mañana o pasado, no hoy
(estás cansado y eso se nota en las respuestas).

Cuando quieras, ejecuta:  /deep-dive

Te aviso desde `/start-here` cada vez que abras Claude, hasta que
la completes.

Suerte. Nos vemos mañana.
```

### Paso 7 · Cierre técnico

- Append en `~/.claude/skills/_daily-summaries/<TODAY>.md` resumen de la sesión inicial
- NO appends en `context/learnings.md` (queda limpio para skills reales)
- Operator-state queda con `needsOnboarding: false` + `deepDiveCompleted: false`

## Edge cases

- **Usuario abandona a mitad** (responde "para", "cierra", "no quiero seguir"): guarda progreso parcial en `operator-state.onboardingProgress: <dimensión última completada>`. Al volver, retoma desde donde se quedó.
- **Usuario es curioso sin negocio activo**: marca `avatar: "curioso"`, salta dimensiones 3-6, captura solo identidad + ubicación + objetivo (lo que tenga). Anota "Sin negocio activo todavía. Cuando lo tengas, reejecuta el wizard."
- **Usuario contesta todo en 1 párrafo gigante**: extrae las 8 dimensiones de ese párrafo. NO le pidas que lo desglose. Solo profundiza dimensiones que quedaron débiles.
- **Usuario nivel técnico = cero y se siente perdido**: simplifica lenguaje. Ofrece ejemplos concretos antes de cada pregunta nueva. Usa más "espejo corto" como técnica.
- **Firecrawl no proporcionada**: marca `firecrawlAvailable: false`. `welcome-quick-win` pedirá contenido manual con fallback graceful.

## Outputs (al cerrar correctamente)

- `~/.claude/skills/_operator-state.json` actualizado
- `context/me.md`, `work.md`, `current-priorities.md`, `goals.md` rellenados
- `context/team.md`, `decisions-log.md`, `learnings.md`, `soul.md` inicializados con header
- `projects/welcome/` directorio creado
- `.env` con Firecrawl API key si se proporcionó
- `.claude/settings.json` ajustado según nivel técnico
- `~/.claude/skills/_daily-summaries/<TODAY>.md` con entrada inicial

## Skills que llama

- **`welcome-quick-win`** — en el Paso 5, para generar primer entregable

## Skills que recomienda al cerrar

- **`meta-deep-dive`** — para profundizar las 22 dimensiones restantes (anunciada en Paso 6)
