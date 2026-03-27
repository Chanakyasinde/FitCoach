const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let model = null;

const initializeAI = () => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ [AI Service]: API Key missing.');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log('[AI Service]: Successfully connected to Gemini 2.5 Flash.');
  } catch (error) {
    console.error('[AI Service]: Connection failed:', error.message);
  }
};

initializeAI();

const MOCK_NUDGES = [
  "Consistency is the soul of fitness. That streak is looking legendary!",
  "Fuel that fire! Your favorite workout is the best way to start the day.",
  "Results happen when you show up. Let's make today count!"
];

const getNudge = async ({ streak, activity, count }) => {
  try {
    if (!model) throw new Error('Model Offline');

    const prompt = `Short 1-line fitness nudge for Chanakya: ${streak} day streak, ${count} sessions this week. Mention ${activity}. Max 20 words.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.warn('[AI Service]: Using defensive fallback for nudge.');
    return MOCK_NUDGES[Math.floor(Math.random() * MOCK_NUDGES.length)];
  }
};

const getChatResponse = async ({ message, history = [] }) => {
  try {
    if (!model) throw new Error('Model Offline');

    const result = await model.generateContent(message);
    return result.response.text().trim();
  } catch (error) {
    console.error('[AI Service Error]:', error.message);
    return "The AI Coach is currently recalibrating its training models. If this persists, please double-check your GEMINI_API_KEY in the backend/.env file!";
  }
};

module.exports = { getNudge, getChatResponse };