@echo off
echo Enter your Railway public URL (without /api/health):
set /p url=
echo.
echo Testing: %url%/api/health
echo.
curl %url%/api/health
echo.
echo.
echo If you see {"status":"OK"} - Deployment is successful!
pause
