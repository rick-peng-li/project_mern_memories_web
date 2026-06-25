import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { bookmarkPost, deletePost, likePost } from '../../../actions/posts';

const fallbackImage = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();

  return (
    <article className="post-card">
      <div className="post-cover">
        <img alt={post.title} src={post.selectedFile || fallbackImage} />
      </div>
      <div className="post-overlay">
        <div>
          <h3>{post.creator}</h3>
          <p>{moment(post.createdAt).fromNow()}</p>
        </div>
        <button className="icon-button" onClick={() => setCurrentId(post._id)} type="button">
          Edit
        </button>
      </div>
      <div className="post-body">
        <p className="post-tags">
          {(post.tags || []).map((tag) => `#${tag}`).join(' ')}
        </p>
        <h2>{post.title}</h2>
        <p className="post-message">{post.message}</p>
        <div className="post-actions">
          <button className="button button-inline" onClick={() => dispatch(likePost(post._id))} type="button">
            Like {post.likeCount}
          </button>
          <button className="button button-inline" onClick={() => dispatch(bookmarkPost(post._id))} type="button">
            {post.bookmarked ? 'Saved' : 'Save'}
          </button>
          <Link className="button button-inline" to={`/posts/${post._id}`}>
            Details
          </Link>
          <button className="button button-inline danger-text" onClick={() => dispatch(deletePost(post._id))} type="button">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default Post;
