

## Plan: Remove "Connect Wallet" Button from Navbar

### Change
**`src/components/layout/Navbar.tsx`**
- Remove the entire wallet button block (lines 126-149) from desktop nav
- Remove the wallet button from mobile menu (the similar block inside the mobile drawer)
- Remove the `<WalletConnectModal>` render and its state (`walletModalOpen`)
- Clean up unused imports: `Wallet` icon, `WalletConnectModal`, `useWallet` (if no longer used elsewhere in this file — but `connected`/`address`/`disconnect` are used in nav link logic, so keep `useWallet` but remove wallet UI only)

### Result
The "Connect Wallet" button disappears from the top-right corner. The rest of the nav (Sign In, theme toggle, nav links) stays intact.

---

## Hackathon Improvement Suggestions

Here are high-impact features judges typically love:

1. **Live On-Chain Activity Feed with Real Tx Links** — Show a real-time feed of actual Sepolia transactions (registrations, verifications, votes) with clickable Etherscan links. Judges love seeing *real blockchain activity*, not mock data.

2. **Interactive Demo Walkthrough (Guided Tour)** — Add a step-by-step guided overlay (like Shepherd.js or custom) that walks first-time users through the entire flow: register → verify → stake → vote. Makes the app instantly understandable in a 2-minute judge review.

3. **Dashboard Data Visualizations with Animated Charts** — Upgrade the dashboard with animated, interactive charts (token distribution, verification rate over time, staking TVL growth). Visual impact wins hackathons.

4. **Real-Time Notifications** — Toast notifications when new proposals are created, startups verified, or votes cast — using Supabase Realtime subscriptions. Shows technical depth.

5. **Export Startup Report as PDF** — Let investors generate a downloadable PDF report for any startup with verification status, risk score, sustainability metrics, and on-chain proof links. Practical utility judges appreciate.

