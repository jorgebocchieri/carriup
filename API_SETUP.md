# 🚀 API Setup — Carriup Backend

Guía para ejecutar la API Node.js y conectarla con el login y comparador de precios.

## 📋 Requisitos

- **Node.js 14+** instalado
- Carpeta `/Testeo Aplicación Carriup/` con los archivos

## 🔧 Instalación

### Paso 1: Verificar Node.js

```bash
node --version  # Debe ser v14 o superior
```

### Paso 2: Ejecutar el Servidor

```bash
cd "/Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup"
node server.js
```

**Salida esperada:**
```
╔════════════════════════════════════════════════════╗
║                                                    ║
║  ✅ Carriup API Server is running                  ║
║                                                    ║
║  Port: 3001                                        ║
║  URL: http://localhost:3001                        ║
║                                                    ║
║  Endpoints:                                        ║
║  POST   /api/auth/login                            ║
║  POST   /api/auth/signup                           ║
║  GET    /api/prices/compare?products=leche,...    ║
║  GET    /api/products/search?query=leche          ║
║  GET    /api/health                                ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Paso 3: Probar la API

En otra terminal:

```bash
# Test health check
curl http://localhost:3001/api/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'

# Test comparación de precios
curl "http://localhost:3001/api/prices/compare?products=leche,pan_integral"
```

---

## 🌐 Usar las Páginas Conectadas

Una vez que el servidor esté ejecutándose:

### 1. Login Conectado

Abre en navegador:
```
file:///Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup/login_connected.html
```

**Credenciales de prueba:**
- Email: `test@example.com`
- Contraseña: `test123456`

O crea una nueva cuenta.

### 2. Comparador Conectado

Abre en navegador:
```
file:///Users/jorgebocchieri/Documents/Mis Proyectos/Testeo Aplicación Carriup/price_comparison_connected.html
```

Ingresa productos como:
- leche
- pan integral
- huevos

---

## 📊 Base de Datos

### Ubicación
```
/Testeo Aplicación Carriup/database.json
```

### Estructura
```json
{
  "users": [
    { "id": "1", "email": "test@example.com", "password": "test123456", "name": "Test User" }
  ],
  "products": [...],
  "prices": {...},
  "searches": [...]
}
```

### Modificar Datos

Puedes editar `database.json` directamente para cambiar precios, agregar usuarios, etc.

---

## 🔌 Endpoints API

### 1. Login
```
POST /api/auth/login

Body:
{
  "email": "test@example.com",
  "password": "test123456"
}

Response:
{
  "success": true,
  "user": { "id": "1", "email": "test@example.com", "name": "Test User" },
  "token": "MXsxNjI0OTQ5ODc0Njc0"
}
```

### 2. Signup
```
POST /api/auth/signup

Body:
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "password": "mipassword123"
}

Response:
{
  "success": true,
  "user": { "id": "user_1624949874674", "email": "juan@example.com", "name": "Juan Pérez" },
  "message": "Usuario registrado exitosamente"
}
```

### 3. Comparar Precios
```
GET /api/prices/compare?products=leche,pan_integral,huevos

Response:
{
  "success": true,
  "products": ["leche", "pan_integral", "huevos"],
  "productsFound": 3,
  "results": [
    {
      "supermarket": "lider",
      "items": [
        { "name": "leche", "price": 1290, "brand": "Colun" },
        ...
      ],
      "total": 7770
    },
    ...
  ],
  "bestSupermarket": "santa-isabel",
  "minTotal": 6230,
  "maxTotal": 8330,
  "savings": 2100
}
```

### 4. Buscar Productos
```
GET /api/products/search?query=leche

Response:
{
  "success": true,
  "products": [
    { "id": "leche", "name": "Leche", "category": "Lácteos" }
  ]
}
```

### 5. Health Check
```
GET /api/health

Response:
{
  "success": true,
  "status": "ok",
  "message": "Carriup API is running",
  "timestamp": "2026-05-17T20:35:00Z"
}
```

---

## 🔒 Tokens y Autenticación

Los tokens generados son **JWT simulados** (Base64):

```javascript
token = Buffer.from(`${userId}:${timestamp}`).toString('base64')
// Ejemplo: "MXsxNjI0OTQ5ODc0Njc0"
```

En producción, usa **JWT real** o **Clerk/NextAuth**.

---

## 🐛 Troubleshooting

### Error: "EADDRINUSE: address already in use :::3001"

El puerto 3001 ya está en uso. Solución:

```bash
# Matar el proceso
lsof -i :3001
kill -9 <PID>

# O ejecutar en otro puerto (editar server.js, línea: const PORT = 3001)
```

### Error: "Cannot GET /api/health"

El servidor no está ejecutándose. Ejecuta:

```bash
node server.js
```

### Los datos no se guardan

Verifica que `database.json` existe y tiene permisos de escritura:

```bash
ls -la database.json
chmod 644 database.json
```

---

## 📁 Archivos

| Archivo | Descripción |
|---------|-----------|
| **server.js** | API backend (Node.js) |
| **database.json** | Base de datos (JSON) |
| **login_connected.html** | Login conectado con API |
| **price_comparison_connected.html** | Comparador conectado con API |

---

## 🚀 Próximos Pasos

1. **Migrar a Fastify** (más rápido)
   ```
   pnpm add fastify
   ```

2. **Usar PostgreSQL** (base de datos real)
   ```
   docker run -d -e POSTGRES_PASSWORD=password postgres
   ```

3. **Agregar autenticación JWT real**
   ```
   pnpm add jsonwebtoken
   ```

4. **Integrar Web Scraping** (precios en vivo)
   ```
   pnpm add playwright
   ```

5. **Deploy a producción**
   - Vercel para frontend
   - Railway para backend

---

**Estado:** ✅ Completado
**Versión:** 1.0
**Fecha:** 17/05/2026
