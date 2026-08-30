# Plantillas y ejemplos completos

## Fórmula base

```
[Subject + concrete adjectives] [action] [location/context].
[Composition/framing]. [Camera + lens + aperture + angle].
[Lighting scheme with direction and quality]. [Color palette / film stock].
[Materials and micro-texture]. [Exact text, in quotes, with typography].
[Style/medium]. [Positive constraints].
```

Con referencias:

```
[Reference images] + [relationship instruction: qué toma de cada una]
+ [new scenario] + [lo que debe permanecer idéntico]
```

Para edición:

```
[Verbo fuerte] [objeto exacto del cambio] [cómo debe quedar].
Keep [lista de lo que no se toca] pixel-identical, preserving the original
lighting, grain, perspective and color grading.
```

---

## Plantilla A — Retrato / editorial fotográfico

```
A medium shot of a 60-year-old Chilean market vendor with weathered hands and
short grey hair, wearing a faded navy apron over a checked shirt, mid-laugh while
handing over a paper bag of tomatoes. Behind her, an out-of-focus produce stall
with crates of avocados and bunched herbs. Composition follows the rule of thirds
with the vendor in the left two thirds and the stall receding to the right.
Shot on a medium-format camera with an 85mm lens at f/2.0, eye level, slightly
below her chin line. Lighting is soft late-afternoon sun entering from
camera-left through a translucent awning, wrapping her face and casting a warm
shadow across the crates to the right. Kodak Portra 400 color science: warm skin
tones, fine grain, gentle contrast. Visible skin pores and fine lines around the
eyes, the coarse weave of the apron cotton, dust motes floating in the light beam.
Photographic realism throughout, with physically accurate shadow directions.
```
Config: `gemini-3-pro-image`, `3:2`, `4K`.

---

## Plantilla B — Producto / packshot comercial

```
A commercial packshot of a matte ceramic skincare jar, 6 cm tall, in a warm
sand-beige finish with a brushed brass lid, standing on a polished travertine
slab. The jar sits slightly right of center with generous negative space on the
left for headline copy. Shot with a 100mm macro lens at f/8, camera positioned
just above the level of the lid at a 15-degree three-quarter angle.
Three-point softbox lighting: a large key from the upper left, a strip
reflector creating a clean vertical highlight along the right edge of the jar,
and a subtle rim light separating it from the background. Palette of warm sand,
brushed brass and soft shadow taupe. Micro-texture: the fine grain of the matte
ceramic glaze, faint concentric brushing marks on the brass, the porous surface
of the travertine, one soft contact shadow anchoring the jar.
The label reads "AURELIA" in a fine high-contrast serif, all caps, letter-spaced
wide, embossed in brass foil, with "hydrating balm" in a small light sans-serif
beneath it. Studio product photography, spotless surfaces.
```
Config: `gemini-3-pro-image`, `4:5`, `4K`.

---

## Plantilla C — Poster con texto

```
A vertical poster on a solid deep terracotta background. The upper half is a
photograph of a single ripe fig, split open, floating and lit from behind so the
translucent flesh glows. The lower half carries three lines of text with exact
styling:
- Top line: "TEMPORADA" in a heavy geometric sans-serif, all caps, tightly
  tracked, cream white.
- Middle line: "de higos" in a flowing brush script, twice the size, warm gold.
- Bottom line: "desde el 12 de marzo" in a small light sans-serif, cream white,
  centered.
Composition is centered and symmetrical with wide margins. Shot with a 100mm
macro lens at f/5.6 for the fig, straight on. Lighting is a single hard backlight
through the fruit with a soft fill from the front. Palette limited to deep
terracotta, cream white and warm gold. Micro-texture: the seeded interior of the
fig, the fine matte paper grain of the printed poster. Modern editorial graphic
design, print-ready, text crisp and perfectly legible.
```
Config: `gemini-3-pro-image`, `2:3`, `4K`.
Nota: verifica los acentos ("MÁS", "compró") carácter por carácter con el usuario.

---

## Plantilla D — Infografía con dato real

```
A clean flat-design infographic explaining the four steps of Chilean supermarket
price comparison, arranged as a horizontal flow with numbered circular nodes
connected by a thin line. Each node has a simple two-color icon above it and a
label below:
1. "Buscar" — magnifying glass over a product
2. "Comparar" — four price tags side by side
3. "Optimizar" — a shopping cart with a downward arrow
4. "Ahorrar" — a wallet with coins
Composition uses a strict grid with generous white space and a clear title band
at the top reading "Cómo funciona Carriup" in a bold geometric sans-serif.
Flat vector illustration style, no gradients, no drop shadows. Palette of indigo
(#6366f1), warm orange (#f97316), and near-black text on an off-white background.
All text sharp and perfectly spelled. Straight-on orthographic view.
```
Config: `gemini-3-pro-image`, `16:9`, `2K`. Thinking activo.
**Advertencia obligatoria al usuario:** verificar a mano cualquier cifra.

---

## Plantilla E — Ilustración

```
A loose watercolor illustration of a small stone house on a hillside at dusk,
smoke curling from its chimney, surrounded by tall grass bending in the wind.
The house sits in the lower left third with a large expanse of washed sky above.
Painted with wet-on-wet blooms, visible pigment granulation and a rough cold-press
paper texture showing through the washes. Palette of dusty lavender, muted ochre,
sage green and a single warm amber glow in the window. Loose ink linework only on
the roof edge and window frames, left intentionally imperfect and broken.
Soft, quiet, contemplative mood. Edges of the painting fade unevenly into the
white paper.
```
Config: `gemini-3-pro-image`, `3:2`, `4K`.

