# Contract Summary

## Sources

- Units U1 `u1-venue-booking` and U2 `u2-web-ui`. [unit-of-work] [unit-of-work-dependency]
- Components VenueBooking and WebUi. [components]
- Requirements FR1–FR4, NFR2. [requirements]
- Answers [Q1]–[Q4].

## Contracts

| # | Provider Unit | Consumer | Mechanism | Owner |
| --- | --- | --- | --- | --- |
| C1 | u1-venue-booking | u2-web-ui | sync HTTP | u1-venue-booking |

No public or partner API in this first version. [Q1] [requirements]

## C1 — Web UI to Venue Booking

Provider owns the spec. Consumer calls over request/response. [Q1]

Timeout: 10 seconds. Writes are not retried silently. [Q3]

A colliding booking returns a conflict the UI must show; it must not retry that save as a new booking. [Q2]

Additive fields are safe; a breaking change uses a new path. Consumers ignore unknown fields. [Q4]

```yaml
openapi: 3.0.3
info:
  title: Venue Booking façade
  version: "1"
paths:
  /session:
    post:
      summary: Log in as player or owner
      responses:
        "200":
          description: Session established
        "401":
          description: Bad credentials
  /fields:
    get:
      summary: List fields and prices
      responses:
        "200":
          description: Field list
    post:
      summary: Owner adds a field
      responses:
        "201":
          description: Field created
        "403":
          description: Not owner
  /fields/{fieldId}:
    put:
      summary: Owner edits a field
      responses:
        "200":
          description: Updated
        "403":
          description: Not owner
        "404":
          description: Unknown field
    delete:
      summary: Owner deactivates a field
      responses:
        "200":
          description: Deactivated
        "403":
          description: Not owner
  /fields/{fieldId}/slots:
    get:
      summary: Free and taken one-hour slots
      responses:
        "200":
          description: Slot list
  /bookings:
    get:
      summary: Owner sees every booking; player sees none of history beyond this call if they are not owner
      responses:
        "200":
          description: Booking list the caller may see
        "401":
          description: Login required
    post:
      summary: Create a pending booking that holds the slot
      responses:
        "201":
          description: Pending booking
        "401":
          description: Login required
        "409":
          description: Slot already held; do not retry as a new booking
  /bookings/{bookingId}/paid:
    post:
      summary: Owner marks paid; booking becomes confirmed
      responses:
        "200":
          description: Confirmed
        "403":
          description: Not owner
        "404":
          description: Unknown booking
  /bookings/{bookingId}:
    get:
      summary: Confirmation a player can keep after confirm
      responses:
        "200":
          description: Booking record
        "404":
          description: Unknown booking
```

## Ownership rules

- `u1-venue-booking` owns C1.
- Additive fields do not require a new path; unknown fields are ignored. [Q4]
- A breaking change (removed or renamed field, changed meaning, changed status codes) needs a new path. [Q4]
- Collision is `409`. The UI does not turn that into another POST. [Q2]
- No response in 10 seconds fails the screen action. Writes are not retried in the background. [Q3]

## Open questions

| Contract | Question | Blocks |
| --- | --- | --- |
| — | None | — |

## Assumptions & Open Questions

- Assumption: Login uses a session cookie or token on `/session`; exact header name is left to functional design. [Q1]
- Open question: None.
