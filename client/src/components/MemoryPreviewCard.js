import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80';

const MemoryPreviewCard = ({ post, onToggleBookmark }) => (
  <article className="memory-preview-card">
    <div className="memory-preview-cover">
      <img alt={post.title} src={post.selectedFile || fallbackImage} />
    </div>
    <div className="memory-preview-body">
      <p className="memory-preview-meta">
        {post.creator} · {moment(post.createdAt).fromNow()}
      </p>
      <h3>{post.title}</h3>
      <p className="memory-preview-text">{post.message}</p>
      <p className="memory-preview-tags">
        {(post.tags || []).map((tag) => `#${tag}`).join(' ')}
      </p>
      <div className="memory-preview-actions">
        <Link className="button button-inline" to={`/posts/${post._id}`}>
          Open Details
        </Link>
        {onToggleBookmark ? (
          <button className="button button-inline" onClick={() => onToggleBookmark(post._id)} type="button">
            {post.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
          </button>
        ) : null}
      </div>
    </div>
  </article>
);

export default MemoryPreviewCard;
