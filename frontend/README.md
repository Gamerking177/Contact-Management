# Contact Management

React + Vite + TypeScript frontend for the Contact Management app.

## Prerequisites

- **Node.js** 18+ and npm
- Running backend API (Express/MongoDB) on `http://localhost:3000` by default. See `backend/`.

## Quick start

```bash
# from repository root (recommended open two terminals)

# 1) Backend
cd backend
npm i
node api/index.js # starts on http://localhost:3000

# 2) Frontend
cd frontend
npm i
cp .env.example .env # then set VITE_API_BASE_URL
npm run dev # opens on http://localhost:8080
```

## Environment variables

Copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Used in `src/services/api.ts` as the Axios `baseURL` (trailing slashes trimmed).

## Backend setup

- Requires: MongoDB (local or Atlas)
- Env: create `backend/.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/contact_management
PORT=3000
```

- Run:

```bash
cd backend
npm i
# Start HTTP server
node api/index.js
# Or with auto-reload
npx nodemon api/index.js
```

- Health check: `GET /health` returns uptime/status JSON
- CORS: allows `http://localhost:8080` and `http://localhost:5173` (see `backend/server.js`)
- Structure:

```
backend/
  api/index.js          # app.listen()
  server.js             # builds & exports Express app (no listen)
  routes/contact.route.js
  controllers/contact.controller.js
  model/contact.model.js
  config/db.config.js
  package.json
```

- Note: `backend/package.json` scripts target `server.js` (which doesn't call `listen`). Use the commands above or update scripts to run `api/index.js`.

## Scripts

Defined in `package.json`:

- **dev**: `vite` (serves on port `8080`, see `vite.config.ts`)
- **build**: `vite build`
- **build:dev**: `vite build --mode development`
- **preview**: `vite preview`
- **lint**: `eslint .`

## Tech stack

- **React 18**, **TypeScript**, **Vite**
- **Tailwind CSS** + `tailwindcss-animate`
- **shadcn/ui** (via Radix primitives)
- **React Router** for routing
- **@tanstack/react-query** for caching/mutations
- **Axios** for HTTP
- **react-toastify** for toasts

## App structure (frontend)

- `src/App.tsx`: Router, providers (`QueryClientProvider`, tooltips), global toasts
- `src/pages/Index.tsx`: Main page that loads and shows contacts
- `src/components/ContactForm.tsx`: Create contact with client-side validation
- `src/components/ContactList.tsx`: List + delete contacts (table/cards)
- `src/services/api.ts`: Axios instance using `VITE_API_BASE_URL`
- `src/services/contactService.ts`: API calls: `getContacts()`, `createContact()`, `deleteContact()`
- `src/types/…` and `src/utils/…`: Types and validation helpers

## Features

- **Create contact** with fields: name, email, phone, optional message
- **List contacts** (newest first), responsive table/card UI
- **Delete contact** with optimistic UI via React Query
- **Validation** with user feedback, success/error toasts

## API usage (from frontend)

Base URL comes from `VITE_API_BASE_URL`. Endpoints used by `src/services/contactService.ts`:

- `GET /api/contacts` → list contacts
- `POST /api/contacts` → create contact `{ name, email, phone, message? }`
- `DELETE /api/contacts/:id` → delete by id

The backend mounts these under `/api/contacts` in `backend/server.js` via `backend/routes/contact.route.js`.

## Running with backend

- Backend accepts CORS from `http://localhost:5173` and `http://localhost:8080` (`backend/server.js`).
- Ensure MongoDB is reachable and `MONGODB_URI` is set in `backend/.env` (see `backend/config/db.config.js`).
- Start backend first, then start frontend with `VITE_API_BASE_URL` pointing to it.

## Build & preview

```bash
npm run build
npm run preview
```

## Development notes

- Path alias `@` → `src/` configured in `vite.config.ts` and `tsconfig.json`.
- Dev server runs on port `8080` (overridden in `vite.config.ts`).

