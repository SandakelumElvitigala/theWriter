import { createClient } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;


export const supabase = createClient(supabaseUrl, supabaseKey);
