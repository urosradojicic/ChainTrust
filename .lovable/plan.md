

## Plan: Add Sepolia L1 Testnet Support

Add Ethereum Sepolia (chainId 11155111) alongside the existing Base Sepolia (chainId 84532) so the app supports both L1 and L2 testnets.

### Files Changed

| File | Change |
|------|--------|
| `src/lib/wagmi-config.ts` | Import `sepolia` from `wagmi/chains`, add it to `chains` array and `transports` with public RPC `https://rpc.sepolia.org` |
| `blockchain/hardhat.config.js` | Add `sepolia` network entry (chainId 11155111, RPC `https://rpc.sepolia.org`) |
| `blockchain/.env.example` | Add note about Sepolia RPC URL (optional Alchemy/Infura) |

### Result
Users can switch between Sepolia (L1) and Base Sepolia (L2) in the RainbowKit network selector. Contracts can also be deployed to Sepolia via Hardhat.

