import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, CheckCircle2, Music, MapPin, Trash2, Flag } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function PostCard({ post: initialPost, onDeletePost, onOpenComments }) {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(initialPost.isLiked || false);
  const [likesCount, setLikesCount] = useState(initialPost.likesCount || 0);
  const [isSaved, setIsSaved] = useState(initialPost.isSaved || false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDoubleTap = () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
    if (!isLiked) {
      handleLike();
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.post(`/posts/${post._id}/save`);
      setIsSaved(res.data.saved);
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      if (onDeletePost) onDeletePost(post._id);
    } catch (err) {
      toast.error('Could not delete post');
    }
  };

  const handleReport = async () => {
    try {
      await API.post('/reports', {
        targetType: 'Post',
        targetId: post._id,
        reason: 'Spam'
      });
      toast.success('Report submitted for admin review');
      setShowMenu(false);
    } catch (err) {
      toast.error('Report submission failed');
    }
  };

  const isOwner = user && post.author && user._id === post.author._id;

  return (
    <article className="glass-card rounded-2xl overflow-hidden mb-6 border border-gray-200/80 dark:border-gray-800/80 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800/60">
        <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-3 group">
          <img
            src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={post.author?.username}
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-500/40 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition">
                {post.author?.name}
              </span>
              {post.author?.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>@{post.author?.username}</span>
              {post.location && (
                <span className="flex items-center gap-0.5 text-gray-400">
                  • <MapPin className="w-3 h-3" /> {post.location}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#161f32] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 z-20">
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              )}
              <button
                onClick={handleReport}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
              >
                <Flag className="w-4 h-4" /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Content with Double-Tap Heart */}
      <div className="relative bg-black/90 aspect-square max-h-[500px] flex items-center justify-center overflow-hidden cursor-pointer" onDoubleClick={handleDoubleTap}>
        {post.video ? (
          <video src={post.video} controls className="w-full h-full object-contain" />
        ) : post.images && post.images.length > 0 ? (
          <img src={post.images[0]} alt="Post Media" className="w-full h-full object-cover" />
        ) : (
          <div className="p-8 text-center text-lg font-medium text-gray-200">
            {post.caption}
          </div>
        )}

        {/* Double click heart animation overlay */}
        <AnimatePresence>
          {showHeartAnim && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-28 h-28 text-pink-500 fill-pink-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className="flex items-center gap-1.5 group"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isLiked ? 'text-pink-500 fill-pink-500' : 'text-gray-700 dark:text-gray-200 group-hover:text-pink-500'
              }`}
            />
          </motion.button>
          <button
            onClick={() => onOpenComments && onOpenComments(post)}
            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-brand-500 transition"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + `/post/${post._id}`);
              toast.success('Post link copied to clipboard!');
            }}
            className="text-gray-700 dark:text-gray-200 hover:text-cyan-500 transition"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button onClick={handleSave} className="text-gray-700 dark:text-gray-200 hover:text-amber-400 transition">
          <Bookmark className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Likes Count */}
      <div className="px-4 text-sm font-bold text-gray-900 dark:text-gray-100">
        {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
      </div>

      {/* Caption & Hashtags */}
      {post.caption && (
        <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          <Link to={`/profile/${post.author?.username}`} className="font-bold mr-2 text-gray-900 dark:text-gray-100 hover:text-brand-500 hover:underline">
            @{post.author?.username}
          </Link>
          <span>
            {post.caption.split(' ').map((word, i) =>
              word.startsWith('#') ? (
                <Link key={i} to={`/hashtag/${word.replace('#', '')}`} className="text-brand-500 font-medium hover:underline mr-1">
                  {word}
                </Link>
              ) : (
                word + ' '
              )
            )}
          </span>
        </div>
      )}

      {/* Music info if available with playable audio */}
      {post.musicTrack && (
        <div className="px-4 pb-2 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.activePostAudio && window.activePostAudio.src.includes('pixabay')) {
                if (window.activePostAudio.paused) {
                  window.activePostAudio.play();
                } else {
                  window.activePostAudio.pause();
                }
              } else {
                if (window.activePostAudio) window.activePostAudio.pause();
                window.activePostAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3');
                window.activePostAudio.play();
              }
            }}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/10 text-brand-neon hover:bg-brand-500/20 transition"
          >
            <Music className="w-3.5 h-3.5 animate-spin" />
            <span>🎵 Listen: {post.musicTrack}</span>
          </button>
        </div>
      )}

      {/* View Comments button */}
      <div className="px-4 pb-3">
        <button
          onClick={() => onOpenComments && onOpenComments(post)}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
        >
          View all {post.commentsCount || 0} comments
        </button>
      </div>
    </article>
  );
}
