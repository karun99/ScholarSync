# Architecture

ScholarSync is a client-side research data portal. Every record lives in the
browser's `localStorage`; there is no server component and no telemetry.

## Components

| Path | Responsibility |
|---|---|
| `src/main.jsx` | React entry point and router mount |
| `src/App.jsx` | Application shell: dashboard, research feed, approvals, statistics, announcements, profile and settings |
| `src/utils/storage.js` | The data layer: seed data, typed getters/setters, JSON/CSV export and import |
| `src/index.css`, `src/App.css` | Design tokens and layout |
| `public/` | Static assets |

## Data model

`storage.js` owns five `localStorage` keys:

| Key | Contents |
|---|---|
| `scholarsync_users` | Accounts with `username`, `password`, `role`, `department` |
| `scholarsync_rdata` | Research records and their approval state |
| `scholarsync_auth` | The signed-in session |
| `scholarsync_messages` | Announcements and department threads |
| `scholarsync_settings` | Institution branding, maintenance mode, database settings |

`initializeData()` seeds defaults only when a key is absent, so an existing
portal is never overwritten on reload. Getters merge stored settings over the
defaults, so a partial settings object cannot break the UI.

## Roles and approval flow

Four roles gate the UI: researcher, department HOD, research-cell admin and
college admin. A submission moves researcher → HOD review → research cell →
college admin approval. Each screen filters records by the signed-in role, and
the final approval step is restricted to the college admin.

## Trust boundaries

- Authentication is local to the browser; the portal is intended for a single
  operator or a shared machine, not as a multi-tenant server.
- The JSON export is the backup and migration path; the import validates the
  parsed object before writing anything.
- No data leaves the device.

## Verification

```bash
npm install
npm run build          # production bundle
node --test src/utils/storage.test.js
```

The tests install an in-memory `localStorage` shim and exercise seeding,
idempotent initialisation, id allocation, settings merging and round-trips. CI
runs the build and the suite on every push.
