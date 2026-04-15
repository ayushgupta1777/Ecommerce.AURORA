// Central API base URL config
// In development: uses http://localhost:3001 (from .env)
// In production (Vercel): uses https://ecommerce-aurora.onrender.com (from .env.production)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-aurora.onrender.com';

export default BASE_URL;
