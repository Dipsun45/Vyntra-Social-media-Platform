import React, { useState, useEffect } from 'react';
import { useParams } from 'react';
import { Hash, Sparkles } from 'lucide-react';
import API from '../services/api';
import PostCard from '../components/post/PostCard';

export default function HashtagPage() {
  const { tag } = useParams();
  const [data, setData] = useState({ tag, postsCount: 0, posts: [], reels: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHashtagData();
  }, [tag]);

  const fetchHashtagData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/search/hashtag/${tag}`);
      setData(res.data);
    } catch (err) {
      console.error('Error loading hashtag page:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hashtag Header */}
      <div className="glass-card rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
          #
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">#{tag}</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">{data.postsCount} posts on Vyntra</p>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {data.posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
