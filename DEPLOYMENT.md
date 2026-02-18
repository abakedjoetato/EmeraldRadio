# Deployment Guide for Emerald Radio

This guide covers deploying the Emerald Radio platform to various hosting providers.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)

---

## MongoDB Atlas Setup

### 1. Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization and project

### 2. Create Cluster
1. Click "Build a Cluster"
2. Choose "M0 Sandbox" (free tier)
3. Select your preferred cloud provider and region
4. Click "Create Cluster"

### 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - For production, restrict to your server's IP

### 5. Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

Example:
```
mongodb+srv://emerald_user:your_password@cluster0.xxxxx.mongodb.net/emerald_radio?retryWrites=true&w=majority
```

---

## Backend Deployment

### Option 1: Render (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - Name: `emerald-radio-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   MONGODB_URI_PROD=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your backend

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   cd backend
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set MONGODB_URI_PROD="your_connection_string"
   railway variables set JWT_SECRET="your_secret"
   railway variables set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Option 3: DigitalOcean App Platform

1. **Create App**
   - Go to [DigitalOcean](https://www.digitalocean.com)
   - Create a new App
   - Connect your GitHub repository

2. **Configure**
   - Select the `backend` directory
   - Choose Node.js
   - Set environment variables

3. **Deploy**
   - DigitalOcean will automatically build and deploy

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**
   ```bash
   cd app
   npm run build
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.com/api
     VITE_SOCKET_URL=https://your-backend-url.com
     ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build the App**
   ```bash
   cd app
   npm run build
   ```

2. **Deploy**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

3. **Configure Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add the same variables as above

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd app
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/emerald-radio",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/emerald-radio/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `MONGODB_URI_DEV` | Development MongoDB URI | No |
| `MONGODB_URI_PROD` | Production MongoDB URI | Yes (production) |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRE` | JWT expiration time (e.g., 7d) | No (default: 7d) |
| `DEFAULT_ADMIN_PASSWORD` | Initial admin password | Yes |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `FRONTEND_URL` | Frontend URL for CORS | Yes (production) |
| `YOUTUBE_API_KEY` | YouTube Data API key | No |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_SOCKET_URL` | Socket.IO server URL | Yes |

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend deployed and responding to health checks
- [ ] Frontend deployed and loading correctly
- [ ] Environment variables configured on both sides
- [ ] CORS configured correctly (FRONTEND_URL matches actual frontend URL)
- [ ] Default admin account created successfully
- [ ] Can login to admin dashboard
- [ ] Can create a test station
- [ ] Station playback works correctly
- [ ] Live chat is functioning
- [ ] Socket.IO connections are working

---

## Troubleshooting

### CORS Errors
Make sure `FRONTEND_URL` in backend matches your actual frontend domain exactly (including https://).

### MongoDB Connection Issues
- Check that your IP is whitelisted in Network Access
- Verify the connection string format
- Ensure the database user has correct permissions

### Socket.IO Not Working
- Check that `VITE_SOCKET_URL` is set correctly
- Ensure your hosting provider supports WebSockets
- Check browser console for connection errors

### JWT Authentication Failing
- Verify `JWT_SECRET` is set and consistent
- Check that token is being sent in Authorization header
- Ensure cookies/localStorage is working

---

## Support

For deployment support, please:
1. Check the logs in your hosting provider's dashboard
2. Review environment variable configuration
3. Open an issue on GitHub with error details
