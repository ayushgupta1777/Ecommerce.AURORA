import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/products');
    }
  };

  // Handle cart count update from localStorage
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cartUpdated', updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

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
          <div className="relative hidden md:block group">
            <Search className="left-4 center-y text-slate-300 pointer-events-none group-focus-within:text-pink-400 transition-colors" size={16} />
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search fragments..." 
                className="navbar-search pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <button className="icon-btn md:hidden" onClick={() => navigate('/products')}>
            <Search size={20} />
          </button>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/admin" className="icon-btn">
                <User size={20} className={(user.role === 'admin' || user.email === 'ayushgupta1733@gmail.com') ? 'text-pink-500' : ''} />
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-red-500 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
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
