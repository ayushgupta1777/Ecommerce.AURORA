import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <ShoppingBag className="text-pink-500 mr-2" size={32} />
          <span className="logo-text">AURORA</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/products?category=Electronics" className="nav-link">Tech</Link>
          <Link to="/products?category=Clothing" className="nav-link">Style</Link>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => navigate('/products')}>
            <Search size={20} />
          </button>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <Link to="/admin" className="icon-btn">
              <User size={20} className={(user.role === 'admin' || user.email === 'ayushgupta1733@gmail.com') ? 'text-pink-500' : ''} />
            </Link>
          ) : (
            <Link to="/login" className="icon-btn">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
