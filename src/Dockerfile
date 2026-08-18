# Build from the repo root so this Dockerfile can see package.json, prisma/,
# and the rest of the app:
#   docker build -f src/Dockerfile -t dashboard-tracker .
#
# This produces the lean "runner" image below (`node server.js`, no dev
# tooling, no Prisma CLI). Required env vars at `docker run` time:
#   DATABASE_URL     postgresql://... (points at your Postgres instance)
#   AUTH_SECRET      NextAuth session secret
#   AUTH_TRUST_HOST  true (Auth.js refuses unrecognized hosts otherwise —
#                    needed for any self-hosted deployment, container or not)
#
# Database migrations are NOT run automatically by the runner image — that's
# deliberate: with multiple replicas you don't want every container racing to
# run `prisma migrate deploy` on boot. Run it once, explicitly, using the
# `migrator` stage (has the full Prisma CLI the lean runner doesn't):
#   docker build -f src/Dockerfile --target migrator -t dashboard-tracker:migrator .
#   docker run --rm -e DATABASE_URL=... dashboard-tracker:migrator
# then start/roll out the runner image.

# ---- deps: full dependency graph, cached separately from source changes ----
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: generate the Prisma client and build the Next.js standalone output ----
FROM node:22-bookworm-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- migrator: applies pending Prisma migrations; not used to serve traffic ----
FROM builder AS migrator
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- runner: minimal production image that actually serves the app ----
FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1001 nodejs \
    && useradd --uid 1001 --gid nodejs --no-create-home nextjs
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# .next/standalone already contains a pruned node_modules with only the
# packages actually reachable at runtime (traced during `next build`).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
