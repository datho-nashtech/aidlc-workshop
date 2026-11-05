# Component Catalogue

## Sources

- Requirements FR1–FR4, NFR1–NFR3. [requirements]
- Domain design answers [Q1]–[Q5].

```yaml
components:
  - name: VenueBooking
    summary: Single backend for accounts, fields, slots, bookings, and mark-paid
    behaviour: >
      Owns every domain change for one venue. Registers and authenticates
      player and owner/admin. Stores fields with a single price, one-hour
      slots, and bookings. A new booking starts pending and holds the slot;
      a second save for the same field and hour is refused. An owner marks
      paid; then the booking is confirmed. Deactivating a field stops new
      bookings. Does not take card charges.
    responsibilities:
      - Player and owner/admin accounts and sessions
      - Fields, prices, activate/deactivate
      - One-hour slots and collision-free holds
      - Pending and confirmed bookings, including owner-on-behalf
      - Owner mark-paid
    depends_on: []
    dependents:
      - component: WebUi
        interaction: screens send all reads and writes through this façade
    external_dependencies:
      - name: Application data store
        kind: database
        purpose: Persist users, fields, slots, and bookings
    entities:
      - name: User
        identifier: id
        attributes: [email, passwordSecret, fullName, role]
      - name: Field
        identifier: id
        attributes: [name, price, status]
      - name: Slot
        identifier: id
        attributes: [fieldId, startAt, status]
      - name: Booking
        identifier: id
        attributes: [userId, fieldId, slotId, status, paymentStatus, confirmationRef]
  - name: WebUi
    summary: One browser app for browse, book, and owner tools
    behaviour: >
      Anyone can browse fields and free slots. Logged-in players book.
      Owners add, edit, list, and deactivate fields, see every booking,
      book on behalf of a player, and mark paid. Phone-sized and desktop
      layouts. No separate owner app.
    responsibilities:
      - Player and owner screens
      - Call VenueBooking for every domain action
    depends_on:
      - component: VenueBooking
        interaction: all domain reads and writes
        style: sync
    dependents: []
    external_dependencies: []
    entities: []
```

## Component Diagram

```mermaid
graph LR
  WebUi --> VenueBooking
```

Text fallback: WebUi calls VenueBooking. VenueBooking calls no other building block.

## Component Summary

| Component | Purpose | Depends On | Dependents | Entities Owned |
| --- | --- | --- | --- | --- |
| VenueBooking | Accounts, fields, slots, bookings, mark-paid | — | WebUi | User, Field, Slot, Booking |
| WebUi | Player and owner screens | VenueBooking | — | — |

## Entity Ownership

| Entity | Owning Component | Identifier | Attributes | References |
| --- | --- | --- | --- | --- |
| User | VenueBooking | id | email, passwordSecret, fullName, role | — |
| Field | VenueBooking | id | name, price, status | — |
| Slot | VenueBooking | id | fieldId, startAt, status | — |
| Booking | VenueBooking | id | userId, fieldId, slotId, status, paymentStatus, confirmationRef | — |

## External Dependencies

| Component | Dependency | Kind | Purpose |
| --- | --- | --- | --- |
| VenueBooking | Application data store | database | Persist users, fields, slots, and bookings |

## Rationale

| Component | Why it is separate |
| --- | --- |
| VenueBooking | Q1 chose one backend for everything. Fields and slots live together (Q2), mark-paid lives with bookings (Q4), and the UI talks to this one façade (Q3). Distinct data ownership from screens. |
| WebUi | Q5 chose one UI for player and owner screens. Different change rate from domain rules; no domain entities. |

**Alternatives Rejected:** Four blocks (Identity, Catalogue, Booking, Web UI) and three blocks (Identity, combined booking-and-catalogue, Web UI) were offered in Q1 and not chosen. Two UI blocks were offered in Q5 and not chosen. A separate Payments block was offered in Q4 and not chosen.

## Assumptions & Open Questions

- Assumption: Q2 “Booking owns slots and fields” is a responsibility inside VenueBooking, not a third component, because Q1 merged the backend. [Q1] [Q2]
- Assumption: Accepted requirements findings (owner-on-behalf identity, deactivate vs existing bookings, confirmation medium, open owner registration) are not resolved here; they stay as open product corners on those FR lines. [requirements]
- Open question: None.
