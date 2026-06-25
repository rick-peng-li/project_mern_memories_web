import React, { useEffect, useState } from 'react';

import * as api from '../api';
import MemoryPreviewCard from '../components/MemoryPreviewCard';

const initialState = {
  featured: [],
  recent: [],
  trending: [],
};

const DiscoverPage = () => {
  const [sections, setSections] = useState(initialState);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDiscover = async () => {
      try {
        const { data } = await api.fetchDiscoverPosts();
        setSections(data);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load discover content.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscover();
  }, []);

  if (isLoading) {
    return <div className="status-card">Loading discovery feeds...</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Discover</h2>
        </div>
        <p className="panel-text">
          Explore curated memory collections based on recency, bookmark signals, and engagement.
        </p>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Featured Stories</h2>
        </div>
        <div className="memory-preview-grid">
          {sections.featured.map((post) => (
            <MemoryPreviewCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Trending Memories</h2>
        </div>
        <div className="memory-preview-grid">
          {sections.trending.map((post) => (
            <MemoryPreviewCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Recently Added</h2>
        </div>
        <div className="memory-preview-grid">
          {sections.recent.map((post) => (
            <MemoryPreviewCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
