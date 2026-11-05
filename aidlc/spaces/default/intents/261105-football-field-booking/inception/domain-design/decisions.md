# Architecture Decisions

## Sources

- Domain design answers [Q1]–[Q5].
- Requirements. [requirements]

## ADR-001: Two building blocks (backend + Web UI)

- **Context** — The first version is one venue with accounts, fields, slots, and bookings. Splitting Identity, Catalogue, and Booking would add boundaries before there is a second team or a second deployable.
- **Decision** — One backend component (`VenueBooking`) plus one Web UI. [Q1]
- **Consequences** — Domain rules stay in one place, which makes collision checks easier. Later splits (Identity vs Booking) remain possible. The backend will grow if those concerns diverge.
- **Alternatives Rejected** — Four blocks (Q1 A) and three blocks (Q1 B): extra sync cost for a single-venue first version.

## ADR-002: Fields and slots owned together

- **Context** — A slot is free only relative to a field. Two owners for “is this hour free?” would fight.
- **Decision** — Fields and slots are owned in the same backend as bookings. [Q2]
- **Consequences** — Collision rules can run in one transaction. Catalogue cannot evolve independently without a later split.
- **Alternatives Rejected** — Slots in Booking and fields in Catalogue (Q2 A); slots as part of Catalogue with bookings only pointing at them (Q2 B). Both need two components, which Q1 declined.

## ADR-003: UI talks to one façade

- **Context** — Screens must browse, book, and run owner tools without knowing internal modules.
- **Decision** — WebUi calls VenueBooking over request/response as the only domain façade. [Q3]
- **Consequences** — UI stays simple. Internal modules inside VenueBooking are not yet public contracts.
- **Alternatives Rejected** — UI calling Identity, Catalogue, and Booking separately (Q3 A); event-only Booking (Q3 C).

## ADR-004: Mark-paid lives with bookings

- **Context** — Real card payments are out. “Paid” is an owner mark that confirms a pending hold.
- **Decision** — Mark-paid is a VenueBooking booking behaviour. Accounts only say who is an owner. [Q4]
- **Consequences** — No Payments component. A later card processor would sit behind this same mark, not as a new first-version block.
- **Alternatives Rejected** — Identity writes the mark (Q4 B); a separate Payments block (Q4 C).

## ADR-005: One Web UI for player and owner

- **Context** — Both personas use the first version; owner tools and player booking share the same fields and slots.
- **Decision** — One WebUi component with player and owner screens. [Q5]
- **Consequences** — Shared browse calendar. Owner-only routes still need an owner session. Two apps would duplicate the calendar.
- **Alternatives Rejected** — Player UI and Owner UI as two components (Q5 B); no UI component (Q5 C).

## Assumptions & Open Questions

None.
