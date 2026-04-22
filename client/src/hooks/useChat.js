import { useState } from 'react';
import { ENDPOINTS } from '../api/index.js';

export function useChat(transcriptRef) {
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  

  const handleChatSubmit = async (message) => {
    if (!message.trim() || isChatLoading) return;

    // Add user message to UI immediately
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setIsChatLoading(true);

    const apiKey = localStorage.getItem('groqApiKey');
    const chatPrompt = localStorage.getItem('chatPrompt') || "You are an AI meeting assistant. Answer the user's query using the provided transcript context.";
    const chatWindowSize = parseInt(localStorage.getItem('chatContextWindow')) || 0;
    const contextChunks = chatWindowSize > 0
      ? transcriptRef.current.slice(-chatWindowSize)
      : transcriptRef.current;
    const fullContext = contextChunks.map(t => t.text).join(" ");

    try {
     const response = await fetch(ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          message,
          transcriptContext: fullContext,
          chatHistory,
          systemPrompt: chatPrompt
        })
      });

      if (!response.ok) throw new Error('Chat failed');
      const data = await response.json();

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return { chatHistory, isChatLoading, handleChatSubmit };
}