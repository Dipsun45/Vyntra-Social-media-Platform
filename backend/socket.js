const socketIO = require('socket.io');

const onlineUsers = new Map(); // userId -> socketId

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    socket.on('setup', (userId) => {
      if (userId) {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });

    socket.on('join_chat', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('typing', ({ conversationId, userId, username }) => {
      socket.in(conversationId).emit('typing', { conversationId, userId, username });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.in(conversationId).emit('stop_typing', { conversationId, userId });
    });

    socket.on('new_message', (message) => {
      if (message.conversation) {
        socket.in(message.conversation._id || message.conversation).emit('message_received', message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

module.exports = setupSocket;
