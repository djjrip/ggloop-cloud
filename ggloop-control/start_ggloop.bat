@echo off
echo ===================================================
echo 🚀 STARTING GG LOOP DEVELOPER ENVIRONMENT
echo ===================================================
echo.
cd /d "%~dp0.."

echo [1/2] Launching Lead Broker ^& Telemetry Dashboard...
start "GG Loop Dev Servers" cmd /c "npm run dev"

echo [2/2] Launching Live Telemetry Simulator...
start "GG Loop Ban Simulator" cmd /c "cd backend && node simulate_ban.js"

echo.
echo ✅ GG Loop environment booted!
echo 🔗 Dashboard: http://localhost:5173
echo 🔗 Backend API: http://localhost:3000
echo.
echo 👉 Run stop_ggloop.bat when you are done to free up RAM for games.
echo ===================================================
pause
