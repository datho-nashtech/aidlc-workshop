# Intent Backlog

## Sources

- [desc] Initial description: "Build simple football field management base on this requirements document football-field-management-system.md"
- Intent statement: player booking loop, no double booking, confirmation, owner fields/prices/bookings. [intent-statement]
- Scope answers [Q1]–[Q6] in `scope-definition-questions.md`.

## Prioritization method

MoSCoW for this first version. Sequencing is dependency-first. [Q2] [Q4]

Must Haves stay inside a usable first-version loop. Should Have is cancel. Won't Have repeats what Intent Capture already left out.

## Proto-units

| ID | Proto-unit | MoSCoW | Depends on | Notes |
| --- | --- | --- | --- | --- |
| PU-1 | Owner fields at one venue | Must | — | Several fields the owner can add. [Q6] [Q3] |
| PU-2 | Owner prices | Must | PU-1 | Prices exist before a booking. [Q3] [Q4] |
| PU-3 | Visible schedule of free and taken slots | Must | PU-1, PU-2 | [Q3] |
| PU-4 | Owner books a slot on behalf of a player | Must | PU-3 | Smallest valuable slice. Collision blocked. [Q1] [Q2] |
| PU-5 | Owner sees every booking | Must | PU-4 | [Q1] [Q2] [intent-statement] |
| PU-6 | Player books a free slot | Must | PU-3 | First-version Must, after the owner path. [Q2] [Q1] |
| PU-7 | Confirmation the player can keep | Must | PU-4 or PU-6 | Last in the dependency order. [Q3] [Q2] |
| PU-8 | Cancel a booking | Should | PU-4 | Not required for the first-version loop. [Q2] |

## Won't have (this time)

| Item | Source |
| --- | --- |
| Public hosting | [intent-statement] [Q2] |
| Real card payments | [intent-statement] [Q2] |
| Admin charts | [intent-statement] [Q2] |
| Rescheduling | [intent-statement] [Q2] |
| Peak-hour pricing | [intent-statement] [Q2] |
| Recurring schedules | [intent-statement] [Q2] |
| Several venues | [Q6] |

## MVP boundary

Above the line for the first version: PU-1 through PU-7. [Q2]

First slice above a tighter line: PU-1 through PU-5 (owner-only). [Q1]

PU-8 sits below the first-version line.

No hard date is attached to any proto-unit. [Q5]

## Assumptions & Open Questions

- Assumption: PU-6 remains Must even though the first slice is owner-only. [Q1] [Q2]
- Open question: None.
