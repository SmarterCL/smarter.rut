#!/bin/bash
# Script de utilidades para la gestión de proyectos Next.js e Ionic

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Script de utilidades para la gestión de proyectos Next.js e Ionic"
    echo ""
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones disponibles:"
    echo "  help          Muestra esta ayuda"
    echo "  status        Muestra el estado de ambos proyectos"
    echo "  install       Instala dependencias en ambos proyectos"
    echo "  dev           Inicia ambos proyectos en modo desarrollo"
    echo "  build         Construye ambos proyectos"
    echo "  build-local   Construye ambos proyectos (versión local)"
    echo "  clean         Limpia archivos de build y node_modules"
    echo "  sync-env      Sincroniza variables de entorno entre proyectos"
    echo "  backup        Crea una copia de seguridad de ambos proyectos"
    echo ""
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}=== Estado de los proyectos ===${NC}"
    
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
    
    echo -e "${YELLOW}Proyecto Ionic:${NC}"
    if [ -d "smarter-ionic/node_modules" ]; then
        echo -e "  node_modules: ${GREEN}Presente${NC}"
    else
        echo -e "  node_modules: ${RED}Ausente${NC}"
    fi
    
    if [ -d "smarter-ionic/www" ]; then
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

    echo -e "${YELLOW}Instalando dependencias del proyecto Ionic...${NC}"
    cd smarter-ionic
    pnpm install
    cd ..

    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
}

# Función para iniciar ambos proyectos en modo desarrollo
start_dev() {
    echo -e "${BLUE}=== Iniciando proyectos en modo desarrollo ===${NC}"

    echo -e "${YELLOW}Iniciando proyecto Next.js...${NC}"
    pnpm run dev &
    NEXT_PID=$!

    echo -e "${YELLOW}Iniciando proyecto Ionic...${NC}"
    cd smarter-ionic
    pnpm run dev &
    IONIC_PID=$!
    cd ..

    echo -e "${GREEN}✅ Proyectos iniciados en modo desarrollo${NC}"
    echo -e "${YELLOW}Next.js PID: $NEXT_PID${NC}"
    echo -e "${YELLOW}Ionic PID: $IONIC_PID${NC}"

    # Esperar a que ambos procesos terminen
    wait $NEXT_PID
    wait $IONIC_PID
}

# Función para construir ambos proyectos
build_projects() {
    echo -e "${BLUE}=== Construyendo proyectos ===${NC}"

    echo -e "${YELLOW}Construyendo proyecto Next.js...${NC}"
    pnpm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build de Next.js completado${NC}"
    else
        echo -e "${RED}❌ Error en build de Next.js${NC}"
        return 1
    fi

    echo -e "${YELLOW}Construyendo proyecto Ionic...${NC}"
    cd smarter-ionic
    pnpm run build
    cd ..

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build de Ionic completado${NC}"
    else
        echo -e "${RED}❌ Error en build de Ionic${NC}"
        return 1
    fi

    echo -e "${GREEN}🎉 Ambos proyectos construidos exitosamente${NC}"
}

# Función para construir ambos proyectos localmente
build_projects_local() {
    echo -e "${BLUE}=== Construyendo proyectos localmente ===${NC}"

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
    echo -e "${BLUE}=== Limpiando proyectos ===${NC}"
    
    echo -e "${YELLOW}Limpiando proyecto Next.js...${NC}"
    rm -rf .next
    rm -rf node_modules
    echo -e "${GREEN}✅ Limpieza de Next.js completada${NC}"
    
    echo -e "${YELLOW}Limpiando proyecto Ionic...${NC}"
    cd smarter-ionic
    rm -rf www
    rm -rf node_modules
    cd ..
    echo -e "${GREEN}✅ Limpieza de Ionic completada${NC}"
    
    echo -e "${GREEN}🎉 Limpieza completada${NC}"
}

# Función para sincronizar variables de entorno
sync_env() {
    echo -e "${BLUE}=== Sincronizando variables de entorno ===${NC}"
    
    # Copiar variables de entorno del proyecto Next.js al Ionic si existen
    if [ -f ".env.local" ]; then
        echo -e "${YELLOW}Copiando .env.local a smarter-ionic...${NC}"
        cp .env.local smarter-ionic/.env
        echo -e "${GREEN}✅ Variables copiadas${NC}"
    elif [ -f ".env" ]; then
        echo -e "${YELLOW}Copiando .env a smarter-ionic...${NC}"
        cp .env smarter-ionic/.env
        echo -e "${GREEN}✅ Variables copiadas${NC}"
    else
        echo -e "${YELLOW}No se encontraron archivos .env en el proyecto Next.js${NC}"
        echo -e "${YELLOW}Creando archivo .env para Ionic...${NC}"
        cat > smarter-ionic/.env << EOF
# Variables de entorno para el proyecto Ionic
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
EOF
        echo -e "${GREEN}✅ Archivo .env creado para Ionic${NC}"
    fi
    
    echo -e "${GREEN}🎉 Sincronización de variables completada${NC}"
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
    tar --exclude='node_modules' --exclude='.next' --exclude='smarter-ionic/node_modules' --exclude='smarter-ionic/www' -czf "${BACKUP_NAME}_nextjs.tar.gz" ../.
    
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
    "sync-env")
        sync_env
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