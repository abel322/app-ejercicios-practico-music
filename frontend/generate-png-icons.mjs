/**
 * Script para generar iconos PNG desde SVG usando sharp
 * Ejecutar: node generate-png-icons.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verificar si sharp está instalado
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (error) {
  console.error('❌ Error: sharp no está instalado');
  console.log('\n📦 Instalando sharp...\n');
  try {
    execSync('npm install sharp', { stdio: 'inherit', cwd: __dirname });
    sharp = (await import('sharp')).default;
    console.log('\n✅ sharp instalado correctamente\n');
  } catch (installError) {
    console.error('❌ No se pudo instalar sharp automáticamente');
    console.log('\n💡 Por favor ejecuta manualmente: npm install sharp\n');
    process.exit(1);
  }
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, 'public', 'icons');

async function generateIcons() {
  console.log('🎨 Generando iconos PNG...\n');

  // Verificar que el archivo SVG existe
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: No se encontró el archivo ${inputFile}`);
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Generado: icon-${size}x${size}.png`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error generando icon-${size}x${size}.png:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Resultado:`);
  console.log(`   ✅ Exitosos: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);

  if (successCount === sizes.length) {
    console.log('\n🎉 ¡Todos los iconos PNG generados correctamente!');
    console.log('\n📍 Ubicación: frontend/public/icons/');
    console.log('\n✨ La PWA ahora es instalable');
  } else {
    console.log('\n⚠️ Algunos iconos no se pudieron generar');
  }
}

generateIcons().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
