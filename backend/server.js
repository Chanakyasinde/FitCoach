require('dotenv').config();
const express = require('express');
const cors = require('cors');
const workoutRoutes = require('./src/routes/workouts');
const aiRoutes = require('./src/routes/ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'FitCoach API is active', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🏋️ FitCoach API running on http://localhost:${PORT}`);
});