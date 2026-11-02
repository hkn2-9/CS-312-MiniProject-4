import { useState } from "react";

function BlogPostForm({ onPostCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title, content })
            });
            const data = await res.json();
            if (res.ok) {
                onPostCreated(data);
                setTitle("");
                setContent("");
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error(err);
            setError("Could not reach the server. Is the backend running?");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label htmlFor="content">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />

            <input type="submit" value="Create Post" />
        </form>
    );
}

export default BlogPostForm;