import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { CartProvider } from './context/CartContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
