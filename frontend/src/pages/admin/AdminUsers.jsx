import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, CheckCircle2, Trash2, Ban, Shield } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/block`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error('Block status update failed');
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/verify`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error('Verification toggle failed');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to permanently delete user @${username}?`)) {
      try {
        await API.delete(`/admin/users/${userId}`);
        toast.success(`User @${username} deleted`);
        setUsers(prev => prev.filter(u => u._id !== userId));
      } catch (err) {
        toast.error('Could not delete user');
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-500" /> User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Audit, block, verify, or delete platform accounts.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, username, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 shadow-sm outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800 dark:text-slate-300">
            <thead className="bg-gray-100 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email / Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900 dark:text-slate-100">{u.name}</span>
                        {u.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                      </div>
                      <span className="text-xs text-gray-500">@{u.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-medium text-gray-800 dark:text-slate-300">{u.email}</div>
                    <div className="text-xs text-gray-500">{u.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        u.status === 'blocked' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-xs text-gray-500 dark:text-slate-400 uppercase">{u.role}</td>
                  <td className="p-4 text-xs text-gray-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleVerify(u._id)}
                      title="Toggle Verify"
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 text-xs font-bold"
                    >
                      {u.isVerified ? 'Unverify' : 'Verify'}
                    </button>

                    <button
                      onClick={() => handleToggleBlock(u._id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        u.status === 'blocked'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30'
                      }`}
                    >
                      {u.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(u._id, u.username)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
