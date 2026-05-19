# Carriup — Optimizador de Compras Inteligente

> **v2.1** — Arquitectura profesional + UI moderna + fotos de productos + En Producción

**Estado:** ✅ EN PRODUCCIÓN — Frontend Vercel + Backend Railway  
**Última actualización:** 19 de mayo, 2026 (Deploy Completado)

## 🌐 URLs de Producción

| Servicio | URL |
|---------|-----|
| Frontend | https://carriup-jaba.vercel.app |
| Backend | https://carriup-backend-production.up.railway.app |
| GitHub | https://github.com/jorgebocchieri/carriup |

## ⚠️ Problemas Conocidos y Soluciones

### 1. node_modules en GitHub (ERROR: archivo >100MB)
**Problema:** `frontend/node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node` supera el límite de GitHub (100MB)  
**Solución:** Crear `.gitignore` con `node_modules/` ANTES de hacer `git add`  
**Comando:**
```bash
# Si ya hiciste git add, resetea el repo completo:
rm -rf .git
git init
# Crear .gitignore primero, luego git add
```

### 2. Package.json en raíz del proyecto (ERROR: versiones inválidas)
**Problema:** Había un `package.json` en la raíz con versiones de dependencias que no existen (ej: `jsonwebtoken@^9.1.2`)  
**Solución:** Eliminar el `package.json` de la raíz — el backend tiene su propio `package.json` en `backend/`  
**Comando:** `rm package.json` en la raíz

### 3. Vercel: rootDirectory en vercel.json (ERROR: invalid property)
**Problema:** `vercel.json` con propiedad `rootDirectory` es inválida  
**Solución:** El `rootDirectory` se configura solo en el dashboard de Vercel o via CLI, no en `vercel.json`  
**vercel.json correcto:**
```json
{ "framework": "nextjs" }
```

### 4. Vercel: Root Directory mal configurado
**Problema:** Vercel detecta la raíz del proyecto e intenta instalar dependencias del `package.json` raíz (que no existe o tiene errores)  
**Solución:** Usar Vercel CLI desde la carpeta `frontend/` directamente:
```bash
cd frontend/
vercel --prod
```

### 5. Permisos npm install -g (ERROR: EACCES)
**Problema:** `npm install -g vercel` falla por permisos en macOS  
**Solución:** Usar `sudo npm install -g vercel`

### 6. Railway CLI: Unauthorized
**Problema:** `railway init` falla con "Unauthorized"  
**Solución:** Ejecutar `railway login` primero (abre navegador para autorizar con GitHub)

### 7. Railway domain desde carpeta incorrecta
**Problema:** `railway domain` falla con "No linked project found"  
**Solución:** Ejecutar desde la carpeta `backend/` donde está el proyecto Railway linkeado

### 8. Health check backend muestra error aunque funciona
**Problema:** `/api/health` retorna `{"success": false}` porque intenta conectar a PostgreSQL (no instalado)  
**Solución:** Los endpoints de búsqueda y comparación funcionan igual usando mock data en memoria. El health check es solo informativo.

---

---

## 🎯 Visión del Producto

**Carriup** es una plataforma web que revoluciona la forma en que chilenos compran en supermercados mediante:

1. **Búsqueda inteligente** — Autocomplete con fotos de productos en tiempo real
2. **Comparación de precios** — Compara 4 supermercados (Jumbo, Lider, Santa Isabel, Unimarc)
3. **Carrito funcional** — Agrega múltiples productos, marcas, variedades y cantidades
4. **Optimización automática** — Identifica el supermercado más barato con cálculo total
5. **Ahorros calculados** — Muestra ahorro potencial en comparación
6. **Interfaz moderna** — Diseño profesional con colores índigo/naranja, animaciones suaves
7. **Fotos de productos** — Imágenes dinámicas de Unsplash para cada producto

**Futuro:**
- IA generativa (Claude) para recomendaciones
- Predicción de bajadas de precio
- Web scraping para precios reales
- Historial de precios con gráficos

---

## 📊 Stack Tecnológico — v2.0

