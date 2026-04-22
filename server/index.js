import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

// 1. Dynamic CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*' 
}));

app.use(express.json()); 

app.use('/api', apiRoutes);

// 2. Dynamic Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});