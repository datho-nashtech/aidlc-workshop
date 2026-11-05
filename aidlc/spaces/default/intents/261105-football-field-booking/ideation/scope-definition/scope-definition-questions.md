# Scope Definition Questions

## Sources

- [desc] Initial description: "Build simple football field management base on this requirements document football-field-management-system.md"
- [scope] Workflow-selected scope: `classic`.
- Intent statement: players find a free slot and finish a booking with a confirmation; two people cannot take the same slot; the owner adds fields, sets prices, and sees every booking. First version leaves out public hosting, real card payments, admin charts, rescheduling, peak-hour pricing, and recurring schedules. [intent-statement]

## Q1. [Product] What is the smallest first version that still delivers value?

The intent already names a working booking loop and an owner who can run fields, prices, and the book. This picks the smallest slice that still counts as that product.

A. One field, a visible schedule, and a player booking a free slot with a confirmation — owner tools can wait
B. The full first-version loop: player books without double-booking, keeps a confirmation; owner adds fields, sets prices, and sees every booking
C. Owner-only first: fields, prices, and the book; players are booked by the owner
D. Not yet defined
E. A browse-only catalogue of fields with no booking yet
X. Other (please specify)

[Answer]: C

## Q2. [Product] Which capabilities are must-have vs later?

Intent Capture already put hosting, card payments, charts, rescheduling, peak-hour pricing, and recurring schedules out of this first version. This question ranks what stays in.

A. Must: see availability, book a slot, block double-booking, confirmation, add fields, set prices, see bookings. Should: cancel a booking. Won't: everything already left out
B. Must: only see availability and book a slot with no double-booking. Should: confirmation, owner field/price/booking views. Won't: everything already left out
C. Must: everything in A plus cancel and a simple occupancy list. Won't: everything already left out
D. Not yet defined
E. Treat every remaining idea as Must Have
X. Other (please specify)

[Answer]: A

## Q3. [Product] How do those capabilities depend on each other?

This is about order of value, not how the software is built.

A. Fields and prices first, then a schedule, then a booking that cannot collide, then a confirmation the player keeps
B. A bookable slot first (even on one default field), then extra fields and price changes
C. Owner booking list first, then player-facing booking
D. Not yet defined
E. No order — they can land independently
X. Other (please specify)

[Answer]: A

## Q4. [Product] How should we sequence the first version?

A. Value-first: the player booking loop as soon as it is real, then owner tools
B. Dependency-first: fields and prices before any booking
C. Risk-first: double-booking protection before extra owner features
D. Not yet defined
E. No preference
X. Other (please specify)

[Answer]: B

## Q5. [Product] Is there a hard date tied to a capability?

A. No hard date — ship when the first-version loop works
B. Yes — a named date for the first bookable field
C. Yes — a named date for owner tools even if players are not live
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q6. [Product] How many venues and fields should this first version cover?

A. One venue, several fields the owner can add
B. One venue, one field only
C. Several venues, each with their own fields
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A
