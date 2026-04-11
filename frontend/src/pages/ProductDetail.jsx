import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { Star, ArrowLeft, Truck, ShieldCheck, ShoppingCart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error("Detail page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Exclusive! ${product.title || product.name} added to your collection.`);
  };

  if (loading) return <div className="py-40 text-center font-bold text-slate-400 text-xl flex flex-col items-center">
    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
    Revealing Presence...
  </div>;

  if (!product) return <div className="py-40 text-center font-bold text-red-400 text-xl">Fragment lost in transit</div>;

  const name = product.title || product.name;
  const image = product.image || `https://placehold.co/600x600/fce7f3/db2777?text=${encodeURIComponent(name)}`;

  return (
    <div className="container py-12 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-pink-500 mb-10 transition-colors font-bold uppercase text-xs tracking-widest">
        <ArrowLeft size={18} /> Back to Sanctuary
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="glass rounded-[40px] overflow-hidden shadow-2xl aspect-square relative group">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-bold text-slate-700">{product.rating || '4.5'}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center py-4">
          <span className="product-category mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight tracking-tight">{name}</h1>
          
          <p className="text-4xl font-bold text-slate-900 mb-8 tracking-tighter">₹{product.price}</p>
          
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium border-l-4 border-pink-100 pl-6">
            {product.description || 'Crafted with absolute attention to detail and curated specifically for your modern presence. Experience high-quality aesthetic design and unparalleled performance in every element.'}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 mb-12">
            <div className="flex items-center border-2 border-slate-100 rounded-full bg-white p-1 shadow-sm">
              <button 
                className="w-12 h-12 flex items-center justify-center text-xl hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              ><Minus size={18} /></button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                className="w-12 h-12 flex items-center justify-center text-xl hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"
                onClick={() => setQuantity(q => q + 1)}
              ><Plus size={18} /></button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 btn btn-primary py-4 rounded-full flex items-center justify-center gap-3 text-lg font-bold"
            >
              <ShoppingCart size={22} /> Add to Collection
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center shadow-inner">
                <Truck size={24} />
              </div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Free Express<br/>Delivery</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Protected<br/>Registry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
