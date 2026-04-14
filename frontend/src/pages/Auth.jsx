import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/auth/send-otp', { email });
      setStep(2);
      toast.success("Security token dispatched to your mail");
    } catch (err) {
      toast.error("Transmission failed. Please verify email.");
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/verify-otp', { email, otp });

      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success("Identity Verified. Presence Established.");
      navigate('/');
    } catch (err) {
      toast.error("Invalid token. Verification rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24 flex justify-center animate-fade-in">
      <div className="glass rounded-[50px] p-12 w-full max-w-lg border border-white/50 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />

        <div className="relative text-center mb-12">
          <div className="w-20 h-20 bg-pink-50 rounded-[35px] flex items-center justify-center mx-auto mb-6 text-pink-500 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tighter mb-2">Identify Yourself</h2>
          <p className="text-slate-400 font-medium text-sm tracking-widest uppercase">Secured Authentication Protocol</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-fade-in">
            <Input
              label="Presence Identifier (Email)"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full py-5 text-xl font-bold shadow-xl" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" /> : <>Request Token <ArrowRight className="ml-2" size={24} /></>}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-slate-500 font-bold text-sm mb-1">Confirming for:</p>
              <p className="text-pink-500 font-black tracking-tight">{email}</p>
            </div>
            <Input
              label="Verification Token (OTP)"
              placeholder="0000"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" className="w-full py-5 text-xl font-bold shadow-xl" disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" /> : "Establish Presence"}
            </Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-300 font-bold uppercase text-[10px] tracking-widest hover:text-pink-400 transition-colors mt-4">Reset Identifier</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
