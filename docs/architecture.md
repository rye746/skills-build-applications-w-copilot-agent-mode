# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

- Presentation tier decision: Keep rendering and interaction in the React frontend, and put API URL construction and fetch behavior in the shared `src/api/client.ts` client. Use relative `/api` paths through the Vite proxy by default. Each capability page will expose loading, empty, success, and accessible error states; do not add authentication.
- Logic tier decision: Keep HTTP handling in Express routes under `/api/` and capability behavior in explicit TypeScript service functions. Validate request data and referenced records before persistence, return deliberate 4xx responses for invalid or missing input, and avoid leaking Mongoose cast errors as 500 responses.
- Data tier decision: Define required fields, types, and references in Mongoose schemas. Keep persistence and seed responsibilities in the data tier; seed stable demo records idempotently with upserts and do not clear collections.
- Activity tracking approach: Accept `userId`, `teamId`, `type`, and positive `minutes`; require valid IDs that resolve to existing users and teams. Persist the corresponding user and team references with the submitted activity details, computed points, and server-generated `occurredAt`.
- Team management approach: Require a non-empty team name and mascot, and persist the submitted name, mascot, and member references. List the stored teams without replacing their submitted names or mascots.
- Leaderboard approach: Sum activity points per team, order teams by descending total, and return `teamName`, `totalPoints`, and a 1-based rank for each entry.
- Workout suggestions approach: Find the user by email, then use the user's goal and recent activity pattern to select suggestions and explain the recommendation in `reason`. Return a deliberate 4xx response when no user matches.

## Test plan

- Data tier: `npm run test:data --prefix octofit-tracker/backend` — currently **fails (4 failed, 1 passed)**. Missing required-field validation on User, Team, Activity, and Workout schemas causes the four failures; the seed idempotency test passes.
- API: `npm run test:api --prefix octofit-tracker/backend` — currently **fails (4 failed)**. Invalid activity/team requests return `501` instead of `400`, the leaderboard returns no entries, and workout suggestions do not match the user's activity pattern. Failures indicate incomplete route/service behavior or incorrect results against the API contract.
- Frontend: `npm test --prefix octofit-tracker/frontend` — currently **fails (15 failed)**. Capability pages do not render the expected API-backed data/states or accessible errors; failures indicate unfinished presentation and API-client integration.
- Backend build: `npm run build --prefix octofit-tracker/backend` — **passes**. A failure indicates a TypeScript compilation error in backend code.
- Frontend build: `npm run build --prefix octofit-tracker/frontend` — **passes**. A failure indicates a TypeScript or Vite production-build error.
