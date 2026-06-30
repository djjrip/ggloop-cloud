# Hermes Dashboard — React / Vite

Premium real-time lead dashboard for the Hermes V2 Lead Engine.
Stack: **Vite + React 18 + TailwindCSS + Framer Motion + socket.io-client**.

## Run it

```bash
cd site/hermes-dashboard
npm install
npm run dev
```

Open the URL Vite prints (default **http://localhost:5173**).

## Live data

The dashboard connects to the Hermes broker over Socket.IO at
`http://localhost:3000` and listens for `new_lead` events. Start the
backend (the CTO's `server.js`) first to see real Reddit leads.

If the broker isn't reachable, the UI automatically falls back to a
**mock stream** so it never looks dead during a demo. The connection
state is shown in the top bar and sidebar: **Live** (green), **Demo**
(amber), or **Connecting** (cyan).

Configure the endpoint in `src/lib/config.js`.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build
```
