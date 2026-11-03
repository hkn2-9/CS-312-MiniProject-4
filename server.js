const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const PORT = 8000;

// postgre pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BlogDB",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  }),
);

// sends people to sign in page if they are not logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
}

app.get("/api/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post("/api/signup", async (req, res) => {
  const { user_id, password, name } = req.body;
  try {
    const existing = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id],
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User ID already exists" });
    }

    await pool.query(
      "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)",
      [user_id, password, name],
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signin", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND password = $2",
      [user_id, password],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid user ID or password" });
    }

    req.session.user = {
      user_id: result.rows[0].user_id,
      name: result.rows[0].name,
    };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

//view all posts
app.get("/api/posts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY date_created DESC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/posts/:id", requireLogin, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs WHERE blog_id = $1", [
      req.params.id,
    ]);
    const post = result.rows[0];
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.creator_user_id !== req.session.user.user_id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this post" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//create a new post
app.post("/api/posts", requireLogin, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [req.session.user.name, req.session.user.user_id, title, content],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/posts/:id", requireLogin, async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 AND creator_user_id = $4 RETURNING *",
      [title, content, req.params.id, req.session.user.user_id],
    );
    if (result.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//delete a post
app.delete("/api/posts/:id", requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2",
      [req.params.id, req.session.user.user_id],
    );
    if (result.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
