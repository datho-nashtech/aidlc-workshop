# Code Summary — u1-venue-booking

## Sources

- Plan steps 1–12. [code-generation-plan]
- Functional spec and rules. [functional-spec] [rules]

## Files created

- `apps/u1-venue-booking/` TypeScript HTTP service (Node `http`, in-memory store, Vitest)
- Register, session, fields, slots (`?date=`), bookings, mark-paid, GET booking

## Decisions

- In-memory maps plus `withLock` instead of SQLite so the unit runs without a native database binding.
- Seed owner via `OWNER_EMAIL` / `OWNER_PASSWORD` (defaults for local only).
- Session is a bearer token from `POST /session`.
- Tests executed in this stage with Node 22 (nvm); default shell Node 14 cannot run Vitest 2.

## Tests

- 20 tests passed (`store`, `services`, `http`) via
  `npx vitest run --config apps/u1-venue-booking/vitest.config.ts apps/u1-venue-booking`

## Deviations

- SQLite from the plan was replaced by an in-memory store with a serial lock for NFR2.
