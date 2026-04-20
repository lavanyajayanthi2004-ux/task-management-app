@echo off
REM Run local server for Task Management App
REM This fixes the CORS/security issue with file:// protocol

echo.
echo ====================================================
echo Starting Task Management App Server...
echo ====================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

REM Run the Python server
python server.py

pause
