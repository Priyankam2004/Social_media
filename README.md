# SocialApp — Modern MERN Social Media Application

A complete, production-ready, full-stack Social Media Web Application built using the MERN Stack (MongoDB, Express, React, Node) and Redux Toolkit. Designed with a clean, professional, white-themed user interface, full responsiveness, and smooth animations.

## Features

- **Authentication Module**: Secure login and registration with validation, password hashing (bcrypt), duplicate checking, JWT generation, and profile picture uploads.
- **Persistent Session**: Authentication state is stored in Redux and persisted using Redux Persist across browser refreshes.
- **Home Feed**: Create posts with image upload and caption. Real-time feed updates.
- **Post Interaction**: Like/unlike posts (restricted to one like per user) and view total like count.
- **Comments System**: Write comments, view comment lists (with avatars, names, relative timestamps), and delete own comments.
- **Post Deletion**: Post owners can delete their own posts, which opens a confirmation modal and cleans up files from the backend storage.
- **User Profiles**: View personal profiles with count of posts, bio, and join date. Edit profile information (including avatar uploads) with a live preview.
- **Modern UI/UX**: White theme with soft shadows, custom glassmorphism navbar, skeleton loading screens, spinners, and hover/micro-animations.
- **State Management**: Built with Redux Toolkit using Async Thunks for clean, structured asynchronous data fetching.

---

## Tech Stack

### Frontend
- **React.js** (Vite build tool)
- **Redux Toolkit** (State Management)
- **Redux Persist** (Auth State Persistence)
- **React Router DOM** (Client Routing)
- **Axios** (API Requests)
- **Tailwind CSS v4** (Styling & Modern UI)
- **React Icons** & **React Hot Toast** (Icons & Notifications)
- **React Hook Form** (Form Validation)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose** (Database & Modeling)
- **JWT** & **Bcryptjs** (Securing APIs & Hashing)
- **Multer** (Local File Uploads)

---

## Folder Structure

```
d:\webcode\social media\
├── backend/
│   ├── config/            # Database Connection
│   ├── controllers/       # Business Logic Controllers (Auth, User, Post)
│   ├── middleware/        # JWT Protect, Error Handlers, Multer Upload
│   ├── models/            # Mongoose Schemas (User, Post)
│   ├── routes/            # Express Route Declarations (Auth, User, Post)
│   ├── uploads/           # Uploaded images (created automatically)
│   ├── .env               # Local configuration variables
│   └── server.js          # App entrypoint
├── frontend/
│   ├── src/
│   │   ├── app/           # Redux Store Setup
│   │   ├── components/    # Reusable UI Components (Navbar, PostCard, modals)
│   │   ├── features/      # Redux Slices & API Connectors (Auth, User, Post)
│   │   ├── pages/         # React Page Components (Home, Profile, Login, Register)
│   │   ├── utils/         # Axios instance and interceptors
│   │   ├── App.jsx        # Routing configuration
│   │   └── index.css      # Custom Tailwind styling & animations
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json        # Deployment rewrite rule
└── README.md
```

---

## Setup & Running Locally

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas cloud URI

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. A `.env` file has been pre-created. If you want to use MongoDB Atlas, open the `.env` file and replace `MONGODB_URI` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/socialapp
   JWT_SECRET=supersecretjwtkey_1234567890
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend in development mode (using nodemon):
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client will start on `http://localhost:5173`.*

---

## Backend API Documentation

### Auth Module (`/api/auth`)
- `POST /api/auth/register` — Register a new user. Expects `multipart/form-data` with `name`, `username`, `email`, `password`, and optional `profilePic` (file).
- `POST /api/auth/login` — Login an existing user. Expects JSON with `email` and `password`. Returns user details and JWT token.
- `GET /api/auth/me` — Retrieve the current logged-in user profile (private route, requires Bearer Token).

### User Module (`/api/users`)
- `GET /api/users/profile` — Get full profile details (private).
- `PUT /api/users/profile` — Update user details. Expects `multipart/form-data` with `name`, `username`, `bio` and/or `profilePic`. (private).

### Posts Module (`/api/posts`)
- `POST /api/posts` — Create a new post. Expects `multipart/form-data` with `image` (file) and optional `caption`. (private).
- `GET /api/posts` — Get all posts sorted by newest first (private).
- `GET /api/posts/:id` — Get single post details (private).
- `DELETE /api/posts/:id` — Delete a post (private, post owner only). Cleans up files.
- `PUT /api/posts/like/:id` — Toggle like/unlike on a post (private).
- `POST /api/posts/comment/:id` — Comment on a post. Expects JSON `{ "text": "comment body" }` (private).
- `DELETE /api/posts/comment/:postId/:commentId` — Delete a comment (private, comment owner or post owner only).

---

## Deployment Instructions

### Backend (Render)
1. Push your project files to a GitHub repository.
2. Sign up on [Render](https://render.com) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `MONGODB_URI` = Your MongoDB Atlas Connection String
   - `JWT_SECRET` = A strong secret string
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

### Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com) and import your Git repository.
2. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = Your deployed backend Render URL (e.g., `https://your-backend.onrender.com`)
4. Click **Deploy**. Vercel will build the React SPA and serve it, using `vercel.json` rewrites to support clean URL routing.
