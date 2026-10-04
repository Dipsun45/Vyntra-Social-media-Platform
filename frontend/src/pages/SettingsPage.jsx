import React, { useState } from 'react';
import { Settings as SettingsIcon, Lock, Shield, Moon, Bell, LogOut, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setLoading(true);
      await API.put('/users/change-password', { currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
        <SettingsIcon className="w-7 h-7 text-brand-500" /> Account Settings
      </h1>

      {/* Theme Settings Card */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-brand-500" />
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Appearance Theme</h3>
            <p className="text-xs text-gray-500">Switch between Light Mode and Dark Mode</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Change Password Card */}
      <div className="glass-card rounded-3xl p-6 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-amber-500" /> Change Security Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-md hover:bg-brand-600 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Logout button */}
      <div className="pt-4">
        <button
          onClick={() => {
            logoutUser();
            navigate('/login');
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition"
        >
          <LogOut className="w-5 h-5" /> Logout from Vyntra
        </button>
      </div>
    </div>
  );
}
