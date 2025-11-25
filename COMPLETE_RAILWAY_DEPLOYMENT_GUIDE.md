# Complete Railway Deployment Guide - QR Menu App

## Overview
This guide will deploy your QR Menu app with 3 services on Railway:
1. MySQL Database
2. Backend API (Node.js/Express)
3. Frontend (React/Vite)

---

## Prerequisites

### 1. Install Git (if not installed)
- Download: https://git-scm.com/download/win
- Install with default settings
- Restart your computer after installation

### 2. Create Accounts
- GitHub Account: https://github.com/signup
- Railway Account: https://railway.app (sign up with GitHub)

---

## Part 1: Prepare Your Code

### Step 1: Initialize Git Repository

Open Command Prompt in `d:\QR_APP` and run:

```bash
cd d:\QR_APP
git config user.email "your-email@example.com"
git config user.name "Your Name"
git init
git branch -M main
git add .
git commit -m "Initial commit for Railway deployment"
```

### Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `qrmenu-app`
3. Description: `QR Menu SaaS Platform`
4. Keep it **PUBLIC** (required for Railway free tier)
5. **DO NOT** check any boxes (no README, no .gitignore, no license)
6. Click **"Create repository"**

### Step 3: Push Code to GitHub

Copy your GitHub username, then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/qrmenu-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**Verify:** Go to `https://github.com/YOUR_USERNAME/qrmenu-app` - you should see all your files.

---

## Part 2: Deploy on Railway

### Step 1: Create Railway Project

1. Go to: https://railway.app
2. Click **"Login"** → Sign in with GitHub
3. Authorize Railway to access your GitHub
4. Click **"New Project"**
5. You'll see an empty project dashboard

### Step 2: Deploy MySQL Database

1. In your Railway project, click **"New"** button (top right)
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Wait 30 seconds for MySQL to deploy
5. You'll see a new service card labeled **"MySQL"** or **"MySQL-xxxxx"**

**Important:** Note the exact name of your MySQL service (e.g., `MySQL-z_tl`)

#### Verify MySQL Variables:
1. Click on the MySQL service
2. Go to **"Variables"** tab
3. You should see these auto-generated variables:
   - `MYSQL_URL`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQL_ROOT_PASSWORD`

**DO NOT modify or delete these variables!**

---

### Step 3: Deploy Backend Service

#### 3.1 Create Backend Service

1. Click **"New"** button
2. Select **"GitHub Repo"**
3. Choose **"qrmenu-app"** from the list
4. Railway will automatically start building
5. Wait 2-3 minutes for the build to complete

#### 3.2 Configure Backend Environment Variables

1. Click on the backend service (should be named `qrmenu-app`)
2. Go to **"Variables"** tab
3. Click **"Raw Editor"** button
4. **Delete everything** in the editor
5. Paste the following (replace `MySQL-z_tl` with YOUR MySQL service name):

```env
NODE_ENV=production
DB_HOST=${{MySQL-z_tl.MYSQLHOST}}
DB_PORT=${{MySQL-z_tl.MYSQLPORT}}
DB_NAME=${{MySQL-z_tl.MYSQLDATABASE}}
DB_USER=${{MySQL-z_tl.MYSQLUSER}}
DB_PASSWORD=${{MySQL-z_tl.MYSQLPASSWORD}}
JWT_SECRET=qrmenu-secret-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=*
ADMIN_CREATION_KEY=admin123
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

6. The service will automatically redeploy (wait 2-3 minutes)

#### 3.3 Check Backend Deployment Logs

1. Click on backend service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Check logs - you should see:
   ```
   Razorpay not configured - payment features disabled
   Database connection established successfully.
   Database models synchronized.
   Default subscription plans created successfully
   Subscription checker cron job started
   Server running on port 8080
   Environment: production
   ```

#### 3.4 Generate Backend Public Domain

1. Click on backend service
2. Go to **"Settings"** tab
3. Scroll down to **"Networking"** section
4. Click **"Generate Domain"** button
5. If asked for port, enter: `8080`
6. Click **"Generate Domain"**
7. Copy the generated URL (e.g., `https://qrmenu-app-production.up.railway.app`)

#### 3.5 Test Backend

Open in browser: `https://your-backend-url.railway.app/api/health`

You should see:
```json
{"status":"OK","timestamp":"2024-01-15T10:30:00.000Z"}
```

**If you see this, your backend is working! ✅**

---

### Step 4: Deploy Frontend Service

#### 4.1 Create Frontend Service

1. Click **"New"** button
2. Select **"GitHub Repo"**
3. Choose **"qrmenu-app"** again (yes, same repo)
4. Railway will start building

#### 4.2 Configure Frontend Root Directory

