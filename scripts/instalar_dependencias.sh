#!/bin/bash
# Script de instalación de dependencias para el proyecto web

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Instalación de dependencias para el proyecto web ===${NC}"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor, instale Node.js antes de continuar.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js está instalado$(node --version)${NC}"
fi

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm no está instalado. Instalando...${NC}"
    # Verificar si npm está disponible para instalar pnpm
    if command -v npm &> /dev/null; then
        npm install -g pnpm
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ pnpm instalado${NC}"
        else
            echo -e "${RED}❌ Error instalando pnpm${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ npm no está disponible para instalar pnpm${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ pnpm está instalado$(pnpm --version)${NC}"
fi

# Instalar dependencias del proyecto Next.js
echo -e "${BLUE}=== Instalando dependencias del proyecto Next.js ===${NC}"
pnpm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias de Next.js instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias de Next.js${NC}"
    exit 1
fi

# Verificar si concurrently está instalado globalmente para el script both-dev
echo -e "${BLUE}=== Verificando Concurrently ===${NC}"
if ! command -v concurrently &> /dev/null; then
    echo -e "${YELLOW}⚠️  Concurrently no está instalado. Instalando...${NC}"
    npm install -g concurrently
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Concurrently instalado${NC}"
    else
        echo -e "${RED}❌ Error instalando Concurrently${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Concurrently está instalado${NC}"
fi

# Mostrar resumen
echo ""
echo -e "${GREEN}🎉 Instalación completada exitosamente${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Dependencias de Next.js instaladas"
echo "- Concurrently instalado globalmente"
echo ""
echo -e "${BLUE}Siguientes pasos:${NC}"
echo "1. Configurar sus variables de entorno"
echo "2. Para iniciar Next.js: npm run dev"
echo ""
echo -e "${GREEN}¡Listo para desarrollar!${NC}"