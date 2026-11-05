# Business Rules — u2-web-ui

## Sources

- UI unit. [unit-of-work]
- Answers [Q1]–[Q4].
- C1 timeout and 409. [contract-summary]

```yaml
rules:
  - id: BR5.1
    statement: After a booking is confirmed, the player can reopen a screen that shows confirmationRef from GET /bookings/{id}.
    category: policy
    applies_to: Confirmation screen
    trigger: Player opens confirmation
    logic: IF the booking is confirmed THEN show confirmationRef ELSE show pending.
    violation: 404 hides the record.
    source: FR4.5
  - id: BR5.2
    statement: The first version is laid out for desktop; a phone-sized browser must still work without a separate layout pass.
    category: policy
    applies_to: Shell
    trigger: Render
    logic: IF the viewport is narrow THEN the same desktop screens remain usable (scroll) with no second page tree.
    violation: None for this version.
    source: NFR1
  - id: BR5.3
    statement: On 409 the UI names the taken slot and refreshes the list; it does not POST again.
    category: policy
    applies_to: Booking form
    trigger: Create booking response 409
    logic: IF status is 409 THEN show taken and reload slots ELSE do not retry the write.
    violation: Silent retry is forbidden.
    source: FR4.1
  - id: BR5.4
    statement: Owner tools appear only after an owner session, in the same shell as player screens.
    category: authorization
    applies_to: Navigation
    trigger: Session change
    logic: IF role is owner THEN show owner tools ELSE hide them.
    violation: Player session never shows mark-paid or field admin.
    source: FR4.6
  - id: BR5.5
    statement: Anyone can browse fields and slots without logging in.
    category: policy
    applies_to: Browse
    trigger: Open app
    logic: IF no session THEN still call GET /fields and GET slots.
    violation: None.
    source: FR2.5
  - id: BR5.6
    statement: A player booking form requires a player session and posts one slot id.
    category: authorization
    applies_to: Booking form
    trigger: Submit book
    logic: IF player session THEN POST /bookings with slotId ELSE send to login.
    violation: 401 sends to login.
    source: FR4.1
  - id: BR5.7
    statement: Owner-on-behalf collects an existing player email and posts it with the slot id.
    category: validation
    applies_to: Owner book form
    trigger: Submit
    logic: IF owner session THEN POST /bookings with slotId and playerEmail.
    violation: Show 404 when the player is unknown.
    source: FR4.2
  - id: BR5.8
    statement: A write that does not return in 10 seconds fails on screen and is not retried in the background.
    category: policy
    applies_to: All writes
    trigger: Timeout
    logic: IF no response in 10s THEN show failure.
    violation: No silent retry.
    source: FR4.1
```

## Rules summary

| ID | Statement |
| --- | --- |
| BR5.1 | Keepable confirmationRef on screen |
| BR5.2 | Desktop layout; phone scrolls the same screens |
| BR5.3 | 409 shows taken; no retry POST |
| BR5.4 | Owner tools after owner session |
| BR5.5 | Browse without login |
| BR5.6 | Player books with session |
| BR5.7 | Owner books with player email |
| BR5.8 | 10s timeout, no silent write retry |
