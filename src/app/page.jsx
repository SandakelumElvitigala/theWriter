'use client'; // This line is crucial to make the component client-side

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for navigation
import styles from './page.module.css';
import Image from "next/image";
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// Initialize Supabase client
const supabase = createClient(
    'https://ejjmcjkmufnwjehfasif.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc'
);

function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();  // Initialize router for navigation

    const handleLogin = async () => {

        

        // Check if both email and password are provided
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            // Query Supabase to check if the user exists
            const { data, error } = await supabase
                .from('users')
                .select('email, password') // Select only email and password fields
                .eq('email', email); // Check if email matches

            if (error) {
                console.error('Error checking credentials:', error);
                alert('An error occurred. Please try again.');
                return;
            }

            // If user exists, compare hashed password with the entered password
            if (data.length > 0) {
                const user = data[0]; // Assuming only one user per email
                const isPasswordMatch = await bcrypt.compare(password, user.password); // Compare entered password with hashed password

                if (isPasswordMatch) {
                    // If passwords match, redirect to /home page with value 1 as query param
                    localStorage.setItem('value', '1');
                    localStorage.setItem('email', email);
                    router.push('/home');
                } else {
                    // Handle invalid password
                    alert('Invalid password.');
                }
            } else {
                // Handle user not found
                alert('Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }


    };

    return (
        <>
            <body className='bg-dark'>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            The Writer
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup"
                            aria-controls="navbarNavAltMarkup"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div className="navbar-nav">
                                <a className="nav-link active" aria-current="page" href="#">
                                    Home
                                </a>
                                <a className="nav-link" href="#">
                                    Features
                                </a>
                                <a className="nav-link disabled" aria-disabled="true">
                                    Request
                                </a>

                                <button className="btn btn-outline-info ms-2 ps-4 pe-4" data-bs-toggle="modal" data-bs-target="#pro">Get Premium</button>

                            </div>
                        </div>
                    </div>
                </nav>
                <section>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/images/banner.jpg"
                            alt="banner"
                            layout="fill"
                            objectFit="cover"
                            style={{ zIndex: "-2" }}
                        />
                    </div>
                </section>
                <div className={styles.main}>
                    <div>
                        <center><h1>Login To Your Premium Account</h1></center>
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
                            <button className='btn btn-success' onClick={handleLogin}>
                                Login
                            </button>
                        </center>
                        <center>
                            <h1 className='mt-3'> OR</h1>
                        </center>
                        <center>
                            <Link href="/home"><button className='btn btn-secondary'>
                                Visit as a Basic User
                            </button></Link>
                        </center>
                    </div>
                </div>
            </body>
        </>
    );
}

export default Page;
