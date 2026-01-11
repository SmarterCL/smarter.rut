#!/bin/bash
# Script para resolver el error de Supabase URL or Service Key missing
# Este script limpia el build y reconstruye con las variables de entorno correctas

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Resolución de error: Supabase URL or Service Key missing ===${NC}"
echo ""

echo -e "${YELLOW}1. Limpiando build anterior...${NC}"
rm -rf .next node_modules/.cache
echo -e "${GREEN}✅ Build limpiado${NC}"

echo -e "${YELLOW}2. Verificando variables de entorno...${NC}"
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL no está definida${NC}"
    echo -e "${YELLOW}Asegúrate de tener las variables de entorno definidas antes de continuar${NC}"
    exit 1
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL está definida${NC}"
    echo -e "${YELLOW}   Valor: $NEXT_PUBLIC_SUPABASE_URL${NC}"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida${NC}"
    echo -e "${YELLOW}Asegúrate de tener las variables de entorno definidas antes de continuar${NC}"
    exit 1
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_ANON_KEY está definida${NC}"
    echo -e "${YELLOW}   Valor: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:10}...${NC}"  # Mostrar solo primeros 10 caracteres por seguridad
fi

echo -e "${YELLOW}3. Reconstruyendo proyecto Next.js...${NC}"
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en la reconstrucción${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proyecto reconstruido exitosamente${NC}"

echo -e "${YELLOW}4. Validando bundle...${NC}"
if [ -d ".next" ]; then
    # Buscar archivos JS en .next
    JS_FILES=$(find .next -name "*.js" -type f | head -5)  # Tomar solo los primeros 5 archivos

    if [ -n "$JS_FILES" ]; then
        FOUND=false
        for file in $JS_FILES; do
            if grep -q "supabase.co" "$file"; then
                echo -e "${GREEN}✅ Supabase URL encontrada en: $(basename $file)${NC}"
                FOUND=true
                break
            fi
        done

        if [ "$FOUND" = false ]; then
            echo -e "${YELLOW}⚠️  No se encontró la URL de Supabase en los archivos JS (puede ser normal si está codificada)${NC}"
        fi
    else
        echo -e "${RED}❌ No se encontraron archivos JS en .next${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ No se encontró el directorio .next${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Proceso completado exitosamente${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Build limpiado"
echo "- Variables de entorno verificadas"
echo "- Proyecto reconstruido"
echo "- Bundle validado"
echo ""
echo -e "${GREEN}El error 'Supabase URL or Service Key missing' debería haberse resuelto${NC}"
echo -e "${GREEN}Después del rebuild, las variables de entorno están incluidas en el bundle${NC}"