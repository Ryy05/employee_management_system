@echo off
echo Installing ngrok for WhatsApp bot integration...
echo.

REM Download ngrok for Windows
echo Downloading ngrok...
powershell -Command "Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile 'ngrok.zip'"

echo.
echo Extracting ngrok...
powershell -Command "Expand-Archive -Path 'ngrok.zip' -DestinationPath '.' -Force"

echo.
echo Cleaning up...
del ngrok.zip

echo.
echo ngrok installed successfully!
echo.
echo Next steps:
echo 1. Sign up at https://ngrok.com
echo 2. Get your authtoken
echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
echo 4. Run: ngrok http 8000
echo.
pause