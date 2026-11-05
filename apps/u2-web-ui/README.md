# u2-web-ui

Desktop-first browser app for the football field venue. It calls U1 over HTTP; it does not store fields, slots, or bookings itself.

## Point at U1

U1 listens on `http://127.0.0.1:3001` by default.

1. Start U1: `npm --prefix apps/u1-venue-booking start`
2. Open `apps/u2-web-ui/index.html` in a browser, or `npm --prefix apps/u2-web-ui start`

Override the API base URL:

```js
localStorage.setItem("U1_BASE_URL", "http://127.0.0.1:3001");
```

or set `window.U1_BASE_URL` before the module script.

Seeded owner (from U1): `owner@venue.local` / `changeme`. Register as a player, then log in.

Serve the UI with `npm start` (port 4173). U1 allows CORS from `http://127.0.0.1:4173` and `http://localhost:4173`. Opening `index.html` as a file will still be blocked.

## Tests

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" && nvm use 22
npm --prefix apps/u2-web-ui test
```
