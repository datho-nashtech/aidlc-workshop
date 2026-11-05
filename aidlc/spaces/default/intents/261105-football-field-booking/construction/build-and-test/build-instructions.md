# Build Instructions

Node 22 via nvm.

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 22
npm --prefix apps/u1-venue-booking install
npm --prefix apps/u2-web-ui install
```

U1 is TypeScript run with `tsx` (no compile step). U2 is static ES modules (no bundle step).

Start U1:

```bash
npm --prefix apps/u1-venue-booking start
```

Open `apps/u2-web-ui/index.html` or `npm --prefix apps/u2-web-ui start`. Set `localStorage.U1_BASE_URL` to `http://127.0.0.1:3001`.

Verify: both `npm --prefix apps/u1-venue-booking test` and `npm --prefix apps/u2-web-ui test` exit 0.

Troubleshooting: default shell Node 14 fails on `??=`; always `nvm use 22`. Cross-origin browser fetch to U1 may need CORS later.
