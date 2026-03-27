import React, { useState, useEffect, useCallback } from 'react';
import { fetchNudge } from '../api/ai';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';

// Calculate stats from workouts array (same logic as StatsDashboard)
const getStats = (workouts) => {
  const count = workouts.filter(w => {
    const d = new Date(w.workout_date);
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    start.setHours(0, 0, 0, 0);
    return d >= start;
  }).length;

  const freq = workouts.reduce((m, w) => {
    m[w.activity_type] = (m[w.activity_type] || 0) + 1;
    return m;
  }, {});
  const activity = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b, 'Gym');

  const dates = [...new Set(workouts.map(w => w.workout_date))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  const yStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dates[0] === todayStr || dates[0] === yStr) {
    for (let i = 0; i < dates.length; i++) {
      streak++;
      if (!dates[i + 1]) break;
      if ((new Date(dates[i]) - new Date(dates[i + 1])) / 86400000 > 1) break;
    }
  }

  return { streak, activity, count };
};

const MotivationalNudge = ({ workouts }) => {
  const [nudge, setNudge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNudge = useCallback(async () => {
    if (workouts.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const stats = getStats(workouts);
      const data = await fetchNudge(stats);
      setNudge(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workouts]);

  useEffect(() => {
    loadNudge();
  }, [loadNudge]);

  if (workouts.length === 0) return null;

  return (
    <div 
      className="relative overflow-hidden rounded-2xl mb-8 p-6 border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-fade-in transition-all hover:scale-[1.01]"
      role="region" 
      aria-labelledby="nudge-title"
    >
      {/* Animated glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="text-yellow-400 mt-1 shrink-0" size={20} aria-hidden="true" />
          <div aria-live="polite">
            <h3 id="nudge-title" className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1.5">AI Coaching Tip</h3>
            {loading ? (
              <div className="flex items-center gap-2 opacity-50">
                <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                <span className="text-sm font-medium">Analyzing your progress...</span>
              </div>
            ) : error ? (
              <p className="text-sm text-yellow-400/80 font-medium">AI Coach is temporarily resting. Check back soon!</p>
            ) : (
              <p className="text-base font-bold leading-relaxed tracking-tight">{nudge}</p>
            )}
          </div>
        </div>

        <button
          onClick={loadNudge}
          disabled={loading}
          className="p-2.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all shrink-0 disabled:opacity-30 self-center"
          title="Refresh nudge"
          aria-label="Generate new motivational nudge"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'} />
        </button>
      </div>
    </div>
  );
};

export default MotivationalNudge;

