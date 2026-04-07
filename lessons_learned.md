# Lessons Learned — Clause MVP

This ledger tracks every bug, failed test, or correction encountered during development.
Each entry includes the root cause and a prevention rule to avoid repeating it.

---

## Format

### [Phase X] — Short description
- **Date:** YYYY-MM-DD
- **Symptom:** What went wrong
- **Root Cause:** Why it happened
- **Fix:** What was done
- **Prevention Rule:** Rule to follow going forward

---

### [Phase 1] — Stripe API version mismatch
- **Date:** 2026-04-07
- **Symptom:** Hardcoded Stripe apiVersion did not match installed SDK default
- **Root Cause:** Used an outdated API version string instead of checking the SDK's default
- **Fix:** Checked SDK default via `new Stripe('fake')._api.version` → updated to `2026-03-25.dahlia`
- **Prevention Rule:** Always verify Stripe API version against the installed SDK before hardcoding

### [Phase 2] — Clerk v7 UserButton prop API change
- **Date:** 2026-04-07
- **Symptom:** Build failed — `afterSignOutUrl` prop does not exist on `UserButton`
- **Root Cause:** Clerk v7 moved `afterSignOutUrl` from component props to `ClerkProvider` props
- **Fix:** Removed prop from `UserButton`, added `afterSignOutUrl`, `signInUrl`, `signUpUrl` to `ClerkProvider`
- **Prevention Rule:** For Clerk v7+, configure redirect URLs on `ClerkProvider`, not individual components

### [Phase 2] — Next.js 15 upgrade required for Clerk
- **Date:** 2026-04-07
- **Symptom:** `npm install @clerk/nextjs` failed with peer dependency conflict (required Next.js 15+)
- **Root Cause:** Clerk v7 dropped Next.js 14 support
- **Fix:** Upgraded to Next.js 15 + React 19, updated `next.config.mjs` (`serverExternalPackages` replaces `experimental.serverComponentsExternalPackages`), made Supabase server client `async` (cookies() is now async in Next.js 15)
- **Prevention Rule:** Check peer dependency requirements before installing packages; Next.js 15 makes `cookies()` and `headers()` async

### [Phase 3] — Supabase v2.102 Database type requires Relationships field
- **Date:** 2026-04-07
- **Symptom:** Build failed — all Supabase `.insert()`, `.update()`, `.select()` resolved to `never` type
- **Root Cause:** `@supabase/supabase-js` v2.102 `GenericTable` type requires a `Relationships` array field on each table definition. Our `Database` type omitted it, causing the entire table type to fail the `extends GenericSchema` check.
- **Fix:** Added `Relationships: []` or `Relationships: [{...}]` to every table in `src/types/database.ts`
- **Prevention Rule:** When writing Database types for Supabase JS v2.100+, always include `Relationships` array on every table type

### [Phase 4] — Supabase JSONB insert type mismatch
- **Date:** 2026-04-07
- **Symptom:** Build failed — `Record<string, unknown>` not assignable to `Json | undefined` for `content_json` column
- **Root Cause:** Casting a Zod-parsed object via `as unknown as Record<string, unknown>` doesn't satisfy Supabase's `Json` type. The `Json` type is a union of primitives/arrays/objects, not `Record<string, unknown>`.
- **Fix:** Used `JSON.parse(JSON.stringify(invoiceData))` to produce a plain JSON-compatible value that TypeScript infers as `any`, satisfying the `Json` type
- **Prevention Rule:** For Supabase JSONB columns, serialize complex objects via `JSON.parse(JSON.stringify(obj))` instead of type assertions

### [Phase 4] — ESLint: no-html-link-for-pages in client component
- **Date:** 2026-04-07
- **Symptom:** Build failed — ESLint error for using `<a>` instead of `<Link>` from next/link
- **Root Cause:** Used a plain `<a>` tag for an internal route in a client component
- **Fix:** Replaced with `<Link>` from `next/link`
- **Prevention Rule:** Always use `<Link>` from `next/link` for internal navigation, even in client components

### [Phase 6] — @react-pdf/renderer renderToBuffer type mismatch
- **Date:** 2026-04-07
- **Symptom:** Build failed — `FunctionComponentElement<InvoicePdfProps>` not assignable to `ReactElement<DocumentProps>`
- **Root Cause:** `renderToBuffer` expects the top-level `<Document>` element directly. Wrapping the PDF component via `React.createElement(InvoicePdf, props)` returns a component element, not the `Document` element, causing a type mismatch.
- **Fix:** Used `as any` cast on the element passed to `renderToBuffer`. At runtime the component returns a `<Document>` which works correctly.
- **Prevention Rule:** When using `@react-pdf/renderer`'s `renderToBuffer` with wrapper components, expect a type mismatch — use `as any` or restructure to return Document directly

### [Phase 7] — Module-scope SDK initialization crashes build
- **Date:** 2026-04-07
- **Symptom:** Build failed with `Neither apiKey nor config.authenticator provided` during static page collection
- **Root Cause:** `new Stripe(process.env.STRIPE_SECRET_KEY!)` at module scope runs during build when env vars are undefined. Same risk applies to Anthropic and Resend clients.
- **Fix:** Converted all SDK clients (Stripe, Anthropic, Resend) to lazy-initialized singletons via getter functions (`getStripe()`, `getAnthropic()`, `getResend()`)
- **Prevention Rule:** NEVER initialize SDK clients at module scope with env vars. Always use lazy initialization via a getter function to defer until runtime.
