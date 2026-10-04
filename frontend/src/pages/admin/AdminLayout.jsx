import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Film,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  BarChart2,
  Settings,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Posts Control', path: '/admin/posts', icon: FileText },
    { label: 'Reels Moderation', path: '/admin/reels', icon: Film },
    { label: 'Stories Control', path: '/admin/stories', icon: Sparkles },
    { label: 'Comments Control', path: '/admin/comments', icon: MessageSquare },
    { label: 'Reports & Audits', path: '/admin/reports', icon: AlertTriangle },
    { label: 'Analytics Engine', path: '/admin/analytics', icon: BarChart2 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 flex transition-colors duration-300">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 flex flex-col justify-between h-screen sticky top-0 shadow-lg">
        <div>
          <div className="px-3 py-3 mb-6 flex items-center justify-between">
            <Logo size="md" linkTo="" />
            <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
              Admin
            </span>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-md font-bold'
                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/60 hover:text-gray-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-800">
          {/* Admin Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </div>
          </button>

          <button
            onClick={() => {
              logoutAdmin();
              navigate('/admin/login');
            }}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" /> Exit Admin Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
