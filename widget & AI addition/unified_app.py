# Unified Employee Management System
# This single Flask app combines the backend API, chatbot, and serves the frontend

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import json
import datetime
from functools import wraps
import jwt
from pymongo import MongoClient
import logging
from jinja2 import TemplateNotFound
from dotenv import load_dotenv

# Load environment variables - try multiple locations with explicit debug
env_loaded = False
env_paths = [
    '.env',  # Root directory
    os.path.join(os.path.dirname(__file__), '.env'),  # Script directory
    'employee-mgmt-system-main/backend/.env',  # Backend folder
]

for env_path in env_paths:
    if os.path.exists(env_path):
        load_dotenv(env_path, override=True)
        print(f"✅ Loaded .env from: {os.path.abspath(env_path)}")
        env_loaded = True
        break

if not env_loaded:
    print("⚠️ WARNING: No .env file found. Using system environment variables only.")

# Verify Groq key is loaded
groq_key = os.getenv('GROQ_API_KEY')
if groq_key and groq_key != 'your_groq_api_key_here':
    print(f"✅ GROQ_API_KEY detected: {groq_key[:10]}...{groq_key[-4:]}")
else:
    print("❌ GROQ_API_KEY not loaded or invalid!")

# TEMPORARY DEBUG: Hardcode key to test
os.environ['GROQ_API_KEY'] = ''
print(f"🔑 GROQ_API_KEY manually set for testing")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure correct path resolution for templates and static files
base_dir = os.path.abspath(os.path.dirname(__file__))
template_dir = os.path.join(base_dir, 'templates')
static_dir = os.path.join(base_dir, 'static')

print(f"📂 Template folder set to: {template_dir}")
print(f"📂 Static folder set to: {static_dir}")

app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Role metadata used to drive the landing and login pages
DEFAULT_ROLE_KEY = 'ceo'
ROLE_METADATA = {
    'ceo': {
        'label': 'CEO / Executive Admin',
        'headline': 'Executive Leadership Access',
        'description': 'Monitor organization-wide performance and security signals.',
        'highlights': [
            'View company-wide KPIs and health metrics',
            'Approve transfers, leaves, and staffing changes',
            'Audit security events and login patterns'
        ],
        'demo_accounts': [
            {
                'username': 'admin',
                'password': 'admin123',
                'note': 'Full system access including analytics overview'
            }
        ]
    },
    'admin': {
        'label': 'School Administrator',
        'headline': 'School Administration Portal',
        'description': 'Manage school-level staff, attendance, and records.',
        'highlights': [
            'Onboard or update staff records with ease',
            'Track attendance and leave balances',
            'Generate compliance-ready reports instantly'
        ],
        'demo_accounts': [
            {
                'username': 'school1',
                'password': 'school123',
                'note': 'Scoped to school operations and reporting'
            }
        ]
    },
    'zeo': {
        'label': 'Zonal Education Officer',
        'headline': 'ZEO Oversight Workspace',
        'description': 'Coordinate zonal staffing, transfers, and approvals.',
        'highlights': [
            'Review inter-school transfer queues quickly',
            'Monitor staffing coverage across the zone',
            'Validate escalation requests from schools'
        ],
        'demo_accounts': [
            {
                'username': 'zeo1',
                'password': 'zeo123',
                'note': 'Regional oversight with approval privileges'
            }
        ]
    },
    'staff': {
        'label': 'Teaching Staff',
        'headline': 'Staff Self-Service Center',
        'description': 'Access personal records, leave balances, and AI assistant.',
        'highlights': [
            'Check schedules, leave balance, and announcements',
            'Chat with the AI assistant for quick help',
            'Update personal and contact information securely'
        ],
        'demo_accounts': [
            {
                'username': 'john.doe',
                'password': 'password123',
                'note': 'Demo teacher profile with dashboard access'
            },
            {
                'username': 'staff1',
                'password': 'staff123',
                'note': 'Alternate staff login for testing'
            }
        ]
    }
}

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/employee_mgmt')
try:
    # Set a short timeout (2s) so we don't wait too long if DB is down
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    # Force a connection check
    client.admin.command('ping')
    db = client.employee_mgmt
    logger.info("✅ Connected to MongoDB")
except Exception as e:
    logger.warning(f"⚠️ MongoDB connection failed: {e}")
    logger.info("📂 Using file-based storage fallback")
    db = None

# Create upload directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static/uploads', exist_ok=True)

# ==================== UTILITY FUNCTIONS ====================

