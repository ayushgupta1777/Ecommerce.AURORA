import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const id = product.id || product._id;
  const name = product.title || product.name || 'Aesthetic Product';
  const image = product.image || `https://placehold.co/600x600/fce7f3/db2777?text=${encodeURIComponent(name)}`;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id, name, image });
    toast.success(`Success! ${name} materialized in your cart.`);
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
