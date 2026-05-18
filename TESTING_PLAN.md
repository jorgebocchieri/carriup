# 🧪 Testing Plan — Carriup v2

**Fecha:** 18 de mayo, 2026  
**Versión:** 2.0  
**Objetivo:** Validar funcionamiento completo del sistema

---

## Fase 1: Verificación de Estructura ✅

- [x] Backend files created
- [x] Frontend files created
- [x] Database schema created
- [x] Docker Compose configured
- [x] Documentation complete

**Estado:** COMPLETADO

---

## Fase 2: Testing Local (AHORA)

### 2.1 Docker Compose Startup

**Objetivo:** Levantar todos los servicios sin errores

**Checklist:**
- [ ] PostgreSQL inicia correctamente
- [ ] Redis inicia correctamente
- [ ] Backend inicia sin errores
- [ ] Frontend inicia sin errores
- [ ] Health checks pasan en todos

**Comando:**
```bash
docker-compose up
```

**Criterios de éxito:**
```
✅ Carriup Backend (Fastify) is running
✅ > ready - started server on 0.0.0.0:3000
✅ Todos los servicios en verde (docker-compose ps)
```

---

### 2.2 Backend API Testing

**Objetivo:** Validar que todos los endpoints funcionan

#### Test 2.2.1: Health Check
```bash
curl http://localhost:3001/api/health

Expected: { "success": true, "status": "ok", "database": "connected" }
```
- [ ] Responde en <50ms
- [ ] Status code 200
- [ ] Database connected

#### Test 2.2.2: Product Search
```bash
curl "http://localhost:3001/api/products/search?query=leche"

Expected: { "success": true, "products": [...] }
```
- [ ] Devuelve array de productos
- [ ] Filtra por nombre correctamente
- [ ] Responde en <100ms

#### Test 2.2.3: Product Details
```bash
curl "http://localhost:3001/api/products/details?id=leche"

Expected: { "success": true, "product": {...}, "brands": [...], "varieties": [...] }
```
- [ ] Devuelve 4 marcas (Colun, Surlat, Marca Blanca, Colun Premium)
- [ ] Devuelve precios correctos
- [ ] Status code 200

#### Test 2.2.4: Price Comparison
```bash
curl "http://localhost:3001/api/prices/compare?products=leche,cafe,pollo"

Expected: { "success": true, "results": [...], "bestSupermarket": "...", "savings": ... }
```
- [ ] Compara 4 supermercados
- [ ] Calcula total correcto
- [ ] Identifica mejor opción
- [ ] Ahorro es correcto (max - min)

#### Test 2.2.5: Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

Expected: { "success": true, "user": {...}, "token": "..." }
```
- [ ] Retorna usuario correcto
- [ ] Retorna JWT token
- [ ] Token es válido
- [ ] Status code 200

#### Test 2.2.6: Signup (Nuevo Usuario)
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"nuevo@example.com","password":"password123"}'

Expected: { "success": true, "user": {...} }
```
- [ ] Crea usuario nuevo
- [ ] Password se hashea (no plaintext)
- [ ] Status code 200
- [ ] Valida email único

---

### 2.3 Frontend Testing

**Objetivo:** Validar UI funciona correctamente

#### Test 2.3.1: Frontend Loads
```
1. Abre http://localhost:3000 en navegador
```
- [ ] Página carga sin errores
- [ ] No hay console errors
- [ ] Layout visible
- [ ] Carga en <2 segundos

#### Test 2.3.2: Product Search
```
1. Escribe "leche" en el input
```
- [ ] Autocomplete aparece
- [ ] Muestra "Leche" en lista
- [ ] No hay lag/delay
- [ ] Categoría correcta (Lácteos)

#### Test 2.3.3: Select Product
```
1. Hace clic en "Leche"
```
- [ ] Modal aparece
- [ ] Muestra 4 marcas (Colun, Surlat, Marca Blanca, Colun Premium)
- [ ] Muestra precios
- [ ] Muestra supermercados

#### Test 2.3.4: Select Brand & Quantity
```
1. Haz clic en "Colun"
2. Ingresa cantidad "2"
3. Haz clic "Confirmar"
```
- [ ] Marca se destaca (naranja)
- [ ] Input cantidad funciona
- [ ] Producto se agrega al carrito

#### Test 2.3.5: Add Multiple Products
```
1. Repite: busca "café", selecciona, cantidad 1
2. Repite: busca "pollo", selecciona, cantidad 2
```
- [ ] Carrito muestra 3 items (leche, café, pollo)
- [ ] Cantidades correctas
- [ ] Botón "Eliminar" funciona

