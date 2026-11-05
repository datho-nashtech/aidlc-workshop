# Unit Dependency DAG

## Sources

- Approved units plan. [Q1] [Q3]
- Components. [components]

## Topology

U2 depends on U1. U1 depends on nothing.

```yaml
units:
  - name: u1-venue-booking
    kind: service
    depends_on: []
  - name: u2-web-ui
    kind: ui
    depends_on:
      - u1-venue-booking
```

## Integration

- U2 calls U1 over request/response for fields, slots, bookings, sessions, and mark-paid.
- Shared data lives in U1. U2 does not own User, Field, Slot, or Booking.

## Parallel development

- Once the U1 façade is agreed, U2 can be developed without waiting for U1 to finish. [Q3]
- That is a possible overlapping schedule, not a chosen ship order.

## Assumptions & Open Questions

None.
