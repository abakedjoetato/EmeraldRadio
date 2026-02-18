const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set IO on app to be accessible in controllers
app.set('io', io);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Static assets for frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../app/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../app', 'dist', 'index.html'));
  });
}

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinStation', (stationSlug) => {
    socket.join(`station:${stationSlug}`);
    console.log(`Socket ${socket.id} joined station:${stationSlug}`);
  });

  socket.on('leaveStation', (stationSlug) => {
    socket.leave(`station:${stationSlug}`);
    console.log(`Socket ${socket.id} left station:${stationSlug}`);
  });

  socket.on('typing', (data) => {
    socket.to(`station:${data.stationSlug}`).emit('userTyping', {
      username: data.username
    });
  });

  socket.on('stopTyping', (data) => {
    socket.to(`station:${data.stationSlug}`).emit('userStoppedTyping');
  });

  socket.on('chatMessage', (data) => {
    // This is often handled via REST API first, then emitted
    // But we can handle pure socket messages here if needed
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
