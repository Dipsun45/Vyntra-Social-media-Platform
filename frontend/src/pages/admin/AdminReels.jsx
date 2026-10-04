import React, { useState, useEffect } from 'react';
import { Film, Trash2 } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminReels() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await API.get('/admin/reels');
      setReels(res.data);
    } catch (err) {
      console.error('Error fetching admin reels:', err);
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (window.confirm('Delete this Reel permanently?')) {
      try {
        await API.delete(`/admin/reels/${reelId}`);
        toast.success('Reel deleted');
        setReels(prev => prev.filter(r => r._id !== reelId));
      } catch (err) {
        toast.error('Could not delete Reel');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <Film className="w-8 h-8 text-purple-400" /> Reels Moderation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reels.map(reel => {
          const isImg = /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(reel.videoUrl) || (reel.videoUrl?.includes('/uploads/') && !reel.videoUrl?.match(/\.(mp4|webm|mov|avi|mkv)($|\?)/i));
          const poster = reel.thumbnailUrl || reel.videoUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';

          return (
            <div key={reel._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">@{reel.author?.username || 'user'}</span>
                <button onClick={() => handleDeleteReel(reel._id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950">
                <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
                {!isImg && (
                  <video src={reel.videoUrl} poster={poster} controls className="relative z-10 w-full h-full object-cover" />
                )}
              </div>
              <p className="text-xs text-slate-300 truncate">{reel.caption}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
