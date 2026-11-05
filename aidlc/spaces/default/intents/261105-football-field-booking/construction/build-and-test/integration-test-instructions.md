# Integration Test Instructions

Standard strategy: U1 HTTP façade vs U2 client contract.

## How to run

From workspace root with Node 22:

1. `npx vitest run --config apps/u1-venue-booking/vitest.config.ts apps/u1-venue-booking`
2. `npm --prefix apps/u2-web-ui test`

U2 mocks fetch; U1 http tests exercise the live in-process server. Together they cover register, session, fields, slots, bookings, 409, and paid.

Live browser-to-U1 is not automated here (no CORS on U1). Manual: start U1, open the UI, browse a day, register, book.

## Coverage

Keep both suites green. Classic 80% line floor is measured on each unit command with Vitest coverage when the provider is installed.
