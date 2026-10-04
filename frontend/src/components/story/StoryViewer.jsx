import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Heart, Send, Eye, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function StoryViewer({ storyGroup, onClose }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [showViewers, setShowViewers] = useState(false);
  const [viewersList, setViewersList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const stories = storyGroup.stories || [];
  const currentStory = stories[currentIndex];
  const isOwner = user && currentStory && user._id === storyGroup.user?._id;

  useEffect(() => {
    if (!currentStory) return;
    setIsLiked(currentStory.isLiked || false);
    setProgress(0);

    // Record view
    API.post(`/stories/${currentStory._id}/view`).catch(() => {});

    if (isOwner) {
      API.get(`/stories/${currentStory._id}/viewers`).then(res => setViewersList(res.data)).catch(() => {});
    }
  }, [currentIndex, currentStory]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLikeStory = async () => {
    try {
      const res = await API.post(`/stories/${currentStory._id}/like`);
      setIsLiked(res.data.liked);
    } catch (err) {
      toast.error('Failed to like story');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await API.post('/messages', {
        conversationId: storyGroup.user?._id,
        text: `Replied to your story: "${replyText}"`
      });
      toast.success('Story reply sent in chat!');
      setReplyText('');
    } catch (err) {
      toast.error('Could not send reply');
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      {/* Background backdrop blur */}
      <div className="relative w-full max-w-md h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Story Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5 z-20">
          {stories.map((s, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header Info */}
        <div className="absolute top-7 left-4 right-4 flex items-center justify-between z-20">
          <Link
            to={`/profile/${storyGroup.user?.username}`}
            onClick={onClose}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img
              src={storyGroup.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
              alt={storyGroup.user?.username}
              className="w-9 h-9 rounded-full object-cover border border-white group-hover:scale-105 transition-transform"
            />
            <span className="text-white font-bold text-sm shadow-sm group-hover:underline">@{storyGroup.user?.username}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsPaused(!isPaused)} className="text-white p-1 hover:opacity-80">
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="text-white p-1 hover:opacity-80">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Click Zones for Prev / Next */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full" onClick={handlePrev} />
          <div className="w-2/3 h-full" onClick={handleNext} />
        </div>

        {/* Media Display */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          {currentStory.mediaType === 'video' ? (
            <video src={currentStory.mediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
          ) : (
            <img src={currentStory.mediaUrl} alt="Story" className="w-full h-full object-cover" />
          )}

          {/* Text Overlay if present */}
          {currentStory.textOverlay && (
            <div className="absolute bottom-24 px-6 text-center text-white font-bold text-xl drop-shadow-lg z-20">
              {currentStory.textOverlay}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3">
          {!isOwner ? (
            <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Reply to ${storyGroup.user?.username}...`}
                className="w-full bg-transparent text-white placeholder-white/70 text-sm outline-none"
              />
              <button type="submit" className="text-white">
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowViewers(!showViewers)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold"
            >
              <Eye className="w-4 h-4" /> {viewersList.length} Viewers
            </button>
          )}

          <button onClick={handleLikeStory} className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
            <Heart className={`w-6 h-6 ${isLiked ? 'text-pink-500 fill-pink-500' : ''}`} />
          </button>
        </div>

        {/* Viewers Modal Drawer */}
        {showViewers && (
          <div className="absolute inset-x-0 bottom-0 max-h-[60%] bg-gray-900 border-t border-gray-800 rounded-t-3xl p-4 z-30 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <span className="text-white font-bold text-sm">Story Viewers</span>
              <button onClick={() => setShowViewers(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 pt-3">
              {viewersList.map((viewer, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={viewer.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-white text-sm font-medium">{viewer.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
