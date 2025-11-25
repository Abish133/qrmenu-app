# QRMenu Cloud - Demo Setup Guide

## Quick Demo Setup

Follow these steps to quickly set up the application with demo data for testing:

### 1. Backend Setup with Demo Data

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qrmenu_cloud
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Create MySQL database:**
```sql
CREATE DATABASE qrmenu_cloud;
```

**Run the demo seeder (this will create tables and populate with demo data):**
```bash
npm run seed:demo
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```

### 3. Start Backend Server

```bash
# In backend directory
npm run dev
```

## 🎯 Demo Accounts

After running the seeder, you can login with these accounts:

### Restaurant Owner Account
- **Email:** `demo@restaurant.com`
- **Password:** `password123`
- **Access:** Full restaurant management dashboard

### Admin Account
- **Email:** `admin@qrmenu.com`
- **Password:** `admin123`
- **Access:** Admin panel with all restaurants view

## 🍽️ Demo Restaurant: "The Golden Spoon"

The seeder creates a complete restaurant with:

### Restaurant Details
- **Name:** The Golden Spoon
- **Address:** 123 Main Street, Downtown City, NY 10001
- **Theme Color:** Orange (#D97706)
- **Slug:** demo-restaurant

### Menu Categories & Items

**Appetizers:**
- Caesar Salad - $12.99
- Buffalo Wings - $14.99
- Mozzarella Sticks - $9.99

**Main Courses:**
- Grilled Salmon - $24.99
- Ribeye Steak - $32.99
- Chicken Parmesan - $19.99
- Vegetarian Pasta - $16.99 (marked as unavailable)

**Desserts:**
- Chocolate Lava Cake - $8.99
- Tiramisu - $7.99
- New York Cheesecake - $6.99

**Beverages:**
- Fresh Orange Juice - $4.99
- Coffee - $2.99
- Craft Beer - $5.99
- House Wine - $7.99

### Subscription
- **Plan:** Monthly ($29.99)
- **Status:** Active
- **Payment Method:** Credit Card

## 🔗 Testing URLs

### Frontend Application
- **Login:** http://localhost:5173/login
- **Dashboard:** http://localhost:5173/dashboard
- **Public Menu:** http://localhost:5173/r/demo-restaurant

### API Endpoints
- **Health Check:** http://localhost:5000/api/health
- **Public Menu API:** http://localhost:5000/api/public/menu/demo-restaurant

## 🧪 What to Test

### Restaurant Owner Dashboard
1. **Login** with demo@restaurant.com
2. **View Dashboard** - See statistics and QR code
3. **Menu Management** - Add/edit/delete categories and items
4. **Subscription Status** - View active subscription
5. **Profile Management** - Update restaurant info

### Public Menu View
1. **Visit** http://localhost:5173/r/demo-restaurant
2. **Test Responsiveness** - View on mobile/tablet/desktop
3. **Check Branding** - Orange theme color applied
4. **Browse Menu** - All categories and items displayed

### Admin Features
1. **Login** with admin@qrmenu.com
2. **View All Restaurants** - See demo restaurant
3. **Subscription Management** - View all subscriptions

## 🔄 Reset Demo Data

To reset and recreate demo data:

```bash
cd backend
npm run seed:demo
```

**Warning:** This will drop all existing data and recreate tables with fresh demo data.

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database `qrmenu_cloud` exists

2. **Seeder Fails:**
   - Check database permissions
   - Ensure all dependencies are installed
   - Verify environment variables are set

3. **Frontend Can't Connect:**
   - Ensure backend is running on port 5000
   - Check `VITE_API_URL` in frontend `.env`
   - Verify CORS settings in backend

4. **QR Code Not Generating:**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure QR service dependencies are installed

## 📱 Mobile Testing

The public menu is optimized for mobile devices. Test on:
- iPhone/Android browsers
- Tablet devices
- Desktop browsers at various screen sizes

## 🎨 Customization

You can modify the demo data in:
- `backend/src/seeders/demoData.js`

Change restaurant details, menu items, or add more demo restaurants as needed.