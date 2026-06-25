import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import * as api from '../api';

const TimelinePage = () => {
  const [timelineData, setTimelineData] = useState({ groups: [], totalGroups: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const { data } = await api.fetchTimelineOverview();
        setTimelineData(data);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load timeline data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeline();
  }, []);

  if (isLoading) {
    return <div className="status-card">Loading publishing timeline...</div>;
  }

  if (error) {
    return <div className="status-card status-error">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Timeline</h2>
        </div>
        <p className="panel-text">
          Review content activity by month, including the number of memories, likes accumulated, and sample posts in each period.
        </p>
        <p className="panel-text">Timeline groups: {timelineData.totalGroups}</p>
      </section>

      <section className="timeline-list">
        {timelineData.groups.map((group) => (
          <article key={group.key} className="timeline-card">
            <div className="summary-card-head">
              <h3>{group.label}</h3>
              <span>{group.count} memories</span>
            </div>
            <p className="panel-text">Combined likes: {group.totalLikes}</p>
            <div className="timeline-post-list">
              {group.posts.map((post) => (
                <Link key={post._id} className="timeline-post-item" to={`/posts/${post._id}`}>
                  <strong>{post.title}</strong>
                  <span>
                    {post.creator} · {post.likeCount} likes
                  </span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default TimelinePage;
