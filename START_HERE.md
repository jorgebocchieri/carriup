# 🚀 START HERE — Carriup v2 Quick Start

## Opción 1: Docker Compose (RECOMENDADO - 1 minuto)

```bash
cd "/Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup"

# Levantar todo (4 servicios: postgres, redis, backend, frontend)
docker-compose up

# Esperar ~30 segundos hasta ver:
# ✅ Carriup Backend (Fastify) is running
# ✅ > ready - started server on 0.0.0.0:3000
```

### Acceder:
- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:3001
- 🗄️ **PostgreSQL:** localhost:5432

### Credenciales de Prueba:
```
Email:    test@example.com
Password: test123456
```

---

## Opción 2: Local sin Docker (5 minutos)

### Terminal 1: PostgreSQL
```bash
# Opción A: Usar Docker solo para DB
docker run -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Opción B: PostgreSQL instalado localmente
createdb carriup
psql carriup < scripts/init-db.sql
```

### Terminal 2: Backend
```bash
cd backend
npm install
npm run dev
# → Backend listo en http://localhost:3001
```

### Terminal 3: Frontend
```bash
cd frontend
npm install
npm run dev
# → Frontend listo en http://localhost:3000
```

---

## 🧪 Pruebas Rápidas

Cuando todo esté levantado:

```bash
# 1. Verificar backend
curl http://localhost:3001/api/health

# 2. Buscar un producto
curl "http://localhost:3001/api/products/search?query=leche"

# 3. Obtener detalles
curl "http://localhost:3001/api/products/details?id=leche"

# 4. Comparar precios
curl "http://localhost:3001/api/prices/compare?products=leche,cafe,pollo"

# 5. Abrir frontend
open http://localhost:3000
```

---

## ❌ Si algo no funciona:

### Error: "Port 3000 already in use"
```bash
# Buscar y matar el proceso
lsof -i :3000
kill -9 <PID>
```

### Error: "Cannot connect to Docker daemon"
```bash
# Abrir Docker Desktop o instalar Docker
# Si usas Linux: sudo systemctl start docker
```

### Error: "database 'carriup' does not exist"
```bash
# Reinstanciar PostgreSQL
docker-compose down
docker volume rm carriup_postgres_data
docker-compose up
```

### Ver logs del servicio
```bash
docker logs carriup-backend
docker logs carriup-frontend
docker logs carriup-postgres
```

---

## 📁 Documentación Completa

- [V2_CONSTRUCTION_COMPLETE.md](V2_CONSTRUCTION_COMPLETE.md) — Detalles de lo construido
- [CLAUDE.md](CLAUDE.md) — Especificaciones del proyecto
- [DEMO_COMPLETE.md](DEMO_COMPLETE.md) — MVP v1 (anterior)

---

## 🎯 Flujo de Uso

1. **Abre http://localhost:3000** en tu navegador
2. **Busca un producto:** escribe "leche", "café", "pollo"
3. **Haz clic en el producto** que quieres
4. **Selecciona cantidad** en el modal que aparece
5. **Agrega más productos** al carrito
6. **Haz clic "Comparar Precios"**
7. **Ve los resultados:** tabla comparativa y mejor opción destacada

---

## ✨ Qué Puedes Hacer Ahora

✅ Comparar precios de 25 productos en 4 supermercados  
✅ Ver marcas disponibles y precios por marca  
✅ Identificar el mejor supermercado para tu compra  
✅ Calcular ahorros  
✅ Agregar múltiples productos al carrito  

---

## 📝 Notas

- Los datos de prueba son **mock** (simulados)
- Las contraseñas se **hashean** con bcrypt (seguro)
- Los tokens usan **JWT real** con expiración
- La base de datos es **PostgreSQL** (producción-ready)
- El frontend usa **Next.js 14** con SSR

---

## 🚀 Próximos Pasos

1. **Testear localmente** con docker-compose
2. **Integrar Claude API** cuando tengas la key
3. **Agregar web scraping** para precios reales
4. **Deploy a Railway** o Vercel + Railway

---

## 💬 Preguntas?

Consulta:
- Backend issues → `backend/src/server.js`
- Frontend issues → `frontend/app/compare/page.tsx`
- Database issues → `scripts/init-db.sql`

---

**¡Listo para comenzar! 🎉**

```bash
docker-compose up
```
