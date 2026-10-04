import React, { useState, useEffect } from 'react';
import { FileText, Trash2, EyeOff, Eye } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/admin/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching admin posts:', err);
    }
  };

  const handleToggleHide = async (postId) => {
    try {
      const res = await API.put(`/admin/posts/${postId}/toggle-hide`);
      toast.success(res.data.message);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to toggle post visibility');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete this post permanently?')) {
      try {
        await API.delete(`/admin/posts/${postId}`);
        toast.success('Post removed');
        setPosts(prev => prev.filter(p => p._id !== postId));
      } catch (err) {
        toast.error('Could not delete post');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-400" /> Posts Moderation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <img src={post.author?.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="font-bold text-xs text-slate-100">{post.author?.name}</p>
                <p className="text-[11px] text-slate-500">@{post.author?.username}</p>
              </div>
            </div>

            {post.images && post.images.length > 0 && (
              <img src={post.images[0]} alt="" className="w-full h-44 object-cover rounded-xl" />
            )}

            <p className="text-xs text-slate-300 line-clamp-2">{post.caption}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => handleToggleHide(post._id)}
                className="flex items-center gap-1.5 text-amber-400 hover:underline"
              >
                {post.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {post.isHidden ? 'Restore Post' : 'Hide Post'}
              </button>

              <button
                onClick={() => handleDeletePost(post._id)}
                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
