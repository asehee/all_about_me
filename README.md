# Blog Website

Built with React, TypeScript, and Tailwind CSS, featuring a clean design system powered by shadcn/ui.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm/pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cf_test
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Journal API (Cloudflare D1)

The backend is split into route modules and shared libraries:

- `worker/src/routes/posts.ts`
- `worker/src/routes/comments.ts`
- `worker/src/lib/db.ts`
- `worker/src/lib/auth.ts`
- `worker/src/lib/security.ts`
- `worker/src/lib/schemas.ts`

Features added:

- Zod request/response validation
- Auth required for all write operations (`POST/PUT/DELETE`)
- Author field forced from authenticated user
- Normalized tag model (`tags`, `post_tags`)
- Post fields: `status`, `slug`, `published_at`
- Comment soft delete (`deleted_at`)
- Write rate limiting
- Restricted CORS and security headers
- Structured logs for `wrangler tail`

### Local setup

1. Apply local migrations:
   ```bash
   npm run d1:migrate:local
   ```
2. Optional local write auth:
   - set Worker secret `AUTH_BEARER_TOKEN`
   - in browser, click `Set Write Token` in Journal page and paste the same token
3. Run Worker API:
   ```bash
   npm run worker:dev
   ```
4. Run frontend in another terminal:
   ```bash
   npm run dev
   ```

`vite.config.ts` proxies `/api` to Worker (`http://127.0.0.1:8787`) in local dev.

## 🌐 Deployment Structure

This project is deployed as two separate services:

1. API backend (Cloudflare Worker + D1)
   - config: `wrangler.toml`
   - deploy: `npm run worker:deploy`
2. Frontend (Cloudflare Pages static site)
   - config: `wrangler.pages.toml`
   - preview deploy: `npm run pages:deploy:preview`
   - production deploy: `npm run pages:deploy:prod`

### Recommended flow

1. Update DB schema if needed:
   ```bash
   npm run d1:migrate:remote
   ```
2. Deploy backend API:
   ```bash
   npm run worker:deploy
   ```
3. Deploy frontend preview and test:
   ```bash
   npm run pages:deploy:preview
   ```
4. Promote to production:
   ```bash
   npm run pages:deploy:prod
   ```

### Secure write flow (fix 401 on create/update/delete)

If journal writes return `401 UNAUTHORIZED`:
1. Set Worker secret:
   ```bash
   AUTH_BEARER_TOKEN="your-strong-token" npm run worker:secret:auth
   ```
2. Deploy backend and frontend:
   ```bash
   VITE_API_BASE_URL="https://all-about-me-api.asehee127.workers.dev" npm run release:prod:auth
   ```
3. Open Journal page and click `Set Write Token`, then paste `your-strong-token`.

This keeps the token out of the frontend bundle and stores it only in browser `sessionStorage`.

Current runtime endpoints:

- API: `https://all-about-me-api.asehee127.workers.dev`
- Frontend production domain: `https://hee.dance`
