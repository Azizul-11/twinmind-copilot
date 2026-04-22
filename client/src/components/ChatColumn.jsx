import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatColumn({ chatHistory, isChatLoading, onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isChatLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col overflow-hidden shadow-lg h-[60vh] lg:h-full">
      <div className="shrink-0 p-3 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
        <h2 className="text-xs font-semibold tracking-wider text-gray-400">3. CHAT (DETAILED ANSWERS)</h2>
        <span className="text-xs text-gray-500 uppercase tracking-widest">SESSION-ONLY</span>
      </div>
      
      {/* custom-scrollbar added here */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#141414]">
        {(!chatHistory || chatHistory.length === 0) ? (
          <>
            <div className="text-sm bg-[#1c1c1c] p-4 rounded-lg border border-gray-800 text-gray-400 leading-relaxed">
              Clicking a suggestion adds it to this chat and streams a detailed answer. User can also type questions directly. One continuous chat per session.
            </div>
            <div className="text-center text-sm text-gray-600 mt-12">
              Click a suggestion or type a question below.
            </div>
          </>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider px-1">
                {msg.role === 'user' ? 'You' : 'TwinMind AI'}
              </span>
              <div className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-[#222] text-gray-200 border border-gray-700 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        
        {isChatLoading && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider px-1">TwinMind AI</span>
            <div className="p-3 rounded-xl bg-[#222] text-gray-400 border border-gray-700 rounded-bl-sm text-sm flex items-center space-x-2">
               <span className="animate-pulse w-2 h-2 bg-gray-500 rounded-full"></span>
               <span className="animate-pulse w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.2s' }}></span>
               <span className="animate-pulse w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="shrink-0 p-4 border-t border-gray-800 bg-[#181818]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isChatLoading}
            placeholder="Ask anything..."
            className="w-full bg-[#222] border border-gray-700 rounded-lg py-3 px-4 pr-14 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isChatLoading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-md text-white transition-colors shadow-sm"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}