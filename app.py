from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import webbrowser
import subprocess
import platform

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/time', methods=['GET'])
def get_time():
    current_time = datetime.datetime.now().strftime("%H:%M:%S")
    return jsonify({'time': current_time})

@app.route('/api/date', methods=['GET'])
def get_date():
    current_date = datetime.datetime.now().strftime("%A, %B %d, %Y")
    return jsonify({'date': current_date})

@app.route('/api/search', methods=['POST'])
def search_web():
    data = request.json
    query = data.get('query', '')
    if query:
        url = f"https://www.google.com/search?q={query}"
        webbrowser.open(url)
        return jsonify({'status': 'success', 'message': f'Searching for {query}'})
    return jsonify({'status': 'error', 'message': 'No query provided'})

@app.route('/api/open-app', methods=['POST'])
def open_application():
    data = request.json
    app_name = data.get('app', '').lower()
    
    apps = {
        'notepad': 'notepad.exe',
        'calculator': 'calc.exe',
        'paint': 'mspaint.exe',
        'chrome': 'chrome.exe',
        'explorer': 'explorer.exe'
    }
    
    try:
        if platform.system() == 'Windows':
            if app_name in apps:
                subprocess.Popen(apps[app_name])
                return jsonify({'status': 'success', 'message': f'Opening {app_name}'})
        return jsonify({'status': 'error', 'message': f'Cannot open {app_name}'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    expression = data.get('expression', '')
    try:
        result = eval(expression)
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': 'Invalid expression'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)