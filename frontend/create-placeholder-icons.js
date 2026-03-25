// Script para crear iconos placeholder básicos
// Ejecutar con: node create-placeholder-icons.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

// Asegurar que el directorio existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('⚠️  Este script crea iconos placeholder básicos.');
console.log('📝 Para iconos de producción, usa una de estas opciones:');
console.log('   1. https://www.pwabuilder.com/imageGenerator');
console.log('   2. Abre generate-icons.html en un navegador');
console.log('   3. Usa ImageMagick: convert icon.svg -resize 512x512 icon-512x512.png');
console.log('');

// Crear un SVG simple para cada tamaño
sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5E35B1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E88E5;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.125}"/>
  <text x="${size / 2}" y="${size * 0.66}" font-family="Arial, sans-serif" font-size="${size * 0.625}" font-weight="bold" fill="white" text-anchor="middle">♪</text>
</svg>`;

  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`✓ Creado: icon-${size}x${size}.svg`);
});

console.log('');
console.log('✅ Iconos SVG creados en public/icons/');
console.log('');
console.log('⚠️  IMPORTANTE: Los navegadores requieren iconos PNG para PWA.');
console.log('   Convierte los SVG a PNG usando una de las opciones mencionadas arriba.');
console.log('');
console.log('💡 Comando rápido con ImageMagick (si está instalado):');
console.log('   cd public/icons && for size in 72 96 128 144 152 192 384 512; do convert icon-${size}x${size}.svg icon-${size}x${size}.png; done');
