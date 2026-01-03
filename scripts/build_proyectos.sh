#!/bin/bash
# Script de build para ambos proyectos

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Build de ambos proyectos ===${NC}"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado.${NC}"
    exit 1
fi

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm no está instalado.${NC}"
    exit 1
fi

# Preguntar si se debe instalar dependencias primero
echo -e "${YELLOW}¿Desea instalar dependencias antes del build? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Instalando dependencias ===${NC}"
    ./instalar_dependencias.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias${NC}"
        exit 1
    fi
fi

# Build del proyecto Next.js
echo -e "${BLUE}=== Compilando proyecto Next.js ===${NC}"
echo -e "${YELLOW}Ejecutando: pnpm run build${NC}"

pnpm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build de Next.js completado${NC}"
else
    echo -e "${RED}❌ Error en build de Next.js${NC}"
    exit 1
fi

# Build del proyecto Ionic
echo -e "${BLUE}=== Compilando proyecto Ionic ===${NC}"
echo -e "${YELLOW}Ejecutando: cd smarter-ionic && pnpm run build${NC}"

cd smarter-ionic
pnpm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build de Ionic completado${NC}"
else
    echo -e "${RED}❌ Error en build de Ionic${NC}"
    exit 1
fi

# Volver al directorio principal
cd ..

# Mostrar resumen
echo ""
echo -e "${GREEN}🎉 Build completado exitosamente${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Proyecto Next.js compilado en directorio .next/"
echo "- Proyecto Ionic compilado en directorio smarter-ionic/www/"
echo ""
echo -e "${BLUE}Notas:${NC}"
echo "- Para servir Next.js: npm run start"
echo "- Para servir Ionic: cd smarter-ionic && npx serve -s www"
echo ""
echo -e "${GREEN}¡Build completado!${NC}"