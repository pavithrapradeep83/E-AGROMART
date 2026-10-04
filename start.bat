@echo off
echo.
echo ============================================
echo   Farmer Market - Full System Startup
echo ============================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server on port 5000...
start "Farmer Market Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
echo [2/2] Starting Frontend Server on port 3000...
timeout /t 2 /nobreak

REM Start Frontend Server
cd /d e:\farmer_website
start "Farmer Market Frontend" cmd /k "python -m http.server 3000"

echo.
echo ============================================
echo   System Started Successfully!
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press any key to continue...
timeout /t 5