def get_client_ip():
    """Get client IP address from request"""
    return request.headers.get('X-Forwarded-For', 
           request.headers.get('X-Real-IP', 
           request.remote_addr or 'unknown')).split(',')[0].strip()

def parse_user_agent(user_agent_string):
    """Parse user agent to extract device info"""
    if not user_agent_string:
        return {'device_type': 'unknown', 'browser': 'unknown', 'os': 'unknown'}
    
    ua = user_agent_string.lower()
    
    # Detect device type
    if 'mobile' in ua or 'android' in ua or 'iphone' in ua:
        device_type = 'mobile'
    elif 'tablet' in ua or 'ipad' in ua:
        device_type = 'tablet'
    else:
        device_type = 'desktop'
    
    # Detect browser
    if 'chrome' in ua and 'edge' not in ua:
        browser = 'Chrome'
    elif 'firefox' in ua:
        browser = 'Firefox'
    elif 'safari' in ua and 'chrome' not in ua:
        browser = 'Safari'
    elif 'edge' in ua:
        browser = 'Edge'
    else:
        browser = 'Unknown'
    
    # Detect OS
    if 'windows' in ua:
        os_name = 'Windows'
    elif 'mac' in ua:
        os_name = 'macOS'
    elif 'linux' in ua:
        os_name = 'Linux'
    elif 'android' in ua:
        os_name = 'Android'
    elif 'ios' in ua:
        os_name = 'iOS'
    else:
        os_name = 'Unknown'
    
    return {
        'device_type': device_type,
        'browser': browser,
        'os': os_name
    }

