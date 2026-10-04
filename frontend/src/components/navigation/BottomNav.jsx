import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Film, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BottomNav({ onOpenCreateModal }) {
  const { user } = useAuth();

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Create', onClick: onOpenCreateModal, icon: PlusSquare },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Profile', path: `/profile/${user?.username}`, icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-40 px-2">
      {items.map((item, idx) => {
        const Icon = item.icon;
        if (item.onClick) {
          return (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center text-brand-600 dark:text-brand-neon p-2"
            >
              <div className="p-1.5 rounded-xl bg-brand-500/10 active:scale-95 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
            </button>
          );
        }

        return (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? 'text-brand-600 dark:text-brand-neon font-bold scale-110' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <Icon className="w-6 h-6" />
          </NavLink>
        );
      })}
    </div>
  );
}
