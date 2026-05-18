# 🚀 Setup Supabase — PostgreSQL en la Nube (5 minutos)

**Alternativa rápida a PostgreSQL local sin instalación**

---

## Paso 1: Crear Cuenta Supabase (1 min)

1. Ve a: https://supabase.com
2. Haz clic en "Sign Up"
3. Elige "Continue with GitHub" (recomendado)
4. Autoriza Supabase

---

## Paso 2: Crear Proyecto (2 min)

1. Haz clic en "New Project"
2. Nombre: `carriup`
3. Password: genera una segura (guárdala)
4. Region: elige la más cercana a tu ubicación
5. Haz clic "Create new project"

**Espera a que se cree (1-2 min)...**

---

## Paso 3: Obtener Credenciales (1 min)

Una vez creado el proyecto:

1. Ve a **Settings** → **Database**
2. Copia estos valores:
   - **Host:** (algo como `db.xxxx.supabase.co`)
   - **Port:** `5432`
   - **Database:** `postgres`
   - **User:** `postgres`
   - **Password:** la que ingresaste arriba

---

## Paso 4: Actualizar .env (1 min)

Abre `backend/.env` y reemplaza:

```env
DB_HOST=db.xxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Resto igual...
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

---

## Paso 5: Crear Schema (2 min)

En tu Mac, abre terminal y ejecuta:

```bash
cd "/Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup"

# Instala psql si no lo tienes
# (skip si ya tienes)

# Ejecuta el schema en Supabase
psql -h db.xxxx.supabase.co -U postgres -d postgres -f scripts/init-db.sql
```

Ingresa la password cuando te pida.

---

## Paso 6: Reinicia Backend

```bash
cd backend && npm run dev
```

Verifica:
```bash
curl http://localhost:3001/api/health | jq .
```

Debe mostrar:
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

## ✅ Listo!

Ya tienes PostgreSQL en la nube, sin instalar nada localmente.

**Ventajas:**
- ✅ No requiere instalación
- ✅ Accesible desde cualquier parte
- ✅ Gratis (hasta 500MB almacenamiento)
- ✅ Mismo schema funciona igual
- ✅ Listo para deploy a producción

**Siguiente:** Integración Claude API + Deploy

---

## Troubleshooting

### Error: "could not translate host name"
- Verifica que copiaste el host correcto
- Debe ser: `db.xxxx.supabase.co` (no localhost)

### Error: "password authentication failed"
- Verifica que copiaste password correcto
- Recrea el proyecto si la olvidaste

### Error: "relation 'products' does not exist"
- El schema no se ejecutó
- Ejecuta: `psql -h db.xxxx.supabase.co -U postgres -d postgres -f scripts/init-db.sql`

---

## Si prefieres PostgreSQL Local

Si quieres PostgreSQL en tu Mac sin Supabase:

```bash
# Opción 1: Homebrew
brew install postgresql@15
brew services start postgresql@15

# Opción 2: PostgreSQL.app (GUI)
# https://postgresapp.com → Download → Initialize

# Opción 3: Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

Luego usa `localhost` en `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
```

