

## Plan: Wire Up Real Blockchain Calls for Startup Data Integrity

### What This Does

Replace the simulated blockchain flow with **actual smart contract calls** so that when startups publish or update metrics, the data is written to the `ChainMetricsRegistry` contract on Base Sepolia — making it tamper-proof and publicly verifiable.

### How It Works

Currently, saves go to Supabase with a fake tx hash. After this change:

1. Startup saves metrics → app calls `publishMetrics()` on the `ChainMetricsRegistry` contract via wagmi
2. The contract stores a **proof hash** (keccak256 of all metrics) on-chain
3. The **real transaction hash** is stored in the audit log (not a random one)
4. Investors can click "View on Base" and see the actual transaction on basescan

### Technical Details

**Files to modify:**

| File | Change |
|------|--------|
| `src/pages/MyStartup.tsx` | Replace `genTxHash()` with real `writeContract()` call to `publishMetrics`. Use wagmi's `useWriteContract` hook. After tx confirms, store the real tx hash in `startup_audit_log`. |
| `src/pages/Register.tsx` | On submit, call `registerStartup()` on the `ChainMetricsRegistry` contract before/after Supabase insert. Store the real tx hash. |
| `src/lib/contracts.ts` | Already has all ABIs and addresses — no changes needed. |
| `src/providers/Web3Provider.tsx` | Already configured for Base Sepolia — no changes needed. |

**Flow for MyStartup save:**

```text
User clicks "Save Changes"
  → Hash metrics: keccak256(abi.encode(mrr, users, growth, carbon, ...))
  → Call registry.publishMetrics(startupId, mrr, users, ..., proofHash)
  → Wait for tx confirmation on Base Sepolia
  → Get real tx hash from receipt
  → Update Supabase with new values
  → Insert audit log entries with real tx hash
  → Show "Confirmed on Base" with link to real basescan tx
```

**Flow for Register submit:**

```text
User clicks "Submit to Blockchain"
  → Call registry.registerStartup(name, category, metadataURI)
  → Wait for tx confirmation
  → Get real tx hash
  → Insert startup into Supabase with user_id
  → Show confirmation with real tx link
```

**Verification feature** — add to startup profile page:
- A "Verify On-Chain" button that reads `getLatestMetrics()` from the contract
- Compares the on-chain proof hash with a locally computed hash of the DB values
- Shows green checkmark if they match, red warning if they don't

### Requirements

- User must have a wallet connected (MetaMask etc. via RainbowKit) to write to chain
- The `ChainMetricsRegistry` contract must be deployed on Base Sepolia at the address in `contracts.ts`
- No gas costs on testnet (Base Sepolia has faucets)

### What Changes for Users

- **Startups**: must connect wallet before editing metrics (the "Save" button becomes "Save & Publish On-Chain")
- **Investors**: can verify any startup's data matches what's on-chain via the "Verify" button
- **Audit trail**: now shows real transaction hashes that link to actual basescan transactions

