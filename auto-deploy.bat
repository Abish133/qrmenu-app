@echo off
echo ========================================
echo QR Menu - Automated Railway Deployment
echo ========================================
echo.

echo Your code is ready for deployment!
echo.
echo NEXT STEPS:
echo.
echo 1. CREATE GITHUB REPOSITORY
echo    - Go to: https://github.com/new
echo    - Name: qrmenu-app
echo    - Keep it PUBLIC
echo    - Click "Create repository"
echo.
echo 2. PUSH YOUR CODE
echo    After creating the repo, run:
echo    git remote add origin https://github.com/YOUR_USERNAME/qrmenu-app.git
echo    git push -u origin main
echo.
echo 3. DEPLOY ON RAILWAY (2 minutes)
echo    - Go to: https://railway.app
echo    - Login with GitHub
echo    - Click "New Project" -^> "Deploy from GitHub repo"
echo    - Select "qrmenu-app"
echo    - Click "New" -^> "Database" -^> "Add MySQL"
echo.
echo 4. ADD ENVIRONMENT VARIABLES
echo    Click your service -^> Variables -^> Raw Editor -^> Paste:
echo.
echo    NODE_ENV=production
echo    DB_HOST=${{MySQL.MYSQL_HOST}}
echo    DB_PORT=${{MySQL.MYSQL_PORT}}
echo    DB_NAME=${{MySQL.MYSQL_DATABASE}}
echo    DB_USER=${{MySQL.MYSQL_USER}}
echo    DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
echo    JWT_SECRET=qrmenu-secret-2024
echo    JWT_EXPIRES_IN=7d
echo    FRONTEND_URL=*
echo    ADMIN_CREATION_KEY=admin123
echo.
echo 5. GENERATE DOMAIN
echo    Settings -^> Generate Domain -^> Copy URL
echo.
echo ========================================
echo Git Status:
git status
echo ========================================
pause
