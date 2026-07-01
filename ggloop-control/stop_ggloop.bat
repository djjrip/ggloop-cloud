@echo off
echo ===================================================
echo 🛑 STOPPING GG LOOP DEVELOPER ENVIRONMENT
echo ===================================================
echo.
cd /d "%~dp0.."

echo [1/3] Terminating any Node processes running on Port 3000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo [2/3] Terminating any Node processes running on Port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo [3/3] Terminating background processes...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm run dev" 2>nul
taskkill /F /IM node.exe /FI "WINDOWTITLE eq node simulate_ban.js" 2>nul

echo.
echo ✅ GG Loop environment stopped completely. 
echo 🚀 Your system resources (CPU/RAM) are 100%% freed up for gaming!
echo ===================================================
pause
