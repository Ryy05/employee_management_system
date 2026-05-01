# Render Deployment Configuration

## Build Command:
pip install -r requirements.txt

## Start Command:  
gunicorn unified_app:app --host 0.0.0.0 --port $PORT

## Environment Variables (Set in Render Dashboard):
- PORT=10000
- FLASK_ENV=production  
- SECRET_KEY=your-production-secret-key-here
- MONGODB_URI=your-mongodb-connection-string

## Render Setup Steps:

1. Push code to GitHub
2. Go to render.com
3. "New Web Service"
4. Connect GitHub repository
5. Configure:
   - Build Command: pip install -r requirements.txt
   - Start Command: gunicorn unified_app:app --host 0.0.0.0 --port $PORT
6. Add environment variables
7. Deploy!

## Features:
- Free tier available
- Automatic HTTPS
- Custom domains supported
- Auto-deploy on GitHub pushes