# 📊 Análisis de Carriapp vs Carriup (Propuesta)

## Carriapp (Estado Actual)

### Identidad
- **Nombre:** Carriapp — Optimizador de compras de Supermercado
- **Mercado:** Chile
- **URL:** https://www.carriapp.cl
- **Plataforma:** PWA (Progressive Web App)
- **Stack:** React (SPA) + manifest.json
- **Branding:** Naranja `#FF6600` + Blanco `#ffffff`

### Funcionalidades Actuales
1. ✅ Armar lista de compras
2. ✅ Comparar precios entre supermercados
3. ✅ Sugerir dónde comprar más barato
4. ✅ PWA instalable (funciona como app nativa)

### Flujo de Usuario
```
1. Usuario abre app
2. Crea/edita lista de compras (manual)
3. Agrega productos (búsqueda?)
4. App compara precios en supermercados
5. Muestra mejor opción / ahorro total
6. Usuario va al supermercado
```

### Debilidades Identificadas
❌ **SPA pura** → sin SSR → mala indexación SEO
❌ **Sin IA** → listas manuales, no recomendaciones
❌ **Sin historial** → no ve evolución de precios
❌ **Sin colaboración** → listas individuales solo
❌ **Sin delivery** → no integra Rappi/Cornershop
❌ **Sin gamificación** → experiencia plana
❌ **UI/UX limitada** → solo naranja/blanco, poco atractiva

---

## Carriup (Propuesta Mejorada)

### Identidad
- **Nombre:** Carriup — Optimizador de Compras Inteligente
- **Diferenciador:** IA generativa (Claude) + Predicción ML
- **Mercado:** Chile (expandible Latam)
- **Plataforma:** Web (Next.js) + PWA + App móvil (React Native futura)

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Backend** | Fastify + Node.js + TypeScript |
| **Database** | PostgreSQL 15+ + Drizzle ORM |
| **Cache** | Redis (precios actualizados) |
| **IA** | Claude 3.5 Sonnet (API Anthropic) |
| **ML** | Prophet (predicción de precios) |
| **Hosting** | Vercel (frontend) + Railway (backend) |

### Funcionalidades Mejoradas

#### MVP (Core)
✅ Listas de compra **generadas por IA** (lenguaje natural → lista)
✅ Comparación multi-supermercado optimizada
✅ Sugerencias IA de alternativas más baratas
✅ Historial de precios con gráficos
✅ Alertas de bajadas de precio

#### Phase 2
✅ Predicción ML: "bajará X% en 5 días"
✅ Listas colaborativas en tiempo real (WebSockets)
✅ Escáner de código de barras (móvil)
✅ Dark mode + UI mejorada
✅ SEO excelente (SSR con Next.js)

#### Phase 3
✅ Integración Rappi/Cornershop (delivery)
✅ App nativa (React Native + Expo)
✅ API pública (para partners)
✅ Dashboard analytics personal

### Flujo de Usuario Mejorado

```
1️⃣ Usuario describe su necesidad:
   "Desayuno para una semana, soy vegano"
   
2️⃣ Claude genera lista automática:
   - Huevos veganos? → Tofu, tempeh
   - Pan? → Integral, sin gluten (opciones)
   - Bebidas? → Leche de almendra, café
   
3️⃣ Sistema compara precios en:
   - Jumbo, Lider, Santa Isabel, Unimarc
   
4️⃣ IA sugiere mejores opciones:
   ✨ "Leche de almendra marca Alianza cuesta 30% menos en Unimarc"
   ✨ "Tofu está en oferta en Jumbo esta semana"
   
5️⃣ Predicción ML:
   📈 "Pan integral bajará 15% en 3 días, espera"
   
6️⃣ Usuario compra al mejor precio/momento
```

### Diferenciadores Clave

| Feature | Carriapp | Carriup |
|---------|----------|---------|
| **Generación de listas** | Manual | IA (Claude) |
| **Recomendaciones** | Ninguna | IA sugiere alternativas |
| **Precios históricos** | No | Sí, con gráficos |
| **Predicción de precios** | No | ML (Prophet) |
| **SEO** | Pobre (SPA) | Excelente (SSR) |
| **Búsqueda** | Básica | Semántica con embeddings |
| **Colaboración** | No | Sí (Phase 2) |
| **Delivery integrado** | No | Sí (Phase 3) |
| **Escalabilidad** | Limitada | Serverless, auto-scaling |

---

## Supermercados Objetivo (MVP)

1. **Lider** — Mayoría market share
2. **Jumbo** — Competencia fuerte
3. **Santa Isabel** — Presencia rural
4. **Unimarc** — Nicho premium

---

## Plan de Desarrollo

### Fase 1 — MVP (4-6 semanas)
- [ ] Backend (Fastify + PostgreSQL)
- [ ] Scrapers de precios (Playwright)
- [ ] Integración Claude API (receta → lista)
- [ ] Frontend básico (búsqueda + lista + comparación)
- [ ] Auth (Clerk)
- [ ] Deploy (Vercel + Railway)

### Fase 2 — Diferenciación (6-8 semanas)
- [ ] Historial de precios + gráficos
- [ ] ML predicción (Prophet)
- [ ] Búsqueda semántica (embeddings)
- [ ] Lista colaborativa (WebSockets)
- [ ] Push notifications
- [ ] Dark mode

### Fase 3 — Monetización (4 semanas)
- [ ] Plan premium
- [ ] Integración Rappi/Cornershop
- [ ] Dashboard analytics

---

## Modelo de Negocio

1. **Freemium**
   - Gratis: 1 lista/semana, sin historial
   - Premium: listas ilimitadas, historial 30 días, alertas

2. **Afiliados**
   - Comisión por compras en Rappi/Cornershop

3. **B2B**
   - API de precios para retailers
   - Datos de mercado para marcas

---

## Infraestructura & DevOps

```
GitHub (código)
    ↓
Vercel (frontend auto-deploy)
Railway (backend auto-deploy)
    ↓
PostgreSQL (Neon)
Redis (Upstash)
    ↓
Cron jobs (actualizar precios diarios)
```

**Costo inicial estimado:** ~$50-100/mes (serverless)

---

## Decisiones Técnicas (Jorge)

✅ **Plataforma:** Web (Next.js) — SSR óptimo
✅ **Implementación:** Full-stack por Jorge
✅ **Diferenciador:** IA y recomendaciones (Claude API)
✅ **Hosting:** Vercel + Railway
✅ **DevX:** pnpm workspaces, TypeScript strict, ESLint + Prettier

---

## Próximos Pasos

1. ✅ Análisis completado (17/05/2026)
2. ✅ CLAUDE.md creado (documentación técnica)
3. ✅ Memory.md creado (contexto persistente)
4. 🔄 Iniciar MVP:
   - [ ] Crear monorepo (pnpm)
   - [ ] Setup Next.js + Fastify
   - [ ] Integrar Claude API
   - [ ] Primer scraper (Lider)
   - [ ] Deploy prueba

---

## Recursos

- **Documentación:** `/CLAUDE.md` en el proyecto
- **Repo memory:** `/memory/project_carriup.md`
- **Análisis Carriapp:** Esta página
- **Referencia Carriapp:** https://www.carriapp.cl

---

**Creado:** 17/05/2026
**Por:** Jorge Bocchieri (jorge@jaba.cl)
**Estado:** Planificación ✅ → MVP 🚀
