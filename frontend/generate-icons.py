#!/usr/bin/env python3
"""
Script para generar iconos PNG para PWA
Requiere: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Tamaños de iconos requeridos
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

# Colores del tema
COLOR_START = (94, 53, 177)  # #5E35B1 - Deep purple
COLOR_END = (30, 136, 229)    # #1E88E5 - Blue

def create_gradient(size):
    """Crea un gradiente de color"""
    image = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(image)
    
    for y in range(size):
        # Interpolar entre los dos colores
        ratio = y / size
        r = int(COLOR_START[0] * (1 - ratio) + COLOR_END[0] * ratio)
        g = int(COLOR_START[1] * (1 - ratio) + COLOR_END[1] * ratio)
        b = int(COLOR_START[2] * (1 - ratio) + COLOR_END[2] * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    return image

def add_music_note(image, size):
    """Agrega una nota musical al icono"""
    draw = ImageDraw.Draw(image)
    
    # Intentar usar una fuente del sistema
    try:
        font_size = int(size * 0.6)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Si no encuentra la fuente, usar la predeterminada
        font = ImageFont.load_default()
    
    # Dibujar nota musical
    text = "♪"
    
    # Obtener el tamaño del texto
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Centrar el texto
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill='white', font=font)
    
    return image

def generate_icons():
    """Genera todos los iconos necesarios"""
    # Crear directorio si no existe
    icons_dir = os.path.join('public', 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    print("🎵 Generando iconos PWA...")
    print()
    
    for size in SIZES:
        # Crear imagen con gradiente
        image = create_gradient(size)
        
        # Agregar nota musical
        image = add_music_note(image, size)
        
        # Guardar
        filename = os.path.join(icons_dir, f'icon-{size}x{size}.png')
        image.save(filename, 'PNG')
        print(f"✓ Creado: icon-{size}x{size}.png")
    
    print()
    print("✅ Todos los iconos PNG han sido generados exitosamente!")
    print(f"📁 Ubicación: {os.path.abspath(icons_dir)}")

if __name__ == '__main__':
    try:
        generate_icons()
    except ImportError:
        print("❌ Error: Pillow no está instalado")
        print("📦 Instala con: pip install Pillow")
        print()
        print("O usa una de las otras opciones en GENERATE_ICONS.md")
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
        print("Usa una de las otras opciones en GENERATE_ICONS.md")
