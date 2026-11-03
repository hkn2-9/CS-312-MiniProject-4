import { useState } from "react";
import axios from "axios";

// form for new post, saves, hands to home component
function BlogPostForm({ onPostCreated }) {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);

  async function submitPost(event) {

    event.preventDefault();
    try {
        // session cookie proves whos posting
      const respond = await axios.post("http://localhost:8000/api/posts", 
        form,
        {withCredentials: true}
      );
      // server returns saved row
      onPostCreated(respond.data);
      setForm({ title: "", content: "" });
      setError(null);
    } catch (err) {
        // error message
      setError(err.response?.data?.message || "Failed to create post.");
    }
  }

  return (
    <form onSubmit={submitPost}>
      {error && <p className="error">{error}</p>}

      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      />

      <input type="submit" value="Create Post" />
    </form>
  );
}

export default BlogPostForm;
