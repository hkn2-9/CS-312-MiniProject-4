import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, user_id: userId, password })
        });
        const data = await res.json();
        if (res.ok) {
            navigate("/signin");
        } else {
            setError(data.error);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

                <label htmlFor="user_id">User ID</label>
                <input type="text" id="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <input type="submit" value="Sign Up" />
            </form>

            <p>Already have an account? <Link to="/signin" className="button">Log in here</Link></p>
        </div>
    );
}

export default SignUp;


