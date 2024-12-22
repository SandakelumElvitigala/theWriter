'use client'; // This line is crucial to make the component client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();  // Now we can safely use useRouter in a client component

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Ensure it's a valid JSON object
      });

      const data = await response.json();
      if (response.ok) {
        const { nickname } = data; // Extract the nickname from the response
        router.push(`/dashboard?nickname=${encodeURIComponent(nickname)}`);
        localStorage.setItem('email', email);
        localStorage.setItem('nickname', nickname);
      } else {
        // Handle errors if any
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <>
      <body className='bg-dark'>
        <div className={styles.main}>
          <div>
            <center><h1>Login</h1></center>
            <div className="input-group mb-3 mt-3">
              <span className="input-group-text" id="basic-addon1">@</span>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">#</span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <center>
              <button className='btn btn-outline-success' onClick={handleLogin}>
                Login
              </button>
            </center>
          </div>
        </div>
      </body>
    </>
  );
}

export default Page;
