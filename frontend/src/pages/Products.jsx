import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ecommerce/ProductCard';
import Pagination from '../components/ecommerce/Pagination';
import { SlidersHorizontal, Search, ShoppingBag } from 'lucide-react';
import BASE_URL from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(8);
  
  const location = useLocation();
  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const search = params.get('search');
    
    if (cat) setActiveCategory(cat);
    if (search) {
      setSearchQuery(search);
      setDebouncedSearch(search);
    }
  }, [location]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${BASE_URL}/products?page=${currentPage}&limit=${itemsPerPage}`;
        
        if (activeCategory !== 'All') {
          url += `&category=${activeCategory}`;
        }
        
        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }

        const response = await axios.get(url);
        // The API returns { total, page, limit, data }
        setProducts(response.data.data || []);
        setTotalItems(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, debouncedSearch, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">Curation Manifest</h1>
          <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px]">Filtering through aesthetic fragments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full sm:w-64">
            <Search className="left-4 center-y text-slate-300 group-focus-within:text-pink-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search fragments..." 
              className="navbar-search w-full pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-full overflow-x-auto gap-1 border border-slate-200 shadow-inner">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-full text-[10px] uppercase font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-pink-500 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200 rounded-[35px] animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <Pagination 
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="py-40 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Matching Fragments</h3>
          <p className="text-slate-400">The current filter parameters yielded no results.</p>
        </div>
      )}
    </div>
  );
};

export default Products;

