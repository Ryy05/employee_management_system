# Employee Management System - Unified Flask Application

This is a complete employee management system with integrated chatbot widget and IP tracking capabilities, all unified into a single Flask application for easy deployment.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- MongoDB (optional - uses file fallback if not available)

### Installation

1. **Clone or navigate to the directory:**
   ```bash
   cd employee-mgmt-system-main
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application:**
   ```bash
   python unified_app.py
   ```

6. **Access the application:**
   - Main application: http://localhost:5000
   - Login page: http://localhost:5000/login
   - Dashboard: http://localhost:5000/dashboard
   - Staff monitoring: http://localhost:5000/staff_dashboard

## 🔑 Default Login Credentials

For demonstration purposes, the system includes these built-in accounts:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Employee Accounts:**
- Username: `john.doe` | Password: `password123`
- Username: `jane.smith` | Password: `password456`
- Username: `bob.wilson` | Password: `password789`

## 📁 Project Structure

```
employee-mgmt-system-main/
├── unified_app.py           # Main Flask application
├── requirements.txt         # Python dependencies
├── templates/               # HTML templates
│   ├── index.html          # Landing page with chatbot
│   ├── login.html          # Authentication page
│   ├── dashboard.html      # Admin dashboard
│   └── staff_dashboard.html # Login monitoring
├── static/                 # Static files (CSS, JS, images)
├── logs/                   # Application logs
└── data/                   # Data files (created automatically)
```

## ✨ Features

### 🤖 AI-Powered Employee Chatbot
- **Instant Responses:** Real-time answers to employee queries
- **Policy Information:** HR policies, procedures, and guidelines
- **Holiday Calendar:** Company holidays and important dates
- **FAQ System:** Frequently asked questions database
- **Smart Suggestions:** Context-aware response recommendations

### 🔐 Advanced Security & Monitoring
- **IP Tracking:** Real-time IP address monitoring for all login attempts
- **Device Fingerprinting:** Browser and device information collection
- **Login Analytics:** Success/failure tracking with detailed logs
- **Security Dashboard:** Visual monitoring interface
- **Automatic Alerts:** Failed login attempt notifications

### 👥 Employee Management
- **User Authentication:** Secure JWT-based login system
- **Role-Based Access:** Admin and employee access levels
- **Profile Management:** Employee information and settings
- **Activity Tracking:** User action logging and monitoring

### 📊 Dashboard & Analytics
- **Real-time Statistics:** Live system metrics and KPIs
- **Interactive Charts:** Visual data representation
- **Export Functionality:** CSV export for reports
- **Mobile Responsive:** Works on all device sizes

## 🛠️ Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
# MongoDB Configuration (Optional)
MONGODB_URI=mongodb://localhost:27017/employee_mgmt
DATABASE_NAME=employee_mgmt

# JWT Secret (Optional - uses default if not set)
JWT_SECRET_KEY=your-secret-key-here

# Flask Configuration
FLASK_ENV=production
DEBUG=False
```

### Database Options

**Option 1: MongoDB (Recommended for production)**
- Install MongoDB locally or use MongoDB Atlas
- Set `MONGODB_URI` in your environment variables
- All data will be stored in MongoDB collections

**Option 2: File-based Storage (Default)**
- No additional setup required
- Data stored in JSON files in the `data/` directory
- Perfect for development and small deployments

## 🚀 Deployment Options

### Option 1: Local Development
```bash
python unified_app.py
```

### Option 2: Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 unified_app:app
```

### Option 3: Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "unified_app:app"]
```

### Option 4: Cloud Deployment
The application is ready to deploy on:
- **Heroku:** Add a `Procfile` with `web: gunicorn unified_app:app`
- **Railway:** Direct deployment from GitHub
- **DigitalOcean App Platform:** One-click deployment
- **AWS/GCP/Azure:** Container or serverless deployment

## 📱 API Endpoints

### Authentication
- `POST /api/login` - User authentication
- `GET /api/logout` - User logout

### Employee Management  
- `GET /api/employees` - List all employees
- `GET /api/employees/<id>` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/<id>` - Update employee
- `DELETE /api/employees/<id>` - Delete employee

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/suggestions` - Get response suggestions

### Analytics
- `GET /api/login-logs/logs` - Get login activity logs
- `GET /api/stats` - Get system statistics

## 🔧 Customization

### Adding Custom Chatbot Responses
Edit the chatbot responses in `unified_app.py`:

```python
def get_chatbot_response(message):
    # Add your custom logic here
    responses = {
        "custom_query": "Your custom response",
        # ... more responses
    }
    return responses.get(message.lower(), "Default response")
```

### Modifying UI Themes
Update the CSS in the template files:
- `templates/index.html` - Landing page styling
- `templates/login.html` - Login page styling
- `templates/dashboard.html` - Dashboard styling

### Adding New API Endpoints
Add routes in `unified_app.py`:

```python
@app.route('/api/custom-endpoint', methods=['GET', 'POST'])
@token_required
def custom_endpoint(current_user):
    # Your custom logic here
    return jsonify({"message": "Custom response"})
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in environment variables
- Application will fall back to file storage if MongoDB is unavailable

**Port Already in Use:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

**Missing Dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Static Files Not Loading:**
- Ensure the `static/` directory exists
- Check file permissions
- Verify Flask static folder configuration

### Debug Mode
Enable debug mode for development:
```bash
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows
python unified_app.py
```

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Check application logs in the `logs/` directory

---

**🎉 Congratulations!** Your unified employee management system is ready to deploy. This single Flask application combines all the functionality you need: chatbot integration, IP tracking, employee management, and security monitoring - all in one easy-to-deploy package.