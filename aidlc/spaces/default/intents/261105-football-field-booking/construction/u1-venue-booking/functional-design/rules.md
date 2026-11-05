# Business Rules — u1-venue-booking

## Sources

- Requirements FR1–FR4, NFR2. [requirements]
- Unit U1. [unit-of-work]
- Answers [Q1]–[Q5].

```yaml
rules:
  - id: BR1.1
    statement: A person registers as a player through POST /register; login is POST /session only.
    category: policy
    applies_to: User
    trigger: Register request
    logic: IF the email is new THEN create a player User and return created ELSE refuse as conflict.
    violation: 409 when the email already exists.
    source: FR1.1
  - id: BR1.2
    statement: Login with email and password establishes a session for that User.
    category: authorization
    applies_to: User
    trigger: Login request
    logic: IF credentials match THEN return a session ELSE refuse as unauthorized.
    violation: 401.
    source: FR1.1
  - id: BR1.3
    statement: The first owner is seeded out of band; later owners are created only by an existing owner.
    category: policy
    applies_to: User
    trigger: Register or owner-create
    logic: IF the request is public register THEN role is player. IF an owner creates another owner THEN role is owner.
    violation: Public register cannot create owner.
    source: FR1.1
  - id: BR1.4
    statement: Field, price, list-all-bookings, mark-paid, deactivate, edit, and owner-on-behalf require an owner session.
    category: authorization
    applies_to: Field, Booking
    trigger: Owner mutation or owner list
    logic: IF the session role is owner THEN allow ELSE refuse.
    violation: 403.
    source: FR1.2
  - id: BR1.5
    statement: A player booking requires a player session.
    category: authorization
    applies_to: Booking
    trigger: Player create-booking
    logic: IF the session role is player THEN the booking userId is that player ELSE refuse.
    violation: 401 without login; 403 if owner uses the player path.
    source: FR1.3
  - id: BR2.1
    statement: An owner adds a field with a name and a single price greater than zero.
    category: validation
    applies_to: Field
    trigger: Create field
    logic: IF name is unique and price > 0 THEN create active Field ELSE refuse.
    violation: 409 on duplicate name; validation error on price.
    source: FR2.1
  - id: BR2.2
    statement: An owner may edit a field name and its single price.
    category: validation
    applies_to: Field
    trigger: Edit field
    logic: IF the field exists and the new name is unique THEN update ELSE refuse.
    violation: 404 unknown; 409 duplicate name.
    source: FR2.2
  - id: BR2.3
    statement: Anyone may list fields and prices; owners also see inactive fields.
    category: policy
    applies_to: Field
    trigger: List fields
    logic: IF no session or player session THEN return active fields. IF owner session THEN return all fields.
    violation: None.
    source: FR2.3
  - id: BR2.4
    statement: Deactivate is refused while any pending or confirmed booking exists on that field.
    category: constraint
    applies_to: Field
    trigger: Deactivate field
    logic: IF bookings in pending or confirmed exist for the field THEN refuse ELSE set status inactive.
    violation: 409 while bookings remain.
    source: FR2.4
  - id: BR2.5
    statement: An inactive field offers no new bookings.
    category: constraint
    applies_to: Field, Booking
    trigger: Create booking
    logic: IF field status is inactive THEN refuse the hold.
    violation: 409.
    source: FR2.4
  - id: BR2.6
    statement: Anyone using the app may list fields and free one-hour slots without logging in.
    category: policy
    applies_to: Field, Slot
    trigger: Browse fields or slots
    logic: IF the caller asks for the field list or slot list THEN return them without a session.
    violation: None.
    source: FR2.5
  - id: BR3.1
    statement: A bookable slot is one hour starting on the hour on one field.
    category: constraint
    applies_to: Slot
    trigger: Slot mint or list
    logic: IF startAt is on the hour THEN it is a valid slot start ELSE refuse.
    violation: Validation error.
    source: FR3.1
  - id: BR3.2
    statement: The service mints a slot id; booking always names that id.
    category: policy
    applies_to: Slot, Booking
    trigger: List slots or create booking
    logic: IF a slot is listed THEN it has an id. IF a booking is saved THEN it sends that slot id.
    violation: 404 unknown slot.
    source: FR3.1
  - id: BR3.3
    statement: A slot is free when no pending or confirmed booking occupies that field and hour.
    category: constraint
    applies_to: Slot
    trigger: Availability
    logic: IF a pending or confirmed Booking has this slotId THEN status is held ELSE free.
    violation: None on read.
    source: FR3.2
  - id: BR3.4
    statement: Free and taken slots are visible to anyone browsing.
    category: policy
    applies_to: Slot
    trigger: List slots
    logic: IF the caller lists slots for a field THEN return free and held without login.
    violation: None.
    source: FR3.3
  - id: BR4.1
    statement: A logged-in player saves a booking for a free slot; it starts pending and holds the slot.
    category: policy
    applies_to: Booking
    trigger: Player create-booking
    logic: IF the slot is free and the field is active THEN create pending unpaid Booking and set slot held.
    violation: 409 if not free.
    source: FR4.1
  - id: BR4.2
    statement: An owner books on behalf of a player by that player’s already-registered email.
    category: validation
    applies_to: Booking
    trigger: Owner create-booking
    logic: IF a User with that email and role player exists THEN userId is that player ELSE refuse.
    violation: 404 if no such player.
    source: FR4.2
  - id: BR4.3
    statement: A second save for the same field and hour is refused; the first pending or confirmed booking keeps the slot.
    category: constraint
    applies_to: Booking
    trigger: Create booking
    logic: IF the slot is already held THEN refuse and do not create a second booking.
    violation: 409; caller must not retry as a new booking.
    source: FR4.3
  - id: BR4.4
    statement: Overlapping bookings on the same field and hour never both succeed.
    category: constraint
    applies_to: Booking, Slot
    trigger: Concurrent create-booking
    logic: IF two saves target the same slot THEN exactly one succeeds.
    violation: The other receives 409.
    source: NFR2
  - id: BR4.5
    statement: A pending booking stays pending until an owner marks it paid; then it is confirmed and gets a confirmationRef.
    category: policy
    applies_to: Booking
    trigger: Mark paid
    logic: IF the booking is pending THEN set paymentStatus paid, status confirmed, and assign confirmationRef ELSE refuse.
    violation: 404 unknown; 409 if already confirmed.
    source: FR4.4
  - id: BR4.6
    statement: An owner can list every booking.
    category: authorization
    applies_to: Booking
    trigger: List bookings
    logic: IF session role is owner THEN return all bookings ELSE refuse.
    violation: 401 or 403.
    source: FR4.6
```

