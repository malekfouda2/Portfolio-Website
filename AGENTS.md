# Repository Guidelines

## Project Structure & Module Organization

This is a full-stack TypeScript portfolio. `client/src/` contains the React/Vite frontend: views live in `pages/`, features in `components/`, hooks in `hooks/`, and utilities in `lib/`. Radix/shadcn primitives are under `client/src/components/ui/`. The Express API, authentication, security, persistence, and startup code live in `server/`. Shared Drizzle models and Zod schemas belong in `shared/schema.ts`. Static files go in `public/`; managed project images go in `uploads/`. `attached_assets/` holds source assets, while `artifacts/mockup-sandbox/` is a separate design prototype.

## Build, Test, and Development Commands

- `npm ci` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Express server and Vite middleware in development mode.
- `npm run check` performs strict TypeScript checking.
- `npm run build` builds the client into `dist/public/` and bundles the server into `dist/index.js`.
- `npm start` serves the production build; run `npm run build` first.
- `npx tsx --test server/*.test.ts` runs the Node test suites.
- `npm run db:push` applies `shared/schema.ts` to PostgreSQL and requires `DATABASE_URL`.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation, semicolons, and surrounding code style. Name React components and files in PascalCase (`ProjectModal.tsx`), hooks in camelCase beginning with `use`, and utilities in camelCase. Prefer `@/` for client imports and `@shared/` for shared schemas. Use Tailwind classes for styling. No formatter or linter is configured; keep imports tidy and run `npm run check` before submitting.

## Testing Guidelines

Tests use `node:test` with `node:assert/strict`. Place focused tests beside server modules as `*.test.ts`; describe behavior in test names, especially validation, authentication, and upload edge cases. No coverage threshold is enforced, but server behavior and security fixes should include regression tests.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Update client UI and server security configurations`. Keep each commit scoped and start subjects with verbs like `Add`, `Update`, `Fix`, or `Refactor`. Pull requests should explain user-visible and API changes, note database or environment impacts, link relevant issues, and include screenshots for visual changes. Report the commands run for verification.

## Security & Configuration

Never commit secrets or production credentials. Configure `DATABASE_URL`, `JWT_SECRET`, and optional `VITE_GA_MEASUREMENT_ID` through the environment. Preserve validation and sanitization at API and upload boundaries; consult `SECURITY.md` before changing authentication, headers, rate limits, or file handling.
