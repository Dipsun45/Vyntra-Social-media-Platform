import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Image, Smile, Users, MoreVertical, CheckCheck, Circle, Plus, UserPlus } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import EditGroupModal from '../components/modals/EditGroupModal';

export default function MessagesPage() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      if (socket) {
        socket.emit('join_chat', activeConv._id);
      }
    }
  }, [activeConv]);

  useEffect(() => {
    if (socket) {
      socket.on('message_received', (newMsg) => {
        if (activeConv && newMsg.conversation === activeConv._id) {
          setMessages(prev => [...prev, newMsg]);
          scrollToBottom();
        }
        fetchConversations();
      });

      socket.on('typing', (data) => {
        if (activeConv && data.conversationId === activeConv._id && data.userId !== user._id) {
          setIsTyping(true);
        }
      });

      socket.on('stop_typing', (data) => {
        if (activeConv && data.conversationId === activeConv._id) {
          setIsTyping(false);
        }
      });
    }
  }, [socket, activeConv]);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !activeConv) {
        setActiveConv(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await API.get(`/messages/${convId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!textInput.trim() && !selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('conversationId', activeConv._id);
      if (textInput) formData.append('text', textInput);
      if (selectedFile) formData.append('media', selectedFile);

      const res = await API.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages(prev => [...prev, res.data]);
      if (socket) {
        socket.emit('new_message', res.data);
      }

      setTextInput('');
      setSelectedFile(null);
      scrollToBottom();
      fetchConversations();
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const getOtherParticipant = (conv) => {
    if (conv.type === 'group') {
      return {
        name: conv.group?.name || 'Group Chat',
        avatar: conv.group?.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300'
      };
    }
    const other = conv.participants?.find(p => p._id !== user._id);
    return other || { name: 'User', avatar: '' };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-5rem)]">
      <div className="glass-card rounded-3xl h-full border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl flex overflow-hidden">
        
        {/* Left Conversation List */}
        <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">Messages</h2>
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 transition text-xs font-bold"
            >
              <Plus className="w-4 h-4" /> New Group
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/50">
            {conversations.map((conv) => {
              const info = getOtherParticipant(conv);
              const isActive = activeConv && activeConv._id === conv._id;
              const isOnline = onlineUsers.includes(info._id);

              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-4 flex items-center gap-3 transition text-left ${
                    isActive ? 'bg-brand-500/10 dark:bg-brand-500/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="relative">
                    <img src={info.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{info.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {conv.lastMessage?.text || 'Sent an attachment'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation Chat Thread */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-[#0c121e]/50">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img src={getOtherParticipant(activeConv).avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-brand-500/30" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{getOtherParticipant(activeConv).name}</h3>
                    {activeConv.type === 'group' && (
                      <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Group
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-500 font-medium">
                    {isTyping ? 'typing...' : activeConv.type === 'group' ? `${activeConv.group?.members?.length || 0} members` : 'Active Now'}
                  </span>
                </div>
              </div>

              {activeConv.type === 'group' && (
                <button
                  onClick={() => setIsEditGroupOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <MoreVertical className="w-4 h-4" /> Group Info & Settings
                </button>
              )}
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender?._id === user._id;

                return (
                  <div key={msg._id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img src={msg.sender?.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <div
                      className={`max-w-xs md:max-w-md p-3.5 rounded-2xl shadow-sm text-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-brand-600 to-brand-neon text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {msg.mediaUrl && (
                        <img src={msg.mediaUrl} alt="Media" className="rounded-xl mb-2 max-h-60 object-cover" />
                      )}
                      {msg.text && <p>{msg.text}</p>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] flex items-center gap-3">
              <label className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <Image className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={e => setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none"
              />

              <button type="submit" className="p-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={newGroup => {
          fetchConversations();
        }}
      />

      {/* Edit Group Modal */}
      {activeConv && activeConv.group && (
        <EditGroupModal
          group={activeConv.group}
          isOpen={isEditGroupOpen}
          onClose={() => setIsEditGroupOpen(false)}
          onGroupUpdated={updatedGroup => {
            fetchConversations();
            if (updatedGroup) {
              setActiveConv(prev => ({ ...prev, group: updatedGroup }));
            }
          }}
        />
      )}
    </div>
  );
}
