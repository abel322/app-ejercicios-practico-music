# 🔄 Instrucciones para Reiniciar el Backend

## ⚠️ Problema Actual

Estás viendo el mensaje "Error del servidor. Por favor, intenta más tarde." porque:
1. El backend no se ha reiniciado con los cambios
2. O hay un error en el servidor que necesita ser diagnosticado

## 📋 Pasos para Reiniciar el Backend

### Paso 1: Detener el Backend Actual

1. Ve a la terminal donde está corriendo el backend
2. Presiona `Ctrl + C` para detenerlo
3. Espera a que se detenga completamente

### Paso 2: Iniciar el Backend Nuevamente

```bash
cd backend
npm run dev
```

### Paso 3: Verificar que Inició Correctamente

Deberías ver algo como:
```
🚀 Server running on port 3001
📝 Environment: development
```

Si ves errores, cópialos y compártelos.

### Paso 4: Refrescar el Frontend

1. Ve a tu navegador
2. Presiona `Ctrl + Shift + R` (hard refresh)
3. Intenta eliminar el libro nuevamente

## 🔍 Si Ves Errores al Iniciar el Backend

### Error: "Cannot find module"

**Solución:**
```bash
cd backend
npm install
npm run dev
```

### Error: "Port 3001 is already in use"

**Solución:**
```bash
# En Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Luego reinicia
npm run dev
```

### Error: "Prisma Client not generated"

**Solución:**
```bash
cd backend
npx prisma generate
npm run dev
```

### Error: "Database connection failed"

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `backend/.env`
3. Intenta conectarte manualmente:
   ```bash
   npx prisma studio
   ```

## 📊 Verificar que el Backend Funciona

### Opción 1: Desde el Navegador

Abre en tu navegador:
```
http://127.0.0.1:3001/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"2026-03-18T..."}
```

### Opción 2: Desde PowerShell

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:3001/health -UseBasicParsing
```

Deberías ver:
```
StatusCode: 200
Content: {"status":"ok",...}
```

## 🐛 Ver Logs del Backend

Si el backend está corriendo pero sigue dando error:

1. Mira la terminal donde está corriendo el backend
2. Busca mensajes de error en rojo
3. Copia el error completo
4. Compártelo para ayudarte mejor

Los logs mostrarán algo como:
```
=== Error occurred ===
Timestamp: 2026-03-18T...
Error name: Error
Error message: [mensaje del error]
Stack trace: [detalles técnicos]
=====================
```

## 🔄 Proceso Completo de Reinicio

```bash
# 1. Detener el backend (Ctrl+C en la terminal)

# 2. Navegar a la carpeta backend
cd backend

# 3. (Opcional) Reinstalar dependencias si hay problemas
npm install

# 4. (Opcional) Regenerar Prisma Client si hay problemas
npx prisma generate

# 5. Iniciar el backend
npm run dev

# 6. Esperar a ver el mensaje de éxito
# 🚀 Server running on port 3001

# 7. En el navegador, refrescar con Ctrl+Shift+R

# 8. Intentar eliminar el libro nuevamente
```

## ✅ Después de Reiniciar

Una vez que el backend esté corriendo correctamente:

1. **Refresca el navegador** (`Ctrl + Shift + R`)
2. **Intenta eliminar el libro** "stick cpntrol"
3. **Deberías ver un mensaje claro** como:
   ```
   "No se puede eliminar el libro porque tiene 2 ejercicio(s) asociado(s) 
   a sesiones de práctica: rudimiento, ejercicios. Los registros históricos 
   deben mantenerse."
   ```

## 🎯 Si el Mensaje Sigue Siendo Genérico

Si después de reiniciar sigues viendo "Error del servidor":

1. **Copia los logs del backend** (lo que aparece en la terminal)
2. **Abre la consola del navegador** (F12 → Console)
3. **Busca errores en rojo**
4. **Comparte ambos** para diagnosticar el problema

## 📞 Checklist de Verificación

- [ ] Backend detenido con Ctrl+C
- [ ] Backend reiniciado con `npm run dev`
- [ ] Mensaje "🚀 Server running on port 3001" visible
- [ ] Health check funciona (http://127.0.0.1:3001/health)
- [ ] Frontend refrescado con Ctrl+Shift+R
- [ ] Intentado eliminar el libro nuevamente

## 💡 Tip

Si trabajas frecuentemente con el backend, considera usar `nodemon` o mantener la terminal del backend siempre visible para ver los logs en tiempo real.

## 🆘 Si Nada Funciona

Como último recurso:

```bash
# 1. Detener todo
Ctrl+C en todas las terminales

# 2. Limpiar y reinstalar
cd backend
rm -rf node_modules
npm install
npx prisma generate

# 3. Reiniciar
npm run dev

# 4. En otra terminal, reiniciar frontend
cd frontend
npm run dev
```

---

**Siguiente paso:** Reinicia el backend siguiendo estos pasos y comparte cualquier error que veas.
