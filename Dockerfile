# file: Dockerfile
# description: Production image for the landing site with build-time secrets excluded
# reference: railway.toml, .dockerignore, next.config.ts

# Nixpacks injects every service variable into the build environment. A
# Dockerfile build only receives the arguments declared below, which is how
# SWARM_API_KEY stays out of the builder and out of the final image config.
# It is supplied at container start instead, and read per request by
# app/api/swarm/run/route.ts.

FROM oven/bun:1.3-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.3-slim AS builder
WORKDIR /app

# Public values only. Next.js inlines these into the client bundle, so they
# have to exist at build time and must never hold a secret.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.3-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app ./

USER bun
EXPOSE 3000
CMD ["sh", "-c", "bun run start -- -p ${PORT:-3000}"]
