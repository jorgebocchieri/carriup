# 🚀 Fastify + PostgreSQL Setup — Carriup v2

Guía completa para ejecutar Carriup con Fastify y PostgreSQL usando Docker.

## 📋 Requisitos

- **Docker Desktop** instalado (incluye Docker Compose)
- **Git** (opcional, para clonar el repo)
- Terminal/CLI

Verifica instalación:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Navega a la carpeta del proyecto

```bash
cd "/Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup"
```

### Paso 2: Inicia Docker Compose

```bash
docker-compose up -d
```

**Espera 30 segundos para que PostgreSQL esté listo.**

### Paso 3: Verifica que esté ejecutándose

```bash
curl http://localhost:3001/api/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "status": "ok",
  "message": "Carriup API v2 (Fastify + PostgreSQL) is running",
  "timestamp": "2026-05-17T20:40:00Z"
}
```

---

## 🔌 Usar las Páginas Conectadas

Una vez que el servidor esté ejecutándose (http://localhost:3001):

### Login Conectado
```
file:///Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup/login_connected.html
```

**Crea una nueva cuenta o usa:**
- Email: `test@example.com` (requiere crearse primero)

### Comparador Conectado
```
file:///Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup/price_comparison_connected.html
```

---

## 🔍 Verificar Estado de Contenedores

```bash
# Ver contenedores ejecutándose
docker ps

# Ver logs del API
docker logs carriup-api

# Ver logs de PostgreSQL
docker logs carriup-postgres
```

---

## 🛑 Detener Servicios

```bash
# Detener y remover contenedores
docker-compose down

# Detener sin eliminar datos
docker-compose stop

# Reiniciar
docker-compose restart
```

---

## 🔧 Comandos Útiles

### Acceder a PostgreSQL directamente

```bash
docker exec -it carriup-postgres psql -U postgres -d carriup
```

Dentro de PostgreSQL:
```sql
-- Ver tablas
\dt

-- Ver usuarios
SELECT * FROM users;

-- Ver precios
SELECT * FROM prices LIMIT 10;

-- Salir
\q
```

### Reiniciar con base de datos limpia

```bash
docker-compose down -v
docker-compose up -d
```

### Ver logs en tiempo real

```bash
docker logs -f carriup-api
```

---

## 📊 Estructura de Base de Datos

### Tabla: users
```sql
id (PK)          | SERIAL
name             | VARCHAR(255)
email            | VARCHAR(255) UNIQUE
password_hash    | VARCHAR(255)
created_at       | TIMESTAMP
updated_at       | TIMESTAMP
```

### Tabla: products
```sql
id (PK)          | SERIAL
product_id       | VARCHAR(100) UNIQUE
name             | VARCHAR(255)
category         | VARCHAR(100)
created_at       | TIMESTAMP
```

### Tabla: prices
```sql
id (PK)          | SERIAL
product_id (FK)  | VARCHAR(100)
supermarket      | VARCHAR(50)
price            | DECIMAL(10, 2)
brand            | VARCHAR(255)
date             | TIMESTAMP
```

### Tabla: searches
```sql
id (PK)          | SERIAL
user_id (FK)     | INTEGER
products         | TEXT[]
best_supermarket | VARCHAR(50)
savings          | DECIMAL(10, 2)
created_at       | TIMESTAMP
```

---

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGc..."
}
```

### Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "password": "mipassword123"
  }'
```

### Usar Token en requests

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:3001/api/prices/history?product=leche
```

---

## 🔌 Endpoints API

### Auth
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/signup` — Crear cuenta

### Prices
- `GET /api/prices/compare?products=leche,pan_integral` — Comparar precios
- `GET /api/prices/history?product=leche` — Historial de precios (requiere token)

### Products
- `GET /api/products/search?query=leche` — Buscar productos

### Health
- `GET /api/health` — Estado del servidor

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verifica que PostgreSQL esté ejecutándose
docker ps | grep carriup-postgres

# Reinicia PostgreSQL
docker-compose restart postgres
```

### Error: "Port 5432 already in use"
```bash
# Cambiar puerto en docker-compose.yml
# De: "5432:5432"
# A:  "5433:5432"
```

### Error: "Port 3001 already in use"
```bash
# Verifica qué proceso usa 3001
lsof -i :3001

# Mátalo
kill -9 <PID>
```

### Base de datos vacía
```bash
# Reinicializar con datos de ejemplo
docker-compose down -v
docker-compose up -d
```

---

## 📝 Variables de Entorno

Copia `.env.example` a `.env` y personaliza:

```bash
cp .env.example .env
```

**Contenido de .env:**
```
NODE_ENV=development
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=carriup
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu-secret-key-aqui
```

---

## 🚀 Deploy a Producción

### Con Railway (recomendado)

1. Crea cuenta en [railway.app](https://railway.app)
2. Conecta tu repo GitHub
3. Railway detectará `docker-compose.yml`
4. Configurar variables de entorno
5. Deploy automático

### Con Vercel + Render

1. Deploy API en Render (PostgreSQL incluido)
2. Deploy frontend en Vercel
3. Configurar CORS y variables de entorno

---

## 📚 Próximos Pasos

1. **Agregamos Web Scraping** (precios en vivo)
   ```bash
   npm install playwright
   ```

2. **Integramos Claude API** (IA para recomendaciones)
   ```bash
   npm install @anthropic-ai/sdk
   ```

3. **Agregamos Redis** (cache de precios)
   ```yaml
   # En docker-compose.yml
   redis:
     image: redis:7-alpine
   ```

4. **Testing completo**
   ```bash
   npm install --save-dev jest supertest
   ```

---

## ✅ Checklist

- [ ] Docker Desktop instalado
- [ ] docker-compose.yml presente
- [ ] Dockerfile presente
- [ ] package.json con dependencias Fastify
- [ ] server-fastify.js creado
- [ ] .env configurado
- [ ] `docker-compose up -d` ejecutado
- [ ] `/api/health` responde correctamente
- [ ] Login funciona
- [ ] Comparador funciona

---

**Estado:** ✅ Migración a Fastify + PostgreSQL completada
**Versión:** 2.0
**Fecha:** 17/05/2026
