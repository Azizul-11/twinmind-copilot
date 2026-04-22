export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  TRANSCRIBE: `${API_BASE_URL}/transcribe`,
  SUGGESTIONS: `${API_BASE_URL}/suggestions`,
  CHAT: `${API_BASE_URL}/chat`,
};