import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ArrowLeft, Truck, ShieldCheck, ShoppingCart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = (product, qty) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${product.title || product.name} integrated into collection`);
  };

  if (loading) return <div className="py-40 text-center font-bold text-slate-300 animate-pulse text-xl">Materializing Object...</div>;
  if (!product) return <div className="py-40 text-center font-bold text-red-400">Object not found in current presence</div>;

  const name = product.title || product.name;
  const image = product.image || `https://placehold.co/800x800/fdf2f8/db2777?text=${encodeURIComponent(name)}`;

  return (
    <div className="container py-16 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-sm uppercase tracking-widest mb-12 transition-all">
        <ArrowLeft size={16} /> Retreat to Catalog
      </button>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="product-detail-card glass rounded-[50px] overflow-hidden shadow-2xl p-4 border border-white/50 group">
          <div className="product-detail-image-container bg-white rounded-[40px] overflow-hidden shadow-inner relative">
            <img src={image} alt={name} className="product-detail-image" />
            <div className="product-category-badge">{product.category}</div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating || 4.5) ? "#ec4899" : "none"} className={i < Math.floor(product.rating || 4.5) ? "text-pink-500" : "text-slate-200"} />
              ))}
              <span className="text-sm font-bold text-slate-400 ml-2">({product.rating || 4.5})</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tighter leading-tight">{name}</h1>
            <p className="text-3xl font-bold text-pink-600 tracking-tight">₹{product.price}</p>
          </div>

          <p className="text-slate-500 leading-relaxed font-medium text-lg border-l-4 border-pink-100 pl-6 py-2">{product.description}</p>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex items-center bg-slate-50 p-1.5 rounded-full border border-slate-100 shadow-inner">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2.5 hover:text-pink-500 transition-colors bg-white rounded-full shadow-sm"><Minus size={18} /></button>
              <span className="w-14 text-center font-bold text-xl text-slate-800">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="p-2.5 hover:text-pink-500 transition-colors bg-white rounded-full shadow-sm"><Plus size={18} /></button>
            </div>

            <button onClick={() => addToCart(product, quantity)} className="flex-1 py-5 text-xl font-bold shadow-2xl rounded-[30px] group bg-pink-600 text-white hover:bg-pink-700 transition-all flex items-center justify-center">
              <ShoppingCart className="mr-3 group-hover:animate-bounce" size={24} /> Integrate to Collection
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 pt-10 border-t border-slate-50 text-slate-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Truck size={24} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Logistics</p>
                <p className="font-bold text-slate-700">Rapid Materialization</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><ShieldCheck size={24} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Security</p>
                <p className="font-bold text-slate-700">Verified Origin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
