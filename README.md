# Tremendous Concept — Contacts Feature

A concept clone of the [Tremendous](https://www.tremendous.com) reward-sending
platform that adds a **Contacts** feature: save recipients once (name, email,
phone) and quickly re-add them when sending gift cards, via an **"Add from
Contacts"** picker on the order recipients screen.

The UI mirrors the real Tremendous app; only the happy-path flow is wired up
end-to-end. Built as a portfolio piece demonstrating **Ruby on Rails** (API) and
**React + TypeScript** (frontend) — the stack named in the Tremendous job
description.

## The feature in one flow

Home → **Send rewards** → **Send via email** → **Add recipients** →
**Add from Contacts** → recipients populate → **Continue** → review →
**Place order** → **Confirm** → the order appears in **Order history**.

A dedicated **Contacts** page (in the sidebar) provides full create/edit/delete
for saved contacts.

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Ruby on Rails 8 (API-only), ActiveRecord — SQLite locally, PostgreSQL in production |
| Frontend | React 19 + TypeScript, Vite, Tailwind CSS v4 |
| Data/state | TanStack Query (server state), React Router, axios |
| Icons | lucide-react |

## Architecture

Monorepo with two independently-run apps:

```
tremendous-concept/
├── backend/    Rails API  — http://localhost:3000
└── frontend/   React SPA  — http://localhost:5173  (proxies /api → backend)
```

- **Money** is stored as integer cents (`amount_cents`, `total_cents`) and
  formatted in the UI — no floating-point money bugs.
- **Orders** get a Tremendous-style public id (e.g. `81EKD82OE9L8`) and compute
  their totals from their recipients on save.
- The **order draft** (campaign, recipients, payment) lives in a React context
  that spans the multi-screen order flow.
- The Vite dev server **proxies `/api`** to Rails, so the browser uses
  same-origin relative URLs and there's no CORS to configure.

### Data model

```
Contact(name, email, phone)

Order(public_id, order_type, status, campaign_name, products_included,
      payment_method_label, currency, subtotal_cents, total_cents,
      external_id, placed_by_name, placed_by_email)
  └─ has_many Recipient(name, email, amount_cents, currency)
```

### API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/contacts` | List contacts |
| POST | `/api/contacts` | Create a contact |
| PATCH | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |
| GET | `/api/orders` | List orders (history) |
| GET | `/api/orders/:public_id` | Order detail + recipients |
| POST | `/api/orders` | Place an order (nested recipients) |

## Prerequisites

- Ruby 3.4+ and Rails 8 (`gem install rails`)
- Node 18+ and npm

## Setup & run

**Backend** (terminal 1):

```bash
cd backend
bundle config set --local without 'production'  # skip pg; local dev uses SQLite
bundle install
bin/rails db:setup        # create, migrate, and seed
bin/rails server          # http://localhost:3000
```

> The `pg` (PostgreSQL) gem lives in the `:production` group, so local dev needs
> no `libpq` — the line above skips it. Production installs it inside Docker.

**Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173.

### Seed data

`bin/rails db:seed` is **idempotent and non-destructive** — it only *ensures*
the baseline demo data exists (3 contacts + 16 historical orders, $461.00), and
never deletes, so re-running it (or a redeploy) never wipes data created live.
For a clean slate locally, use `bin/rails db:reset`.

## Deployment (Railway)

The whole stack deploys as **one Railway service**: a multi-stage `Dockerfile`
builds the React app and the Rails API serves it from `public/` (same origin —
no CORS), backed by **PostgreSQL** so data persists across redeploys.

1. Push this repo (the single monorepo) to GitHub.
2. On [Railway](https://railway.com): **New Project → Deploy from GitHub repo**.
   Railway auto-detects the root `Dockerfile` and builds it.
3. In the project, **New → Database → PostgreSQL**.
4. On the web service, set **Variables**:
   - `DATABASE_URL` → reference the database: `${{Postgres.DATABASE_URL}}`
   - `SECRET_KEY_BASE` → a random secret (`cd backend && bin/rails secret`)
5. Deploy. On boot the container runs `db:prepare` + the idempotent `db:seed`,
   then serves on Railway's `$PORT`. Health check is `GET /up`.
6. Generate a public domain from the service's **Settings → Networking**.

The production image was built and verified locally against PostgreSQL,
including a redeploy test confirming live-created orders survive and seed data
is not duplicated.

## Notes

- This is a concept: non-happy-path buttons (Billing, Campaigns, CSV upload,
  text-message sending, etc.) are visual only.
- If Tailwind styles ever look stale in dev, clear the Vite cache and restart:
  `rm -rf node_modules/.vite && npm run dev`.
