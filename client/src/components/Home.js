import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogPostForm from "./BlogPostForm";
import PostList from "./PostList";

function Home({ user, setUser }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, []);

    async function handleSignOut() {
        await fetch("http://localhost:8000/api/signout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    }

    function handlePostCreated(newPost) {
        setPosts([newPost, ...posts]);
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setPosts(posts.filter((post) => post.blog_id !== id));
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>EVIL VILLAIN LAIR </h1>

            <img src="/atomic.gif" alt="Atomic" width="300" height="200"/>
            {user ? (
                <div>
                <div className="user-bar">
                    <span>Signed in as <strong>{user.name}</strong></span>
                    <button className="small" onClick={handleSignOut}>Sign Out</button>
                    </div>
                    <BlogPostForm onPostCreated={handlePostCreated} />
                </div>
            ) : (
                <p>
                    <Link to="/signin" className="button">Sign In</Link> or <Link to="/signup" className="button">Sign Up</Link>
                </p>
            )}
            <hr />
            <h2>Posts</h2>
            <PostList posts={posts} user={user} onDelete={handleDelete} />
        </div>
    );
}

export default Home;