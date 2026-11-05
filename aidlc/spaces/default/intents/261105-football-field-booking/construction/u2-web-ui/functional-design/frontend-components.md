# Frontend Components — u2-web-ui

## Sources

- WebUi component. [components]
- Answers [Q1]–[Q4].
- C1. [contract-summary]

## Hierarchy

- AppShell — header, session chip, nav (owner tools only when owner) [Q4]
  - BrowsePage — field list + day slots (`GET /fields`, `GET /fields/{id}/slots?date=`)
  - LoginPage — `POST /session`
  - RegisterPage — `POST /register` (player)
  - BookPage — pick slot, `POST /bookings` (player)
  - ConfirmationPage — `GET /bookings/{id}` shows confirmationRef [Q1]
  - OwnerFieldsPage — add/edit/deactivate fields
  - OwnerBookingsPage — list all, mark paid, book on behalf (player email)

## Props / state

| Component | State | Calls |
| --- | --- | --- |
| AppShell | token, role | none |
| BrowsePage | fields, slots, date, selectedFieldId | GET fields, GET slots |
| LoginPage | email, password, error | POST /session |
| RegisterPage | email, password, fullName, error | POST /register |
| BookPage | slotId, error409 | POST /bookings |
| ConfirmationPage | bookingId | GET /bookings/{id} |
| OwnerFieldsPage | name, price | POST/PUT/DELETE /fields |
| OwnerBookingsPage | playerEmail, list | GET /bookings, POST paid, POST /bookings |

## Interaction

- 409 on book: message “that hour is taken”, reload slots, do not POST again. [Q3]
- Writes abort after 10 seconds on screen. [contract-summary]
- Desktop-first; phone uses the same screens with scroll. [Q2]

## Form validation

- Email required on register, login, and owner-on-behalf.
- Price > 0 on add/edit field.
- Slot required before book.

## API

All domain reads and writes go to U1’s C1 façade. No local domain store.
