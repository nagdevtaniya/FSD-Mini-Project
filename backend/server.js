// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// Use PORT env or default
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',');

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected:', MONGODB_URI.startsWith('mongodb://') ? 'local' : 'atlas/remote'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS origins from env
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    methods: ["GET", "POST"]
  }
});

// Make io accessible in app and routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    const { userId, role } = data || {};
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    }
    if (role === 'admin') {
      socket.join('admins');
      console.log(`User joined admins room`);
    }
  });

  socket.on('bookCheckedOut', (data) => {
    io.emit('bookCheckedOut', data);
  });

  socket.on('newBook', (data) => {
    io.emit('newBook', data);
  });

  socket.on('bookUpdated', (data) => {
    io.emit('bookUpdated', data);
  });

  socket.on('bookReturnedAdmin', (data) => {
    console.log('Received bookReturnedAdmin from client:', data);
    io.to('admins').emit('bookReturnedAdmin', data);
  });

  socket.on('bookRemoved', (data) => {
    io.emit('bookRemoved', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import middleware and routes
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const requestRoutesFactory = require('./routes/requests');

// Routes (no auth for register/login)
app.use('/api/auth', authRoutes);
// Public routes
app.use('/api/books', bookRoutes);
// Protected routes
app.use('/api/requests', authenticateToken, requestRoutesFactory(io));

// Default health check
app.get('/', (req, res) => res.send('Library backend is running'));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} (PORT env: ${process.env.PORT || 'not set'})`);
});
