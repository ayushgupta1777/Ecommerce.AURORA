import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const slidesData = [
  {
    id: 1,
    title: "Discover Aesthetic Living",
    subtitle: "Elevate your space with our curated collection of lifestyle essentials and premium experiences.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
    link: "/products"
  },
  {
    id: 2,
    title: "Premium Tech Sanctuary",
    subtitle: "Minimalist design meeting powerful performance in every bit of technology.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
    link: "/products?category=Electronics"
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(s => (s + 1) % slidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container hero-slider">
      {slidesData.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`slide ${index === current ? 'slide-active' : ''}`}
        >
          <div className="slide-overlay" />
          <img src={slide.image} alt={slide.title} className="slide-image" />
          <div className="slide-content animate-fade-in">
            <span className="product-category" style={{ color: 'white', opacity: 0.8 }}>New Collection 2026</span>
            <h1>{slide.title}</h1>
            <p className="slide-subtitle">{slide.subtitle}</p>
            <Link to={slide.link} className="btn btn-primary py-4 px-8 text-lg font-bold">
              Explore Now <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      ))}
      <div className="slider-dots">
        {slidesData.map((_, i) => (
          <button 
            key={i} 
            className={`slider-dot ${i === current ? 'slider-dot-active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
