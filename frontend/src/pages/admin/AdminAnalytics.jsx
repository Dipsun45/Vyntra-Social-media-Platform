import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  TrendingUp,
  PieChart as PieChartIcon,
  Users,
  Activity,
  Zap,
  Globe,
  Layers,
  Film,
  Sparkles,
  MessageSquare,
  Heart,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import API from '../../services/api';

export default function AdminAnalytics() {
  const [data, setData] = useState({
    timeframe: '7d',
    activeStats: {
      totalUsers: 0,
      activeUsers: 0,
      totalPosts: 0,
      totalReels: 0,
      activeReels: 0,
      totalStories: 0,
      activeStories: 0,
      totalComments: 0,
      totalLikes: 0,
      totalMessages: 0
    },
    chartData: [],
    contentPieData: [],
    topCreatorsData: [],
    demographicsRadarData: []
  });
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/analytics?timeframe=${timeframe}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#f59e0b'];

  const stats = data.activeStats || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-amber-500" /> Analytics Engine (7 Charts & Live Stats)
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Real-time multi-dimensional data visualization & active counts for Vyntra.
          </p>
        </div>

        {/* Timeframe Filter */}
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

      {/* TOP SUMMARY POINTS: Active Counts & Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-emerald-500 flex items-center justify-center gap-1">
            <Users className="w-3.5 h-3.5" /> Active Users
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.activeUsers || 0}
          </h4>
          <p className="text-[11px] text-gray-400">out of {stats.totalUsers || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-purple-500 flex items-center justify-center gap-1">
            <Film className="w-3.5 h-3.5" /> Active Reels
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.activeReels || 0}
          </h4>
          <p className="text-[11px] text-gray-400">total {stats.totalReels || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-pink-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Active Stories
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.activeStories || 0}
          </h4>
          <p className="text-[11px] text-gray-400">live now</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-blue-500 flex items-center justify-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Total Posts
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.totalPosts || 0}
          </h4>
          <p className="text-[11px] text-gray-400">published</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-rose-500 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5" /> Likes Count
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.totalLikes || 0}
          </h4>
          <p className="text-[11px] text-gray-400">reactions</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-md text-center">
          <span className="text-xs font-bold uppercase text-cyan-500 flex items-center justify-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Total Comments
          </span>
          <h4 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            {stats.totalComments || 0}
          </h4>
          <p className="text-[11px] text-gray-400">replies</p>
        </div>
      </div>

      {/* Grid of 7 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART 1: AreaChart — User Registrations & Growth */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" /> 1. User Registrations & Platform Growth
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">Area Chart</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="userGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="users" stroke="#f59e0b" fillOpacity={1} fill="url(#userGrad1)" name="New Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BarChart — Posts vs. Reels Created */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> 2. Posts vs. Reels Uploaded
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500">Bar Chart</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Bar dataKey="posts" fill="#6366f1" name="Posts" radius={[6, 6, 0, 0]} />
                <Bar dataKey="reels" fill="#a855f7" name="Reels" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: LineChart — Likes & Comments Daily Engagement */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-500" /> 3. Likes & Comments Engagement Trend
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500">Line Chart</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={3} name="Likes" />
                <Line type="monotone" dataKey="comments" stroke="#06b6d4" strokeWidth={3} name="Comments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: PieChart — Platform Content Distribution Ratio */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-cyan-500" /> 4. Content Distribution Breakdown
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500">Pie Chart</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.contentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {data.contentPieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: BarChart (Horizontal) — Top Active Creators */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" /> 5. Top Creators & Engagement Leaders
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">Horizontal Bar</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.topCreatorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="username" type="category" stroke="#64748b" width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
                <Bar dataKey="followers" fill="#10b981" name="Followers" radius={[0, 6, 6, 0]} />
                <Bar dataKey="posts" fill="#6366f1" name="Posts" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 6: RadarChart — Device & User Demographics */}
        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" /> 6. Device & Demographics Radar
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500">Radar Chart</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.demographicsRadarData}>
                <PolarGrid stroke="#64748b" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                <PolarRadiusAxis stroke="#64748b" />
                <Radar name="Male" dataKey="Male" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Female" dataKey="Female" stroke="#ec4899" fill="#ec4899" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHART 7: ComposedChart (Full Width) — Platform Traffic & Engagement Score */}
      <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-gray-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" /> 7. Total Platform Traffic & Engagement Score
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500">Composed Chart</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="traffic" fill="#06b6d4" name="Traffic Visits" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#f43f5e" strokeWidth={3} name="Engagement Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
