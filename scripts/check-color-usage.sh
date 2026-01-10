#!/bin/bash
# Script de verificación de tokens canónicos
# Verifica que no se usen colores prohibidos directamente

echo "Verificando uso indebido de colores directos..."

# Buscar colores hexadecimales prohibidos (excluyendo directorios de dependencias y build)
PROHIBIDOS_HEX=$(grep -r -E -o '#fff|#ffffff|#000|#000000|rgb\(255,\s*255,\s*255\)|rgb\(0,\s*0,\s*0\)' --include="*.css" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=dist --exclude-dir=build . 2>/dev/null)

# Buscar uso de palabras clave de colores prohibidos en contextos indebidos
# Excluir: clases de Bootstrap (text-white, bg-white, etc.), referencias a imágenes, mayúsculas, etc.
PROHIBIDOS_NOMBRE=$(grep -r -n -i "white\|black\|blue" --include="*.css" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=dist --exclude-dir=build . 2>/dev/null | \
    grep -v -i -E "(text-white|bg-white|btn-white|border-white|text-black|bg-black|btn-black|border-black|text-blue|bg-blue|btn-blue|border-blue|WHITE|BLACK|BLUE|bluebird|_blue|blue_|\.svg|\.png|\.jpg|\.jpeg|/images.*white|/images.*black|/images.*blue|src.*white|src.*black|src.*blue|SmarterBot-white|SmarterBot-black|\.white\.|\.black\.|\.blue\.|white-|black-|blue-|white_|black_|blue_|build|index\.js.*white\.svg)" | \
    grep -v -E "\.(svg|png|jpg|jpeg):" || true)

if [ -n "$PROHIBIDOS_HEX" ] || [ -n "$PROHIBIDOS_NOMBRE" ]; then
    echo "ERROR: Se encontraron usos indebidos de colores prohibidos:"
    if [ -n "$PROHIBIDOS_HEX" ]; then
        echo "Colores hexadecimales prohibidos encontrados:"
        echo "$PROHIBIDOS_HEX"
    fi
    if [ -n "$PROHIBIDOS_NOMBRE" ]; then
        echo "Nombres de colores prohibidos encontrados en contextos indebidos:"
        echo "$PROHIBIDOS_NOMBRE"
    fi
    exit 1
else
    echo "✓ No se encontraron usos indebidos de colores prohibidos"
    exit 0
fi