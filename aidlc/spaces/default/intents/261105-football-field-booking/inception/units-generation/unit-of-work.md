# Units of Work

## Sources

- Components VenueBooking and WebUi. [components]
- ADRs 001–005. [decisions]
- Requirements. [requirements]
- Units answers [Q1]–[Q5] and approved plan.

## Unit index

| Unit ID | Directory | Kind | Complexity |
| --- | --- | --- | --- |
| U1 | u1-venue-booking | service | M |
| U2 | u2-web-ui | ui | M |

## U1 — u1-venue-booking

- **Kind:** service
- **Boundaries:** The VenueBooking component only. Accounts, fields, prices, one-hour slots, pending/confirmed bookings, mark-paid, collision refusal. No browser screens.
- **Responsibilities:** FR1 (except screen chrome), FR2.1–FR2.4, FR3.1–FR3.2, FR4.1–FR4.4, FR4.6, NFR2.
- **Standalone check:** An owner can add a field, see a slot, hold a booking, and mark paid without U2. [Q5]
- **Deployment:** Shared or standalone is left for delivery planning. [Q4]
- **Notes:** Coarse — do not split accounts from fields. [Q2]

## U2 — u2-web-ui

- **Kind:** ui
- **Boundaries:** The WebUi component. Player and owner screens. Calls U1 for every domain read and write.
- **Responsibilities:** FR2.5, FR3.3, FR4.5, player booking form (FR4.1), owner tools on screen (FR2, FR4.2, FR4.6), NFR1.
- **Depends on:** U1 (agreed façade). [Q1] [Q3]
- **Deployment:** Left for delivery planning. [Q4]
- **Notes:** One UI for both personas. May be built against the façade while U1 is built. [Q3]

## Assumptions & Open Questions

- Assumption: “First unit in the graph” means U1 because U2 depends on it, not a value-first ship order. [Q5]
- Open question: None.
