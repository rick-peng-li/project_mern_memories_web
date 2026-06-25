import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getPosts } from '../actions/posts';
import Form from '../components/Form/Form';
import Posts from '../components/Posts/Posts';

const parseFilters = (searchString) => {
  const params = new URLSearchParams(searchString);

  return {
    search: params.get('search') || '',
    tag: params.get('tag') || '',
  };
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.posts);
  const [currentId, setCurrentId] = useState('');
  const filters = useMemo(() => parseFilters(location.search), [location.search]);
  const [searchText, setSearchText] = useState(filters.search);
  const [tagText, setTagText] = useState(filters.tag);

  useEffect(() => {
    setSearchText(filters.search);
    setTagText(filters.tag);
    dispatch(getPosts(filters));
  }, [dispatch, filters]);

  const stats = useMemo(() => {
    const totalLikes = items.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    const tagCount = new Set(items.reduce((allTags, post) => [...allTags, ...(post.tags || [])], [])).size;

    return [
      { label: 'Visible Memories', value: items.length },
      { label: 'Total Likes', value: totalLikes },
      { label: 'Unique Tags', value: tagCount },
    ];
  }, [items]);

  const updateRoute = (nextFilters) => {
    const params = new URLSearchParams();

    if (nextFilters.search) {
      params.set('search', nextFilters.search);
    }

    if (nextFilters.tag) {
      params.set('tag', nextFilters.tag);
    }

    const nextSearch = params.toString();

    navigate({
      pathname: '/',
      search: nextSearch ? `?${nextSearch}` : '',
    });
  };

  const handleSearch = () => {
    updateRoute({ search: searchText.trim(), tag: tagText.trim() });
    setCurrentId('');
  };

  const handleReset = () => {
    setSearchText('');
    setTagText('');
    setCurrentId('');
    navigate('/');
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Project Highlights</h2>
        </div>
        <p className="panel-text">
          Browse memories, filter by keyword or tag, open a detail page, and create or update posts from the same dashboard.
        </p>
      </section>
      <section className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <p className="stat-label">{stat.label}</p>
            <strong className="stat-value">{stat.value}</strong>
          </article>
        ))}
      </section>
      <section className="content-grid">
        <div className="content-main">
          <Posts setCurrentId={setCurrentId} />
        </div>
        <aside className="content-side">
          <section className="panel">
            <div className="panel-heading">
              <h2>Search Memories</h2>
            </div>
            <label className="field">
              <span>Keyword</span>
              <input
                onChange={(event) => setSearchText(event.target.value)}
                type="text"
                value={searchText}
              />
            </label>
            <label className="field">
              <span>Tag</span>
              <input
                onChange={(event) => setTagText(event.target.value)}
                type="text"
                value={tagText}
              />
            </label>
            <div className="form-actions">
              <button className="button button-primary" onClick={handleSearch} type="button">
                Apply Filters
              </button>
              <button className="button button-secondary" onClick={handleReset} type="button">
                Reset
              </button>
            </div>
            <p className="panel-text">
              Search matches creator, title, or message. Tag filtering is exact and case-sensitive.
            </p>
          </section>
          <div className="sticky-panel">
            <Form currentId={currentId} setCurrentId={setCurrentId} />
          </div>
        </aside>
      </section>
    </div>
  );
};

export default HomePage;
