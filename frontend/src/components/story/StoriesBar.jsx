import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StoriesBar({ onSelectStoryGroup, onOpenCreateStory }) {
  const { user } = useAuth();
  const [storyGroups, setStoryGroups] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await API.get('/stories');
        setStoryGroups(res.data);
      } catch (err) {
        console.error('Error loading stories:', err);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="glass-card rounded-2xl p-3 mb-6 flex items-center gap-4 overflow-x-auto no-scrollbar border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
      {/* Create Story Button */}
      <button
        onClick={onOpenCreateStory}
        className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
      >
        <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-brand-500 flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:scale-105 transition-transform">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt="My Avatar"
            className="w-full h-full rounded-full object-cover opacity-70 group-hover:opacity-90"
          />
          <div className="absolute bottom-0 right-0 bg-brand-500 text-white rounded-full p-1 shadow-lg">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Your Story</span>
      </button>

      {/* Active Stories Row */}
      {storyGroups.map((group, idx) => {
        const allViewed = group.stories.every(s => s.isViewed);
        return (
          <button
            key={idx}
            onClick={() => onSelectStoryGroup(group)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 ${
                allViewed
                  ? 'bg-gray-300 dark:bg-gray-700'
                  : 'bg-gradient-to-tr from-amber-500 via-pink-500 to-brand-neon animate-pulse-slow'
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f172a] overflow-hidden">
                <img
                  src={group.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={group.user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate w-16 text-center">
              {group.user?.username}
            </span>
          </button>
        );
      })}
    </div>
  );
}
