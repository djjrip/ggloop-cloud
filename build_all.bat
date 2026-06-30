@echo off
echo ========================================================
echo   Kickama "No Limits" Universal Build Engine
echo ========================================================
echo.
echo Building the universal compiler container (this may take a few minutes the first time)...
docker build -t kickama-builder -f Dockerfile.build .

echo.
echo Running the build inside the container...
docker run --rm -v "%cd%:/app" kickama-builder

echo.
echo Build complete. Check the 'diagnostic' folder for logs.
pause
