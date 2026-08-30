# Checklist de entrevista y puerta del 99%

Dos usos: (1) ordenar las rondas de preguntas, (2) auditar antes de entregar.

## Orden de rondas sugerido

**Ronda 1 — Encuadre del encargo** (nunca se salta)
- Uso final: anuncio / editorial / packshot e-commerce / mockup de UI /
  infografía / ilustración / avatar / key visual / thumbnail
- Medio y tono: fotografía real, render 3D, ilustración plana, acuarela,
  pixel art, diagrama vectorial
- Dónde se publica: web, impreso, feed social, slide, app

**Ronda 2 — Contenido concreto**
- Sujeto exacto: qué es, cuántos, materiales, estado, escala relativa
- Escena: lugar, superficie, hora del día, clima, profundidad de fondo
- Personas, si hay: encuadre corporal, pose, mirada, interacción con objetos,
  rango de edad, vestuario
- Texto en imagen: ¿sí o no? Copia literal exacta, entre comillas

**Ronda 3 — Look**
- Luz: fuente, dureza, dirección, temperatura, hora
- Encuadre: plano (primer plano / medio / general), ángulo (eye-level,
  contrapicado, cenital), profundidad de campo
- Paleta: colores dominantes, contraste, saturación
- Grado de imperfección: limpio de estudio vs desgaste real y grano

**Ronda 4 — Cierre técnico y límites**
- `size` y orientación
- Fondo transparente sí/no
- Prohibiciones: marcas, watermarks, texto extra, elementos que molestan
- Variantes (`n`) e iteraciones previstas

## Puerta del 99% — auditoría previa a entregar

No entregues si alguna casilla queda en rojo.

- [ ] El uso final está declarado dentro del prompt.
- [ ] El sujeto se describe con materiales y texturas concretas, no con
      categorías ("carrito de metal cromado con rueda rayada", no "carrito").
- [ ] La escena tiene superficie, luz y fondo definidos.
- [ ] Si hay texto: está literal, entre comillas, con tipografía, tamaño,
      color, posición y la instrucción de render verbatim una sola vez.
- [ ] Encuadre y ángulo explícitos.
- [ ] Luz descrita como hecho físico (fuente + dureza + dirección).
- [ ] Hay al menos tres detalles de textura o imperfección creíble.
- [ ] Hay una sección `Constraints:` con prohibiciones explícitas.
- [ ] Cero palabras vacías: stunning, epic, masterpiece, beautiful, amazing,
      ultra, hyper, 8k, best quality, trending.
- [ ] `size` cumple: múltiplos de 16, ratio ≤3:1, borde <3840, píxeles en
      rango 655.360–8.294.400.
- [ ] `quality`, `background`, `output_format` y `n` decididos y coherentes
      entre sí (transparente ⇒ png/webp).
- [ ] Si es edición: lista de preservación completa y explícita.
- [ ] El usuario dio OK al resumen de confirmación.

## Supuestos: cómo declararlos

Cuando se agotan las rondas y algo sigue abierto, no preguntes más: escribe

> Supuesto aplicado: luz de ventana difusa por la izquierda, media mañana.
> Dilo y lo cambio en una iteración.

Un supuesto declarado es aceptable. Un hueco silencioso no.

## Señales de que falta una ronda

- El usuario usó adjetivos de sensación sin referente visual
  ("que se vea confiable", "que sea aspiracional").
- Mencionó una marca o producto real sin especificar si debe aparecer
  el logo.
- Hay texto implícito ("un cartel de oferta") sin copia literal.
- Pidió "realista" sin decir si es foto de producto o foto de vida real.
- El encargo es para impresión y no sabes las proporciones.
