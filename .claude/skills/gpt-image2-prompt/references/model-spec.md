# gpt-image-2 — especificación técnica

Fuente: docs oficiales de OpenAI (modelo, guía de generación de imágenes y
cookbook de prompting) + anuncio de lanzamiento.

## Identidad del modelo

| Campo | Valor |
|---|---|
| Model ID | `gpt-image-2` |
| Snapshot por defecto | `gpt-image-2-2026-04-21` |
| Entrada | texto + imagen |
| Salida | solo imagen |
| Endpoints | `v1/images/generations`, `v1/images/edits`, `v1/batch` |
| Capacidades | generación, edición, inpainting con máscara, composición multi-imagen |

## Cuándo usar cada modelo de la familia

| Modelo | Para qué |
|---|---|
| `gpt-image-2` | **Default de producción.** Máxima calidad, mejor edición, mejor texto |
| `gpt-image-1.5` | Solo compatibilidad durante migración |
| `gpt-image-1` | Solo legacy |
| `gpt-image-1-mini` | Costo/throughput: lotes, borradores, exploración barata |

## Parámetros

### `size`
Default `auto`. Valores populares:

| Formato | Resolución | Nota |
|---|---|---|
| Cuadrado | `1024x1024` | default general |
| Landscape HD | `1536x1024` | |
| Retrato HD | `1024x1536` | |
| Cuadrado 2K | `2048x2048` | |
| Landscape 2K | `2048x1152` | |
| QHD | `2560x1440` | **límite superior de fiabilidad** |
| 4K UHD | `3840x2160` / `2160x3840` | **experimental**, resultados más variables |

Restricciones duras:
- borde máximo **< 3840 px**
- **ambos bordes múltiplos de 16**
- ratio largo:corto **máx 3:1**
- total de píxeles entre **655.360** y **8.294.400**
- por encima de 2560x1440 (3.686.400 px) el resultado es más variable

### `quality`
`low` | `medium` | `high` | `auto` (default).

- `low`: borradores, thumbnails, latencia baja, alto volumen.
- `medium`: equilibrio; sirve para muchos flujos.
- `high`: **obligatorio** con texto pequeño o denso, infografías, retratos en
  primer plano, ediciones sensibles a identidad y salidas de alta resolución.

### `background`
`transparent` | `opaque` | `auto` (default).

Transparente exige `output_format="png"` (default) o `"webp"`. `jpeg` no
soporta canal alfa. Con PNG, omite `output_compression`. Conserva el alfa al
guardar el archivo.

### `output_format` / `output_compression`
`png` (default) | `jpeg` | `webp`. `output_compression` es 0–100 y solo
aplica a jpeg/webp. `jpeg` reduce latencia de transferencia.

### Otros
- `n` — número de imágenes por request (default 1). Útil para variantes.
- `moderation` — `auto` (default) o `low` (filtrado menos restrictivo).
- `partial_images` — 0–3, resultados parciales en streaming.
- `input_image_mask` — inpainting: mismo formato y tamaño que el original,
  **< 50 MB**, requiere canal alfa.
- `input_fidelity` — **no disponible en gpt-image-2**; solo en `gpt-image-1.5`
  y `gpt-image-1`. En gpt-image-2 la salida ya es de alta fidelidad.

## Precios (por 1M tokens)

| Modalidad | Input | Cached input | Output |
|---|---|---|---|
| Imagen | $8.00 | $2.00 | $30.00 |
| Texto | $5.00 | $1.25 | $10.00 |

## Rate limits
Desde Tier 1 (100K TPM, 5 imágenes/min) hasta Tier 5 (8M TPM, 250 img/min).

## Limitaciones conocidas
- El renderizado de texto mejoró mucho (>95% de precisión reportada en
  titulares largos, párrafos densos, UI y packaging, incluidos scripts no
  latinos) pero **no es perfecto**: verifica siempre la copia.
- La colocación en composiciones sensibles al layout puede variar entre pasadas.
- La latencia sube con la complejidad del prompt; hasta ~2 min en casos densos.

## Snippets

Generación:
```python
from openai import OpenAI
client = OpenAI()

r = client.images.generate(
    model="gpt-image-2",
    prompt=PROMPT,
    size="1536x1024",
    quality="high",
    background="auto",
    output_format="png",
    n=1,
)
```

Edición / inpainting:
```python
r = client.images.edit(
    model="gpt-image-2",
    image=open("base.png", "rb"),
    mask=open("mask.png", "rb"),   # mismo tamaño y formato, con alfa
    prompt=EDIT_PROMPT,
    size="1536x1024",
    quality="high",
)
```

Logo con fondo transparente:
```python
r = client.images.generate(
    model="gpt-image-2",
    prompt=LOGO_PROMPT,
    size="1024x1024",
    quality="high",
    background="transparent",
    output_format="png",
    n=4,
)
```
