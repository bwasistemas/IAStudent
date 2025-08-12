#!/bin/bash

# Script para inicializar todos os serviços

echo "🚀 Iniciando todos os serviços..."

# Matar processos existentes
echo "🧹 Parando processos existentes..."
pkill -f "python main.py" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
lsof -ti :7777 | xargs kill -9 2>/dev/null || true

# Aguardar um momento
sleep 2

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

# Iniciar backend em background
echo "🚀 Iniciando backend..."
nohup python main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Aguardar backend inicializar
sleep 3

# Voltar para o diretório do frontend
cd ../FrontEnd/agent-ui

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências Node.js..."
    npm install
fi

# Iniciar frontend
echo "🚀 Iniciando frontend..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Serviços iniciados!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:7777"
echo "🎮 Playground: http://localhost:3000/playground"

# Aguardar processos
wait