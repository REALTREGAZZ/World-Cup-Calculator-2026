#!/bin/bash

# Script para generar iconos de la PWA
# Requiere ImageMagick instalado: sudo apt install imagemagick

echo "🎨 Generador de Iconos para Mundial 2026 PWA"
echo "============================================="
echo ""

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado."
    echo ""
    echo "Opciones:"
    echo "1. Instalar ImageMagick: sudo apt install imagemagick"
    echo "2. Crear iconos manualmente en: https://favicon.io/"
    echo "3. Usar cualquier editor de imágenes para crear:"
    echo "   - icon-192.png (192x192 px)"
    echo "   - icon-512.png (512x512 px)"
    echo ""
    echo "Diseño sugerido:"
    echo "- Fondo: Degradado azul (#1a1a2e a #0f3460)"
    echo "- Símbolo: ⚽ o 🏆 centrado"
    echo "- Bordes redondeados opcionales"
    exit 1
fi

echo "✅ ImageMagick detectado"
echo ""

# Crear icono base 512x512
echo "Creando icono 512x512..."
convert -size 512x512 \
    -define gradient:angle=135 \
    gradient:'#1a1a2e-#0f3460' \
    -gravity center \
    -pointsize 320 \
    -font DejaVu-Sans \
    -fill '#eab308' \
    -annotate +0+30 '⚽' \
    icon-512.png

if [ $? -eq 0 ]; then
    echo "✅ icon-512.png creado"
else
    echo "⚠️  Error creando icon-512.png"
fi

# Crear icono 192x192
echo "Creando icono 192x192..."
convert icon-512.png -resize 192x192 icon-192.png

if [ $? -eq 0 ]; then
    echo "✅ icon-192.png creado"
else
    echo "⚠️  Error creando icon-192.png"
fi

# Crear favicon.ico (opcional)
echo "Creando favicon.ico..."
convert icon-192.png -resize 32x32 favicon.ico

if [ $? -eq 0 ]; then
    echo "✅ favicon.ico creado"
else
    echo "⚠️  Error creando favicon.ico"
fi

echo ""
echo "🎉 ¡Iconos generados exitosamente!"
echo ""
echo "Archivos creados:"
ls -lh icon-*.png favicon.ico 2>/dev/null

echo ""
echo "📱 Tu PWA está lista para desplegarse"
