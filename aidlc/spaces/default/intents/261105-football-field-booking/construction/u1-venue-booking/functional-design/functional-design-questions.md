# Functional Design Questions — u1-venue-booking

## Sources

- Unit U1 service: accounts, fields, slots, hold, collision, mark-paid, list bookings. [unit-of-work] [unit-of-work-story-map]
- Requirements FR1.1–FR1.3, FR2.1–FR2.5, FR3.1–FR3.3, FR4.1–FR4.4, FR4.6, NFR2. [requirements]
- Entities User, Field, Slot, Booking. [components]
- HTTP façade C1; 409 on collision; 10s timeout. [contract-summary]
- Open review on C1: register path missing; bodies not specified.

## Q1. [Architecture] How does a person register (FR1.1), given C1 only listed login?

A. Separate `POST /register` (201 created, 409 if that email already exists); `POST /session` is login only
B. Same `POST /session` with a named body flag (`intent: register` vs `intent: login`)
C. First owner is seeded by an operator; players still use `POST /register`
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q2. [Architecture] When an owner books on behalf of a player (FR4.2), how does U1 identify that player?

A. Email of an already-registered player; refuse if no such player
B. Email only; create a player account if none exists
C. Player id from a prior lookup; refuse if missing
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q3. [Architecture] What happens to existing pending and confirmed bookings when an owner deactivates a field (FR2.4)?

A. They stay as they are; only new holds are refused
B. Pending holds on that field are refused from then on and those bookings are marked cancelled (cancel is otherwise out of scope — only this deactivate path)
C. Deactivate is refused while any pending or confirmed booking exists on that field
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q4. [Architecture] How is the first owner/admin created?

A. Anyone may register as owner; the first version has no invite gate
B. The first owner is created out of band (seed); later owners are created only by an existing owner
C. Not yet defined
D. Not applicable
E. Players only; owners are always seeded
X. Other (please specify)

[Answer]: B

## Q5. [Architecture] What uniquely identifies a one-hour slot (FR3.1)?

A. Field plus start time (on the hour); no separate slot id in the contract
B. A slot id the service mints; the UI always sends that id when booking
C. Not yet defined
D. Not applicable
E. Date only (all fields share one hour grid)
X. Other (please specify)

[Answer]: B
