import React, { useState, useEffect } from 'react';
import Navbar from '../forum/Navbar';
import './Profile.css';
import './ProfileSidebar.css';
import ProfileSidebar from './ProfileSidebar';
import { useNavigate } from 'react-router-dom';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function Profile() {
  const [active, setActive] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile from backend
    const token = localStorage.getItem('blogspaceToken');
    if (!token) return;
    fetch(`${APP_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-By': 'frontend',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.username) setName(data.username);
        if (data && data.email) setEmail(data.email);
      });
  }, []);

  useEffect(() => {
    // Fetch user's blogs and comments when sidebar changes
    const token = localStorage.getItem('blogspaceToken');
    if (!token) return;
    if (active === 'blogs') {
      fetch(`${APP_BASE}/blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-By': 'frontend',
        },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setBlogs(Array.isArray(data) ? data.filter(blog => blog.user && blog.user.username === name) : []);
        });
    } else if (active === 'comments') {
      fetch(`${APP_BASE}/comments/user/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Requested-By': 'frontend',
        },
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setComments(Array.isArray(data) ? data : []);
        });
    }
  }, [active, name]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('blogspaceToken');
    try {
      const body = { username: name, email };
      if (password) body.password = password;
      const res = await fetch(`${APP_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-By': 'frontend',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      localStorage.setItem('blogspaceUser', data.username);
      setEditing(false);
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('blogspaceUser');
    localStorage.removeItem('blogspaceToken');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">
        <ProfileSidebar active={active} setActive={setActive} />
        <div className="profile-content">
          {active === 'profile' && (
            <div className="profile-card">
              <h2 className="profile-section-title">Profile</h2>
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              {editing ? (
                <form className="profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  <label>Username</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="profile-input"
                    disabled={loading}
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="profile-input"
                    disabled={loading}
                  />
                  <label>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="profile-input"
                    disabled={loading}
                  />
                  <button type="submit" className="profile-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={() => { setEditing(false); setPassword(''); }} className="profile-btn" disabled={loading}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="profile-username">Username: {name}</div>
                  <div className="profile-username">Email: {email}</div>
                  <button onClick={() => setEditing(true)} className="profile-btn">Edit</button>
                  <button onClick={handleLogout} className="profile-btn logout">Logout</button>
                </>
              )}
            </div>
          )}
          {active === 'blogs' && (
            <>
              <h2 className="profile-section-title">Your Blogs</h2>
              <div className="blogsforum-list">
                {blogs.length === 0 ? <div>No blogs found.</div> : blogs.map(blog => (
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
                      <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="blogsforum-card__body">
                      <p>{blog.content?.slice(0, 200)}{blog.content && blog.content.length > 200 ? '...' : ''}</p>
                    </div>
                    <div className="blogsforum-card__footer">
                      <span>Rating: {blog.rating || 0}</span>
                      <span>Comments: {typeof blog.commentCount === 'number' ? blog.commentCount : 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {active === 'comments' && (
            <>
              <h2 className="profile-section-title">Your Comments</h2>
              <div className="profile-list blogsforum-list">
                {comments.length === 0 ? <div>No comments found.</div> : comments.map(comment => (
                  <div
                    key={comment._id}
                    className="blogsforum-card comment-card"
                    style={{ cursor: 'pointer', padding: '1.2rem 1.2rem', fontSize: '0.98rem' }}
                    onClick={() => navigate(`/blogs/${comment.blog}`)}
                  >
                    <div className="blogsforum-card__body" style={{ marginBottom: 0 }}>
                      <span style={{ fontWeight: 600 }}>{comment.content}</span>
                    </div>
                    <div className="blogsforum-card__meta" style={{ fontSize: '0.92rem', marginBottom: 0 }}>
                      <span>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
