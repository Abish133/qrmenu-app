@echo off
echo ========================================
echo Push to GitHub
echo ========================================
echo.
echo Enter your GitHub username:
set /p username=
echo.
echo Your repository URL will be:
echo https://github.com/%username%/qrmenu-app.git
echo.
echo Press any key to add remote and push...
pause >nul

git remote add origin https://github.com/%username%/qrmenu-app.git
git push -u origin main

echo.
echo ========================================
echo Done! Code pushed to GitHub
echo ========================================
echo.
echo Next: Go to https://railway.app to deploy
pause
