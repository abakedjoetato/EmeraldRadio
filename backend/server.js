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

// Validate Environment Variables
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
  console.error('CRITICAL ERROR: Missing required environment variables:', missingEnv.join(', '));
  console.error('Please check your .env file in the backend directory.');
  // Exit to prevent startup without critical configuration
  process.exit(1);
}

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
  .then(async () => {
    console.log('MongoDB Connected');
    // Seed default admin if no users exist
    const { User } = require('./models');
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
        await User.create({
          username: 'Emerald',
          email: 'admin@emeraldradio.com',
          password: adminPassword,
          displayName: 'Emerald Admin',
          role: 'admin'
        });
        console.log('Default admin user created (Username: Emerald)');
      }
    } catch (err) {
      console.error('Error seeding admin user:', err);
    }
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const routes = require('./routes');

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

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
