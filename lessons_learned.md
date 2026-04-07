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
