import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Key, Globe, Shield } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('Vyntra');
  const [description, setDescription] = useState('Connect. Create. Share.');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [commentSystemEnabled, setCommentSystemEnabled] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/admin/settings');
      setSiteName(res.data.siteName || 'Vyntra');
      setDescription(res.data.description || 'Connect. Create. Share.');
      setMaintenanceMode(res.data.maintenanceMode || false);
      setRegistrationEnabled(res.data.registrationEnabled !== false);
      setCommentSystemEnabled(res.data.commentSystemEnabled !== false);
      setAdminEmail(res.data.adminEmail || 'admin@gmail.com');
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put('/admin/settings', {
        siteName,
        description,
        maintenanceMode,
        registrationEnabled,
        commentSystemEnabled,
        adminEmail,
        newPassword: newPassword || undefined
      });
      toast.success('Admin platform settings updated successfully!');
      setNewPassword('');
    } catch (err) {
      toast.error('Could not update settings');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-amber-400" /> Platform Configuration
      </h1>

      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">General Branding</h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Website Name</label>
            <input
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tagline / Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">System Toggles</h3>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50">
            <div>
              <p className="font-bold text-sm text-slate-200">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Temporarily restrict normal user access</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={e => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/50">
            <div>
              <p className="font-bold text-sm text-slate-200">Registration Enabled</p>
              <p className="text-xs text-slate-500">Allow new user account registrations</p>
            </div>
            <input
              type="checkbox"
              checked={registrationEnabled}
              onChange={e => setRegistrationEnabled(e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="font-bold text-sm uppercase text-slate-400 tracking-wider">Admin Security Credentials</h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Change Admin Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow-lg hover:bg-amber-400 transition flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Save Configuration
        </button>
      </form>
    </div>
  );
}
