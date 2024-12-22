import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://ejjmcjkmufnwjehfasif.supabase.co", // Replace with your Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc" // Replace with your public Anon key
  );

const TechnologyPosts = () => {
    const [posts, setPosts] = useState([]); // To store Technology posts
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To manage error state
  
    useEffect(() => {
      // Fetch Technology posts when the component mounts
      const fetchTechnologyPosts = async () => {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('category', 'Technology');
      
          if (error) {
            console.error("Supabase error:", error);
            throw error;
          }
      
          console.log("Fetched data:", data); // Log fetched data
          setPosts(data);
        } catch (err) {
          setError("Failed to fetch Technology posts");
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };
      
  
      fetchTechnologyPosts();
    }, []);
  
    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div>
        <h1>Technology Posts</h1>
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} style={{ marginBottom: '1rem' }}>
                <h3>{post.topic}</h3>
                <p>{post.intro}</p>
              </div>
            ))
          ) : (
            <p>No Technology posts available.</p>
          )}
        </div>
      </div>
    );
  };
  
  export { TechnologyPosts };