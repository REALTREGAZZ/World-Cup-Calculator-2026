#!/bin/bash

echo "⚽ Servidor Local - Simulador Mundial 2026"
echo "=========================================="
echo ""

# Verificar si Python está instalado
if command -v python3 &> /dev/null; then
    echo "✅ Iniciando servidor con Python..."
    echo ""
    echo "🌐 Abre tu navegador en:"
    echo "   http://localhost:8000"
    echo ""
    echo "📱 Para probar iconos:"
    echo "   http://localhost:8000/icon-generator.html"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Iniciando servidor con Python 2..."
    echo ""
    echo "🌐 Abre tu navegador en:"
    echo "   http://localhost:8000"
    echo ""
    echo "📱 Para probar iconos:"
    echo "   http://localhost:8000/icon-generator.html"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python no está instalado."
    echo ""
    echo "Opciones:"
    echo "1. Instalar Python: sudo apt install python3"
    echo "2. Instalar Node.js y usar: npx http-server -p 8000"
    echo "3. Usar cualquier otro servidor web local"
    exit 1
fi
