import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogImg from '../images/logo.svg';
import './HomePage.css';
import LoginPopup from '../auth/LoginPopup';

function Navbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('blogspaceUser');
    if (stored) setUsername(stored);
  }, []);

  const handleLoginSuccess = (user) => {
    setUsername(user);
    localStorage.setItem('blogspaceUser', user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('blogspaceUser');
    localStorage.removeItem('blogspaceToken');
    navigate('/');
  };

  return (
    <>
      <nav className="homepage-navbar">
        <div className="homepage-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={blogImg} alt="Blogspace Logo" />
          <span>Blogspace</span>
        </div>
        <div className="homepage-links">
          <a href="/blogs" style={{ cursor: 'pointer' }} onClick={e => { e.preventDefault(); navigate('/blogs'); }}>Blogs</a>
          <a href="/" style={{ cursor: 'pointer' }} onClick={e => { e.preventDefault(); navigate('/'); }}>About</a>
          {username ? (
            <>
              <a href="/profile" style={{ cursor: 'pointer' }} onClick={e => { e.preventDefault(); navigate('/profile'); }}>
                <span role="img" aria-label="profile" style={{ fontWeight: 600 }}>
                  {username}
                </span>
              </a>
            </>
          ) : (
            <a href="#login" style={{ cursor: 'pointer' }} onClick={e => { e.preventDefault(); setShowLogin(true); }}>Login</a>
          )}
        </div>
      </nav>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
    </>
  );
}

export default Navbar;

