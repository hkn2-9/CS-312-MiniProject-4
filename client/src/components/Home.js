import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";

function Home({ user, setUser }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error));
  }, []);

  async function handleSignOut() {
    await axios.post("http://localhost:8000/api/signout", {}, { withCredentials: true });
    setUser(null);
  }

  function handlePostCreated(newPost) {
    setPosts([newPost, ...posts]);
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${id}`, { withCredentials: true });
      setPosts(posts.filter((post) => post.blog_id !== id));
    } catch(error) {
      alert(error.response?.data?.error || "Could not delete the post.");
    }
  }

  return (
    <div>
      <h1>EVIL VILLAIN LAIR </h1>

      <img src="/atomic.gif" alt="Atomic" width="300" height="200" />
      {user ? (
        <div>
          <div className="user-bar">
            <span>
              Signed in as <strong>{user.name}</strong>
            </span>
            <button className="small" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
          <BlogPostForm onPostCreated={handlePostCreated} />
        </div>
      ) : (
        <p>
          <Link to="/signin" className="button">
            Sign In
          </Link>{" "}
          or{" "}
          <Link to="/signup" className="button">
            Sign Up
          </Link>
        </p>
      )}
      <hr />
      <h2>Posts</h2>
      <PostList posts={posts} user={user} onDelete={handleDelete} />
    </div>
  );
}

export default Home;
