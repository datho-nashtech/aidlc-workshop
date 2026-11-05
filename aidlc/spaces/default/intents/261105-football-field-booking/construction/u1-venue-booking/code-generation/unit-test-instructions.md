# Unit Test Instructions — u1-venue-booking

## Framework

- Vitest for this unit’s TypeScript service under `apps/u1-venue-booking/`.
- Config: `apps/u1-venue-booking/vitest.config.ts`.
- Isolated SQLite (file or memory) per test file; no shared global DB.

## How to run this unit only

From the workspace root, after Step 2 of the plan has created the app:

```bash
npx vitest run --config apps/u1-venue-booking/vitest.config.ts apps/u1-venue-booking
```

Do not use a bare `npm test` for this unit. Build and Test will run this exact command.

## Coverage

- Standard strategy: 5–8 tests per component (stores and services listed in the plan).
- Keep any existing suite green.
- Do not lower coverage settings to pass.

## Mocking

- Prefer a real in-memory SQLite for repository tests.
- Mock the clock only when testing on-the-hour slot minting.
- Do not mock away the collision transaction in NFR2 tests.

## Test data

- Seed one owner (`role: owner`) in fixtures.
- Seed one player with a known email for owner-on-behalf.
- Use distinct field names per test to avoid unique-name clashes.