#### Test 2.3.6: Compare Prices
```
1. Haz clic "Comparar Precios"
```
- [ ] Spinner aparece
- [ ] Resultados aparecen (tabla 4 columnas)
- [ ] Mejor opción destacada en verde
- [ ] Resumen de ahorro correcto
- [ ] Recomendación clara

---

### 2.4 Database Testing

**Objetivo:** Validar datos están correctos

#### Test 2.4.1: PostgreSQL Connection
```bash
docker exec -it carriup-postgres psql -U postgres -d carriup -c "SELECT COUNT(*) FROM products;"

Expected: 25
```
- [ ] Conecta a la DB
- [ ] 25 productos presentes

#### Test 2.4.2: Prices Table
```bash
docker exec -it carriup-postgres psql -U postgres -d carriup -c "SELECT COUNT(*) FROM prices;"

Expected: 100
```
- [ ] 100 registros precio (25 productos × 4 supermercados)

#### Test 2.4.3: Users Table
```bash
docker exec -it carriup-postgres psql -U postgres -d carriup -c "SELECT * FROM users WHERE email='test@example.com';"
```
- [ ] Usuario test existe
- [ ] Password es hash (no plaintext)

---

## Fase 3: Performance Testing

### 3.1 Response Times
- [ ] Health check: <50ms
- [ ] Search: <100ms
- [ ] Details: <100ms
- [ ] Compare: <200ms (3+ productos)

### 3.2 Frontend Performance
- [ ] Load time: <2 segundos
- [ ] Search autocomplete: <100ms
- [ ] Modal aparece: <50ms
- [ ] Comparación renderiza: <500ms

### 3.3 Database Performance
- [ ] Query búsqueda: <10ms
- [ ] Query details: <10ms
- [ ] Query compare: <50ms

---

## Fase 4: Error Handling

### 4.1 Invalid Requests
```bash
# Sin query param
curl "http://localhost:3001/api/products/search"

Expected: { "error": "query requerido" }, Status 400
```
- [ ] Valida parámetros
- [ ] Devuelve error 400
- [ ] Mensaje claro

### 4.2 Invalid Credentials
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

Expected: { "success": false, "error": "..." }, Status 401
```
- [ ] Rechaza password incorrecto
- [ ] Status code 401
- [ ] No expone detalles

### 4.3 Database Error Recovery
```bash
# Detén PostgreSQL y prueba request
docker stop carriup-postgres

curl http://localhost:3001/api/health

Expected: Error + mensaje claro, Status 500
```
- [ ] Backend maneja error gracefully
- [ ] No crash
- [ ] Mensaje informativo

---

## Fase 5: Security Testing

### 5.1 CORS
```bash
curl -H "Origin: http://evil.com" http://localhost:3001/api/health

Expected: Access-Control headers correctos
```
- [ ] CORS configurado correctamente
- [ ] Permite http://localhost:3000
- [ ] Rechaza otros orígenes

### 5.2 Password Hashing
```bash
# Check en DB que password es hash, no plaintext
```
- [ ] Bcrypt hashing presente
- [ ] No se puede ver plaintext

### 5.3 JWT Validation
```bash
# Intenta con token inválido
curl -H "Authorization: Bearer invalid" http://localhost:3001/api/lists

Expected: 401 error
```
- [ ] Rechaza token inválido
- [ ] Status 401

---

## Checklist Final

**Backend:**
- [ ] 8 endpoints funcionan
- [ ] Validación correcta
- [ ] Errors manejados
- [ ] Performance OK

**Frontend:**
- [ ] Carga sin errores
- [ ] Búsqueda funciona
- [ ] Carrito funciona
- [ ] Comparación correcta
- [ ] Responsive design OK

**Database:**
- [ ] 25 productos presentes
- [ ] 100 precios correctos
- [ ] Usuario test existe
- [ ] Índices optimizados

**Infraestructura:**
- [ ] Docker Compose levanta OK
- [ ] Health checks pasan
- [ ] Volúmenes funcionan
- [ ] Variables env correctas

---

## Resultado Final

Si todos los tests pasan:

✅ **Sistema listo para Fase 3 (Integración IA)**

Próximo paso: Integración Claude API cuando tengas la key.

---

**Test Duration:** ~30 minutos  
**Required:** Docker Desktop, curl, navegador
