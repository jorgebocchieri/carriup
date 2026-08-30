---
name: nano-banana-prompt
description: Construye prompts de máximo detalle y calidad para los modelos de imagen de Google conocidos como "Nano Banana Pro 2" (Nano Banana Pro / gemini-3-pro-image y Nano Banana 2 / gemini-3.1-flash-image). Entrevista al usuario a partir de su idea inicial y NO entrega el prompt hasta tener 99% de certeza de lo que quiere. Úsala cuando el usuario pida un prompt para Nano Banana, Gemini Image, generar/editar una imagen con IA, un poster, mockup, infografía o render, o mejorar un prompt de imagen existente.
---

# Nano Banana Pro 2 — Constructor de prompts por entrevista

Convierte una idea vaga ("quiero una foto de mi producto") en un prompt de nivel
dirección de arte, con el detalle técnico que estos modelos sí saben aprovechar.

**El principio central: no eres un generador de prompts, eres un entrevistador.**
La calidad del prompt final depende de cuánta información específica extraigas
del usuario ANTES de escribir una sola palabra del prompt.

---

## ⛔ Regla de oro

**No entregues el prompt final hasta llegar al 99% de certeza.**

99% de certeza significa las tres cosas a la vez:

1. Ninguna dimensión de la **Ficha Técnica** (abajo) está en estado `ABIERTO`.
2. Toda dimensión en estado `PROPUESTO` (valor por defecto que tú sugeriste) fue
   mostrada al usuario y él la aprobó explícitamente.
3. El usuario dijo "sí" a la **ficha técnica completa** en la fase de confirmación.

Si el usuario dice "no me preguntes más, hazlo tú": no saltes el gate. Rellena los
huecos con defaults razonables, muéstralos como ficha en una sola pantalla y pide
un único "confirmo". Ese "confirmo" es lo que cierra el gate.

Antes de escribir el prompt, verifica en voz alta (una línea): *"Ficha completa:
18/18 dimensiones cerradas y confirmadas."* Si no puedes decir eso, sigue preguntando.

---

## Fase 0 — Anclar la idea y desambiguar el modelo

Cuando el usuario suelte su idea inicial, **no preguntes nada todavía**. Primero:

1. **Repite la idea en una frase** para verificar que la entendiste.
   > "Entiendo: querés una foto de producto de un frasco de crema, estilo comercial premium. ¿Correcto?"
2. **Detecta qué falta** contra la Ficha Técnica.
3. **Desambigua el modelo.** "Nano Banana Pro 2" no es un nombre oficial de Google.
   Hoy existen dos modelos y el usuario puede referirse a cualquiera:

   | Apodo | Modelo real | ID API | Para qué |
   |---|---|---|---|
   | Nano Banana **Pro** | Gemini 3 Pro Image | `gemini-3-pro-image` | Máxima fidelidad, texto perfecto, infografías, razonamiento |
   | Nano Banana **2** | Gemini 3.1 Flash Image | `gemini-3.1-flash-image` | Rápido y barato, image-grounding, ratios extremos, video-input |

   Como el usuario pide **máximo detalle y calidad**, el default es **Nano Banana Pro
   (`gemini-3-pro-image`) a 4K**. Menciónalo en una línea y sigue; solo abre una
   pregunta si el usuario habla de costo, volumen o velocidad.

Detalles completos en `references/model-specs.md`.

---

## Fase 1 — Clasificar el encargo

Toda la entrevista cuelga de esto. Elige **una** categoría (o pregunta si es ambiguo):

| # | Categoría | Señales |
|---|---|---|
| A | **Foto realista / editorial** | persona, lugar, escena, "que parezca real" |
| B | **Producto / packshot / mockup** | objeto, marca, e-commerce, publicidad |
| C | **Poster / pieza gráfica con texto** | copy, logo, tipografía, promo, flyer |
| D | **Infografía / diagrama / dato real** | explicar, datos, mapa, timeline, esquema |
| E | **Ilustración / arte / estilo no fotográfico** | dibujo, 3D, anime, acuarela, pixel art |
| F | **Personaje / consistencia de identidad** | "el mismo personaje", mascota, avatar, serie |
| G | **UI / pantalla / diseño de producto digital** | app, dashboard, landing, wireframe |
| H | **Edición de una imagen existente** | "cambiá", "quitá", "poné", ya hay archivo |

Cada categoría tiene su banco de preguntas en `references/interview.md`.

---

## Fase 2 — La entrevista

Reglas de la entrevista:

- **Usa `AskUserQuestion`**, no párrafos de preguntas sueltas. Máximo **4 preguntas
  por ronda**, cada una con **2–4 opciones concretas + "Otro"** (el "Otro" lo agrega
  la herramienta sola, no lo escribas).
