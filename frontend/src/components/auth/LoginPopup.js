import React, { useState } from 'react';
import './LoginPopup.css';

const APP_BASE = process.env.REACT_APP_BASE_URL || process.env.APP_BASE || '';

function LoginPopup({ onClose, onSuccess }) {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [step, setStep] = useState(1); // 1: login, 2: 2fa, 3: register
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${APP_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // Store token and username
      if (data.token) localStorage.setItem('blogspaceToken', data.token);
      localStorage.setItem('blogspaceUser', form.username);
      onSuccess && onSuccess(form.username);
      onClose && onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${APP_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      // Store token and username
      if (data.token) localStorage.setItem('blogspaceToken', data.token);
      localStorage.setItem('blogspaceUser', form.username);
      onSuccess && onSuccess(form.username);
      onClose && onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup login-popup-large">
        <button className="login-popup-close" onClick={onClose}>&times;</button>
        {step === 1 ? (
          <form className="login-popup-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <button type="button" className="login-popup-secondary" onClick={() => setStep(3)}>Create Account</button>
            {error && <div className="login-popup-error">{error}</div>}
          </form>
        ) : step === 3 ? (
          <form className="login-popup-form" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            <button type="button" className="login-popup-secondary" onClick={() => setStep(1)}>Back to Login</button>
            {error && <div className="login-popup-error">{error}</div>}
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default LoginPopup;
