import React, { useState, useEffect } from 'react';
import { X, Send, Heart, Trash2 } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CommentModal({ post, isOpen, onClose }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post && isOpen) {
      fetchComments();
    }
  }, [post, isOpen]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/comments?postId=${post._id}`);
      setComments(res.data);
    } catch (err) {
      toast.error('Could not load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post('/comments', {
        postId: post._id,
        text: newComment
      });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Comments ({comments.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {loading ? (
            <p className="text-center text-sm text-gray-400">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 items-start group">
                <img
                  src={comment.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900 dark:text-gray-100">{comment.author?.username}</span>
                    {user && (user._id === comment.author?._id || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input */}
        <form onSubmit={handleAddComment} className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
          />
          <button type="submit" className="p-3 rounded-xl bg-brand-500 text-white font-semibold">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
