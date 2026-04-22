import fs from 'fs';
import Groq from 'groq-sdk';

export const transcribeAudio = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: 'Groq API Key is missing.' });
    if (!req.file) return res.status(400).json({ error: 'No audio file provided.' });

    const groq = new Groq({ apiKey });
    console.log("🎤 Transcribing 30s chunk...");

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-large-v3',
      response_format: 'json',
    });

    fs.unlinkSync(req.file.path);
    res.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription Error:', error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const generateSuggestions = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { transcriptContext, systemPrompt } = req.body;

    if (!apiKey) return res.status(401).json({ error: 'Groq API Key is missing.' });
    if (!transcriptContext) return res.status(400).json({ error: 'No transcript context provided.' });

    console.log("🧠 Generating suggestions...");
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `${systemPrompt}\n\nYou MUST return a JSON object containing a single key called "suggestions". The value of "suggestions" must be an array of exactly 3 objects. Each object must have a "type" (choose one: "question", "talking_point", "answer", "fact_check") and a "text" (the preview text). Do not include any other text.` 
        },
        { 
          role: "user", 
          content: `Recent transcript context:\n"${transcriptContext}"\n\nGenerate the JSON object.` 
        }
      ],
      // FIX: Using the currently supported live Groq model!
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" }, 
    });

    const responseContent = completion.choices[0]?.message?.content || "{}";
    console.log("🤖 AI Response:", responseContent);

    const parsed = JSON.parse(responseContent);
    const suggestions = parsed.suggestions || [];

    res.json({ suggestions: suggestions.slice(0, 3) });
  } catch (error) {
    console.error('Suggestions API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// ADDED THIS SO YOU CAN FINISH DAY 4 RIGHT NOW
export const handleChat = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const { message, transcriptContext, chatHistory, systemPrompt } = req.body;

    if (!apiKey) return res.status(401).json({ error: 'Groq API Key is missing.' });
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    console.log("💬 Processing chat request...");
    const groq = new Groq({ apiKey });

    const messages = [
      { 
        role: "system", 
        content: `${systemPrompt}\n\nHere is the recent meeting transcript for context:\n"${transcriptContext}"\n\nUse this context to answer the user's question.` 
      },
      ...(chatHistory || []),
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", 
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    console.log("✅ Chat response generated.");

    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};