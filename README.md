# Sense Clinic

A minimal full-stack monorepo foundation for the **Sense Clinic** web application.

## Tech Stack

- **Frontend:** React, Vite, react-router-dom (CSS managed manually)
- **Backend:** Node.js, Express.js, PostgreSQL (`pg`), dotenv, cors, express-session, bcrypt
- **Dev tool:** concurrently (run frontend + backend together)

## Folder Structure

```
sense-clinic/
├── frontend/      # React + Vite app
│   ├── src/       # App.jsx, main.jsx, index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/       # Express API
│   ├── src/
│   │   └── index.js  # minimal server + test routes
│   ├── package.json
│   └── .env.example
├── package.json   # root, runs both with concurrently
├── .gitignore
└── README.md
```

## Install Dependencies

```bash
npm run install:all
```

This installs root, frontend, and backend dependencies.

## Run Development Server

```bash
npm run dev
```

Runs frontend (Vite, port 5173) and backend (Express, port 5000) together.

Or individually:

```bash
npm run dev:frontend   # frontend only
npm run dev:backend    # backend only
```

## Backend Test Routes

- `GET /` → `"Sense Clinic Backend is running"`
- `GET /api/health` → `{ "status": "ok", "message": "Sense Clinic API is running" }`

Copy `.env.example` to `.env` in `frontend/` and `backend/` and adjust as needed.
