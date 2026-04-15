import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...p, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${p.title || p.name} added to cart!`);
  };
  
  const id = product.id || product._id;
  const name = product.title || product.name || 'Aesthetic Product';
  const image = product.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id, title: name, image });
  };

  return (
    <div className="product-card glass animate-fade-in">
      <Link to={`/products/${id}`} className="product-image-container">
        <img src={image} alt={name} className="product-image" loading="lazy" />
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category || 'General'}</span>
        <div className="product-header">
          <Link to={`/products/${id}`}>
            <h3 className="product-title">{name}</h3>
          </Link>
          <div className="product-rating">
            <Star className="rating-icon" />
            <span>{product.rating || '4.5'}</span>
          </div>
        </div>
        
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button className="icon-btn btn-primary" onClick={handleAdd} aria-label="Add to cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