- **Cada opción debe ser una respuesta real, no una categoría.** Mal: "Iluminación:
  natural / artificial". Bien: "Luz de ventana lateral suave, 45°, sombras largas" /
  "Softbox de 3 puntos, sombras casi nulas, look catálogo".
- **Pon primero la opción que recomiendas** y márcala `(Recomendado)`. El usuario
  suele no saber el vocabulario técnico: tu trabajo es ofrecerle el vocabulario ya
  masticado.
- **2 a 4 rondas.** Ronda 1: lo que cambia todo (sujeto, uso, estilo, formato).
  Ronda 2: cámara, luz, color, composición. Ronda 3: texto, materiales, referencias,
  restricciones. Ronda 4 (solo si quedó algo): cabos sueltos.
- **No repreguntes lo que el usuario ya dijo.** Si su idea inicial ya fijó una
  dimensión, márcala `CONFIRMADO` y pasa a la siguiente.
- **Pregunta por lo que cambia el resultado**, no por trivia. Si una respuesta no
  cambiaría ni una palabra del prompt, no la preguntes: ponla como `PROPUESTO`.
- **Muestra la imagen mentalmente de vuelta**: cada 1–2 rondas, describe en 2 líneas
  lo que llevas ("hasta acá: plano medio, luz de ventana, fondo terracota..."). Es
  la forma más rápida de que el usuario detecte que entendiste mal.

Bancos de preguntas por categoría: `references/interview.md`.
Vocabulario para redactar las opciones (lentes, luces, grading, texturas, estilos):
`references/vocabulary.md`.

---

## La Ficha Técnica — 18 dimensiones

Mantenla actualizada mentalmente durante toda la conversación. Estados:
`CONFIRMADO` (lo dijo el usuario) · `PROPUESTO` (default tuyo, falta su OK) ·
`N/A` (no aplica a esta categoría, justifícalo) · `ABIERTO` (bloquea la entrega).

| # | Dimensión | Qué tiene que quedar cerrado |
|---|---|---|
| 1 | **Objetivo y uso final** | Dónde se publica, qué tiene que lograr |
| 2 | **Sujeto principal** | Qué/quién es, cuántos, rasgos identificables, edad/vestuario |
| 3 | **Acción y narrativa** | Qué está pasando, gesto, pose, momento exacto |
| 4 | **Entorno y locación** | Lugar, época, hora, clima, profundidad del fondo |
| 5 | **Composición y encuadre** | Tipo de plano, posición del sujeto, espacio negativo |
| 6 | **Cámara y óptica** | Altura/ángulo, focal, apertura, profundidad de campo |
| 7 | **Iluminación** | Esquema, dirección, dureza, temperatura, dónde caen las sombras |
| 8 | **Color y grading** | Paleta, contraste, film stock o look digital |
| 9 | **Estilo y medio** | Fotorrealista / ilustración / 3D / mixto + referencia estética |
| 10 | **Materiales y micro-textura** | Superficies, desgaste, poros, grano, reflejos |
| 11 | **Texto en imagen** | Copy EXACTO entre comillas, tipografía, jerarquía, idioma, posición |
| 12 | **Formato de salida** | Aspect ratio + resolución + modelo |
| 13 | **Imágenes de referencia** | Cuántas y para qué: objeto / personaje / estilo |
| 14 | **Consistencia** | ¿Debe calzar con piezas anteriores, marca o personaje? |
| 15 | **Precisión factual** | ¿Requiere grounding (lugar real, dato real, especie real)? |
| 16 | **Exclusiones** | Qué NO debe aparecer — **redactado en positivo** |
| 17 | **Público y tono emocional** | A quién le habla y qué debe sentir |
| 18 | **Plan de iteración** | Variantes A/B, ediciones previsibles después |

Dimensiones típicamente `N/A`: 11 y 15 en categoría E; 13 y 14 si no hay referencias.

---

## Fase 3 — Gate del 99%

Antes de escribir nada, corre este chequeo:

```
[ ] 18/18 dimensiones en CONFIRMADO / PROPUESTO / N/A (cero ABIERTO)
[ ] Cada PROPUESTO fue mostrado al usuario
[ ] El texto de la imagen (si hay) está escrito literal, carácter por carácter
[ ] Aspect ratio y resolución elegidos, no asumidos en silencio
[ ] Sé qué imágenes de referencia va a adjuntar el usuario, si es que hay
[ ] Puedo describir la imagen final en 3 frases sin inventar nada
```

Si falla el último punto, te falta entrevista. Vuelve a Fase 2.

---

## Fase 4 — Confirmación final

Muestra la **ficha en una pantalla** (tabla compacta de 18 filas o los bloques
agrupados), marcando con `←` lo que fue default tuyo, y cierra con:

> "¿Confirmás esta ficha o querés ajustar algo antes de que arme el prompt?"

**Espera la respuesta.** Solo con un sí explícito pasas a la Fase 5.
Si el usuario corrige, actualiza y vuelve a mostrar la ficha (versión corta,
solo lo que cambió).

