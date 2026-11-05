# Code Generation Plan — u1-venue-booking

## Summary

- Builds: HTTP Venue Booking service (register, session, fields, slots, bookings, mark-paid)
- Touches: `apps/u1-venue-booking/` (TypeScript service, SQLite store, Vitest)
- Tests: 5–8 unit tests per layer component plus collision integration tests; unit-scoped `vitest` command

## Sources

- Functional spec, entities, rules. [functional-spec] [entities] [rules]
- C1 contract. [contract-summary]
- Unit U1. [unit-of-work]
- Requirements FR1–FR4, NFR2. [requirements]
- Answers [Q1]–[Q5].

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "classic",
  "test_strategy": "standard",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:d7c4480b33714b199598e956dc7e6efb65e0f117591112c70714390b36240b11",
  "contract_sha256": "sha256:d130321a6d7eddc8f5b784da009c241bc1572db818faf30d2684174332a4a4b4"
}
```

Frontend behavior is omitted: U1 is a service with no screens. [unit-of-work]

## Steps

- [x] Step 1 — Project skeleton: `apps/u1-venue-booking/` with TypeScript, Node, package.json, tsconfig, `.env.example` (no secrets). [unit-of-work]
- [x] Step 2 — Bootstrap Vitest (`vitest.config.ts`) and record the unit-scoped command in `unit-test-instructions.md`.
- [x] Step 3 — Data model: SQLite schema for User, Field, Slot, Booking matching `entities.md`. Seed the first owner. [Q4] [entities]
- [x] Step 4 — Data-model tests (5–8): unique email, field name, slot (fieldId, startAt), one booking per slot, seed owner exists.
- [x] Step 5 — Repositories: User, Field, Slot, Booking access with transactional slot hold. [entities]
- [x] Step 6 — Repository tests (5–8 per store): get-by-email, unique field name, mint slot id, refuse second hold in one transaction. [FR4.3] [NFR2]
- [x] Step 7 — Business logic: register player, login, owner field CRUD, deactivate-if-empty, browse, player hold, owner-on-behalf by email, mark-paid, collision. [rules] [Q1] [Q2] [Q3] [Q5]
- [x] Step 8 — Business-logic tests (5–8 per service): BR1.1–BR4.6 happy path plus 409 collision, 409 deactivate-with-bookings, 404 unknown player email.
- [x] Step 9 — HTTP API: C1 paths plus `POST /register`; `GET /fields/{fieldId}/slots?date=`; `GET /bookings/{bookingId}` for the booking record (not the U2 screen). [contract-summary] [functional-spec]
- [x] Step 10 — API tests (5–8) plus integration tests for concurrent double-book (NFR2) and 10s timeout not retried here (caller concern).
- [x] Step 11 — README for how to run the service locally; no Docker in this first slice unless needed to boot SQLite.
- [x] Step 12 — `code-summary.md`, `traceability.json`, `source-manifest.json`.

## Story-to-step map

| FR | Plan steps |
| --- | --- |
| FR1.1 | 3, 7, 9 |
| FR1.2 | 7, 9 |
| FR1.3 | 7, 9 |
| FR2.1–FR2.4 | 3, 7, 9 |
| FR2.5, FR3.1–FR3.3 | 5, 7, 9 |
| FR4.1–FR4.4, FR4.6 | 5, 7, 9 |
| NFR2 | 6, 8, 10 |
