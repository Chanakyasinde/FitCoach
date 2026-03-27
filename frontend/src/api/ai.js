const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Fetch a personalized motivational nudge based on user stats.
 * @param {{ streak: number, activity: string, count: number }} stats
 */
export const fetchNudge = async (stats) => {
  const response = await fetch(`${API_URL}/ai/nudge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stats),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch nudge');
  }
  return response.json(); // { message }
};

/**
 * Send a chat message and receive a coaching response.
 * @param {string} message - User's current message
 * @param {Array<{role: string, content: string}>} history - Conversation history (last 5)
 * @param {string} tone - 'friendly' | 'tough' | 'motivational'
 */
export const sendChat = async (message, history = [], tone = 'friendly') => {
  const response = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, tone }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get chat response');
  }
  return response.json(); // { reply }
};
