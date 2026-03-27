const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');

const VALID_ACTIVITIES = ['Running', 'Yoga', 'Cycling', 'Gym', 'Swimming'];

const dbGuard = (req, res) => {
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env' });
    return true;
  }
  return false;
};

router.get('/', async (req, res) => {
  if (dbGuard(req, res)) return;
  const { user_id } = req.query;

  let query = supabase
    .from('workouts')
    .select('*')
    .order('workout_date', { ascending: false });

  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  if (dbGuard(req, res)) return;
  const { id } = req.params;
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Workout not found' });
  res.json(data);
});

router.post('/', async (req, res) => {
  if (dbGuard(req, res)) return;
  const { user_id, activity_type, duration, workout_date, notes } = req.body;

  if (!user_id)       return res.status(400).json({ error: 'user_id is required' });
  if (!activity_type) return res.status(400).json({ error: 'activity_type is required' });
  
  if (!VALID_ACTIVITIES.includes(activity_type)) {
    return res.status(400).json({ error: `Invalid activity_type. Must be one of: ${VALID_ACTIVITIES.join(', ')}` });
  }

  if (!duration || duration <= 0) {
    return res.status(400).json({ error: 'duration must be a positive number' });
  }

  const { data, error } = await supabase
    .from('workouts')
    .insert([{ 
      user_id, 
      activity_type, 
      duration, 
      workout_date: workout_date || new Date().toISOString().slice(0, 10), 
      notes 
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.put('/:id', async (req, res) => {
  if (dbGuard(req, res)) return;
  const { id } = req.params;
  const { activity_type, duration, workout_date, notes } = req.body;

  if (activity_type && !VALID_ACTIVITIES.includes(activity_type)) {
    return res.status(400).json({ error: `Invalid activity_type. Must be one of: ${VALID_ACTIVITIES.join(', ')}` });
  }

  const updates = {};
  if (activity_type !== undefined) updates.activity_type = activity_type;
  if (duration      !== undefined) updates.duration      = duration;
  if (workout_date  !== undefined) updates.workout_date  = workout_date;
  if (notes         !== undefined) updates.notes         = notes;

  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/:id', async (req, res) => {
  if (dbGuard(req, res)) return;
  const { id } = req.params;
  const { error } = await supabase.from('workouts').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Workout deleted successfully' });
});

module.exports = router;

