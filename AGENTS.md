# AGENTS.md

MedVet: veterinary clinic system. FeathersJS v5 (TypeScript) backend + Nuxt 3 frontend. Two independent npm packages, no monorepo tooling — always run commands inside `medvet-backend/` or `medvet-frontend/`.

## Layout

- `medvet-backend/` — Feathers v5 + Knex + PostgreSQL + Redis. Services in `src/services/` (registered in `src/services/index.ts`), RBAC/auth hooks in `src/hooks/security.ts`, migrations in `src/migrations/`, seeds in `src/seeds/`. Compiled output is `lib/`.
- `medvet-frontend/` — Nuxt 3 with **`srcDir: 'app/'`**: pages, components, composables, stores, plugins all live under `app/` (e.g. `app/pages/`), not at the package root. Don't create top-level `pages/`.
- `docs/` — PRD/TRD/flows. Partly stale: `docs/DATABASE_SCHEMA.md` and the README ERD cover only the original 11 tables; the migrations have grown to 21 tables (added inventory, hospitalizations/kardex, notifications, grooming, etc.).

## Commands

| Task | Command (run in) |
|---|---|
| Full local stack (docker + both servers) | `./dev.sh` (repo root) |
| Infra only | `docker compose up -d medvet-postgres medvet-redis` (root) |
| Backend dev (port 3030) | `npm run dev` — nodemon + ts-node (`medvet-backend/`) |
| Backend typecheck/build | `npm run build` (tsc; no separate typecheck script) |
| Migrate / rollback / seed | `npm run migrate` / `npm run migrate:rollback` / `npm run seed` (`medvet-backend/`) |
| Backend tests | `npm test` (vitest) — **no tests written yet** |
| Frontend dev (port 3000) | `npm run dev` (`medvet-frontend/`) |
| Frontend lint / typecheck | `npm run lint` / `npm run typecheck` |

Order of verification after changes: backend `npm run build` in `medvet-backend/`; frontend `npm run lint && npm run typecheck` in `medvet-frontend/`.

## Ports & config gotchas (non-default)

- Docker exposes **non-standard host ports**: PostgreSQL **4533**, Redis **6373**, pgAdmin 5053, Directus 8053. The README's 5432/6379 are wrong — trust `docker-compose.yml` and `config/default.json`.
- Backend has **two config sources** that must stay in sync:
  - Feathers runtime config: `medvet-backend/config/default.json` (pg on 4533, redis on 6373, JWT, CORS origin `http://localhost:3000`).
  - Migrations: `knexfile.ts`, which loads `medvet-backend/.env` → `DATABASE_URL` (note: there is a backend-local `.env` separate from the root `.env`).
- `src/index.ts` calls `ensureDatabaseSchema()` at boot (`src/knex.ts`) — the backend bootstraps schema itself; don't assume migrations are the only schema source.
- Directus runs in docker-compose but the app does not use it — all API traffic goes through Feathers.

## Seed users (created by `npm run seed`, all passwords `admin123`)

- `admin@medvet.com` (role: admin) · `vet@medvet.com` (professional) · `client@medvet.com` (tutor)

## Frontend conventions

- API access via the `$feathers` client plugin (`app/plugins/feathers.client.ts`, socket.io transport, auth in localStorage) or `$fetch`/`useFetch` for plain REST endpoints (e.g. `public-carnet`). Auth state in `app/stores/auth.ts`.
- Backend URL comes from `NUXT_PUBLIC_API_URL` (default `http://localhost:3030`).
- Document export (docx/xlsx/csv/print) is client-side via `app/utils/exportEngine.ts` (`docx` + `file-saver`).
- BCV exchange rate is fetched client-side from external APIs (`app/composables/useCurrency.ts`), not from the backend.

## Known implementation gaps (don't assume these are wired up)

- **Billing/payments module does not exist in backend/DB** despite `docs/6-Implementation-Plan.md` saying "100% Completado": no `payments`/`invoices` tables or services. Frontend pages `dashboard/payments`, `admin/payments`, `admin/reports` run on hardcoded mock data.
- `available-slots` service does **not** use the Redis cache the TRD describes; no invalidation hooks on appointments.
- WebSockets are emitted by the backend but the frontend never subscribes to service events — no live updates.
- `admin/guardia.vue` mixes hardcoded patients with real `$fetch` data; notifications are manual WhatsApp links only.

## Deployment

- Railway (backend): `railway.json` → `npm install && npm run build`, start `npm run migrate && node lib/index.js`.
- Render: `render.yaml` (root `Dockerfile`, backend only). Root `package.json` `build` script builds the frontend only.
- Production: `docker-compose.prod.yml` + `nginx/`. Clinical uploads are served from `medvet-backend/public/uploads/` (kept by the Dockerfile).
