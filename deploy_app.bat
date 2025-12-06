@echo off
echo ==========================================
echo      AI Design Studio Deployment Tool
echo ==========================================
echo.

echo 1. Pushing code to GitHub...
git add .
git commit -m "Deployment update"
git push origin main
echo.

echo 2. Deploying to Vercel...
echo NOTE: If asked to log in, please choose "Continue with GitHub" or enter your email.
echo.
call npx vercel deploy --prod

echo.
echo ==========================================
echo             Deployment Complete!
echo ==========================================
pause
