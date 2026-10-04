# Vyntra — Social Media Platform

> **Tagline:** Connect. Create. Share.  
> **Alternative Tagline:** Your World. Your People. Your Vyntra.

Vyntra is a full-stack, production-quality social media platform built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), Socket.IO, Tailwind CSS, Framer Motion, Three.js, and Recharts.

---

## 🚀 Key Features

### User Experience & Branding
- **Original Logo & Identity**: Modern abstract geometric "V" symbol with dynamic lighting.
- **Glassmorphic UI & 3D Elements**: Sleek glassmorphism cards, micro-interactions, floating 3D canvas background.
- **Light & Dark Mode**: Persistent theme switcher stored in `localStorage`.
- **Responsive Navigation**: Desktop Sidebar and Mobile Bottom Navigation bar with active state indicators.

### Authentication & Authorization
- **JWT-Based Authentication**: Hashed passwords with `bcryptjs`.
- **User Registration & Login**: Full field validation (Email, Username, Phone, DOB, Gender, Bio, Profile Photo).
- **Separate Admin Portal**: Secure admin authentication at `/admin/login` protecting all administrative endpoints.

### Core Social Features
- **Home Feed**: Image and video posts with double-tap heart animations, likes, comments, bookmarking, and music track info.
- **Stories**: 24-hour expiring stories at the top of the feed with story viewer progress bars, pause, story view counts, and viewers modal.
- **Reels**: Vertical full-screen video feed with viewport sensing, autoplay, mute/unmute, and instant interactions.
- **Direct & Group Messaging**: Real-time Socket.IO chat with online user indicators, typing indicators, read receipts, and media attachments.
- **Advanced Search & Explore**: Real-time debounced search across users, hashtags (#technology, #coding), posts, and reels.
- **Saved Posts & Collections**: Save posts/reels and organize them into custom collections.
- **Notifications**: Real-time and persistent notification center for likes, comments, follows, and messages.

### Admin Dashboard & Analytics
- **Overview Counters**: Real-time counts for Users, Posts, Reels, Stories, Comments, Likes, Messages, and Reports.
- **Recharts Analytics Engine**: Interactive graphs for daily user growth, registrations, posts created, and engagement rate with 7d/30d/90d/1y filters.
- **Content Moderation & Management**: Search, filter, verify/unverify users, block/unblock accounts, delete posts, hide/restore content, review reported content, and configure site settings.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Three.js / React Three Fiber, Recharts, React Hot Toast, Socket.IO Client.
- **Backend**: Node.js, Express.js, Socket.IO Server, JWT, bcryptjs, Multer file uploads.
- **Database**: MongoDB (Mongoose Object Modeling) running at `mongodb://localhost:27017/vyntra_db`.

---

## 📁 Project Structure

```
vyntra/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # API request handlers
│   ├── middleware/      # Auth & Multer upload middleware
│   ├── models/          # 19 Mongoose Schemas
│   ├── routes/          # Express REST routes
│   ├── seed/            # Demo data seed script
│   ├── uploads/         # Static media uploads directory
│   ├── socket.js        # Socket.IO real-time event handlers
│   ├── server.js        # Entry Express server
│   └── .env             # Environment variables
├── frontend/
│   ├── public/          # Favicon & Vyntra SVG logo
│   └── src/
│       ├── components/  # Reusable UI, 3D, Post, Story, Modals
│       ├── context/     # Auth, Theme, Socket Contexts
│       ├── layouts/     # MainLayout & AdminLayout
│       ├── pages/       # Home, Reels, Messages, Profile, Admin pages
│       ├── services/    # Axios API instance
│       └── App.jsx      # Router configuration
└── package.json         # Root scripts (starts both concurrently)
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Local MongoDB server running on port `27017`

### 1. Database Setup & Seeding
Ensure MongoDB is running locally at `mongodb://localhost:27017/`.

Seed the database with **20 demo users**, posts, reels, stories, comments, conversations, and admin account:

```bash
# Seed local database
npm run seed
```

### 2. Running Frontend & Backend Together

You can start both backend (Port 5000) and frontend (Port 5173) simultaneously:

```bash
# Install root dependencies if needed
npm install

# Start both servers concurrently
npm run dev
```

---

## 🔑 Default Credentials for Testing

### Admin Access
- **Admin Login Route**: `http://localhost:5173/admin/login`
- **Email**: `admin@gmail.com`
- **Password**: `admin`

### Demo User Accounts
- **Username**: `aarav_shah` or `riya_patel`
- **Password**: `password123`

---

## 🌐 Endpoints & URLs

- **Frontend Application**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5000`
- **MongoDB Connection**: `mongodb://localhost:27017/vyntra_db`

---

## 🌟 Verification & Quality Guarantee
- Verified clean MongoDB collection creation via Mongoose schemas.
- Clean Socket.IO real-time event synchronization for messaging and typing.
- Tested light/dark mode persistence across user sessions.
- Comprehensive responsive layout across mobile, tablet, and desktop viewports.
