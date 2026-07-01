@echo off
echo ===================================================
echo 🚀 STARTING GG LOOP DEVELOPER ENVIRONMENT
echo ===================================================
echo.
cd /d "%~dp0.."

echo [1/2] Launching Lead Broker ^& Telemetry Dashboard...
start "GG Loop Backend Broker" /D "%~dp0..\backend" node server.js
start "GG Loop Frontend Dashboard" /D "%~dp0..\site\hermes-dashboard" node node_modules\vite\bin\vite.js

echo [2/2] Launching Live Telemetry Simulator...
start "GG Loop Ban Simulator" /D "%~dp0..\backend" node simulate_ban.js

echo.
echo ✅ GG Loop environment booted!
echo 🔗 Dashboard: http://localhost:5173
echo 🔗 Backend API: http://localhost:3000
echo.
echo 👉 Run stop_ggloop.bat when you are done to free up RAM for games.
echo ===================================================
pause
