import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, Music, Eye, UserPlus, CheckCircle2, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CommentModal from '../components/modals/CommentModal';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReelForComments, setSelectedReelForComments] = useState(null);
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const [videoErrors, setVideoErrors] = useState({});
  const [loadedVideos, setLoadedVideos] = useState({});
  const [isPlayingMap, setIsPlayingMap] = useState({ 0: true });
  const audioRef = useRef(new Audio());
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchReels();
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const fetchReels = async () => {
    try {
      const res = await API.get('/reels');
      setReels(res.data);
    } catch (err) {
      console.error('Error fetching reels:', err);
    }
  };

  const handleLikeReel = async (reelId, index) => {
    try {
      const res = await API.post(`/reels/${reelId}/like`);
      setReels(prev =>
        prev.map((r, i) =>
          i === index
            ? { ...r, isLiked: res.data.liked, likesCount: res.data.likesCount }
            : r
        )
      );
    } catch (err) {
      toast.error('Failed to like reel');
    }
  };

  const handleToggleReelMusic = (reel) => {
    if (playingMusicId === reel._id) {
      audioRef.current.pause();
      setPlayingMusicId(null);
    } else {
      audioRef.current.src = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3';
      audioRef.current.play().catch(console.error);
      setPlayingMusicId(reel._id);
      toast.success(`Playing Audio: ${reel.music || 'Original Audio'}`);
    }
  };

  const isImageFile = (url) => {
    if (!url) return false;
    if (/\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(url)) return true;
    if (url.includes('/uploads/') && !url.match(/\.(mp4|webm|mov|avi|mkv)($|\?)/i)) return true;
    return false;
  };

  const handleTogglePlay = (reelId, idx) => {
    const videoEl = videoRefs.current[idx];
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play().then(() => {
        setIsPlayingMap(prev => ({ ...prev, [reelId]: true }));
      }).catch(err => {
        console.error('Play error:', err);
      });
    } else {
      videoEl.pause();
      setIsPlayingMap(prev => ({ ...prev, [reelId]: false }));
    }
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-4rem)] md:h-[90vh] py-4 snap-y snap-mandatory overflow-y-scroll no-scrollbar">
      {reels.map((reel, idx) => {
        const hasVideoError = videoErrors[reel._id];
        const isImage = isImageFile(reel.videoUrl) || hasVideoError;
        const posterUrl = reel.thumbnailUrl || reel.images?.[0] || reel.videoUrl || FALLBACK_POSTER;
        const isPlaying = isPlayingMap[reel._id] ?? (idx === 0);
        const isVideoReady = loadedVideos[reel._id];

        return (
          <div
            key={reel._id}
            className="snap-start relative w-full h-full bg-slate-950 rounded-3xl overflow-hidden mb-6 shadow-2xl flex items-center justify-center border border-gray-800"
          >
            {/* Poster / Background Photo Layer (Guarantees NO BLACK SCREEN) */}
            <img
              src={posterUrl}
              alt={reel.caption || "Reel background"}
              className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity duration-300"
            />

            {/* Video Player (If valid video) */}
            {!isImage && (
              <video
                ref={el => (videoRefs.current[idx] = el)}
                src={reel.videoUrl}
                poster={posterUrl}
                loop
                autoPlay={idx === 0}
                playsInline
                muted={isMuted}
                onCanPlay={() => {
                  setLoadedVideos(prev => ({ ...prev, [reel._id]: true }));
                }}
                onPlaying={() => {
                  setLoadedVideos(prev => ({ ...prev, [reel._id]: true }));
                  setIsPlayingMap(prev => ({ ...prev, [reel._id]: true }));
                }}
                onError={() => {
                  setVideoErrors(prev => ({ ...prev, [reel._id]: true }));
                }}
                className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-500 ${
                  isVideoReady ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                onClick={() => handleTogglePlay(reel._id, idx)}
              />
            )}

            {/* Play Overlay Icon if video is paused */}
            {!isImage && isVideoReady && !isPlaying && (
              <button
                onClick={() => handleTogglePlay(reel._id, idx)}
                className="absolute z-30 p-5 rounded-full bg-black/50 text-white backdrop-blur-md hover:scale-110 transition shadow-2xl cursor-pointer"
              >
                <Play className="w-10 h-10 fill-white ml-1" />
              </button>
            )}

            {/* Volume Control Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition shadow-lg"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>

            {/* Gradient Overlay for Controls */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 z-20 pointer-events-none" />

            {/* Right Action Icons Column */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-30">
              {/* Creator Avatar with Clickable Profile Link */}
              <Link to={`/profile/${reel.author?.username}`} className="relative group">
                <img
                  src={reel.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={reel.author?.username}
                  className="w-12 h-12 rounded-full border-2 border-brand-500 object-cover group-hover:scale-110 transition-transform shadow-lg"
                />
              </Link>

              {/* Like */}
              <button
                onClick={() => handleLikeReel(reel._id, idx)}
                className="flex flex-col items-center gap-1 group text-white"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:scale-110 transition shadow-lg">
                  <Heart className={`w-7 h-7 ${reel.isLiked ? 'text-pink-500 fill-pink-500' : ''}`} />
                </div>
                <span className="text-xs font-bold drop-shadow">{reel.likesCount || 0}</span>
              </button>

              {/* Comment */}
              <button
                onClick={() => setSelectedReelForComments(reel)}
                className="flex flex-col items-center gap-1 group text-white"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:scale-110 transition shadow-lg">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold drop-shadow">{reel.commentsCount || 0}</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/reels`);
                  toast.success('Reel link copied');
                }}
                className="flex flex-col items-center gap-1 text-white"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:scale-110 transition shadow-lg">
                  <Share2 className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold drop-shadow">Share</span>
              </button>
            </div>

            {/* Bottom Reel Details & Profile ID Link */}
            <div className="absolute bottom-6 left-4 right-16 z-30 text-white space-y-2">
              <Link to={`/profile/${reel.author?.username}`} className="inline-flex items-center gap-2 group">
                <span className="font-extrabold text-base group-hover:text-brand-500 transition drop-shadow">{reel.author?.name}</span>
                {reel.author?.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                <span className="text-xs text-brand-neon font-semibold group-hover:underline drop-shadow">@{reel.author?.username}</span>
              </Link>

              <p className="text-sm font-medium opacity-90 line-clamp-2 drop-shadow">{reel.caption}</p>

              {/* Playable Music Track */}
              <button
                onClick={() => handleToggleReelMusic(reel)}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-brand-neon hover:bg-black/70 transition cursor-pointer border border-white/10"
              >
                <Music className={`w-4 h-4 ${playingMusicId === reel._id ? 'animate-spin text-pink-400' : ''}`} />
                <span>🎵 {playingMusicId === reel._id ? 'Playing: ' : 'Play Audio: '} {reel.music || 'Original Audio'}</span>
              </button>
            </div>
          </div>
        );
      })}

      {/* Comments Drawer Modal */}
      {selectedReelForComments && (
        <CommentModal
          post={selectedReelForComments}
          isOpen={!!selectedReelForComments}
          onClose={() => setSelectedReelForComments(null)}
        />
      )}
    </div>
  );
}
