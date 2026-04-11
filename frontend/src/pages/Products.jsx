import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ecommerce/ProductCard';
import { SkeletonLoader } from '../components/ui/Feedback';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';

  const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (categoryFilter) params.category = categoryFilter;
        if (searchFilter) params.search = searchFilter;

        const response = await productAPI.getAll(params);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error("Products page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, [categoryFilter, searchFilter]);

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {searchFilter ? `Search: "${searchFilter}"` : (categoryFilter || 'Curated Shop')}
          </h1>
          <p className="text-slate-500 font-medium">Discover {products.length} handpicked aesthetic items</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              className="input-field w-full md:w-56 py-3 px-10 appearance-none bg-white cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setSearchParams(e.target.value ? { category: e.target.value } : {})}
            >
              <option value="">All Fragments</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <SkeletonLoader key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center glass rounded-3xl border-2 border-dashed border-pink-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-300 mb-6">
            <SearchIcon size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-700">No matching items found</h3>
          <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or search query.</p>
          <button onClick={() => setSearchParams({})} className="mt-8 btn btn-primary px-8">Clear All Filters</button>
        </div>
      )}
    </div>
  );
};

export default Products;