1. Click on the new service (will be named `qrmenu-app` or similar)
2. Go to **"Settings"** tab
3. Find **"Root Directory"** field
4. Enter: `frontend`
5. Click outside the field to save

#### 4.3 Configure Frontend Environment Variables

1. Go to **"Variables"** tab
2. Click **"Raw Editor"**
3. Paste (replace with YOUR backend URL):

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

Example:
```env
VITE_API_URL=https://qrmenu-app-production.up.railway.app/api
```

4. Save and wait for automatic redeploy

#### 4.4 Trigger Frontend Rebuild

Since environment variables must be set BEFORE build:

1. Go to **"Deployments"** tab
2. Click the three dots (...) on the latest deployment
3. Click **"Redeploy"**
4. Wait 3-4 minutes for build to complete

#### 4.5 Check Frontend Build Logs

1. Go to **"Deployments"** tab
2. Click latest deployment
3. Look for successful build messages:
   ```
   ✓ built in 15s
   dist/index.html
   dist/assets/...
   ```

#### 4.6 Generate Frontend Public Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://qrmenu-frontend.up.railway.app`)

---

## Part 3: Final Configuration

### Update Backend CORS (Optional but Recommended)

1. Go to backend service → **"Variables"** tab
2. Find `FRONTEND_URL` variable
3. Change from `*` to your frontend URL:
   ```
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
4. Service will auto-redeploy

---

## Part 4: Test Your Application

### 1. Open Frontend URL

Visit: `https://your-frontend-url.railway.app`

You should see the QR Menu login/register page.

### 2. Register an Account

1. Click **"Register"** or **"Sign Up"**
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123456
   - Restaurant Name: Test Restaurant
3. Click **"Register"**

### 3. Test Features

After registration:
- ✅ Dashboard should load
- ✅ Create categories
- ✅ Add menu items
- ✅ Upload images
- ✅ Generate QR code
- ✅ View public menu

---

## Your Railway Services Summary

After complete deployment, you should have **3 services**:

### 1. MySQL Database
- **Name:** MySQL-xxxxx
- **Type:** Database
- **Status:** Active (green)
- **No public domain needed**

### 2. Backend API
- **Name:** qrmenu-app (backend)
- **Type:** Web Service
- **Status:** Active (green)
- **Domain:** https://qrmenu-app-production.up.railway.app
- **Test URL:** https://your-backend.railway.app/api/health

### 3. Frontend
- **Name:** qrmenu-app (frontend)
- **Type:** Web Service
- **Status:** Active (green)
- **Domain:** https://qrmenu-frontend.up.railway.app
- **Root Directory:** frontend

---

## Environment Variables Reference

### Backend Service Variables:
```env
NODE_ENV=production
DB_HOST=${{MySQL-xxxxx.MYSQLHOST}}
DB_PORT=${{MySQL-xxxxx.MYSQLPORT}}
DB_NAME=${{MySQL-xxxxx.MYSQLDATABASE}}
DB_USER=${{MySQL-xxxxx.MYSQLUSER}}
DB_PASSWORD=${{MySQL-xxxxx.MYSQLPASSWORD}}
JWT_SECRET=qrmenu-secret-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.railway.app
ADMIN_CREATION_KEY=admin123
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Frontend Service Variables:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

### MySQL Service Variables:
**DO NOT ADD OR MODIFY** - Auto-generated by Railway

---

## Files Created for Deployment

Your project includes these Railway-specific files:

### 1. `nixpacks.toml` (Root - for backend)
```toml
[phases.setup]
nixPkgs = ['nodejs_18']

[phases.install]
cmds = ['cd backend && npm install']

[start]
cmd = 'cd backend && npm start'
```

### 2. `frontend/nixpacks.toml` (for frontend)
```toml
[phases.setup]
nixPkgs = ['nodejs_18']

