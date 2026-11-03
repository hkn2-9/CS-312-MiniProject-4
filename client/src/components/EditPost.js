import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await axios.get(`http://localhost:8000/api/posts/${id}`, {
          withCredentials: true,
        });
        const data = res.data;
        if (res.status === 200) {
          setTitle(data.title);
          setContent(data.body);
        } else {
          setError(data.error);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load post");
      }
      setLoading(false);
    }
    loadPost();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/posts/${id}`, 
        { title, content },
        { withCredentials: true }
      );
      const data = res.data;
      if (res.status === 200) {
        navigate("/");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update post");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Post</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>

        <button type="submit">Update Post</button>
      </form>

      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default EditPost;
