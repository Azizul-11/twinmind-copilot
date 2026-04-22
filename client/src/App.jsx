import { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, Download } from 'lucide-react';

import SettingsModal from './components/SettingsModal';
import TranscriptColumn from './components/TranscriptColumn';
import SuggestionsColumn from './components/SuggestionsColumn';
import ChatColumn from './components/ChatColumn';

import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useSuggestions } from './hooks/useSuggestions';
import { useChat } from './hooks/useChat';

import { ENDPOINTS } from './api/index.js';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  const [transcript, setTranscript] = useState([]);
  const transcriptRef = useRef([]);
  const transcriptEndRef = useRef(null);

  const { suggestionBatches, isGenerating, fetchSuggestions } = useSuggestions();
  const { chatHistory, isChatLoading, handleChatSubmit } = useChat(transcriptRef);


  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleAudioChunk = useCallback(async (audioBlob) => {
    const apiKey = localStorage.getItem('groqApiKey');
    if (!apiKey) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'chunk.webm');

    try {
      const response = await fetch(ENDPOINTS.TRANSCRIBE, {
        method: 'POST',
        headers: { 'x-api-key': apiKey },
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');
      const data = await response.json();

      if (data.text && data.text.trim().length > 0) {
        const newEntry = { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), text: data.text };

        const updatedTranscript = [...transcriptRef.current, newEntry];
        transcriptRef.current = updatedTranscript;
        setTranscript(updatedTranscript);

        const windowSize = parseInt(localStorage.getItem('suggestionContextWindow')) || 3;
        const recentContext = updatedTranscript.slice(-windowSize).map(t => t.text).join(" ");
        fetchSuggestions(recentContext);
      }
    } catch (error) {
      console.error("Transcription API Error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = () => {
    // Combine all session data
    const sessionData = {
      timestamp: new Date().toISOString(),
      transcript: transcriptRef.current,
      suggestions: suggestionBatches,
      chatHistory: chatHistory
    };

    // Create a Blob and trigger download
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinmind-session-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(handleAudioChunk);

  return (
    // STRICT BODY LOCK: h-screen and overflow-hidden guarantees the outer page NEVER scrolls
    <div className="h-screen overflow-hidden bg-[#111111] text-gray-200 flex flex-col font-sans">
      <header className="shrink-0 border-b border-gray-800 bg-[#161616] p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-wide text-white">
          TwinMind <span className="text-gray-500 font-normal">— Live Suggestions</span>
        </h1>
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <button
            onClick={handleExport}
            className="hover:text-white transition-colors flex items-center space-x-2 bg-[#2a2a2a] hover:bg-[#333] px-3 py-1.5 rounded-md border border-gray-700"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button onClick={() => setShowSettings(true)} className="hover:text-white transition-colors flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
            <Settings size={16} /><span>Settings</span>
          </button>
        </div>
      </header>

      {/* min-h-0 is the flexbox magic trick that prevents grids from bursting out of their container */}
      <main className="flex-1 min-h-0 p-4">
        {/* On mobile, they stack and scroll. On desktop, they sit side-by-side perfectly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full overflow-y-auto lg:overflow-hidden custom-scrollbar pb-10 lg:pb-0">
          <TranscriptColumn
            isRecording={isRecording}
            toggleRecording={() => isRecording ? stopRecording() : startRecording()}
            transcript={transcript}
            transcriptEndRef={transcriptEndRef}
          />

          <SuggestionsColumn
            suggestionBatches={suggestionBatches}
            isGenerating={isGenerating}
            onManualRefresh={() => {
              const windowSize = parseInt(localStorage.getItem('suggestionContextWindow')) || 3;
              fetchSuggestions(transcriptRef.current.slice(-windowSize).map(t => t.text).join(" "));
            }}
            hasTranscript={transcript.length > 0}
            onSuggestionClick={handleChatSubmit}
          />

          <ChatColumn
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onSendMessage={handleChatSubmit}
          />
        </div>
      </main>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;