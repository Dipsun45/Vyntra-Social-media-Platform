import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Film,
  Sparkles,
  MessageSquare,
  Heart,
  Mail,
  AlertTriangle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import API from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalReels: 0,
    totalStories: 0,
    totalComments: 0,
    totalLikes: 0,
    totalMessages: 0,
    totalReports: 0
  });

  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, [timeframe]);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(`/analytics?timeframe=${timeframe}`);
      setChartData(res.data.chartData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Users', value: stats.activeUsers, icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Reels', value: stats.totalReels, icon: Film, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Stories', value: stats.totalStories, icon: Sparkles, color: 'text-pink-500 dark:text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Total Comments', value: stats.totalComments, icon: MessageSquare, color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Total Messages', value: stats.totalMessages, icon: Mail, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Reports', value: stats.totalReports, icon: AlertTriangle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-500" /> Platform Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Real-time statistics & engagement control center.</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-1.5 rounded-xl shadow-sm">
          {['7d', '30d', '90d', '1y'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                timeframe === tf ? 'bg-amber-500 text-white dark:text-slate-950 shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 9 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between hover:border-amber-500/50 transition"
            >
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">{card.value.toLocaleString()}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Analytics Chart */}
      <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-extrabold text-lg text-gray-900 dark:text-slate-100 mb-6">User Registrations & Posts Trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="postGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Area type="monotone" dataKey="users" stroke="#f59e0b" fillOpacity={1} fill="url(#userGrad)" name="New Users" />
              <Area type="monotone" dataKey="posts" stroke="#6366f1" fillOpacity={1} fill="url(#postGrad)" name="Posts Created" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
