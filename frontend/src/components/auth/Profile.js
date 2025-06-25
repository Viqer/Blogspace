import React, { useState, useEffect } from 'react';
import Navbar from '../forum/Navbar';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('blogspaceToken');
    try {
      const res = await fetch(`${APP_BASE}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Requested-By': 'frontend',
        },
        credentials: 'include',
        body: JSON.stringify({ username: name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      localStorage.setItem('blogspaceUser', data.username);
      setEditing(false);
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
      <main className="profile-main container">
        <div className="profile-card">
          <h2 className="profile-title">Profile</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {editing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="profile-input"
                disabled={loading}
              />
              <button onClick={handleSave} className="profile-btn" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button onClick={() => setEditing(false)} className="profile-btn" disabled={loading}>Cancel</button>
            </>
          ) : (
            <>
              <div className="profile-username">Username: {name}</div>
              <button onClick={() => setEditing(true)} className="profile-btn">Edit</button>
              <button onClick={handleLogout} className="profile-btn logout">Logout</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Profile;
