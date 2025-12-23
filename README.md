# Desktop Assistant

A Python/Flask and React-based desktop assistant with voice recognition capabilities.

## Features
- Voice recognition and text-to-speech
- Time and date display
- Web search functionality
- Open applications
- Calculator
- Command history

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Usage
1. Start the Flask backend (runs on http://localhost:5000)
2. Start the React frontend (runs on http://localhost:3000)
3. Click the microphone button and speak your commands
4. Allow microphone permissions when prompted

## Voice Commands
- "What time is it?"
- "What is the date?"
- "Search for [topic]"
- "Open [application]"
- "Calculate [expression]"