## Rules summary

| ID | Category | Statement |
| --- | --- | --- |
| BR1.1 | policy | Register via POST /register; login via POST /session |
| BR1.2 | authorization | Login establishes a session |
| BR1.3 | policy | First owner seeded; later owners only by an owner |
| BR1.4 | authorization | Owner actions need an owner session |
| BR1.5 | authorization | Player booking needs a player session |
| BR2.1 | validation | Owner adds named field with one price |
| BR2.2 | validation | Owner edits name and price |
| BR2.3 | policy | List fields; owners see inactive |
| BR2.4 | constraint | Deactivate refused while bookings exist |
| BR2.5 | constraint | Inactive field takes no new holds |
| BR2.6 | policy | Browse fields and slots without login |
| BR3.1 | constraint | One-hour slots on the hour |
| BR3.2 | policy | Service mints slot id |
| BR3.3 | constraint | Pending or confirmed holds the slot |
| BR3.4 | policy | Slot list is public in-app |
| BR4.1 | policy | Player hold starts pending |
| BR4.2 | validation | Owner-on-behalf uses existing player email |
| BR4.3 | constraint | Collision is 409 |
| BR4.4 | constraint | Concurrent overlap never double-succeeds |
| BR4.5 | policy | Mark-paid confirms and sets confirmationRef |
| BR4.6 | authorization | Owner lists every booking |
