# ✅ Checklist de Inicio — Carriup MVP

Sigue esta lista para asegurar que todo está listo antes de comenzar.

## 📋 Pre-requisitos

- [ ] Node.js 20+ instalado (`node --version`)
- [ ] pnpm 8+ instalado (`pnpm --version`)
- [ ] Docker instalado (para PostgreSQL + Redis local)
- [ ] Git configurado (`git config --list`)
- [ ] ANTHROPIC_API_KEY generada (https://console.anthropic.com)

Verifica:
```bash
node --version   # v20+
pnpm --version   # 8+
docker --version # Docker Desktop ejecutándose
```

## 📚 Documentación

- [ ] Leído **README.md** (esta carpeta)
- [ ] Revisado **ANALISIS_CARRIAPP.md** (entender diferenciadores)
- [ ] Estudiado **CLAUDE.md** (arquitectura técnica)
- [ ] Visto **QUICKSTART.md** (pasos de setup)

## 🛠️ Setup del Proyecto

- [ ] Carpeta `/carriup` creada
- [ ] `git init` ejecutado
- [ ] `pnpm-workspace.yaml` creado
- [ ] Estructura de carpetas creada:
  - [ ] `apps/web/`
  - [ ] `apps/api/`
  - [ ] `packages/shared/`
  - [ ] `scripts/`

## 🐳 Docker & Local Services

- [ ] Docker Desktop ejecutándose
- [ ] `docker-compose.yml` creado en raíz
- [ ] `docker compose up -d` ejecutado
- [ ] PostgreSQL verificado: `psql -h localhost -U postgres -c "SELECT 1"`
- [ ] Redis verificado: `redis-cli ping`

## ⚙️ Backend Setup

- [ ] `apps/api/package.json` creado
- [ ] Dependencias instaladas: `pnpm install`
- [ ] `src/main.ts` (servidor Fastify básico)
- [ ] `tsconfig.json` configurado
- [ ] `.env.local` con variables:
  - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carriup`
  - `REDIS_URL=redis://localhost:6379`
  - `ANTHROPIC_API_KEY=sk-ant-xxxxx`

## 🎨 Frontend Setup

- [ ] `apps/web/` inicializado con Next.js 14
- [ ] Dependencias instaladas: `pnpm install`
- [ ] `.env.local` con variables:
  - `NEXT_PUBLIC_API_URL=http://localhost:3001`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx`

## 🔗 Shared Types

- [ ] `packages/shared/src/types.ts` creado
- [ ] Tipos base (Product, Price, ShoppingList, etc.)
- [ ] Vinculado en monorepo (`pnpm-workspace.yaml`)

## 🧪 Verificación de Conexión

- [ ] Backend se inicia: `cd apps/api && pnpm dev`
- [ ] Frontend se inicia: `cd apps/web && pnpm dev`
- [ ] Health check funciona:
  ```bash
  curl http://localhost:3001/health
  # Esperado: {"status":"ok","timestamp":"..."}
  ```

## 🔑 Credenciales & API Keys

- [ ] ANTHROPIC_API_KEY generada y añadida a `.env.local`
  - Crear en: https://console.anthropic.com/account/keys
- [ ] (Opcional) Clerk API keys para auth
  - Crear en: https://dashboard.clerk.com

## 🚀 Primer Endpoint

- [ ] Ruta `/api/lists/generate` creada en backend
- [ ] Integrada Claude API
- [ ] Testeada manualmente:
  ```bash
  curl -X POST http://localhost:3001/api/lists/generate \
    -H "Content-Type: application/json" \
    -d '{"description": "Desayuno vegano"}'
  ```
- [ ] Respuesta JSON validada

## 📊 Git & Control de Versión

- [ ] `.gitignore` creado
- [ ] Commit inicial: `git add . && git commit -m "feat: initial project setup"`
- [ ] Rama `main` protegida (en GitHub, si aplica)
- [ ] Repo creado en GitHub (opcional)

## 🔗 Integración Continua (CI/CD)

- [ ] (Opcional) GitHub Actions configurado para tests
- [ ] (Opcional) Vercel conectado (frontend)
- [ ] (Opcional) Railway conectado (backend)

## 📈 Próximas Fases (Documentadas)

- [ ] Roadmap MVP entendido (ANALISIS_CARRIAPP.md)
- [ ] Fase 1 features claras
- [ ] Plan de scraping definido (supermercados)
- [ ] Modelo de datos finalizado

---

## ✨ ¿Ya Completaste Todo?

Si todos los checks están ✅, **¡estás listo para comenzar el MVP!**

### Próximos Pasos Inmediatos:

1. **Crear scraper de Lider** (supermercado #1)
   - Usar Playwright para extraer productos + precios
   - Guardar en PostgreSQL

2. **API de precios**
   - Endpoint: `GET /api/prices/search?product=...&supermarkets=...`
   - Retornar comparación de precios

3. **Frontend: lista → precios**
   - Crear lista con Claude API
   - Mostrar precios comparados

4. **Deploy MVP**
   - Vercel (frontend)
   - Railway (backend)

---

**Estado:** ✅ Listo para comenzar
**Duración estimada fase setup:** 2-3 horas
**Duración MVP:** 4-6 semanas

🚀 **¡Adelante con Carriup!**
