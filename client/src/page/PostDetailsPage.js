import React, { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { bookmarkPost, clearCurrentPost, deletePost, getPost, likePost } from '../actions/posts';

const fallbackImage = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80';

const PostDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPost, error, isLoading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPost(id)).catch(() => {});

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    await dispatch(deletePost(id));
    navigate('/');
  };

  if (isLoading && !currentPost) {
    return <div className="status-card">Loading memory details...</div>;
  }

  if (!currentPost) {
    return (
      <section className="panel detail-card">
        <div className="panel-heading">
          <h2>Memory not found</h2>
        </div>
        <p className="panel-text">
          {error || 'The requested memory is unavailable.'}
        </p>
        <div className="form-actions">
          <Link className="button button-primary" to="/">
            Back Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="detail-card">
      <div className="detail-cover">
        <img alt={currentPost.title} src={currentPost.selectedFile || fallbackImage} />
      </div>
      <div className="detail-content">
        <div className="detail-main">
          <h1>{currentPost.title}</h1>
          <p className="detail-meta">
            By {currentPost.creator} · {moment(currentPost.createdAt).format('LLL')}
          </p>
          <p className="detail-message">{currentPost.message}</p>
          <div className="tag-list">
            {(currentPost.tags || []).map((tag) => (
              <span key={tag} className="tag-chip">#{tag}</span>
            ))}
          </div>
        </div>
        <aside className="detail-actions">
          <h2>Actions</h2>
          <p className="panel-text">Likes: {currentPost.likeCount}</p>
          <p className="panel-text">Bookmark: {currentPost.bookmarked ? 'Saved' : 'Not saved'}</p>
          <div className="form-actions">
            <button className="button button-primary" onClick={() => dispatch(likePost(currentPost._id))} type="button">
              Like
            </button>
            <button className="button button-secondary" onClick={() => dispatch(bookmarkPost(currentPost._id))} type="button">
              {currentPost.bookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
            </button>
            <Link className="button button-secondary" to="/">
              Back Home
            </Link>
            <button className="button button-secondary danger-text" onClick={handleDelete} type="button">
              Delete
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default PostDetailsPage;
