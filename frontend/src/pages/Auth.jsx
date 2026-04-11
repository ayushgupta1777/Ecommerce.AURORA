import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Button, Input } from '../components/ui';
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your primary email");
    try {
      setLoading(true);
      await authAPI.sendOtp(email);
      setOtpSent(true);
      toast.success("Identity shared! Check your email for the code.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate presence");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.verifyOtp(email, otp);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success("Identity Verified. Welcome back.");
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24 flex justify-center animate-fade-in">
      <div className="glass rounded-[50px] p-12 md:p-16 w-full max-w-xl shadow-2xl border border-white/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
        
        <div className="w-20 h-20 bg-pink-50 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-pink-500 shadow-inner">
          {otpSent ? <ShieldCheck size={40} /> : <Mail size={40} />}
        </div>
        
        <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">
          {otpSent ? "Sanctuary Secure" : "Welcome Presence"}
        </h2>
        <p className="text-slate-500 font-medium text-lg mb-10 max-w-sm mx-auto opacity-80 leading-relaxed">
          {otpSent ? `Shared a digital key with ${email}` : "Enter your email for secure and seamless access to your aesthetic experience."}
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <Input 
              label="Primary Email"
              type="email" 
              placeholder="identity@aurora.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Button type="submit" className="w-full py-5 text-xl font-bold shadow-2xl" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" /> : <>Access Account <ArrowRight size={20} className="ml-2" /></>}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <Input 
              label="Digital Key (OTP)"
              type="text" 
              placeholder="1234" 
              className="text-center tracking-widest font-bold"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              required 
            />
            <Button type="submit" variant="primary" className="w-full py-5 text-xl font-bold" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" /> : <>Verify Presence</>}
            </Button>
            <button 
              type="button" 
              onClick={() => setOtpSent(false)} 
              className="mt-6 text-sm font-bold text-pink-500 hover:underline uppercase tracking-widest"
            >
              Update Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
