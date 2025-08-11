#!/bin/bash

# Script para inicializar todos os serviços

echo "🚀 Iniciando todos os serviços..."

# Navegar para o diretório backend
cd BackEnd

# Verificar se o ambiente virtual existe, se não, criar
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual Python..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🐍 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências Python se necessário
echo "📥 Verificando dependências Python..."
pip install -r requirements.txt --upgrade

# Voltar para o diretório raiz
cd ..

# Inicializar todos os serviços simultaneamente
echo "🎯 Iniciando todos os serviços simultaneamente..."
cd FrontEnd/agent-ui

# Executar frontend e backends
npx concurrently \
  --names "FRONTEND,BACKEND-MAIN" \
  --prefix-colors "blue,green" \
  "npm run dev" \
  "cd ../../BackEnd && source venv/bin/activate && python main.py"