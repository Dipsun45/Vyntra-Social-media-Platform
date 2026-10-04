import React, { useState, useEffect } from 'react';
import { Compass, TrendingUp, Sparkles, Film, UserPlus } from 'lucide-react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Explore() {
  const [data, setData] = useState({
    trendingPosts: [],
    popularReels: [],
    trendingHashtags: [],
    recommendedUsers: []
  });

  useEffect(() => {
    fetchExplore();
  }, []);

  const fetchExplore = async () => {
    try {
      const res = await API.get('/search/explore');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching explore data:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800/80 bg-gradient-to-r from-brand-600/10 via-brand-neon/10 to-cyan-500/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-brand-500" /> Explore Vyntra
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-xl">
            Discover trending content, viral reels, popular hashtags, and top creators across the global Vyntra network.
          </p>
        </div>
      </div>

      {/* Trending Hashtags row */}
      {data.trendingHashtags.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-500" /> Trending Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.trendingHashtags.map((ht) => (
              <Link
                key={ht._id}
                to={`/hashtag/${ht.name}`}
                className="glass-card px-4 py-2 rounded-2xl text-sm font-semibold text-brand-500 hover:bg-brand-500 hover:text-white transition"
              >
                #{ht.name} <span className="text-xs opacity-75 font-normal">({ht.postsCount} posts)</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Trending Posts */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> Trending Posts
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.trendingPosts.map((post) => (
            <div
              key={post._id}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-black shadow-lg cursor-pointer"
            >
              {post.images && post.images.length > 0 ? (
                <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="p-4 text-xs text-white flex items-center justify-center text-center h-full">
                  {post.caption}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                <span>❤️ {post.likesCount}</span>
                <span>💬 {post.commentsCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
