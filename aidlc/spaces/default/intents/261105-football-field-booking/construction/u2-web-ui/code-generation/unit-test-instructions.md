# Unit Test Instructions — u2-web-ui

## Framework

Vitest for this unit under `apps/u2-web-ui/`.

## How to run this unit only

From the workspace root, with Node 22:

```bash
npm --prefix apps/u2-web-ui test
```

Do not use a bare `npm test`.

## Coverage

5–8 tests per UI module (api client, shell/nav, booking 409). Keep existing suites green.

## Mocking

Mock `fetch` for U1. Do not start U1 inside these tests.

## Test data

Player token vs owner token fixtures. One held slot id for 409.
