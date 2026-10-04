import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, CheckCheck, Bell } from 'lucide-react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-brand-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-cyan-500" />;
      default: return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Bell className="w-7 h-7 text-brand-500" /> Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:underline"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="glass-card rounded-3xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-400">No notifications yet</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 flex items-center gap-4 transition ${
                !notif.isRead ? 'bg-brand-500/5 dark:bg-brand-500/10' : ''
              }`}
            >
              <div className="relative">
                <img src={notif.sender?.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-900 rounded-full shadow-md">
                  {getIcon(notif.type)}
                </div>
              </div>

              <div className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                <Link to={`/profile/${notif.sender?.username}`} className="font-bold text-gray-900 dark:text-gray-100 hover:underline">
                  {notif.sender?.name}
                </Link>{' '}
                {notif.type === 'like' && 'liked your post.'}
                {notif.type === 'comment' && `commented: "${notif.messageText}"`}
                {notif.type === 'follow' && 'started following you.'}
                {notif.type === 'message' && 'sent you a message.'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
