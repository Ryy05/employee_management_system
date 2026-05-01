@echo off
echo.
echo ======================================
echo STARTING WHATSAPP BOT FOR REAL PHONE
echo ======================================
echo.

echo Step 1: Starting ngrok tunnel...
echo.
echo Please follow these steps manually:
echo.
echo 1. RESTART PowerShell (to load ngrok in PATH)
echo 2. Run: ngrok http 8000
echo 3. Copy the HTTPS URL (like: https://abc123.ngrok.io)
echo 4. Your webhook URL will be: https://abc123.ngrok.io/whatsapp
echo.

echo Step 2: Go to Twilio Console
echo 1. Visit: https://www.twilio.com/console/sms/whatsapp/sandbox
echo 2. Sign up for free account if needed
echo 3. Set webhook URL to your ngrok URL + /whatsapp
echo.

echo Step 3: Connect Teacher's Phone
echo 1. Teacher saves Twilio sandbox number
echo 2. Teacher sends join message (shown in Twilio console)
echo 3. Teacher can now chat with bot!
echo.

echo Available Bot Commands:
echo - hello (welcome message)
echo - report (system stats)
echo - leave (leave management)
echo - transfer (transfer info)
echo - employee (staff info)
echo - help (all commands)
echo.

echo Your WhatsApp bot is ready! Teacher can use official WhatsApp app.
echo.
pause