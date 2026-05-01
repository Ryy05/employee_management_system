"""
3U1 Integrated Management System - WhatsApp Webhook
==================================================

How to run this application:
1. Install dependencies: pip install fastapi uvicorn twilio
2. Run the server: python -m uvicorn twilio_whatsapp:app --reload --host 0.0.0.0 --port 8000
3. Use ngrok for public URL: ngrok http 8000
4. Set the ngrok URL + /whatsapp as your Twilio webhook URL

Example ngrok URL: https://abc123.ngrok.io/whatsapp

This webhook handles WhatsApp messages for the Employee Management System demo.
"""

from fastapi import FastAPI, Form, Request
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
import logging
from datetime import datetime

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="3U1 Integrated Management System - WhatsApp Bot",
    description="WhatsApp webhook for Employee Management System demo",
    version="1.0.0"
)

# Root endpoint for health check
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "3U1 Integrated Management System WhatsApp Bot",
        "timestamp": datetime.now().isoformat(),
        "webhook_url": "/whatsapp"
    }

# Main WhatsApp webhook endpoint
@app.post("/whatsapp")
async def whatsapp_webhook(
    request: Request,
    Body: str = Form(...),
    From: str = Form(...),
    To: str = Form(...)
):
    """
    Main WhatsApp webhook endpoint that processes incoming messages
    and responds with appropriate replies based on the user's message.
    
    Args:
        Body: The message content from WhatsApp user
        From: Sender's WhatsApp number
        To: Receiver's WhatsApp number (your Twilio number)
    """
    
    # Log incoming message for debugging
    logger.info(f"Received message from {From}: {Body}")
    
    # Create Twilio MessagingResponse object
    response = MessagingResponse()
    
    # Process the incoming message and generate appropriate response
    reply_message = process_user_message(Body.strip().lower())
    
    # Add the reply message to Twilio response
    response.message(reply_message)
    
    # Log outgoing response
    logger.info(f"Sending reply: {reply_message}")
    
    # Return XML response for Twilio
    return Response(content=str(response), media_type="application/xml")

