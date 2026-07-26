# Ajit Mangsulikar — Portfolio

A full-stack personal portfolio built with **React + Vite** on the frontend and **Node.js + Express** on the backend, backed by MongoDB Atlas, Cloudinary, and Resend.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite 8, TailwindCSS 4, React Router 7 |
| Backend   | Node.js, Express 5, MongoDB Atlas (Mongoose)    |
| Storage   | Cloudinary v2 (images & PDFs)                   |
| Email     | Resend                                          |
| Auth      | JWT + bcryptjs                                  |
| Hosting   | Netlify (frontend) + Render (backend)           |

---

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+
- A MongoDB Atlas cluster
- A Cloudinary account
- A Resend account

### 1 — Clone & install dependencies

```bash
git clone https://github.com/AjitM07/MyPortfolio.git
cd MyPortfolio
npm run install:all
```

### 2 — Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in all the values (see the table below).

### 3 — Configure the frontend

```bash
# For local dev the Vite proxy already points to localhost:5000 — no extra config needed.
# For production, edit frontend/.env.production with your Render backend URL.
```

### 4 — Start both servers

```bash
# Terminal 1 — backend (http://localhost:5000)
npm run dev:backend

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:frontend
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                  | Description                                              |
|---------------------------|----------------------------------------------------------|
| `PORT`                    | Port the Express server listens on (default `5000`)      |
| `NODE_ENV`                | `development` or `production`                            |
| `MONGODB_URI`             | MongoDB Atlas connection string                          |
| `JWT_SECRET`              | Long random string for signing JWTs                      |
| `CLOUDINARY_CLOUD_NAME`   | From your Cloudinary dashboard                           |
| `CLOUDINARY_API_KEY`      | From your Cloudinary dashboard                           |
| `CLOUDINARY_API_SECRET`   | From your Cloudinary dashboard                           |
| `RESEND_API_KEY`          | API key from [resend.com](https://resend.com)            |
| `CONTACT_RECIPIENT_EMAIL` | Email address that receives contact-form messages        |
| `CORS_ORIGIN`             | Comma-separated list of allowed frontend origins         |

### Frontend (`frontend/.env.production`)

| Variable        | Description                                           |
|-----------------|-------------------------------------------------------|
| `VITE_API_URL`  | Full URL of your deployed backend, e.g. `https://myportfolio-backend.onrender.com/api` |

---

## Deployment

### Frontend → Netlify

1. Push the repo to GitHub.
2. Create a new Netlify site → **"Import from Git"** → select this repo.
3. Set **Base directory** to `frontend`, **Build command** to `npm run build`, **Publish directory** to `frontend/dist`.
4. Add the environment variable `VITE_API_URL` in Netlify → Site Settings → Environment Variables.
5. Deploy. Netlify will automatically pick up `frontend/netlify.toml` for the SPA redirect rules.

### Backend → Render

1. Create a new **Web Service** on Render → connect this repo.
2. Set **Root directory** to `backend`, **Build command** to `npm install`, **Start command** to `npm start`.
3. Add all backend environment variables in Render → Environment.
4. Set `CORS_ORIGIN` to your Netlify URL (e.g. `https://ajitmangsulikar.netlify.app`).
5. The `backend/render.yaml` file also provisions a **Cron Job** that pings `/health` every 14 minutes to prevent the free-tier service from sleeping.

> [!TIP]
> After deploying both services, update the canonical/OG/Twitter URLs in `frontend/index.html` to your final Netlify domain if it differs from the placeholder.

---

## Project Structure

```
MyPortfolio/
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   ├── netlify.toml       # Netlify SPA redirect config
│   ├── vite.config.js
│   └── .env.production    # Placeholder — set VITE_API_URL
│
├── backend/               # Node.js + Express API
│   ├── config/            # DB + Cloudinary setup
│   ├── middleware/        # Auth + file upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route handlers
│   ├── render.yaml        # Render deployment + cron config
│   ├── server.js
│   └── .env.example       # Copy to .env and fill in secrets
│
└── package.json           # Root convenience scripts
```

---

## License

MIT © Ajit Mangsulikar