def require_auth(f):
    """Authentication decorator"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            # Pass current_user as a parameter to the decorated function
            return f(payload, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated

# Alias for consistency
token_required = require_auth

# ==================== AUTHENTICATION ROUTES ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Handle user login with IP tracking"""
    try:
        data = request.get_json() or {}
        username = data.get('userName')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Get user from database (for now, mock user data)
        # In production, replace this with actual database query
        mock_users = {
            'admin': {'password': 'admin123', 'role': 'CEO', 'id': '1'},
            'john.doe': {'password': 'password123', 'role': 'staff', 'id': '2'},
            'jane.smith': {'password': 'password456', 'role': 'staff', 'id': '3'},
            'bob.wilson': {'password': 'password789', 'role': 'staff', 'id': '4'},
            'zeo1': {'password': 'zeo123', 'role': 'zeo', 'id': '5'},
            'school1': {'password': 'school123', 'role': 'admin', 'id': '6'},
            'staff1': {'password': 'staff123', 'role': 'staff', 'id': '7'}
        }
        
        user = mock_users.get(username)
        if not user or user['password'] != password:
            # Log failed login
            log_login_attempt(username, False, 'Invalid credentials')
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token
        payload = {
            'userId': user['id'],
            'username': username,
            'role': user['role'],
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        # Log successful login
        log_login_attempt(username, True, 'Login successful')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'role': user['role'],
            'userId': user['id'],
            'forcePasswordChange': False
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def log_login_attempt(username, success, note=''):
    """Log login attempt to database/file"""
    try:
        user_agent = request.headers.get('User-Agent', '')
        device_info = parse_user_agent(user_agent)
        
        log_entry = {
            'username': username,
            'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'success': success,
            'client_ip': request.json.get('clientIp') if request.json else None,
            'server_ip': get_client_ip(),
            'user_agent': user_agent,
            'device_type': device_info['device_type'],
            'browser': device_info['browser'],
            'os': device_info['os'],
            'note': note
        }
        
        # Save to MongoDB if available, otherwise save to file
        saved_to_db = False
        if db is not None:
            try:
                db.login_logs.insert_one(log_entry)
                saved_to_db = True
            except Exception as e:
                logger.warning(f"⚠️ MongoDB write failed: {e}. Falling back to file.")
                saved_to_db = False
        
        if not saved_to_db:
            # Fallback to file storage
            logs_file = 'login_logs.json'
            logs = []
            if os.path.exists(logs_file):
                try:
                    with open(logs_file, 'r') as f:
                        logs = json.load(f)
                except:
                    logs = []
            
            logs.append(log_entry)
            
            # Keep only last 1000 entries
            if len(logs) > 1000:
                logs = logs[-1000:]
            
            with open(logs_file, 'w') as f:
                json.dump(logs, f, indent=2)
                
        logger.info(f"Login attempt logged: {username} - {success}")
        
    except Exception as e:
        logger.error(f"Failed to log login attempt: {e}")

# ==================== LOGIN LOGS ROUTES ====================

@app.route('/api/login-logs/logs')
@require_auth
def get_login_logs(current_user):
    """Get login logs with filtering"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        username = request.args.get('username', '')
        
        use_db = False
        if db is not None:
            try:
                # Query from MongoDB
                query = {}
                if username:
                    query['username'] = {'$regex': username, '$options': 'i'}
                
                total = db.login_logs.count_documents(query)
                logs = list(db.login_logs.find(query)
                           .sort('timestamp', -1)
                           .skip((page - 1) * limit)
                           .limit(limit))
                
                # Convert ObjectId to string for JSON serialization
                for log in logs:
                    log['_id'] = str(log['_id'])
                use_db = True
            except Exception as e:
                logger.warning(f"⚠️ MongoDB read failed: {e}. Falling back to file.")
                use_db = False
        
        if not use_db:
            # Fallback to file storage
            logs_file = 'login_logs.json'
            if os.path.exists(logs_file):
                with open(logs_file, 'r') as f:
                    all_logs = json.load(f)
            else:
                all_logs = []
            
            # Filter logs
            if username:
                all_logs = [log for log in all_logs if username.lower() in log.get('username', '').lower()]
            
            total = len(all_logs)
            start_idx = (page - 1) * limit
            end_idx = start_idx + limit
            logs = all_logs[start_idx:end_idx]
        
        return jsonify({
            'logs': logs,
            'total': total,
            'page': page,
            'totalPages': (total + limit - 1) // limit
        })
        
    except Exception as e:
        logger.error(f"Error fetching login logs: {e}")
        return jsonify({'error': 'Failed to fetch logs'}), 500

# ==================== CHATBOT ROUTES ====================

@app.route('/api/chatbot/chat', methods=['POST'])
def chatbot_chat():
    """Handle chatbot conversations with AI-powered responses"""
    try:
        data = request.get_json() or {}
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Call AI-powered chatbot response generator
        response = generate_chatbot_response_with_ai(message)
        
        return jsonify({'response': response})
        
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return jsonify({'error': 'Chatbot service unavailable'}), 500

def generate_chatbot_response_with_ai(message):
    """
    Generate chatbot response using Groq's LLM API.
    Falls back to rule-based responses if API fails or key is missing.
    """
    groq_api_key = os.getenv('GROQ_API_KEY')
    
    # DEBUG: Log the key status
    logger.info(f"🔑 GROQ_API_KEY loaded: {groq_api_key[:10] if groq_api_key else 'NONE'}...{groq_api_key[-4:] if groq_api_key and len(groq_api_key) > 14 else ''}")
    
    # If no API key is set, fall back to rule-based responses
    if not groq_api_key or groq_api_key == 'your_groq_api_key_here':
        logger.warning("GROQ_API_KEY not set, using fallback")
        return generate_chatbot_response_fallback(message)
    
    try:
        # Import Groq client (install with: pip install groq)
        from groq import Groq
        
        logger.info("📡 Calling Groq API...")
        client = Groq(api_key=groq_api_key)
        
        # System prompt that defines the chatbot's role and knowledge
        system_prompt = """You are a friendly HR assistant for an Employee Management System.

Talk like a helpful colleague. Use casual but professional language.

You help with:
- Employee records and profiles
- Transfer requests and posting management
- School/district/zone assignments
- Leave policies and applications
- System navigation and features
- HR policies, reports, and analytics

Keep answers SHORT (2-3 sentences unless asked for details).
Use bullet points ONLY if listing 3+ items.
If you don't know something, suggest they check the dashboard or contact HR.

Be warm and helpful! 😊"""

        # Call Groq API with streaming disabled for simplicity
        # UPDATED: Use llama-3.3-70b-versatile (fast, supported, free tier compatible)
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            model="llama-3.3-70b-versatile",  # ✅ Updated model (was mixtral-8x7b-32768)
            temperature=0.7,
            max_tokens=512,
            top_p=1,
        )
        
        # Extract the response
        ai_response = chat_completion.choices[0].message.content.strip()
        
        logger.info(f"✅ Groq returned: {ai_response[:100]}...")
        
        # If response is empty, use fallback
        if not ai_response:
            return generate_chatbot_response_fallback(message)
        
        return ai_response
        
    except ImportError:
        logger.error("Groq SDK not installed. Run: pip install groq")
        return generate_chatbot_response_fallback(message)
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return generate_chatbot_response_fallback(message)

def generate_chatbot_response_fallback(message):
    """
    Fallback to rule-based responses when AI is unavailable.
    This is your existing function, renamed.
    """
    message_lower = message.lower()
    
    # Employee records and search
    if 'employee' in message_lower and ('search' in message_lower or 'find' in message_lower):
        return "👥 Use the Employee Management section in the dashboard to search employees by name, school, zone, or department."
    
    # Transfer management
    if 'transfer' in message_lower:
        return "🔄 Access Transfer Management from the dashboard. Current: 12 pending, 156 approved this month."
    
    # Leave management
    if 'leave' in message_lower or 'holiday' in message_lower:
        return "📝 Leave management is available in the dashboard. Types: Sick Leave (12 days/year), Casual Leave (8 days/year), Maternity (180 days)."
    
    # System navigation and features
    if 'dashboard' in message_lower or 'feature' in message_lower or 'navigate' in message_lower or 'how to' in message_lower:
        return "🧭 System Navigation Help: Use the dashboard to access Employee Management, Analytics, Transfer Management, and Settings. Need help with a specific feature?"
    
    # Reports and analytics
    if 'report' in message_lower or 'analytics' in message_lower or 'statistics' in message_lower:
        return "📊 Reports & Analytics: View employee stats, transfer analytics, school distribution, and login analytics. Export data in CSV format."
    
    # Login and security
    if 'login' in message_lower or 'security' in message_lower or 'access' in message_lower:
        return "🔐 Security & Access: Role-based access (CEO, Admin, ZEO, Staff), IP tracking, secure JWT authentication, and login attempt monitoring."
    
    # Data management
    if 'data' in message_lower or 'database' in message_lower or 'backup' in message_lower:
        return "💾 Data Management: MongoDB with automated daily backups. CSV export available for all data. Status: Database connected and healthy."
    
    # Employee ID lookup
    if 'employee id' in message_lower or 'emp id' in message_lower:
        return "🆔 Employee ID Lookup: Provide the Employee ID (format: EMP001, EMP002, etc.) to find employee information, school assignment, transfer history, and zone/district details."
    
    # System status
    if 'status' in message_lower or 'health' in message_lower:
        return "✅ System Status: Application running smoothly, database connected, chatbot active, security features enabled."
    
    # Default response
    return f"I can help with employee records, transfers, leave policies, and system navigation. What would you like to know?"

@app.route('/api/chatbot/reset', methods=['POST'])
def chatbot_reset():
    """Reset chatbot conversation"""
    return jsonify({'status': 'success', 'message': 'Conversation reset'})

# ==================== FRONTEND ROUTES ====================

def _send_template_fallback(filename: str):
    """Serve a template directly from disk if Jinja cannot render it."""
    fallback_path = os.path.join(base_dir, filename)
    if os.path.exists(fallback_path):
        return send_from_directory(base_dir, filename)
    return jsonify({'error': f'{filename} not found'}), 404


def _resolve_role(role_key: str):
    """Return a normalized role key and its metadata, defaulting gracefully."""
    normalized = (role_key or '').lower()
    if normalized in ROLE_METADATA:
        return normalized, ROLE_METADATA[normalized]
    return DEFAULT_ROLE_KEY, ROLE_METADATA[DEFAULT_ROLE_KEY]


def _render_login(role_key: str):
    """Render the login template with role metadata context."""
    selected_key, role_info = _resolve_role(role_key)
    context = {
        'roles': ROLE_METADATA,
        'role_info': role_info,
        'role_key': selected_key
    }
    try:
        return render_template('login.html', **context)
    except TemplateNotFound:
        return _send_template_fallback('login.html')


@app.route('/')
def index():
    """Serve landing page."""
    try:
        return render_template('index.html', roles=ROLE_METADATA)
    except TemplateNotFound:
        return _send_template_fallback('index.html')


@app.route('/login')
def login_page():
    """Serve login page."""
    return _render_login(DEFAULT_ROLE_KEY)


@app.route('/login/<role_key>')
def login_page_role(role_key):
    """Serve login page for a specific role."""
    return _render_login(role_key)


@app.route('/dashboard')
def dashboard():
    """Serve admin dashboard."""
    try:
        return render_template('dashboard.html')
    except TemplateNotFound:
        return _send_template_fallback('dashboard.html')


@app.route('/staff-dashboard')
@app.route('/staff_dashboard')
def staff_dashboard():
    """Serve security logs dashboard."""
    try:
        return render_template('staff_dashboard.html')
    except TemplateNotFound:
        return _send_template_fallback('staff_dashboard.html')


@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static assets."""
    return send_from_directory(static_dir, filename)


@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    """Serve user-uploaded files."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/health')
def health_check():
    """Simple readiness probe."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'database': 'connected' if db is not None else 'file_fallback'
    })


