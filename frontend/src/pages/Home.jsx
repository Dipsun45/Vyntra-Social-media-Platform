import React, { useState, useEffect } from 'react';
import StoriesBar from '../components/story/StoriesBar';
import StoryViewer from '../components/story/StoryViewer';
import PostCard from '../components/post/PostCard';
import CommentModal from '../components/modals/CommentModal';
import CreateModal from '../components/modals/CreateModal';
import API from '../services/api';
import { UserPlus, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
    fetchSuggested();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts/feed');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggested = async () => {
    try {
      const res = await API.get('/users/suggested');
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error('Error fetching suggested users:', err);
    }
  };

  const handleFollowSuggested = async (userId) => {
    try {
      await API.post(`/follows/${userId}`);
      setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Follow failed', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed Column */}
      <div className="lg:col-span-2">
        {/* Stories Bar */}
        <StoriesBar
          onSelectStoryGroup={setActiveStoryGroup}
          onOpenCreateStory={() => setIsCreateOpen(true)}
        />

        {/* Create Post Prompt */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover border border-brand-500/40"
          />
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800/60 text-sm text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            What's on your mind, {user?.name?.split(' ')[0]}?
          </button>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-2xl p-4 h-96 animate-pulse bg-gray-200 dark:bg-gray-800/40" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto text-brand-500 mb-3" />
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">No posts in your feed yet</h3>
            <p className="text-sm mt-1">Follow creators or post your first photo to get started!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onDeletePost={id => setPosts(prev => prev.filter(p => p._id !== id))}
              onOpenComments={p => setSelectedPostForComments(p)}
            />
          ))
        )}
      </div>

      {/* Right Sidebar Widgets */}
      <div className="hidden lg:block space-y-6">
        {/* User Mini Profile */}
        <div className="glass-card rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-between">
          <Link to={`/profile/${user?.username}`} className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-500/40"
            />
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{user?.name}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>
          </Link>
        </div>

        {/* Suggested Creators */}
        {suggestedUsers.length > 0 && (
          <div className="glass-card rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-brand-500" /> Suggested for you
              </span>
              <Link to="/explore" className="text-xs text-brand-500 font-semibold hover:underline">
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {suggestedUsers.slice(0, 5).map(u => (
                <div key={u._id} className="flex items-center justify-between">
                  <Link to={`/profile/${u.username}`} className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-xs text-gray-900 dark:text-gray-100">{u.name}</p>
                      <p className="text-[11px] text-gray-500">@{u.username}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleFollowSuggested(u._id)}
                    className="text-xs font-bold text-brand-500 hover:text-brand-600 bg-brand-500/10 px-3 py-1.5 rounded-full transition"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Hashtags preview */}
        <div className="glass-card rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 dark:text-gray-100 mb-3">
            <TrendingUp className="w-4 h-4 text-cyan-500" /> Trending Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {['#technology', '#coding', '#cricket', '#travel', '#music'].map((tag, i) => (
              <Link
                key={i}
                to={`/hashtag/${tag.replace('#', '')}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-brand-500 hover:bg-brand-500 hover:text-white transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer Modal Overlay */}
      {activeStoryGroup && (
        <StoryViewer
          storyGroup={activeStoryGroup}
          onClose={() => setActiveStoryGroup(null)}
        />
      )}

      {/* Comment Modal */}
      {selectedPostForComments && (
        <CommentModal
          post={selectedPostForComments}
          isOpen={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}

      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={newPost => setPosts([newPost, ...posts])}
      />
    </div>
  );
}
