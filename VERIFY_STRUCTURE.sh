#!/bin/bash

echo "🔍 Verificando estructura de Carriup v2..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${RED}❌${NC} $1"
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✅${NC} $1"
  else
    echo -e "${RED}❌${NC} $1"
  fi
}

echo "📁 Backend Structure:"
check_dir "backend"
check_dir "backend/src"
check_file "backend/src/server.js"
check_file "backend/package.json"
check_file "backend/Dockerfile"

echo ""
echo "📁 Frontend Structure:"
check_dir "frontend"
check_dir "frontend/app"
check_file "frontend/app/layout.tsx"
check_file "frontend/app/page.tsx"
check_file "frontend/app/compare/page.tsx"
check_file "frontend/app/globals.css"
check_file "frontend/package.json"
check_file "frontend/next.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/Dockerfile"

echo ""
echo "📁 Database Structure:"
check_dir "scripts"
check_file "scripts/init-db.sql"

echo ""
echo "📁 Root Files:"
check_file "docker-compose.yml"
check_file ".env.example"
check_file "V2_CONSTRUCTION_COMPLETE.md"

echo ""
echo "✨ Verificación completa!"
echo ""
echo "Próximo paso:"
echo "  docker-compose up"
echo ""
