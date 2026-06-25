import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as api from '../api';

const TagsPage = () => {
  const [tagData, setTagData] = useState({ tags: [], totalTags: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const { data } = await api.fetchTagsOverview();
        setTagData(data);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load tag overview.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  if (isLoading) {
    return <div className="status-card">Loading tag overview...</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Tags Overview</h2>
        </div>
        <p className="panel-text">
          Browse all active tags, jump back to filtered memories, and open the latest post contributed to each topic.
        </p>
        <p className="panel-text">Total tags: {tagData.totalTags}</p>
      </section>

      <section className="summary-grid">
        {tagData.tags.map((tag) => (
          <article key={tag.name} className="summary-card">
            <div className="summary-card-head">
              <h3>#{tag.name}</h3>
              <span>{tag.count} posts</span>
            </div>
            <p className="panel-text">Latest memory: {tag.latestPostTitle}</p>
            <div className="memory-preview-actions">
              <Link className="button button-inline" to={`/?tag=${encodeURIComponent(tag.name)}`}>
                Filter Home
              </Link>
              <Link className="button button-inline" to={`/posts/${tag.latestPostId}`}>
                Open Latest
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default TagsPage;
