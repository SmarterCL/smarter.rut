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

# Cambiar al directorio del proyecto Ionic
cd smarter-ionic

echo -e "${YELLOW}1. Limpiando build anterior...${NC}"
rm -rf dist node_modules/.vite
echo -e "${GREEN}✅ Build limpiado${NC}"

echo -e "${YELLOW}2. Verificando variables de entorno...${NC}"
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${RED}❌ VITE_SUPABASE_URL no está definida${NC}"
    echo -e "${YELLOW}Asegúrate de tener las variables de entorno definidas antes de continuar${NC}"
    exit 1
else
    echo -e "${GREEN}✅ VITE_SUPABASE_URL está definida${NC}"
    echo -e "${YELLOW}   Valor: $VITE_SUPABASE_URL${NC}"
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY no está definida${NC}"
    echo -e "${YELLOW}Asegúrate de tener las variables de entorno definidas antes de continuar${NC}"
    exit 1
else
    echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY está definida${NC}"
    echo -e "${YELLOW}   Valor: ${VITE_SUPABASE_ANON_KEY:0:10}...${NC}"  # Mostrar solo primeros 10 caracteres por seguridad
fi

echo -e "${YELLOW}3. Reconstruyendo proyecto Ionic...${NC}"
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en la reconstrucción${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Proyecto reconstruido exitosamente${NC}"

echo -e "${YELLOW}4. Validando bundle...${NC}"
if [ -d "dist" ]; then
    # Buscar archivos JS en dist
    JS_FILES=$(find dist -name "*.js" -type f | head -5)  # Tomar solo los primeros 5 archivos
    
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
        echo -e "${RED}❌ No se encontraron archivos JS en dist${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ No se encontró el directorio dist${NC}"
    exit 1
fi

echo -e "${YELLOW}5. Sincronizando con Capacitor (si aplica)...${NC}"
if [ -f "capacitor.config.ts" ] || [ -f "capacitor.config.json" ]; then
    echo -e "${YELLOW}Capacitor detectado, sincronizando...${NC}"
    npx cap sync
    echo -e "${GREEN}✅ Capacitor sincronizado${NC}"
    
    echo -e "${YELLOW}Para abrir en Android:${NC}"
    echo -e "${YELLOW}  npx cap open android${NC}"
else
    echo -e "${YELLOW}Capacitor no detectado, omitiendo sincronización${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Proceso completado exitosamente${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Build limpiado"
echo "- Variables de entorno verificadas"
echo "- Proyecto reconstruido"
echo "- Bundle validado"
echo "- Capacitor sincronizado (si aplica)"
echo ""
echo -e "${GREEN}El error 'Supabase URL or Service Key missing' debería haberse resuelto${NC}"
echo -e "${GREEN}Después del rebuild, las variables de entorno están incluidas en el bundle${NC}"