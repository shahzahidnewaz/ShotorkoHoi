# ShotorkoHoi

**Know what to expect before your hospital visit.**

ShotorkoHoi is an anonymous, patient-reported experience platform for
hospitals and clinics in Bangladesh. Patients submit free, anonymous
reports about cost, wait time, and communication quality at a facility;
every report is moderated by an admin before it becomes public, and
approved reports are aggregated into per-facility stats so future patients
can search a hospital and see what to realistically expect before they go.

It is explicitly **not** a booking site and has no affiliation with any
hospital — it exists purely to surface real patient accounts.

---

## Table of contents

- [Project overview](#shotorkohoi)
- [Main features](#main-features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [How to run the application](#how-to-run-the-application)
- [Backend dependency](#backend-dependency)
- [Application routes](#application-routes)
- [User / Admin functionality](#user--admin-functionality)
- [Screenshots](#screenshots)

---

## Main features

- **Search hospitals** by name, district, and department, with live result
  cards showing hospital type and how many approved reports exist.
- **Hospital detail pages** with an aggregate stat strip (cost range, median
  wait time, average communication score, report count) plus the full list
  of individual approved reports.
- **Anonymous report submission** — a 3-step guided form (hospital →
  experience details → review) that requires no account.
- **Moderation queue** — every submitted report starts as `pending` and is
  invisible on the public site until an admin approves or rejects it.
- **Admin panel** — a report moderation queue and a user-management screen
  (activate/deactivate accounts, promote/demote admins).
- **Personal profile** — every signed-in admin can view/edit their name,
  upload a profile photo, and change their password from dedicated
  `/profile` and `/profile/password` pages, reachable from a circular
  avatar menu in the header.
- **Bengali/English UI toggle** in the header.
- **No login required** for the core flow (searching and submitting
  reports); accounts are needed for the profile and admin/moderation side.

## Technologies

**Frontend**
- React 18 (JavaScript)
- Vite
- React Router v6
- Tailwind CSS
- Fonts: Inter (body), Source Serif 4 (editorial accents), Space Grotesk
  (display/header)

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3` (single file-based database, no external DB
  service required)
- Cookie-based sessions for admin auth
- CORS configured for the Vite dev origin

**Deployment**
- Docker + Docker Compose (`Dockerfile`, `server/Dockerfile`,
  `docker-compose.yml`) — nginx serves the built frontend and proxies
  `/api/*` to the backend container; the SQLite file persists in a named
  volume.

## Installation

The project has two independent `package.json`s — one for the frontend
(repo root) and one for the backend (`server/`). Install both:

```bash
# 1. Frontend
npm install

# 2. Backend
cd server
npm install
cd ..
```

## Environment variables

Only the backend needs configuration, and only if you want to change the
defaults. Copy the example file and edit as needed:

```bash
cd server
cp .env.example .env
```

`server/.env`:

| Variable         | Required | Default                    | Description                                                                 |
|------------------|----------|-----------------------------|-------------------------------------------------------------------------------|
| `PORT`           | No       | `4000`                      | Port the Express API listens on.                                             |
| `CLIENT_ORIGIN`  | No*      | `http://localhost:5173`     | Origin of the frontend dev server. Must be correct for the session cookie to work across ports (CORS + credentials). |
| `ADMIN_EMAIL`    | No       | `admin@shotorko.local`      | Email for the first admin account, auto-created on first server start.       |
| `ADMIN_PASSWORD` | No       | randomly generated         | Password for that first admin account. If unset, a one-time password is generated and printed to the server console on first boot — copy it from there and change it immediately. |
| `ADMIN_TOKEN`    | No       | unset                       | If set, every `/api/admin/*` request must include a matching `x-admin-token` header. Left unset by default in local dev. |

\* Not strictly required for local dev (the default matches Vite's default
port), but required if you run the frontend on a different port/host.

The frontend needs **no** environment variables for local development — it
talks to the API through Vite's dev proxy. In production, if the frontend
is served from a different origin than the API, set:

| Variable         | Required | Description                                              |
|------------------|----------|--------------------------------------------------------------|
| `VITE_API_BASE`  | No       | Base URL of the deployed API (e.g. `https://api.example.com/api`). Defaults to `/api` (same-origin). |

## How to run the application

You need **both** the backend and the frontend running at the same time.

**1. Start the backend** (in one terminal):

```bash
cd server
npm run dev
```

This starts the API on `http://localhost:4000` and auto-reloads on file
changes. On first boot it creates `server/data/shotorko.sqlite` and seeds
it with sample facilities and pre-approved reports, plus the first admin
account from your `.env`/defaults.

**2. Start the frontend** (in a second terminal, from the project root):

```bash
npm run dev
```

This starts Vite on `http://localhost:5173`. Open that URL in your
browser — API calls to `/api/*` are automatically proxied to the backend.

Other useful frontend scripts:

```bash
npm run build  
npm run preview 
```

Other useful backend scripts:

```bash
npm start        
npm run seed 
```

To fully reset the database to its seed state, stop the server and delete
`server/data/shotorko.sqlite`, then start it again.

> **Note:** reference data (departments/districts/tags) is fetched once
> from the API when the app starts (`src/lib/dataClient.js`), and
> `src/main.jsx` waits for that fetch to finish before rendering. This
> means the backend must be reachable at startup — if it isn't, the app
> still renders (with empty department/district lists) rather than
> hanging indefinitely.

## Running with Docker

The whole stack (frontend + backend) can be run with Docker Compose,
without installing Node.js locally.

```bash
docker compose up --build
```

This builds two images:
- `server` — the Express/SQLite API, with its database persisted in a
  named Docker volume (`shotorko-data`) so it survives container restarts.
- `web` — the React app built for production with Vite and served by
  nginx, which also proxies `/api/*` to the `server` container.

Once it's up, open **http://localhost:8080**.

Optional environment overrides (set them in a `.env` file next to
`docker-compose.yml`, or export them before running `docker compose up`):

| Variable         | Default                      | Description                                   |
|------------------|-------------------------------|------------------------------------------------|
| `ADMIN_EMAIL`    | `admin@shotorko.local`        | Email for the auto-created first admin account.|
| `ADMIN_PASSWORD` | randomly generated            | Password for that admin account. Set this to something known, or check the `server` container logs for the generated one-time password. |
| `CLIENT_ORIGIN`  | `http://localhost:8080`       | Origin allowed by the API's CORS policy.       |

To stop the stack: `docker compose down`. To also remove the persisted
database volume: `docker compose down -v`.

## Backend dependency

**The frontend is not standalone — it requires the backend API to function.**
`src/lib/dataClient.js` (facilities/reports) and `src/lib/authClient.js` /
`src/lib/adminClient.js` (auth and admin actions) all make real HTTP calls
to the Express server; there is no built-in mock-data fallback in the
current version. If the backend isn't running, searches, facility pages,
and report submission will fail with a "could not reach the server" error.

In dev, `vite.config.js` proxies any request to `/api/*` from the frontend
(port 5173) to the backend (port 4000), so no extra configuration is
needed as long as both are running. In production, deploy the API
separately and either serve the frontend from the same origin or set
`VITE_API_BASE`.

Data model, in brief:
- **facilities** — id, name, district, area, type, departments.
- **reports** — tied to a facility; `status` is `pending`, `approved`, or
  `rejected`. Only `approved` reports are ever shown publicly.
- **users** — `role` is `user` or `admin`; `status` is `active` or
  `inactive`.

Key API endpoints the frontend depends on:

| Method   | Path                                 | Purpose                                  |
|----------|----------------------------------------|--------------------------------------------|
| GET      | `/api/facilities`                      | Search/list facilities                     |
| GET      | `/api/facilities/:id`                  | Facility details                           |
| GET      | `/api/facilities/:id/reports`          | Approved reports for a facility            |
| GET      | `/api/facilities/:id/stats`            | Aggregate stats for a facility             |
| POST     | `/api/reports`                         | Submit a new report (always `pending`)     |
| POST     | `/api/auth/login` / `logout` / `me`    | Admin session auth                         |
| GET/POST | `/api/admin/reports*`                  | Moderation queue (approve/reject)          |
| GET/POST | `/api/admin/users*`                    | User management (activate/promote/etc.)    |
| PATCH    | `/api/auth/me`                         | Update the signed-in user's name/avatar    |

## Application routes

| Route             | Page            | Access     | Description                                                      |
|-------------------|-----------------|------------|--------------------------------------------------------------------|
| `/`               | Landing         | Public     | Hero search, quick district filter, recently added facilities.     |
| `/search`         | Search          | Public     | Full search with name/district/department filters and result cards. |
| `/facility/:id`   | Facility detail | Public     | Facility info, aggregate stat strip, list of approved reports.     |
| `/report/new`     | Report New      | Public     | 3-step anonymous report submission form.                            |
| `/report/success` | Report success  | Public     | Confirmation shown after submitting a report.                       |
| `/about`          | About           | Public     | About the project / how moderation works.                           |
| `/login`          | Login           | Public     | Admin login form.                                                    |
| `/profile`        | Personal details| Signed-in  | View/edit name, upload a profile photo, view email/role/status.     |
| `/profile/password`| Change password| Signed-in  | Update the current account's password.                              |
| `/admin`          | Dashboard       | Admin only | Platform overview stats and user management.                        |
| `/admin/queue`    | Moderation queue| Admin only | Approve/reject pending reports.                                     |

`/admin` and `/admin/queue` are wrapped in `RequireAdmin`; `/profile` and
`/profile/password` are wrapped in `RequireAuth`. Both redirect
unauthenticated visitors to `/login`.

## User functionality

**Anonymous visitor (no account needed)**
- Search and browse facilities and their approved reports.
- Submit an anonymous experience report via the 3-step form. No login,
  no personally identifying info required.
- Switch the UI language between English and বাংলা from the header.
- Every submitted report is invisible to other visitors until an admin
  approves it — this is what keeps the data trustworthy despite being
  fully anonymous and unverified.


**Admin**
- Log in at `/login` with an admin account (the first one is created
  automatically from `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- **Dashboard** (`/admin`): platform overview stats (pending/approved/
  rejected reports, user counts, hospitals on record) plus user management
  — activate/deactivate accounts, promote a regular user to admin or
  demote an admin back to a regular user, and delete accounts.
- **Moderation queue** (`/admin/queue`): review pending reports and
  approve or reject each one (with an optional rejection reason); filter
  the queue by status.
- Admin session is cookie-based; logging out clears the session and
  returns to the public site.

There is currently no self-serve report history for regular users — the
profile pages cover account settings only; report submission itself
remains anonymous and doesn't require being logged in.

## Screenshots

### Landing page
![Landing Page](<Website Interface/Landing Page.png>)

### Data
![Data](<Website Interface/Data.png>)

### Bangla Translation
![Bangla Translation](<Website Interface/Bangla Translation.png>)

### Search results
![Search](<Website Interface/Search.png>)

### Hospital detail
![Hospital Detail](<Website Interface/Hospital Details.png>)

### Submit a report
![Share your experience](<Website Interface/Share your experience.png>)

### Admin Dashboard
![Admin Dashboard](<Website Interface/Admin Dashboard.png>)
