import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get('/comments');
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      toast.success('Comment deleted');
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      toast.error('Could not delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-cyan-400" /> Comments Control
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 divide-y divide-slate-800">
        {comments.map(c => (
          <div key={c._id} className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={c.author?.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <span className="font-bold text-xs text-slate-200">@{c.author?.username}</span>
                <p className="text-sm text-slate-300">{c.text}</p>
              </div>
            </div>

            <button
              onClick={() => handleDeleteComment(c._id)}
              className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
