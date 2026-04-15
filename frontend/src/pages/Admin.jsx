import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input } from '../components/ui';
import { Plus, Trash2, Edit2, LayoutDashboard, Package, X, RefreshCw, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('Aurora');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Step 1: Look at Local Memory first (Immediate local fallback)
        const localUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (localUser) setUser(localUser);

        // Step 2: Try to verify with Server
        const userRes = await axios.get('/api/user', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        setUser(userRes.data);

        // Access check
        const isAdmin = userRes.data.role === 'admin' || userRes.data.email === 'ayushgupta1733@gmail.com' || localUser?.email === 'ayushgupta1733@gmail.com';

        if (isAdmin) {
          const [prodRes, statsRes] = await Promise.all([
            axios.get('/api/products?limit=100'),
            axios.get('/api/statistics')
          ]);
          setProducts(prodRes.data.data || []);
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error("Admin page fetch error:", err);
        // If server fails but we are the special admin, try to fetch products anyway
        const localUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (localUser?.email === 'ayushgupta1733@gmail.com') {
          const prodRes = await axios.get('/api/products?limit=100');
          setProducts(prodRes.data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const IMAGE_MAP = {
    iphone: "https://images.unsplash.com/photo-1510557880182-3d4d3cba30a8?q=80&w=1000&auto=format&fit=crop",
    samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
    laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
    macbook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    shoe: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    sneaker: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop",
    watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    chair: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
    book: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
    toys: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format&fit=crop",
    beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    moisturizer: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    fragrance: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
    clothing: "https://images.unsplash.com/photo-1523381235208-175e260654ec?q=80&w=1000&auto=format&fit=crop",
    sports: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop"
  };

  useEffect(() => {
    if (editId) return; // Don't auto-suggest if editing
    const t = title.toLowerCase();
    const match = Object.keys(IMAGE_MAP).find(k => t.includes(k));
    if (match) {
      setImage(IMAGE_MAP[match]);
    }
  }, [title, editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    };

    try {
      const productData = { title, price: Number(price), category, description, image, brand, stock: Number(stock) };
      if (editId) {
        await axios.patch(`/api/products/${editId}`, productData, config);
        toast.success("Blueprint updated successfully!");
      } else {
        await axios.post('/api/products', productData, config);
        toast.success("Product materialized successfully!");
      }

      setTitle(''); setPrice(''); setCategory('Electronics'); setDescription(''); setBrand('Aurora'); setStock('10'); setEditId(null);
      const refresh = await axios.get('/api/products?limit=100');
      setProducts(refresh.data.data || []);
    } catch (err) {
      toast.error("Operation failed in presence");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Disintegrate this product from inventory?")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
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
    setBrand(p.brand || 'Aurora');
    setStock(p.stock || '10');
    setDescription(p.description);
    setImage(p.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="py-40 text-center font-bold text-slate-400 text-xl flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6" />
      Syncing Command Protocol...
    </div>
  );

  const isAdmin = (user && (user.role === 'admin' || user.email === 'ayushgupta1733@gmail.com')) ||
    (JSON.parse(localStorage.getItem('user') || 'null')?.email === 'ayushgupta1733@gmail.com');

  if (!isAdmin) {
    return (
      <div className="container py-40 text-center animate-fade-in">
        <h2 className="text-5xl font-bold text-slate-800 mb-6 tracking-tighter">ACCESS DENIED</h2>
        <p className="text-slate-500 font-bold text-xl opacity-80">Your identity does not possess required clearance.</p>
        <button onClick={() => window.location.href = '/'} className="mt-10 py-4 px-12 bg-slate-800 text-white rounded-2xl font-bold font-bold hover:bg-slate-900 transition-all">Return to Sanctuary</button>
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
          <div className="lg:col-span-1" style={{ alignSelf: 'start' }}>
            <div className="glass rounded-[40px] p-8 sticky top-28 border border-white/50 shadow-xl admin-sticky-card">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center justify-between">
                {editId ? "Update Blueprint" : "Materialize Item"}
                {editId && <button onClick={() => { setEditId(null); setTitle(''); }}><X size={20} className="text-slate-400" /></button>}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Signature Name" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} required />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Value (₹)" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                  <Input label="Inventory (Qty)" type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select className="admin-select" value={category} onChange={e => setCategory(e.target.value)}>
                      {['Electronics', 'Clothing', 'Books', 'Sports', 'Home', 'Beauty', 'Toys'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <Input label="Brand Signature" placeholder="Brand" value={brand} onChange={e => setBrand(e.target.value)} required />
                </div>

                <Input label="Aesthetic Visual (URL)" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
                
                <div className="relative group overflow-hidden rounded-3xl h-48 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center transition-all hover:border-pink-300">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <div className="text-center p-6">
                      <BarChart3 className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Intelligent Visual Preview</p>
                    </div>
                  )}
                  {image && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase tracking-widest bg-pink-600/80 px-4 py-2 rounded-full backdrop-blur-md">Materializing Visual</span>
                    </div>
                  )}
                </div>

                <div className="input-group flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest ml-4">Essence Description</label>
                  <textarea
                    className="input-field admin-textarea"
                    placeholder="Describe the product essence..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full py-4 text-white bg-pink-600 rounded-3xl font-bold text-lg hover:bg-pink-700 transition-all shadow-lg">
                  {editId ? "Confirm Update" : "Release to Presence"}
                </button>
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
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Status</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white/40">
                  {products.map(p => (
                    <tr key={p.id || p._id} className="admin-table-row transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="thumbnail-frame">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{p.title || p.name}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{p.brand || 'Aurora'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 flex items-center h-[72px]"><span className="px-2 py-1 bg-white rounded-md text-[10px] uppercase font-bold text-slate-400 border border-slate-100">{p.category}</span></td>
                      <td className="p-4 font-bold text-slate-800">₹{p.price}</td>
                      <td className="p-4">
                        <div className={`stock-badge ${p.stock > 20 ? 'stock-high' : p.stock > 5 ? 'stock-mid' : 'stock-low'}`}>
                          {p.stock > 20 ? 'Healthy' : p.stock > 5 ? 'Stable' : 'Critical'} • {p.stock}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditInit(p)} className="p-2 hover:text-blue-500 transition-colors" title="Edit Blueprint"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id || p._id)} className="p-2 hover:text-red-500 transition-colors" title="Disintegrate Item"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-20 text-center animate-fade-in">
                  <Package className="mx-auto text-slate-100 mb-4" size={64} />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items materialized in manifest</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-[40px] p-12 text-center border border-white/50 shadow-2xl animate-fade-in overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/20 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-pink-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-pink-500 shadow-inner">
              <BarChart3 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Global Ecosystem Analytics</h2>
            <p className="text-slate-500 font-medium mb-12">Deep mapping of your current digital marketplace presence and fragment distribution.</p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-8 bg-white/50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Inventory Health</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Total Products</span>
                    <span className="font-bold text-2xl text-slate-900">{stats?.totalProducts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Stock Available</span>
                    <span className="font-bold text-2xl text-slate-900">{stats?.totalStock || 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white/50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Avg Unit Value</span>
                    <span className="font-bold text-2xl text-pink-500">₹{stats?.avgPrice || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Category Depth</span>
                    <span className="font-bold text-2xl text-blue-500">{stats?.totalCategories || 0} Ranges</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
               <div className="flex items-center justify-center gap-2 text-slate-300 font-bold uppercase text-[10px] tracking-[0.2em]">
                 <RefreshCw size={12} className="animate-spin-slow" /> System Synchronized • Verified Presence
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
