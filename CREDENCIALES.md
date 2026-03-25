# 🔐 Credenciales de Acceso

## Usuarios Registrados en la Base de Datos

Hay 2 usuarios registrados:
1. `utreraabel91@gmail.com`
2. `utreraabel56@gmail.com`

## Credenciales Actuales

Según el script `backend/reset_password.js`, las credenciales configuradas son:

### Usuario 1:
- **Email:** `utreraabel91@gmail.com`
- **Contraseña:** `Password123!`

### Usuario 2:
- **Email:** `utreraabel56@gmail.com`
- **Contraseña:** (Desconocida - necesita reset)

## 🔄 Cómo Resetear la Contraseña

Si no puedes iniciar sesión con las credenciales anteriores, puedes resetear la contraseña:

### Opción 1: Usar el Script de Reset (Recomendado)

1. Abre el archivo `backend/reset_password.js`
2. Cambia el email si quieres resetear otro usuario:
   ```javascript
   const email = 'utreraabel91@gmail.com'; // Cambia esto
   const newPassword = 'Password123!';      // Cambia esto
   ```
3. Ejecuta el script:
   ```bash
   cd backend
   node reset_password.js
   ```
4. Verás un mensaje de confirmación con las nuevas credenciales

### Opción 2: Crear un Nuevo Usuario

Si prefieres crear un usuario nuevo:

1. Ve a la aplicación en el navegador
2. Haz clic en "Registrarse" o ve a `/register`
3. Llena el formulario:
   - **Nombre:** Tu nombre
   - **Email:** tu-email@ejemplo.com
   - **Contraseña:** Mínimo 8 caracteres
   - **Confirmar Contraseña:** Misma contraseña
   - **Instrumentos:** Selecciona al menos uno
4. Haz clic en "Registrarse"

## 🚀 Inicio de Sesión

1. Ve a la aplicación: `http://localhost:5173`
2. Si no estás en login, haz clic en "Iniciar Sesión"
3. Ingresa las credenciales:
   - **Email:** `utreraabel91@gmail.com`
   - **Contraseña:** `Password123!`
4. Haz clic en "Iniciar Sesión"

## 🔍 Verificar Usuarios Existentes

Para ver qué usuarios están registrados:

```bash
cd backend
node check_users.js
```

Esto mostrará una lista de todos los emails registrados.

## 🛠️ Resetear Contraseña para Cualquier Usuario

Puedes modificar el script `backend/reset_password.js` para resetear la contraseña de cualquier usuario:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'TU-EMAIL-AQUI@gmail.com';  // ← Cambia esto
  const newPassword = 'TuNuevaContraseña123!'; // ← Cambia esto
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log(`✅ Contraseña reseteada para ${email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Nueva Contraseña: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Luego ejecuta:
```bash
cd backend
node reset_password.js
```

## 📝 Requisitos de Contraseña

Las contraseñas deben cumplir con:
- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra mayúscula
- ✅ Al menos una letra minúscula
- ✅ Al menos un número
- ✅ Al menos un carácter especial (!, @, #, $, etc.)

Ejemplos válidos:
- `Password123!`
- `MiContra$2024`
- `Segura#Pass1`

## ⚠️ Notas de Seguridad

- **NO compartas estas credenciales** en repositorios públicos
- **Cambia las contraseñas** en producción
- **Usa contraseñas fuertes** diferentes para cada usuario
- El archivo `.env` ya está en `.gitignore` para proteger secretos

## 🔐 Cambiar Contraseña desde la Aplicación

Una vez que hayas iniciado sesión, puedes cambiar tu contraseña desde:

1. Ve a tu perfil (icono de usuario en el header)
2. Busca la opción "Cambiar Contraseña"
3. Ingresa tu contraseña actual
4. Ingresa la nueva contraseña
5. Confirma la nueva contraseña
6. Guarda los cambios

## 🆘 Problemas Comunes

### "Credenciales inválidas"
- Verifica que el email esté escrito correctamente
- Verifica que la contraseña sea exactamente `Password123!` (con mayúscula y signo de exclamación)
- Intenta resetear la contraseña con el script

### "Usuario no encontrado"
- Verifica que el usuario exista ejecutando `node check_users.js`
- Si no existe, regístrate como nuevo usuario

### "Tu sesión ha expirado"
- Simplemente vuelve a iniciar sesión
- Los tokens duran 24 horas por defecto

## 📞 Resumen Rápido

**Para iniciar sesión ahora mismo:**

```
Email: utreraabel91@gmail.com
Contraseña: Password123!
```

Si no funciona, ejecuta:
```bash
cd backend
node reset_password.js
```

Y luego intenta nuevamente con las credenciales que muestra el script.
