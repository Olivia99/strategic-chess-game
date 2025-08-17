# Vercel Deployment Guide - Fixed

## 🚀 Deploy Strategic Chess Game to Vercel

### 🔧 Configuration Fixed

The previous 500 errors were caused by incorrect monorepo configuration. This has been fixed with:

1. **Proper routing in vercel.json**
2. **Correct Node.js runtime specification**
3. **Fixed build and output directories**

### 📋 Environment Variables Required

Set these in Vercel dashboard:

```env
DATABASE_URL=postgresql://neondb_owner:npg_eJRpc1aI2zwm@ep-curly-boat-af4nmtyh-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
```

### 🔧 Vercel Configuration

**Root-level vercel.json:**
```json
{
  "version": 2,
  "functions": {
    "build/server/index.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  }
}
```

### 📦 Deployment Steps

#### Option 1: Vercel Dashboard (Recommended)

1. **Connect to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import from GitHub: `Olivia99/strategic-chess-game`

2. **Configure Project Settings (IMPORTANT):**
   - **Framework Preset**: Other  
   - **Root Directory**: `apps/web` ⚠️ **CRITICAL: Set this to apps/web**
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables:**
   - Add `DATABASE_URL` with your Neon database URL
   - Add `NODE_ENV=production`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build completion (3-5 minutes)

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from project root
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NODE_ENV
```

### 🔍 Key Fixes Applied

1. **Fixed Monorepo Structure**: Proper routing to `apps/web/build/server/index.js`
2. **Node.js Runtime**: Explicitly set to `nodejs18.x`
3. **Build Commands**: Corrected to navigate to apps/web directory
4. **Output Directory**: Fixed to point to correct build output
5. **Route Configuration**: Added proper API and catch-all routes

### 🧪 Verification Steps

After deployment:

1. **Homepage**: `https://your-app.vercel.app/` ✅
2. **Health API**: `https://your-app.vercel.app/api/health` ✅
3. **Heroes API**: `https://your-app.vercel.app/api/heroes` ✅
4. **Debug Page**: `https://your-app.vercel.app/debug` ✅
5. **Game Creation**: `https://your-app.vercel.app/rooms/create` ✅

### 🐛 Troubleshooting

**If you still get 500 errors:**

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Project → Functions tab
   - Click on any function to see logs

2. **Verify Build Output:**
   - Check that `build/server/index.js` exists after build (when Root Directory is apps/web)
   - Verify `build/client` contains static assets

3. **Environment Variables:**
   - Ensure DATABASE_URL is properly formatted
   - Check that all required env vars are set

4. **Node.js Version:**
   - Verify using Node.js 18.x
   - Check package.json engines field

### ✅ Features Included

- ✅ Real-time game synchronization (SSE)
- ✅ PostgreSQL database integration  
- ✅ Hero selection system
- ✅ Room-based multiplayer
- ✅ Responsive UI with Tailwind CSS
- ✅ Health check monitoring
- ✅ Error handling and logging

### 🏗️ Project Structure

```
Root/
├── vercel.json           # Vercel deployment config
├── package.json          # Root package.json with build scripts
└── apps/web/            # Root Directory in Vercel
    ├── package.json      # Web app dependencies
    ├── react-router.config.ts
    ├── src/app/          # React Router app
    └── build/            # Build output (outputDirectory)
        ├── client/       # Static assets
        └── server/       # Server functions
            └── index.js  # Main server function
```

### 🧪 Testing After Deployment

Run Playwright tests:

```bash
cd apps/web
npm install
npx playwright install
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app npm run test
```

### 📊 Monitoring

- Vercel provides built-in analytics
- Health endpoint: `/api/health`
- Function logs available in dashboard
- Real-time error tracking included