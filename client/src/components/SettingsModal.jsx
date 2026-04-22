import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [livePrompt, setLivePrompt] = useState('');
  const [chatPrompt, setChatPrompt] = useState('');
  
  // NEW: Context Window States
  const [suggestionContext, setSuggestionContext] = useState(3);
  const [chatContext, setChatContext] = useState(0); 

  useEffect(() => {
    setApiKey(localStorage.getItem('groqApiKey') || '');
    
    const defaultLive = "Analyze the transcript and provide exactly 3 useful suggestions formatted as a JSON array. Each object must have a 'type' (question, talking_point, answer, fact_check) and a 'text' preview.";
    const defaultChat = "You are an AI meeting assistant. Answer the user's query using the provided transcript context.";
    
    setLivePrompt(localStorage.getItem('livePrompt') || defaultLive);
    setChatPrompt(localStorage.getItem('chatPrompt') || defaultChat);
    
    // Load context settings, defaulting to 3 for suggestions, and 0 (All) for chat
    setSuggestionContext(parseInt(localStorage.getItem('suggestionContextWindow')) || 3);
    setChatContext(parseInt(localStorage.getItem('chatContextWindow')) || 0);
  }, []);

  const handleSave = () => {
    localStorage.setItem('groqApiKey', apiKey);
    localStorage.setItem('livePrompt', livePrompt);
    localStorage.setItem('chatPrompt', chatPrompt);
    localStorage.setItem('suggestionContextWindow', suggestionContext);
    localStorage.setItem('chatContextWindow', chatContext);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
          <h2 className="text-lg font-semibold text-gray-200">Configuration Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Groq API Key</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="gsk_..." className="w-full bg-[#111] border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Live Suggestions System Prompt</label>
            <textarea value={livePrompt} onChange={(e) => setLivePrompt(e.target.value)} rows={3} className="w-full bg-[#111] border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none custom-scrollbar" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Detailed Answer Prompt</label>
            <textarea value={chatPrompt} onChange={(e) => setChatPrompt(e.target.value)} rows={2} className="w-full bg-[#111] border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors resize-none custom-scrollbar" />
          </div>

          {/* NEW: Context Window Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Suggestion Context Window</label>
              <input type="number" min="1" max="20" value={suggestionContext} onChange={(e) => setSuggestionContext(e.target.value)} className="w-full bg-[#111] border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors" />
              <p className="text-xs text-gray-500">Number of recent 30s chunks to analyze.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Chat Context Window</label>
              <input type="number" min="0" max="50" value={chatContext} onChange={(e) => setChatContext(e.target.value)} className="w-full bg-[#111] border border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors" />
              <p className="text-xs text-gray-500">Number of chunks to remember (0 = All).</p>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-800 bg-[#161616] flex justify-end">
          <button onClick={handleSave} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium">
            <Save size={16} /><span>Save Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}