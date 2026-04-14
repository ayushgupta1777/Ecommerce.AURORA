import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../components/ecommerce/HeroSlider';
import ProductCard from '../components/ecommerce/ProductCard';
import CategoryCard from '../components/ecommerce/CategoryCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products?limit=8');
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  return (
    <div className="animate-fade-in">
      <HeroSlider />


      <section className="section">
        <div className="container">
          <h2 className="section-title mb-12">Fragments of Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>


      <section className="section bg-slate-50/50">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Presence</h2>
            <Link to="/products" className="view-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-3xl animate-pulse" />
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>



      <section className="section text-center">
        <div className="container">
          <Link to="/products" className="inline-block btn btn-secondary py-4 px-12 text-lg font-bold">
            Explore Complete Sanctuary
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
