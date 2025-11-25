# 🧪 Complete Testing Guide - QRMenu Cloud

## ✅ Pre-Test Setup

1. **Backend Running**: `cd backend && npm run dev`
2. **Frontend Running**: `cd frontend && npm run dev`
3. **Database Seeded**: `cd backend && npm run seed:demo`

## 🎯 Test All Features

### 1. Authentication Test
- ✅ Go to: http://localhost:5173
- ✅ Should redirect to login
- ✅ Login with: `demo@restaurant.com` / `password123`
- ✅ Should redirect to dashboard

### 2. Dashboard Test
- ✅ Should show restaurant stats (4 categories, 15 items)
- ✅ Should show subscription status (Active, Monthly)
- ✅ Should show QR code placeholder
- ✅ Click "Manage Menu" → should go to menu page
- ✅ Click "View Subscription" → should go to subscription page
- ✅ Click "Preview Menu" → should open public menu in new tab

### 3. Menu Management Test
- ✅ Should show 4 categories with items
- ✅ Click "Add Category" → form should appear
- ✅ Create new category → should save and appear in list
- ✅ Click edit (pencil) on category → should populate form
- ✅ Update category → should save changes
- ✅ Click "Add Item" on category → item form should appear
- ✅ Create new item → should save and appear in category
- ✅ Click edit on item → should populate form with item data
- ✅ Update item → should save changes
- ✅ Delete item → should remove from list
- ✅ Delete category → should remove category and items

### 4. Subscription Test
- ✅ Should show active monthly subscription
- ✅ Should show subscription history
- ✅ Click "Choose Monthly" → should create new subscription
- ✅ Click "Choose Yearly" → should create yearly subscription

### 5. Profile Test
- ✅ Should show user information (name, email, role)
- ✅ Should show restaurant information
- ✅ Update name → click "Save Changes" → should show success
- ✅ Update restaurant info → should save
- ✅ Change theme color → should update

### 6. Public Menu Test
- ✅ Go to: http://localhost:5173/r/demo-restaurant
- ✅ Should show "The Golden Spoon" with orange theme
- ✅ Should show all 4 categories
- ✅ Should show all menu items with prices
- ✅ Should be mobile responsive
- ✅ Should show "Powered by QRMenu Cloud" footer

### 7. Navigation Test
- ✅ Sidebar navigation should work
- ✅ Active page should be highlighted
- ✅ Logout should work and redirect to login
- ✅ Protected routes should redirect to login when not authenticated

### 8. Admin Test
- ✅ Logout from restaurant account
- ✅ Login with: `admin@qrmenu.com` / `admin123`
- ✅ Should see admin dashboard
- ✅ Visit: http://localhost:5000/api/admin/restaurants
- ✅ Should see restaurant data in JSON

## 🐛 Known Working Features

✅ **Authentication**: Login, logout, JWT tokens  
✅ **Dashboard**: Stats, navigation, QR placeholder  
✅ **Menu Management**: Full CRUD for categories and items  
✅ **Subscription**: View active, create new subscriptions  
✅ **Profile**: View and update user/restaurant info  
✅ **Public Menu**: Responsive menu display with theming  
✅ **Navigation**: Sidebar, protected routes  
✅ **Forms**: Validation, error handling, success messages  
✅ **API Integration**: All endpoints working  
✅ **Database**: Proper relationships and data  

## 🚀 What Should Work Now

1. **Complete CRUD Operations** on menu items and categories
2. **Edit functionality** with form pre-population
3. **Real-time updates** after create/update/delete
4. **Proper navigation** between all pages
5. **Form validation** and error handling
6. **Responsive design** on all screen sizes
7. **Authentication flow** with proper redirects
8. **Public menu** with restaurant theming
9. **Subscription management** with plan selection
10. **Profile management** with form updates

## 📝 Test Results

After running all tests above, you should have:
- ✅ Working restaurant dashboard
- ✅ Full menu management system
- ✅ Subscription system
- ✅ Profile management
- ✅ Public menu display
- ✅ Admin functionality
- ✅ Responsive design
- ✅ Proper authentication

If any test fails, check:
1. Backend server is running on port 5000
2. Frontend server is running on port 5173
3. Database has demo data (run seeder again)
4. Browser console for any errors
5. Network tab for failed API calls