import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Grid, Film, Bookmark, Settings, CheckCircle2, MapPin, Link as LinkIcon, Edit3, UserPlus, UserCheck, MessageSquare } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // posts, reels, saved
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/profile/${username}`);
      setProfileUser(res.data);
      setIsFollowing(res.data.isFollowing);

      const postsRes = await API.get(`/posts/user/${username}`);
      setUserPosts(postsRes.data);
    } catch (err) {
      toast.error('User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const res = await API.post(`/follows/${profileUser._id}`);
      setIsFollowing(res.data.following);
      setProfileUser(prev => ({
        ...prev,
        followersCount: res.data.following ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1)
      }));
    } catch (err) {
      toast.error('Follow request failed');
    }
  };

  const startDirectMessage = async () => {
    try {
      const res = await API.post('/conversations/direct', { targetUserId: profileUser._id });
      navigate('/messages');
    } catch (err) {
      toast.error('Could not open chat');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (!profileUser) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  const isSelf = currentUser && currentUser._id === profileUser._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={profileUser.avatar}
            alt=""
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-brand-500/40 shadow-xl"
          />

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{profileUser.name}</h1>
                  {profileUser.isVerified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">@{profileUser.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                {isSelf ? (
                  <>
                    <Link
                      to="/settings/edit-profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition ${
                        isFollowing
                          ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'bg-brand-500 text-white hover:bg-brand-600'
                      }`}
                    >
                      {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={startDirectMessage}
                      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center md:justify-start gap-8 py-2 border-y border-gray-100 dark:border-gray-800 text-sm">
              <div><span className="font-extrabold text-gray-900 dark:text-white">{userPosts.length}</span> <span className="text-gray-500">posts</span></div>
              <div><span className="font-extrabold text-gray-900 dark:text-white">{profileUser.followersCount}</span> <span className="text-gray-500">followers</span></div>
              <div><span className="font-extrabold text-gray-900 dark:text-white">{profileUser.followingCount}</span> <span className="text-gray-500">following</span></div>
            </div>

            {/* Bio & Details */}
            {profileUser.bio && <p className="text-sm text-gray-800 dark:text-gray-200">{profileUser.bio}</p>}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-500">
              {profileUser.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profileUser.location}</span>}
              {profileUser.website && (
                <a href={profileUser.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-500 font-semibold hover:underline">
                  <LinkIcon className="w-3.5 h-3.5" /> {profileUser.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex justify-center border-b border-gray-200 dark:border-gray-800 gap-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 pb-3 font-bold text-sm border-b-2 transition ${
            activeTab === 'posts' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500'
          }`}
        >
          <Grid className="w-4 h-4" /> POSTS
        </button>
        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 pb-3 font-bold text-sm border-b-2 transition ${
              activeTab === 'saved' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500'
            }`}
          >
            <Bookmark className="w-4 h-4" /> SAVED
          </button>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-3">
        {userPosts.map(post => (
          <div key={post._id} className="relative aspect-square rounded-2xl overflow-hidden bg-black group shadow-md">
            {post.images && post.images.length > 0 ? (
              <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="p-3 text-xs text-white flex items-center justify-center text-center h-full">
                {post.caption}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white font-bold text-sm">
              <span>❤️ {post.likesCount}</span>
              <span>💬 {post.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
