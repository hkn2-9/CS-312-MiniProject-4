import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import EditPost from "./components/EditPost";

// holds signed in user and decides which page to show
function App() {
  const [user, setUser] = useState(null);

  // on first load ask who is signed in, rerfesh the page and the login is saved
  useEffect(() => {
    fetch("http://localhost:8000/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  // maps component to page loading
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
