import { useState } from 'react';
import { ENDPOINTS } from '../api/index.js';
export function useSuggestions() {
  const [suggestionBatches, setSuggestionBatches] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchSuggestions = async (contextText) => {
    if (!contextText || isGenerating) return;
    setIsGenerating(true);

    const apiKey = localStorage.getItem('groqApiKey');
    const livePrompt = localStorage.getItem('livePrompt') || "Analyze the transcript and provide exactly 3 useful suggestions formatted as a JSON array. Each object must have a 'type' (question, talking_point, answer, fact_check) and a 'text' preview.";

    try {
      const response = await fetch(ENDPOINTS.SUGGESTIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          transcriptContext: contextText,
          systemPrompt: livePrompt
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestionBatches(prev => [{ id: Date.now(), items: data.suggestions }, ...prev]);
      }
    } catch (error) {
      console.error("Suggestions fetch error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return { suggestionBatches, isGenerating, fetchSuggestions };
}