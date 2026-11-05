# Code Summary — u2-web-ui

## Files created

- `apps/u2-web-ui/package.json`
- `apps/u2-web-ui/package-lock.json`
- `apps/u2-web-ui/vitest.config.js`
- `apps/u2-web-ui/index.html`
- `apps/u2-web-ui/README.md`
- `apps/u2-web-ui/src/api.js`
- `apps/u2-web-ui/src/shell.js`
- `apps/u2-web-ui/src/app.js`
- `apps/u2-web-ui/src/api.test.js`
- `apps/u2-web-ui/src/shell.test.js`
- `apps/u2-web-ui/src/app.test.js`

## Decisions

- Static HTML + ES modules; all domain state lives in U1.
- Writes abort at 10s; 409 on book shows “that hour is taken” and reloads slots; no POST retry.
- Owner nav only when session role is owner (seed owner email `owner@venue.local`).
- Confirmation page shows `confirmationRef` from `GET /bookings/{id}`.

## Tests

- 17 Vitest tests run in this stage: `npm --prefix apps/u2-web-ui test` (Node 22), all passed.
- Fetch is mocked; U1 is not started.

## Deviations

- None from the approved plan. Data/repo/API layers remain omitted (UI-only).