### Frontend
- **Framework:** Next.js 14 (App Router, SSR)
- **Lenguaje:** TypeScript
- **UI:** React 18
- **Estilos:** Tailwind CSS + Custom CSS (gradientes, animaciones)
- **Tipografía:** Inter (body) + Plus Jakarta Sans (headings)
- **Imágenes:** Unsplash API (fotos dinámicas de productos)
- **HTTP Client:** axios
- **Estado:** Local useState (simple, efectivo para MVP)

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Fastify (380+ líneas)
- **Lenguaje:** JavaScript ES modules
- **Autenticación:** JWT + bcrypt
- **Validación:** Zod schemas
- **Seguridad:** Helmet + CORS configurado

### Base de Datos
- **Principal:** PostgreSQL 15 (normalizado)
- **Cache:** Redis 7 (preparado)
- **Schema:** 5 tablas (users, products, prices, lists, searches)
- **Seed:** 25 productos × 4 supermercados = 100 registros

### Infraestructura
- **Containerización:** Docker + Docker Compose
- **Servicios:** 4 (PostgreSQL, Redis, Backend, Frontend)
- **Volúmenes:** Hot-reload en desarrollo
- **Health Checks:** En todos los servicios

### IA & ML (Preparado para Fase 3)
- **LLM:** Claude 3.5 Sonnet (cuando tengas API Key)
- **Endpoint:** `/api/ai/recommend` (mock actualmente)
- **Embeddings:** Preparado con pgvector en PostgreSQL
- **Predicción:** Placeholder para Phase 4

### DevOps & Hosting (Futuro)
- **Frontend:** Vercel (cuando hagas deploy)
- **Backend:** Railway o Render
- **Database:** Railway PostgreSQL
- **Dev Local:** Docker Compose
- **Cache:** Upstash Redis (serverless)
- **Secrets:** env variables en Vercel + Railway

---

## 📁 Estructura del Proyecto — v2.0

```
Testeo Aplicación Carriup/
├── backend/                     # Backend Fastify (380+ líneas)
│   ├── src/
│   │   └── server.js           # Servidor + 8 endpoints
│   ├── package.json            # fastify, pg, bcryptjs, jwt, zod
│   └── Dockerfile
│
├── frontend/                    # Frontend Next.js (350+ líneas)
│   ├── app/
│   │   ├── layout.tsx          # Layout global
│   │   ├── page.tsx            # Redirect a /compare
│   │   ├── globals.css         # Estilos globales
│   │   ├── compare/
│   │   │   └── page.tsx        # 🔥 Página principal (comparador)
│   │   ├── login/
│   │   │   └── page.tsx        # Login (para futuro)
│   │   └── lists/
│   │       └── page.tsx        # Mis listas (para futuro)
│   ├── components/             # Componentes reutilizables
│   ├── lib/                    # Utilidades
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── package.json
│   └── Dockerfile
│
├── scripts/
│   └── init-db.sql            # Schema + seed (250+ líneas)
│
├── docker-compose.yml         # 4 servicios: postgres, redis, backend, frontend
├── .env.example              # Variables de entorno
│
├── 📚 DOCUMENTACIÓN
├── START_HERE.md              # ← LEER PRIMERO (Quick start)
├── V2_CONSTRUCTION_COMPLETE.md # Detalles técnicos
├── PROGRESS_SUMMARY.md         # Resumen de progreso
├── CLAUDE.md                  # Este archivo (convenciones + info)
├── DEMO_COMPLETE.md           # MVP v1 (anterior)
│
├── 🎯 MVP v1 (Aún funciona en localhost:8080)
├── server.js
├── web-server.js
├── price_comparison_enhanced.html
├── login_connected.html
└── database.json
```

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────┐
│  Frontend (Next.js 14)              │
│  - React 18 + TypeScript            │
│  - Tailwind CSS                     │
│  - Puerto 3000                      │
├─────────────────────────────────────┤
│  Backend (Fastify)                  │
│  - 8 endpoints RESTful              │
│  - JWT + bcrypt                     │
│  - Zod validation                   │
│  - Puerto 3001                      │
├─────────────────────────────────────┤
│  Data Layer                         │
│  - PostgreSQL (usuarios, precios)   │
│  - Redis (caché, sesiones)          │
└─────────────────────────────────────┘
```

---

## 🎨 Diseño Visual & UX — v2.1

### Paleta de Colores
- **Primario:** Índigo (`#6366f1`) + Dark (`#4f46e5`)
- **Accent:** Naranja (`#f97316`)
- **Success:** Verde (`#10b981`)
- **Fondo:** Gradiente blanco a gris 50
- **Tipografía:** Gris 900 (`#111827`)

