# Railway Deployment Checklist

## Check These in Your Railway Dashboard:

### 1. Services (Should have 2):
- [ ] MySQL database service
- [ ] Backend/qrmenu-app service

### 2. Backend Service Status:
- [ ] Build completed successfully (green checkmark)
- [ ] Deployment is active (not crashed)
- [ ] Logs show "Server running on port 5000"

### 3. Environment Variables (Backend Service):
Click Variables tab - should have:
- [ ] NODE_ENV=production
- [ ] DB_HOST=${{MySQL.MYSQL_HOST}}
- [ ] DB_PORT=${{MySQL.MYSQL_PORT}}
- [ ] DB_NAME=${{MySQL.MYSQL_DATABASE}}
- [ ] DB_USER=${{MySQL.MYSQL_USER}}
- [ ] DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
- [ ] JWT_SECRET=qrmenu-secret-2024
- [ ] JWT_EXPIRES_IN=7d
- [ ] FRONTEND_URL=*
- [ ] ADMIN_CREATION_KEY=admin123

### 4. Public Domain:
- [ ] Backend service has a public domain generated
- [ ] Domain looks like: https://something.up.railway.app

## Common Issues:

### If Build Failed:
- Check "Deployments" tab for error logs
- Verify nixpacks.toml exists in repo

### If Service Crashed:
- Click service → "Deployments" → View logs
- Look for error messages
- Common: Missing environment variables

### If No Public Domain:
- Settings → Networking → Generate Domain
- Select port 5000

## What to Share With Me:

1. **Deployment Status**: Success or Failed?
2. **Error Logs**: Copy any red error messages
3. **Public URL**: The generated domain URL
4. **Screenshot**: Of your Railway dashboard (optional)

---

Tell me what you see in Railway dashboard!
