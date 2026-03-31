# ChainMetrics Smart Contracts

Solidity contracts for the ChainMetrics platform, targeting **Base Sepolia** testnet.

## Contracts

| Contract | Purpose |
|----------|---------|
| `CMTToken` | ERC20 governance token with voting (ERC20Votes) |
| `ChainMetricsRegistry` | Core registry — startups register and publish metrics with proof hashes |
| `StakingVault` | Stake CMT tokens, earn tier status (Basic/Pro/Whale) |
| `VerificationBadge` | Soulbound NFT badges for verified startups |
| `ChainMetricsDAO` | OpenZeppelin Governor for on-chain governance |

## Deploy (Free — Testnet)

```bash
# 1. Install dependencies
cd blockchain
npm install

# 2. Create .env with your wallet private key
cp .env.example .env
# Edit .env and paste your private key

# 3. Get free Base Sepolia ETH
# Visit: https://www.alchemy.com/faucets/base-sepolia
# Or:    https://faucet.quicknode.com/base/sepolia

# 4. Compile contracts
npm run compile

# 5. Deploy to Base Sepolia
npm run deploy

# 6. Copy the printed addresses into src/lib/contracts.ts
```

## How It Works

1. **Startup registers** → calls `registerStartup(name, category, metadataURI)` → stored on-chain
2. **Startup publishes metrics** → calls `publishMetrics(id, mrr, users, ...)` with a `proofHash`
3. **Anyone can verify** → call `getLatestMetrics(id)` and compare the `proofHash` against locally computed hash
4. **Proof hash** = `keccak256(abi.encode(mrr, users, activeUsers, burnRate, runway, growthRate, carbonOffset))`
5. If the hash matches, the data hasn't been tampered with since it was published on-chain

## Cost

$0 — Base Sepolia is a testnet. ETH is free from faucets.