---

## Plantilla F — Personaje consistente (con referencias)

```
Based strictly on the uploaded reference images, keep the character's facial
structure, hair, skin tone and body proportions identical.

Full-body shot of the same character now standing on a rain-slicked city street
at night, holding a folded umbrella at her side, looking back over her shoulder
toward camera. She is centered with the street receding behind her.
Shot on a 50mm lens at f/2.0, eye level. Lighting comes from a green pharmacy
sign to camera-right and warm sodium streetlights behind, with a soft rim light
outlining her shoulder. CineStill 800T color: cool blues, halation glowing around
the practical lights. Micro-texture: beaded rain on her coat's waxed cotton,
reflections fragmenting on the wet asphalt. Photographic realism, consistent with
the reference images in every identifying feature.
```
Config: `gemini-3-pro-image`, `4:5`, `4K`, 3–5 referencias del mismo personaje.

---

## Plantilla G — UI / mockup digital

```
A modern mobile app screen for a grocery price comparison app, displayed floating
in a three-quarter perspective with a soft contact shadow on a light neutral
backdrop. The screen shows a search field reading "leche entera 1L", below it four
supermarket result cards, each with a store name, a price and a small product
thumbnail: "Jumbo $1.290", "Lider $1.190", "Santa Isabel $1.350",
"Unimarc $1.240". The cheapest card is highlighted with an indigo border and a
small badge reading "Más barato". A bottom bar shows the total: "Total: $1.190".
Clean light UI, 16px corner radius, generous spacing, indigo (#6366f1) primary
color with a warm orange (#f97316) accent, medium-weight geometric sans-serif
throughout. Soft even studio lighting from above left. All text sharp and
perfectly legible at full resolution.
```
Config: `gemini-3-pro-image`, `4:5`, `4K`.

---

## Plantilla H — Edición

```
Replace the overcast grey sky with a clear late-afternoon sky, warm sun low on
the right side of the frame. Relight the entire scene accordingly: warm rim light
on the right edges of the buildings, long soft shadows falling to the left across
the plaza, and a subtle golden bounce on the facades.
Keep the buildings, the people, their positions, poses and clothing
pixel-identical. Preserve the original camera perspective, lens character, film
grain and overall composition.
```

Otras operaciones frecuentes, en una línea:
- `Remove the parked car on the left and reconstruct the sidewalk and wall behind it, matching the existing lighting and texture.`
- `Extend the image 30% to the left, continuing the beach and the shoreline naturally with consistent perspective and grain.`
- `Transform this photograph into a loose gouache painting, keeping the exact composition, subject placement and color relationships.`
- `Keep the subject exactly as is, but change the backdrop to a seamless deep terracotta studio paper with a soft gradient falloff.`

---

## Estructura de la entrega final (copiar este esqueleto)

```markdown
## 1. Prompt principal (inglés — este es el que se pega)
```
<prompt>
```

## 2. Configuración
- Modelo: `gemini-3-pro-image` (Nano Banana Pro)
- aspect_ratio: `4:5`   ·   image_size: `4K`
- Thinking: activo   ·   Grounding: no necesario
```python
<snippet>
```

## 3. Versión en español (para editar, no para pegar)
<traducción>

## 4. Variantes para comparar
- **A — luz dura:** cambia "soft window light" por "single hard key from camera-left, deep shadows"
- **B — ángulo bajo:** cambia "eye level" por "low-angle, 20cm from the ground"
- **C — grading frío:** cambia "Kodak Portra 400" por "teal and orange cinematic grade"

## 5. Ediciones de seguimiento
1. `Keep everything identical, but ...`
2. ...

## 6. Qué revisar en el resultado
- [ ] El texto dice exactamente "..."
- [ ] Manos y dedos correctos
- [ ] Sombras coherentes con la luz descrita
- [ ] Logo legible
- [ ] Sin deformaciones en el producto
```

---

## Mini-ejemplo de entrevista bien hecha

> **Usuario:** "Quiero una imagen para promocionar Carriup en Instagram."

> **Tú:** "Entiendo: una pieza para Instagram que promocione Carriup. Antes de
> armar el prompt necesito cerrar unas cuantas cosas — voy en dos o tres rondas
> cortas y después te muestro la ficha completa para que la confirmes."
>
> *(AskUserQuestion, ronda 1: formato/uso · protagonista de la imagen ·
> registro visual · si lleva texto)*
>
> *(ronda 2: composición · luz · paleta · espacio para copy)*
>
> *(ronda 3: copy literal · tipografía · texturas · exclusiones)*
>
> "Recapitulando lo que llevo: post 4:5, foto cenital de una bolsa de compras
> volcada sobre mármol, luz de ventana lateral, paleta índigo + naranja, título
> 'COMPRÁ MÁS BARATO' arriba a la izquierda... ¿voy bien?"
>
> *(ficha de 18 filas → "¿confirmás?" → sí → entrega)*

Contraejemplo (lo que **no** hay que hacer): recibir "quiero una imagen para
promocionar Carriup" y responder con un prompt. Eso es adivinar, no dirigir.
