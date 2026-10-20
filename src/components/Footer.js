// Footer.js
// Shared footer used on Home and Shop pages.
// Same content as the original HTML footer —
// just written as a React component so we
// write it once and reuse it.

import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <span className="footer-logo">FLORA</span>
          <p className="footer-tagline">
            Fashion for women who move with intention. Timeless, conscious, and unapologetically you.
          </p>
          <div className="footer-socials">
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="#">Summer Edit</a></li>
            <li><a href="#">Festive Collection</a></li>
            <li><a href="#">Minimalist</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FLORA. All rights reserved.</p>
        <p>Made with ♡ for women who wear their story.</p>
      </div>
    </footer>
  );
}

export default Footer;
