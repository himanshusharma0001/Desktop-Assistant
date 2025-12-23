import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Clock, Search, Settings, Maximize2 } from 'lucide-react';

const DesktopAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [commandHistory, setCommandHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const command = event.results[0][0].transcript;
        setTranscript(command);
        processCommand(command);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setResponse('Error: Could not recognize speech. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = async (command) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase();
    let responseText = '';

    try {
      // Time and Date
      if (lowerCommand.includes('time')) {
        const time = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        responseText = `The current time is ${time}`;
      } else if (lowerCommand.includes('date')) {
        const date = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        responseText = `Today is ${date}`;
      }
      // Web Search
      else if (lowerCommand.includes('search for') || lowerCommand.includes('search')) {
        const searchQuery = lowerCommand.replace('search for', '').replace('search', '').trim();
        if (searchQuery) {
          responseText = `Searching for ${searchQuery}`;
          window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        } else {
          responseText = 'What would you like me to search for?';
        }
      }
      // Open Applications/Websites
      else if (lowerCommand.includes('open')) {
        const appName = lowerCommand.replace('open', '').trim();
        const apps = {
          'youtube': 'https://www.youtube.com',
          'google': 'https://www.google.com',
          'gmail': 'https://mail.google.com',
          'facebook': 'https://www.facebook.com',
          'twitter': 'https://www.twitter.com',
          'github': 'https://www.github.com',
          'linkedin': 'https://www.linkedin.com',
          'reddit': 'https://www.reddit.com',
          'netflix': 'https://www.netflix.com',
          'spotify': 'https://www.spotify.com'
        };
        
        let found = false;
        for (const [key, url] of Object.entries(apps)) {
          if (appName.includes(key)) {
            responseText = `Opening ${key}`;
            window.open(url, '_blank');
            found = true;
            break;
          }
        }
        if (!found) {
          responseText = `I'm not sure how to open ${appName}`;
        }
      }
      // Calculator
      else if (lowerCommand.includes('calculate') || lowerCommand.includes('what is')) {
        const mathExpression = lowerCommand
          .replace('calculate', '')
          .replace('what is', '')
          .replace('plus', '+')
          .replace('minus', '-')
          .replace('times', '*')
          .replace('multiplied by', '*')
          .replace('divided by', '/')
          .trim();
        
        try {
          const result = eval(mathExpression.replace(/[^0-9+\-*/().]/g, ''));
          responseText = `The result is ${result}`;
        } catch {
          responseText = 'I could not calculate that expression';
        }
      }
      // Weather
      else if (lowerCommand.includes('weather')) {
        responseText = 'Opening weather information';
        window.open('https://www.weather.com', '_blank');
      }
      // Help
      else if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
        responseText = 'I can tell you the time and date, search the web, open applications like YouTube or Google, perform calculations, and much more. Just ask me!';
      }
      // Greeting
      else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
        responseText = 'Hello! How can I assist you today?';
      }
      // Default
      else {
        responseText = 'I heard you say: ' + command + '. I\'m not sure how to help with that yet. Try asking me for the time, to search something, or to open an application.';
      }

      setResponse(responseText);
      speak(responseText);
      setCommandHistory(prev => [...prev, { command, response: responseText, time: new Date() }]);
    } catch (error) {
      responseText = 'Sorry, I encountered an error processing your command.';
      setResponse(responseText);
      speak(responseText);
    }
    
    setIsProcessing(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setTranscript('');
        setResponse('');
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        setResponse('Speech recognition is not supported in your browser.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Volume2 className="w-12 h-12" />
            Desktop Assistant
          </h1>
          <p className="text-purple-200 text-lg">Your AI-Powered Voice Assistant</p>
        </div>

        {/* Time Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-2xl font-semibold">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <p className="text-purple-200">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Main Interaction Area */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6">
          {/* Microphone Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <Mic className="w-16 h-16" />
              ) : (
                <MicOff className="w-16 h-16" />
              )}
            </button>
          </div>

          {/* Status */}
          <div className="text-center mb-4">
            <p className="text-xl font-semibold">
              {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Click microphone to speak'}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-purple-800/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-300 mb-1">You said:</p>
              <p className="text-lg">{transcript}</p>
            </div>
          )}

          {/* Response */}
          {response && (
            <div className="bg-indigo-800/30 rounded-lg p-4">
              <p className="text-sm text-indigo-300 mb-1">Assistant:</p>
              <p className="text-lg">{response}</p>
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Quick Commands
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              'What time is it?',
              'What is the date?',
              'Search for AI news',
              'Open YouTube',
              'Calculate 25 times 4',
              'Open Google',
              'What\'s the weather?',
              'What can you do?'
            ].map((cmd, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(cmd);
                  processCommand(cmd);
                }}
                className="bg-purple-700/50 hover:bg-purple-600/50 rounded-lg p-3 text-sm transition-colors text-left"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Commands</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {commandHistory.slice(-5).reverse().map((item, i) => (
                <div key={i} className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-sm text-purple-300">{item.time.toLocaleTimeString()}</p>
                  <p className="font-semibold">Command: {item.command}</p>
                  <p className="text-sm text-purple-200">Response: {item.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300">
          <p className="text-sm">
            2025 | All Rights Reserved | Powered by Python • Flask • React | Voice Recognition Enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopAssistant;