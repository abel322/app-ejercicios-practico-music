# Instrucciones para Ver los Cambios

## 🔄 Pasos para Forzar la Recarga

### 1. Detener el Servidor de Desarrollo
```bash
# En la terminal donde está corriendo el frontend
# Presiona Ctrl+C para detener
```

### 2. Limpiar Caché de Vite
```bash
cd frontend
rm -rf node_modules/.vite
rm -rf dist
rm -rf dev-dist
```

### 3. Reiniciar el Servidor
```bash
npm run dev
```

### 4. Limpiar Caché del Navegador
- **Chrome/Edge:** Presiona `Ctrl+Shift+Delete`, selecciona "Caché" y "Eliminar"
- **Firefox:** Presiona `Ctrl+Shift+Delete`, selecciona "Caché" y "Limpiar ahora"
- O simplemente presiona `Ctrl+Shift+R` varias veces

### 5. Abrir en Modo Incógnito
- Abre una ventana de incógnito/privada
- Navega a `http://localhost:5173`
- Esto asegura que no haya caché

## 🔍 Verificar los Cambios

Los cambios que deberías ver:

1. **Header más pequeño**: "Sesión de Práctica" en texto más pequeño
2. **Card de información compacta**: Chips más pequeños (20px de altura)
3. **Temporizador más pequeño**: Tiempo en h6 en lugar de h5
4. **PDF sin scroll interno**: Debería ocupar exactamente el espacio disponible
5. **Metrónomo más compacto**: Ancho de 340px, elementos más pequeños

## 🐛 Si Aún No Ves los Cambios

### Opción 1: Verificar que los archivos se guardaron
```bash
# Verifica la fecha de modificación
ls -la frontend/src/pages/PracticeSession.tsx
ls -la frontend/src/components/Metronome.tsx
ls -la frontend/src/components/PDFViewer.tsx
```

### Opción 2: Verificar errores en la consola
1. Abre las DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Compártelos si los hay

### Opción 3: Verificar que el servidor está corriendo
```bash
# Deberías ver algo como:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Opción 4: Forzar reconstrucción completa
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## 📸 Cómo Debería Verse

### Antes (con scroll):
```
┌─────────────────────────────────────┐
│ Header grande (h5)                  │ ← 60px
├─────────────────────────────────────┤
│ Info grande (p: 2)                  │ ← 80px
│ Timer grande (h4)                   │
├─────────────────────────────────────┤
│                                     │
│ PDF (altura fija 600px)             │ ← Requiere scroll
│                                     │
├─────────────────────────────────────┤
│ Metrónomo grande                    │
└─────────────────────────────────────┘
Total: > 1080px (requiere scroll)
```

### Ahora (sin scroll):
```
┌─────────────────────────────────────┐
│ Header compacto (subtitle1)         │ ← 35px
├─────────────────────────────────────┤
│ Info compacta (p: 1)                │ ← 60px
│ Timer compacto (h6)                 │
├─────────────────────────────────────┤
│                                     │
│ PDF (calc(100vh - 140px))           │ ← ~885px
│ Ocupa espacio exacto                │
│                                     │
├─────────────────────────────────────┤
│ Metrónomo compacto (340px)          │
└─────────────────────────────────────┘
Total: 100vh (sin scroll)
```

## 🎯 Cambios Clave Aplicados

### PracticeSession.tsx
- Header: `py: 0.5`, `variant="subtitle1"`
- Gaps: `1` (8px)
- Padding: `p: 1` (8px)
- Chips: `height: 20`, `fontSize: 0.7rem`
- Timer: `variant="h6"`
- PDF: `height: calc(100vh - 140px)` ← **CLAVE**
- Metrónomo: `width: 340px`

### Metronome.tsx
- Padding: `p: 1`
- Título: `body2`
- Display: `h4`
- Beats: `24px`
- Botones: `44px`

### PDFViewer.tsx
- Toolbar: `minHeight: 40`
- Padding: `p: 0.5`

## ⚡ Atajo Rápido

Si tienes prisa, ejecuta esto:

```bash
# En PowerShell (Windows)
cd frontend
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm run dev
```

Luego en el navegador:
1. Presiona `Ctrl+Shift+R` 3 veces
2. O abre modo incógnito

## 📞 Si Nada Funciona

Comparte:
1. Captura de pantalla de la página actual
2. Consola del navegador (F12 → Console)
3. Terminal donde corre `npm run dev`
4. Resultado de: `ls -la frontend/src/pages/PracticeSession.tsx`
