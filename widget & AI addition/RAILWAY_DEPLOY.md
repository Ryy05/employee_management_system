# Railway Deployment Configuration

## Environment Variables (Set in Railway Dashboard)

PORT=5000
FLASK_ENV=production
SECRET_KEY=your-production-secret-key-here
MONGODB_URI=mongodb://localhost:27017/employee_mgmt

## Deployment Commands

# Install dependencies
pip install -r requirements.txt

# Start application  
gunicorn unified_app:app --host 0.0.0.0 --port $PORT

## Railway Setup Steps:

1. Push code to GitHub
2. Go to railway.app
3. "Deploy from GitHub repo"
4. Select your repository
5. Railway automatically detects Flask app
6. Set environment variables in Railway dashboard
7. Deploy!

## Custom Domain (Optional):
- Add custom domain in Railway dashboard
- Update DNS settings as instructed
- Automatic HTTPS included