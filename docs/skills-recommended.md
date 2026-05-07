# Skills recomendadas (lista curada externa)

> Lista de skills externas que NO vienen instaladas por defecto pero merecen consideración.
>
> Última revisión: 2026-05-07

Para instalar cualquiera:

```
/install-skill <github-url>
```

El comando ejecuta `bash scripts/validate-skill.sh` y verifica estructura antes de instalar.

---

## Cómo elegir skills externas

Antes de instalar una skill nueva, hazte estas preguntas:

1. **¿Resuelve un problema que tengo recurrente?** Si solo lo necesitas 1 vez, usa Claude vanilla.
2. **¿La skill ya está cubierta por otra que tengo?** Skills que se solapan = canibalización (ninguna se activa cuando debe).
3. **¿La descripción es específica?** Si dice "ayuda con marketing" sin más, no se va a activar bien.
4. **¿Hay alternativa más barata en tokens?** Slash command custom puede valer.
5. **¿El autor es de confianza?** Skills de Anthropic / repos conocidos / autores con track record.

**Regla sólida**: nunca tener más de 30 skills activas. Mejor 20 curadas que 200 mediocres.

---

## ⭐ Recomendadas para todos los avatares

### anthropic-skills:skill-creator
**Repo**: https://github.com/anthropics/skills (oficial Anthropic)
**Para qué**: el skill-creator oficial. Útil si quieres comparar con `meta-skill-creator` de iAmasters OS.
**Conflicto**: sí, con `meta-skill-creator` local. Decide cuál mantener.

### anthropic-skills:visual-explainer
**Repo**: https://github.com/anthropics/skills
**Para qué**: genera HTML auto-contenido para explicar visualmente conceptos, diffs, plans.
**Cuándo invocar**: "explícame esto visualmente" / "genera diagrama de X".
**Tokens**: medio (output puede ser grande).

### anthropic-skills:pdf
**Repo**: https://github.com/anthropics/skills
**Para qué**: lectura/extracción/edición de PDFs. Combinar, dividir, rotar, marcar.
**Cuándo invocar**: cualquier flujo con PDFs.
**Conflicto**: no.

### anthropic-skills:docx
**Repo**: https://github.com/anthropics/skills
**Para qué**: crear/leer/editar archivos .docx (Word).
**Cuándo invocar**: entregables word para clientes que viven en Office.
**Conflicto**: no.

### anthropic-skills:xlsx
**Repo**: https://github.com/anthropics/skills
**Para qué**: spreadsheets — leer, editar, calcular fórmulas en .xlsx/.csv/.tsv.
**Cuándo invocar**: análisis de data en Excel/CSV.
**Conflicto**: no.

---

## 🎯 Para avatar marketing / contenido

### content-strategy
**Para qué**: planning estratégico de qué contenido crear (no copy).
**Combina con**: marketing-content-repurposing.

### social-content
**Para qué**: optimizar posts existentes para LinkedIn, Twitter, IG, TikTok.
**Conflicto**: parcial con marketing-copywriting. Decide cuál usas.

### email-marketing-bible
**Para qué**: knowledge base masivo (908 fuentes) sobre email marketing. Útil para diagnósticos de deliverability, automation flows.
**Tokens**: alto (es base de conocimiento extensa).

### copywriting (genérica)
**Para qué**: copywriting comercial focalizado en conversión.
**Conflicto**: alto con marketing-copywriting de iAmasters OS. NO instalar a menos que sea muy diferenciado.

### ad-creative
**Para qué**: generar variaciones de copy de anuncios — headlines, descripciones, primary text.
**Combina con**: marketing-copywriting + paid-ads.

---

## 📊 Para avatar operations / strategy

### marketing-psychology
**Para qué**: aplicar principios psicológicos a copy/comunicación. Cognitive biases, persuasión, behavioral science.
**Tokens**: medio.

### product-management:write-spec
**Para qué**: escribir feature specs / PRDs desde un problema.
**Avatar**: si haces consultoría B2B con producto.

### saas-revenue-growth-metrics
**Para qué**: calcular MRR, churn, NRR, expansion. Para clientes SaaS.
**Avatar**: consultoría B2B SaaS o agencia con clientes SaaS.

### operations:process-optimization
**Para qué**: analizar y mejorar procesos. Trigger: "este proceso es lento", "cómo agilizar".

### operations:risk-assessment
**Para qué**: identificar y mitigar riesgos operativos.
**Avatar**: consultor B2B.

---

## 🛠 Para avatar técnico / dev

### nextjs-best-practices
### nextjs-app-router-patterns
### nextjs-seo
### nextjs-supabase-auth
**Para qué**: específicas de Next.js. Si construyes con Next.js, las 4 son útiles.

### vercel-deployment
**Para qué**: best practices de deploy en Vercel.

### tailwind-design-system
**Para qué**: construir design systems con Tailwind v4.

### api-security-best-practices
**Para qué**: hardening APIs (auth, rate limiting, input validation).

### web-security-audit
**Para qué**: auditoría tipo pentest black-box. 70+ tests OWASP. Genera report HTML.
**Avatar**: dev / consultor seguridad.

---

## ⚠️ Skills a EVITAR

### Skills sin description clara
Si la description tiene <50 chars o no especifica cuándo activar, va a competir mal contra otras y nunca se invocará bien. Lo confirma el script de Anthropic: descripciones malas activan correctamente solo 1/5 veces.

### Skills duplicadas
No instales 3 skills de copywriting. Una buena (la tuya o una externa) es mejor.

### Skills que prometen "todo en uno"
"Marketing Suite", "Content Master Pro", "Business Genius". Suelen ser wrappers genéricos. Skills específicas y atómicas funcionan mejor.

### Skills auto-generadas sin track record
Si la skill fue generada por LLM sin uso real, suele tener problemas de progressive disclosure (todo en SKILL.md, sin references/).

---

## Cómo contribuir nuevas recomendaciones

Para que añadamos una skill a esta lista:

1. Probarla en producción mínimo 1 mes
2. Documentar:
   - Casos donde aporta valor real
   - Avatar(s) que se beneficia
   - Conflictos con skills nuestras
   - Token cost aproximado
3. Submit PR con la entrada en categoría apropiada

No aceptamos "parece útil, instalad esto" sin experiencia real.

---

## Token budget de skills

Cada skill activa añade su `name + description` al system prompt. Aprox:
- 30 chars name + 200 chars description = ~60 tokens por skill
- 30 skills activas = ~1.800 tokens base solo de descripciones

Cuando alguna se activa (Claude lee SKILL.md completo): 500-2.500 tokens extra por skill.

**Regla práctica para v0**: 18-22 skills activas. Por encima ya hay riesgo de canibalización.

---

## Lista corta para empezar (post-instalación de iAmasters OS)

Si acabas de instalar iAmasters OS y quieres extender, este es el orden sugerido para añadir skills externas (de Anthropic, son seguras y bien hechas):

1. `anthropic-skills:pdf` — útil casi siempre
2. `anthropic-skills:docx` — para entregables Word
3. `anthropic-skills:xlsx` — para análisis de Excel/CSV
4. `anthropic-skills:visual-explainer` — para explicaciones visuales
5. *(según avatar marketing)* `ad-creative` o `social-content`
6. *(según avatar tech)* `nextjs-best-practices` + relacionadas

Después: experimenta. Si algo no se activa bien tras 1 semana, desinstala.
