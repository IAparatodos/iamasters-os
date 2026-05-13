---
description: Lanza la entrevista profunda de 22-25 dimensiones que termina de configurar el contexto del operador. Idempotente — retoma donde quedó la última vez.
---

# /deep-dive

Lanza la skill `meta-deep-dive`, que profundiza el contexto del operador en 22-25 áreas que el wizard inicial no cubrió: ritmos personales, salud financiera del negocio, equipo, decisiones pendientes, metas a 3 años, miedos, métricas y definición personal de éxito.

## Cuándo ejecutarla

- Después de instalar iAmasters OS (el wizard inicial te lo recomienda)
- Cuando el sistema te avise en `/start-here` que está pendiente
- Cuando los outputs del sistema empiecen a sentirse genéricos y quieras profundizar
- Tras un cambio importante en tu negocio o vida personal (relanzarla refresca el contexto)

## Cómo funciona

- Tarda ~25-30 minutos
- Es conversacional, no formulario — las preguntas se adaptan a tus respuestas
- Idempotente — si la pausas, retomas donde quedaste
- Branching condicional — si trabajas solo, el bloque equipo se reduce a 2 preguntas

## Process

1. Si `~/.claude/skills/_operator-state.json` tiene `needsOnboarding: true` → **no ejecutar**. Avisa al usuario: *"Primero pasamos por el onboarding inicial. Ejecuta lo que te dijo Claude al instalar."*
2. Si `deepDiveCompleted: true` y el usuario no pidió explícitamente refinar → **avisa**: *"Ya completaste el deep-dive. Si quieres refinar respuestas concretas, dime cuáles."*
3. Si `deepDiveProgress` existe (pausa anterior) → invoca `meta-deep-dive` en modo retomar.
4. En cualquier otro caso → invoca `meta-deep-dive` en modo arranque.

## Output

Al terminar, los archivos `context/me.md`, `soul.md`, `work.md`, `team.md`, `current-priorities.md`, `goals.md` quedan ampliados con secciones nuevas. `operator-state.deepDiveCompleted: true`.
