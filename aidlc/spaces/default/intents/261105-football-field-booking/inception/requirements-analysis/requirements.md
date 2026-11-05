# Requirements

## Sources

- Intent statement. [intent-statement]
- Scope document and intent backlog (first slice owner-only; first-version Musts; one venue). [scope-document]
- Requirements answers [Q1]–[Q8].
- Customer document `football-field-management-system.md` (untrusted data): used only where a question brought an idea in; tech stack, charts, cards, hosting, reschedule, peak pricing, and recurring schedules are not requirements.

## Intent analysis

Give one venue a reliable book: players can see free one-hour slots and request a booking; the owner runs fields and prices, sees every booking, and marks a booking paid before it is confirmed. Two people cannot hold the same slot. [intent-statement] [scope-document] [Q2] [Q3] [Q5]

## Functional requirements

### FR1 Accounts and roles

- **FR1.1** A person can register and log in as a **player** or as an **owner/admin**. [Q1]
- **FR1.2** Owner/admin actions (fields, prices, seeing every booking, marking paid) are available only to an owner/admin session. [Q1] [scope-document]
- **FR1.3** Creating a booking as a player requires a player login. [Q1] [Q4]

### FR2 Fields and prices (one venue)

- **FR2.1** An owner/admin can add a field at this single venue with a name and a single price. [Q6] [scope-document]
- **FR2.2** An owner/admin can edit those fields and their single price. [Q6]
- **FR2.3** An owner/admin can list the venue’s fields. [Q6]
- **FR2.4** An owner/admin can deactivate a field so it no longer offers new bookings. [Q6]
- **FR2.5** Anyone using the app can browse the list of fields and their free one-hour slots without logging in. [Q4]

### FR3 Slots and availability

- **FR3.1** A bookable slot is one hour, starting on the hour, on one field. [Q2]
- **FR3.2** A slot is free when no pending or confirmed booking already occupies that field and hour. [Q2] [Q3] [Q5]
- **FR3.3** The schedule of free and taken slots is visible to anyone browsing. [Q4] [scope-document]

### FR4 Booking

- **FR4.1** A logged-in player can save a booking for a free slot. The booking starts as **pending** and holds that slot. [Q1] [Q3] [Q5]
- **FR4.2** An owner/admin can save a booking on behalf of a player for a free slot (first slice). That booking also starts as pending and holds the slot. [scope-document]
- **FR4.3** If a second save targets the same field and hour, it is refused. The first pending or confirmed booking keeps the slot. [Q5]
- **FR4.4** A pending booking stays pending until the owner/admin marks it paid; then it is **confirmed**. [Q3]
- **FR4.5** The player who booked can see a confirmation they can keep once the booking is confirmed. [intent-statement]
- **FR4.6** An owner/admin can see every booking. [scope-document]

## Non-functional requirements

- **NFR1** The first version works for one venue in a phone-sized browser and a desktop browser. [Q8]
- **NFR2** Overlapping bookings on the same field and hour never both succeed. [Q5] [Q8]
- **NFR3** There is no 300ms API target and no WCAG 2.1 AA target for this first version. [Q8]

## Constraints

- One venue only; several fields. [scope-document]
- No real card charge; “paid” is an owner mark. [Q3]
- Workflow-selected plan: `classic`. [scope]

## Assumptions

- Pending bookings hold the slot the same way confirmed ones do; otherwise two pending saves could collide before anyone is marked paid. [Q3] [Q5]
- “Anyone using the app” means anyone who can open it, not a public internet host. Public hosting stays out. [Q4] [scope-document]
- Q7 (cancel out) overrides the earlier Should Have for cancel. [Q7]

## Out of scope

| Item | Source |
| --- | --- |
| Public hosting | [scope-document] |
| Real card payments | [scope-document] [Q3] |
| Admin charts | [scope-document] |
| Rescheduling | [scope-document] |
| Peak-hour pricing | [scope-document] |
| Recurring schedules | [scope-document] |
| Search and filter | [Q7] |
| Player booking history | [Q7] |
| Cancel a booking | [Q7] |
| Several venues | [scope-document] |
| 300ms / WCAG 2.1 AA / OWASP programme as stated in the source document | [Q8] |

## Open questions

None.

## Assumptions & Open Questions

None.
