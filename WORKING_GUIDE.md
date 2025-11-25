# QRMenu Cloud - Working Guide

## ✅ Step-by-Step Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Make sure .env file exists with correct database credentials
npm run seed:demo  # This creates all demo data
npm run dev        # Start backend server
```

### 2. Frontend Setup  
```bash
cd frontend
npm install
# Make sure .env file exists with VITE_API_URL=http://localhost:5000/api
npm run dev        # Start frontend server
```

## 🎯 Demo Accounts Created

### Restaurant Owner (Has Menu & Subscription)
- **Email**: `demo@restaurant.com`
- **Password**: `password123`
- **Access**: Dashboard, Menu Management, Subscription

### Admin (Platform Management)
- **Email**: `admin@qrmenu.com` 
- **Password**: `admin123`
- **Access**: Admin panel, View all restaurants

## 🔗 Test URLs

1. **Frontend**: http://localhost:5173
2. **Backend Health**: http://localhost:5000/api/health
3. **Public Menu**: http://localhost:5173/r/demo-restaurant
4. **Admin API**: http://localhost:5000/api/admin/restaurants

## 🧪 Testing Workflow

### Test Restaurant Features:
1. Login with `demo@restaurant.com`
2. View Dashboard (should show stats)
3. Go to Menu Management (should show 4 categories with items)
4. Go to Subscription (should show active monthly plan)
5. Go to Profile (should show restaurant info)

### Test Public Menu:
1. Visit: http://localhost:5173/r/demo-restaurant
2. Should show "The Golden Spoon" with orange theme
3. Should display all menu categories and items

### Test Admin Features:
1. Login with `admin@qrmenu.com`
2. Visit: http://localhost:5000/api/admin/restaurants
3. Should see restaurant data in JSON

## 🐛 Common Issues & Solutions

### Backend 404 Errors:
- Make sure backend is running on port 5000
- Check if seeder ran successfully
- Verify .env file has correct database credentials

### Frontend Login Issues:
- Clear browser localStorage
- Make sure you're using the correct demo credentials
- Check browser console for API errors

### Database Issues:
- Ensure MySQL is running
- Database `qrmenu_cloud` exists
- Run seeder again: `npm run seed:demo`

### CSS/Styling Issues:
- All components now use standard Tailwind classes
- No custom CSS variables needed

## 📋 What Should Work:

✅ User registration and login  
✅ JWT authentication  
✅ Restaurant dashboard with stats  
✅ Menu management (CRUD operations)  
✅ Subscription management  
✅ Profile management  
✅ Public menu view with theming  
✅ Admin panel access  
✅ Responsive design  

## 🚀 Next Steps:

1. Test all features with demo accounts
2. Create your own restaurant account via registration
3. Customize the demo data in seeders if needed
4. Deploy to production when ready