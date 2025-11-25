# Quick Deploy Guide - 5 Minutes

## Step 1: Run Deployment Script (1 min)
```bash
deploy.bat
```
This will initialize git and prepare your code.

## Step 2: Create GitHub Repo (1 min)
1. Go to https://github.com/new
2. Name it: `qrmenu-app`
3. Keep it public
4. Don't add README/gitignore
5. Click "Create repository"
6. Copy the URL shown (e.g., `https://github.com/yourusername/qrmenu-app.git`)

## Step 3: Push to GitHub (1 min)
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 4: Deploy on Railway (2 min)

### A. Create Project
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `qrmenu-app`
6. Wait for deployment (auto-detects settings)

### B. Add Database
1. Click "New" → "Database" → "Add MySQL"
2. Done! Railway auto-connects it

### C. Add Environment Variables
Click your service → "Variables" → "Raw Editor" → Paste:

```
NODE_ENV=production
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
JWT_SECRET=qrmenu-secret-key-2024-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=*
ADMIN_CREATION_KEY=admin123
```

Click "Deploy" (service will restart)

### D. Get Your URL
1. Go to "Settings" tab
2. Click "Generate Domain"
3. Copy URL (e.g., `https://qrmenu-production.up.railway.app`)

## Step 5: Deploy Frontend on Vercel (Optional - 2 min)

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import `qrmenu-app` from GitHub
4. Settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```
6. Click "Deploy"

## Done! 🎉

Your app is live at:
- Backend: `https://your-app.up.railway.app`
- Frontend: `https://your-app.vercel.app` (if deployed)

## Test It:
1. Visit your Railway URL + `/api/health`
2. Should see: `{"status":"OK"}`
3. Register an account
4. Create a restaurant
5. Add menu items

## Troubleshooting

**"Git not found"**: Install from https://git-scm.com/download/win

**Railway build fails**: Check "Deployments" tab for logs

**Database connection error**: Verify MySQL service is running in Railway

**Need help?**: Check RAILWAY_DEPLOYMENT.md for detailed guide
