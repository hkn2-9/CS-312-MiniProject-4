import { Link } from "react-router-dom";

function PostList({ posts, user, onDelete }) {
  if (posts.length === 0) {
    return <p>No posts found.</p>;
  }

  return (
    <div>
      {posts.map((post) => {
        const isMine = user && user.user_id === post.creator_user_id;
        return (
          <div className="post" key={post.blog_id}>
            <h3>{post.title}</h3>
            <p>
              <em>
                {" "}
                by {post.creator_name} -{" "}
                {new Date(post.date_created).toLocaleDateString()}
              </em>
            </p>
            <p>{post.body}</p>

            {isMine && (
              <div>
                <Link to={`/posts/${post.blog_id}/edit`}>Edit</Link>
                <button onClick={() => onDelete(post.blog_id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PostList;
