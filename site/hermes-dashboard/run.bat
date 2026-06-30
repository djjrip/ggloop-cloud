@echo off
REM ============================================================
REM  Hermes Dashboard (React/Vite) - one-click dev launcher
REM  Installs deps (first run) and starts the dev server.
REM  Then open the URL it prints (default http://localhost:5173)
REM ============================================================
cd /d "%~dp0"

echo.
echo  GG Loop / Hermes Dashboard
echo  ---------------------------------------------

REM Clean any partial node_modules from a prior interrupted install
if exist node_modules\.package-lock.json goto havedeps
if exist node_modules (
  echo  Cleaning incomplete node_modules ...
  rmdir /s /q node_modules
)

:install
echo  Installing dependencies ^(first run, ~1-2 min^) ...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo  npm install failed. Make sure Node.js 18+ is installed: https://nodejs.org
  pause
  exit /b 1
)

:havedeps
echo.
echo  Starting Vite dev server ...
echo  Open the URL below in your browser ^(usually http://localhost:5173^)
echo  Start the CTO's broker on localhost:3000 first to see LIVE leads.
echo  ^(Ctrl+C to stop^)
echo.
call npm run dev
