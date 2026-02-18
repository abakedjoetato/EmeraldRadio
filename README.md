# Emerald Radio - Enterprise 24/7 Web Radio Platform

A state-of-the-art, enterprise-grade, production-ready web radio platform with synchronized YouTube playlist streaming, live chat, and comprehensive admin dashboard.

![Emerald Radio](https://img.shields.io/badge/Emerald-Radio-00D084?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

## Features

### Core Features
- **Synchronized Playback**: All listeners hear the same song at the same timestamp
- **Multi-Station Support**: Create and manage multiple radio stations
- **YouTube Integration**: Stream from YouTube playlists with automatic looping
- **Live Chat**: Real-time chat per station with Socket.IO
- **Listener Counter**: Real-time listener count tracking
- **Favorites System**: Users can favorite stations

### Admin Features
- **Role-Based Access Control**: Admin and Manager roles
- **Station Management**: Create, edit, delete, and customize stations
- **Landing Page Editor**: Customize homepage with drag-and-drop sections
- **User Management**: Create and manage admin/manager accounts
- **Dashboard Analytics**: View listener stats and station performance
- **Theme Customization**: Custom colors and branding per station

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **bcrypt Password Hashing**: Industry-standard password security
- **MongoDB Atlas**: Cloud database with automatic scaling
- **Socket.IO**: Real-time bidirectional communication
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Beautiful dark UI with emerald accents

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui components
- Zustand for state management
- Socket.IO client for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Socket.IO for WebSockets
- JWT for authentication
- bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- YouTube Data API key (optional, for enhanced features)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/emerald-radio.git
cd emerald-radio

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../app
npm install
```

### 2. Environment Configuration

#### Backend (.env)
Create a `.env` file in the `/backend` directory:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/emerald_radio

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin Configuration
DEFAULT_ADMIN_PASSWORD=YourSecureAdminPassword123!

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
Create a `.env` file in the `/app` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Replace `USERNAME`, `PASSWORD`, and `cluster` in your `.env` file

### 4. Run the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd app
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Socket.IO: http://localhost:5000

### 5. Default Admin Login

- **Username**: `Emerald`
- **Password**: Set via `DEFAULT_ADMIN_PASSWORD` environment variable

## Deployment

### Deploy to Vercel (Frontend)

```bash
cd app
npm run build
vercel --prod
```

### Deploy to Render/Railway (Backend)

1. Push your code to GitHub
2. Connect your repository to Render or Railway
3. Set environment variables in the dashboard
4. Deploy!

### Environment Variables for Production

```env
# Backend
MONGODB_URI_PROD=mongodb+srv://...
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

## API Documentation

### Authentication
- `POST /api/auth/login` - Login with username and password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Stations (Public)
- `GET /api/stations` - Get all active stations
- `GET /api/stations/featured` - Get featured stations
- `GET /api/stations/:slug` - Get station by slug
- `GET /api/stations/:slug/sync` - Get sync data for playback

### Admin (Protected)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/stations` - Get all stations
- `POST /api/admin/stations` - Create new station
- `PUT /api/admin/stations/:id` - Update station
- `DELETE /api/admin/stations/:id` - Delete station
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)

### Chat
- `GET /api/chat/:stationSlug` - Get chat messages
- `POST /api/chat/:stationSlug` - Send message

### Favorites (Protected)
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:stationId` - Add to favorites
- `DELETE /api/favorites/:stationId` - Remove from favorites

## Project Structure

```
emerald-radio/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Socket.IO services
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   └── .env.example         # Environment template
│
├── app/                     # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   └── .env.example         # Environment template
│
└── README.md                # This file
```

## User Roles

### Admin
- Full system control
- Create/delete admin and manager accounts
- Create/edit/delete stations
- Customize landing page
- Access to all features

### Manager
- Create and edit stations
- Customize station pages
- Edit playlist links
- Reset own password
- Cannot create/delete admins

## Synchronized Playback

The platform uses server-time synchronization to ensure all listeners hear the same point in the broadcast:

1. Server stores `playlistStartTime` (Unix timestamp)
2. Client calculates elapsed time: `now - startTime`
3. Position in playlist: `elapsed % playlistDuration`
4. YouTube player seeks to calculated position on join

## Security Features

- JWT authentication with secure token storage
- bcrypt password hashing (12 rounds)
- Role-based access control
- Input validation with express-validator
- CORS protection
- MongoDB injection protection via Mongoose
- XSS protection through React's built-in escaping

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@emeraldradio.com or join our Discord server.

---

Built with by the Emerald Radio Team
