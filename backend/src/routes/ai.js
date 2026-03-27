const express = require('express');
const router = express.Router();
const { getNudge, getChatResponse } = require('../services/gemini');

router.post('/nudge', async (req, res) => {
  const { streak = 0, activity = 'Gym', count = 0 } = req.body;

  try {
    const message = await getNudge({ streak, activity, count });
    res.json({ message });
  } catch (err) {
    // Logging detailed error for debugging
    console.warn(`[AI Nudge Error]: ${err.message}`);
    
    if (err.message.includes('not configured')) {
      return res.status(503).json({ error: 'AI Coach is offline (API key missing)' });
    }
    res.status(500).json({ error: 'AI Coach is busy training. Try again in a bit!' });
  }
});

router.post('/chat', async (req, res) => {
  const { message, history = [], tone = 'friendly' } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const reply = await getChatResponse({ message: message.trim(), history, tone });
    res.json({ reply });
  } catch (err) {
    // Logging detailed error for debugging
    console.warn(`[AI Chat Error]: ${err.message}`);

    if (err.message.includes('not configured')) {
      return res.status(503).json({ error: 'AI Coach is offline (API key missing)' });
    }
    res.status(500).json({ error: 'I am taking a quick break. Feel free to ask me again!' });
  }
});


module.exports = router;
