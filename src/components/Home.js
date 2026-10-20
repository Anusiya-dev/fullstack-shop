// Home.js
// This is the Home page — same content as your original index.html
// Converted to a React component.
// Key differences from HTML:
//   - class="..." becomes className="..."  (class is reserved in JS)
//   - onclick="..." becomes onClick={...}  (camelCase in React)
//   - href="#section" works the same for smooth scroll

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { subscribeNewsletter } from '../services/api';

function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState(null);

  async function handleSubscribe(e) {
    e.preventDefault();
    setNewsletterMsg(null);
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      setNewsletterMsg(res.detail || 'Subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err.message || 'Could not subscribe.');
    }
  }

  return (
    <>
      {/* Navbar component — reused across all pages */}
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section id="hero">
        <div className="hero-content">
          <span className="hero-tag">New Collection — Summer 2025</span>
          <h1 className="hero-title">
            Wear Your<br /><em>Story.</em>
          </h1>
          <p className="hero-desc">
            Curated fashion for women who move with intention. Every piece is crafted
            to feel as good as it looks — timeless, conscious, and unapologetically you.
          </p>
          <div className="d-flex flex-wrap gap-3 mt-4">
            {/* Link scrolls to collections section on same page */}
            <a href="#collections" className="btn-primary">Explore Collections</a>
            <a href="#about" className="btn-outline">Our Story</a>
          </div>
        </div>
        <div className="hero-image-box">
          {/* Image from public/image/ folder */}
          <img src="/image/indian_boutique.png" alt="Indian Boutique Collection" />
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────── */}
      <section id="about">
        <div className="about-img-box">
          <img src="/image/boutique_about.png" alt="FLORA Boutique" className="about-img" />
        </div>
        <div className="about-text">
          <p className="section-tag">About the Brand</p>
          <h2 className="section-title">Fashion that<br />feels like you.</h2>
          <p>
            FLORA was born from a simple belief — that what you wear should tell your
            story, not someone else's. We design for real women: thoughtful, layered,
            and full of life.
          </p>
          <p>
            Each collection is built around sustainable practices, quality fabrics,
            and a quiet confidence that never goes out of style.
          </p>
          <div className="about-stats">
            <div>
              <span className="stat-num">3K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div>
              <span className="stat-num">48</span>
              <span className="stat-label">Curated Pieces</span>
            </div>
            <div>
              <span className="stat-num">100%</span>
              <span className="stat-label">Sustainable Fabrics</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ──────────────────────────── */}
      <section id="collections">
        <div className="collections-header">
          <div>
            <p className="section-tag">This Season</p>
            <h2 className="section-title">Our Collections</h2>
          </div>
          {/* Link to /shop — React Router navigation */}
          <Link to="/shop" className="btn-outline">View All</Link>
        </div>

        <div className="row g-4 mt-4">
          {/* Summer Edit Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-img summer">
                <img src="/image/summer.jpeg" alt="Summer Edit" className="collection-img" />
              </div>
              <div className="card-body">
                <p className="card-tag">New Drop</p>
                <h3 className="card-title">Summer Edit</h3>
                <p className="card-desc">
                  Light linens and breezy silhouettes for days that glow. Earthy tones, easy movement.
                </p>
                <Link to="/shop" className="card-link">Explore →</Link>
              </div>
            </div>
          </div>

          {/* Festive Collection Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-img street">
                <img src="/image/festive.jpeg" alt="Festive Collection" className="collection-img" />
              </div>
              <div className="card-body">
                <p className="card-tag">Best Seller</p>
                <h3 className="card-title">Festive Collection</h3>
                <p className="card-desc">
                  Curated for unforgettable moments, our festive collection blends tradition with modern elegance.
                </p>
                <Link to="/shop" className="card-link">Explore →</Link>
              </div>
            </div>
          </div>

          {/* Minimalist Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-img minimal">
                <img src="/image/minimalist.jpeg" alt="Minimalist" className="collection-img" />
              </div>
              <div className="card-body">
                <p className="card-tag">Signature</p>
                <h3 className="card-title">Minimalist</h3>
                <p className="card-desc">
                  Clean cuts, soft palettes, and timeless shapes for the woman who lets less say more.
                </p>
                <Link to="/shop" className="card-link">Explore →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────── */}
      <section id="why">
        <p className="section-tag">Why FLORA</p>
        <h2 className="section-title">Designed with intention.</h2>
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="why-card h-100">
              <div className="why-icon"><i className="fas fa-leaf"></i></div>
              <h3>Sustainable Always</h3>
              <p>Every fabric we use is ethically sourced. Fashion doesn't have to cost the earth — we prove it with every stitch.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="why-card h-100">
              <div className="why-icon"><i className="fas fa-truck"></i></div>
              <h3>Free Shipping</h3>
              <p>On all orders above ₹999. Fast, tracked, and delivered to your door with zero fuss.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="why-card h-100">
              <div className="why-icon"><i className="fas fa-sync-alt"></i></div>
              <h3>New Drops Weekly</h3>
              <p>Fresh styles every week. Follow along and never miss the piece that was made for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section id="testimonials">
        <p className="section-tag">Real Stories</p>
        <h2 className="section-title">Loved by women everywhere.</h2>
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="testi-card h-100">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"I wore the Summer Edit linen set to a wedding and got more compliments than the bride. Worth every rupee."</p>
              <span className="testi-author">— Meera K., Bangalore</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="testi-card h-100">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"FLORA gets minimalism right. The quality feels expensive but the prices don't. My new everyday brand."</p>
              <span className="testi-author">— Priya R., Mumbai</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="testi-card h-100">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"Sustainable fashion that actually looks good? Finally. The Street Style hoodie hasn't left my rotation."</p>
              <span className="testi-author">— Ananya S., Delhi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────── */}
      <section id="newsletter">
        <p className="section-tag">Stay Connected</p>
        <h2 className="section-title">New drops. First to know.</h2>
        <p className="newsletter-sub">Join the FLORA community — exclusive offers, style tips, and early access.</p>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Your email address"
            required
            value={newsletterEmail}
            onChange={e => setNewsletterEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
        {newsletterMsg && <p className="mt-3 text-center">{newsletterMsg}</p>}
      </section>

      {/* Footer component */}
      <Footer />
    </>
  );
}

export default Home;
