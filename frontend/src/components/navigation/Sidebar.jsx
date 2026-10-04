import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Heart,
  PlusSquare,
  Bookmark,
  User,
  Settings,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ onOpenCreateModal }) {
  const { user, logoutUser, admin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Heart },
    { label: 'Create', onClick: onOpenCreateModal, icon: PlusSquare },
    { label: 'Saved', path: '/saved', icon: Bookmark },
    { label: 'Profile', path: `/profile/${user?.username}`, icon: User },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0c121e]/80 backdrop-blur-xl p-4 justify-between z-40">
      <div>
        {/* Logo */}
        <div className="px-3 py-4 mb-4">
          <Logo size="lg" />
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            if (item.onClick) {
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex items-center gap-4 w-full px-3 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-200 group"
                >
                  <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-3 rounded-xl font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-neon font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'text-brand-600 dark:text-brand-neon scale-105' : 'text-gray-600 dark:text-gray-300'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </button>

        {/* User Card & Logout */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-100/70 dark:bg-gray-800/40">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover border border-brand-500/30"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logoutUser();
                navigate('/login');
              }}
              title="Logout"
              className="p-1.5 text-gray-500 hover:text-red-500 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
