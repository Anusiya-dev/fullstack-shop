import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { createOrder } from '../services/api';
import { getCart, clearCart } from '../utils/cart';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pin_code: '',
  state: 'Tamil Nadu',
  upi_id: '',
};

function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [selectedPay, setSelectedPay] = useState('UPI');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        first_name: user.first_name || prev.first_name,
        last_name: user.last_name || prev.last_name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await createOrder({
        ...form,
        payment_method: selectedPay,
        upi_id: selectedPay === 'UPI' ? form.upi_id : '',
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.qty,
        })),
      });
      setOrderNumber(order.order_number);
      setOrderPlaced(true);
      launchConfetti();
    } catch (err) {
      setSubmitError(err.message || 'Could not place order.');
    } finally {
      setSubmitting(false);
    }
  }

  function clearCartAndGoHome() {
    clearCart();
    navigate('/');
  }

  function launchConfetti() {
    const colors = ['C9A89A', 'E8D5C4', '2C2018', 'F9F5F0', 'CC5C2C', 'D4B896'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed; top:-10px;
        left:${Math.random() * 100}vw;
        width:${Math.random() * 8 + 5}px;
        height:${Math.random() * 8 + 5}px;
        background:#${colors[Math.floor(Math.random() * colors.length)]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        z-index:99999; pointer-events:none;
        transition:top ${Math.random() * 2 + 1.5}s ease, opacity 0.5s ease;
      `;
      document.body.appendChild(el);
      setTimeout(() => { el.style.top = '105vh'; el.style.opacity = '0'; }, Math.random() * 500);
      setTimeout(() => el.remove(), 4000);
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />

      <div className="page-header">
        <span>Almost There</span>
        <h1>Checkout</h1>
      </div>

      <div className="steps">
        <div className="step done">
          <span className="step-num"><i className="fas fa-check" style={{ fontSize: '0.6rem' }}></i></span> Cart
        </div>
        <div className="step-divider"></div>
        <div className="step active">
          <span className="step-num">2</span> Details
        </div>
        <div className="step-divider"></div>
        <div className="step">
          <span className="step-num">3</span> Confirm
        </div>
      </div>

      <div className="checkout-section">
        <form className="checkout-form" onSubmit={placeOrder}>
          <p className="form-section-title">Delivery Details</p>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="first_name" type="text" placeholder="Priya" required value={form.first_name} onChange={updateField} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="last_name" type="text" placeholder="Sharma" required value={form.last_name} onChange={updateField} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="priya@email.com" required value={form.email} onChange={updateField} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" type="tel" placeholder="+91 98765 43210" required value={form.phone} onChange={updateField} />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" type="text" placeholder="House / Flat No., Street" required value={form.address} onChange={updateField} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" type="text" placeholder="Chennai" required value={form.city} onChange={updateField} />
            </div>
            <div className="form-group">
              <label>PIN Code</label>
              <input name="pin_code" type="text" placeholder="600001" required value={form.pin_code} onChange={updateField} />
            </div>
          </div>

          <div className="form-group">
            <label>State</label>
            <select name="state" value={form.state} onChange={updateField}>
              <option>Tamil Nadu</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Delhi</option>
              <option>West Bengal</option>
              <option>Gujarat</option>
            </select>
          </div>

          <div className="section-gap">
            <p className="form-section-title">Payment Method</p>
            <div className="payment-options">
              {['UPI', 'Debit Card', 'Net Banking', 'COD'].map(method => (
                <button
                  key={method}
                  type="button"
                  className={`pay-option ${selectedPay === method ? 'selected' : ''}`}
                  onClick={() => setSelectedPay(method)}
                >
                  {method}
                </button>
              ))}
            </div>
            {selectedPay === 'UPI' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input name="upi_id" type="text" placeholder="yourname@upi" value={form.upi_id} onChange={updateField} />
              </div>
            )}
          </div>

          {submitError && (
            <p className="text-danger mb-3" role="alert">{submitError}</p>
          )}

          <button
            type="submit"
            className="place-order-btn"
            disabled={submitting || cart.length === 0}
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Your Order</h2>
          {cart.map((item, i) => (
            <div className="summary-item" key={i}>
              <span>{item.name} x{item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-item">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : '₹99'}</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {orderPlaced && (
        <div className="success-overlay show">
          <div className="success-box">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Order Placed!</h2>
            <p>
              Thank you for shopping with FLORA. Order <strong>{orderNumber}</strong> is confirmed
              and will be delivered in 3–5 business days.
            </p>
            <button
              type="button"
              onClick={clearCartAndGoHome}
              style={{
                background: 'var(--deep)', color: 'var(--cream)',
                padding: '0.75rem 2rem', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
