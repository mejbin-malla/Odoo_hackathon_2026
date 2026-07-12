# TransitOps — Recommended Tech Stack (2026)

Based on the TransitOps PRD (RBAC across four personas, relational business rules, real-time dashboard, reporting/CSV export).

## Frontend

**Next.js 15 (App Router) + React 19 + TypeScript**

- File-based routing makes it easy to gate persona-specific pages (e.g. `/dashboard/financial` vs `/dashboard/safety`).
- Server Components handle data-heavy list views (vehicles, drivers, trips) efficiently.
- Server Actions let forms (trip creation, maintenance logs) call validated backend logic without a separate API layer.
- TypeScript models the PRD's enums and state machines as literal union types, catching invalid status transitions at compile time — directly supporting the "zero invalid dispatches" goal:
  - Vehicle status: `Available | On Trip | In Shop | Retired`
  - Driver status: `Available | On Trip | Off Duty | Suspended`
  - Trip lifecycle: `Draft → Dispatched → Completed → Cancelled`

## Styling & UI

**Tailwind CSS + shadcn/ui + Recharts**

- Tailwind keeps four persona-specific UIs visually consistent without a heavy design system.
- shadcn/ui provides accessible table, form, and dialog primitives — most of this app's surface area.
- Recharts (or Chart.js) covers the KPI dashboard and fuel efficiency / utilization / ROI charts.

## Authentication & RBAC

**Better Auth**

- TypeScript-native, full control over the session/role model (Fleet Manager, Driver, Safety Officer, Financial Analyst).
- Custom permission logic lives in your own database rather than a third-party dashboard.
- Integrates cleanly with Drizzle/Neon, so RBAC checks can join directly against domain tables (e.g. restricting trip dispatch to certain roles).

## Backend / API layer

**Next.js Server Actions & Route Handlers**

- Enforces business rules (uniqueness, capacity checks, status transitions) server-side, close to the database.
- No separate backend service needed at this scope — reduces operational overhead, consistent with the PRD's goal of reducing overhead vs. spreadsheets.
- Shares TypeScript types end-to-end with the frontend.

## Database

**Neon (Serverless Postgres)**

- The domain is strongly relational: Vehicles, Drivers, Trips, Maintenance Logs, Fuel Logs, and Expenses all reference each other.
- Postgres transactions enforce atomic multi-table updates (e.g. dispatching a trip must flip both vehicle and driver to `On Trip` together, with no race condition).
- Foreign keys and unique constraints map directly onto mandatory business rules (unique registration numbers, one active trip per vehicle/driver).
- Neon's serverless scaling pairs naturally with Vercel's serverless functions.
- Database branching lets you test business-rule changes against a branched copy of production data before merging — useful for a system with many interlocking constraints.

**Drizzle ORM**

- Schema-as-TypeScript mirrors the Postgres schema 1:1.
- Generates types shared by Better Auth and Server Actions.
- Lightweight, edge-compatible driver pairs well with Neon.

## Deployment

**Vercel**

- Native, first-class support for Next.js.
- Per-PR preview deployments, each of which can point at its own Neon branch for realistic end-to-end testing.
- Edge functions suit the dashboard's read-heavy KPI queries.

## Supporting Tools

| Concern | Tool | Why |
| --- | --- | --- |
| Client-side data caching | TanStack Query | Keeps the active-trips list and dashboard KPIs feeling live via polling/revalidation — full real-time infra (WebSockets/live tracking) is explicitly out of scope for v1. |
| License-expiry email reminders (bonus) | Resend | Simple transactional email API for the Safety Officer's proactive alerts. |
| CSV export | papaparse | Satisfies the mandatory CSV export requirement for reports. |
| Testing | Vitest + Playwright | Business-rule logic (double-booking prevention, overload prevention, expired-license blocking) is the highest-risk part of the app and needs real automated coverage, not just manual QA. |

## Summary Table

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 15 / React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Auth & RBAC | Better Auth |
| Backend | Next.js Server Actions / Route Handlers |
| Database | Neon (Postgres) |
| ORM | Drizzle |
| Deployment | Vercel |
| Data fetching/cache | TanStack Query |
| Email | Resend |
| CSV export | papaparse |
| Testing | Vitest + Playwright |

## Open Question

Section 10 of the PRD notes that revenue-per-trip (needed for the ROI formula: `ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost`) is not yet defined. This should be resolved with Finance before finalizing the Trips schema, since it determines whether revenue is entered manually per trip or derived from a separate billing integration.
