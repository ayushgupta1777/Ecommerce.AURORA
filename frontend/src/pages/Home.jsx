import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import HeroSlider from '../components/ecommerce/HeroSlider';
import ProductCard from '../components/ecommerce/ProductCard';
import CategoryCard from '../components/ecommerce/CategoryCard';
import { SkeletonLoader } from '../components/ui/Feedback';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll({ limit: 8 });
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Home page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate-fade-in py-8">
      <HeroSlider />

      <section className="container py-12">
        <div className="flex-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <Link to="/products" className="text-pink-500 font-semibold flex items-center hover:gap-1 transition-all">
            See All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat} category={cat} />
          ))}
        </div>
      </section>

      <section className="container py-12 mb-16 text-center">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Editor's Pick</h2>
          <div className="w-20 h-1.5 bg-pink-500 rounded-full mb-4" />
          <p className="text-slate-500 font-medium">Curated masterpieces for your presence</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <SkeletonLoader key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {products.map(p => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        )}

        <Link to="/products" className="inline-block mt-16 btn btn-secondary py-4 px-12 text-lg font-bold">
          Explore Complete Sanctuary
        </Link>
      </section>
    </div>
  );
};

export default Home;
