@echo off
REM Installation script for Employee Management System (Windows)

echo 🚀 Starting Employee Management System Installation...

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd employee-mgmt-system-main\backend
npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..\..

echo 📦 Installing frontend dependencies...
cd employee-mgmt-system-main\frontend
npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..\..

REM Install Python dependencies
echo 🐍 Installing Python dependencies...
pip install -r python_requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Setup environment
echo ⚙️  Setting up environment configuration...
node scripts\setup-env.js

echo.
echo 🎉 Installation complete!
echo.
echo 🚀 Quick start commands:
echo    npm run dev          # Start all services in development mode
echo    npm run docker:up    # Start with Docker (requires Docker installed)
echo.
echo 📚 For more information, check the README.md file
echo.
echo 🌐 Once running, access:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000  
echo    Chatbot:  http://localhost:5001
echo.
pause