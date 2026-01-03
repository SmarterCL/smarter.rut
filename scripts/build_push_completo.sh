#!/bin/bash
# Script completo para build y push del proyecto fusionado

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Script Completo: Build y Push del Proyecto Fusionado ===${NC}"
echo ""

# Verificar si estamos en un repositorio Git
if ! git status &> /dev/null; then
    echo -e "${RED}❌ No estamos en un repositorio Git${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Estamos en un repositorio Git${NC}"

# Verificar si hay cambios sin commit
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Hay cambios sin commit en el repositorio${NC}"
    echo -e "${YELLOW}   Asegúrate de que estos cambios sean los esperados${NC}"
else
    echo -e "${GREEN}✅ No hay cambios sin commit${NC}"
fi

# Ejecutar verificación del entorno
echo -e "${BLUE}=== Ejecutando verificación del entorno ===${NC}"
./verificar_entorno.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error en la verificación del entorno${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Verificación del entorno completada${NC}"

# Preguntar si se deben instalar dependencias
echo -e "${YELLOW}¿Desea instalar dependencias? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Instalando dependencias ===${NC}"
    ./instalar_dependencias.sh
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error instalando dependencias${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Instalación de dependencias completada${NC}"
else
    echo -e "${YELLOW}Omitiendo instalación de dependencias${NC}"
fi

# Preguntar si se debe hacer el build
echo -e "${YELLOW}¿Desea hacer el build de ambos proyectos? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Ejecutando build de ambos proyectos ===${NC}"
    ./build_proyectos.sh
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error en el build de los proyectos${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build de ambos proyectos completado${NC}"
else
    echo -e "${YELLOW}Omitiendo build de los proyectos${NC}"
fi

# Mostrar estado actual del repositorio
echo -e "${BLUE}=== Estado actual del repositorio ===${NC}"
git status

# Preguntar si se debe hacer el push
echo -e "${YELLOW}¿Desea hacer el push al repositorio? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}=== Haciendo commit y push ===${NC}"
    
    # Añadir todos los archivos
    git add .
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error añadiendo archivos al staging${NC}"
        exit 1
    fi
    
    # Hacer commit
    git commit -m "Fusión de proyectos Next.js e Ionic con servicios compartidos"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error haciendo commit${NC}"
        exit 1
    fi
    
    # Hacer push
    git push origin main
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error haciendo push${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Commit y push completados exitosamente${NC}"
else
    echo -e "${YELLOW}Omitiendo commit y push${NC}"
    echo -e "${YELLOW}Puedes hacerlo manualmente con:${NC}"
    echo -e "${YELLOW}  git add .${NC}"
    echo -e "${YELLOW}  git commit -m \"Fusión de proyectos Next.js e Ionic con servicios compartidos\"${NC}"
    echo -e "${YELLOW}  git push origin main${NC}"
fi

# Mostrar resumen final
echo ""
echo -e "${GREEN}🎉 Proceso completado exitosamente${NC}"
echo ""
echo -e "${BLUE}Resumen:${NC}"
echo "- Verificación del entorno: ✅"
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo "- Instalación de dependencias: ✅"
fi
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo "- Build de proyectos: ✅"
fi
if [[ "$response" =~ ^[Ss]$ ]]; then
    echo "- Commit y push: ✅"
fi
echo ""
echo -e "${GREEN}El proyecto fusionado está listo!${NC}"