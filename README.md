# Punjab Project Dashboard

Internal, authenticated dashboard showing an interactive map of Punjab, Pakistan with a dot
per construction project. Hovering a dot shows a quick summary; clicking opens a detail popup
with cost/physical milestones, bottlenecks, and a weekly site-photo gallery.

The site is a **read-only viewer** — project data is written to the database by another
process; this app only reads and displays it.

## Stack

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma (driver adapter: `@prisma/adapter-pg`)
- Leaflet / react-leaflet (OpenStreetMap tiles)
- Auth.js / NextAuth v5 (credentials provider + JWT sessions)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `AUTH_SECRET`
   (generate a secret with `openssl rand -base64 32`).
3. Apply migrations and load sample data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
   This creates a dev login: `engineer@example.com` / `ChangeMe123!` — change or remove
   this user before any non-local use.
4. Start the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

Other useful scripts: `npm run db:studio` (browse the database), `npm run build` (production
build), `npm run lint`.

## Project structure

```
prisma/            Database schema, migrations, seed data
src/app/           Routes and API endpoints (Next.js App Router)
src/components/    UI components (map, project detail, shared ui)
src/lib/           Server-side utilities (db client, auth config, validation, rate limiting)
src/types/         Shared TypeScript types
src/proxy.ts       Route protection (Next.js "proxy", formerly "middleware")
```

## Security notes

- All routes require authentication except `/login` and `/api/auth/*` (enforced in
  `src/proxy.ts`).
- Passwords are hashed with bcrypt; sessions are JWT-based (no session table).
- Login attempts are rate-limited per email (5 attempts / 15 minutes, in-memory —
  swap for a shared store like Redis if this ever runs across multiple instances).
- API responses use explicit DTOs (see `src/types/project.ts`) so internal fields
  (e.g. password hashes) can never leak through a route.
- Security headers (CSP, X-Frame-Options, etc.) are set in `next.config.ts`.
- The local dev Postgres role (`dashboard_app`) was granted `CREATEDB` so
  `prisma migrate dev` can manage its shadow database. For a real deployment, use a
  separate, more-privileged role for running `prisma migrate deploy` and a
  read/write-only (no `CREATEDB`/`DDL`) role for the app's `DATABASE_URL`.
