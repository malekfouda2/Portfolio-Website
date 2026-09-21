# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also `AGENTS.md` (style, commit conventions) and `SECURITY.md` (read before touching auth, headers, rate limits, uploads).

## Commands

- `npm run dev` — Express + Vite middleware on one port (`PORT`, default 5000). Requires `DATABASE_URL`.
- `npm run check` — strict `tsc`; the only static check (no linter/formatter).
- `npm run build` — Vite client → `dist/public/`, esbuild server → `dist/index.js`. `npm start` serves it.
- `npx tsx --test server/*.test.ts` — all tests (`node:test` + `node:assert/strict`).
- `npx tsx --test server/htmlSafety.test.ts` — single file; add `--test-name-pattern="..."` for a single test.
- `npm run db:push` — push `shared/schema.ts` to Postgres via drizzle-kit (no migration files).
- `npm run seo:indexnow` — submit URLs to IndexNow (`scripts/submit-indexnow.ts`).

Env vars are documented in `.env.example` (DB, `JWT_SECRET`, `ADMIN_USERNAME`/`ADMIN_PASSWORD` bootstrap, Resend lead email, Cloudflare Turnstile, GA).

## Architecture

Single Express process serves API, SEO-prerendered HTML, and the React SPA. Path aliases: `@/` → `client/src`, `@shared/` → `shared`.

**Server startup (`server/index.ts`)** — order matters:
1. `setupSecurity` (helmet/CSP, rate limits in `server/security.ts`; free text goes through `cleanText`, which never rewrites words — escaping happens at output), compression, JSON parsing, upload security, `/uploads` static.
2. `registerRoutes` (`server/routes.ts`) — all `/api/*` endpoints plus robots/sitemap/llms.txt/favicons.
3. Seeding: dev runs full `seedDatabase()` + `cleanupProjectImages()`; production runs `seedDatabase("marketing")`, which only inserts missing marketing records (services, case studies) and never overwrites live CMS/lead data.
4. Server-rendered public routes (`/`, `/portfolio`, `/work`, `/work/:slug`, `/services/:slug`, `/solutions`, `/solutions/:slug`, …): `buildRouteHtml` reads `client/index.html` (dev) or `dist/public/index.html` (prod), rewrites title/meta/OG/canonical/JSON-LD, injects crawler-visible body HTML, and can embed `initialData` as `window.__INITIAL_QUERY_DATA__` (keyed by API path, e.g. `"/api/projects"`), which `client/src/main.tsx` seeds into React Query. All interpolated CMS values must go through `escapeHtml` / `sanitizeHttpUrl` / `serializeJsonLd` from `server/htmlSafety.ts`.
5. Catch-all: unknown non-asset paths get the app shell with HTTP 404 (`isKnownSpaRoute` must be updated when adding client routes), then Vite (dev) or `serveStatic` (prod).

Adding a public page therefore usually touches three places: the wouter `<Route>` in `client/src/App.tsx`, the prerender handler/known-route list in `server/index.ts`, and the sitemap in `server/routes.ts`.

**Data layer** — Drizzle tables and Zod insert/update schemas (via `drizzle-zod`) live in `shared/schema.ts`. `server/storage.ts` exposes an `IStorage` interface backed by `postgres-js` (`server/db.ts`); routes call `storage`, never `db` directly. Content types: hero, about, projects, skills, partnerships, contact info, services, case studies, contacts (leads), users.

**Content sources**:
- CMS content is edited in the `/dashboard` page (`client/src/pages/dashboard.tsx`) against `/api/admin/*`.
- Seed defaults: `server/seed.ts`; long-form case study content: `server/caseStudyContent.ts`.
- Commercial landing pages (`/solutions/:slug`) are static data in `shared/commercialLandingPages.ts`, not DB rows. Site-wide identity/URLs in `shared/siteIdentity.ts`.

