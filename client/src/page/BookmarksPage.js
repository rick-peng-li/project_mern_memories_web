import React, { useEffect, useState } from 'react';

import * as api from '../api';
import MemoryPreviewCard from '../components/MemoryPreviewCard';

const BookmarksPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const { data } = await api.fetchBookmarkedPosts();
        setPosts(data);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load bookmarks.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handleToggleBookmark = async (id) => {
    try {
      const { data } = await api.toggleBookmarkPost(id);
      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== data._id));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to update bookmark.');
    }
  };

  if (isLoading) {
    return <div className="status-card">Loading bookmarked memories...</div>;
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Bookmarks</h2>
        </div>
        <p className="panel-text">
          This page shows memories marked for quick revisit. Removing a bookmark updates the database immediately.
        </p>
      </section>

      {error ? <div className="status-card status-error">{error}</div> : null}

      {!posts.length ? (
        <div className="status-card">No bookmarked memories yet. Save items from cards or detail pages first.</div>
      ) : (
        <section className="memory-preview-grid">
          {posts.map((post) => (
            <MemoryPreviewCard key={post._id} onToggleBookmark={handleToggleBookmark} post={post} />
          ))}
        </section>
      )}
    </div>
  );
};

export default BookmarksPage;
