import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/checkout';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-header">
        <span>Welcome back</span>
        <h1>Sign In</h1>
      </div>
      <div className="auth-page">
        <form className="checkout-form auth-card" onSubmit={handleSubmit}>
          <p className="form-section-title">Customer login</p>
          <p className="auth-hint">You must be signed in to place an order.</p>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-danger" role="alert">{error}</p>}

          <button type="submit" className="place-order-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register" state={{ from }}>Create an account</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;
