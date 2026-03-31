

## Plan: Write Solidity Contracts + Hardhat Deploy Setup + Graceful Fallback

### The Problem
The frontend calls smart contracts at addresses from `contracts.ts`, but those addresses are **local Hardhat defaults** -- no contracts are actually deployed on Base Sepolia. Every on-chain call will fail.

### What We'll Do

Two things in parallel:

**A) Create the full Solidity project** (contracts + Hardhat config + deploy script) so you can deploy to Base Sepolia for free from your laptop.

**B) Add a graceful fallback** in the frontend so the app works in demo mode when contracts aren't deployed yet, with a banner indicating "Testnet mode - contracts pending deployment."

---

### Part A: Solidity Contracts + Deployment

Create a `blockchain/` folder in the project root with:

| File | Purpose |
|------|---------|
| `blockchain/contracts/CMTToken.sol` | ERC20 + ERC20Votes governance token. Matches `CMT_TOKEN_ABI` (mint, burn, delegate). |
| `blockchain/contracts/ChainMetricsRegistry.sol` | Core contract. `registerStartup()`, `publishMetrics()`, `getLatestMetrics()`, `getStartup()`, `getAllStartupIds()`. Stores proof hashes on-chain. |
| `blockchain/contracts/StakingVault.sol` | Stake CMT, tier system (Basic/Pro/Whale), rewards. Matches `STAKING_ABI`. |
| `blockchain/contracts/VerificationBadge.sol` | Soulbound NFT (ERC721 + locked). `mintBadge()`, stores trust scores. Matches `BADGE_ABI`. |
| `blockchain/contracts/ChainMetricsDAO.sol` | OpenZeppelin Governor wrapper. `propose()`, `castVote()`, `state()`. Matches `DAO_ABI`. |
| `blockchain/hardhat.config.js` | Hardhat config targeting Base Sepolia (chainId 84532), using `dotenv` for private key. |
| `blockchain/scripts/deploy.js` | Deploys all 5 contracts in order, prints addresses. |
| `blockchain/package.json` | Dependencies: hardhat, @openzeppelin/contracts, dotenv. |
| `blockchain/.env.example` | Template: `PRIVATE_KEY=your_wallet_private_key_here` |
| `blockchain/README.md` | Step-by-step instructions to deploy (5 commands). |

**Deploy instructions** (what the README will say):
```text
1. cd blockchain
2. npm install
3. Copy .env.example to .env, paste your wallet private key
4. Get free Base Sepolia ETH from https://www.alchemy.com/faucets/base-sepolia
5. npx hardhat run scripts/deploy.js --network baseSepolia
6. Copy the printed addresses into src/lib/contracts.ts
```

Total cost: $0. Base Sepolia ETH is free from faucets.

### Part B: Frontend Fallback Mode

Modify `src/hooks/use-blockchain.ts` and the pages that call it:

- Wrap every `writeContractAsync` call in a try/catch
- If the call fails (contract not deployed), fall back to generating a simulated tx hash and show a toast: "Contract not deployed -- using demo mode"
- Add a small banner component that checks if the registry contract is reachable (call `getStartupCount()`) and if not, shows "Demo mode -- contracts not yet deployed on Base Sepolia"
- This means the app **never breaks** regardless of whether contracts are deployed

### Part C: Update `contracts.ts` Comment

Add a comment at the top of `contracts.ts` explaining these are placeholder addresses and should be replaced after deployment.

---

### Files Modified/Created Summary

| Location | Action |
|----------|--------|
| `blockchain/` (6+ new files) | Solidity contracts, Hardhat config, deploy script |
| `src/hooks/use-blockchain.ts` | Add try/catch fallback to demo mode |
| `src/pages/MyStartup.tsx` | Graceful handling when contract calls fail |
| `src/pages/Register.tsx` | Same fallback |
| `src/lib/contracts.ts` | Add instructional comment |
| `src/components/BlockchainStatus.tsx` | New banner component showing contract deployment status |

### End Result
- App works perfectly in demo mode right now (no breaking)
- When you run the 5 deploy commands from your laptop, paste the new addresses, and the app switches to real on-chain mode automatically
- Zero cost on testnet

