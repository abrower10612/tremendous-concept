# syntax=docker/dockerfile:1
#
# Single-image deploy: builds the React/Vite frontend, then runs the Rails API
# which also serves the built SPA from public/. One service, same origin (no
# CORS). Used by Railway.

# ---------- Stage 1: build the React/Vite frontend ----------
FROM node:22-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
# npm install (not ci): the lockfile is generated on macOS and omits Linux-only
# optional native deps (e.g. Tailwind v4's @emnapi/*); install resolves them
# while still honoring the pinned versions.
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Rails API + built SPA ----------
FROM ruby:3.4.2-slim AS app

# System libs: libpq for PostgreSQL, build tools for native gems.
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential libpq-dev libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_WITHOUT="development test" \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

WORKDIR /app

# Install gems first (layer cached unless the Gemfile changes).
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install && rm -rf /usr/local/bundle/cache

# Application code.
COPY backend/ ./

# The built SPA, served by Rails from public/.
COPY --from=frontend /app/frontend/dist ./public

# Runtime dirs that may be excluded from the build context.
RUN mkdir -p tmp/pids log storage

EXPOSE 3000

# Create + migrate, ensure baseline seed (idempotent — never wipes live data),
# then boot on Railway's $PORT.
CMD ["sh", "-c", "bin/rails db:prepare && bin/rails db:seed && bin/rails server -b 0.0.0.0 -p ${PORT:-3000}"]
