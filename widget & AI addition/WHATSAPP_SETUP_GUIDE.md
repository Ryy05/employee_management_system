# REAL WHATSAPP INTEGRATION SETUP GUIDE

## GOAL
Connect a phone to WhatsApp bot for 3U1 IMS without showing terminal commands.

## Step 1 — Prepare
- Confirm the WhatsApp bot code is present in the repo (`twilio_whatsapp.py`)
- Use your IDE to open the project and run the FastAPI application from the Run/Debug configuration (no terminal)

## Step 2 — Get a public URL (no CLI)
**Preferred:** Deploy to a hosting provider (Render, Railway, Heroku) using their web UI
- Obtain the HTTPS URL from the provider dashboard after deployment
- Example: `https://your-app.onrender.com` or `https://your-app.railway.app`

**Local alternative:** Run the included demo UI locally from your IDE
- Simulates WhatsApp interactions for demonstrations

## Step 3 — Twilio Configuration (web UI)
1. Go to [Twilio Console → Messaging → WhatsApp Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox)
2. Set "When a message comes in" to: `YOUR_HOSTED_URL/whatsapp`
3. Save the configuration

## Step 4 — Teacher Phone Setup
1. Add the Twilio sandbox number in WhatsApp
2. Send the join message shown in Twilio Console
3. After confirmation, the teacher can chat with the bot

## Testing (no terminal)
- Use the hosted URL to send messages and verify responses
- For hosted deployments, check provider logs in the web dashboard
- Test with demo commands: `hello`, `report`, `leave`, `transfer`, `help`

## Troubleshooting
- Use hosting dashboard logs or IDE run console for errors
- Reconfigure webhook in Twilio Console if messages fail
- Verify the webhook URL includes `/whatsapp` endpoint