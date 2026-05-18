# 🚀 Quick Start — Carriup MVP

Guía rápida para iniciar el proyecto desde cero.

---

## 1️⃣ Crear Estructura de Proyecto

```bash
mkdir carriup && cd carriup

# Inicializar pnpm workspace
cat > pnpm-workspace.yaml << 'YAML'
packages:
  - 'apps/*'
  - 'packages/*'
YAML

# Crear estructura
mkdir -p apps/{web,api} packages/shared scripts

# Inicializar Git
git init
git config user.email "jorge@jaba.cl"
git config user.name "Jorge Bocchieri"

# Crear .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env.local
.env*.local
.vercel/
.next/
.DS_Store
*.log
EOF
```

---

## 2️⃣ Setup Backend (Fastify)

```bash
cd apps/api

# Inicializar
npm init -y

# Instalar dependencias
pnpm add fastify @fastify/cors @fastify/helmet @anthropic-ai/sdk
pnpm add -D typescript @types/node tsx

# Crear estructura
mkdir -p src/{routes,services,models,middleware}
touch src/main.ts tsconfig.json

# Minimal tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
EOF

# Minimal src/main.ts
cat > src/main.ts << 'EOF'
import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });

fastify.register(cors);

fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
EOF

# package.json scripts
pnpm pkg set scripts.dev="tsx watch src/main.ts"
pnpm pkg set scripts.build="tsc"
pnpm pkg set scripts.start="node dist/main.js"
```

---

## 3️⃣ Setup Frontend (Next.js)

```bash
cd ../web

# Crear con create-next-app
pnpm create next-app@latest . --typescript --tailwind --app

# Instalar dependencias adicionales
pnpm add @tanstack/react-query zod @hookform/resolvers shadcn-ui

# Crear estructura
mkdir -p app/{(auth),(app)} components/ui lib hooks

# .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
EOF
```

---

## 4️⃣ Setup Shared Types

```bash
cd ../../packages/shared

npm init -y
mkdir src

cat > src/types.ts << 'EOF'
export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
}

export interface Price {
  productId: string;
  supermarket: string;
  price: number;
  date: Date;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: Date;
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  quantity: number;
  unit: string;
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
EOF
```

---

## 5️⃣ Setup Environment Variables

Crear en raíz del proyecto:

```bash
# .env.development
cat > .env.development << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carriup
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx
NODE_ENV=development
EOF
```

---

## 6️⃣ Setup Docker Compose (Local Dev)

```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: carriup
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Iniciar
docker compose up -d
```

---

## 7️⃣ Primer Endpoint (Claude API Integration)

Crear `apps/api/src/routes/lists.ts`:

```typescript
import Fastify from "fastify";
import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function listRoutes(fastify: Fastify.FastifyInstance) {
  fastify.post<{ Body: { description: string } }>(
    "/lists/generate",
    async (request, reply) => {
      const { description } = request.body;

      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Eres un asistente que convierte descripciones de compras en listas estructuradas.
            
Descripción: "${description}"

Retorna un JSON con estructura:
{
  "items": [
    {"name": "producto", "category": "categoría", "quantity": 1, "unit": "unidad"}
  ]
}`,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === "text") {
        const json = JSON.parse(content.text);
        return { success: true, data: json };
      }

      return { success: false, error: "Invalid response" };
    }
  );
}
```

Registrar en `src/main.ts`:

```typescript
import { listRoutes } from "./routes/lists";

// ...dentro de start()...
await fastify.register(listRoutes, { prefix: "/api" });
```

---

## 8️⃣ Probar Endpoints

```bash
# Terminal 1: Backend
cd apps/api
pnpm dev

# Terminal 2: Frontend
cd apps/web
pnpm dev

# Terminal 3: Test API
curl -X POST http://localhost:3001/api/lists/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Desayuno para una semana, soy vegano"}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "items": [
      {"name": "Tofu", "category": "Proteínas", "quantity": 2, "unit": "kg"},
      {"name": "Leche de almendra", "category": "Bebidas", "quantity": 2, "unit": "L"},
      ...
    ]
  }
}
```

---

## 9️⃣ Deploy en Vercel + Railway

### Frontend (Vercel)
```bash
cd apps/web

# Conectar a GitHub primero
# Luego en Vercel dashboard: Import > Select repo

# Variables de entorno en Vercel:
# NEXT_PUBLIC_API_URL = https://carriup-api.railway.app
```

### Backend (Railway)
```bash
# Crear proyecto en railway.app
# Conectar repo
# Variables:
# DATABASE_URL = PostgreSQL connection string
# REDIS_URL = Redis connection string
# ANTHROPIC_API_KEY = tu clave
```

---

## 🔟 Próximos Pasos Recomendados

1. ✅ Estructura lista
2. ⏭️ **Integrar Clerk para auth**
3. ⏭️ **Crear scraper de Lider** (primer supermercado)
4. ⏭️ **API de precios** (`/api/prices/search`)
5. ⏭️ **Frontend: lista → precios → comparación**
6. ⏭️ **Historial de precios (gráficos)**
7. ⏭️ **Deploy a producción**

---

## 📚 Recursos

- CLAUDE.md — Documentación técnica completa
- ANALISIS_CARRIAPP.md — Análisis y diferenciadores
- https://www.anthropic.com/docs — Claude API docs
- https://nextjs.org/docs — Next.js 14 docs
- https://www.fastify.io/docs/latest/ — Fastify docs

---

**¿Listo?** Ejecuta `docker compose up -d` y comienza el MVP.