[phases.install]
cmds = ['npm install']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npx serve -s dist -l $PORT'
```

### 3. `railway.json` (Root)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. `.railwayignore`
```
node_modules
.git
.env
*.log
.DS_Store
backend/uploads/*
!backend/uploads/.gitkeep
```

### 5. `.gitignore`
```
node_modules/
.env
.env.local
*.log
dist/
build/
backend/uploads/*
!backend/uploads/.gitkeep
.DS_Store
```

---

## Troubleshooting

### Backend Issues

#### Build Failed
**Error:** `npm ci` requires package-lock.json
**Solution:** Already fixed - using `npm install` instead

#### Database Connection Error
**Error:** `ECONNREFUSED ::1:3306`
**Solution:** 
1. Check environment variables are set correctly
2. Verify MySQL service name matches in variables
3. Use `${{MySQL-xxxxx.MYSQLHOST}}` format

#### Razorpay Error
**Error:** `key_id is mandatory`
**Solution:** Already fixed - Razorpay is optional now

#### Port Issues
**Error:** Application failed to respond
**Solution:** 
1. Check logs for actual port (usually 8080)
2. Generate domain with correct port
3. Railway auto-assigns PORT environment variable

### Frontend Issues

#### API Connection Error
**Error:** `ERR_CONNECTION_REFUSED` or connecting to localhost
**Solution:**
1. Add `VITE_API_URL` environment variable
2. Must redeploy after adding variable (Vite builds at compile time)
3. Format: `https://backend-url.railway.app/api` (with `/api`)

#### Build Failed - Vite Not Found
**Error:** `vite: not found`
**Solution:** Already fixed with proper nixpacks.toml

#### Blank Page
**Solution:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Check backend is responding at `/api/health`

### MySQL Issues

#### Can't Connect
**Solution:**
1. Verify MySQL service is running (green status)
2. Don't modify MySQL auto-generated variables
3. Use Railway's reference format: `${{ServiceName.VARIABLE}}`

---

## Cost & Free Tier Limits

### Railway Free Tier:
- **$5 credit per month**
- **500 hours of usage**
- **100 GB bandwidth**

### Your Usage (3 services):
- MySQL: ~$3/month
- Backend: ~$1.50/month
- Frontend: ~$0.50/month
- **Total: ~$5/month** (within free tier!)

### Tips to Stay Free:
1. Don't run unnecessary services
2. Monitor usage in Railway dashboard
3. Services sleep after inactivity (good for free tier)
4. Consider deploying frontend on Vercel (free unlimited) to save Railway credits

---

## Alternative: Frontend on Vercel (Free)

To save Railway credits, deploy frontend on Vercel:

### 1. Deploy on Vercel
1. Go to: https://vercel.com
2. Import `qrmenu-app` from GitHub
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

### 2. Update Backend CORS
In Railway backend variables:
```
FRONTEND_URL=https://your-app.vercel.app
```

**Benefits:**
- Saves $0.50/month on Railway
- Vercel has better CDN for frontend
- Unlimited bandwidth on Vercel

---

## Maintenance & Updates

### Update Code:

```bash
cd d:\QR_APP
git add .
git commit -m "Your update message"
git push origin main
```

Railway will automatically redeploy all services.

### View Logs:
1. Click service → "Deployments" tab
2. Click latest deployment
3. View real-time logs

### Restart Service:
1. Click service → "Deployments" tab
2. Click three dots (...) → "Redeploy"

### Add Environment Variable:
1. Click service → "Variables" tab
2. Add variable
3. Service auto-redeploys

---

## Security Recommendations

### 1. Change JWT Secret
In backend variables, change:
```
JWT_SECRET=your-unique-secret-key-here-use-random-string
```

Generate random string: https://randomkeygen.com/

### 2. Change Admin Creation Key
```
ADMIN_CREATION_KEY=your-secure-admin-key
```

### 3. Add Cloudinary (for image uploads)
Get free account: https://cloudinary.com

Add to backend variables:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Enable HTTPS Only
Railway provides HTTPS by default - always use https:// URLs

---

## Support & Resources

### Railway Documentation:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Your Project URLs:
- GitHub: https://github.com/YOUR_USERNAME/qrmenu-app
- Railway Dashboard: https://railway.app/dashboard
- Backend API: https://your-backend.railway.app
- Frontend App: https://your-frontend.railway.app

### Quick Links:
- Railway Pricing: https://railway.app/pricing
- Railway Help: https://help.railway.app
- Deployment Logs: Railway Dashboard → Service → Deployments

---

## Success Checklist

- [ ] Git installed and configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] MySQL database deployed
- [ ] Backend service deployed
- [ ] Backend environment variables configured
- [ ] Backend domain generated
- [ ] Backend health check passes
- [ ] Frontend service deployed
- [ ] Frontend root directory set to `frontend`
- [ ] Frontend environment variables configured
- [ ] Frontend domain generated
- [ ] Can register new account
- [ ] Can create restaurant
- [ ] Can add menu items
- [ ] Can generate QR code
- [ ] Public menu accessible

---

## Congratulations! 🎉

Your QR Menu SaaS application is now live on Railway!

**Your Live URLs:**
- Frontend: https://your-frontend.railway.app
- Backend API: https://your-backend.railway.app/api
- API Health: https://your-backend.railway.app/api/health

**Next Steps:**
1. Share your app URL with users
2. Create your first restaurant
3. Add menu items
4. Generate QR codes
5. Test public menu view

**Need Help?**
- Check Railway logs for errors
- Review this guide's troubleshooting section
- Visit Railway Discord for community support

---

**Deployment Date:** $(date)
**Guide Version:** 1.0
**Last Updated:** January 2025
