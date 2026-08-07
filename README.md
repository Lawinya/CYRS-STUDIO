# CYRS-STUDIO

## Backend

A minimal Node.js + Express backend was added to serve the static frontend and provide a simple API.

Run locally:

1. Install dependencies:

```bash
npm install
```

2. Start in development with auto-reload (requires `nodemon`):

```bash
npm run dev
```

3. Or start normally:

```bash
npm start
```

Endpoints:

- `GET /api/status` — returns server status JSON.
- `POST /api/submit` — echoes JSON payload back.

The server serves the existing `index.html`, `script.js`, and `styles.css` from the workspace root.

## Database & Auth

This backend uses SQLite (via `better-sqlite3`) and provides simple JWT auth.

ENV variables (see `.env.example`):

- `PORT` — server port
- `JWT_SECRET` — secret used to sign tokens (set a strong value)
- `DB_PATH` — optional path to SQLite file

Endpoints:

- `POST /api/register` — { username, password }
- `POST /api/login` — { username, password } returns `{ token }`
- `GET /api/notes` — requires `Authorization: Bearer <token>`
- `POST /api/notes` — create note
- `PUT /api/notes/:id` — update note
- `DELETE /api/notes/:id` — delete note

## Docker

Build and run with Docker:

```bash
docker build -t cyrs-studio .
docker run -p 3000:3000 -e JWT_SECRET=your_secret cyrs-studio
```

