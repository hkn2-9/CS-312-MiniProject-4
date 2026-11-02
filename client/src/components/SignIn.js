import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function SignIn({ setUser }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
        const res = await fetch("http://localhost:8000/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user_id: userId, password })
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            navigate("/");
        } else {
            setError(data.error);
        }
        } catch (err) {
            setError("Could not reach the server. Is the backend running?");
        }
    }
    
    return (
        <div>
            <h1>Sign In</h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="user_id">User ID</label>
                <input type="text" id="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <input type="submit" value="Sign In" />
            </form>

    <p>Don't have an account?      <Link to="/signup" className="button">Sign up here</Link></p>

        </div>
    );
}

export default SignIn;