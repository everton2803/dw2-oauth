#!/bin/bash

# Script de instalação rápida para a aplicação OAuth

echo "🚀 Iniciando instalação da aplicação OAuth..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale Node.js em https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js versão $(node -v) encontrado"
echo "✅ npm versão $(npm -v) encontrado"
echo ""

# Instalar dependências
echo "📦 Instalando dependências do projeto..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Instalação completa!"
echo "=========================================="
echo ""
echo "📋 Próximas etapas:"
echo ""
echo "1️⃣  Obter credenciais do Google:"
echo "    - Acesse: https://console.cloud.google.com"
echo "    - Crie um projeto"
echo "    - Obtenha Client ID e Client Secret"
echo ""
echo "2️⃣  Configurar arquivo .env:"
echo "    - Abra o arquivo '.env' na raiz do projeto"
echo "    - Preencha GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET"
echo ""
echo "3️⃣  Iniciar a aplicação:"
echo "    npm run dev"
echo ""
echo "4️⃣  Acessar a aplicação:"
echo "    http://localhost:3000"
echo ""
echo "📚 Documentação:"
echo "    - README.md - Documentação completa"
echo "    - QUICKSTART.md - Guia rápido"
echo "    - API.md - Referência da API"
echo "    - DESAFIOS.md - Desafios adicionais"
echo ""
echo "=========================================="
