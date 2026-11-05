# Entities — u1-venue-booking

## Sources

- VenueBooking entities. [components]
- Requirements FR1–FR4. [requirements]
- Answers [Q1]–[Q5].

```yaml
entities:
  - name: User
    description: A registered player or owner/admin at this venue.
    attributes:
      - name: id
        logical_type: identifier
        required: true
        unique: true
      - name: email
        logical_type: email
        required: true
        unique: true
      - name: passwordSecret
        logical_type: secret
        required: true
        unique: false
      - name: fullName
        logical_type: text
        required: true
        unique: false
      - name: role
        logical_type: enumeration
        required: true
        unique: false
        allowed_values: [player, owner]
    constraints:
      - Email uniquely identifies a person.
      - The first owner is seeded; later owners are created only by an existing owner. [Q4]
    relationships:
      - to: Booking
        cardinality: one-to-many
        direction: User to Booking
        via: userId
  - name: Field
    description: One pitch at the single venue, with one price.
    attributes:
      - name: id
        logical_type: identifier
        required: true
        unique: true
      - name: name
        logical_type: text
        required: true
        unique: true
      - name: price
        logical_type: money
        required: true
        unique: false
        constraints: [greater than zero]
      - name: status
        logical_type: enumeration
        required: true
        unique: false
        allowed_values: [active, inactive]
        default: active
    constraints:
      - Inactive fields offer no new bookings.
      - Deactivate is refused while any pending or confirmed booking exists on the field. [Q3]
    relationships:
      - to: Slot
        cardinality: one-to-many
        direction: Field to Slot
        via: fieldId
      - to: Booking
        cardinality: one-to-many
        direction: Field to Booking
        via: fieldId
  - name: Slot
    description: One bookable hour on one field. The service mints the slot id. [Q5]
    attributes:
      - name: id
        logical_type: identifier
        required: true
        unique: true
      - name: fieldId
        logical_type: identifier
        required: true
        unique: false
        references: Field.id
      - name: startAt
        logical_type: datetime
        required: true
        unique: false
        constraints: [starts on the hour, duration one hour]
      - name: status
        logical_type: enumeration
        required: true
        unique: false
        allowed_values: [free, held]
    constraints:
      - Unique pair (fieldId, startAt).
      - Held when a pending or confirmed booking occupies it.
    relationships:
      - to: Field
        cardinality: many-to-one
        direction: Slot to Field
        via: fieldId
      - to: Booking
        cardinality: one-to-one
        direction: Slot to Booking
        via: slotId
  - name: Booking
    description: A hold on one slot for one player, pending until marked paid.
    attributes:
      - name: id
        logical_type: identifier
        required: true
        unique: true
      - name: userId
        logical_type: identifier
        required: true
        unique: false
        references: User.id
      - name: fieldId
        logical_type: identifier
        required: true
        unique: false
        references: Field.id
      - name: slotId
        logical_type: identifier
        required: true
        unique: true
        references: Slot.id
      - name: status
        logical_type: enumeration
        required: true
        unique: false
        allowed_values: [pending, confirmed]
        default: pending
      - name: paymentStatus
        logical_type: enumeration
        required: true
        unique: false
        allowed_values: [unpaid, paid]
        default: unpaid
      - name: confirmationRef
        logical_type: text
        required: false
        unique: true
      - name: createdByUserId
        logical_type: identifier
        required: true
        unique: false
        references: User.id
    constraints:
      - One booking per slot.
      - Pending and confirmed both hold the slot.
      - confirmationRef is set when status becomes confirmed.
    relationships:
      - to: User
        cardinality: many-to-one
        direction: Booking to User
        via: userId
      - to: Field
        cardinality: many-to-one
        direction: Booking to Field
        via: fieldId
      - to: Slot
        cardinality: one-to-one
        direction: Booking to Slot
        via: slotId
```

## Summary

| Entity | Role |
| --- | --- |
| User | Player or owner; unique email |
| Field | Named pitch with one price; active or inactive |
| Slot | Minted id for field + on-the-hour start |
| Booking | Pending hold then confirmed after mark-paid |
