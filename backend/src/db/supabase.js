const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'SUPABASE_URL or SUPABASE_ANON_KEY is not set. ' +
    'Database operations will fail until these are configured in .env'
  );
}

let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
  console.warn('Supabase client could not be initialised:', err.message);
}

module.exports = supabase;

