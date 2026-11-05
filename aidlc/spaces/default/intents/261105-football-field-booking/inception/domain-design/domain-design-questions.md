# Domain Design Questions

## Sources

- Requirements FR1–FR4, NFR1–NFR3. [requirements]
- Approved first version: one venue, player and owner logins, one-hour slots, pending until marked paid, no double booking.

## Q1. [Architecture] How should we split the building blocks?

This is about code you write, not servers. Deployment shape comes later.

A. Four blocks: Identity (accounts/roles), Catalogue (fields and prices), Booking (slots, holds, paid/confirm), Web UI (browse and forms)
B. Three blocks: Identity, Booking-and-catalogue together, Web UI
C. Two blocks: one backend for everything, plus Web UI
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q2. [Architecture] Who owns a time slot?

A slot must have one owner so two blocks do not both decide if it is free.

A. Booking owns slots; Catalogue only knows fields and prices
B. Catalogue owns slots as part of a field; Booking only creates bookings that point at a slot
C. Booking owns both slots and fields
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q3. [Architecture] How do the blocks talk?

A. Web UI calls Identity, Catalogue, and Booking over request/response; Booking calls Catalogue to check a field exists and its price
B. Web UI calls one backend façade that hides the other blocks
C. Booking emits events; Catalogue and Identity never call Booking
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: B

## Q4. [Architecture] Where does “mark paid / confirm” live?

A. Inside Booking only; Identity only says who is an owner
B. Inside Identity as an owner action that writes into Booking
C. A separate Payments block even without card charges
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q5. [Architecture] Is the Web UI one block or two (player vs owner)?

A. One Web UI block with player and owner screens
B. Two UI blocks: Player UI and Owner UI
C. No UI block — screens are not a building block in this design
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A
