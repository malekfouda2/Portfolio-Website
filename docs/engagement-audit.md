# Client Acquisition Redesign — Baseline Audit

Date: 2026-08-23

## Confirmed direction

- Lead with Custom Business Systems and E-commerce Development & Rescue.
- Give Shopify and WordPress/WooCommerce equal platform emphasis.
- Serve growing businesses, founders, and agencies across Egypt, the GCC, USA, and Europe in English.
- Use **Discuss Your Project** as the primary CTA, linking to the approved 30-minute Calendly event.
- Offer email, Calendly, and WhatsApp (`+20 122 607 6000`) as contact paths.
- Publish case studies for Ezhalha, Aiqda, and Tabliya Shopify Middleware only after approved source content is supplied.
- Preserve the dark palette, gradients, and personal identity while reducing decorative motion.

## Current architecture

- React 18, Vite, Wouter, Tailwind CSS, React Query, and Radix UI on the client.
- Express, Drizzle ORM, and PostgreSQL on the server.
- Replit autoscale deployment with `npm run build` and `npm start`.
- Database-backed hero, about, projects, skills, partnerships, contact information, and inquiries.
- Public routes are currently limited to `/` and `/portfolio`; `/login` and `/dashboard` are administrative.
- Production currently exposes 34 portfolio projects and uses Google Analytics plus Apollo visitor tracking.

## Baseline validation

- `npm run build`: passes.
- `npx tsx --test server/*.test.ts`: 3 tests pass.
- `npm run check`: fails with pre-existing schema typing, React Query, route typing, and missing declaration errors.
- Sitemap: only `/` and `/portfolio`.
- The `/portfolio` response has route-specific metadata but crawler-visible homepage body content because the HTML replacement does not match the current template.

## Required foundation work

1. Replace hardcoded administrator credentials and the fixed bearer token with hashed database credentials and signed, expiring authentication.
2. Make development seeding idempotent; it currently duplicates projects, skills, and partnerships on every start.
3. Add models and publishing controls for services and case studies.
4. Expand inquiries with company, URL, project type, goals, budget, timeline, preferred contact method, campaign, and referrer data.
5. Establish one source of truth for approved claims, contact details, social links, and SEO content.
6. Repair crawler-visible route rendering, status codes, sitemap generation, and structured data.
7. Resolve the TypeScript baseline before release.

## Delivery sequence

1. Security, schema, storage, API, and baseline repair.
2. Conversion homepage and shared marketing layout.
3. Service, work, about, and contact routes.
4. Dashboard content management and lead workflow.
5. SEO, redirects, analytics, accessibility, and performance.
6. Full QA and review-ready handoff. Production deployment requires separate approval.
