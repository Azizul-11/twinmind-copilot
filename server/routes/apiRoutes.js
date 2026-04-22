import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// Imported handleChat here
import { transcribeAudio, generateSuggestions, handleChat } from '../controllers/aiController.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}.webm`); 
  }
});
const upload = multer({ storage });

router.post('/transcribe', upload.single('audio'), transcribeAudio);
router.post('/suggestions', generateSuggestions);
// Added the chat route here
router.post('/chat', handleChat);

export default router;