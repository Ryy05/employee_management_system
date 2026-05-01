from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os, datetime

LOG_FILE = 'login_logs.json'

def load_logs():
    if not os.path.exists(LOG_FILE):
        return []
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        # If file is corrupted, rename it and start fresh to avoid crashes
        try:
            os.rename(LOG_FILE, LOG_FILE + '.bad')
        except Exception:
            pass
        return []

def save_logs(logs):
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(logs, f, ensure_ascii=False, indent=2)

app = Flask(__name__)
CORS(app)  # allow requests from your frontend during demo

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    # Server-observed IP (preferred): check common headers first
    server_ip = request.headers.get('X-Forwarded-For') or request.headers.get('X-Real-IP') or request.remote_addr or 'unknown'
    if isinstance(server_ip, str) and ',' in server_ip:
        server_ip = server_ip.split(',')[0].strip()
    entry = {
        'username': data.get('username'),
        'timestamp': data.get('timestamp') or datetime.datetime.datetime.utcnow().isoformat(),
        'client_provided_ip': data.get('ip'),
        'server_observed_ip': server_ip,
        'userAgent': data.get('userAgent') or request.headers.get('User-Agent'),
        'note': 'stored_on_server'
    }
    logs = load_logs()
    logs.append(entry)
    save_logs(logs)
    return jsonify({'status': 'ok', 'saved': entry}), 201

@app.route('/api/logs', methods=['GET'])
def get_logs():
    logs = load_logs()
    return jsonify(logs), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status':'ok'}), 200

if __name__ == '__main__':
    # Run on all interfaces so you can access from other devices if needed (demo)
    app.run(host='0.0.0.0', port=5000, debug=True)
