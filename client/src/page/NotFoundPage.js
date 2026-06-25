import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="panel detail-card">
    <div className="panel-heading">
      <h2>Page not found</h2>
    </div>
    <p className="panel-text">
        The page you requested does not exist in this Memories workspace.
    </p>
    <div className="form-actions">
      <Link className="button button-primary" to="/">
        Go Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
