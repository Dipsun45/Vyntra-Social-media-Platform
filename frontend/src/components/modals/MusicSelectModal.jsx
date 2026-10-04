import React, { useState, useRef } from 'react';
import { X, Play, Pause, Music, Check } from 'lucide-react';
import { MUSIC_TRACKS } from '../../utils/musicTracks';

export default function MusicSelectModal({ isOpen, onClose, onSelectTrack, selectedTrackTitle }) {
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(new Audio());

  if (!isOpen) return null;

  const handleTogglePlay = (track) => {
    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = track.url;
      audioRef.current.play().catch(console.error);
      setPlayingTrackId(track.id);
    }
  };

  const handleChoose = (track) => {
    audioRef.current.pause();
    setPlayingTrackId(null);
    onSelectTrack(`${track.title} - ${track.artist}`);
    onClose();
  };

  const handleClose = () => {
    audioRef.current.pause();
    setPlayingTrackId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Music className="w-5 h-5 text-brand-neon animate-spin" /> Select Audio Music Track
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Music List */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {MUSIC_TRACKS.map((track) => {
            const isPlaying = playingTrackId === track.id;
            const isSelected = selectedTrackTitle?.includes(track.title);

            return (
              <div
                key={track.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden group">
                    <img src={track.cover} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(track)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white transition"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{track.title}</h4>
                    <p className="text-xs text-gray-500">{track.artist} • <span className="text-brand-500 font-semibold">{track.category}</span></p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleChoose(track)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-brand-500 hover:text-white'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
