# Solución al Error "Error al cargar el PDF"

## ✅ PROBLEMA IDENTIFICADO

El error ocurre porque el backend estaba devolviendo URLs relativas (`/uploads/...`) en lugar de URLs completas (`http://127.0.0.1:3001/uploads/...`), lo que impedía que el componente PDFViewer cargara los archivos correctamente.

## 🔧 Soluciones Aplicadas

### 1. URLs Completas en Storage Service

He actualizado `backend/src/services/storage.service.ts` para que genere URLs completas:

**ANTES:**
```typescript
const url = `/uploads/${key}`;  // ❌ URL relativa
```

**AHORA:**
```typescript
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3001';
const url = `${baseUrl}/uploads/${key}`;  // ✅ URL completa
```

### 2. Headers CORS para PDFs

He actualizado `backend/src/index.ts` para agregar headers CORS específicos para archivos PDF:

```typescript
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('uploads'));
```

## 📋 Cómo Aplicar la Solución

### Paso 1: Reiniciar el Backend

Los cambios ya están guardados, pero necesitas reiniciar el backend:

1. En la terminal donde está corriendo el backend, presiona `Ctrl + C`
2. Ejecuta nuevamente:
   ```bash
   cd backend
   npm run dev
   ```
3. Deberías ver: `🚀 Server running on port 3001`

### Paso 2: Actualizar Libros Existentes (Importante)

Los libros que ya tenías creados tienen URLs relativas en la base de datos. Tienes dos opciones:

**Opción A: Eliminar y volver a subir los libros (Recomendado)**
1. Ve a la sección "Libros"
2. Elimina los libros existentes
3. Vuelve a subirlos
4. Ahora tendrán URLs completas y funcionarán correctamente

**Opción B: Actualizar manualmente la base de datos**
```bash
cd backend
npx prisma studio
```
1. Abre la tabla `Book`
2. Para cada libro, actualiza el campo `fileUrl`:
   - De: `/uploads/users/...`
   - A: `http://127.0.0.1:3001/uploads/users/...`

### Paso 3: Refrescar el Frontend

1. Refresca el navegador con `Ctrl + Shift + R`
2. Ve a la sección "Libros"
3. Haz clic en el icono de "Ver" (👁️) en cualquier libro
4. El PDF debería cargar correctamente

## 🔍 Verificación

Para confirmar que el problema está resuelto:

### 1. Verificar que el Backend Sirve Archivos

Abre tu navegador y ve a:
```
http://127.0.0.1:3001/uploads/users/[tu-user-id]/books/[archivo].pdf
```

Deberías ver el PDF directamente en el navegador.

### 2. Verificar URLs en la Base de Datos

```bash
cd backend
npx prisma studio
```

1. Abre la tabla `Book`
2. Verifica que el campo `fileUrl` tenga URLs completas como:
   ```
   http://127.0.0.1:3001/uploads/users/40b4d03a-f546-41f0-a53c-0a78ddd04330/books/1773632185609-4-way-coordination-marvin-dahlgren.pdf
   ```

### 3. Probar el Visualizador

1. Ve a "Libros"
2. Haz clic en el icono de ojo (👁️) para ver un libro
3. El PDF debería cargar sin errores
4. Deberías poder:
   - Navegar entre páginas
   - Hacer zoom in/out
   - Ver el indicador "Offline" cuando se cachea

## 🆕 Para Nuevos Libros

Los nuevos libros que subas después de reiniciar el backend tendrán automáticamente URLs completas y funcionarán correctamente.

## 🌐 Configuración Opcional

Si quieres cambiar la URL base del backend, edita `backend/.env`:

```env
# Agregar esta línea (opcional)
BASE_URL=http://127.0.0.1:3001

# O para producción
BASE_URL=https://tu-dominio.com
```

Si no se especifica, usa `http://127.0.0.1:3001` por defecto.

## ❓ Si el Problema Persiste

### Error: "Failed to load PDF"

**Causa:** El archivo no existe en el servidor

**Solución:**
1. Verifica que la carpeta `backend/uploads` exista
2. Verifica que el archivo esté en la ruta correcta
3. Vuelve a subir el libro

### Error: "CORS policy"

**Causa:** Los headers CORS no se aplicaron correctamente

**Solución:**
1. Verifica que reiniciaste el backend
2. Limpia la caché del navegador (`Ctrl + Shift + Delete`)
3. Refresca la página

### Error: "Network Error"

**Causa:** El backend no está corriendo

**Solución:**
```bash
cd backend
npm run dev
```

### El PDF se ve pero no se puede navegar

**Causa:** Problema con el worker de PDF.js

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores relacionados con "pdf.worker"
3. Refresca la página con `Ctrl + Shift + R`

## 📊 Resumen de Cambios

| Archivo | Cambio | Propósito |
|---------|--------|-----------|
| `backend/src/services/storage.service.ts` | URLs completas | Generar URLs accesibles desde el frontend |
| `backend/src/index.ts` | Headers CORS | Permitir carga de PDFs desde el frontend |

## ✅ Checklist de Verificación

- [ ] Backend reiniciado
- [ ] Libros antiguos eliminados o URLs actualizadas
- [ ] Frontend refrescado
- [ ] PDF se carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Zoom funciona
- [ ] Indicador "Offline" aparece después de cargar

## 🎯 Próximos Pasos

1. **Reinicia el backend** (`Ctrl+C` y luego `npm run dev`)
2. **Elimina y vuelve a subir tus libros** (o actualiza las URLs en la BD)
3. **Refresca el navegador** (`Ctrl + Shift + R`)
4. **Prueba el visualizador de PDF**

Si después de seguir estos pasos el problema persiste, comparte:
- ✅ El mensaje de error exacto en la consola (F12 → Console)
- ✅ La URL del PDF que aparece en Network tab
- ✅ Confirmación de que reiniciaste el backend
