# 💰 Guía del Comparador de Precios — Carriup

Página interactiva para probar cómo Carriup compara precios entre supermercados chilenos.

## 📁 Archivo

**`price_comparison.html`** (18 KB)
- Página standalone lista para probar
- Sin dependencias externas
- Base de datos simulada con precios reales de supermercados

## 🚀 Cómo Usar

### Opción 1: Abrir en navegador
```bash
open price_comparison.html
```

### Opción 2: Servidor local
```bash
python3 -m http.server 8000
# Abre http://localhost:8000/price_comparison.html
```

---

## 📊 Productos Disponibles en Base de Datos

Los siguientes productos tienen precios predefinidos (simulados):

| Producto | Supermercados | Rango de Precio |
|----------|---------------|-----------------|
| **Leche** | Lider, Jumbo, Santa Isabel, Unimarc | $1,250 - $1,350 |
| **Pan integral** | Lider, Jumbo, Santa Isabel, Unimarc | $1,990 - $2,650 |
| **Huevos** | Lider, Jumbo, Santa Isabel, Unimarc | $2,990 - $4,290 |
| **Arroz** | Lider, Jumbo, Santa Isabel, Unimarc | $1,290 - $1,790 |
| **Aceite** | Lider, Jumbo, Santa Isabel, Unimarc | $3,490 - $4,890 |

### Ejemplos de Búsqueda

Puedes escribir cualquiera de estos términos (el sistema los reconoce):

```
leche
pan integral
huevos
arroz
aceite
```

Para productos no en la base de datos, **se generarán precios aleatorios** automáticamente.

---

## 🎯 Cómo Probar

### Ejemplo 1: Comparar Leche
1. Ingresa: "leche"
2. Click "Agregar"
3. Click "Comparar Precios"
4. Verás:
   - 4 tarjetas (una por supermercado)
   - Precios individuales
   - Total por supermercado
   - Mejor opción destacada
   - Ahorro potencial

### Ejemplo 2: Canasta Básica
1. Ingresa: "leche"
2. Click "Agregar"
3. Ingresa: "pan integral"
4. Click "Agregar"
5. Ingresa: "huevos"
6. Click "Agregar"
7. Click "Comparar Precios"
8. Verás comparación total de la canasta

### Ejemplo 3: Productos Personalizados
1. Ingresa: "detergente" (no está en la BD)
2. Click "Agregar"
3. Click "Comparar Precios"
4. Se generarán precios aleatorios automáticamente

---

## 📈 Qué Verás en los Resultados

### Por Supermercado:
- 🏪 Nombre del supermercado con emoji
- 📝 Lista de productos con precios
- 💰 Total de la compra
- ✅ Badge "Mejor Precio" (si aplica)

### Resumen Comparativo:
- Productos encontrados
- Mejor supermercado
- Ahorro potencial
- Precio mínimo y máximo
- Recomendación inteligente

### Ejemplo de Resultado:

```
🛒 LIDER
  Leche: $1,290
  Pan integral: $2,490
  Total: $3,780

🏪 SANTA ISABEL
  Leche: $1,250
  Pan integral: $1,990
  Total: $3,240 ✅ Mejor Precio

💡 Resumen:
  Ahorro: $540
  Mejor opción: Santa Isabel
```

---

## 🔧 Datos Simulados vs Realidad

⚠️ **IMPORTANTE:**
- Los precios mostrados son **datos simulados** para demostración
- En producción, se obtendrían de:
  - Web scraping de sitios de supermercados
  - APIs de supermercados
  - Base de datos propia actualizada diariamente

### Supermercados Simulados:
- 🏪 **Lider** — Precios medios-altos
- 🛍️ **Jumbo** — Precios competitivos
- 🏬 **Santa Isabel** — Precios bajos
- 🏢 **Unimarc** — Precios premium

---

## 💡 Cómo Funciona el Código

### 1. Ingreso de Productos
```javascript
selectedProducts = ['leche', 'pan integral'];
```

### 2. Búsqueda en Base de Datos
```javascript
PRODUCTS_DB = {
  'leche': [
    { supermarket: 'lider', price: 1290, brand: 'Colun' },
    { supermarket: 'jumbo', price: 1320, brand: 'Surlat' },
    ...
  ]
}
```

### 3. Agregación de Precios
```javascript
Lider total: 1290 + 2490 = 3,780
Santa Isabel total: 1250 + 1990 = 3,240
```

### 4. Comparación
```javascript
Mejor: Santa Isabel ($3,240)
Peor: Unimarc ($4,000)
Ahorro: $760
```

---

## 🚀 Próximos Pasos en Producción

1. **Integrar Web Scraping Real**
   ```javascript
   // Obtener precios en vivo de supermercados
   const prices = await scrapeSupermercado('lider', 'leche');
   ```

2. **Guardar en Base de Datos**
   ```javascript
   // PostgreSQL con historial de precios
   INSERT INTO prices (product, supermarket, price, date)
   VALUES ('leche', 'lider', 1290, NOW());
   ```

3. **Conectar con Claude API**
   ```javascript
   // IA genera sugerencias
   const suggestion = await claude.generateRecommendation(results);
   // "Compra en Santa Isabel y ahorra $540"
   ```

4. **Predicción ML**
   ```javascript
   // Predecir cuándo bajará el precio
   const prediction = await predictPriceDrop('leche');
   // "Bajará 15% en 3 días"
   ```

---

## 🐛 Funcionalidades Actuales

✅ Agregar múltiples productos
✅ Remover productos
✅ Comparar precios en 4 supermercados
✅ Mostrar totales por supermercado
✅ Destacar mejor opción
✅ Calcular ahorro
✅ Recomendación inteligente
✅ Responsive (mobile-friendly)
✅ Loading simulation
✅ Productos aleatorios si no están en BD

---

## 📝 Estructura de Datos

### Producto
```javascript
{
  name: 'leche',
  supermarket: 'lider',
  price: 1290,
  brand: 'Colun'
}
```

### Resultado
```javascript
{
  supermarket: 'lider',
  items: [
    { name: 'leche', price: 1290, brand: 'Colun' },
    { name: 'pan', price: 2490, brand: 'Bimbo' }
  ],
  total: 3780
}
```

---

## 🎨 Diseño

- **Colores:** Naranja (#FF6600), Púrpura (fondo)
- **Responsive:** Desktop, Tablet, Mobile
- **Cards:** Hover animations, shadows
- **Loading:** Spinner animation
- **Accesibilidad:** Alt text, semantic HTML

---

## 📌 Notas

- Los precios cambian dentro de rangos realistas
- Cada búsqueda puede generar precios diferentes para productos aleatorios
- El comparador prioriza el mejor precio
- Muestra marca por cada producto
- Calcula ahorro automáticamente

---

**Archivo creado:** 17/05/2026
**Versión:** 1.0
**Estado:** Demo / Testing
