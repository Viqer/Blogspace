import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import './BlogsForum.css';
import Navbar from './Navbar';
import LoginPopup from '../auth/LoginPopup';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function BlogsForum() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('blogspaceUser');

  useEffect(() => {
    fetch(`${APP_BASE}/blogs`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
        return res.json();
      })
      .then(data => setBlogs(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="blogsforum-page">
      <Navbar />
      <header className="blogsforum-banner">
        <div className="blogsforum-banner__content">
          <h1 className="blogsforum-title">The Total Experience: Your Brand, Their Journey</h1>
          <p className="blogsforum-desc">
            Join us to unlock the power of the total experience where brand and customer experience converge like never before.
            Connect with visionary leaders to uncover bold strategies, cutting-edge tools, and actionable insights that elevate every customer interaction.
          </p>
          <a
            className="blogsforum-cta"
            href="#"
            onClick={e => {
              e.preventDefault();
              if (!username) {
                setShowLogin(true);
              } else {
                navigate('/blogs/create');
              }
            }}
          >
            Share Your Blog
          </a>
        </div>
      </header>

      <main className="blogsforum-main container">
        <div className="blogsforum-row">
          <div className="blogsforum-col blogsforum-col--side">
            <div className="blogsforum-side-ui">
              {/* Controls or upload form can go here */}
              <h2>Share Your Insights</h2>
              <button
                className="blogsforum-cta blogsforum-cta--side"
                onClick={() => {
                  if (!username) {
                    setShowLogin(true);
                  } else {
                    navigate('/blogs/create');
                  }
                }}
              >
                New Blog
              </button>
            </div>
          </div>
          <div className="blogsforum-col blogsforum-col--main">
            {error && <div className="error-message">Error: {error}</div>}
            <div className="blogsforum-list">
              {blogs.map(blog => (
                <div
                  className="blogsforum-card"
                  key={blog._id}
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="blogsforum-card__header">
                    <h3 className="blogsforum-card__title">{blog.title}</h3>
                  </div>
                  <div className="blogsforum-card__meta">
                    <span>By {blog.user?.username || 'Unknown'}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="blogsforum-card__body">
                    <p>{blog.content?.slice(0, 200)}{blog.content && blog.content.length > 200 ? '...' : ''}</p>
                  </div>
                  <div className="blogsforum-card__footer">

                    <span>Rating: {blog.rating || 0}</span>
                    <span>Comments: {typeof blog.commentCount === 'number' ? blog.commentCount : 'N/A'}</span>                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            navigate('/blogs/create');
          }}
        />
      )}
    </div>
  );
}

export default BlogsForum;