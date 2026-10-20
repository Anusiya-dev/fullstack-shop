// Navbar.js
// Shared navigation bar used on all 4 pages.
// In plain HTML we copied the navbar into every file.
// In React we write it ONCE as a component and
// use <Navbar /> wherever needed.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../utils/cart';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // useState for hamburger menu open/close
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect runs after the component loads
  // We read localStorage here to get cart count
  useEffect(() => {
    updateCartCount();

    // Listen for a custom event 'cartUpdated'
    // so when cart changes in Shop page, navbar updates too
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(total);
  }

  return (
    <nav>
      {/* Logo — Link from react-router-dom replaces <a href> */}
      <Link to="/" className="logo">
        <img src="/image/logo.jpeg" alt="FLORA Logo" />
      </Link>

      {/* Navigation links */}
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
        <li><a href="/#about" onClick={() => setMenuOpen(false)}>About</a></li>
        <li><a href="/#collections" onClick={() => setMenuOpen(false)}>Collections</a></li>
        <li><a href="/#why" onClick={() => setMenuOpen(false)}>Why Us</a></li>
        <li><a href="/#testimonials" onClick={() => setMenuOpen(false)}>Stories</a></li>
      </ul>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.first_name || user.username}</span>
            <button type="button" className="nav-auth-btn" onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-auth-btn">Login</Link>
            <Link to="/register" className="nav-auth-btn nav-auth-btn--primary">Register</Link>
          </>
        )}
        <Link to="/cart" className="cart-btn">
          <i className="fas fa-shopping-bag"></i>
          <span className="cart-count">{cartCount}</span>
        </Link>
      </div>

      {/* Hamburger button for mobile */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>
    </nav>
  );
}

export default Navbar;
