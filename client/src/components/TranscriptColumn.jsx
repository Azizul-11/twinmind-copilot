import { Mic } from 'lucide-react';

export default function TranscriptColumn({ isRecording, toggleRecording, transcript, transcriptEndRef }) {
  return (
    // Height bound perfectly to the grid cell
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 flex flex-col overflow-hidden shadow-lg h-[60vh] lg:h-full">
      <div className="shrink-0 p-3 border-b border-gray-800 flex justify-between items-center bg-[#161616]">
        <h2 className="text-xs font-semibold tracking-wider text-gray-400">1. MIC & TRANSCRIPT</h2>
        <span className="text-xs text-gray-500 uppercase tracking-widest">
            {isRecording ? <span className="text-red-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>Recording</span> : 'Idle'}
        </span>
      </div>
      
      <div className="shrink-0 p-6 border-b border-gray-800 flex items-center space-x-4">
        <button
          onClick={toggleRecording}
          className={`p-4 rounded-full shadow-lg transition-all ${
            isRecording ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
          }`}
        >
          <Mic size={24} className="text-white" />
        </button>
        <span className="text-sm text-gray-300 font-medium">
          {isRecording ? 'Recording in progress...' : 'Stopped. Click to resume.'}
        </span>
      </div>
      
      {/* custom-scrollbar added here */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#141414]">
        {transcript.length === 0 ? (
          <div className="text-sm bg-[#1c1c1c] p-4 rounded-lg border border-gray-800 text-gray-400 leading-relaxed">
            The transcript scrolls and appends new chunks every ~30 seconds while recording. Use the mic button to start/stop.
          </div>
        ) : (
          transcript.map((item, index) => (
            <div key={index} className="text-sm text-gray-300 leading-relaxed border-l-2 border-blue-500 pl-3">
              <span className="text-xs text-gray-500 block mb-1">{item.time}</span>
              {item.text}
            </div>
          ))
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
}