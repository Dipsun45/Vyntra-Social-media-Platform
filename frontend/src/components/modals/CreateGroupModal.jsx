import React, { useState, useEffect } from 'react';
import { X, Users, UploadCloud, Check } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users/suggested');
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error('Error fetching users for group:', err);
    }
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uId => uId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Group name is required');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('memberIds', JSON.stringify(selectedUserIds));
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await API.post('/groups', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Group Chat created successfully! 👥');
      if (onGroupCreated) onGroupCreated(res.data);
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedUserIds([]);
    setAvatarFile(null);
    setAvatarPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" /> Create New Group Chat
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-brand-500 overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-gray-400" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">Group Icon</p>
              <p className="text-xs text-gray-500">Upload custom group avatar</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Vyntra Tech Creators 🌐"
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Topic or guidelines of this group..."
              className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Member Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Add Members ({selectedUserIds.length} selected)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {suggestedUsers.map(user => {
                const isSelected = selectedUserIds.includes(user._id);
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleSelectUser(user._id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-xs text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-[11px] text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-400'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-neon text-white font-bold shadow-lg hover:shadow-brand-500/30 transition disabled:opacity-50"
          >
            {loading ? 'Creating Group...' : 'Create Group Chat'}
          </button>
        </form>
      </div>
    </div>
  );
}
