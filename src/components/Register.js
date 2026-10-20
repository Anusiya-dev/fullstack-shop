import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/checkout';

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/shop" replace />;
  }

  function updateField(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-header">
        <span>Join FLORA</span>
        <h1>Create Account</h1>
      </div>
      <div className="auth-page">
        <form className="checkout-form auth-card" onSubmit={handleSubmit}>
          <p className="form-section-title">Register</p>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="first_name" required value={form.first_name} onChange={updateField} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="last_name" required value={form.last_name} onChange={updateField} />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input name="username" required autoComplete="username" value={form.username} onChange={updateField} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required autoComplete="email" value={form.email} onChange={updateField} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={updateField} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input name="password_confirm" type="password" required minLength={8} autoComplete="new-password" value={form.password_confirm} onChange={updateField} />
          </div>

          {error && <p className="text-danger" role="alert">{error}</p>}

          <button type="submit" className="place-order-btn" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login" state={{ from }}>Sign in</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Register;
