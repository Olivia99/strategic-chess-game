# Railway Deployment Guide

## 🚂 Deploy Strategic Chess Game to Railway

### Prerequisites
- GitHub account with this repository
- Railway account (https://railway.app)
- Neon PostgreSQL database URL

### 📋 Environment Variables Required

Set these in Railway dashboard:

```env
DATABASE_URL=postgresql://neondb_owner:npg_eJRpc1aI2zwm@ep-curly-boat-af4nmtyh-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
```

### 🔧 Railway Configuration

The project includes:
- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Build configuration for Nixpacks

### 📦 Deployment Steps

1. **Connect to Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository: `Olivia99/strategic-chess-game`

2. **Configure Service:**
   - **Root Directory**: `apps/web` (IMPORTANT!)
   - **Build Command**: `npm install && npm run build` (auto-detected)
   - **Start Command**: `npm run start` (auto-detected)

3. **Set Environment Variables:**
   - Go to project Variables tab
   - Add `DATABASE_URL` with your Neon database URL
   - Add `NODE_ENV=production`

4. **Deploy:**
   - Railway will automatically deploy on push
   - Health check endpoint: `/api/health`
   - Expected deploy time: 3-5 minutes

### 🔍 Verification Steps

After deployment:

1. **Test Homepage**: `https://your-app.railway.app/`
2. **Test Health API**: `https://your-app.railway.app/api/health`
3. **Test Debug Page**: `https://your-app.railway.app/debug`
4. **Test Game Creation**: `https://your-app.railway.app/rooms/create`

### 🏗️ Project Structure

```
apps/web/
├── railway.json          # Railway deployment config
├── nixpacks.toml         # Build configuration
├── package.json          # Dependencies and scripts
├── react-router.config.ts # SSR configuration
└── src/
    ├── app/
    │   ├── api/          # API routes
    │   ├── pages/        # React Router pages
    │   └── root.tsx      # Application root
    └── ...
```

### 🐛 Troubleshooting

**If deployment fails:**

1. Check Railway logs in dashboard
2. Verify ROOT_DIRECTORY is set to `apps/web`
3. Ensure DATABASE_URL is correctly formatted
4. Check that all required packages are in package.json

**Common Issues:**

- **500 errors**: Check environment variables
- **Build failures**: Verify Node.js version compatibility
- **Database connection**: Test DATABASE_URL format

### ✅ Features Included

- ✅ Real-time game synchronization (SSE)
- ✅ PostgreSQL database integration
- ✅ Hero selection system
- ✅ Room-based multiplayer
- ✅ Responsive UI with Tailwind CSS
- ✅ Health check monitoring
- ✅ Error handling and logging

### 🧪 Testing

Run Playwright tests after deployment:

```bash
cd apps/web
npm install
npx playwright install
PLAYWRIGHT_BASE_URL=https://your-app.railway.app npm run test
```

### 📊 Monitoring

- Railway provides built-in metrics
- Health endpoint: `/api/health`
- Database status included in health checks
- Auto-restart on failure configured