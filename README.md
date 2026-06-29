# QuickBlog — AI-Powered Full-Stack Blogging Platform

A production-ready MERN blogging platform with an admin CMS, AI-assisted writing, image CDN, comment moderation, SEO-friendly URLs, and automated CI/CD.

![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Stack](https://img.shields.io/badge/Express-5-000000?logo=express)
![Stack](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions)

## Live Demo

After deploying to Vercel, update these URLs:

| App | URL |
|-----|-----|
| **Frontend** | `https://frontend-blog-iota-flax.vercel.app/` |
| **API** | `https://blog-app-five-pearl.vercel.app/` |

**GitHub:** [github.com/Sumant246u/Blog_App](https://github.com/Sumant246u/Blog_App)

## Features

### Public
- Blog listing with category filters and search
- SEO-friendly slug URLs (`/blog/my-post-title`)
- Dynamic Open Graph & Twitter meta tags
- View counter per post
- Comment system with admin approval
- Email newsletter subscription
- Social sharing (Twitter, Facebook, LinkedIn)
- 404 page for missing blogs

### Admin CMS
- Secure JWT auth with bcrypt password hashing and token expiry
- Full blog CRUD (create, read, update, delete)
- Draft / publish workflow
- Rich-text editor (Quill)
- AI content generation (Google Gemini)
- Image upload with auto WebP optimization (ImageKit)
- Comment moderation panel

### Engineering
- REST API with Express 5 + Mongoose
- Automated API tests (Vitest + Supertest)
- GitHub Actions CI (test + lint + build)
- Vercel serverless deployment ready

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, React Router 7, Quill, Motion |
| Backend | Node.js, Express 5, Mongoose 8, Multer, JWT, bcrypt |
| Database | MongoDB Atlas |
| Integrations | Google Gemini, ImageKit |
| DevOps | GitHub Actions, Vercel |

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas cluster
- ImageKit account
- Google Gemini API key

### 1. Clone & install

```bash
git clone https://github.com/your-username/BlogApp.git
cd BlogApp

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in credentials in both `.env` files.

**Secure admin password (recommended):**

```bash
cd backend
node scripts/hash-password.js your-password
# Copy ADMIN_PASSWORD_HASH into backend/.env
```

Your existing `ADMIN_PASSWORD` still works for local dev until you add the hash.

### 3. Run locally

```bash
# Terminal 1 — API (port 3000)
cd backend && npm run server

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open `http://localhost:5173` and log in at `/admin`.

### 4. Run tests

```bash
cd backend
npm test
# or: npx vitest run
```

## Deploy to Vercel (fresh setup)

Deploy **two separate Vercel projects** from the same repo:  
[github.com/Sumant246u/Blog_App](https://github.com/Sumant246u/Blog_App)

### Before you start

1. **MongoDB Atlas** → Network Access → allow `0.0.0.0/0` (so Vercel can connect)
2. Generate admin password hash locally:
   ```bash
   cd backend
   node scripts/hash-password.js YourSecurePassword
   ```
   Copy the `ADMIN_PASSWORD_HASH` output for Vercel.

---

### Step 1 — Deploy Backend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **Blog_App** from GitHub
3. **Project name:** e.g. `blog-app-api`
4. **Root Directory:** click Edit → set to `backend`
5. **Framework Preset:** Other
6. Add **Environment Variables** (Production):

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD_HASH` | From `hash-password.js` script |
| `JWT_SECRET` | Long random string (e.g. 32+ chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/your-id` |
| `VERCEL` | `1` |

7. Click **Deploy**
8. Copy your backend URL → e.g. `https://blog-app-api.vercel.app`
9. Test: open `https://blog-app-api.vercel.app/` → should show `API is working`

> `FRONTEND_URL` is added in Step 3 after frontend deploy.

---

### Step 2 — Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same Blog_App** repo
3. **Project name:** e.g. `blog-app`
4. **Root Directory:** click Edit → set to `frontend`
5. **Framework Preset:** Vite (auto-detected)
6. Add **Environment Variable**:

| Variable | Value |
|----------|-------|
| `VITE_BASE_URL` | Your backend URL from Step 1 (no trailing slash) |

Example: `https://blog-app-api.vercel.app`

7. Click **Deploy**
8. Copy your frontend URL → e.g. `https://blog-app.vercel.app`

---

### Step 3 — Connect CORS (required)

1. Open **backend** project on Vercel → **Settings** → **Environment Variables**
2. Add:
   | Variable | Value |
   |----------|-------|
   | `FRONTEND_URL` | Your frontend URL from Step 2 |
3. Go to **Deployments** → click **⋯** on latest → **Redeploy**

---

### Step 4 — Verify

| Test | Expected |
|------|----------|
| Frontend home | Blogs load, no CORS errors in browser console (F12) |
| `/admin` | Login works with your admin email + password |
| Add blog | Image uploads, saves to MongoDB |
| Newsletter | Subscribe shows success toast |

---

### Step 5 — Update README

Replace the Live Demo URLs at the top of this README with your real Vercel URLs and push to GitHub.

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/login` | No | Admin login → JWT |
| GET | `/api/admin/dashboard` | Yes | Dashboard stats |
| GET | `/api/blog/all` | No | Published blogs |
| GET | `/api/blog/:slug` | No | Single blog (404 if not found) |
| POST | `/api/blog/add` | Yes | Create blog |
| POST | `/api/blog/update/:id` | Yes | Update blog |
| POST | `/api/blog/delete` | Yes | Delete blog |
| POST | `/api/blog/toggle-publish` | Yes | Toggle publish status |
| POST | `/api/blog/generate` | Yes | AI content generation |
| POST | `/api/blog/add-comment` | No | Submit comment |
| POST | `/api/blog/comments` | No | Get approved comments |
| POST | `/api/newsletter/subscribe` | No | Email newsletter signup |

## Resume Highlights

1. **Full CRUD CMS** — Admin panel with draft/publish workflow and comment moderation
2. **Secure auth** — bcrypt password hashing, JWT with expiry, 401 session handling
3. **Third-party integrations** — Gemini AI, ImageKit CDN
4. **SEO & UX** — Slug routing, meta tags, 404 pages, newsletter API
5. **Testing & CI** — Vitest/Supertest + GitHub Actions
6. **Production deployment** — Serverless Express on Vercel with MongoDB Atlas

## License

MIT
