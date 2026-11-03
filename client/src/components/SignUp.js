import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// sign up, user, name, pass
function SignUp() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
        // checks user ID isnt taken
    await axios.post("http://localhost:8000/api/signup", 
      { name, user_id: userId, password },
      { withCredentials: true }
    );
    // send user to sign in after success
    navigate("/signin");
    } catch (problem) {
        // show error reason
      setError("Failed to sign up");
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>

      {error && <p className="error">{error}</p>}

      {/* form for user to enter their name, user ID, and password */}  
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="user_id">User ID</label>
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input type="submit" value="Sign Up" />
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/signin" className="button">
          Log in here
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
