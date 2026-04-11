import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Shirt, Book, Home, ShoppingBag } from 'lucide-react';

const icons = {
  Electronics: Laptop,
  Clothing: Shirt,
  Books: Book,
  Home: Home
};

const CategoryCard = ({ category }) => {
  const Icon = icons[category] || ShoppingBag;

  return (
    <Link to={`/products?category=${category}`} className="category-card glass">
      <div className="category-icon-wrapper">
        <Icon size={32} />
      </div>
      <h3 className="category-name">{category}</h3>
    </Link>
  );
};

export default CategoryCard;
