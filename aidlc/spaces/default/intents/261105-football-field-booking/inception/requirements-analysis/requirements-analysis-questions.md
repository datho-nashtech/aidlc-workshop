# Requirements Analysis Questions

## Sources

- [desc] Initial description: "Build simple football field management base on this requirements document football-field-management-system.md"
- Intent statement and scope document (approved first-version Musts, owner-only first slice, one venue). [intent-statement] [scope-document]
- Customer document `football-field-management-system.md` (untrusted data): browsing, booking, admin fields/prices/bookings, JWT, payments, charts, reschedule, peak pricing, recurring schedules. Those last items stay out unless a question below brings one back.

## Q1. [Product] How do people sign in for this first version?

The source document describes register, login, and two roles (customer and admin). Scope did not decide accounts.

A. Two roles: player and owner/admin, each with a login
B. Owner/admin login only; players book without an account (name and contact on the booking)
C. No accounts — a single shared owner session is enough for the first slice
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q2. [Product] What is a bookable slot?

Needed so “free vs taken” and “no double booking” are testable.

A. One-hour slots on each field, starting on the hour
B. Owner-defined slot length per field (still no overlapping bookings on that field)
C. Free start and end times, as long as they do not overlap an existing booking on that field
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q3. [Product] What happens at “payment” when real card payments are out of scope?

The source document has a pay-later payment status. Intent left real card payments out.

A. No payment at all — a booking is confirmed when it is saved
B. A simple unpaid / paid mark the owner can set by hand (no card charge)
C. Booking stays pending until the owner marks it paid
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q4. [Product] Who can see the list of fields and free slots?

A. Anyone using the app can browse fields and free slots; login is only required to book (if accounts exist)
B. Only a logged-in player or owner can see fields and slots
C. Only the owner can see the schedule; players never browse
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q5. [Product] When two people try to take the same slot, what must be true?

A. The second save is refused; the first confirmed booking keeps the slot
B. The owner must approve every booking before it is held
C. Last save wins
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q6. [Product] Which owner field tools are in this first version?

The source document includes add, edit, deactivate, block-out dates, and recurring schedules. Recurring schedules are already out.

A. Add and list fields, set a single price per field — no edit, no deactivate
B. Add, edit, list, and deactivate fields, with a single price per field
C. Add, edit, list, deactivate, and block individual dates or slots (still no recurring schedule)
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: B

## Q7. [Product] Which extras from the source document stay out of this first version?

Search/filter, booking history, cancel, reschedule, peak pricing, charts, and public hosting appear in the source document. Scope already left hosting, cards, charts, reschedule, peak pricing, and recurring schedules out. Cancel is Should Have.

A. Keep search/filter and player booking history out; cancel stays Should Have
B. Include search/filter and player booking history as Must; cancel stays Should Have
C. Include none of those; even cancel stays out
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: C

## Q8. [Product] What quality bar is in for this first version?

The source document names API time under 300ms, JWT, OWASP, mobile layout, and WCAG 2.1 AA. This is a simple first version with no public hosting.

A. Works correctly for one venue on a phone-sized and desktop browser; booking collisions never succeed; no 300ms or WCAG target
B. A plus: login secrets are not stored in plain text if accounts exist
C. Keep the source document’s 300ms, JWT, OWASP, and WCAG 2.1 AA targets
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A
