import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder(onChunkAvailable) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsRecording(true);

      
      const recordChunk = () => {
        const options = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' } : {};
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log("🎤 30s Audio chunk fully captured!");
            onChunkAvailable(event.data);
          }
        };

        // Start the fresh recorder
        mediaRecorder.start();

        // Stop it exactly at 30 seconds to force it to package the file with valid headers
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 30000);
      };

      // 1. Fire the first chunk cycle immediately
      recordChunk();

      // 2. Repeat the cycle every 30 seconds
      intervalRef.current = setInterval(() => {
        recordChunk();
      }, 30000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required.");
    }
  }, [onChunkAvailable]);

  const stopRecording = useCallback(() => {
    // Kill the 30-second loop
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Stop the active recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Kill the microphone tracks so the red recording dot goes away
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  }, []);

  return { isRecording, startRecording, stopRecording };
}