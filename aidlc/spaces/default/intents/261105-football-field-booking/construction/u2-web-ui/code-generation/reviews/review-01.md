## Review

**Verdict:** NOT-READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-11-05T14:56:43Z
**Iteration:** 1
**Verdict Dictated:** no

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | apps/u2-web-ui/src/api.js > createApi.register | The UI POSTs `/register`, but C1 in the contract summary has no `/register` path. Register will fail against a façade that only implements the published OpenAPI, and U1 is not obligated to keep this URL. | Either add POST `/register` (request/response) to C1 and keep the client, or change register to a path and body that C1 already names. | New |
| R-02 | Major | apps/u2-web-ui/src/app.js > renderOwnerFields / onClick | Functional spec W6 requires owner add, edit, and deactivate. `editField` exists on the client, but the Fields screen only adds and deactivates. FR2.2 owner edit is not reachable in the shell. | Add an owner edit control that calls `PUT /fields/{id}` with name and price, and show U1 errors the same way as add/deactivate. | New |
| R-03 | Major | apps/u2-web-ui/src/app.js > login-submit | Owner vs player is decided with `email.includes("owner")`, not the U1 session. FR1.2 hides owner tools behind an owner session. A player address containing "owner" gets Fields and Bookings; an owner whose email does not contain that substring never does. `decodeRoleFromToken` is unused. | Set `state.role` from the session payload U1 returns (or a documented token claim), and keep owner nav tied to that role only. | New |
| R-04 | Minor | apps/u2-web-ui/src/app.test.js | Standard volume is 5–8 tests per UI module. The api client has 8 and shell has 7; the app module has 2 (409 no-retry and 201 confirmation). Owner 404, timeout on book, and field-edit are untested at this layer. | Add tests on `createApp` for owner-on-behalf 404, write timeout, and (once present) field edit. | New |
| R-05 | Minor | apps/u2-web-ui/src/app.js > renderBrowse / renderOwnerFields | Field names, prices, and booking ids are dropped into `innerHTML` with no escaping. A hostile name from U1 becomes markup in the shell. | Escape text before interpolation, or set textContent on nodes instead of HTML strings. | New |
| R-06 | Minor | apps/u2-web-ui/index.html > viewport / main.desktop-first | NFR1 asks for a phone-sized browser as well as desktop. Viewport meta is present, but the shell is a single horizontal nav and a 960px main with no compact layout. | Add a phone-width layout (wrapping nav, readable forms) so the same pages work at phone size. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `npm --prefix apps/u2-web-ui test` (Node 22) | PASS: 3 files, 17 tests (api 8, shell 7, app 2), duration 726ms | Unit tests match the code-summary count and stay green. They do not cover the missing field-edit screen or role-from-session. A first sandboxed run died in vitest/tinypool worker teardown after api.test.js; a full-permission rerun was clean. |
| Construction Verification Command `npm --prefix apps/u1-venue-booking test` (Node 22) | PASS: 3 files, 20 tests (http 5, services 8, store 7), duration 3.37s | U1 suite is green. It does not prove U2 against C1 live HTTP, and it does not add `/register` to C1. |

### Summary

The shell, 409 handling, Bearer client, and confirmationRef page are in place and the 17 U2 tests pass, but three contract/session gaps remain: register is off the C1 map, owner field edit is not on screen, and owner tools key off the email string instead of the U1 session. Those three should be fixed before treating this unit as implementable against the façade.
