import React, { useState, useEffect } from 'react';
import { Bookmark, FolderPlus, Trash2 } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function SavedPostsPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await API.get('/saved');
      setSavedItems(res.data.savedItems);
      setCollections(res.data.collections);
    } catch (err) {
      console.error('Error fetching saved content:', err);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const res = await API.post('/saved/collections', { name: newCollectionName });
      setCollections(prev => [...prev, res.data]);
      setNewCollectionName('');
      toast.success('Collection created!');
    } catch (err) {
      toast.error('Could not create collection');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-amber-400" /> Saved Posts & Collections
        </h1>
      </div>

      {/* New Collection Form */}
      <form onSubmit={handleCreateCollection} className="glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-800 flex items-center gap-3">
        <FolderPlus className="w-5 h-5 text-brand-500" />
        <input
          type="text"
          value={newCollectionName}
          onChange={e => setNewCollectionName(e.target.value)}
          placeholder="New collection name (e.g. Design Inspiration)"
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs">
          Create Collection
        </button>
      </form>

      {/* Collections Row */}
      {collections.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {collections.map(col => (
            <div key={col._id} className="glass-card p-4 rounded-2xl min-w-[140px] text-center border border-gray-200 dark:border-gray-800">
              <span className="font-bold text-sm text-gray-900 dark:text-white block">{col.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Saved Posts Grid */}
      <div className="grid grid-cols-3 gap-3">
        {savedItems.map(item => {
          const post = item.post;
          if (!post) return null;

          return (
            <div key={item._id} className="relative aspect-square rounded-2xl overflow-hidden bg-black group shadow-md">
              {post.images && post.images.length > 0 ? (
                <img src={post.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
              ) : (
                <div className="p-3 text-xs text-white flex items-center justify-center text-center h-full">
                  {post.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
