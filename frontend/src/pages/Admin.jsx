import React, { useState, useEffect } from 'react';
import { productAPI, authAPI } from '../services/api';
import { Button, Input } from '../components/ui';
import { Plus, Trash2, Edit2, LayoutDashboard, Package, X, RefreshCw, BarChart3 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'stats'
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const userRes = await authAPI.getUser();
        setUser(userRes.data);

        const isAdmin = userRes.data.role === 'admin' || userRes.data.email === 'ayushgupta1733@gmail.com';
        
        if (isAdmin) {
          const [prodRes, statsRes] = await Promise.all([
            productAPI.getAll({ limit: 100 }),
            api.get('/statistics')
          ]);
          setProducts(prodRes.data.data || []);
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error("Admin page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { title, price: Number(price), category, description, brand: 'Aurora', stock: 10 };

    try {
      if (editId) {
        await productAPI.update(editId, productData);
        toast.success("Blueprint updated successfully!");
      } else {
        await productAPI.create(productData);
        toast.success("Product materialized successfully!");
      }
      
      setTitle(''); setPrice(''); setCategory(''); setDescription(''); setEditId(null);
      const refresh = await productAPI.getAll({ limit: 100 });
      setProducts(refresh.data.data || []);
    } catch (err) {
      toast.error("Operation failed in presence");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Disintegrate this product from inventory?")) return;
    try {
      await productAPI.delete(id);
      toast.success("Faded from existence");
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      toast.error("Deletion rejected");
    }
  };

  const handleEditInit = (p) => {
    setEditId(p.id);
    setTitle(p.title || p.name);
    setPrice(p.price);
    setCategory(p.category);
    setDescription(p.description);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="py-40 text-center font-bold text-slate-400 text-xl flex flex-col items-center">
    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6" />
    Syncing Command Protocol...
  </div>;

  const isAdmin = user && (user.role === 'admin' || user.email === 'ayushgupta1733@gmail.com');

  if (!isAdmin) {
    return (
      <div className="container py-40 text-center animate-fade-in">
        <h2 className="text-5xl font-bold text-slate-800 mb-6 tracking-tighter">ACCESS DENIED</h2>
        <p className="text-slate-500 font-bold text-xl opacity-80">Your identity does not possess required clearance.</p>
        <Button onClick={() => window.location.href = '/'} variant="secondary" className="mt-10 py-4 px-12">Return to Sanctuary</Button>
      </div>
    );
  }

  return (
    <div className="container py-12 animate-fade-in">
      <h1 className="text-4xl font-bold text-slate-800 mb-12 flex items-center gap-4 tracking-tight">
        <div className="p-3 bg-pink-50 rounded-2xl text-pink-500 shadow-inner">
          <LayoutDashboard size={32} />
        </div>
        🖥️ Command Protocol 🔧
      </h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Fragments', value: stats.totalProducts, color: 'pink' },
            { label: 'Avg Value', value: `₹${stats.avgPrice}`, color: 'blue' },
            { label: 'Inventory Stock', value: stats.totalStock, color: 'purple' },
            { label: 'Active Brands', value: stats.totalBrands, color: 'amber' }
          ].map((s, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/50 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-bold text-${s.color}-500`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mb-10 border-b border-slate-100 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
        >
          Product Manifest
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'stats' ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
        >
          Global Analytics
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="glass rounded-[40px] p-8 sticky top-28 border border-white/50 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center justify-between">
                {editId ? "Update Blueprint" : "Materialize Item"}
                {editId && <button onClick={() => { setEditId(null); setTitle(''); }}><X size={20} className="text-slate-400" /></button>}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Signature Name" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input label="Value (₹)" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                <Input label="Fragment Category" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
                <div className="input-group">
                  <label className="input-label">Essence Description</label>
                  <textarea 
                    className="input-field min-h-[120px] resize-none" 
                    placeholder="Description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full py-4 text-lg font-bold">
                  {editId ? "Confirm Update" : "Release to Presence"}
                </Button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <Package size={24} className="text-blue-500" /> Current Manifest
            </h2>
            <div className="glass rounded-[35px] overflow-hidden border border-white/50 shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Aesthetic Item</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fragment</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Value</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white/40">
                  {products.map(p => (
                    <tr key={p.id || p._id} className="hover:bg-white/60 transition-colors group">
                      <td className="p-4 font-bold text-slate-800">{p.title || p.name}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-white rounded-md text-[10px] uppercase font-bold text-slate-400 border border-slate-100">{p.category}</span></td>
                      <td className="p-4 font-bold">₹{p.price}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditInit(p)} className="p-2 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id || p._id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-[40px] p-12 text-center border border-white/50 shadow-2xl animate-fade-in">
          <div className="w-24 h-24 bg-pink-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-pink-500 shadow-inner">
            <LayoutDashboard size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Ecosystem Analytics</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-lg mx-auto">Comprehensive data mapping of your current digital marketplace presence.</p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white/50 rounded-3xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Inventory Health</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Total Products</span>
                  <span className="font-bold text-xl">{stats.totalProducts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Available Stock</span>
                  <span className="font-bold text-xl">{stats.totalStock}</span>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white/50 rounded-3xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Average Valuation</span>
                  <span className="font-bold text-xl">₹{stats.avgPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Market Reach</span>
                  <span className="font-bold text-xl">{stats.totalCategories} Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
