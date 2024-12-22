import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ejjmcjkmufnwjehfasif.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc'
);

export async function POST(req) {
  const { email, nick_name, password, registered_by } = await req.json();

  if (!email || !nick_name || !password || !registered_by) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.from("admin").insert([
      {
        email,
        nick_name,
        password,
        registered_by,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({ message: "Admin added successfully", data }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
}
