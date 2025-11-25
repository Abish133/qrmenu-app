# Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at railway.app)

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy

## Step 3: Add MySQL Database

1. In your Railway project, click "New" → "Database" → "Add MySQL"
2. Railway will automatically create a MySQL database
3. Click on MySQL service → "Variables" tab
4. Copy the connection details

## Step 4: Configure Backend Environment Variables

Click on your backend service → "Variables" tab and add:

```
NODE_ENV=production
PORT=5000

# Database (use Railway MySQL variables)
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Admin Creation Key
ADMIN_CREATION_KEY=admin123

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=QRMenu Cloud <noreply@qrmenucloud.com>

# Razorpay (optional)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Step 5: Get Backend URL

1. Go to your backend service → "Settings" tab
2. Under "Domains", click "Generate Domain"
3. Copy the URL (e.g., `https://your-app.up.railway.app`)

## Step 6: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and login
2. Click "New Project" → Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

5. Click "Deploy"

## Step 7: Update Backend FRONTEND_URL

1. Go back to Railway → Backend service → Variables
2. Update `FRONTEND_URL` with your Vercel URL
3. Service will auto-redeploy

## Step 8: Test Your App

Visit your Vercel URL and test:
- Registration/Login
- Create restaurant
- Add menu items
- Generate QR code
- View public menu

## Free Tier Limits

**Railway:**
- $5 free credit per month
- ~500 hours of usage
- Enough for small projects

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for frontend

## Troubleshooting

**Database Connection Issues:**
- Verify MySQL service is running
- Check environment variables are correctly set
- Use Railway's internal variables: `${{MySQL.VARIABLE_NAME}}`

**Build Failures:**
- Check Railway logs in "Deployments" tab
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**CORS Errors:**
- Update FRONTEND_URL in backend
- Ensure both URLs are using HTTPS

## Alternative: Deploy Both on Railway

If you prefer to host both on Railway:

1. Create two services in same project
2. Backend: Use existing setup
3. Frontend: 
   - Add new service from same repo
   - Root Directory: `frontend`
   - Build Command: `npm run build && npm install -g serve`
   - Start Command: `serve -s dist -l $PORT`
   - Add env: `VITE_API_URL=https://your-backend.railway.app/api`

## Cost Optimization

To stay within free tier:
- Use Railway for backend only
- Use Vercel/Netlify for frontend (free)
- Monitor usage in Railway dashboard
- Consider sleeping services when not in use
