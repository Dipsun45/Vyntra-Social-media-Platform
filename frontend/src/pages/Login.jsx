import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Logo from '../components/common/Logo';
import BackgroundCanvas from '../components/3d/BackgroundCanvas';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) {
      return toast.error('Please fill in all fields');
    }

    try {
      setLoading(true);
      await loginUser(login, password);
      toast.success('Welcome back to Vyntra!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#080c14] overflow-hidden">
      <BackgroundCanvas />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800/80 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size="xl" linkTo="" />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign in to connect, create, and share with your world.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Email or Username
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="aarav_shah or aarav@vyntra.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-brand-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 py-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700 text-brand-500" />
              Remember me
            </label>
            <span className="hover:underline cursor-pointer text-brand-500">Forgot password?</span>
          </div>

          {/* Quick Demo Login Chips */}
          <div className="pt-2 flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quick Demo Login:</span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => { setLogin('aarav_shah'); setPassword('password123'); }}
                className="px-3 py-1 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/30 text-xs font-semibold transition"
              >
                👤 aarav_shah
              </button>
              <button
                type="button"
                onClick={() => { setLogin('kabir_shah'); setPassword('password123'); }}
                className="px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/30 text-xs font-semibold transition"
              >
                👤 kabir_shah
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-neon to-cyan-500 text-white font-bold shadow-lg hover:shadow-brand-500/30 transition flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-500 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
