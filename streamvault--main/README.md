# 🎬 StreamVault

> A full-stack video streaming platform built with React, Node.js, Express, MongoDB, and Cloudinary.

![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Video_CDN-3448C5?logo=cloudinary&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Description

StreamVault is a production-ready video streaming platform that lets creators upload movies and series (with full season/episode management), while viewers enjoy seamless playback, personalized watch history, and episode tracking — all built on a modern, scalable stack.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🎥 **Video Upload** | Upload movies, series, and short clips via Cloudinary (up to 500MB) |
| 🔐 **User Authentication** | JWT-based register/login, role system (user / creator / admin) |
| 📺 **Episode Tracking** | Track watch progress per episode, resume where you left off |
| 🗂️ **Series Management** | Multi-season, multi-episode series with full CRUD |
| 🔍 **Search & Filter** | Full-text search, filter by genre, type, and year |
| ❤️ **Likes & Saves** | Like videos, build a personal watchlist |
| 🛡️ **Security** | Helmet, rate limiting, input validation, CORS |
| 🚀 **Deployment Ready** | `render.yaml` for Render + `vercel.json` for Vercel included |

---

## 🗂️ Project Structure

```
streamvault/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── auth/           # Login, Register forms
│       │   ├── video/          # VideoCard, VideoPlayer, EpisodeList
│       │   ├── layout/         # Navbar, Footer, Sidebar
│       │   └── ui/             # Buttons, Modals, Loaders
│       ├── pages/              # Home, Browse, Watch, Profile
│       ├── hooks/              # useVideos, useAuth, useProgress
│       ├── context/            # Zustand auth store
│       └── utils/              # API helpers, formatters
│
├── server/                     # Node.js / Express backend
│   ├── index.js                # Entry point
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary + Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Video.js
│   │   └── Episode.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── videoController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── videos.js
│   │   ├── episodes.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js             # JWT protect + restrictTo
│
├── render.yaml                 # Render deployment config (backend)
├── vercel.json                 # Vercel config (frontend)
├── package.json                # Root scripts (runs both with concurrently)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier is fine)
- Cloudinary account (free tier: 25GB storage)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/streamvault.git
cd streamvault
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Then fill in your values (see [Environment Variables](#-environment-variables) below).

### 4. Start development servers

```bash
npm run dev
```

This runs **both** the React frontend (`localhost:3000`) and the Express API (`localhost:5000`) concurrently.

---

## 🔑 Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Express server | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_string` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcDEF...` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_APP_NAME` | App name shown in UI | `StreamVault` |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |

### Videos
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/videos` | No | List videos (filter, search, paginate) |
| GET | `/api/videos/:id` | No | Get video + episodes |
| POST | `/api/videos` | Creator | Upload new video |
| PATCH | `/api/videos/:id` | Creator | Update video |
| DELETE | `/api/videos/:id` | Creator | Delete video + Cloudinary asset |
| POST | `/api/videos/:id/like` | User | Toggle like |

### Episodes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/episodes?series=:id&season=1` | No | List episodes |
| GET | `/api/episodes/:id` | No | Get single episode |
| POST | `/api/episodes` | Creator | Add episode |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/watch-history` | User | Get watch history |
| POST | `/api/users/watch-history` | User | Save progress |
| GET | `/api/users/saved` | User | Get saved list |
| POST | `/api/users/saved/:videoId` | User | Toggle save |

---

## 🌐 Deployment

### Recommended Stack (Free Tier)

```
GitHub Repo
    │
    ├─→ Vercel (Frontend — React)
    │       Auto-deploys on push to main
    │       Set: REACT_APP_API_URL = https://your-api.onrender.com/api
    │
    └─→ Render (Backend — Node/Express)
            render.yaml configures everything
            Set all server .env vars in Render dashboard
            Free tier sleeps after 15min inactivity (upgrade for always-on)
```

### Step-by-step: Deploy to Render + Vercel

**Backend → Render**
1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
3. Render detects `render.yaml` automatically.
4. Add all environment variables from `server/.env.example` in the Render dashboard.
5. Deploy. Note your API URL: `https://streamvault-api.onrender.com`

**Frontend → Vercel**
1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
2. Set root directory to `client`.
3. Add environment variable: `REACT_APP_API_URL` = `https://streamvault-api.onrender.com/api`
4. Deploy. Your site is live! 🎉

**Also update Render:**
Set `CLIENT_URL` = your Vercel URL (e.g. `https://streamvault.vercel.app`) to fix CORS.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Zustand, React Query, React Player |
| Backend | Node.js, Express 4, JWT, Bcrypt, Helmet |
| Database | MongoDB Atlas + Mongoose |
| Storage | Cloudinary (video, images) |
| Deployment | Render (API) + Vercel (client) |

---

## 📄 License

MIT © 2025 StreamVault
