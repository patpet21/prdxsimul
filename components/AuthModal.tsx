
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Mail, Lock, User, Globe } from 'lucide-react';

interface AuthModalProps {
  onSuccess: () => void;
  onBack?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('');
  
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              country: country
            }
          }
        });
        if (error) throw error;
      }
      
      // Success
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fadeIn p-4 overflow-y-auto">
      
      {/* Main Card Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden border border-white/10 relative min-h-[600px]">
        
        {/* Left Side: Visual Brand Experience */}
        <div className="w-full md:w-5/12 bg-slate-900 text-white p-8 md:p-12 relative flex flex-col justify-between overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

            <div className="relative z-10">
                {/* Back Button */}
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                )}

                {/* Logo & Headline */}
                <div className="mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/30 mb-6">
                        P
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-4">
                        Tokenize the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Future of Assets.</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Join the premier platform for real-world asset fractionalization. 
                        Secure, compliant, and powered by blockchain technology.
                    </p>
                </div>
            </div>

            {/* Social Proof / Footer */}
            <div className="relative z-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <span className="text-xs font-bold text-white">1000+ Investors</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Secured by Supabase & Ethereum</p>
            </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="w-full md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center">
            
            <div className="max-w-md mx-auto w-full">
                
                {/* Toggle Switch */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-8 relative w-fit mx-auto md:mx-0">
                    <button 
                        onClick={() => { setIsLogin(true); setError(null); }}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Log In
                    </button>
                    <button 
                        onClick={() => { setIsLogin(false); setError(null); }}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 font-display mb-2">
                        {isLogin ? 'Welcome Back' : 'Create your account'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isLogin ? 'Enter your credentials to access your portfolio.' : 'Start tokenizing your assets in minutes.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">!</div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {!isLogin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slideUp">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Country</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        placeholder="USA"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                required 
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        isLoading={loading}
                        className="w-full py-4 text-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        {isLogin ? 'Access Dashboard' : 'Create Free Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        {isLogin ? "New to PropertyDEX? " : "Already have an account? "}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2 transition-colors"
                        >
                            {isLogin ? 'Create an account' : 'Log in here'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
