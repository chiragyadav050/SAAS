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
