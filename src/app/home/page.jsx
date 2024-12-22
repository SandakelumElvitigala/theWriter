"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useRouter } from 'next/navigation';


// Initialize Supabase
const supabase = createClient(
  "https://ejjmcjkmufnwjehfasif.supabase.co", // Replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc" // Replace with your public Anon key
);

export default function Home() {
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imgUrl, setimglUrl] = useState("");
  const [postDetails, setPostDetails] = useState({ topic: "", category: "", intro: "" });
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [posts, setPosts] = useState([]); // New state to hold all fetched posts
  const [requestMessage, setRequestMessage] = useState("");

  const [value, setValue] = useState(null); // Declare state for `value`
  const [email, setEmail] = useState(null); // Declare state for `email`

  useEffect(() => {
    const storedValue = localStorage.getItem('value');
    const storedEmail = localStorage.getItem('email');

    setValue(storedValue);
    setEmail(storedEmail);

    if (storedValue === null && storedEmail === null) {
      router.push('/');
    }
  }, [router]);


  // To clear Local Storage
  useEffect(() => {
    // Clear localStorage when the user leaves the page
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const [selectedPost, setSelectedPost] = useState(null);


  
  const openReadModal = (post) => {
    console.log("Selected post:", post);
    setSelectedPost(post); // Set the clicked post data
    const modalElement = document.getElementById("read");
    const modal = new bootstrap.Modal(modalElement); // Bootstrap modal instance
    modal.show();
  };


  const handleSendRequest = async () => {
    const email = localStorage.getItem("email");
    const requestMessage = document.getElementById("exampleFormControlTextarea1").value.trim();

    // Check if email or request message is missing
    if (!email || !requestMessage) {
      alert("Please provide a valid email and message.");
      return;
    }

    try {
      // Insert request into the 'requests' table
      const { data, error } = await supabase
        .from("request")
        .insert([
          {
            requester: email,
            request: requestMessage,
            created_at: new Date().toISOString(),
          },
        ]);

      // If there's an error in the insert
      if (error) {
        console.error("Error inserting request:", error.message);
        alert("Failed to send the request. Please try again.");
      } else {
        alert("Request sent successfully!");
        // Clear the textarea after successful submission
        document.getElementById("exampleFormControlTextarea1").value = "";
      }
    } catch (err) {
      // If any other unexpected error occurs
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/insertUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('User added successfully');
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to complete the request. Please try again.');
    }
  };

  const handleLikeOrDislike = async (action) => {
    const modalTitle = document.querySelector("#read .modal-title").textContent;

    try {
      // Fetch the post by title (assuming titles are unique)
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .eq("topic", modalTitle)
        .single();

      if (fetchError) {
        console.error("Error fetching post:", fetchError);
        return;
      }

      // Determine the column to update
      const column = action === "like" ? "likes" : "dislikes";
      const newValue = post[column] + 1;

      // Update the post
      const { error: updateError } = await supabase
        .from("posts")
        .update({ [column]: newValue })
        .eq("id", post.id);

      if (updateError) {
        console.error("Error updating post:", updateError);
        return;
      }

      alert(`You ${action === "like" ? "liked" : "disliked"} this post!`);

      // Optionally, refetch posts to update the UI dynamically
      const updatedPosts = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setPosts(updatedPosts.data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };


  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*") // Ensures all columns, including 'content', are fetched
          .eq("pkg", 0)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        if (data && data.length > 0) {
          setPosts(data); // Set all fetched posts to state

          // Assuming the first post's thumbnail is Base64-encoded in the 'thumbnail' column
          const base64Image = data[0].thumbnail;
          setThumbnailUrl(`data:image/png;base64,${base64Image}`);

          const Image = data[0].image;
          setimgUrl(`data:image/png;base64,${image}`);

          console.log(data[0]);
          setPostDetails({
            topic: data[0].topic || "No topic available",
            category: data[0].category || "No category available",
            intro: data[0].intro || "No introduction available",
            author: data[0].posted_by || "Anonymous",
            text: data[0].text || "No content available",
          });

          setPkg(data[0].pkg);
        } else {
          console.warn("No posts found with 'pkg' as 0.");
        }
      } catch (err) {
        console.error("Unexpected error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const toggleIntro = () => {
    setIsIntroExpanded(!isIntroExpanded);
  };

  const truncatedIntro = postDetails.intro.length > 100 && !isIntroExpanded
    ? postDetails.intro.slice(0, 200) + "..."
    : postDetails.intro;

  return (
    <>
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
              <a
                className={`nav-link ${value == 1 ? '' : 'disabled'}`}
                aria-disabled={value == 1 ? 'false' : 'true'}
              >
                <button className={styles.requestBtn} type="button" data-bs-toggle="modal" data-bs-target="#requestModal">
                  Request a Blog
                </button>
              </a>
              {value === 1 && (
                <button className="btn btn-outline-info ms-2 ps-4 pe-4" data-bs-toggle="modal" data-bs-target="#pro">Get Premium</button>
              )}
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
          />
        </div>
      </section>


      <hr className="" />
      

      <div class="input-group ms-3 me-1" style={{ width: "250px" }}>
        <select class="form-select shadow-none" id="inputGroupSelect04" aria-label="Example select with button addon">
          <option selected>Search Category</option>
          <option value="Science">Science</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Business">Business</option>
          <option value="Agriculture">Agriculture</option>
        </select>
        <button class="btn btn-outline-secondary" type="button"data-bs-toggle="modal" data-bs-target="#staticBackdrop">Filter</button>
      </div>

      


      {/* Modal to premium*/}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Centered and responsive modal */}
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Subscribe to Premium
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center"> {/* Centered content */}
              <div className="img-container mx-auto">
                <Image
                  src="/images/poster.jpg"
                  alt="banner"
                  layout="responsive" // Responsive layout
                  width={360} // Aspect ratio width
                  height={800} // Aspect ratio height
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="content mt-5 mb-5">
        <div className="row mb-2 ms-2 me-2 card-container">
          {posts.map((post) => (
            <div className="col-md-6 mt-3 card-item" key={post.id}>
              <div className="row g-0 border rounded overflow-hidden shadow-sm h-md-250 position-relative">
                <div className="col p-4 d-flex flex-column position-static card-content">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">{post.category}</strong>
                  <h3 className="mb-0">{post.topic}</h3>
                  <div className="mb-1 text-body-secondary">{post.created_at}</div>
                  <p className="card-text mb-auto">{post.intro.slice(0, 100)}...</p>
                  <a
                    className="icon-link gap-1 icon-link-hover stretched-link card-link"
                    onClick={() => openReadModal(post)}
                  >
                    Continue reading
                  </a>
                </div>
                <div className="col-auto d-none d-lg-block" style={{ height: "100%" }}>
                  <img
                    src={`data:image/png;base64,${post.thumbnail}`} // Assuming base64 thumbnail in post
                    alt="Thumbnail"
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="modal fade" id="pro" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">User Name</label>
                  <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Pay Now</button>
            </div>
          </div>
        </div>
      </div>


      <div
        className="modal fade"
        id="read"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">{selectedPost?.topic || "Loading..."} {/* Post Title */}</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body ms-4 me-4 mt-4 mb-4"
              style={{ fontSize: "1.5rem" }}
            >
              {/* Post Content */}
              <center>
                {selectedPost?.thumbnail && (
                  <img
                    src={`data:image/png;base64,${selectedPost.image}`}
                    alt="Thumbnail"
                    className="img-fluid mt-3"
                    style={{ Width: "100%" }}
                  />
                )}
              </center>
              <p><strong>Category:</strong> {selectedPost?.category || "N/A"}</p>
              <p><strong>Created At:</strong> {selectedPost?.created_at || "N/A"}</p>
              <p>{selectedPost?.intro || "N/A"}</p>
              <p>{selectedPost?.text || "null"}</p>

              {/* Thumbnail */}
              {selectedPost?.thumbnail && (
                <center>
                  <img
                    src={`data:image/png;base64,${selectedPost.thumbnail}`}
                    alt="Thumbnail"
                    className="img-fluid mt-3"
                    style={{ maxWidth: "500px" }}
                  />
                </center>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-success me-2"
                id="like-button"
                onClick={() => handleLikeOrDislike("like")}
              >
                👍 Like
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                id="dislike-button"
                onClick={() => handleLikeOrDislike("dislike")}
              >
                👎 Dislike
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="requestModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h4>Send a blog request</h4>
            </div>

            <div className="mb-3 ms-3 me-3">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Request Message
              </label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSendRequest}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
