import React, { useState, useEffect } from 'react';
import { fetchWorkouts } from './api/workouts';
import WorkoutForm from './components/WorkoutForm';
import StatsDashboard from './components/StatsDashboard';
import WorkoutList from './components/WorkoutList';
import MotivationalNudge from './components/MotivationalNudge';
import AiChatbot from './components/AiChatbot';
import { Activity, ShieldCheck, Loader2 } from 'lucide-react';
import './index.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to connect to service');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutAdded = (newWorkout) => {
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleWorkoutDeleted = (id) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Activity className="text-white" size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter flex items-center gap-1.5">
                FitCoach <span className="text-blue-500 font-medium italic">AI</span>
              </h1>
              <p className="hidden xs:block text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Performance Hub</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold opacity-50" aria-label="Main Navigation">
            <a href="#" className="hover:text-white transition-all hover:opacity-100">Dashboard</a>
            <a href="#" className="hover:text-white transition-all hover:opacity-100">Sessions</a>
            <a href="#" className="hover:text-white transition-all hover:opacity-100">Missions</a>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3.5 rounded-full border border-white/5 select-none">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
              <span className="text-[10px] tracking-widest uppercase">Live</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <StatsDashboard workouts={workouts} />

        {/* AI Motivational Nudge */}
        <MotivationalNudge workouts={workouts} />

        <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 opacity-30 gap-4" aria-busy="true">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="font-bold tracking-widest text-xs uppercase">Syncing your progress...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center border-red-500/20 bg-red-500/5 max-w-2xl mx-auto" role="alert">
            <ShieldCheck className="mx-auto text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" size={48} />
            <h3 className="text-2xl font-black text-red-400 mb-3 tracking-tight">Database Disconnected</h3>
            <p className="opacity-60 font-medium leading-relaxed mb-8">
              We're unable to reach your fitness data. Please ensure your database is online and your API keys are configured.
            </p>
            <code className="bg-red-950/40 px-4 py-2 rounded-lg text-sm text-red-200 border border-red-500/20">{error}</code>
          </div>
        ) : (
          <WorkoutList workouts={workouts} onWorkoutDeleted={handleWorkoutDeleted} />
        )}
      </main>

      {/* Floating AI Chatbot */}
      <AiChatbot />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-12 border-t border-white/5 text-center">
        <p className="text-xs font-bold opacity-20 uppercase tracking-[0.3em]">&copy; 2026 FitCoach AI &bull; Premium Coaching System</p>
      </footer>
    </div>
  );
}

export default App;
