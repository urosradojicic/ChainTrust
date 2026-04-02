/**
 * Contract addresses — REPLACE these with your deployed addresses after running:
 *   cd blockchain && npm run deploy
 * Current values are deployed on Sepolia testnet (chainId 11155111).
 */
export const CONTRACTS = {
  CMTToken: "0xe205B8b0D5FD8e2cEE828404e8513975b330af18",
  ChainMetricsRegistry: "0x52032A03429e520D155B38b841B66B4FBDa42d5b",
  StakingVault: "0x07fb62B0B8D5c673F5Ac33e4B3cfa7E0b8ef520B",
  VerificationBadge: "0xB57E78cfE87Fe4dc9Ed7F7ACDA9a54E71E65525E",
  TimelockController: "0xCdD2823C33A2EEE226d663332f5f6d99ECec4296",
  ChainMetricsDAO: "0x255B27a4009287Ec62f00d49915Fc7D2976742f4",
} as const;

export const CMT_TOKEN_ABI = [
  { type: "function", name: "name", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ name: "", type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ name: "", type: "uint8" }], stateMutability: "view" },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "burn",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "delegate",
    inputs: [{ name: "delegatee", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const REGISTRY_ABI = [
  {
    type: "function",
    name: "registerStartup",
    inputs: [
      { name: "name", type: "string" },
      { name: "category", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "publishMetrics",
    inputs: [
      { name: "startupId", type: "uint256" },
      { name: "mrr", type: "uint256" },
      { name: "totalUsers", type: "uint256" },
      { name: "activeUsers", type: "uint256" },
      { name: "burnRate", type: "uint256" },
      { name: "runway", type: "uint256" },
      { name: "growthRate", type: "int256" },
      { name: "carbonOffset", type: "uint256" },
      { name: "proofHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getStartup",
    inputs: [{ name: "startupId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "owner", type: "address" },
          { name: "name", type: "string" },
          { name: "category", type: "string" },
          { name: "metadataURI", type: "string" },
          { name: "registeredAt", type: "uint256" },
          { name: "isVerified", type: "bool" },
          { name: "verifiedAt", type: "uint256" },
          { name: "trustScore", type: "uint256" },
          { name: "totalReports", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestMetrics",
    inputs: [{ name: "startupId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "timestamp", type: "uint256" },
          { name: "mrr", type: "uint256" },
          { name: "totalUsers", type: "uint256" },
          { name: "activeUsers", type: "uint256" },
          { name: "burnRate", type: "uint256" },
          { name: "runway", type: "uint256" },
          { name: "growthRate", type: "int256" },
          { name: "carbonOffset", type: "uint256" },
          { name: "proofHash", type: "bytes32" },
          { name: "oracleVerified", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllStartupIds",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStartupCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const STAKING_ABI = [
  {
    type: "function",
    name: "stake",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstake",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "function", name: "claimRewards", inputs: [], outputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "getInvestorTier",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canAccessPremium",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalStakedAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalInvestors",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "investors",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [
      { name: "stakedAmount", type: "uint256" },
      { name: "stakedAt", type: "uint256" },
      { name: "lockUntil", type: "uint256" },
      { name: "tier", type: "uint8" },
      { name: "pendingRewards", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export const DAO_ABI = [
  {
    type: "function",
    name: "propose",
    inputs: [
      { name: "targets", type: "address[]" },
      { name: "values", type: "uint256[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "description", type: "string" },
    ],
    outputs: [{ name: "proposalId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "castVote",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "support", type: "uint8" },
    ],
    outputs: [{ name: "balance", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "state",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proposalVotes",
    inputs: [{ name: "proposalId", type: "uint256" }],
    outputs: [
      { name: "againstVotes", type: "uint256" },
      { name: "forVotes", type: "uint256" },
      { name: "abstainVotes", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasVoted",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;

export const BADGE_ABI = [
  {
    type: "function",
    name: "mintBadge",
    inputs: [
      { name: "to", type: "address" },
      { name: "startupId", type: "uint256" },
      { name: "trustScore", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "locked",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "badges",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "startupId", type: "uint256" },
      { name: "trustScore", type: "uint256" },
      { name: "verifiedAt", type: "uint256" },
      { name: "verifier", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "startupToBadge",
    inputs: [{ name: "startupId", type: "uint256" }],
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
