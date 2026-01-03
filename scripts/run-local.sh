#!/bin/bash
# Local run script for SmarterBOT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== SmarterBOT Local Run ===${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js is installed$(node --version)${NC}"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo -e "${YELLOW}Install with: npm install -g pnpm${NC}"
    exit 1
else
    echo -e "${GREEN}✅ pnpm is installed$(pnpm --version)${NC}"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not found, installing...${NC}"
    pnpm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Check for environment variables
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Environment file (.env or .env.local) not found${NC}"
    echo -e "${YELLOW}Create one with the required Supabase variables${NC}"
fi

# Start the development server
echo -e "${BLUE}🚀 Starting development server...${NC}"
echo -e "${YELLOW}Open http://localhost:3000 to view the application${NC}"

pnpm run dev