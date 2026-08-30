# Patrones de prompt para gpt-image-2

Todos los prompts finales van **en inglés** y con segmentos etiquetados.
Orden canónico: **escena → sujeto → detalles → uso → restricciones**.

## Generación

### Esqueleto universal
```
Scene: [lugar, superficie, hora, atmósfera, profundidad de fondo]
Subject: [qué, cuántos, materiales, estado, escala relativa]
Details: [texturas, desgaste, imperfecciones creíbles, elementos secundarios]
Text: "[copia literal]" — [tipografía, tamaño, color, posición], rendered
      verbatim, exactly once, no extra characters
Camera & Light: [plano, ángulo, lente aproximada, fuente de luz, dureza,
      dirección, temperatura, profundidad de campo]
Style & Use: [medio, uso final, nivel de pulido]
Constraints: [prohibiciones explícitas]
```

### Fotorrealismo
```
Create a photorealistic [sujeto] [acción].
[Detalles físicos: textura de piel, materiales, desgaste].
Shot like a [tipo de película/cámara], [encuadre], using [lente].
[Calidad de luz], [profundidad de campo], [grano], [balance de color].
Real photograph taken on a real camera, not a render. Natural imperfections.
Constraints: no watermark, no extra text, no logos.
```
Claves: pide poros, arrugas, hilos de tela, polvo, rayones. Evita
vocabulario de estudio pulido si buscas foto "de la vida real". Las specs de
lente orientan el look; no se simulan ópticamente.

### Packshot / producto e-commerce
```
Scene: fully transparent background, no scenery, no solid backdrop,
       no checkerboard, no drop shadow.
Subject: [producto] centered, crisp silhouette, clean alpha edges.
Details: preserve product geometry and label legibility exactly.
Text: label copy reads "[literal]" — legible, verbatim.
Camera & Light: three-quarter view, eye-level, soft even studio light,
       gentle specular highlights on [material].
Style & Use: e-commerce product photography.
Constraints: no halos or fringing, only light polishing, no added props.
```
API: `background="transparent"`, `output_format="png"`, `quality="high"`.

### Logo
```
Create an original, non-infringing logo for "[marca]", [descriptor].
The logo should feel [personalidad]. Use [enfoque visual: marca tipográfica,
monograma, símbolo abstracto]. Favor simplicity: readable at 24px.
Fully transparent background, clean alpha edges.
Constraints: no solid backdrop, no scenery, no checkerboard, no mockup frame,
no photographic texture, no existing brand resemblance.
```
API: `background="transparent"`, `n=4` para variantes.

### Anuncio / key visual
```
Give me a [estilo] ad for a brand called "[nombre]".
[Descriptor de marca]. The ad shows [escena/acción] with the tagline
"[copia exacta]".
Make it feel like [audiencia/vibra]: [cualidades visuales concretas].
Use [composición: regla de tercios, espacio negativo para copy, logo arriba
a la derecha].
Render the tagline exactly once, clearly and legibly.
Constraints: no watermark, no duplicate text, no placeholder lorem ipsum.
```

### Infografía / diagrama
```
Create a detailed infographic of [tema].
From [componente A], to [componente B], to [componente C].
Audience: [quién]. Lesson objective: [qué debe entenderse].
Layout: [columnas/flujo/timeline], labels: "[etiqueta 1]", "[etiqueta 2]".
Typography: [familia, jerarquía]. Palette: [colores].
Constraints: every label rendered verbatim, no invented data, no watermark.
```
API: `quality="high"` siempre; landscape (`1536x1024` o `2048x1152`).

### Mockup de UI / slide
Escríbelo **como spec de artefacto, no como pedido de ilustración**:
enumera pantalla, componentes, estados, copia literal de cada label.
API: `quality="high"`, landscape.

## Edición

Patrón obligatorio — separar lo que cambia de lo que se preserva:
```
Change only: [cambio único y concreto].
Preserve exactly: face and identity, body shape, pose, hair, expression,
       framing, camera angle, lighting direction and quality, background,
       geometry, all text and layout.
Do not change: saturation, contrast, arrows, labels.
Keep everything else identical to the input image.
Constraints: no extra objects, no redesign, no logo drift, no watermark.
```
Repite **la lista completa de preservación en cada iteración**. La deriva
aparece cuando se acorta.

Casos frecuentes:
- **Relight / clima**: cambia solo dirección y calidad de luz, sombras,
  atmósfera y precipitación. Preserva identidad, geometría, ángulo de cámara
  y colocación de objetos.
- **Swap de mobiliario**: cambia un solo objeto; preserva ángulo, luz y
  sombras; pide sombras de contacto fotorrealistas y textura de tela.
- **Try-on virtual**: bloquea persona (rostro, cuerpo, pose, pelo, expresión);
  cambia solo la prenda; exige caída, pliegues, oclusión y sombras coherentes.
- **Fondo transparente en edición**: repite "preserve the transparent
  background" o el modelo inventa fondo.

## Composición multi-imagen

Etiqueta cada entrada por índice y rol, y di cómo interactúan:
```
Image 1: product photo — the subject, preserve geometry and label text.
Image 2: style reference — apply its color grading and grain only.
Image 3: background plate — place the subject on the left third.
Apply Image 2's style to Image 1, composited onto Image 3.
Constraints: do not copy objects from Image 2, no duplicated subject.
```

## Consistencia de personaje (series, cuentos)

1. Genera un **character anchor**: una imagen que fija apariencia,
   proporciones, vestuario y tono.
2. En cada continuación, pasa esa imagen como input y añade:
   `Do not redesign the character. Keep proportions, outfit, palette and
   face identical. Change only the scene and pose.`

## Diagnóstico de prompts que fallan

| Síntoma | Causa habitual | Arreglo |
|---|---|---|
| Se ve a "render" / plástico | falta textura e imperfección | añade poros, desgaste, polvo, grano; di "real photograph" |
| Texto con errores | copia no literal o quality baja | comillas + deletreo + `quality="high"` + "verbatim, exactly once" |
| Texto duplicado | no se fijó cardinalidad | "rendered exactly once" |
| Composición inestable entre pasadas | no hay anclaje espacial | posiciones explícitas: "logo top-right", "subject on left third" |
| Aparecen objetos no pedidos | falta sección de restricciones | `Constraints:` con prohibiciones |
| La edición cambia de más | lista de preservación corta | repite la lista completa cada vez |
| Manos/proporciones raras | falta encuadre corporal e interacción | "full body, feet included", "hands gripping X" |
| Fondo transparente con sombra | no se prohibió | "no drop shadow, no backdrop, no checkerboard" |
| Resultados inconsistentes en 4K | por encima del umbral fiable | baja a `2560x1440` |

## Vocabulario prohibido

`stunning, epic, masterpiece, beautiful, amazing, gorgeous, breathtaking,
ultra, hyper, 8k, best quality, high quality, trending on artstation,
award winning, professional` (a secas).

Sustitúyelos por hechos: material, acabado, fuente de luz, distancia focal
aproximada, hora del día, color concreto, tipo de superficie.
