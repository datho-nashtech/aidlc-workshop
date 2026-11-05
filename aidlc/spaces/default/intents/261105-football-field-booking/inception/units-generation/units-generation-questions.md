# Units Generation Questions

## Sources

- Components: VenueBooking and WebUi. [components]
- ADRs 001–005: one backend façade plus one UI. [decisions]
- Requirements FR1–FR4. [requirements]

This step only decides what depends on what. It does not decide what to build first for value.

## Q1. [Architecture] How should we cut units of work?

A. Two units matching the components: `u1-venue-booking` (service) and `u2-web-ui` (ui), with the UI depending on the booking service
B. One unit that contains both backend and UI
C. Three units: accounts, booking-and-fields, and UI
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q2. [Architecture] How fine should those units be?

A. Coarse — keep the two (or one) units; do not split fields vs slots vs accounts
B. Fine — split VenueBooking into accounts vs fields-and-bookings as extra units
C. Not yet defined
D. Not applicable
E. Leave it to later planning
X. Other (please specify)

[Answer]: A

## Q3. [Architecture] If there are two units, may they be developed in parallel once the contract exists?

A. Yes — UI can proceed against a agreed façade while the service is built
B. No — UI may start only after the service exists
C. Not applicable — there is only one unit
D. Not yet defined
E. No preference
X. Other (please specify)

[Answer]: A

## Q4. [Architecture] How are units deployed?

A. One deployable that packages service and UI together
B. Two deployables: service and UI, still with the UI depending on the service
C. Not yet defined
D. Not applicable
E. Decide at delivery planning
X. Other (please specify)

[Answer]: E

## Q5. [Architecture] What must the first unit in the dependency graph be able to do on its own?

A. A working owner path: add a field, see a slot, hold a booking, mark paid — even if the player UI comes later
B. A working player browse-and-book path including the UI
C. A design-only slice is enough
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A
