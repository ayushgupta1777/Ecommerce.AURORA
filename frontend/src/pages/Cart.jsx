import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
    calculateTotal(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
    calculateTotal(updated);
    toast.error("Item disintegrated from collection");
  };




  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    toast.success("Identity Verified. Order Finalized!");
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-pink-50 rounded-[35px] flex items-center justify-center mx-auto mb-10 text-pink-300 shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Your Collection is Empty</h2>
        <p className="text-slate-400 font-medium text-lg mb-12 max-w-sm mx-auto opacity-80 leading-relaxed">It seems you haven't materialized any aesthetic items into your presence yet.</p>
        <Link to="/products" className="bg-pink-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:bg-pink-700 transition-all">
          Materialize Treasures
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-slate-800 mb-12 tracking-tight">Personal Collection</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-container glass rounded-[30px] p-5 flex flex-col sm:flex-row items-center gap-6 border border-white/50 hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="cart-item-image-container">
                <img src={item.image} alt={item.title} className="cart-item-image" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="product-category mb-1 inline-block text-[10px] uppercase font-bold text-pink-500 tracking-widest">{item.category}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-tight">{item.title}</h3>
                <p className="font-bold text-slate-400">Unit: ₹{item.price}</p>
              </div>

              <div className="flex items-center bg-slate-50 p-1 rounded-full border border-slate-100 shadow-inner">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-pink-500 transition-colors bg-white rounded-full shadow-sm"><Minus size={16} /></button>
                <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-pink-500 transition-colors bg-white rounded-full shadow-sm"><Plus size={16} /></button>
              </div>

              <div className="flex flex-col items-center sm:items-end min-w-[120px] gap-3">
                <p className="text-2xl font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-red-50 px-4 py-2 rounded-full flex items-center gap-2 border border-transparent hover:border-red-100">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-[45px] p-8 md:p-10 sticky top-28 border border-white/50 shadow-2xl overflow-hidden animate-slide-up">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

            <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight relative">Summary</h3>

            <div className="space-y-4 mb-8 text-slate-500 font-medium text-sm relative">
              <div className="cart-summary-row">
                <span>Value</span>
                <span className="text-slate-800 font-bold">₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Logistics</span>
                <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
              </div>
              <div className="cart-summary-row">
                <span>Tax Recovery (5%)</span>
                <span className="text-slate-800 font-bold">₹{(cartTotal * 0.05).toFixed(0)}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-pink-50 flex justify-between items-center mb-10">
              <span className="text-lg font-bold text-slate-800">Final Total</span>
              <span className="text-3xl font-bold text-pink-600 tracking-tighter">
                ₹{(cartTotal * 1.05).toFixed(0)}
              </span>
            </div>

            <button onClick={handleCheckout} className="w-full py-5 text-xl font-bold shadow-lg hover:shadow-2xl bg-pink-600 text-white rounded-[30px] hover:bg-pink-700 hover:-translate-y-1 transition-all flex items-center justify-center group">
              Finalize Order <ArrowRight size={24} className="ml-3 transition-transform group-hover:translate-x-2" />
            </button>
            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Verified & Encrypted Presence</p>
          </div>
        </div>
      </div>
    </div>
  );
};




export default Cart;
