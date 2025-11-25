# QRMenu Cloud - Setup Instructions

## Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+
- Git

## Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
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

5. **Create MySQL database:**
```sql
CREATE DATABASE qrmenu_cloud;
```

6. **Start the backend server:**
```bash
npm run dev
```

The backend will run on http://localhost:5000

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Database Schema

The application will automatically create the following tables:
- `users` - User accounts (admin/restaurant)
- `restaurants` - Restaurant information
- `categories` - Menu categories
- `menu_items` - Individual menu items
- `subscriptions` - Subscription management

## Default Admin Account

Create an admin account by registering normally, then manually update the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## Features Available

### Restaurant Users:
- ✅ Register restaurant account
- ✅ Login/logout with JWT authentication
- ✅ Dashboard with statistics
- ✅ Menu management (categories and items)
- ✅ QR code generation
- ✅ Subscription status tracking
- ✅ Public menu view

### Admin Users:
- ✅ View all restaurants
- ✅ View all subscriptions
- ✅ Manage system-wide settings

### Public Features:
- ✅ View restaurant menus via QR code
- ✅ Mobile-responsive design
- ✅ Subscription expiry handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new restaurant
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Menu Management
- `GET /api/menu` - Get restaurant menu
- `POST /api/menu/categories` - Create category
- `PUT /api/menu/categories/:id` - Update category
- `DELETE /api/menu/categories/:id` - Delete category
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item

### Public
- `GET /api/public/menu/:slug` - Get public menu

### Subscriptions
- `GET /api/subscription` - Get subscription info
- `POST /api/subscription` - Create subscription
- `GET /api/subscription/all` - Get all subscriptions (admin)

## Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with build command: `npm install`
4. Start command: `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variable: `VITE_API_URL=your-backend-url/api`

### Database (PlanetScale/Neon)
1. Create MySQL database
2. Update connection string in backend `.env`
3. Run the application to auto-create tables

## Troubleshooting

### Common Issues:

1. **Database connection error:**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **CORS errors:**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check API URL in frontend `.env`

3. **JWT token errors:**
   - Clear browser localStorage
   - Verify `JWT_SECRET` is set

4. **File upload issues:**
   - Ensure `uploads/` directory exists in backend
   - Check file permissions

## Production Considerations

1. **Security:**
   - Use strong JWT secrets
   - Enable HTTPS
   - Set up proper CORS origins
   - Use environment variables for all secrets

2. **Performance:**
   - Enable database indexing
   - Use CDN for image uploads
   - Implement caching strategies

3. **Monitoring:**
   - Set up error logging
   - Monitor subscription expiry
   - Track QR code usage

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify environment variables