const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
// NOTE: This is the exact connection string you will use for MongoDB Compass
mongoose.connect('mongodb://localhost:27017/library-system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

// Make io accessible in routes via app
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    const { userId, role } = data;
    socket.join(userId);
    console.log(`User ${userId} joined room`);
    if (role === 'admin') {
      socket.join('admins');
      console.log(`User ${userId} joined admins room`);
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
    io.emit('bookReturnedAdmin', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import middleware and routes
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const requestRoutes = require('./routes/requests')(io);

app.use('/api/auth', authRoutes);
app.use('/api/books', authenticateToken, bookRoutes);
app.use('/api/requests', authenticateToken, requestRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
