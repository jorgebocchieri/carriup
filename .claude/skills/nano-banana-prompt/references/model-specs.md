# Especificaciones de los modelos "Nano Banana"

> Datos verificados en agosto de 2026 contra documentación de Google
> (ai.google.dev, cloud.google.com, blog.google, deepmind.google).
> Los modelos se mueven rápido: si algo no calza, la doc oficial manda.

## Desambiguación del nombre "Nano Banana Pro 2"

**Google no comercializa ningún modelo llamado "Nano Banana Pro 2".** El nombre
circula en la comunidad y en sitios de terceros mezclando dos productos distintos:

| Apodo comunitario | Modelo oficial | ID API | Lanzamiento |
|---|---|---|---|
| Nano Banana Pro | Gemini 3 Pro Image | `gemini-3-pro-image` | nov 2025 (GA jun 2026) |
| Nano Banana 2 / "Nano Banana 2 Pro" | Gemini 3.1 Flash Image | `gemini-3.1-flash-image` | feb 2026 |
| Nano Banana Lite | Gemini 3.1 Flash Lite Image | `gemini-3.1-flash-lite-image` | 2026 |
| (legacy) Nano Banana | Gemini 2.5 Flash Image | `gemini-2.5-flash-image` | 2025 |

Sitios como `nanobanana-pro.studio` usan "Nano Banana 2 Pro" como marca propia
apuntando a Gemini 3.1 Flash Image. Cuando el usuario diga "Pro 2", pregúntale si
quiere **máxima calidad** (→ Pro) o **velocidad/volumen** (→ 2).

**Default de esta skill: `gemini-3-pro-image` a 4K**, porque el encargo es máximo
detalle y calidad.

---

## Comparativa

| | Nano Banana Pro (`gemini-3-pro-image`) | Nano Banana 2 (`gemini-3.1-flash-image`) |
|---|---|---|
| Fuerte en | Fidelidad máxima, texto perfecto, infografías, razonamiento espacial | Velocidad, costo, iteración masiva |
| Tokens entrada | 65.536 | 131.072 |
| Tokens salida | 32.768 | 32.768 |
| Resoluciones | 1K, 2K, 4K | 512px (0.5K), 1K, 2K, 4K |
| Aspect ratios | 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9 | los mismos **+ 1:4, 4:1, 1:8, 8:1** |
| Referencias | hasta 6 objetos + 5 personajes | hasta 10 objetos + 4 personajes + 3 de estilo |
| Search grounding | Sí | Sí |
| Image grounding (busca fotos reales) | No | **Sí** |
| Video como input | No | Sí (preview) |
| Thinking mode | Sí (por defecto) | Sí (mejor desactivado salvo escenas complejas) |
| Velocidad aprox. | mayor latencia | ~5 s a 1K, ~20 s a 4K |

Nano Banana Lite (`gemini-3.1-flash-lite-image`): solo 1K, hasta 14 objetos de
referencia. Úsalo solo para bocetos descartables.

---

## Aspect ratios — cuál elegir

| Ratio | Uso |
|---|---|
| `1:1` | Feed de Instagram, avatar, packshot de e-commerce |
| `4:5` | Post vertical de Instagram/Facebook (máximo espacio en feed) |
| `9:16` | Stories, Reels, TikTok, wallpaper de móvil |
| `16:9` | Web hero, YouTube thumbnail, presentación, wallpaper desktop |
| `21:9` | Cinemático, banner ancho, cabecera de landing |
| `3:2` / `2:3` | Fotografía clásica (35mm), impresión |
| `4:3` / `3:4` | Editorial, retrato de revista, print |
| `5:4` | Póster, impresión enmarcada |
| `1:4`, `4:1`, `1:8`, `8:1` | Banners extremos, tiras de cómic — **solo Nano Banana 2** |

## Resoluciones

