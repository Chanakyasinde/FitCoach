import React from 'react';
import { Flame, Calendar, Repeat, Clock } from 'lucide-react';

const StatsDashboard = ({ workouts }) => {
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  const workoutsThisWeek = workouts.filter(w => {
    // Get local date string for the start of the current week (Sunday)
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    const startOfWeekStr = new Date(sunday.getTime() - (sunday.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    
    return w.workout_date >= startOfWeekStr;
  }).length;

  const frequencyMap = workouts.reduce((map, w) => {
    map[w.activity_type] = (map[w.activity_type] || 0) + 1;
    return map;
  }, {});
  
  const mostFrequent = Object.keys(frequencyMap).reduce((a, b) => 
    frequencyMap[a] > frequencyMap[b] ? a : b
  , 'None');

  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    // Get unique local date strings, sorted descending
    const dates = [...new Set(workouts.map(w => w.workout_date))].sort((a, b) => b.localeCompare(a));
    
    const now = new Date();
    const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);

    // Find the starting point: either today, yesterday, or if we have future dates, the first one <= today
    let startIndex = dates.findIndex(d => d <= todayStr);
    
    if (startIndex === -1) {
        // All workouts are in the future? Check if the earliest one is today or yesterday
        // Actually, if we have workouts in the future, we might want to count them towards the streak if they connect to today.
        // Let's just catch the case where the most recent "real" workout was today or yesterday.
        if (dates[dates.length - 1] > todayStr) return 0; // Everything in the future
        startIndex = 0;
    }

    // Check if the streak is "alive" (workouts today or yesterday)
    const mostRecent = dates[0];
    if (mostRecent < yesterdayStr) return 0;

    let streak = 0;
    let currentCheckDate = new Date(mostRecent);

    for (let i = 0; i < dates.length; i++) {
        if (dates[i] === currentCheckDate.toISOString().slice(0, 10)) {
            streak++;
            currentCheckDate.setDate(currentCheckDate.getDate() - 1);
        } else if (dates[i] < currentCheckDate.toISOString().slice(0, 10)) {
            // Gap found
            break;
        }
        // If dates[i] > currentCheckDate, it's a future date relative to where we are, just skip/continue
    }
    
    return streak;
  };

  const streak = calculateStreak();

  const metrics = [
    { label: 'Current Streak', value: `${streak} Days`, icon: <Flame className="text-orange-500" /> },
    { label: 'This Week', value: `${workoutsThisWeek} Workouts`, icon: <Calendar className="text-blue-500" /> },
    { label: 'Favorite', value: mostFrequent, icon: <Repeat className="text-purple-500" /> },
    { label: 'Total Energy', value: `${totalMinutes} Min`, icon: <Clock className="text-green-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="region" aria-label="Workout Statistics">
      {metrics.map((m) => (
        <div key={m.label} className="glass-card p-5 transition-all hover:scale-[1.02] hover:bg-white/5 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">{m.icon}</div>
            <span className="text-xs font-semibold opacity-60 uppercase tracking-widest">{m.label}</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">{m.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsDashboard;

