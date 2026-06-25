import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as api from '../api';

const CreatorsPage = () => {
  const [creatorData, setCreatorData] = useState({ creators: [], totalCreators: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCreators = async () => {
      try {
        const { data } = await api.fetchCreatorsOverview();
        setCreatorData(data);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load creator overview.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCreators();
  }, []);

  if (isLoading) {
    return <div className="status-card">Loading creator rankings...</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Creators</h2>
        </div>
        <p className="panel-text">
          Review top contributors, compare posting activity, and jump directly to the most recent memory published by each creator.
        </p>
        <p className="panel-text">Active creators: {creatorData.totalCreators}</p>
      </section>

      <section className="summary-grid">
        {creatorData.creators.map((creator, index) => (
          <article key={creator.creator} className="summary-card">
            <div className="summary-card-head">
              <h3>
                #{index + 1} {creator.creator}
              </h3>
              <span>{creator.totalLikes} likes</span>
            </div>
            <p className="panel-text">Published memories: {creator.postCount}</p>
            <p className="panel-text">Latest memory: {creator.latestPostTitle}</p>
            <div className="memory-preview-actions">
              <Link className="button button-inline" to={`/?search=${encodeURIComponent(creator.creator)}`}>
                Search Home
              </Link>
              <Link className="button button-inline" to={`/posts/${creator.latestPostId}`}>
                Open Latest
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default CreatorsPage;
