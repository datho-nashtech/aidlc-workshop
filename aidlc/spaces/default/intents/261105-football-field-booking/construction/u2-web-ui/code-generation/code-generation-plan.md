# Code Generation Plan — u2-web-ui

## Summary

- Builds: Desktop-first browser app that calls U1 for browse, book, owner tools, and confirmation
- Touches: `apps/u2-web-ui/` (static HTML/JS, Vitest)
- Tests: 5–8 tests per UI module (api client, 409 handling, owner-nav visibility) plus the unit-scoped vitest command

## Sources

- U2 functional spec and frontend components. [functional-spec] [frontend-components]
- C1. [contract-summary]
- Answers [Q1]–[Q4].

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

Data model, repository, and API/endpoint layers are omitted: U2 is UI-only and calls U1. [unit-of-work]

## Steps

- [x] Step 1 — Skeleton `apps/u2-web-ui/` with package.json and static `index.html`.
- [x] Step 2 — Vitest config; record unit-scoped command.
- [x] Step 3 — `api.js` client: Bearer token, 10s abort, POST /register, session, fields, slots?date=, bookings, paid.
- [x] Step 4 — api.js tests (5–8): timeout, 409 mapped, Authorization header.
- [x] Step 5 — Screens: browse, login/register, book, confirmationRef page, owner fields/bookings in one shell. [Q1] [Q4]
- [x] Step 6 — 409 shows taken and refreshes slots; no retry POST. Desktop-first. [Q2] [Q3]
- [x] Step 7 — Frontend tests (5–8): owner nav hidden for player; 409 path; confirmation shows confirmationRef.
- [x] Step 8 — README (how to point at U1), code-summary, traceability, source-manifest.

## Story-to-step map

| FR | Steps |
| --- | --- |
| FR2.5 FR3.3 | 5 |
| FR4.1 FR1.3 | 5, 6 |
| FR4.2 FR4.6 | 5 |
| FR4.5 | 5 |
