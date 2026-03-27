const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchWorkouts = async (userId = 'default-user') => {
  const response = await fetch(`${API_URL}/workouts?user_id=${userId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch workouts');
  }
  return response.json();
};

export const createWorkout = async (workoutData) => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: 'default-user',
      ...workoutData,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create workout');
  }
  return response.json();
};

export const deleteWorkout = async (id) => {
  const response = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete workout');
  }
  return response.json();
};
