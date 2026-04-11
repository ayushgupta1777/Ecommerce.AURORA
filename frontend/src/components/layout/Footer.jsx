import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Globe, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <Link to="/" className="flex items-center mb-4">
            <ShoppingBag className="text-pink-500 mr-2" size={28} />
            <span className="logo-text">AURORA</span>
          </Link>
          <p className="footer-desc">
            Elevating your modern lifestyle with curated aesthetic essentials and premium tech experiences.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="icon-btn" aria-label="Globe"><Globe size={20} /></button>
            <button className="icon-btn" aria-label="Mail"><Mail size={20} /></button>
            <button className="icon-btn" aria-label="Support"><MessageCircle size={20} /></button>
          </div>
        </div>

        <div className="footer-links-group">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home Presence</Link></li>
            <li><Link to="/products">Curated Shop</Link></li>
            <li><Link to="/cart">My Collection</Link></li>
            <li><Link to="/admin">Command Center</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Information</h3>
          <ul>
            <li><Link to="#">Shipping Policy</Link></li>
            <li><Link to="#">Privacy Sanctuary</Link></li>
            <li><Link to="#">Terms of Existence</Link></li>
            <li><Link to="#">Contact Soul</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>&copy; 2026 AURORA Ecosystem. Crafted with minimalism and intent.</p>
      </div>
    </footer>
  );
};

export default Footer;
