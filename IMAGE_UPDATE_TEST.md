# 🖼️ Image Update Test Guide

## 🧪 Step-by-Step Image Update Test

### 1. Test Current Setup
1. Login with `demo@restaurant.com` / `password123`
2. Go to **Menu Management**
3. Find "Caesar Salad" item
4. Click the **edit (pencil)** button
5. ✅ **Should see**: Form populated with current data

### 2. Test Image Update
1. In the edit form, you should see:
   - All fields filled with current values
   - File input for image
   - "Current image" preview (if item has image)
2. **Select a new image** (JPG/PNG under 5MB)
3. Click **"Update Item"**
4. ✅ **Should see**: Success message
5. ✅ **Should see**: Item updated in list with new image

### 3. Debug Information
When you submit the form, check browser console for:
```
Editing item: {id: 1, name: "Caesar Salad", ...}
Adding image file: filename.jpg 12345
name Caesar Salad
description Fresh romaine lettuce...
price 12.99
available true
order 1
image [object File]
Updating item with data: FormData {}
```

### 4. Backend Verification
Check if image was uploaded:
1. Look in `backend/uploads/` folder
2. Should see new image file with timestamp name
3. Check browser network tab for successful PUT request

### 5. Common Issues & Solutions

#### Issue: "image: {}" in console
**Solution**: File input is empty
- Make sure to actually select a file
- Check file size (must be under 5MB)
- Verify file format (JPG, PNG, GIF only)

#### Issue: Image not displaying after update
**Solution**: Check image URL
- Should be `http://localhost:5000/uploads/filename`
- Verify backend is serving static files
- Check browser console for 404 errors

#### Issue: Form not submitting
**Solution**: Check form validation
- All required fields must be filled
- Price must be a valid number
- Check browser console for errors

### 6. Manual Test Steps

1. **Create item with image**:
   ```
   Name: Test Item
   Description: Test description  
   Price: 10.99
   Image: [select file]
   Available: ✓
   ```

2. **Update item image**:
   - Edit the item
   - Select different image
   - Submit form
   - Verify new image appears

3. **Update without changing image**:
   - Edit the item
   - Change only name/price
   - Don't select new image
   - Submit form
   - Verify old image is kept

### 7. Expected Behavior

✅ **When editing WITH new image**: New image replaces old one  
✅ **When editing WITHOUT new image**: Old image is preserved  
✅ **Image preview**: Shows current image when editing  
✅ **Form validation**: Prevents invalid submissions  
✅ **Error handling**: Shows meaningful error messages  

### 8. Troubleshooting Commands

If images aren't working, try:

```bash
# Check if uploads directory exists
ls -la backend/uploads/

# Check backend logs
cd backend && npm run dev

# Check file permissions (Linux/Mac)
chmod 755 backend/uploads/

# Test image URL directly
curl http://localhost:5000/uploads/filename.jpg
```