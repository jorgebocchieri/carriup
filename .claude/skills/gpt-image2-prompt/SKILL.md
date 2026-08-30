---
name: gpt-image2-prompt
description: Entrevista al usuario y construye prompts de máxima calidad y detalle para el modelo de imagen gpt-image-2 de OpenAI (generación, edición, inpainting, composición multi-imagen, logos, packshots, infografías, mockups de UI). Úsala cuando alguien quiera crear, mejorar o depurar un prompt de imagen para GPT Image 2 / gpt-image-2 / ChatGPT Images 2.0, o pida "un prompt para generar una imagen". No la uses para prompts de video ni para modelos que no sean GPT Image.
---

# Constructor de prompts para gpt-image-2

Convierte una idea vaga ("quiero una foto de un carrito de supermercado")
en un prompt de producción para `gpt-image-2`, con parámetros de API incluidos.

**Regla central: no entregas el prompt hasta estar 99% seguro.** La entrevista
no es un trámite; es el trabajo. Un prompt entregado con huecos produce una
imagen que el usuario descarta, y el costo de una pregunta más es siempre
menor que el de una generación fallida.

## Flujo

### 0. Recibe la idea inicial

El usuario ya dio su idea. No preguntes nada todavía: primero **lee**
`references/checklist.md` y clasifica el encargo en uno de los cinco modos:

| Modo | Cuándo | Referencia extra |
|---|---|---|
| `generate` | Imagen desde cero | `references/patterns.md` §Generación |
| `edit` | Modificar una imagen existente | `references/patterns.md` §Edición |
| `inpaint` | Cambiar una región con máscara | `references/patterns.md` §Edición |
| `compose` | Combinar 2+ imágenes de referencia | `references/patterns.md` §Composición |
| `debug` | Ya tiene un prompt y falla | `references/patterns.md` §Diagnóstico |

Luego di en 1–2 líneas qué entendiste y qué te falta. Nada más.

### 1. Entrevista por rondas

Usa **AskUserQuestion**, en rondas de 2–4 preguntas, con opciones concretas
y una recomendación marcada `(Recomendado)` en primer lugar. El usuario
siempre puede escribir "Other".

Reglas de la entrevista:

- **Nunca preguntes lo que ya dedujiste.** Si dijo "packshot para e-commerce",
  ya sabes fondo transparente y encuadre centrado: confírmalo como supuesto,
  no como pregunta.
- **Ofrece opciones visuales, no abstractas.** Mal: "¿qué estilo quieres?".
  Bien: "luz dura de mediodía con sombras marcadas" vs "luz difusa de estudio
  con caída suave".
- **Máximo 4 rondas.** Si al cierre de la ronda 4 quedan huecos, resuélvelos
  con supuestos declarados en vez de seguir preguntando.
- **Una ronda por eje de riesgo.** El orden por defecto está en
  `references/checklist.md`; sáltate los ejes que el encargo ya cierra.

Ejes obligatorios antes de cerrar (los 5 primeros nunca se asumen en silencio
si el encargo es `generate`):

1. **Uso final y medio** — anuncio, editorial, packshot, mockup de UI,
   infografía, ilustración. Define el nivel de pulido.
2. **Texto en imagen** — ¿lleva? Si sí, **copia literal, entre comillas**,
   deletreada si es marca o palabra rara.
3. **Encuadre y tamaño** — plano, ángulo, y el `size` exacto de la API.
4. **Luz y paleta** — fuente, dureza, hora, temperatura de color.
5. **Sujeto e identidad** — qué es exactamente, materiales, escala, pose.
6. **Fondo y contexto** — transparente, escena, superficie, profundidad.
7. **Prohibiciones** — qué NO debe aparecer (marcas, watermarks, texto extra).
8. **Realismo vs estilo** — fotográfico real, render 3D, ilustración, y con
   qué imperfecciones creíbles.

En modos `edit` / `inpaint` / `compose` sustituye los ejes 5–6 por:
**qué cambia** y **qué se preserva literalmente** (rostro, pose, geometría,
encuadre, luz, texto, layout). Ver `references/patterns.md`.

### 2. Puerta del 99%

Antes de escribir el prompt, evalúa en silencio contra
`references/checklist.md`. Solo cruzas la puerta si:

- Todos los ejes aplicables están **resueltos o asumidos explícitamente**.
- La copia de texto está en literal exacto, si aplica.
- Sabes `size`, `quality`, `background`, `output_format` y `n`.
- Puedes describir la imagen final sin usar ni una palabra vaga
  ("bonito", "moderno", "impactante", "épico").

Si falla algo y aún tienes rondas, pregunta. Si no, **declara el supuesto**
en el resumen previo y sigue.