def process_user_message(user_message: str) -> str:
    """
    Process user message and return appropriate response.
    This function contains the main logic for handling different commands.
    
    Args:
        user_message: The cleaned and lowercased user message
        
    Returns:
        str: The response message to send back to user
    """
    
    # Welcome/Hello command
    if user_message in ["hello", "hi", "hey", "start"]:
        return (
            "👋 *Welcome to 3U1 Integrated Management System!*\n\n"
            "🏫 Your complete Employee Management solution for educational institutions.\n\n"
            "✨ *Available Features:*\n"
            "• Employee records & transfers\n"
            "• School & district management\n"
            "• Real-time analytics\n"
            "• Security monitoring\n\n"
            "Type *'help'* to see available commands! 🚀"
        )
    
    # Report command - Show system statistics
    elif user_message in ["report", "reports", "stats", "statistics"]:
        return (
            "📊 *3U1 IMS System Report*\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "👥 *Employee Statistics:*\n"
            "• Total Employees: 1,247\n"
            "• Active Staff: 1,198\n"
            "• New Hires This Month: 23\n\n"
            "🏫 *School Management:*\n"
            "• Total Schools: 89\n"
            "• Pending Approvals: 2\n"
            "• Zones: 15 across 5 districts\n\n"
            "🔄 *Transfer Updates:*\n"
            "• Pending Transfers: 12\n"
            "• Completed This Month: 156\n"
            "• Staff Updates: 5 new postings\n\n"
            "✅ All systems operational!"
        )
    
    # Leave command - Leave management demo
    elif user_message in ["leave", "leaves", "apply leave", "leave request"]:
        return (
            "📝 *Leave Management System*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "✅ *Demo Leave Request Recorded!*\n\n"
            "📋 *Leave Types Available:*\n"
            "• Sick Leave: 12 days/year\n"
            "• Casual Leave: 8 days/year\n"
            "• Maternity Leave: 180 days\n"
            "• Paternity Leave: 15 days\n\n"
            "⏱️ *Processing Time:* 24-48 hours\n"
            "📧 *Status Updates:* Via SMS & Email\n\n"
            "🔗 Use the web dashboard for detailed leave management!"
        )
    
    # Transfer command - Transfer management info
    elif user_message in ["transfer", "transfers", "posting", "postings"]:
        return (
            "🔄 *Transfer Management System*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "📊 *Current Status:*\n"
            "• Pending Requests: 12\n"
            "• Under Review: 8\n"
            "• Approved Today: 3\n\n"
            "📋 *Transfer Process:*\n"
            "1️⃣ Submit request online\n"
            "2️⃣ Department approval\n"
            "3️⃣ Zone verification\n"
            "4️⃣ Final posting order\n\n"
            "⏱️ *Average Processing:* 15-30 days\n\n"
            "Access full transfer management via dashboard!"
        )
    
    # Employee search/info command
    elif user_message in ["employee", "employees", "staff", "search"]:
        return (
            "👥 *Employee Information System*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "🔍 *Search Capabilities:*\n"
            "• By Name or Employee ID\n"
            "• School-wise filtering\n"
            "• Zone & District view\n"
            "• Department-wise reports\n\n"
            "📈 *Quick Stats:*\n"
            "• Mathematics Teachers: 234\n"
            "• Science Faculty: 189\n"
            "• Administrative Staff: 156\n\n"
            "🌐 Use the web interface for detailed employee management!"
        )
    
    # Help command - Show all available commands
    elif user_message in ["help", "commands", "menu", "options"]:
        return (
            "🤖 *3U1 IMS WhatsApp Bot Commands*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "💬 *Available Commands:*\n\n"
            "🔸 *hello* - Welcome message & system info\n"
            "🔸 *report* - View system statistics\n"
            "🔸 *leave* - Leave management demo\n"
            "🔸 *transfer* - Transfer system info\n"
            "🔸 *employee* - Employee search info\n"
            "🔸 *help* - Show this menu\n\n"
            "🌐 *Full System Access:*\n"
            "Visit the web dashboard for complete functionality!\n\n"
            "📞 *Support:* Type any command to get started!"
        )
    
    # Analytics/dashboard command
    elif user_message in ["analytics", "dashboard", "system", "status"]:
        return (
            "📊 *3U1 IMS Analytics Dashboard*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "⚡ *System Status:* All Green\n"
            "🔐 *Security:* IP Tracking Active\n"
            "💾 *Database:* Connected & Healthy\n\n"
            "📈 *Today's Activity:*\n"
            "• Login Attempts: 342\n"
            "• Unique Users: 156\n"
            "• Failed Logins: 3\n\n"
            "🔄 *Real-time Updates:*\n"
            "• Employee transfers\n"
            "• Leave applications\n"
            "• System notifications\n\n"
            "Access full analytics via web dashboard!"
        )
    
    # Default response for unknown commands
    else:
        return (
            "❓ *Command Not Recognized*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"I didn't understand: *'{user_message}'*\n\n"
            "🤖 *Try these commands:*\n"
            "• *hello* - Get started\n"
            "• *report* - System statistics\n"
            "• *leave* - Leave management\n"
            "• *transfer* - Transfer info\n"
            "• *employee* - Staff information\n"
            "• *help* - Full command list\n\n"
            "💡 Type *'help'* for all available options!"
        )

# Health check endpoint for monitoring
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring the service"""
    return {
        "status": "healthy",
        "service": "3U1 IMS WhatsApp Bot",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "webhook": "/whatsapp",
            "health": "/health",
            "root": "/"
        }
    }

# Run the application
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting 3U1 Integrated Management System WhatsApp Bot...")
    print("📱 Webhook URL will be: http://localhost:8000/whatsapp")
    print("🌐 Use ngrok to expose this URL publicly for Twilio")
    uvicorn.run("twilio_whatsapp:app", host="0.0.0.0", port=8000, reload=True)