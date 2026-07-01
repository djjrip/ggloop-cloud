# GG Loop Sentinel - Autonomous Gamer/Coder Resource Optimizer
# Runs silently in the background. Auto-suspends dev servers when games are launched, and auto-resumes them on exit.

$GamesBlocklist = @(
    "VALORANT-Win64-Shipping",
    "FortniteClient-Win64-Shipping",
    "cs2",
    "Overwatch",
    "Destiny2",
    "GTA5",
    "r5apex",
    "League of Legends",
    "EldenRing",
    "Cyberpunk2077",
    "steam",
    "dota2"
)

# Dynamically resolve project path (parent of this script's directory)
$ProjectPath = Split-Path -Path $PSScriptRoot -Parent
$DevServersRunning = $false

Write-Host "[SENTINEL] GG Loop Sentinel Activated!" -ForegroundColor Green
Write-Host "[MONITOR] Monitoring for game processes..." -ForegroundColor Cyan

while ($true) {
    # Check if any listed game is currently running
    $GameActive = $false
    foreach ($game in $GamesBlocklist) {
        $proc = Get-Process -Name $game -ErrorAction SilentlyContinue
        if ($proc) {
            $GameActive = $true
            $ActiveGameName = $game
            break
        }
    }

    if ($GameActive) {
        # Check if Node/Vite is running. If so, kill them automatically to free resources.
        $NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($NodeProcesses) {
            Write-Host "[GAME] Game detected: [$ActiveGameName]!" -ForegroundColor Yellow
            Write-Host "[ACTION] Auto-suspending dev servers to maximize gaming performance..." -ForegroundColor Red
            
            # Kill Node/Vite processes on Port 3000 and 5173
            $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
            if ($port3000) {
                Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
            }
            $port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
            if ($port5173) {
                Stop-Process -Id $port5173.OwningProcess -Force -ErrorAction SilentlyContinue
            }
            
            # Kill any other Node processes in our project
            Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
            
            $DevServersRunning = $false
            Write-Host "[OK] Dev servers suspended. Have a good game!" -ForegroundColor Green
        }
    } else {
        # No game is running. Check if we need to resume the dev environment.
        # If we previously suspended them, start them back up in the background.
        $NodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if (-not $NodeProcesses -and -not $DevServersRunning) {
            Write-Host "[SYSTEM] Game closed. Auto-resuming developer environment..." -ForegroundColor Cyan
            
            # Run start script silently in background CMD window
            # Escape quotes safely for Windows CMD
            $cmdArg = "/c cd /d `"" + $ProjectPath + "\ggloop-control`" && start_ggloop.bat"
            Start-Process cmd.exe -ArgumentList $cmdArg -WindowStyle Hidden
            
            $DevServersRunning = $true
            Write-Host "[OK] GG Loop backend and dashboard resumed." -ForegroundColor Green
        }
    }

    # Poll every 5 seconds to keep overhead at virtually 0% CPU
    Start-Sleep -Seconds 5
}
