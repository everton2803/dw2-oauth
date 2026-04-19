@echo off
REM Script de teste da API OAuth
REM Execute este arquivo após iniciar a aplicação

echo.
echo ========================================
echo      Teste da API OAuth
echo ========================================
echo.

REM Health Check
echo [1/4] Testando Health Check...
curl http://localhost:3000/api/health
echo.
echo.

REM Instrução para obter token
echo [2/4] Para os próximos testes, você precisa de um JWT Token:
echo.
echo 1. Abra http://localhost:3000 em seu navegador
echo 2. Faça login com Google
echo 3. Na página do dashboard, copie o token JWT
echo 4. Cole o token abaixo
echo.

set /p TOKEN="Cole seu JWT Token aqui: "

if "%TOKEN%"=="" (
    echo Erro: Nenhum token fornecido
    exit /b 1
)

REM Test User Endpoint
echo.
echo [3/4] Testando endpoint /api/user...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:3000/api/user
echo.
echo.

REM Test Users List
echo [4/4] Testando endpoint /api/users...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:3000/api/users
echo.
echo.

echo ========================================
echo      Testes Completos!
echo ========================================
echo.

pause
