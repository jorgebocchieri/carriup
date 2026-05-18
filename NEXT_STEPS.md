# 🚀 Próximos Pasos — De v2.1 a Producción

**Versión Actual:** v2.1 Final (Mock data en memoria)  
**Objetivo:** PostgreSQL Real + IA + Deploy  
**Tiempo Estimado:** 3-4 horas total

---

## PASO 1: PostgreSQL Real (30 min)

### 1.1 Instalar PostgreSQL
Ver: [INSTALL_POSTGRESQL.md](INSTALL_POSTGRESQL.md)

Elige una opción:
- **Homebrew** (recomendado, más fácil)
- **PostgreSQL.app** (GUI)
- **Docker** (si tienes Docker)

### 1.2 Crear Database
```bash
createdb -U postgres carriup
```

### 1.3 Ejecutar Schema
```bash
psql -U postgres -d carriup < scripts/init-db.sql
```

### 1.4 Verificar
```bash
psql -U postgres -d carriup -c "SELECT COUNT(*) FROM products;"
# Debe mostrar: 25
```

### 1.5 Reiniciar Backend
```bash
cd backend && npm run dev
```

Verifica:
```bash
curl http://localhost:3001/api/health | jq .
# Debe mostrar: "database": "connected" ✅
```

---

## PASO 2: Integración IA (Claude API) (45 min)

### 2.1 Obtener API Key

1. Ve a: https://console.anthropic.com
2. Haz login (crea cuenta si no tienes)
3. Copia tu API Key (sk-ant-...)
4. Pégala en `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

### 2.2 Instalar SDK
```bash
cd backend
npm install @anthropic-ai/sdk
```

### 2.3 Agregar Endpoint de IA

El endpoint `/api/ai/recommend` ya está preparado en el código.

Se agregará lógica para:
- Recibir lista de productos
- Consultar Claude API
- Obtener recomendaciones inteligentes
- Retornar sugerencias

Ejemplo:
```bash
curl -X POST http://localhost:3001/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "products": ["leche", "cafe", "pan"],
    "budget": 10000,
    "preferences": "vegetariano"
  }'
```

### 2.4 Agregar en Frontend

Nuevo botón en comparación:
```
[💡 Obtener Recomendaciones IA]
```

Al hacer clic:
- Envía productos al backend
- Backend consulta Claude
- Frontend muestra sugerencias

---

## PASO 3: Deploy a Producción (1 hora)

### 3.1 Frontend en Vercel

```bash
# 1. Crear cuenta Vercel
# https://vercel.com (usa GitHub)

# 2. Conectar repo
# Vercel → New Project → Connect Git

# 3. Deploy automático en cada push
git push origin main
# → Vercel deploya automático
# → URL: carriup.vercel.app
```

### 3.2 Backend en Railway

```bash
# 1. Crear cuenta Railway
# https://railway.app (usa GitHub)

# 2. Conectar repo
# Railway → Create → Deploy from GitHub

# 3. Configurar variables de entorno
# En Railway dashboard:
DB_HOST=tu-postgres.railway.internal
DB_PORT=5432
DB_NAME=carriup
DB_USER=postgres
DB_PASSWORD=***
ANTHROPIC_API_KEY=sk-ant-***
JWT_SECRET=***

# 4. Deploy automático
# Railway construye e deploya automático
# → URL: tu-app.railway.app
```

### 3.3 Database en Production

Opciones:

**A) PostgreSQL en Railway (RECOMENDADO)**
```
Railway → Create → PostgreSQL
Automáticamente asignará DB_HOST y credenciales
```

**B) Supabase (alternativa)**
```
https://supabase.com
- Base de datos PostgreSQL gratis
- Incluye Auth integrado
- Dashboard intuitivo
```

---

## Timeline

| Paso | Tiempo | Bloqueador |
|------|--------|-----------|
| PostgreSQL local | 15 min | Instalación |
| Migrations | 10 min | Script SQL |
| Testing BD | 5 min | Conexión |
| Claude SDK | 5 min | npm install |
| Endpoint IA | 20 min | Integración |
| Testing IA | 10 min | API Key |
| Vercel deploy | 15 min | GitHub + Vercel |
| Railway deploy | 15 min | Railway account |
| Testing producción | 10 min | URLs |

**Total: 2.5-3.5 horas**

---

## Checklist Final

- [ ] PostgreSQL 15 instalado localmente
- [ ] Database `carriup` creada
- [ ] Schema ejecutado (25 productos)
- [ ] Backend conectado a PostgreSQL real
- [ ] Health check muestra "database: connected"
- [ ] API Key de Claude obtenida
- [ ] SDK @anthropic-ai instalado
- [ ] Endpoint `/api/ai/recommend` funcionando
- [ ] Frontend conectado a IA
- [ ] Vercel account creado
- [ ] Frontend deploado en Vercel
- [ ] Railway account creado
- [ ] Backend deploado en Railway
- [ ] PostgreSQL en producción configurado
- [ ] Testing end-to-end en producción

---

## Comando Rápido: Todo junto (después de instalar PostgreSQL)

```bash
# 1. Setup BD
createdb -U postgres carriup
psql -U postgres -d carriup < scripts/init-db.sql

# 2. Backend
cd backend
npm install @anthropic-ai/sdk
npm run dev

# 3. Frontend (otra terminal)
cd frontend && npm run dev

# 4. Verifica
curl http://localhost:3001/api/health | jq .
curl http://localhost:3001/api/products/search?query=leche

# ✅ Listo para producción
```

---

## ¿Necesitas ayuda?

Cuando hayas completado cada paso, avísame y continuamos con el siguiente.

**Próximo paso:** Instala PostgreSQL y ejecuta los comandos del PASO 1.