@app.errorhandler(404)
def not_found(error):
    """JSON 404 handler."""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """JSON 500 handler."""
    return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/employees', methods=['GET'])
@token_required
def get_employees(current_user):
    """Get all employees with filtering"""
    try:
        # Mock employee data - replace with database query in production
        employees = [
            {'id': '1', 'name': 'John Doe', 'email': 'john.doe@school.edu', 'position': 'Teacher', 'department': 'Mathematics', 'school': 'Central High School', 'zone': 'Zone A', 'status': 'Active', 'joining_date': '2020-08-15', 'phone': '+1-555-0101'},
            {'id': '2', 'name': 'Jane Smith', 'email': 'jane.smith@school.edu', 'position': 'Principal', 'department': 'Administration', 'school': 'West Elementary', 'zone': 'Zone B', 'status': 'Active', 'joining_date': '2018-06-20', 'phone': '+1-555-0102'},
            {'id': '3', 'name': 'Bob Wilson', 'email': 'bob.wilson@school.edu', 'position': 'Teacher', 'department': 'Science', 'school': 'East Middle School', 'zone': 'Zone C', 'status': 'Active', 'joining_date': '2019-09-10', 'phone': '+1-555-0103'}
        ]
        
        # Apply filters if provided
        search = request.args.get('search', '').lower()
        if search:
            employees = [emp for emp in employees if search in emp['name'].lower() or search in emp['email'].lower()]
        
        return jsonify({
            'employees': employees,
            'total': len(employees),
            'page': 1,
            'limit': 50
        })
    except Exception as e:
        logger.error(f"Error fetching employees: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/summary', methods=['GET'])
@token_required
def get_analytics_summary(current_user):
    """Get analytics summary data"""
    try:
        # Mock analytics data - replace with real calculations in production
        summary = {
            'employees': {'total': 1247, 'active': 1198, 'inactive': 49, 'new_this_month': 23},
            'transfers': {'pending': 12, 'approved': 156, 'rejected': 8, 'completed': 298},
            'schools': {'total': 89, 'zones': 15, 'districts': 5},
            'login_stats': {'total_logins_today': 342, 'unique_users_today': 156, 'failed_attempts_today': 23}
        }
        return jsonify(summary)
    except Exception as e:
        logger.error(f"Error fetching analytics: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/transfers', methods=['GET'])
@token_required
def get_transfers(current_user):
    """Get transfer requests"""
    try:
        # Mock transfer data - replace with database query in production
        transfers = [
            {'id': '1', 'employee_name': 'John Doe', 'employee_id': 'EMP001', 'from_school': 'Central High School', 'to_school': 'West Elementary', 'from_zone': 'Zone A', 'to_zone': 'Zone B', 'reason': 'Personal reasons', 'status': 'Pending', 'request_date': '2025-10-20', 'priority': 'Normal'},
            {'id': '2', 'employee_name': 'Jane Smith', 'employee_id': 'EMP002', 'from_school': 'East Middle School', 'to_school': 'North High School', 'from_zone': 'Zone C', 'to_zone': 'Zone A', 'reason': 'Promotion', 'status': 'Approved', 'request_date': '2025-10-18', 'priority': 'High'}
        ]
        
        status_filter = request.args.get('status', '')
        if status_filter:
            transfers = [t for t in transfers if t['status'].lower() == status_filter.lower()]
        
        return jsonify({
            'transfers': transfers,
            'total': len(transfers)
        })
    except Exception as e:
        logger.error(f"Error fetching transfers: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/system/settings', methods=['GET'])
@token_required
def get_system_settings(current_user):
    """Get system settings"""
    try:
        settings = {
            'general': {
                'system_name': 'Employee Management System',
                'version': '2.0.0',
                'maintenance_mode': False,
                'max_login_attempts': 5,
                'session_timeout': 24
            },
            'features': {
                'chatbot_enabled': True,
                'ip_tracking_enabled': True,
                'email_notifications': True,
                'file_uploads': True,
                'analytics_enabled': True
            },
            'database': {
                'status': 'connected' if db is not None else 'file_fallback',
                'backup_enabled': True,
                'last_backup': '2025-10-23T10:30:00Z'
            }
        }
        return jsonify(settings)
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Unified Employee Management System")
    print("📊 Features: Employee Management + Chatbot + IP Tracking")
    print("🌐 Access at: http://localhost:5000")
    print("📱 Mobile-friendly interface included")
    print("")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )