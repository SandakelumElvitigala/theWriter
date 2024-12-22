import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  'https://ejjmcjkmufnwjehfasif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc'
);

export async function POST(req) {
  const { username, email, password } = await req.json();

  // Validation checks
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
  }

  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'Password must be at least 8 characters long' }), { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase.from('users').insert([
      {
        email,
        user_name: username,
        password: hashedPassword,
        package: 'Premium',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Unable to register user. Please try again.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'User added successfully', data }), { status: 200 });

  } catch (error) {
    console.error('Error inserting data:', error.message);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 500 });
  }
}
