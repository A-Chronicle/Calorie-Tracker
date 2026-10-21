# CAL-c

Snap or search a meal, get calories and macros, and track your daily goal. Accounts and data live on the server in Postgres.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router
- **API:** Vercel Functions in `api/`, shared server code in `server/`
- **Database:** Postgres (Neon via the Vercel Marketplace in production)
- **Auth:** email and password (scrypt hashes), HttpOnly session cookie
- **Photo analysis:** Vercel AI Gateway (vision model)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` from the template and fill it in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: a Postgres connection string, for example `postgres://USER:PASSWORD@localhost:5432/calorie_tracker`.
   - `AI_GATEWAY_API_KEY`: needed only for photo analysis. Without it, photo analysis returns a clear error and the search and manual tabs still work.
   - `BLOB_READ_WRITE_TOKEN` (optional locally): a Vercel Blob token. Without it, meal photos are kept in `.local-photos/` (git-ignored). Production requires it.

3. Create the tables:

   ```bash
   npm run db:migrate
   ```

   The schema in `server/schema.sql` is idempotent, so it's safe to run again.

4. Start the app:

   ```bash
   npm run dev
   ```

   The API runs inside the Vite dev server under `/api`, routed the same way as on Vercel.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the API |
| `npm run build` | Type-check (app, API, config) and build the client |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply `server/schema.sql` to `DATABASE_URL` |

## Deploying to Vercel

1. Import the repo into Vercel.
2. Add a Postgres database from the Marketplace (Neon). It sets `DATABASE_URL` for the project.
3. Add `AI_GATEWAY_API_KEY` to the project environment variables.
4. Apply the schema to the production database once, with the production `DATABASE_URL`:

   ```bash
   DATABASE_URL="postgres://..." npm run db:migrate
   ```

5. Create a Blob store (Storage tab on the project) and connect it. This sets `BLOB_READ_WRITE_TOKEN`. Meal photos are stored as private blobs.
6. Deploy. Session cookies are marked `Secure` in production, so the app must be served over HTTPS.

## Project layout

```
api/            Route handlers (one file per endpoint, e.g. api/meals.ts)
server/         DB access, auth, validation schemas, row mapping, schema.sql
src/            React app (pages, components, contexts, lib/api.ts client)
scripts/        migrate.mjs (applies server/schema.sql)
```

### API

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account and start a session |
| POST | `/api/auth/signin` | Start a session (rate-limited: 5 attempts per email and 50 per IP every 15 minutes) |
| POST | `/api/auth/signout` | End the session |
| GET | `/api/auth/me` | Current user or `null` |
| GET | `/api/data` | Profile, meals and weights for the signed-in user |
| PUT | `/api/profile` | Save profile and goals |
| POST | `/api/photos` | Upload a meal photo (JPEG, PNG or WebP, up to 3 MB); returns a key |
| GET | `/api/photo?key=` | Read one of your photos (private) |
| POST | `/api/meals` | Log a meal, optionally with a `photoKey` |
| DELETE | `/api/meals?id=` | Delete one of your meals |
| PUT | `/api/weights` | Log a weigh-in for a date |
| POST | `/api/analyze-food` | Estimate a meal from a photo (signed in only) |
