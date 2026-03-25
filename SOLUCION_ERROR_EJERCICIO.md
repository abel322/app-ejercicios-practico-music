# Solución al Error "No tienes permiso para realizar esta acción"

## ✅ PROBLEMA IDENTIFICADO

El error "No tienes permiso para realizar esta acción" significa que tu **token de autenticación (JWT) ha expirado o es inválido**.

## 🔧 Solución Aplicada

He mejorado el código para que:
1. Detecte automáticamente cuando el token expira
2. Limpie la sesión automáticamente
3. Te redirija al login con un mensaje claro
4. Muestre el mensaje real del servidor

## 📋 Cómo Solucionar el Problema AHORA

### Opción 1: Cerrar Sesión y Volver a Entrar (Recomendado)

1. **Cierra sesión:**
   - Haz clic en tu nombre de usuario o el botón de logout en el header
   - O ve directamente a la página de login

2. **Vuelve a iniciar sesión:**
   - Ingresa tu email y contraseña
   - Haz clic en "Iniciar Sesión"

3. **Intenta crear el ejercicio nuevamente:**
   - Ve a la sección "Ejercicios"
   - Haz clic en "Nuevo Ejercicio"
   - Llena el formulario y guarda

### Opción 2: Refrescar la Página (Más Rápido)

1. **Refresca el navegador:**
   - Presiona `Ctrl + Shift + R` (Windows/Linux)
   - O `Cmd + Shift + R` (Mac)

2. **Si te redirige al login:**
   - Inicia sesión nuevamente
   - Vuelve a intentar crear el ejercicio

3. **Si NO te redirige al login:**
   - Cierra sesión manualmente
   - Vuelve a iniciar sesión

## 🔍 Por Qué Sucede Esto

### Causa Principal: Token JWT Expirado

Los tokens JWT tienen un tiempo de vida limitado por seguridad. En tu configuración:
- **Duración del token:** 24 horas (configurado en `backend/.env`)
- **Después de 24 horas:** El token expira automáticamente
- **Resultado:** Necesitas volver a iniciar sesión

### Otras Causas Posibles:

1. **Token corrupto en localStorage:**
   - Puede pasar si hubo un error al guardar
   - Solución: Cerrar sesión y volver a entrar

2. **Backend reiniciado con diferente JWT_SECRET:**
   - Si cambió la clave secreta, los tokens antiguos son inválidos
   - Solución: Cerrar sesión y volver a entrar

3. **Múltiples pestañas/dispositivos:**
   - Si cerraste sesión en otra pestaña
   - Solución: Refrescar la página actual

## 🛠️ Mejora Aplicada al Código

He actualizado `frontend/src/services/authService.ts` para que:

**ANTES:**
- Error 403 → "No tienes permisos para realizar esta acción" (confuso)

**AHORA:**
- Error 403 con token → "Tu sesión ha expirado. Por favor, inicia sesión nuevamente" (claro)
- Limpia automáticamente el token inválido
- Te redirige al login automáticamente

## 📝 Verificación

Para confirmar que el problema está resuelto:

1. **Refresca el navegador** con `Ctrl + Shift + R`

2. **Cierra sesión** (si aún estás logueado)

3. **Vuelve a iniciar sesión**

4. **Intenta crear un ejercicio:**
   - Nombre: "Ejercicio de prueba"
   - Libro: Selecciona uno de la lista
   - Páginas: "1-5"
   - Dificultad: Básico
   - Haz clic en "Crear"

5. **Deberías ver:** "Ejercicio creado exitosamente" ✅

## 🔐 Configuración del Token (Opcional)

Si quieres cambiar la duración del token, edita `backend/.env`:

```env
# Duración actual: 24 horas
JWT_EXPIRES_IN="24h"

# Opciones:
# JWT_EXPIRES_IN="1h"   # 1 hora
# JWT_EXPIRES_IN="7d"   # 7 días
# JWT_EXPIRES_IN="30d"  # 30 días
```

**Nota:** Después de cambiar esto, reinicia el backend:
```bash
cd backend
# Ctrl+C para detener
npm run dev
```

## ❓ Si el Problema Persiste

### Paso 1: Limpiar Completamente el localStorage

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Application" (Chrome) o "Storage" (Firefox)
3. En el menú izquierdo, busca "Local Storage"
4. Haz clic en tu dominio (http://localhost:5173)
5. Elimina las claves `token` y `user`
6. Refresca la página

### Paso 2: Verificar que el Backend Está Corriendo

```bash
# En PowerShell
Invoke-WebRequest -Uri http://127.0.0.1:3001/health -UseBasicParsing
```

Deberías ver:
```
StatusCode: 200
Content: {"status":"ok","timestamp":"..."}
```

### Paso 3: Verificar el JWT_SECRET

Abre `backend/.env` y verifica que tenga:
```env
JWT_SECRET="dev-secret-key-change-in-production"
```

Si lo cambiaste recientemente, todos los tokens antiguos son inválidos.

## 📊 Resumen de la Solución

| Problema | Causa | Solución |
|----------|-------|----------|
| "No tienes permiso..." | Token JWT expirado | Cerrar sesión y volver a entrar |
| Error 403 | Token inválido | Limpiar localStorage y login |
| Sesión expira rápido | JWT_EXPIRES_IN muy corto | Aumentar duración en .env |

## ✅ Próximos Pasos

1. **Refresca el navegador** (`Ctrl + Shift + R`)
2. **Cierra sesión** si estás logueado
3. **Vuelve a iniciar sesión**
4. **Intenta crear un ejercicio**

Si después de seguir estos pasos el problema persiste, comparte:
- ✅ El mensaje exacto que aparece en la consola (F12 → Console)
- ✅ Confirmación de que cerraste sesión y volviste a entrar
- ✅ El contenido de `backend/.env` (sin mostrar contraseñas)