Antes del entregable, muestra un **resumen de confirmación** en 8–10 bullets
(uso, sujeto, escena, luz, encuadre, texto literal, paleta, prohibiciones,
parámetros) y pide un OK explícito. Si el usuario corrige algo, aplica y
vuelve a mostrar el resumen. **El prompt se entrega solo después del OK.**

### 3. Entregable

Siempre estas cuatro piezas, en este orden:

**a) Prompt final** — en bloque de código, en inglés (el modelo rinde mejor
y así se pega directo a la API), estructurado en segmentos etiquetados:

```
Scene: ...
Subject: ...
Details: ...
Text: "..." — rendered verbatim, exactly once
Camera & Light: ...
Style & Use: ...
Constraints: ...
```

Orden canónico de OpenAI: **escena → sujeto → detalles → uso → restricciones**.
Segmentos etiquetados y saltos de línea, nunca un párrafo único largo.

**b) Parámetros de API** — snippet listo para correr:

```python
client.images.generate(
    model="gpt-image-2",
    prompt=PROMPT,
    size="1536x1024",
    quality="high",
    background="auto",
    output_format="png",
    n=1,
)
```

**c) Justificación breve** — 3–5 bullets: por qué ese `size`, por qué ese
`quality`, qué decisión de la entrevista fijó qué parte del prompt.

**d) Plan de iteración** — 2–3 ediciones de un solo cambio, ya redactadas,
por si la primera pasada no cierra. Cada una con su lista de preservación.

## Reglas de calidad del prompt

Estas no son opcionales; son la diferencia entre un prompt bueno y uno inútil.

- **Hechos visuales, no elogios.** "brushed aluminum, overcast daylight,
  soft bounce fill" en vez de "stunning, premium, masterpiece". Los
  adjetivos de admiración no aportan píxeles.
- **Detalle máximo = detalle específico.** Texturas (poros, hilos, rayones),
  desgaste creíble, imperfecciones, migas en la mesa, huellas en el vidrio.
  Un objeto perfecto lee como render; el desgaste ordinario lee como foto.
- **Fotorrealismo:** di "photorealistic" o "real photograph taken on a real
  camera", pide textura real y evita palabras de estudio/pulido. Las specs
  de lente (50mm, f/1.8) orientan el look, no simulan óptica exacta.
- **Texto literal entre comillas o en MAYÚSCULAS**, con tipografía, tamaño,
  color y posición. Marcas o palabras raras: deletréalas letra por letra.
  Exige "rendered verbatim, no extra characters, exactly once".
- **Composición explícita** cuando importe: "logo top-right",
  "subject occupies the left third", "eye-level", "top-down".
- **Personas:** encuadre corporal, escala relativa, mirada e interacción con
  objetos ("full body, feet included", "hands gripping the handlebars").
  Esto arregla proporciones y geometría de la acción.
- **Prohibiciones explícitas**: "no watermark, no extra text, no logos or
  trademarks, no duplicate limbs".
- **En ediciones**: "change only X" + "keep everything else identical", y
  **repite la lista de preservación en cada iteración** para evitar deriva.
- **Iteración de un solo cambio.** Nunca "hazlo más premium y más realista y
  más cinematográfico" — eso destruye lo que ya funcionaba.

## Elección de parámetros

Consulta `references/model-spec.md` para la tabla completa. Atajos:

- `quality="high"` es el default de esta skill (el encargo pide máxima
  calidad). Obligatorio con texto pequeño, infografías densas, retratos en
  primer plano, ediciones sensibles a identidad y salidas de alta resolución.
- `size`: `1024x1024` general, `1536x1024` landscape, `1024x1536` retrato,
  `2560x1440` límite fiable de alta resolución, `3840x2160` experimental.
  Restricciones duras: borde máx <3840px, ambos bordes múltiplos de 16,
  ratio máx 3:1, total de píxeles entre 655.360 y 8.294.400.
- `background="transparent"` exige `output_format="png"` o `"webp"`
  (jpeg no soporta alfa) y pedir explícitamente sujeto aislado sin escenario,
  sin fondo sólido, sin cuadriculado y sin sombras no deseadas.
- `input_fidelity` **no existe en gpt-image-2** (la fidelidad ya es alta por
  defecto); no lo pongas en el snippet.
- `n>1` para explorar variantes de logo o concepto.

## Errores que esta skill no comete

- Entregar el prompt en la primera respuesta sin entrevistar.
- Preguntar cosas que el usuario ya respondió.
- Devolver un párrafo denso sin segmentos etiquetados.
- Omitir la lista de restricciones (el hueco más común y más caro).
- Inventar texto en imagen que el usuario no dictó literalmente.
- Recomendar `quality="low"` cuando el objetivo declarado es máxima calidad.
