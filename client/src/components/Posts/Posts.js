import React from 'react';
import { useSelector } from 'react-redux';

import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const { error, isLoading, items } = useSelector((state) => state.posts);

  if (isLoading && !items.length) {
    return <div className="status-card">Loading memories...</div>;
  }

  if (error && !items.length) {
    return <div className="status-card status-error">{error}</div>;
  }

  if (!items.length) {
    return <div className="status-card">No memories match the current filters.</div>;
  }

  return (
    <div className="posts-grid">
      {items.map((post) => (
        <Post key={post._id} post={post} setCurrentId={setCurrentId} />
      ))}
    </div>
  );
};

export default Posts;
