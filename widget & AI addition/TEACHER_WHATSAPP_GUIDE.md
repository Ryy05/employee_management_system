📱 TEACHER'S WHATSAPP BOT SETUP - 3U1 INTEGRATED MANAGEMENT SYSTEM

This guide avoids terminal commands — use web dashboards or the demo UI.

1. Ensure the bot is running via your IDE (open the project and start the FastAPI app using the IDE Run button) or use a hosted URL provided by your deployment provider.

2. Create a public webhook URL:
   - Deploy the bot to Render/Railway/Heroku via their web UI and copy the HTTPS URL.
   - The webhook will be: https://<your-hosted-url>/whatsapp

3. Twilio Sandbox configuration (web UI):
   - Go to Twilio Console → Develop → Messaging → Try it out → Send a WhatsApp message.
   - Set "When a message comes in" to your hosted webhook URL + /whatsapp and save.

4. Connect teacher's phone:
   - Add the Twilio sandbox number in WhatsApp.
   - Send the join message shown in Twilio Console.
   - After confirmation, the teacher can send commands.

Available Commands
- hello, report, leave, transfer, employee, help

Troubleshooting
- Use your hosting provider's web dashboard or IDE run console for logs.
- Re-check webhook URL in Twilio Console if messages don't arrive.