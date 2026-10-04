import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, User, Hash, FileText, Film, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], hashtags: [], posts: [], reels: [] });
  const [activeTab, setActiveTab] = useState('all'); // all, users, hashtags, posts

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults({ users: [], hashtags: [], posts: [], reels: [] });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    try {
      const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4 w-6 h-6 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search users, hashtags, posts, reels..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-xl outline-none focus:border-brand-500 transition"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        {['all', 'users', 'hashtags', 'posts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab
                ? 'bg-brand-500 text-white'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results view */}
      <div className="space-y-6">
        {/* Users Section */}
        {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
          <div className="glass-card rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80">
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" /> Users ({results.users.length})
            </h3>
            <div className="space-y-3">
              {results.users.map(u => (
                <Link key={u._id} to={`/profile/${u.username}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{u.name}</span>
                      {u.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    </div>
                    <span className="text-xs text-gray-500">@{u.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Section */}
        {(activeTab === 'all' || activeTab === 'hashtags') && results.hashtags.length > 0 && (
          <div className="glass-card rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80">
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-500" /> Hashtags ({results.hashtags.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.hashtags.map(ht => (
                <Link key={ht._id} to={`/hashtag/${ht.name}`} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-brand-500 font-semibold text-xs hover:bg-brand-500 hover:text-white transition">
                  #{ht.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
