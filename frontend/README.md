<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1eL2fV1PvE7FxBHdeA5cap0tUoPQ6KzHk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Backend scaffold (added)

I added an Express + TypeScript backend in `backend/` and Docker orchestration.

Files added/changed (high level):
- `backend/` — Express + TypeScript API using `pg` for Postgres.
- `backend/Dockerfile` — production Dockerfile for backend.
- `Dockerfile.frontend` — builds frontend and serves with nginx.
- `compose.yml` — docker-compose to run db, backend, and frontend together.

Quick start with Docker Compose

1. Copy `.env` from `backend/.env.example` to `backend/.env` and edit if needed.
2. From repo root, build and run:

```bash
docker compose -f compose.yml up --build
```

API endpoints (basic):
- POST /api/auth/register { name, email, password, role }
- POST /api/auth/login { email, password }
- GET /api/events
- GET /api/events/:id
- POST /api/events (organizer, JWT)
- PUT /api/events/:id (organizer, JWT)
- DELETE /api/events/:id (organizer, JWT)
- POST /api/registrations (JWT)
- GET /api/registrations/me (JWT)
- POST /api/feedback (JWT)
- GET /api/feedback/event/:id

Notes:
- The backend runs `backend/src/init.sql` on startup to create required tables if missing.
- Set `DATABASE_URL` and `JWT_SECRET` in environment for production.

If you'd like, I can now:
- add simple request validation and stronger TypeScript types,
- add migration tooling (recommended for production), or
- hook the frontend to use the new API endpoints.
