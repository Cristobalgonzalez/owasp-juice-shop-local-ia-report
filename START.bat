@echo off
REM Script para ejecutar la aplicación vulnerable y generar reporte OWASP

echo.
echo ====================================
echo Análisis de Seguridad OWASP Top 10
echo ====================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
  echo Error: Node.js no está instalado
  exit /b 1
)

REM Cambiar a directorio de la app
cd vulnerable-app

REM Instalar dependencias si es necesario
if not exist "node_modules" (
  echo [*] Instalando dependencias...
  call npm install
)

echo.
echo [+] Iniciando servidor...
echo.
echo ========================================
echo Aplicación vulnerable iniciada
echo Accede a: http://localhost:3000
echo ========================================
echo.
echo Presiona Ctrl+C para detener
echo.

node server.js
