# 📦 Instalar PostgreSQL 15 en macOS

## Opción 1: Homebrew (RECOMENDADO - 5 min)

```bash
# 1. Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar PostgreSQL 15
brew install postgresql@15

# 3. Iniciar servicio
brew services start postgresql@15

# 4. Verificar instalación
psql --version
```

## Opción 2: PostgreSQL.app (GUI - 3 min)

1. Descargar: https://postgresapp.com/
2. Arrastra a Aplicaciones
3. Abre PostgreSQL.app
4. Haz clic en "Initialize"

## Opción 3: Docker (si tienes Docker Desktop)

```bash
docker run -d \
  --name postgres-carriup \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Verificar
docker ps | grep postgres-carriup
```

---

## Configurar Base de Datos

Una vez instalado PostgreSQL, ejecuta:

```bash
# 1. Crear database
createdb -U postgres carriup

# 2. Crear schema y seed
psql -U postgres -d carriup -f /ruta/a/scripts/init-db.sql

# 3. Verificar
psql -U postgres -d carriup -c "SELECT COUNT(*) FROM products;"
# Debería mostrar: 25
```

---

## Conectar Backend a PostgreSQL Real

Edita el archivo `.env` en la carpeta `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carriup
DB_USER=postgres
DB_PASSWORD=postgres
```

Luego reinicia el backend:

```bash
cd backend && npm run dev
```

---

## Verificar Conexión

```bash
# Debería mostrar status: "ok" y database: "connected"
curl http://localhost:3001/api/health | jq .
```

---

**Una vez hecho esto, avísame y continuamos con IA + Deploy.**
