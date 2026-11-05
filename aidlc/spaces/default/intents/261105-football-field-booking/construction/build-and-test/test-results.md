# Test Results

## Build

No compile/bundle. `tsx` for U1, static files for U2. Status: success.

## Unit tests

Command 1: `npx vitest run --config apps/u1-venue-booking/vitest.config.ts apps/u1-venue-booking` (via `npm --prefix apps/u1-venue-booking test -- --coverage`)

- 20 passed, 0 failed. Lines 87.61%.

Command 2: `npm --prefix apps/u2-web-ui test -- --coverage`

- 25 passed, 0 failed. Lines 80.91%.

## Integration

Both suites above. No extra live CORS browser run.

## Coverage

U1 87.61% lines, U2 80.91% lines. Floor 80% Met.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| UNIT-U1 | u1 unit-test-instructions | exit 0 | 20/20 | apps/u1-venue-booking Vitest | build-and-test | Met |
| UNIT-U2 | u2 unit-test-instructions | exit 0 | 25/25 | apps/u2-web-ui Vitest | build-and-test | Met |
| COV-80 | Testing Contract classic | 80% lines | U1 87.61 U2 80.91 | vitest --coverage | build-and-test | Met |
| CI-MERGE | Testing Contract | CI before merge | skipped | aidlc-state ci-pipeline SKIP | ci-pipeline | N/A |
| NFR3-PERF | requirements NFR3 | no 300ms target | none | NFR3 | build-and-test | N/A |