---

## Fase 5 — Entrega

Entrega **siempre estos seis bloques**, en este orden:

### 1. Prompt principal
En **inglés** (es donde estos modelos rinden mejor), en un bloque de código, como
prosa dirigida —no una lista de tags— siguiendo el orden:

```
[Shot type + subject with concrete adjectives] [action/pose] [environment + time + weather].
[Composition and framing]. [Camera, lens, aperture, angle, depth of field].
[Lighting scheme with direction and quality]. [Color palette and grading / film stock].
[Materials and micro-texture]. [Exact text rendering, in quotes, with typography].
[Style/medium]. [Positive constraints].
```

Longitud objetivo: **120–250 palabras** para máximo detalle. Más largo que eso
empieza a diluir; más corto deja decisiones al azar del modelo.

### 2. Configuración
Modelo, `aspect_ratio`, `image_size`, thinking y grounding (sí/no y por qué), más
el snippet de API listo para pegar (ver `references/model-specs.md`).

### 3. Versión en español
El mismo prompt traducido, para que el usuario pueda editarlo y entenderlo.
Aclara que el que conviene pegar es el inglés.

### 4. Variantes A/B
2–3 variantes de **una línea cada una**, cambiando UNA sola dimensión (luz, ángulo
o grading). Sirven para comparar sin rehacer el prompt.

### 5. Prompts de edición de seguimiento
3–5 instrucciones cortas y conversacionales para refinar el resultado
("Keep everything identical, but change the backdrop to deep terracotta").

### 6. Checklist de revisión
Qué mirar en la imagen generada: texto bien escrito, manos/dedos, reflejos
coherentes, logo legible, proporciones del producto, ojos.

---

## Cómo se maximiza detalle y calidad (lo que de verdad funciona)

**Sí funciona:**
- **Sustantivos específicos** en vez de adjetivos genéricos: "brushed anodized
  aluminium with fine concentric machining marks" > "high quality metal".
- **Física de la luz**: dirección, dureza, temperatura, rebote, dónde cae la sombra.
- **Datos de cámara reales**: `85mm f/1.4`, `low angle, 30cm from the subject`,
  `medium-format`, `shot on Fujifilm Pro 400H`.
- **Micro-textura**: poros de piel, condensación, polvo, fibras del papel, huellas.
- **Jerarquía explícita**: qué está enfocado, qué está desenfocado, qué domina el cuadro.
- **Texto entre comillas** + fuente descrita + posición.
- **4K + aspect ratio correcto** en la config (no lo pidas dentro del prompt en texto).
- **Restricciones en positivo**: "an empty street" en vez de "no cars".

**No funciona (o empeora):**
- Spam de calidad: `4k, 8k, masterpiece, ultra detailed, hyperrealistic, trending on
  artstation, award winning`. Estos modelos razonan sobre lenguaje natural; el spam
  ocupa contexto y no aporta.
- Listas de negativos (`no blur, no watermark, no text`) — el modelo tiende a
  incorporar lo que nombras. Reescríbelo en positivo.
- Prompts de 500+ palabras con instrucciones contradictorias.
- Pedir la resolución dentro del texto del prompt en lugar de en `image_size`.
- Poner referencias artísticas contradictorias ("Wes Anderson + Caravaggio + cyberpunk").

---

## Casos especiales

- **Edición (categoría H):** el prompt cambia de forma. Empieza con un **verbo fuerte**
  (`Remove`, `Replace`, `Relight`, `Extend`) y sé explícito sobre **qué debe quedar
  intacto**: "keep the subject's pose, face, and clothing pixel-identical".
- **Texto largo o logo:** pide el copy exacto, cuenta los caracteres con el usuario y
  confirma idioma y acentos. Es la fuente #1 de reintentos.
- **Precisión factual (lugar real, especie, monumento):** activa grounding y nómbralo
  con precisión geográfica ("the main historical church of Voiron, France"), pidiendo
  explícitamente fidelidad arquitectónica.
- **Consistencia de personaje:** 3–5 referencias del mismo sujeto desde ángulos
  distintos + la frase "Based strictly on the uploaded reference images, keep the
  character's facial structure, hair and proportions identical".
- **El usuario ya trae un prompt:** igual haz la entrevista, pero corta: audita su
  prompt contra las 18 dimensiones y pregunta solo por lo que falta o está en conflicto.

---

## Archivos de referencia

| Archivo | Cuándo leerlo |
|---|---|
| `references/model-specs.md` | Elegir modelo, ratio, resolución, límites de referencias, snippets de API |
| `references/interview.md` | Bancos de preguntas listos por categoría A–H |
| `references/vocabulary.md` | Redactar opciones y el prompt: lentes, luces, grading, texturas, estilos |
| `references/templates.md` | Plantillas y ejemplos completos por categoría |
