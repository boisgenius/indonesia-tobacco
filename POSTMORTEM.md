# Postmortem — Subscriber emails silently not saved

**Date:** 2026-07-10
**Component:** `/api/subscribe` (Next.js App Router) + Vercel KV (Upstash for Redis)
**Severity:** Data loss — new mailing-list signups were not stored for an extended period.

---

## Summary

Visitors who subscribed on `indonesiatobacco.com` saw a "Thank you" success
message, but their email addresses were **not being written to the database**.
The subscribe endpoint reported success even though storage was completely
unavailable.

Root cause was a combination of three independent problems that hid each other:

1. **The KV database was deleted.** The Upstash instance the site pointed to
   (`free-snipe-60921.upstash.io`) no longer existed — its DNS did not even
   resolve. The project's `KV_REST_API_URL` / `KV_REST_API_TOKEN` env vars were
   still present but pointed at a dead host.
2. **The API faked success.** `app/api/subscribe/route.js` wrapped all storage
   in a `try/catch` and, on failure *or* missing config, still returned
   `{ success: true }`. So the front end (which only checks `res.ok`) showed the
   success state and nothing looked broken from the outside.
3. **Debugging targeted the wrong Vercel account.** The public site is deployed
   under the **`boisgenius@gmail.com`** account / **"A Bu's projects"** team.
   A same-named project also exists under a **different** account
   (`turboaitech@gmail.com` / "Turbo AI's projects"), and the local
   `~/indonesia-tobacco/.vercel` link pointed there. Early fixes were deployed to
   the wrong project's `*.vercel.app` URL and never reached the real domain.

## Impact

- New subscribers during the outage were **not persisted** and are not
  recoverable from KV (the database that would have held them was deleted).
- Partial recovery is possible: the subscribe route still sent a notification
  email to `NOTIFY_EMAIL` for each signup (that path is independent of KV), so
  those leads can be re-imported by searching the notification inbox for
  `New Subscriber`.

## How it was diagnosed

1. Read the live public endpoint `GET /api/subscribe` → `storageAvailable: false`.
2. Listed production env vars → the KV vars existed, so it wasn't a "missing
   config" problem at the settings level.
3. Pulled the decrypted `KV_REST_API_URL`/`TOKEN` and hit the Upstash REST API
   directly → `HTTP 000`, host did not resolve → **database confirmed deleted**.
4. Discovered the real hosting account by inspecting the git remote
   (`github.com/boisgenius/...`) and Vercel team membership; the local `.vercel`
   link was pointing at the wrong project.

## Resolution

1. Re-linked the local repo to the correct project (`a-bus-projects/indonesia-tobacco`).
2. Removed the 5 stale KV env vars pointing at the dead database.
3. Connected a new Upstash store (`indonesia-tobacco-kv` →
   `bursting-prawn-162548.upstash.io`) to the project with the **`KV`** prefix so
   the injected vars match what the code reads.
4. Fixed the fake-success bug (see below) and deployed to production.
5. Verified end-to-end on `indonesiatobacco.com`: `storageAvailable: true`, a test
   subscribe wrote and read back correctly, then removed the test record.

## The code fix

`app/api/subscribe/route.js` now:

- Tracks a `stored` flag that is only true when the write to KV actually succeeds.
- Returns **HTTP 503** with an error message when the email was not persisted,
  instead of a fake `{ success: true }`. The front end already surfaces
  `data.error`, so users now see a real "try again" message.
- Logs `KV not configured` when the env vars are missing at runtime.
- Marks the notification email (`⚠️ ... NOT STORED — DB down`) so any signups that
  arrive while storage is down are obvious in the inbox and can be re-imported.

## Lessons / follow-ups

- **Never return success for a write you didn't perform.** A degraded path that
  reports success turns an outage into silent data loss.
- **Env var present ≠ backing resource alive.** Free Upstash/KV databases can be
  deleted for inactivity while the connection vars linger. Consider a health
  check or an uptime ping on the KV endpoint.
- **Confirm which account/project owns the live domain before deploying.** The
  local `.vercel` link can point at a same-named project in a different account.
- **Recover the missed leads** from the `NOTIFY_EMAIL` inbox (search
  `New Subscriber`) and re-add them to the new database.
- **Git auto-deploy is on** for `main` — keep this fix in the repo so a future
  git-triggered build does not reintroduce the fake-success behavior.
