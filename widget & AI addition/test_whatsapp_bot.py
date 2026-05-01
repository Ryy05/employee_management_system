"""
Test script for the WhatsApp bot
Run this to verify your bot is responding correctly
"""

import requests
import json

# Test the health endpoint
def test_health():
    try:
        response = requests.get("http://localhost:8000/health")
        print("✅ Health Check:")
        print(json.dumps(response.json(), indent=2))
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

# Test the root endpoint
def test_root():
    try:
        response = requests.get("http://localhost:8000/")
        print("\n✅ Root Endpoint:")
        print(json.dumps(response.json(), indent=2))
        return True
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return False

# Test the webhook with sample data
def test_webhook():
    try:
        # Sample webhook data that Twilio would send
        test_data = {
            "Body": "hello",
            "From": "whatsapp:+1234567890",
            "To": "whatsapp:+0987654321"
        }
        
        response = requests.post("http://localhost:8000/whatsapp", data=test_data)
        print("\n✅ Webhook Test (hello command):")
        print("Response Content-Type:", response.headers.get('content-type'))
        print("Response Body:")
        print(response.text)
        return True
    except Exception as e:
        print(f"❌ Webhook test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing WhatsApp Bot Endpoints...\n")
    
    # Run all tests
    health_ok = test_health()
    root_ok = test_root()
    webhook_ok = test_webhook()
    
    print("\n" + "="*50)
    if all([health_ok, root_ok, webhook_ok]):
        print("🎉 All tests passed! Your WhatsApp bot is working correctly.")
        print("\n🚀 Next steps:")
        print("1. Use ngrok to expose your bot: ngrok http 8000")
        print("2. Copy the ngrok URL and add /whatsapp")
        print("3. Set this as your Twilio webhook URL")
        print("4. Test with real WhatsApp messages!")
    else:
        print("❌ Some tests failed. Check the error messages above.")
        print("Make sure your bot is running on http://localhost:8000")