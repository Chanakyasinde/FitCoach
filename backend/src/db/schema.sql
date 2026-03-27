CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS workouts (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT          NOT NULL,
  activity_type TEXT          NOT NULL CHECK (activity_type IN ('Running', 'Yoga', 'Cycling', 'Gym', 'Swimming')), 
  duration      INTEGER       NOT NULL CHECK (duration > 0),
  workout_date  DATE          NOT NULL DEFAULT CURRENT_DATE, 
  notes         TEXT,
  created_at    TIMESTAMPTZ   DEFAULT now(),
  updated_at    TIMESTAMPTZ   DEFAULT now()
);
 
CREATE TABLE IF NOT EXISTS chat_history (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT          NOT NULL,
  role          TEXT          NOT NULL CHECK (role IN ('user', 'assistant')),
  content       TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date    ON workouts(workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_history(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON workouts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();