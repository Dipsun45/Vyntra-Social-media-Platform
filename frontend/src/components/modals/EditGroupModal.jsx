import React, { useState, useEffect } from 'react';
import { X, Shield, Crown, UserPlus, Trash2, Camera, Lock, Check } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function EditGroupModal({ group: initialGroup, isOpen, onClose, onGroupUpdated }) {
  const { user } = useAuth();
  const [group, setGroup] = useState(initialGroup);
  const [name, setName] = useState(initialGroup?.name || '');
  const [description, setDescription] = useState(initialGroup?.description || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initialGroup?.avatar);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = user && group?.admins?.some(a => (a._id || a) === user._id);

  useEffect(() => {
    if (initialGroup) {
      setGroup(initialGroup);
      setName(initialGroup.name);
      setDescription(initialGroup.description || '');
      setAvatarPreview(initialGroup.avatar);
    }
  }, [initialGroup]);

  useEffect(() => {
    if (isOpen) {
      API.get('/users/suggested').then(res => setAllUsers(res.data)).catch(() => {});
    }
  }, [isOpen]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateGroupInfo = async (e) => {
    e.preventDefault();
    if (!isAdmin) return toast.error('Only Group Admin can make changes');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await API.put(`/groups/${group._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setGroup(res.data);
      toast.success('Group details updated! ⚡');
      if (onGroupUpdated) onGroupUpdated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAdmin = async (targetUserId, targetUsername) => {
    if (!isAdmin) return toast.error('Only current Group Admin can assign admin role');
    try {
      const res = await API.put(`/groups/${group._id}/admin`, { targetUserId });
      toast.success(`@${targetUsername} is now the Group Admin! 👑`);
      setGroup(res.data.group);
      if (onGroupUpdated) onGroupUpdated(res.data.group);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update admin');
    }
  };

  const handleAddMember = async (userId) => {
    if (!isAdmin) return toast.error('Only Group Admin can add members');
    try {
      const res = await API.post(`/groups/${group._id}/members`, { userId });
      setGroup(res.data);
      toast.success('Member added to group');
      if (onGroupUpdated) onGroupUpdated(res.data);
    } catch (err) {
      toast.error('Could not add member');
    }
  };

  const handleRemoveMember = async (userId, memberUsername) => {
    if (!isAdmin && user._id !== userId) {
      return toast.error('Only Group Admin can remove members');
    }
    try {
      await API.delete(`/groups/${group._id}/members/${userId}`);
      toast.success(`Removed @${memberUsername}`);
      setGroup(prev => ({
        ...prev,
        members: prev.members.filter(m => (m._id || m) !== userId)
      }));
      if (onGroupUpdated) onGroupUpdated();
    } catch (err) {
      toast.error('Could not remove member');
    }
  };

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Group Chat Info & Settings</h3>
            {isAdmin ? (
              <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase bg-amber-500/20 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Crown className="w-3.5 h-3.5" /> Group Admin
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> Member View
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {!isAdmin && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" /> Only the Group Admin can edit group name, icon, or manage members.
            </div>
          )}

          {/* Group Details Form */}
          <form onSubmit={handleUpdateGroupInfo} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-brand-500 bg-gray-100 dark:bg-gray-800">
                <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                {isAdmin && (
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition cursor-pointer">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Group Name</label>
                <input
                  type="text"
                  value={name}
                  disabled={!isAdmin}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-gray-100 disabled:opacity-75 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                disabled={!isAdmin}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 disabled:opacity-75 outline-none resize-none"
              />
            </div>

            {isAdmin && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition"
              >
                Save Group Changes
              </button>
            )}
          </form>

          {/* Group Members List */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Group Members ({group.members?.length || 0})
              </h4>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>

            {/* Add Member Dropdown */}
            {showAddMember && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Select user to add:</p>
                <div className="max-h-36 overflow-y-auto space-y-2">
                  {allUsers
                    .filter(u => !group.members?.some(m => (m._id || m) === u._id))
                    .map(u => (
                      <div key={u._id} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-gray-800">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{u.name} (@{u.username})</span>
                        <button
                          onClick={() => handleAddMember(u._id)}
                          className="px-2.5 py-1 rounded-lg bg-brand-500 text-white text-[11px] font-bold"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Existing Members */}
            <div className="space-y-2">
              {group.members?.map(m => {
                const memberId = m._id || m;
                const isGroupAdmin = group.admins?.some(a => (a._id || a) === memberId);

                return (
                  <div key={memberId} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900 dark:text-gray-100">{m.name || 'Member'}</span>
                          {isGroupAdmin && (
                            <span className="flex items-center gap-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-500 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                              <Crown className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500">@{m.username || 'user'}</span>
                      </div>
                    </div>

                    {isAdmin && memberId !== user._id && (
                      <div className="flex items-center gap-2">
                        {!isGroupAdmin && (
                          <button
                            onClick={() => handleSetAdmin(memberId, m.username)}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 text-[11px] font-bold flex items-center gap-1"
                          >
                            <Crown className="w-3 h-3" /> Make Admin
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(memberId, m.username)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
