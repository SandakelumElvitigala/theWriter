// app/api/login/route.js
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
  'https://ejjmcjkmufnwjehfasif.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc'
);

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Request Body:', { email, password });

    // Fetch the user from the database
    const { data, error } = await supabase
      .from('admin')
      .select('email, password, nick_name')
      .eq('email', email)
      .single();

    console.log('Supabase Response:', { data, error });

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, data.password);
    console.log('Password Validation Result:', isPasswordValid);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        nickname: data.nick_name,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
