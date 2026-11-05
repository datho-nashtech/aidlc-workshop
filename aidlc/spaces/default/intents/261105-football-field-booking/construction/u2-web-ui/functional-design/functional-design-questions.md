# Functional Design Questions — u2-web-ui

## Sources

- Unit U2 UI: browse, player book, owner screens, confirmation the player can keep. [unit-of-work] [unit-of-work-story-map]
- NFR1 phone and desktop. [requirements]
- C1 HTTP façade; 409; 10s timeout. [contract-summary]
- U1 already implements register, session, slots?date, GET booking.

## Q1. [Product] How does the player keep a confirmation (FR4.5)?

A. After mark-paid, the player (or a page they can reopen) shows the booking’s confirmationRef from `GET /bookings/{id}`
B. A printable page only; no in-app confirmation screen
C. Email only (out of first version otherwise)
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q2. [Design] How does one app cover phone-sized and desktop browsers (NFR1)?

A. One responsive layout that stacks on a narrow viewport
B. Separate phone and desktop page trees
C. Desktop only; phone is “usable enough” without a layout pass
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q3. [Architecture] What does the UI do on a 409 collision?

A. Show that the slot was taken and refresh the slot list; do not POST again
B. Silently retry once
C. A generic “something went wrong”
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q4. [Product] How do player and owner screens share one app?

A. Same shell; owner tools appear only after an owner session
B. Separate URL prefixes `/player` and `/owner` with no shared shell
C. Not yet defined
D. Not applicable
E. Owner-only first; player screens later
X. Other (please specify)

[Answer]: A
