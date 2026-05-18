# 🧪 Testing Local (Sin Docker)

**Alternativa:** Testing sin Docker Desktop usando servidor local

---

## Setup Local (3 terminales)

### Terminal 1: Backend Fastify

```bash
cd backend
npm install
npm run dev
```

**Requisitos:**
- Node.js 20+
- PostgreSQL 15 instalado (o usamos un mock)

**Expected output:**
```
✅ Carriup Backend (Fastify) is running
Port: 3001
URL: http://localhost:3001
```

### Terminal 2: Frontend Next.js

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
> ready - started server on 0.0.0.0:3000
```

### Terminal 3: PostgreSQL

**Opción A: Usando PostgreSQL local instalado**
```bash
# Crear database y seed
createdb carriup
psql carriup < scripts/init-db.sql
```

**Opción B: Usando Docker solo para PostgreSQL**
```bash
docker run -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
# En otra terminal:
createdb -h localhost carriup
psql -h localhost carriup < scripts/init-db.sql
```

**Opción C: Usar mock en memoria (sin real PostgreSQL)**
```
# El backend usará un mock automáticamente si no hay DB
# Los datos serán en memoria (se pierden al reiniciar)
```

---

## Testing sin Docker - Guía Rápida

### 1. Instalar dependencias (ya en progreso)

```bash
cd backend && npm install
cd frontend && npm install
```

### 2. Iniciar servicios

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (espera a que backend esté listo)
cd frontend && npm run dev

# Terminal 3 (si tienes PostgreSQL)
createdb carriup && psql carriup < scripts/init-db.sql
```

### 3. Testing Backend

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Search Product:**
```bash
curl "http://localhost:3001/api/products/search?query=leche"
```

**Get Details:**
```bash
curl "http://localhost:3001/api/products/details?id=leche"
```

**Compare Prices:**
```bash
curl "http://localhost:3001/api/prices/compare?products=leche,cafe"
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### 4. Testing Frontend

```bash
open http://localhost:3000
```

Or:
```bash
# En navegador:
http://localhost:3000
```

---

## Problema: No tienes PostgreSQL

Si no tienes PostgreSQL instalado, hay 3 soluciones:

### Solución 1: Usar mock en memoria
El backend puede usar un mock. Los datos serán en memoria.

### Solución 2: Instalar PostgreSQL

**macOS (con Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb carriup
psql carriup < scripts/init-db.sql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
postgres=# CREATE DATABASE carriup;
postgres=# \q
psql -U postgres carriup < scripts/init-db.sql
```

**Windows:**
Descarga del sitio oficial: https://www.postgresql.org/download/windows/

### Solución 3: Usar Docker para Solo PostgreSQL
```bash
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine
# En otra terminal:
createdb -h localhost -U postgres carriup
PGPASSWORD=postgres psql -h localhost -U postgres -d carriup < scripts/init-db.sql
```

---

## Checklist de Testing Local

**Backend:**
- [ ] `npm run dev` levanta sin errores
- [ ] Health check responde (curl)
- [ ] Search funciona (curl)
- [ ] Details funciona (curl)
- [ ] Compare funciona (curl)
- [ ] Login funciona (curl)

**Frontend:**
- [ ] `npm run dev` levanta sin errores
- [ ] http://localhost:3000 abre
- [ ] No hay console errors
- [ ] Búsqueda funciona
- [ ] Carrito funciona
- [ ] Comparación funciona

**Database (si tienes PostgreSQL):**
- [ ] 25 productos en DB
- [ ] 100 registros precio
- [ ] Usuario test existe

---

## Troubleshooting

### Error: "Cannot find module 'fastify'"
```bash
cd backend
npm install
```

### Error: "Cannot find module 'next'"
```bash
cd frontend
npm install
```

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL no está corriendo. Soluciones:
1. Inicia PostgreSQL (`brew services start postgresql@15`)
2. O usa Docker (`docker run...`)
3. O ignora (usará mock en memoria)

### Error: "EADDRINUSE: address already in use :::3001"
Puerto 3001 ya está ocupado:
```bash
lsof -i :3001
kill -9 <PID>
```

### Error: "EADDRINUSE: address already in use :::3000"
Puerto 3000 ya está ocupado:
```bash
lsof -i :3000
kill -9 <PID>
```

---

## Video Test Walkthrough

1. **Terminal 1:** Inicia Backend
   ```bash
   cd backend && npm install && npm run dev
   ```
   Espera a ver: `✅ Carriup Backend is running`

2. **Terminal 2:** Prueba Backend
   ```bash
   curl http://localhost:3001/api/health
   ```
   Verifica que responda `{ "success": true }`

3. **Terminal 3:** Inicia Frontend
   ```bash
   cd frontend && npm install && npm run dev
   ```
   Espera a ver: `ready - started server`

4. **Navegador:** Abre http://localhost:3000
   - Busca "leche"
   - Selecciona cantidad
   - Agrega más productos
   - Compara precios

5. **Terminal 2:** Prueba más endpoints
   ```bash
   curl "http://localhost:3001/api/prices/compare?products=leche,cafe,pollo"
   ```

---

## ¿Qué significa cada error?

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED 5432` | PostgreSQL no corre | Instala o usa Docker |
| `EADDRINUSE :3001` | Puerto ocupado | `kill -9 <PID>` |
| `Cannot find module` | Dependencias no instaladas | `npm install` |
| `SyntaxError` en código | Error en el código JS | Revisa el archivo |
| `timeout` en curl | Backend no responde | Verifica que esté corriendo |

---

## Próximo Paso

Una vez que todo funcione localmente:

1. Documenta qué funcionó y qué no
2. Abre una issue en GitHub (si tienes repo)
3. Procede a Fase 3: Integración Claude API
