// Cart.js
// Same content as cart.html — converted to React.
//
// Key difference from HTML:
// In HTML, renderCart() built HTML strings manually.
// In React, we use useState to store the cart array,
// and JSX renders it automatically when state changes.
// No innerHTML manipulation needed!

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { getCart, saveCart } from '../utils/cart';

function Cart() {
  // useState stores the cart array from localStorage
  // When cart changes (add/remove/qty), React re-renders automatically
  const [cart, setCart] = useState([]);
  const skipSave = useRef(true);

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    saveCart(cart);
  }, [cart]);

  // ── Change quantity ────────────────────────────────
  // Creates a new array with updated qty (React needs new array to re-render)
  function changeQty(index, change) {
    const updated = [...cart]; // spread creates a copy
    updated[index].qty += change;
    if (updated[index].qty <= 0) {
      updated.splice(index, 1); // remove if qty goes to 0
    }
    setCart(updated); // update state → React re-renders
  }

  // ── Remove item ────────────────────────────────────
  function removeItem(index) {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  }

  // ── Calculate totals ───────────────────────────────
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFree = subtotal >= 999;
  const total = shippingFree ? subtotal : subtotal + 99;

  return (
    <>
      <Navbar />

      <div className="page-header">
        <span>Your Selections</span>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-section">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            // Empty cart state
            <div className="empty-cart">
              <i className="fas fa-shopping-bag"></i>
              <p>Your cart is empty.</p>
              <Link to="/shop">Shop Now</Link>
            </div>
          ) : (
            // Map through cart items and render each one
            cart.map((item, index) => (
              <div className="cart-item" key={index}>
                {/* Product image */}
                <div className="item-img">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <i className="fas fa-shirt" style={{ fontSize: '2rem', color: 'var(--rose)' }}></i>
                  )}
                </div>

                {/* Product info */}
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">₹{item.price.toLocaleString()} each</p>
                </div>

                {/* Quantity controls */}
                <div className="item-controls">
                  <button className="qty-btn" onClick={() => changeQty(index, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => changeQty(index, 1)}>+</button>
                </div>

                {/* Item total */}
                <span className="item-total">₹{(item.price * item.qty).toLocaleString()}</span>

                {/* Remove button */}
                <button className="remove-btn" onClick={() => removeItem(index)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFree ? 'Free' : '₹99'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {/* Checkout button — disabled if cart is empty */}
          <Link
            to="/checkout"
            className="checkout-btn"
            style={cart.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="continue-link">← Continue Shopping</Link>
        </div>
      </div>
    </>
  );
}

export default Cart;
