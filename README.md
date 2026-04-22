# TwinMind Copilot — Live AI Meeting Suggestions

🎥 **[Watch the 4-Minute Demo & Architecture Breakdown on Loom](https://www.loom.com/share/6c8971bac9f345e886f9b9a0cd9c214b)** 🎥

**Live Demo:** [https://twinmindco.netlify.app](https://twinmindco.netlify.app)  
*(Note: You will need your own Groq API key to test the live demo)*

---

## 🚀 Overview

A full-stack, real-time AI copilot that listens to microphone audio, transcribes it in chunks, and generates context-aware suggestions (questions, talking points, fact-checks) during a conversation.

Built for the TwinMind Full-Stack / Prompt Engineer Assignment.

---

## 🚀 Core Features

- **Real-Time Chunked Audio Transcription:** Captures and transcribes mic audio every ~30 seconds using Groq Whisper Large V3.
- **Live AI Suggestions ("The Brain"):** Generates 3 relevant suggestion cards based on recent conversation context.
- **Deep-Dive Chat:** Click any suggestion to start a contextual chat using the full meeting history.
- **Dynamic Context Windows:** Control how many transcript chunks the AI uses for suggestions vs chat.
- **Session Export:** Export full session data (transcripts, suggestions, chat) as JSON.

---

## 🧠 Architecture & Trade-offs

### 1. Audio Capture & the "Headerless WebM" Bug

Using `MediaRecorder.start(timeslice)` caused missing WebM headers in chunks, making them invalid for the Whisper API.

**Solution:** A custom `useAudioRecorder` hook that restarts `MediaRecorder` every 30 seconds to ensure valid standalone audio files.

---

### 2. Prompt Strategy & JSON Forcing

To avoid UI-breaking outputs, I enforced strict data typing:

- **Used:**
  ```json
  { "response_format": { "type": "json_object" } }
  ```
- **Enforced strict system prompt returning:**
  ```json
  { "suggestions": [...] }
  ```
This eliminates hallucinated text and ensures reliable frontend parsing.

---

### 3. State Management & Sliding Context

- **Custom hooks:** `useSuggestions`, `useChat`
- Used `useRef` + `useState` sync to handle asynchronous audio updates safely.
- **Trade-off:** - **Suggestions** → analyzes the last 3 chunks (~90 sec) for immediate topic relevance.
  - **Chat** → analyzes the full transcript for historical depth and accuracy.

---

## 🛠️ Tech Stack

**Frontend**
* React (Vite)
* Tailwind CSS
* Lucide Icons
* Deployed on **Netlify**

**Backend**
* Node.js
* Express
* Multer (Audio buffering)
* CORS
* Deployed on **Render**

**AI (via Groq)**
* `whisper-large-v3` → real-time transcription
* `llama-3.3-70b-versatile` → suggestions & chat

---

## 💻 Local Setup

**1. Clone Repo**
```bash
git clone [https://github.com/Azizul-11/twinmind-copilot.git](https://github.com/Azizul-11/twinmind-copilot.git)
cd twinmind-copilot
```

**2. Backend Setup**
```bash
cd server
npm install
```
*Create `.env` in the server folder:*
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```
*Run server:*
```bash
npm run dev
```

**3. Frontend Setup**
```bash
cd ../client
npm install
```
*Create `.env` in the client folder:*
```env
VITE_API_URL=http://localhost:5000/api
```
*Run frontend:*
```bash
npm run dev
```

**4. Run the App**
* Open: `http://localhost:5173`
* Go to **Settings**, paste your Groq API Key.
* Click 🎤 to start recording.

---

## 📌 Notes
* Requires a valid Groq API key to function.
* Works best in Chromium-based browsers for optimal MediaRecorder support.
* Optimized for real-time interaction and low latency.
```

