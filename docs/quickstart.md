# Quickstart — primeros 30 minutos con iAmasters OS

> Para alguien que clonó el repo, ejecutó `bash scripts/install.sh` y abrió Claude Code dentro del repo.

## Árbol de decisión

### ¿Es tu primera vez?

Ejecuta `/install`.

Activa el install gate, completa el onboarding wizard y genera tu primer entregable con `welcome-quick-win`.

Outputs esperados: `~/.claude/skills/_operator-state.json`, archivos de `context/` y primer HTML en `projects/welcome/`.

### ¿Ya está instalado y empiezas el día?

Ejecuta `/start-here`.

Carga memoria, prioridades y tareas abiertas antes de pedir trabajo nuevo.

### ¿Vienes de n8n o Make?

Pide: `Usa automation-n8n-to-claude para migrar este workflow`.

Pega el JSON/export o describe el escenario.

### ¿Quieres crear contenido con tu voz?

Primero: `Ejecuta marketing-brand-voice con mi web y LinkedIn`.

Después: `Usa marketing-copywriting para escribir 3 posts de LinkedIn sobre <tema>`.

### ¿Trabajas para varios clientes?

Ejecuta `/add-client`.

Luego lee `docs/multi-client-guide.md`.

### ¿Quieres crear tu propia skill?

Lee `docs/skill-creation-guide.md`.

### ¿Algo va mal?

Ejecuta `/doctor`. Fuera de Claude Code: `bash scripts/install.sh --resume`.

## Primeros 30 minutos

0-5: onboarding wizard.  
5-15: `marketing-brand-voice` para voice profile, registros A/B/C, positioning e ICP.  
15-25: primera tarea real.  
25-30: `/wrap-up` para registrar entregables, decisiones y aprendizajes.

Ejemplos:

```text
Escribe 3 versiones de post LinkedIn sobre <tema>.
Repurposea esta clase para redes.
Genera un HTML compartible explicando esta decisión.
```

## Tu primera semana con el OS

| Día | Qué probar | Resultado esperado |
|---|---|---|
| 1 | `/install` + `welcome-quick-win` | Primer entregable compartible |
| 2 | `marketing-brand-voice` | Voz, registros, positioning e ICP |
| 3 | `marketing-copywriting` | 2-3 piezas listas para revisar |
| 4 | `automation-n8n-to-claude` | Primer workflow traducido o documentado |
| 5 | `/add-client` | Un cliente separado con contexto propio |
| 6 | `tool-visual-explainer` | HTML autocontenido para explicar una idea |
| 7 | `/start-here` + `/wrap-up` | Rituales diarios consolidados |

## Comandos básicos

`/install` completa instalación y onboarding.  
`/start-here` inicia el día con memoria y prioridades.  
`/wrap-up` cierra sesión con decisiones y aprendizajes.  
`/add-client` crea un cliente nuevo.  
`/doctor` diagnostica el OS.  
`/system-status` muestra el dashboard Sinapsis.

## Cuándo no usar el OS

- Para editar el código de una app: abre Claude Code en la carpeta de esa app.
- Para una prueba que no quieres guardar en memoria: usa otra carpeta.
- Para una tarea de menos de 2 minutos: quizá hay más fricción que valor.

## Siguiente lectura

`docs/multi-client-guide.md` para multi-cliente.  
`docs/skill-creation-guide.md` para crear skills propias.  
`docs/install-state-schema.md` para entender el install gate.
