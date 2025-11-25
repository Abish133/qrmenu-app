@echo off
echo ========================================
echo QR Menu App - Railway Deployment Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Initialize git if not already
if not exist .git (
    echo [1/5] Initializing Git repository...
    git init
    git branch -M main
) else (
    echo [1/5] Git already initialized
)

REM Add all files
echo [2/5] Adding files to Git...
git add .

REM Commit
echo [3/5] Creating commit...
git commit -m "Deploy to Railway" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Commit created successfully
) else (
    echo No changes to commit or already committed
)

echo.
echo [4/5] Next Steps:
echo.
echo 1. Create a GitHub repository at: https://github.com/new
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_GITHUB_REPO_URL
echo    git push -u origin main
echo.
echo [5/5] Deploy on Railway:
echo.
echo 1. Go to: https://railway.app
echo 2. Sign up/Login with GitHub
echo 3. Click "New Project" -^> "Deploy from GitHub repo"
echo 4. Select your repository
echo 5. Click "Add MySQL" database
echo 6. Add environment variables (see RAILWAY_DEPLOYMENT.md)
echo.
echo ========================================
echo Deployment preparation complete!
echo ========================================
pause
