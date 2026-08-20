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

## Deploying over HTTPS

This app does not terminate TLS itself — `next start` always serves plain HTTP.
Put a reverse proxy (e.g. Caddy, nginx, or your cloud load balancer) in front of it
that:

1. Holds the TLS certificate and terminates HTTPS, forwarding plain HTTP to this
   container's port 3000.
2. Redirects HTTP → HTTPS (Caddy does this by default for any domain name).
3. Forwards `X-Forwarded-Proto`/`X-Forwarded-Host` (standard for all of the options
   above) — Auth.js reads these to know the original request was HTTPS.

Then set `AUTH_URL=https://your-domain` (alongside the existing `AUTH_SECRET`,
`AUTH_TRUST_HOST`) in `.env`. Once the app sees an `https://` URL, Auth.js
automatically switches session/CSRF cookies to `Secure` + `__Host-`/`__Secure-`
prefixed — no code change needed. The `Strict-Transport-Security` header emitted by
`next.config.ts` in production is a no-op until then (browsers ignore it over plain
HTTP), and starts taking effect the moment HTTPS is live.

## Security notes

- All routes require authentication except `/login` and `/api/auth/*` (enforced in
  `src/proxy.ts`).
- Passwords are hashed with bcrypt; sessions are JWT-based (no session table).
- Login attempts are rate-limited per email (5 attempts / 15 minutes, in-memory —
  swap for a shared store like Redis if this ever runs across multiple instances),
  and rate-limited/failed/unknown-user attempts are logged server-side (`[auth] ...`)
  for basic monitoring.
- API responses use explicit DTOs (see `src/types/project.ts`) so internal fields
  (e.g. password hashes) can never leak through a route.
- All database access goes through Prisma (parameterized queries — no raw SQL), and
  route params are validated with zod (`src/lib/validation.ts`) before hitting the
  database.
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy) are set in `next.config.ts`; see
  [Deploying over HTTPS](#deploying-over-https) for what HTTPS termination this
  still needs from the hosting environment.
- The local dev Postgres role (`dashboard_app`) was granted `CREATEDB` so
  `prisma migrate dev` can manage its shadow database. For a real deployment, use a
  separate, more-privileged role for running `prisma migrate deploy` and a
  read/write-only (no `CREATEDB`/`DDL`) role for the app's `DATABASE_URL`.
- Run `npm audit` periodically. As of this writing, the only open advisories require
  major-version bumps to `prisma` (downgrade) or `next` (their bundled `sharp`/
  `postcss`) and were left alone rather than force-applied — review release notes
  before taking those.
