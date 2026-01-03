#!/bin/bash
# Script de inicialización para nuevos desarrolladores

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Inicialización del Proyecto SmarterBOT ===${NC}"
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

# Preguntar si se deben instalar dependencias
echo -e "${YELLOW}¿Desea instalar las dependencias de ambos proyectos? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Instalando dependencias del proyecto Next.js ===${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencias de Next.js instaladas${NC}"
    else
        echo -e "${RED}❌ Error instalando dependencias de Next.js${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}=== Instalando dependencias del proyecto Ionic ===${NC}"
    cd smarter-ionic
    npm install
    cd ..
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencias de Ionic instaladas${NC}"
    else
        echo -e "${RED}❌ Error instalando dependencias de Ionic${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Omitiendo instalación de dependencias${NC}"
fi

# Preguntar si se deben configurar variables de entorno
echo -e "${YELLOW}¿Desea crear archivos .env de ejemplo? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Creando archivos .env de ejemplo ===${NC}"
    
    # Crear .env.local para Next.js si no existe
    if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
        cat > .env.local << EOF
# Variables de entorno para el proyecto Next.js
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF
        echo -e "${GREEN}✅ Archivo .env.local creado para Next.js${NC}"
    else
        echo -e "${YELLOW}⚠️  Archivo .env ya existe para Next.js, omitiendo${NC}"
    fi
    
    # Crear .env para Ionic si no existe
    if [ ! -f "smarter-ionic/.env" ]; then
        cat > smarter-ionic/.env << EOF
# Variables de entorno para el proyecto Ionic
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
EOF
        echo -e "${GREEN}✅ Archivo .env creado para Ionic${NC}"
    else
        echo -e "${YELLOW}⚠️  Archivo .env ya existe para Ionic, omitiendo${NC}"
    fi
else
    echo -e "${YELLOW}Omitiendo creación de archivos .env${NC}"
fi

# Mostrar resumen
echo ""
echo -e "${GREEN}🎉 Inicialización completada exitosamente${NC}"
echo ""
echo -e "${BLUE}Siguientes pasos recomendados:${NC}"
echo "1. Configurar sus variables de entorno en los archivos .env"
echo "2. Para iniciar el proyecto Next.js: npm run dev"
echo "3. Para iniciar el proyecto Ionic: npm run ionic-dev"
echo "4. Para ver todos los comandos disponibles: npm run fusion-help"
echo ""
echo -e "${BLUE}Documentación:${NC}"
echo "- Para más información: cat README_FUSION.md"
echo "- Para ver el plan de fusión: cat FUSION_PLAN.md"
echo "- Para ver la arquitectura: cat ARQUITECTURA_COMPARTIDA.md"
echo ""
echo -e "${GREEN}¡Listo para comenzar a desarrollar!${NC}"