**Auth** — `server/auth.ts`: bcrypt users table; if the username is not found and matches `ADMIN_USERNAME`/`ADMIN_PASSWORD`, that admin is created. Login issues an 8h JWT (`JWT_SECRET`, falls back to `SESSION_SECRET`; dev-only fallback) in an httpOnly `SameSite=Strict` cookie (`server/sessionCookie.ts`); `requireAuth` reads only that cookie. The client never sees the token: `/dashboard` checks `GET /api/admin/session`, logout is `POST /api/auth/logout`, and `apiRequest`/`getQueryFn` in `client/src/lib/queryClient.ts` send `credentials: "include"` and redirect to `/login` on 401.

Admin `:id` routes validate ids with `parseId` (400) and return 404 when storage update/delete finds no row (`update*` returns `undefined`, `delete*` returns `false`).

**Project images** — stored as base64 data URLs in the `projects` table. Public API responses replace them with `/media/projects/:id/:asset` URLs (`getPublicProject` in `server/projectImages.ts`), which decode, optimize with `sharp`, and cache in memory. `server/imageCleanup.ts` removes broken references.

**Contact/leads** — `POST /api/contact` validates, checks Turnstile + honeypot/timing (`server/contactProtection.ts`), stores the contact, then sends email via Resend (`server/leadNotifications.ts`). Client-side attribution/UTM capture is in `client/src/lib/attribution.ts`.

**Public UI design system ("open bracket")** — tokens and component classes live in `client/src/index.css` (`--signal` green, `--flow` blue, `.display-*` type scale, `.btn-*`, `.tag`, `.bracket-link`, `.faq`, `.wave-letter`, `.glyph-float`). Headlines use Anybody (variable width axis), body uses Hanken Grotesk, both self-hosted via `@fontsource-variable`. Shared building blocks are in `client/src/components/design/`: `PageHero`, `SectionHead`, `RevealText` (scroll reveal via one shared IntersectionObserver + CSS `.reveal-word` transitions), `WaveText` (hover letter ripple), `StretchText` (hero/footer pointer stretch), `FloatingField` + `Glyph` (draggable floating objects), `VelocityTicker`, `ProblemIndex` (rows accept an `art` illustration), `CtaBand`, `Magnetic`, `Tilt`, `Chevron`, `BracketCursor`, `Marquee`, `CountUp`.

Illustrations live in `client/src/components/art/`: `Scenes.tsx` (animated SVG scenes; map service/solution slugs via `sceneFor`), `SceneFrame` (loops while on screen, pauses off screen), `ArtPanel`, `ScreenshotStack` (real case-study screenshots). Scene motion classes (`.sa` + `.s-*`) are in index.css. The header (`Navigation.tsx`) is an always-visible floating dock (solid background, never hides on scroll) with illustrated Services/Solutions dropdowns and a tile menu below `lg`. Brand colours are defined in `tailwind.config.ts` in channel form so opacity modifiers like `text-bone/80` work.

Motion rules: animate transforms/opacity only on text that can wrap — never `font-stretch`, `letter-spacing` or font size, which reflow lines mid-animation (`StretchText` is only for single-line, `whitespace-nowrap` text). Every effect must respect `useReducedMotionPreference`/`useFinePointer` (`client/src/hooks/useMotionPrefs.ts`). Floating objects must sit in empty areas and use `dragSnapToOrigin` so they never cover controls. Performance: scroll-triggered motion should be CSS transitions, not per-frame JS; never put `will-change` on per-letter spans (hundreds of GPU layers made the home page drop to ~10fps under load); avoid `backdrop-filter` and full-screen fixed overlays on scrolling pages. The admin `/dashboard` and `/login` keep their own Tailwind gray styling.

## Gotchas

- `artifacts/mockup-sandbox/` is a separate prototype, not part of the build.
- No local `.env` is committed; the server throws at import time without `DATABASE_URL`, so tests must not import `server/db.ts` (directly or via `storage`/`auth`). Keep testable logic in DB-free modules like `sessionCookie.ts`.
