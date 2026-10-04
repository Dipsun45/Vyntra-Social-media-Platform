import React, { useState } from 'react';
import { X, Image, Video, MapPin, Music, Lock, Globe, Users, UploadCloud } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

import MusicSelectModal from './MusicSelectModal';

export default function CreateModal({ isOpen, onClose, onPostCreated }) {
  const [activeTab, setActiveTab] = useState('post'); // post, reel, story
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [musicTrack, setMusicTrack] = useState('');
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0 && !caption.trim()) {
      return toast.error('Please add media or write a caption');
    }

    setIsUploading(true);
    const formData = new FormData();

    if (activeTab === 'post') {
      selectedFiles.forEach(file => formData.append('files', file));
      formData.append('caption', caption);
      formData.append('location', location);
      formData.append('privacy', privacy);
      formData.append('musicTrack', musicTrack);

      try {
        const res = await API.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Post published successfully! 🚀');
        if (onPostCreated) onPostCreated(res.data);
        handleClose();
      } catch (err) {
        toast.error('Failed to create post');
      }
    } else if (activeTab === 'reel') {
      if (selectedFiles.length === 0) {
        setIsUploading(false);
        return toast.error('Photo or Video is required for a Reel');
      }
      formData.append('video', selectedFiles[0]);
      formData.append('caption', caption);
      formData.append('music', musicTrack || 'Original Audio');

      try {
        await API.post('/reels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Reel created successfully! 🎬');
        handleClose();
      } catch (err) {
        toast.error('Failed to publish Reel');
      }
    } else if (activeTab === 'story') {
      if (selectedFiles.length === 0) {
        setIsUploading(false);
        return toast.error('Media is required for a Story');
      }
      formData.append('media', selectedFiles[0]);
      formData.append('textOverlay', caption);

      try {
        await API.post('/stories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Story uploaded successfully! ✨');
        handleClose();
      } catch (err) {
        toast.error('Failed to publish Story');
      }
    }

    setIsUploading(false);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCaption('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {['post', 'reel', 'story'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedFiles([]);
                  setPreviews([]);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Create {tab}
              </button>
            ))}
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* File Picker Zone */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-brand-500 transition relative">
            <input
              type="file"
              multiple={activeTab === 'post'}
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-10 h-10 mx-auto text-brand-500 mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Drag & drop media here, or <span className="text-brand-500 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, MP4, WEBM (Photo & Video Reels supported)</p>
          </div>

          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((item, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-black">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Caption Input */}
          <div>
            <textarea
              rows={3}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write a caption... (e.g. #technology #coding)"
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-brand-500 transition resize-none"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {activeTab === 'post' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                <MapPin className="w-4 h-4 text-brand-500" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Add location"
                  className="w-full bg-transparent text-xs text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMusicModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-brand-500/30 text-xs font-bold text-brand-neon hover:bg-brand-500/20 transition text-left"
            >
              <Music className="w-4 h-4 animate-spin" />
              <span className="truncate">{musicTrack ? `Music: ${musicTrack}` : 'Choose Music Track 🎵'}</span>
            </button>
          </div>

          {/* Music Select Modal */}
          <MusicSelectModal
            isOpen={isMusicModalOpen}
            onClose={() => setIsMusicModalOpen(false)}
            selectedTrackTitle={musicTrack}
            onSelectTrack={trackName => setMusicTrack(trackName)}
          />

          {/* Privacy Select */}
          {activeTab === 'post' && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Post Privacy:</span>
              <select
                value={privacy}
                onChange={e => setPrivacy(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-2.5 py-1 font-medium outline-none"
              >
                <option value="public">Public</option>
                <option value="followers">Followers</option>
                <option value="private">Private</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-neon text-white font-bold shadow-lg hover:shadow-brand-500/25 transition disabled:opacity-50"
          >
            {isUploading ? 'Publishing...' : `Share ${activeTab.toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
}
