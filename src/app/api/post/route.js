import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create the Supabase client
const supabase = createClient(
    'https://ejjmcjkmufnwjehfasif.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc'
);

export async function POST(req) {
    const { topic, intro, content, category, thumbnail, image1, loggedInUser, pkg } = await req.json();

    try {
        // Insert post into the "posts" table
        console.log('Request Body:', { topic, intro, content, category, thumbnail, image1, loggedInUser, pkg });
        const { data, error } = await supabase.from("posts").insert([{
            topic,
            intro,
            text:content,
            category,
            thumbnail,
            image: image1,
            reaches: 0,  // You can set default values for reaches, likes, dislikes
            likes: 0,
            dislikes: 0,
            posted_by: loggedInUser, // Since no authentication is required, this could be null
            created_at: new Date().toISOString(),
            pkg,
        }]);

        // Handle error in inserting post
        if (error) {
            return NextResponse.json({ message: "Error inserting post", error: error.message }, { status: 500 });
        }

        // Return success response
        return NextResponse.json({ message: "Post created successfully", data }, { status: 200 });
    } catch (error) {
        // Handle any server errors
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
