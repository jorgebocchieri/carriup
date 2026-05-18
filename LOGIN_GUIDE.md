# 🔐 Guía de Login para Carriup

Documentación completa de la página de autenticación (login/signup) para Carriup.

## 📁 Archivos Creados

### 1. **login.html** — Versión Standalone ✅
- Archivo HTML completo y autoexecutable
- **No requiere dependencias** ni servidor
- Ideal para pruebas rápidas en cualquier navegador

**Características:**
- ✅ Pestañas de Login/Signup
- ✅ Validación de formularios (cliente)
- ✅ UI responsive (mobile-first)
- ✅ Diseño moderno con gradientes
- ✅ Animaciones suaves

**Uso:**
```bash
# Abre directamente en el navegador
open login.html

# O sirve localmente
python3 -m http.server 8000
# http://localhost:8000/login.html
```

### 2. **LoginPage.tsx** — Componente React/Next.js
Componente React 18 con TypeScript, integrado con Tailwind CSS.

**Ubicación en proyecto:**
```
apps/web/app/(auth)/login/page.tsx
```

### 3. **validation.ts** — Funciones de Validación
Utilidades reutilizables para validar email, contraseñas, nombres, etc.

---

## 🎨 Diseño

**Colores:**
- Primario: `#FF6600` (naranja)
- Fondo: Gradiente púrpura
- Error: `#e74c3c` (rojo)
- Éxito: `#27ae60` (verde)

**Layout:**
- Header con logo y branding (Carriup)
- Tabs: Inicia Sesión / Registrarse
- Formularios con validación en tiempo real
- Botones responsivos

---

## 🔄 Flujo de Autenticación

```
Usuario → Email + Password → Validación → API Call → Éxito/Error
```

---

## 🔧 Integración Backend

### Endpoints Requeridos

#### `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "user": { "id": "user_123", "email": "user@example.com" },
  "token": "jwt_token_here"
}
```

#### `POST /api/auth/signup`
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🔐 Seguridad

✅ Validación cliente-side
✅ Sanitización de entrada
✅ Prevención XSS básica
✅ TODO: Validación server-side

---

## 📚 Próximos Pasos

1. Probar login.html en navegador
2. Crear endpoints backend
3. Integrar en Next.js
4. Conectar con API real
5. Agregar OAuth (Clerk/NextAuth)
6. Testing (unit + E2E)
7. Deploy a producción

---

**Creado:** 17/05/2026
**Versión:** 1.0
