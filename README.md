# QRMenu Cloud - Digital Menu SaaS Platform

A complete SaaS application for restaurants to manage digital menus and generate QR codes.

## Tech Stack

**Frontend:**
- React 18 + Vite + TypeScript
- Zustand + TanStack Query
- Tailwind CSS + ShadCN UI
- Framer Motion + React Router v6

**Backend:**
- Node.js + Express.js
- Sequelize ORM + MySQL
- JWT Authentication + bcrypt
- Multer/Cloudinary for uploads

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your backend URL
npm run dev
```

## Features
- Multi-restaurant SaaS platform
- Role-based authentication (Admin/Restaurant)
- Menu management with categories
- QR code generation
- Subscription management (monthly/yearly)
- Responsive public menu view
- Image uploads for menu items

## Database Schema
- users, restaurants, categories, menu_items, subscriptions
- Full relational structure with proper associations

## Deployment
- Frontend: Vercel/Netlify
- Backend: Render/Railway/AWS
- Database: PlanetScale/Neon MySQL