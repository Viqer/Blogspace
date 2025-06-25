import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../forum/Navbar';
import './BlogDetail.css';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem('blogspaceUser');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('You must be logged in to create a blog.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('blogspaceToken');
      const res = await fetch(`${APP_BASE}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ title, content, user: username }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create blog');
      navigate('/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="blog-detail-container">
        <h2>Create a New Blog</h2>
        <form className="blog-detail-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={10}
            required
          />
          <button type="submit" disabled={loading}>{loading ? 'Sharing...' : 'Share Blog'}</button>
          {error && <div className="blog-detail-error">{error}</div>}
        </form>
      </div>
    </>
  );
}

export default CreateBlog;