### Componentes Visuales
- **Encabezado:** Sticky, translúcido con blur (glassmorphism)
- **Tarjetas:** Sombras suaves, bordes redondeados 2xl, transiciones fluidas
- **Botones:** Gradientes, hover con scale-up, active con scale-down
- **Modal:** Fade-in + slide-up, overlay con blur
- **Dropdowns:** Animación slide-in-down, scroll suave
- **Imágenes:** Unsplash API, caché local, fallback genérico

### Animaciones
- `slideInDown` — Elementos aparecen desde arriba
- `slideInUp` — Elementos aparecen desde abajo
- `fadeIn` — Fade suave de opacidad
- Transiciones hover/active en botones y tarjetas

### Tipografía
- **Plus Jakarta Sans:** Headings (h1-h6), font-weight 700
- **Inter:** Body text, sizes 300-800
- Letter-spacing: -0.02em en headings para compactness

### Fotos de Productos
- **Fuente:** Unsplash API (https://api.unsplash.com)
- **Búsqueda:** Dinámica por nombre del producto
- **Caché:** Local storage en memoria para evitar requests repetidas
- **Fallback:** Imagen genérica si la búsqueda falla
- **Resoluciones:** Small (dropdown), grande (modal)

---

## 🔧 Desarrollo Local — Guía Rápida

### Opción 1: Docker Compose (RECOMENDADO)

```bash
# Desde la raíz del proyecto
docker-compose up

# Espera a ver:
# ✅ Carriup Backend (Fastify) is running
# ✅ > ready - started server on 0.0.0.0:3000

# Accede a:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:3001
# PostgreSQL: localhost:5432
```

### Opción 2: Local (3 terminales)

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# → http://localhost:3001

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Terminal 3: PostgreSQL
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine
# Luego en otra terminal:
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE carriup;"
psql -h localhost -U postgres -d carriup < scripts/init-db.sql
```

### Comandos Útiles

```bash
# Ver logs de un servicio
docker logs carriup-backend
docker logs carriup-frontend

# Entrar a PostgreSQL
docker exec -it carriup-postgres psql -U postgres -d carriup

# Ver estado de todos los servicios
docker-compose ps

# Detener todo
docker-compose down

# Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

---

## 📝 Convenciones de Código

### Backend (Fastify)
- **Archivos:** `server.js` (archivo único para MVP)
- **Endpoints:** `/api/{recurso}/{acción}`
- **Métodos:** GET, POST, PUT, DELETE
- **Auth:** Bearer token en header `Authorization`
- **Errores:** HTTP status codes + JSON response
- **Validación:** Zod schemas en cada endpoint

### Frontend (Next.js)
- **Pages:** `app/{recurso}/page.tsx`
- **Componentes:** En `app/` o `components/`
- **Hooks:** Custom hooks en `hooks/`
- **Tipos:** TypeScript inline o en tipos compartidos
- **Estilos:** Tailwind CSS clases
- **API calls:** axios con try-catch
- Usar branded types para IDs (`type UserId = string & { readonly __brand: "UserId" }`)

### React & Next.js
- Server Components por defecto, `"use client"` solo cuando necesario
- Componentes funcionales (no clases)
- Props destructuradas con tipos inline (no interfaces para props simples)
- Hooks: `use*` prefix obligatorio para custom hooks

### Backend (Fastify)
- Rutas en `/src/routes/`, una por recurso
- Servicios sin efectos secundarios, composables
- Validación con Zod antes de lógica
- Errores con clases custom (`UserNotFoundError extends HttpError`)

### Bases de Datos
- Migraciones con Drizzle `pnpm run db:migrate`
- Schema en `src/models/db.ts`
- Queries con `db.query.*` (no raw SQL sin validación)

### Commits
```
<tipo>(<scope>): <descripción>

[opcional: explicación en párrafo]
[opcional: breaking changes]

# Tipos: feat, fix, refactor, docs, style, test, chore, perf
# Scope: api, web, db, ai, scraper, etc.

# Ejemplo:
feat(api): add recipe-to-list conversion with Claude API
```

---

## Desarrollo Local

### Requisitos
- Node.js 20+ (o usar `fnm use`)
- pnpm 8+ (`npm install -g pnpm`)
- Docker (para PostgreSQL + Redis local, opcional)
- Git

### Setup Inicial

```bash
# Clonar repo
git clone <repo> carriup && cd carriup

# Instalar dependencias
pnpm install

# Variables de entorno
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local

# Llenar .env.local con:
# - DATABASE_URL (PostgreSQL)
# - REDIS_URL
# - CLERK_SECRET_KEY
# - ANTHROPIC_API_KEY (Claude API)
# - VERCEL_ENV=development

# Inicializar DB
pnpm run db:push

# Seed datos (supermercados, productos)
pnpm run seed

# Dev servers
pnpm run dev
# → web: http://localhost:3000
# → api: http://localhost:3001
```

### Comandos Principales

```bash
# Development
pnpm run dev              # Iniciar web + api en modo watch

# Building
pnpm run build            # Build web + api
pnpm run build:web
pnpm run build:api

# Database
pnpm run db:push          # Aplicar cambios schema a DB
pnpm run db:migrate       # Migraciones
pnpm run db:studio        # Drizzle Studio (UI para ver datos)

# Linting & Format
pnpm run lint             # ESLint
pnpm run format           # Prettier

# Testing
pnpm run test             # Vitest
pnpm run test:watch
pnpm run test:ui

# Scraping (manual)
pnpm run scrape:prices    # Ejecutar scraper una vez

# Type checking
pnpm run type-check       # tsc --noEmit
```

---

## Variables de Entorno

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### `apps/api/.env.local`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/carriup
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
CLERK_SECRET_KEY=sk_test_...
NODE_ENV=development
```

---

## Flujos Principales

### 1. Usuario crea lista por descripción
```
Usuario escribe: "Necesito desayunar una semana, soy vegano"
  → API /lists/generate-from-text (POST)
  → Claude interpreta + genera lista JSON
  → Guarda en DB (lista + items)
  → Frontend muestra lista con precios comparados
```

### 2. Comparación de precios
```
Lista tiene 10 productos
  → API /prices/compare (POST)
  → Scraper busca en 4 supermercados
  → Calcula mejor opción (1 super vs. múltiples)
  → Retorna: item, precios, mejor opción, ahorro total
```

### 3. Predicción de bajada de precio
```
Usuario agrega producto a lista pero no compra aún
  → Cron job (diario) actualiza precios históricos
  → ML predice: "leche bajará 15% en 5 días"
  → Push notification al usuario
  → Usuario compra en el mejor momento
```

---

## Testing

- **Frontend:** Vitest + React Testing Library
- **Backend:** Vitest + supertest (para rutas HTTP)
- **E2E:** Playwright (flows críticos)

```bash
pnpm run test:web
pnpm run test:api
pnpm run test:e2e
```

---

## Deployment

### Vercel (Frontend)
```bash
git push origin main
# → Vercel deploya automático
# → URL: carriup.vercel.app
```

### Railway (Backend + Database)
```bash
# Conectar repo a Railway
# → Variables de entorno automáticas
# → Deploy en cada push a main
```

---

## Mejoras Futuras (Roadmap)

- [ ] Integración Rappi/Cornershop (delivery)
- [ ] App móvil (React Native + Expo)
- [ ] Escáner de código de barras
- [ ] Lista colaborativa (WebSockets)
- [ ] Historial de listas guardadas
- [ ] API pública (partners)
- [ ] Análisis de gasto personal

---

## Contacto & Contribución

- **Creador:** Jorge Bocchieri (jorge@jaba.cl)
- **Repo:** github.com/jaba/carriup
- **Issues:** GitHub Issues
- **PRs:** Bienvenidas (seguir convenciones arriba)

---

## Licencia

MIT
