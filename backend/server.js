const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSocket = require('./socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/reels', require('./routes/reelRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/follows', require('./routes/followRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/saved', require('./routes/savedRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.get('/', (req, res) => {
  res.send({ status: 'OK', app: 'Vyntra API Server', tagline: 'Connect. Create. Share.' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} Not Found` });
});

// Setup Socket.IO
setupSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`Vyntra Server running on http://localhost:${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI || 'mongodb://localhost:27017/vyntra_db'}`);
  console.log(`=================================================`);
});
