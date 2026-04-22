import { RefreshCw } from 'lucide-react';

export default function SuggestionsColumn({ suggestionBatches, isGenerating, onManualRefresh, hasTranscript, onSuggestionClick }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col overflow-hidden shadow-lg h-[60vh] lg:h-full">
      <div className="shrink-0 p-3 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
        <h2 className="text-xs font-semibold tracking-wider text-gray-400">2. LIVE SUGGESTIONS</h2>
        <span className="text-xs text-gray-500 uppercase tracking-widest">{suggestionBatches.length} BATCHES</span>
      </div>
      
      <div className="shrink-0 p-4 border-b border-gray-800 flex justify-between items-center bg-[#181818]">
        <button 
          onClick={onManualRefresh}
          disabled={isGenerating || !hasTranscript}
          className={`flex items-center space-x-2 text-sm bg-[#2a2a2a] hover:bg-[#333] px-4 py-2 rounded-lg transition-colors border border-gray-700 font-medium shadow-sm ${
            (isGenerating || !hasTranscript) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw size={14} className={`text-gray-400 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating...' : 'Reload suggestions'}</span>
        </button>
        <span className="text-xs text-gray-500">auto-refresh on new chunk</span>
      </div>
      
      {/* custom-scrollbar added here */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6 bg-[#141414]">
        {suggestionBatches.length === 0 ? (
          <div className="text-center text-sm text-gray-600 mt-12">
            Suggestions appear here once recording starts and context is gathered.
          </div>
        ) : (
          suggestionBatches.map((batch, batchIndex) => (
            <div key={batch.id} className={`space-y-3 transition-opacity duration-500 ${batchIndex > 0 ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
              {batch.items.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    console.log("Card clicked!", suggestion.text);
                    if (onSuggestionClick) onSuggestionClick(suggestion.text);
                  }} 
                  className="bg-[#1c1c1c] p-4 rounded-lg border border-gray-700 hover:border-gray-500 cursor-pointer transition-all hover:bg-[#222]"
                >
                  <div className="text-xs font-semibold mb-2 uppercase tracking-wider">
                    {suggestion.type === 'question' && <span className="text-blue-400">Question</span>}
                    {suggestion.type === 'talking_point' && <span className="text-purple-400">Talking Point</span>}
                    {suggestion.type === 'answer' && <span className="text-green-400">Answer</span>}
                    {suggestion.type === 'fact_check' && <span className="text-yellow-400">Fact Check</span>}
                    {!['question', 'talking_point', 'answer', 'fact_check'].includes(suggestion.type) && <span className="text-gray-400">{suggestion.type.replace('_', ' ')}</span>}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{suggestion.text}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}