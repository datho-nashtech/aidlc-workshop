# u1-venue-booking

HTTP service for accounts, fields, one-hour slots, pending holds, and owner mark-paid.

## Run

```bash
cd apps/u1-venue-booking
npm install
npx tsx src/index.ts
```

Default port: `3001`. Seed owner: `OWNER_EMAIL` / `OWNER_PASSWORD` (defaults `owner@venue.local` / `changeme`).

CORS is limited to the local U2 UI: `http://127.0.0.1:4173` and `http://localhost:4173`. Other origins get no `Access-Control-Allow-Origin`. Preflight `OPTIONS` returns 204.

## Tests

From the workspace root:

```bash
npx vitest run --config apps/u1-venue-booking/vitest.config.ts apps/u1-venue-booking
```
