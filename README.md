# Football field booking

First-version venue booking: one pitch site, player and owner sessions, one-hour slots, pending hold until the owner marks paid.

The product was planned and built with **AWS AI-DLC** (AI-Driven Development Life Cycle) under the **classic** scope. You describe what to build; the work walks ordered stages and stops for approval at each material gate.

## AI-DLC in five phases

AI-DLC is always the same five phases. Classic keeps a medium set of stages; heavier scopes add research, NFRs, CI, and operations.

| # | Phase | Purpose |
| --- | --- | --- |
| 0 | Initialization | Workspace, scan, workflow record |
| 1 | Ideation | What to build and how deep the process should go |
| 2 | Inception | Requirements, domain, units, HTTP contract |
| 3 | Construction | Per-unit design, code, then a combined build and test |
| 4 | Operation | Deploy, observe, incidents (not in this classic run) |

This piece of work executed **14 stages** (classic plan). Operation was skipped. Construction ran **one unit at a time** (venue service first, then the web UI).

## Stages this plan ran (14)

Numbers match the catalog (`0.1` … `3.6`). Names are the stage slugs.

### Initialization (3)

| ID | Stage | What it did here |
| --- | --- | --- |
| 0.1 | workspace-scaffold | Record dir and standing files |
| 0.2 | workspace-detection | Greenfield, languages unknown at start |
| 0.3 | state-init | Scope **classic**, depth **standard**, test strategy **standard** |

### Ideation (3 of 6)

| ID | Stage | What it did here |
| --- | --- | --- |
| 1.1 | intent-capture | Simple football field management from the requirements document |
| 1.4 | scope-definition | Classic plan; skipped market, feasibility, team, mockups |
| 1.7 | approval-handoff | Go / no-go into inception |

Skipped: 1.2 market-research, 1.3 feasibility, 1.5 team-formation, 1.6 rough-mockups.

### Inception (4 of 9)

| ID | Stage | What it did here |
| --- | --- | --- |
| 2.3 | requirements-analysis | FR/NFR list (accounts, fields, slots, bookings) |
| 2.6 | domain-design | Venue, field, slot, booking, player, owner |
| 2.7 | units-generation | **U1** `u1-venue-booking` (service), **U2** `u2-web-ui` (UI) |
| 2.8 | contract-design | One HTTP façade on U1 (C1) |

Skipped: 2.1 reverse-engineering (greenfield), 2.2 practices-discovery, 2.4 user-stories, 2.5 refined-mockups, 2.9 delivery-planning.

### Construction (3 of 7)

| ID | Stage | What it did here |
| --- | --- | --- |
| 3.1 | functional-design | Per unit: U1 service rules, U2 screens |
| 3.5 | code-generation | Plan approval, then `apps/u1-venue-booking/` and `apps/u2-web-ui/` |
| 3.6 | build-and-test | Both unit suites, ~80% line coverage floor |

Skipped: 3.2 nfr-requirements, 3.3 nfr-design, 3.4 infrastructure-design, 3.7 ci-pipeline.

### Operation (0 of 7)

All skipped: 4.1–4.7 (pipelines, environments, deploy, observability, incidents, performance validation, feedback).
