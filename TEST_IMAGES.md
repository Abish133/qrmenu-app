# 🖼️ Image Upload Testing Guide

## ✅ Test Image Upload & Display

### 1. Test Menu Item Images
1. Go to **Menu Management**
2. Click **"Add Item"** on any category
3. Fill in item details:
   - Name: "Test Item with Image"
   - Description: "Testing image upload"
   - Price: 15.99
4. **Upload an image** (JPG, PNG, GIF under 5MB)
5. Click **"Create Item"**
6. ✅ **Should see**: Item appears with thumbnail image
7. ✅ **Should work**: Image displays in menu management

### 2. Test Public Menu Images
1. After uploading item with image
2. Click **"Preview Menu"** from dashboard
3. ✅ **Should see**: Images display in public menu
4. ✅ **Should work**: Images are properly sized and responsive

### 3. Test QR Code Generation
1. Go to **Dashboard**
2. Click **"Generate QR Code"**
3. ✅ **Should see**: QR code appears instantly
4. Click **"Download"**
5. ✅ **Should work**: QR code downloads as PNG file
6. **Test QR**: Scan with phone - should open menu

### 4. Test QR Code in Profile
1. Go to **Profile** page
2. ✅ **Should see**: QR code automatically displayed
3. Click **"Download"**
4. ✅ **Should work**: Downloads QR code
5. Click **"Preview"**
6. ✅ **Should work**: Opens menu in new tab

## 🔧 Image Upload Specifications

- **Supported formats**: JPG, JPEG, PNG, GIF
- **Max file size**: 5MB
- **Storage**: `/backend/uploads/` directory
- **URL format**: `http://localhost:5000/uploads/filename`

## 🎯 QR Code Features

- **Generator**: QR Server API (qrserver.com)
- **Size**: 200x200px (dashboard), 150x150px (profile)
- **Format**: PNG download
- **Content**: Full menu URL
- **Filename**: `restaurant-name-qr-code.png`

## 🐛 Troubleshooting

### Images Not Displaying:
1. Check if backend `/uploads` directory exists
2. Verify file was uploaded (check backend/uploads folder)
3. Check browser console for 404 errors
4. Ensure backend is serving static files on `/uploads` route

### QR Code Issues:
1. Check internet connection (uses external API)
2. Verify menu URL is correct
3. Test QR code with phone scanner app

### Download Issues:
1. Check browser download permissions
2. Verify popup blocker settings
3. Try different browser if needed

## ✅ Expected Results

After testing, you should have:
- ✅ Working image upload for menu items
- ✅ Images displaying in menu management
- ✅ Images showing in public menu
- ✅ QR code generation and display
- ✅ QR code download functionality
- ✅ Menu preview working from QR scan
- ✅ Proper error handling for failed uploads