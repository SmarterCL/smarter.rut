#!/bin/bash
# Script de instalación de dependencias para ambos proyectos

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Instalación de dependencias para ambos proyectos ===${NC}"
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

# Verificar si Angular CLI está instalado globalmente
if ! command -v ng &> /dev/null; then
    echo -e "${YELLOW}⚠️  Angular CLI no está instalado globalmente. Instalando...${NC}"
    npm install -g @angular/cli@^17.0.0
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Angular CLI instalado globalmente${NC}"
    else
        echo -e "${RED}❌ Error instalando Angular CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Angular CLI está instalado$(ng version | grep Angular | head -1)${NC}"
fi

# Verificar si Ionic CLI está instalado globalmente
if ! command -v ionic &> /dev/null; then
    echo -e "${YELLOW}⚠️  Ionic CLI no está instalado globalmente. Instalando...${NC}"
    npm install -g @ionic/cli@^7.0.0
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Ionic CLI instalado globalmente${NC}"
    else
        echo -e "${RED}❌ Error instalando Ionic CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Ionic CLI está instalado${NC}"
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

# Instalar dependencias del proyecto Ionic
echo -e "${BLUE}=== Instalando dependencias del proyecto Ionic ===${NC}"
cd smarter-ionic
pnpm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias de Ionic instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias de Ionic${NC}"
    exit 1
fi

# Verificar si Capacitor CLI está instalado
echo -e "${BLUE}=== Verificando Capacitor CLI ===${NC}"
if ! command -v capacitor &> /dev/null; then
    echo -e "${YELLOW}⚠️  Capacitor CLI no está instalado. Instalando...${NC}"
    npm install -g @capacitor/cli
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Capacitor CLI instalado${NC}"
    else
        echo -e "${RED}❌ Error instalando Capacitor CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Capacitor CLI está instalado${NC}"
fi

# Volver al directorio principal
cd ..

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
echo "- Dependencias de Ionic instaladas"
echo "- Angular CLI instalado globalmente"
echo "- Ionic CLI instalado globalmente"
echo "- Capacitor CLI instalado globalmente"
echo "- Concurrently instalado globalmente"
echo ""
echo -e "${BLUE}Siguientes pasos:${NC}"
echo "1. Configurar sus variables de entorno"
echo "2. Para iniciar Next.js: npm run dev"
echo "3. Para iniciar Ionic: npm run ionic-dev"
echo "4. Para iniciar ambos: npm run both-dev"
echo ""
echo -e "${GREEN}¡Listo para desarrollar!${NC}"