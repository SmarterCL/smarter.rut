#!/bin/bash
# Script de utilidades para la gestión del proyecto web

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Script de utilidades para la gestión del proyecto web"
    echo ""
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones disponibles:"
    echo "  help          Muestra esta ayuda"
    echo "  status        Muestra el estado del proyecto"
    echo "  install       Instala dependencias en el proyecto"
    echo "  dev           Inicia el proyecto en modo desarrollo"
    echo "  build         Construye el proyecto"
    echo "  build-local   Construye el proyecto (versión local)"
    echo "  clean         Limpia archivos de build y node_modules"
    echo "  backup        Crea una copia de seguridad del proyecto"
    echo ""
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}=== Estado del proyecto ===${NC}"

    echo -e "${YELLOW}Proyecto Next.js:${NC}"
    if [ -d "node_modules" ]; then
        echo -e "  node_modules: ${GREEN}Presente${NC}"
    else
        echo -e "  node_modules: ${RED}Ausente${NC}"
    fi

    if [ -f ".next/BUILD_ID" ]; then
        echo -e "  Build: ${GREEN}Presente${NC}"
    else
        echo -e "  Build: ${YELLOW}Ausente${NC}"
    fi
}

# Función para instalar dependencias
install_deps() {
    echo -e "${BLUE}=== Instalando dependencias ===${NC}"

    echo -e "${YELLOW}Instalando dependencias del proyecto Next.js...${NC}"
    pnpm install

    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
}

# Función para iniciar el proyecto en modo desarrollo
start_dev() {
    echo -e "${BLUE}=== Iniciando proyecto en modo desarrollo ===${NC}"

    echo -e "${YELLOW}Iniciando proyecto Next.js...${NC}"
    pnpm run dev &
    NEXT_PID=$!

    echo -e "${GREEN}✅ Proyecto iniciado en modo desarrollo${NC}"
    echo -e "${YELLOW}Next.js PID: $NEXT_PID${NC}"

    # Esperar a que el proceso termine
    wait $NEXT_PID
}

# Función para construir el proyecto
build_projects() {
    echo -e "${BLUE}=== Construyendo proyecto ===${NC}"

    echo -e "${YELLOW}Construyendo proyecto Next.js...${NC}"
    pnpm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build de Next.js completado${NC}"
    else
        echo -e "${RED}❌ Error en build de Next.js${NC}"
        return 1
    fi

    echo -e "${GREEN}🎉 Proyecto construido exitosamente${NC}"
}

# Función para construir el proyecto localmente
build_projects_local() {
    echo -e "${BLUE}=== Construyendo proyecto localmente ===${NC}"

    # Verificar si Node.js está instalado
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado.${NC}"
        exit 1
    fi

    # Verificar si npm está instalado
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm no está instalado.${NC}"
        exit 1
    fi

    # Ejecutar el script de build local
    ./build_proyectos.sh
}

# Función para limpiar archivos
clean_projects() {
    echo -e "${BLUE}=== Limpiando proyecto ===${NC}"

    echo -e "${YELLOW}Limpiando proyecto Next.js...${NC}"
    rm -rf .next
    rm -rf node_modules
    echo -e "${GREEN}✅ Limpieza de Next.js completada${NC}"

    echo -e "${GREEN}🎉 Limpieza completada${NC}"
}


# Función para crear backup
backup_projects() {
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_NAME="backup_$TIMESTAMP"

    echo -e "${BLUE}=== Creando copia de seguridad ===${NC}"
    echo -e "${YELLOW}Nombre del backup: $BACKUP_NAME${NC}"

    # Crear directorio de backup
    mkdir -p backups
    cd backups

    # Crear backup del proyecto Next.js (excluyendo node_modules y .next)
    echo -e "${YELLOW}Creando backup del proyecto Next.js...${NC}"
    tar --exclude='node_modules' --exclude='.next' -czf "${BACKUP_NAME}_nextjs.tar.gz" ../.

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup de Next.js completado${NC}"
    else
        echo -e "${RED}❌ Error en backup de Next.js${NC}"
        cd ..
        return 1
    fi

    cd ..
    echo -e "${GREEN}🎉 Backup completado: backups/${BACKUP_NAME}_nextjs.tar.gz${NC}"
}

# Manejar argumentos
case "$1" in
    "help")
        show_help
        ;;
    "status")
        show_status
        ;;
    "install")
        install_deps
        ;;
    "dev")
        start_dev
        ;;
    "build")
        build_projects
        ;;
    "build-local")
        build_projects_local
        ;;
    "clean")
        clean_projects
        ;;
    "backup")
        backup_projects
        ;;
    "")
        show_help
        ;;
    *)
        echo -e "${RED}Opción desconocida: $1${NC}"
        echo ""
        show_help
        ;;
esac