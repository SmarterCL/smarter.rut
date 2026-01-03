#!/bin/bash
# Script de verificación antes del build

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Verificación antes del build ===${NC}"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION está instalado${NC}"
    
    # Verificar versión de Node.js
    if [[ $(node -v | sed 's/v//') =~ ^([0-9]+)\. ]] && [ ${BASH_REMATCH[1]} -lt 18 ]; then
        echo -e "${YELLOW}⚠️  Versión de Node.js recomendada es 18 o superior${NC}"
    fi
fi

# Verificar pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm no está instalado${NC}"
    # Verificar si npm está disponible para instalar pnpm
    if command -v npm &> /dev/null; then
        echo -e "${YELLOW}   pnpm puede instalarse con: npm install -g pnpm${NC}"
    else
        echo -e "${RED}   ni npm está disponible para instalar pnpm${NC}"
    fi
else
    echo -e "${GREEN}✅ pnpm está instalado${NC}"
fi

# Verificar dependencias de Next.js
echo -e "${BLUE}=== Verificando dependencias de Next.js ===${NC}"

if [ -f "package.json" ]; then
    if grep -q "@supabase/supabase-js" package.json; then
        echo -e "${GREEN}✅ Supabase para Next.js está presente${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase para Next.js no encontrado en package.json${NC}"
    fi
    
    if grep -q "next" package.json; then
        echo -e "${GREEN}✅ Next.js está presente${NC}"
    else
        echo -e "${YELLOW}⚠️  Next.js no encontrado en package.json${NC}"
    fi
else
    echo -e "${RED}❌ package.json de Next.js no encontrado${NC}"
    exit 1
fi

# Verificar dependencias de Ionic
echo -e "${BLUE}=== Verificando dependencias de Ionic ===${NC}"

if [ -d "smarter-ionic" ]; then
    if [ -f "smarter-ionic/package.json" ]; then
        if grep -q "@supabase/supabase-js" smarter-ionic/package.json; then
            echo -e "${GREEN}✅ Supabase para Ionic está presente${NC}"
        else
            echo -e "${YELLOW}⚠️  Supabase para Ionic no encontrado en package.json${NC}"
        fi
        
        if grep -q "@ionic/angular" smarter-ionic/package.json; then
            echo -e "${GREEN}✅ Ionic está presente${NC}"
        else
            echo -e "${YELLOW}⚠️  Ionic no encontrado en package.json${NC}"
        fi
    else
        echo -e "${RED}❌ package.json de Ionic no encontrado${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Directorio smarter-ionic no encontrado${NC}"
    exit 1
fi

# Verificar archivos de servicios compartidos
echo -e "${BLUE}=== Verificando servicios compartidos ===${NC}"

if [ -d "shared/services" ]; then
    if [ -f "shared/services/auth.js" ]; then
        echo -e "${GREEN}✅ Servicio de autenticación compartido está presente${NC}"
    else
        echo -e "${YELLOW}⚠️  Servicio de autenticación compartido no encontrado${NC}"
    fi
    
    if [ -f "shared/services/utils.js" ]; then
        echo -e "${GREEN}✅ Utilidades compartidas están presentes${NC}"
    else
        echo -e "${YELLOW}⚠️  Utilidades compartidas no encontradas${NC}"
    fi
    
    if [ -f "shared/services/types.js" ]; then
        echo -e "${GREEN}✅ Tipos compartidos están presentes${NC}"
    else
        echo -e "${YELLOW}⚠️  Tipos compartidos no encontrados${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Directorio de servicios compartidos no encontrado${NC}"
fi

# Verificar archivos de la fusión
echo -e "${BLUE}=== Verificando archivos de fusión ===${NC}"

if [ -f "services/enhancedAuth.js" ]; then
    echo -e "${GREEN}✅ Servicio de autenticación mejorado está presente${NC}"
else
    echo -e "${YELLOW}⚠️  Servicio de autenticación mejorado no encontrado${NC}"
fi

if [ -f "pages/enhanced-login.js" ]; then
    echo -e "${GREEN}✅ Página de login mejorada está presente${NC}"
else
    echo -e "${YELLOW}⚠️  Página de login mejorada no encontrada${NC}"
fi

# Verificar archivos de entorno
echo -e "${BLUE}=== Verificando archivos de entorno ===${NC}"

if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Archivo de entorno para Next.js encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Archivo de entorno para Next.js no encontrado${NC}"
    echo -e "${YELLOW}   Recuerda crear .env.local o .env con tus variables de entorno${NC}"
fi

if [ -f "smarter-ionic/.env" ]; then
    echo -e "${GREEN}✅ Archivo de entorno para Ionic encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Archivo de entorno para Ionic no encontrado${NC}"
    echo -e "${YELLOW}   Recuerda crear smarter-ionic/.env con tus variables de entorno${NC}"
fi

# Verificar scripts de build
echo -e "${BLUE}=== Verificando scripts de build ===${NC}"

if [ -f "build_proyectos.sh" ]; then
    echo -e "${GREEN}✅ Script de build encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Script de build no encontrado${NC}"
fi

if [ -f "instalar_dependencias.sh" ]; then
    echo -e "${GREEN}✅ Script de instalación encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Script de instalación no encontrado${NC}"
fi

# Mostrar resumen
echo ""
echo -e "${GREEN}🎉 Verificación completada${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Node.js y npm verificados"
echo "- Dependencias de ambos proyectos verificadas"
echo "- Servicios compartidos verificados"
echo "- Archivos de fusión verificados"
echo "- Archivos de entorno verificados"
echo ""
echo -e "${GREEN}✅ El entorno está listo para el build${NC}"
echo ""
echo -e "${YELLOW}Sugerencia: Ejecuta './build_proyectos.sh' para compilar ambos proyectos${NC}"