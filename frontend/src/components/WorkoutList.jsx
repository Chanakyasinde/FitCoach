import React from 'react';
import { Trash2, Dumbbell, Zap, Bike, Droplets, Wind } from 'lucide-react';
import { deleteWorkout } from '../api/workouts';

const activityIcons = {
  Gym: <Dumbbell className="text-blue-500" />,
  Running: <Zap className="text-yellow-500" />,
  Cycling: <Bike className="text-orange-500" />,
  Swimming: <Droplets className="text-cyan-500" />,
  Yoga: <Wind className="text-purple-500" />,
};

const WorkoutList = ({ workouts, onWorkoutDeleted }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      try {
        await deleteWorkout(id);
        onWorkoutDeleted(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="glass-card p-10 text-center opacity-60">
        No workouts logged yet. Start training!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold px-1">Recent Sessions</h3>
      <div className="grid grid-cols-1 gap-3">
        {workouts.map((w) => (
          <div key={w.id} className="glass-card p-4 flex items-center justify-between transition-all hover:bg-white/5 group">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                {activityIcons[w.activity_type] || <Dumbbell />}
              </div>
              <div>
                <div className="font-bold text-lg">{w.activity_type}</div>
                <div className="text-sm opacity-50 flex items-center gap-3">
                  <span>{new Date(w.workout_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{w.duration} mins</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(w.id)}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;
