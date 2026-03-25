# Iconos PWA

Esta carpeta debe contener los iconos de la PWA en formato PNG.

## Tamaños requeridos

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Cómo generar los iconos

### Opción 1: Usar herramientas online (Recomendado)

1. Ve a [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
2. Sube el archivo `icon.svg` de esta carpeta
3. Descarga todos los tamaños generados
4. Coloca los archivos en esta carpeta con los nombres correctos

### Opción 2: Usar el generador HTML incluido

1. Abre `frontend/generate-icons.html` en un navegador
2. Los iconos se descargarán automáticamente
3. Mueve los archivos descargados a esta carpeta

### Opción 3: Usar ImageMagick (línea de comandos)

Si tienes ImageMagick instalado:

```bash
cd frontend/public/icons
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Opción 4: Crear iconos personalizados

Puedes crear tus propios iconos usando cualquier herramienta de diseño (Figma, Photoshop, GIMP, etc.) y exportarlos en los tamaños requeridos.

**Requisitos:**
- Formato: PNG
- Dimensiones: Cuadradas (ancho = alto)
- Fondo: Preferiblemente con el color del tema (#5E35B1) o transparente
- Contenido: Icono centrado y visible en todos los tamaños

## Nota

Los iconos son esenciales para que la PWA sea instalable. Sin ellos, los navegadores no permitirán la instalación de la aplicación.