- `1K` — iteración, pruebas de composición.
- `2K` — entregable digital estándar.
- `4K` — **default de esta skill**: impresión, detalle de textura, zoom.
- `512px` — solo Nano Banana 2, para barrer variantes barato antes de subir a 4K.

Flujo eficiente: explorar a 1K (o 512px en NB2) → elegir → regenerar el ganador a 4K
con el mismo prompt.

---

## Snippets de API

### Python (google-genai)

```python
from google import genai
from google.genai import types

client = genai.Client(api_key="TU_API_KEY")

response = client.models.generate_content(
    model="gemini-3-pro-image",
    contents="TU_PROMPT_AQUI",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="4K",
        ),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.png", "wb") as f:
            f.write(part.inline_data.data)
```

### Con imágenes de referencia

```python
from PIL import Image

ref_char = Image.open("personaje.png")
ref_style = Image.open("estilo.png")

response = client.models.generate_content(
    model="gemini-3-pro-image",
    contents=[
        "Based strictly on the uploaded reference images: keep the character's "
        "facial structure and proportions identical to image 1, and apply the "
        "color palette and brushwork of image 2. TU_PROMPT_AQUI",
        ref_char,
        ref_style,
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="4:5", image_size="4K"),
    ),
)
```

### JavaScript / TypeScript

```javascript
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3-pro-image",
  contents: "TU_PROMPT_AQUI",
  config: {
    responseModalities: ["IMAGE"],
    imageConfig: { aspectRatio: "16:9", imageSize: "4K" },
  },
});

for (const part of response.candidates[0].content.parts) {
  if (part.inlineData) {
    fs.writeFileSync("output.png", Buffer.from(part.inlineData.data, "base64"));
  }
}
```

### Edición conversacional (multi-turno)

Se encadena con `previous_interaction_id` para que el modelo conserve el contexto
de la imagen anterior en lugar de regenerar desde cero.

### En la app de Gemini (sin código)

Si el usuario no usa API: la config va en lenguaje natural o en los controles de la
UI. Aspect ratio y resolución se eligen en el selector; el resto del prompt es igual.
Entrega igualmente el bloque de config para que sepa qué setear a mano.

---

## Formatos de imagen de entrada aceptados

`image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`.
Documentos: texto y PDF, hasta 50 MB por API / 7 MB subiendo directo a la consola.

---

## Grounding

- **Search grounding** (ambos modelos): datos reales y actuales — clima, precios,
  resultados, eventos. Útil para infografías y piezas con datos.
- **Image grounding** (solo Nano Banana 2): el modelo busca fotos reales del sujeto
  antes de generar. Excelente para monumentos, ciudades, especies animales concretas.
  **No busca caras de personas.**
- Corte de conocimiento base: enero 2025. Todo lo posterior necesita grounding.

## Thinking mode

- **Nano Banana Pro:** activo por defecto, es parte de su ventaja. Déjalo.
- **Nano Banana 2:** conviene desactivarlo salvo que la escena sea una infografía
  compleja o mezcle grounding con razonamiento espacial.

---

## Limitaciones reconocidas por Google

- Texto muy pequeño y detalle fino pueden salir imperfectos.
- La exactitud factual de diagramas hay que **verificarla a mano**.
- Gramática imperfecta en texto multilingüe.
- Artefactos ocasionales en ediciones complejas.
- Consistencia de personaje variable entre ediciones sucesivas.
- Toda salida lleva marca de agua **SynthID** y **C2PA Content Credentials**.

---

## Fuentes

- https://ai.google.dev/gemini-api/docs/image-generation
- https://ai.google.dev/gemini-api/docs/models/gemini-3-pro-image
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-image
- https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana
- https://cloud.google.com/blog/products/ai-machine-learning/nano-banana-2-and-nano-banana-pro-are-generally-available
- https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/
- https://blog.google/innovation-and-ai/products/nano-banana-pro/
- https://deepmind.google/models/gemini-image/pro/
