

## Plan: Startup Self-Service Dashboard with Blockchain Audit Trail

### What We're Building

A `/my-startup` page where startup-role users can view and edit their startup's data, submit monthly metrics, and see a full audit history of all changes — all tracked on-chain (simulated) and stored in the database.

### Database Changes

1. **Add `user_id` column to `startups` table**
   - UUID, nullable (so existing seed data isn't broken), references `auth.users(id)`
   - New RLS policies: startup-role users can UPDATE their own row (`auth.uid() = user_id`)
   - New INSERT policy: startup-role users can insert with their own `user_id`

2. **Create `startup_audit_log` table**
   - Columns: `id`, `startup_id`, `user_id`, `field_changed`, `old_value`, `new_value`, `tx_hash` (simulated blockchain hash), `changed_at`
   - Public read access (transparency), authenticated insert for startup owners
   - This is the "blockchain ledger" — every edit creates an immutable log entry with a fake tx hash

3. **Update `metrics_history` table**
   - Add RLS policy: startup-role users can INSERT metrics for their own startup (via `user_id` on `startups`)

4. **Update `/register` page** to save `user_id: auth.uid()` when inserting the startup

### New Page: `/my-startup`

Visible in nav only for `startup` role users. Contains:

- **Header**: startup name, verified badge, last edit timestamp
- **Editable Profile Section**: name, description, category, blockchain, website, team size
- **Editable Metrics Section**: MRR, users, growth rate, treasury, carbon offsets, energy per tx, token concentration
- **Monthly Metrics Submission**: form to add a new month of data (revenue, costs, MAU, carbon offsets) — appends to `metrics_history`
- **Sustainability Pledges**: toggle pledges on/off, add custom pledges
- **Audit Log / Change History**: table showing all past edits with:
  - Field changed, old value, new value
  - Simulated tx hash (links to basescan.org)
  - Timestamp
  - "Verified on-chain" badge

### How "Blockchain Tracking" Works

Every time a startup saves changes:
1. Compare old values vs new values
2. For each changed field, insert a row in `startup_audit_log` with a simulated tx hash
3. Show a "Transaction confirmed on Base" animation (like the register page does)
4. The audit log is publicly readable — investors can see every change on the startup profile page too

### Startup Profile Page Update

Add an "Audit Trail" tab to `/startup/:id` showing the public changelog — so investors see when MRR was updated, by whom, and the "on-chain proof."

### Navigation & Access

- Startup role: sees "My Startup" in nav
- If no startup linked yet, redirect to `/register`
- Investor/admin: don't see "My Startup" but can view audit trails on any startup profile

### Files to Create/Modify

| File | Change |
|------|--------|
| Migration SQL | Add `user_id` to startups, create `startup_audit_log`, RLS policies |
| `src/pages/MyStartup.tsx` | New page with edit forms, metrics submission, audit log |
| `src/pages/Register.tsx` | Add `user_id` on insert |
| `src/pages/StartupDetail.tsx` | Add "Audit Trail" tab |
| `src/hooks/use-startups.ts` | Add hooks for audit log, startup by user_id |
| `src/components/layout/Navbar.tsx` | Add "My Startup" link for startup role |
| `src/App.tsx` | Add `/my-startup` route |

