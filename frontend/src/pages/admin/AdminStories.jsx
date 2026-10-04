import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await API.get('/admin/stories');
      setStories(res.data);
    } catch (err) {
      console.error('Error fetching admin stories:', err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      await API.delete(`/admin/stories/${storyId}`);
      toast.success('Story deleted');
      setStories(prev => prev.filter(s => s._id !== storyId));
    } catch (err) {
      toast.error('Could not delete story');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-pink-400" /> Stories Moderation
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stories.map(s => (
          <div key={s._id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-slate-800 group">
            <img src={s.mediaUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-xs text-white bg-black/60 p-2 rounded-xl">
              <span>@{s.author?.username}</span>
              <button onClick={() => handleDeleteStory(s._id)} className="text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
