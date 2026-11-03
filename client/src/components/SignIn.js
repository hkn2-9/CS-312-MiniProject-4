import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// sign in page, success signed in user for whole page and errors
function SignIn({ setUser }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState(null);
  const goTo = useNavigate();

  async function submitLogin(event) {
    // stop browser's default form submit
    event.preventDefault();

    try {
        //accepts session cookie the server sends back. expects id same as user_id
      const respond = await axios.post(
        "http://localhost:8000/api/signin",
        {
          user_id: form.login,
          password: form.password,
        },
        {
          withCredentials: true,
        },
      );
      setUser(respond.data.user);
      goTo("/");
    } catch (problem) {
      if (problem.response) {
        // shows an error message
        setError(problem.response.data.error);
      }
    }
  }

  return (
    <div>
      <h1>Sign In</h1>

      {error && <p className="error">{error}</p>}

      {/* form for user to enter their login and password */}
      <form onSubmit={submitLogin}>
        <label htmlFor="user_id">User ID</label>
        <input
          type="text"
          id="user_id"
          value={form.login}
          onChange={(e) => setForm({ ...form, login: e.target.value })}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <input type="submit" value="Sign In" />
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/signup" className="button">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
