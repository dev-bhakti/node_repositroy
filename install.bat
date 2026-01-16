@REM @echo off
@REM REM Blog Platform - Installation Script for Windows
@REM REM This script installs all dependencies for both backend and frontend

@REM echo ======================================
@REM echo Blog Platform - Installation Script
@REM echo ======================================
@REM echo.

@REM REM Check if Node.js is installed
@REM where node >nul 2>nul
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo X Node.js is not installed. Please install Node.js first.
@REM     echo Download from: https://nodejs.org/
@REM     exit /b 1
@REM )

@REM echo [OK] Node.js version:
@REM node --version
@REM echo [OK] npm version:
@REM npm --version
@REM echo.

@REM REM Check if PostgreSQL is installed
@REM where psql >nul 2>nul
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo [WARNING] PostgreSQL is not installed or not in PATH.
@REM     echo Please install PostgreSQL from: https://www.postgresql.org/download/
@REM     echo.
@REM )

@REM REM Install Backend Dependencies
@REM echo ======================================
@REM echo Installing Backend Dependencies...
@REM echo ======================================
@REM cd backend
@REM call npm install
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo X Failed to install backend dependencies
@REM     exit /b 1
@REM )
@REM echo [OK] Backend dependencies installed successfully!
@REM cd ..
@REM echo.

@REM REM Install Frontend Dependencies
@REM echo ======================================
@REM echo Installing Frontend Dependencies...
@REM echo ======================================
@REM cd frontend
@REM call npm install
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo X Failed to install frontend dependencies
@REM     exit /b 1
@REM )
@REM echo [OK] Frontend dependencies installed successfully!
@REM cd ..
@REM echo.

@REM REM Check for Angular CLI
@REM where ng >nul 2>nul
@REM if %ERRORLEVEL% NEQ 0 (
@REM     echo ======================================
@REM     echo Installing Angular CLI...
@REM     echo ======================================
@REM     call npm install -g @angular/cli@13
@REM     if %ERRORLEVEL% NEQ 0 (
@REM         echo X Failed to install Angular CLI
@REM         exit /b 1
@REM     )
@REM     echo [OK] Angular CLI installed successfully!
@REM     echo.
@REM )

@REM REM Setup environment file
@REM echo ======================================
@REM echo Setting up Environment File...
@REM echo ======================================
@REM if not exist backend\.env (
@REM     copy backend\.env.example backend\.env
@REM     echo [OK] Created backend\.env file
@REM     echo [WARNING] Please edit backend\.env with your database credentials
@REM ) else (
@REM     echo [INFO] backend\.env already exists
@REM )
@REM echo.

@REM echo ======================================
@REM echo [OK] Installation Complete!
@REM echo ======================================
@REM echo.
@REM echo Next Steps:
@REM echo 1. Setup PostgreSQL database:
@REM echo    psql -U postgres -f database\setup.sql
@REM echo.
@REM echo 2. Edit backend\.env with your database credentials
@REM echo.
@REM echo 3. Start the backend server:
@REM echo    cd backend
@REM echo    npm run dev
@REM echo.
@REM echo 4. In a new terminal, start the frontend:
@REM echo    cd frontend
@REM echo    npm start
@REM echo.
@REM echo 5. Open http://localhost:4200 in your browser
@REM echo.
@REM echo For more details, see README.md or QUICKSTART.md
@REM echo ======================================
@REM pause

