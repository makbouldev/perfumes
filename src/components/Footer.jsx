import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-content glass">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <Link to="/">RYME <span>PERFUM</span></Link>
            </div>
            <p className="brand-desc">
              Crafting unforgettable olfactory experiences through the finest ingredients and artisanal passion.
            </p>
            <div className="social-links">
              <a href="#"><FiInstagram size={20}/></a>
              <a href="#"><FiTwitter size={20}/></a>
              <a href="#"><FiFacebook size={20}/></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/collection">All Perfumes</Link></li>
              <li><Link to="/collection">Best Sellers</Link></li>
              <li><Link to="/collection">Gift Sets</Link></li>
              <li><Link to="/collection">Discovery Set</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>About</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about">Ingredients</Link></li>
              <li><Link to="/about">Sustainability</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Join The Club</h4>
            <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RYME PERFUM. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
