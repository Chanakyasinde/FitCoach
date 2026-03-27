import React, { useState } from 'react';
import { createWorkout } from '../api/workouts';
import { PlusCircle, Clock, Calendar, Activity, Loader2 } from 'lucide-react';

const WorkoutForm = ({ onWorkoutAdded }) => {
  const [formData, setFormData] = useState({
    activity_type: 'Gym',
    duration: '',
    workout_date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newWorkout = await createWorkout({
        ...formData,
        duration: parseInt(formData.duration),
      });
      onWorkoutAdded(newWorkout);
      setFormData({
        ...formData,
        duration: '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 mb-8" role="region" aria-labelledby="form-title">
      <h2 id="form-title" className="text-xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-500" aria-hidden="true" /> Log Workout
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div className="space-y-2">
          <label htmlFor="activity_type" className="text-sm font-medium opacity-70 flex items-center gap-1">
            <Activity size={14} aria-hidden="true" /> Activity
          </label>
          <select
            id="activity_type"
            value={formData.activity_type}
            onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            aria-label="Select activity type"
          >
            {['Running', 'Yoga', 'Cycling', 'Gym', 'Swimming'].map((opt) => (
              <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="text-sm font-medium opacity-70 flex items-center gap-1">
            <Clock size={14} aria-hidden="true" /> Duration (mins)
          </label>
          <input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="Min"
            required
            min="1"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Enter duration in minutes"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="workout_date" className="text-sm font-medium opacity-70 flex items-center gap-1">
            <Calendar size={14} aria-hidden="true" /> Date
          </label>
          <input
            id="workout_date"
            type="date"
            value={formData.workout_date}
            onChange={(e) => setFormData({ ...formData, workout_date: e.target.value })}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Select workout date"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-95"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} aria-hidden="true" />
              <span>Logging...</span>
            </>
          ) : (
            <>
              <PlusCircle className="group-hover:scale-110 transition-transform" size={20} aria-hidden="true" />
              <span>Log Workout</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-red-400 mt-4 text-sm font-medium bg-red-400/10 p-3 rounded-lg flex items-center gap-2" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default WorkoutForm;

