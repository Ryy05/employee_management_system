"""
WhatsApp Bot Demo Interface - No External Tunneling Required
===========================================================

This creates a web interface that simulates WhatsApp conversations
for demo purposes without needing ngrok or external tunneling.
"""

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import json
from datetime import datetime

# Import the message processing function from your WhatsApp bot
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="WhatsApp Bot Demo Interface")

# Mock the process_user_message function if not imported
def process_user_message(user_message: str) -> str:
    """Process user message and return appropriate response"""
    
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
    
    elif user_message in ["help", "commands", "menu", "options"]:
        return (
            "🤖 *3U1 IMS WhatsApp Bot Commands*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "💬 *Available Commands:*\n\n"
            "🔸 *hello* - Welcome message & system info\n"
            "🔸 *report* - View system statistics\n"
            "🔸 *leave* - Leave management demo\n"
            "🔸 *help* - Show this menu\n\n"
            "🌐 *Full System Access:*\n"
            "Visit the web dashboard for complete functionality!\n\n"
            "📞 *Support:* Type any command to get started!"
        )
    
    else:
        return (
            "❓ *Command Not Recognized*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            f"I didn't understand: *'{user_message}'*\n\n"
            "🤖 *Try these commands:*\n"
            "• *hello* - Get started\n"
            "• *report* - System statistics\n"
            "• *leave* - Leave management\n"
            "• *help* - Full command list\n\n"
            "💡 Type *'help'* for all available options!"
        )

@app.get("/", response_class=HTMLResponse)
async def demo_interface():
    """Serve the WhatsApp demo interface"""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3U1 IMS WhatsApp Bot Demo</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .container {
                max-width: 400px;
                width: 100%;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .header {
                background: #25D366;
                color: white;
                padding: 20px;
                text-align: center;
            }
            
            .chat-container {
                height: 500px;
                overflow-y: auto;
                padding: 20px;
                background: #f0f0f0;
            }
            
            .message {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
            }
            
            .user-message {
                align-self: flex-end;
                background: #DCF8C6;
                padding: 10px 15px;
                border-radius: 18px 18px 5px 18px;
                max-width: 80%;
                margin-left: auto;
            }
            
            .bot-message {
                align-self: flex-start;
                background: white;
                padding: 10px 15px;
                border-radius: 18px 18px 18px 5px;
                max-width: 80%;
                white-space: pre-line;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .input-container {
                padding: 20px;
                background: white;
                display: flex;
                gap: 10px;
            }
            
            .message-input {
                flex: 1;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 25px;
                outline: none;
                font-size: 16px;
            }
            
            .send-btn {
                background: #25D366;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
            }
            
            .send-btn:hover {
                background: #128C7E;
            }
            
            .quick-commands {
                display: flex;
                gap: 10px;
                padding: 10px 20px;
                background: #f8f8f8;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .quick-cmd {
                background: #e3f2fd;
                color: #1976d2;
                border: none;
                padding: 8px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .quick-cmd:hover {
                background: #bbdefb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🤖 3U1 IMS WhatsApp Bot</h2>
                <p>Employee Management System Demo</p>
            </div>
            
            <div class="quick-commands">
                <button class="quick-cmd" onclick="sendQuickMessage('hello')">Hello</button>
                <button class="quick-cmd" onclick="sendQuickMessage('report')">Report</button>
                <button class="quick-cmd" onclick="sendQuickMessage('leave')">Leave</button>
                <button class="quick-cmd" onclick="sendQuickMessage('help')">Help</button>
            </div>
            
            <div class="chat-container" id="chatContainer">
                <div class="message">
                    <div class="bot-message">
                        👋 Welcome to the 3U1 Integrated Management System WhatsApp Bot Demo!
                        
                        Try typing commands like "hello", "report", "leave", or "help" to see how the bot responds.
                        
                        Click the quick command buttons above or type your own message below.
                    </div>
                </div>
            </div>
            
            <div class="input-container">
                <input type="text" class="message-input" id="messageInput" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                <button class="send-btn" onclick="sendMessage()">Send</button>
            </div>
        </div>

        <script>
            async function sendMessage(message = null) {
                const input = document.getElementById('messageInput');
                const chatContainer = document.getElementById('chatContainer');
                
                const userMessage = message || input.value.trim();
                if (!userMessage) return;
                
                // Add user message to chat
                const userMsgDiv = document.createElement('div');
                userMsgDiv.className = 'message';
                userMsgDiv.innerHTML = `<div class="user-message">${userMessage}</div>`;
                chatContainer.appendChild(userMsgDiv);
                
                // Clear input
                input.value = '';
                
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // Send to bot and get response
                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: userMessage })
                    });
                    
                    const data = await response.json();
                    
                    // Add bot response to chat
                    const botMsgDiv = document.createElement('div');
                    botMsgDiv.className = 'message';
                    botMsgDiv.innerHTML = `<div class="bot-message">${data.response}</div>`;
                    chatContainer.appendChild(botMsgDiv);
                    
                } catch (error) {
                    const errorMsgDiv = document.createElement('div');
                    errorMsgDiv.className = 'message';
                    errorMsgDiv.innerHTML = `<div class="bot-message">❌ Error: Could not process message</div>`;
                    chatContainer.appendChild(errorMsgDiv);
                }
                
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            function sendQuickMessage(message) {
                sendMessage(message);
            }
            
            function handleKeyPress(event) {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            }
        </script>
    </body>
    </html>
    """
    return html_content

@app.post("/chat")
async def chat_endpoint(request: Request):
    """Handle chat messages from the demo interface"""
    try:
        data = await request.json()
        user_message = data.get('message', '').strip().lower()
        
        # Process message using the same logic as WhatsApp bot
        bot_response = process_user_message(user_message)
        
        return JSONResponse({
            "response": bot_response,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return JSONResponse({
            "response": "❌ Error processing your message. Please try again.",
            "error": str(e)
        }, status_code=500)

@app.get("/status")
async def status():
    """Status endpoint for monitoring"""
    return {
        "status": "running",
        "service": "WhatsApp Bot Demo Interface",
        "timestamp": datetime.now().isoformat(),
        "available_at": "http://localhost:8000"
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting WhatsApp Bot Demo Interface...")
    print("🌐 Open your browser and go to: http://localhost:8000")
    print("📱 This simulates WhatsApp conversations for demo purposes")
    uvicorn.run("whatsapp_demo:app", host="0.0.0.0", port=8000, reload=True)