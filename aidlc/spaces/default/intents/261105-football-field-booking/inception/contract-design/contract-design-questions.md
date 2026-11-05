# Contract Design Questions

## Sources

- Units: `u1-venue-booking` (service) and `u2-web-ui` (ui); UI depends on the service. [unit-of-work] [unit-of-work-dependency]
- Sync façade from domain design. [components]
- Public hosting is out of the first version. [requirements]

## Q1. [Architecture] What is the only in-system boundary for this first version?

A. One contract: Web UI calls Venue Booking over request/response; Venue Booking owns the spec
B. Two contracts: a public internet API plus the UI-to-service call
C. Shared database schema instead of an API
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q2. [Architecture] What happens when the service refuses a double booking?

A. The UI gets a clear conflict error and does not retry as a new booking
B. The UI retries automatically until it succeeds
C. The UI shows a generic failure with no conflict distinction
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q3. [Architecture] How long does the UI wait for the service?

A. Fail the screen action if there is no response in 10 seconds; do not silently retry writes
B. No timeout
C. Retry writes up to three times
D. Not yet defined
E. Not applicable
X. Other (please specify)

[Answer]: A

## Q4. [Architecture] How do we version this contract if it must change?

A. Additive fields only in this first version; a breaking change needs a new path
B. The UI and service always ship together, so the contract may break freely
C. Not yet defined
D. Not applicable
E. No versioning rule
X. Other (please specify)

[Answer]: A
