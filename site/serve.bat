@echo off
REM ============================================
REM  Hermes Dashboard - local dev server
REM  Double-click this file, then open:
REM      http://localhost:8000/index.html
REM ============================================
cd /d "%~dp0"
echo.
echo  GG Loop / Hermes - serving %cd%
echo  Open:  http://localhost:8000/index.html
echo  (Ctrl+C to stop)
echo.
python -m http.server 8000
