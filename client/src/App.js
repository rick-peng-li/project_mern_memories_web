import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import BookmarksPage from './page/BookmarksPage';
import CreatorsPage from './page/CreatorsPage';
import DiscoverPage from './page/DiscoverPage';
import HomePage from './page/HomePage';
import NotFoundPage from './page/NotFoundPage';
import PostDetailsPage from './page/PostDetailsPage';
import TagsPage from './page/TagsPage';
import TimelinePage from './page/TimelinePage';

const App = () => (
  <div className="app-shell">
    <Header />
    <main className="app-main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  </div>
);

export default App;
