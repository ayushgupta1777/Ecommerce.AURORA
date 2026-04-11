import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

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
        <Link to="/products">
          <Button variant="primary" className="py-4 px-12 text-lg font-bold shadow-2xl">Materialize Treasures</Button>
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
            <div key={item.id} className="glass rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/50 hover:shadow-xl transition-all group">
              <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden shadow-inner shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <span className="product-category mb-1 inline-block">{item.category}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-tight">{item.name}</h3>
                <p className="font-bold text-slate-400">Unit: ₹{item.price}</p>
              </div>

              <div className="flex items-center bg-white rounded-full border-2 border-slate-100 p-1 shadow-sm">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"><Minus size={16} /></button>
                <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-pink-500 transition-colors rounded-full hover:bg-pink-50"><Plus size={16} /></button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="text-xl font-bold text-slate-900 mb-1">₹{(item.price * item.quantity).toFixed(0)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 mx-auto md:ml-auto md:mr-0">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-[40px] p-8 sticky top-28 border border-white/50 shadow-2xl overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 tracking-tight">Summary</h3>
            
            <div className="space-y-4 mb-8 text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>Value</span>
                <span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Logistics</span>
                <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Recovery (5%)</span>
                <span>₹{(cartTotal * 0.05).toFixed(0)}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-pink-50 flex justify-between items-center mb-10">
              <span className="text-lg font-bold text-slate-800">Final Total</span>
              <span className="text-3xl font-bold text-pink-600 tracking-tighter">
                ₹{(cartTotal * 1.05).toFixed(0)}
              </span>
            </div>

            <Button onClick={handleCheckout} variant="primary" className="w-full py-5 text-xl font-bold shadow-xl">
              Finalize Order <ArrowRight size={24} className="ml-2" />
            </Button>
            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Verified & Encrypted Presence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
