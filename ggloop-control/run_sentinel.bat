@echo off
title GG Loop Sentinel
echo ===================================================
echo 🛡️ STARTING AUTOPILOT PC RESOURCE OPTIMIZER
echo ===================================================
echo.
echo Launching the background monitor script.
echo This script will run silently in the background:
echo 1. It monitors for game processes (Valorant, Fortnite, Steam, etc.)
echo 2. Launches "Gamer Mode" (kills dev servers) when a game starts.
echo 3. Automatically resumes your dev server when the game exits.
echo.
echo Minimizing to system tray / running in background...
echo ===================================================
powershell -ExecutionPolicy Bypass -File "%~dp0ggloop_sentinel.ps1"
