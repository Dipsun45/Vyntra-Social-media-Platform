import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Sun, Moon } from 'lucide-react';
import Logo from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';

export default function MobileHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 h-14 bg-white/90 dark:bg-[#0c121e]/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-40">
      <Logo size="sm" />
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
        <Link to="/notifications" className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
          <Heart className="w-5 h-5" />
        </Link>
        <Link to="/messages" className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
          <MessageSquare className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
