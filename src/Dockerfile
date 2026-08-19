# One image, used for every role — the app server, running migrations, and
# seeding. docker-compose.yml picks the role per service via `command:`, all
# pointing at this same image.
#
# Build from the repo root:
#   docker build -f src/Dockerfile -t constructiondashboard .
#
# Required env vars at `docker run` time:
#   DATABASE_URL     postgresql://... (points at your Postgres instance)
#   AUTH_SECRET      NextAuth session secret
#   AUTH_TRUST_HOST  true (Auth.js refuses unrecognized hosts otherwise —
#                    needed for any self-hosted deployment, container or not)
#
# Default command runs the app (`next start`); docker-compose overrides
# `command:` to `prisma migrate deploy` / `prisma db seed` for the other roles.

# ---- deps: full dependency graph, cached separately from source changes ----
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: generate the Prisma client and build the Next.js app ----
FROM node:22-bookworm-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runtime: everything needed for any role (app / migrate / seed) ----
FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid nodejs --no-create-home nextjs
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Full app, including node_modules with the Prisma CLI, tsx, and next —
# no standalone-output trimming, since this single image also needs to run
# `prisma migrate deploy` / `prisma db seed`, not just serve traffic.
COPY --from=builder --chown=nextjs:nodejs /app ./

USER nextjs
EXPOSE 3000
CMD ["npx", "next", "start"]
