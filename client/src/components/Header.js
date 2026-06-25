import React from 'react';
import { NavLink } from 'react-router-dom';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'Bookmarks', to: '/bookmarks' },
  { label: 'Tags', to: '/tags' },
  { label: 'Creators', to: '/creators' },
  { label: 'Timeline', to: '/timeline' },
];

const Header = () => (
  <header className="site-header">
    <div>
      <NavLink className="site-brand" to="/">
        Memories
      </NavLink>
      <p className="site-subtitle">
        Explore stories, curated highlights, bookmarks, creator rankings, and timeline views in one workspace.
      </p>
    </div>
    <nav className="site-nav">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </header>
);

export default Header;
