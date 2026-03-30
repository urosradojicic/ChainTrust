import type { SustainabilityData } from '@/components/SustainabilityScore';

export interface StartupData {
  id: string;
  name: string;
  category: string;
  verified: boolean;
  trustScore: number;
  mrr: number;
  users: number;
  growth: number;
  mrrHistory: number[];
  description: string;
  website: string;
  registeredAt: number;
  owner: string;
  burnRate: number;
  runway: number;
  carbonOffset: number;
  revenueHistory: { month: string; value: number }[];
  userHistory: { month: string; value: number }[];
  carbonHistory: { month: string; value: number }[];
  metricsHistory: {
    date: string;
    mrr: number;
    users: number;
    growth: number;
    verified: boolean;
  }[];
  txHash: string;
  blockNumber: number;
  sustainability: SustainabilityData;
}

export const STARTUPS: StartupData[] = [
  {
    id: 'payflow',
    name: 'PayFlow',
    category: 'Fintech',
    verified: true,
    trustScore: 92,
    mrr: 125000,
    users: 15000,
    growth: 12.5,
    mrrHistory: [78000, 85000, 92000, 101000, 112000, 125000],
    description: 'Next-generation payment infrastructure for Web3 businesses. Seamless fiat on/off ramps with instant settlement.',
    website: 'https://payflow.example.com',
    registeredAt: 1695830400,
    owner: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    burnRate: 45000,
    runway: 18,
    carbonOffset: 34,
    revenueHistory: [
      { month: 'Oct', value: 78000 }, { month: 'Nov', value: 85000 }, { month: 'Dec', value: 92000 },
      { month: 'Jan', value: 101000 }, { month: 'Feb', value: 112000 }, { month: 'Mar', value: 125000 },
    ],
    userHistory: [
      { month: 'Oct', value: 9200 }, { month: 'Nov', value: 10500 }, { month: 'Dec', value: 11800 },
      { month: 'Jan', value: 12900 }, { month: 'Feb', value: 14100 }, { month: 'Mar', value: 15000 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 12 }, { month: 'Nov', value: 15 }, { month: 'Dec', value: 18 },
      { month: 'Jan', value: 22 }, { month: 'Feb', value: 28 }, { month: 'Mar', value: 34 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 78000, users: 9200, growth: 8.2, verified: true },
      { date: '2025-11-01', mrr: 85000, users: 10500, growth: 9.0, verified: true },
      { date: '2025-12-01', mrr: 92000, users: 11800, growth: 8.2, verified: true },
      { date: '2026-01-01', mrr: 101000, users: 12900, growth: 9.8, verified: true },
      { date: '2026-02-01', mrr: 112000, users: 14100, growth: 10.9, verified: true },
      { date: '2026-03-01', mrr: 125000, users: 15000, growth: 12.5, verified: true },
    ],
    txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    blockNumber: 14523891,
    sustainability: {
      overall: 82,
      energyEfficiency: { score: 23, chain: 'Base (PoS)', energyPerTx: '0.001 kWh' },
      carbonOffset: { score: 20, purchased: true, tons: 34 },
      tokenomicsHealth: { score: 21, concentration: 'Low', inflation: '2%', vesting: '4yr linear' },
      governancePledges: { score: 18, pledgesCount: 4, pledges: ['Net Zero 2027', 'Green Hosting', 'Carbon Reporting', 'Fair Token Distribution'] },
    },
  },
  {
    id: 'cloudmetrics',
    name: 'CloudMetrics',
    category: 'SaaS',
    verified: true,
    trustScore: 87,
    mrr: 89000,
    users: 8200,
    growth: 8.3,
    mrrHistory: [62000, 68000, 72000, 78000, 82000, 89000],
    description: 'Cloud infrastructure monitoring with AI-powered anomaly detection and cost optimization.',
    website: 'https://cloudmetrics.example.com',
    registeredAt: 1696435200,
    owner: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
    burnRate: 35000,
    runway: 24,
    carbonOffset: 16,
    revenueHistory: [
      { month: 'Oct', value: 62000 }, { month: 'Nov', value: 68000 }, { month: 'Dec', value: 72000 },
      { month: 'Jan', value: 78000 }, { month: 'Feb', value: 82000 }, { month: 'Mar', value: 89000 },
    ],
    userHistory: [
      { month: 'Oct', value: 5800 }, { month: 'Nov', value: 6200 }, { month: 'Dec', value: 6700 },
      { month: 'Jan', value: 7200 }, { month: 'Feb', value: 7700 }, { month: 'Mar', value: 8200 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 5 }, { month: 'Nov', value: 7 }, { month: 'Dec', value: 9 },
      { month: 'Jan', value: 11 }, { month: 'Feb', value: 14 }, { month: 'Mar', value: 16 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 62000, users: 5800, growth: 6.1, verified: true },
      { date: '2025-11-01', mrr: 68000, users: 6200, growth: 9.7, verified: true },
      { date: '2025-12-01', mrr: 72000, users: 6700, growth: 5.9, verified: true },
      { date: '2026-01-01', mrr: 78000, users: 7200, growth: 8.3, verified: true },
      { date: '2026-02-01', mrr: 82000, users: 7700, growth: 5.1, verified: true },
      { date: '2026-03-01', mrr: 89000, users: 8200, growth: 8.3, verified: true },
    ],
    txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    blockNumber: 14523950,
  },
  {
    id: 'defiyield',
    name: 'DeFiYield',
    category: 'DeFi',
    verified: true,
    trustScore: 78,
    mrr: 210000,
    users: 5100,
    growth: 22.1,
    mrrHistory: [95000, 120000, 140000, 165000, 185000, 210000],
    description: 'Automated yield optimization across DeFi protocols with risk-adjusted strategies.',
    website: 'https://defiyield.example.com',
    registeredAt: 1697040000,
    owner: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
    burnRate: 80000,
    runway: 12,
    carbonOffset: 8,
    revenueHistory: [
      { month: 'Oct', value: 95000 }, { month: 'Nov', value: 120000 }, { month: 'Dec', value: 140000 },
      { month: 'Jan', value: 165000 }, { month: 'Feb', value: 185000 }, { month: 'Mar', value: 210000 },
    ],
    userHistory: [
      { month: 'Oct', value: 2100 }, { month: 'Nov', value: 2800 }, { month: 'Dec', value: 3300 },
      { month: 'Jan', value: 3900 }, { month: 'Feb', value: 4500 }, { month: 'Mar', value: 5100 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 2 }, { month: 'Nov', value: 3 }, { month: 'Dec', value: 4 },
      { month: 'Jan', value: 5 }, { month: 'Feb', value: 6 }, { month: 'Mar', value: 8 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 95000, users: 2100, growth: 15.2, verified: true },
      { date: '2025-11-01', mrr: 120000, users: 2800, growth: 26.3, verified: true },
      { date: '2025-12-01', mrr: 140000, users: 3300, growth: 16.7, verified: true },
      { date: '2026-01-01', mrr: 165000, users: 3900, growth: 17.9, verified: true },
      { date: '2026-02-01', mrr: 185000, users: 4500, growth: 12.1, verified: true },
      { date: '2026-03-01', mrr: 210000, users: 5100, growth: 22.1, verified: true },
    ],
    txHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    blockNumber: 14524100,
  },
  {
    id: 'greenchain',
    name: 'GreenChain',
    category: 'Cleantech',
    verified: true,
    trustScore: 95,
    mrr: 45000,
    users: 3200,
    growth: 15.7,
    mrrHistory: [22000, 27000, 31000, 36000, 40000, 45000],
    description: 'Blockchain-verified carbon credit marketplace connecting offset projects with enterprises.',
    website: 'https://greenchain.example.com',
    registeredAt: 1697644800,
    owner: '0x4d5e6f7890abcdef1234567890abcdef12345678',
    burnRate: 20000,
    runway: 36,
    carbonOffset: 480,
    revenueHistory: [
      { month: 'Oct', value: 22000 }, { month: 'Nov', value: 27000 }, { month: 'Dec', value: 31000 },
      { month: 'Jan', value: 36000 }, { month: 'Feb', value: 40000 }, { month: 'Mar', value: 45000 },
    ],
    userHistory: [
      { month: 'Oct', value: 1400 }, { month: 'Nov', value: 1800 }, { month: 'Dec', value: 2100 },
      { month: 'Jan', value: 2500 }, { month: 'Feb', value: 2900 }, { month: 'Mar', value: 3200 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 120 }, { month: 'Nov', value: 185 }, { month: 'Dec', value: 245 },
      { month: 'Jan', value: 310 }, { month: 'Feb', value: 390 }, { month: 'Mar', value: 480 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 22000, users: 1400, growth: 10.0, verified: true },
      { date: '2025-11-01', mrr: 27000, users: 1800, growth: 22.7, verified: true },
      { date: '2025-12-01', mrr: 31000, users: 2100, growth: 14.8, verified: true },
      { date: '2026-01-01', mrr: 36000, users: 2500, growth: 16.1, verified: true },
      { date: '2026-02-01', mrr: 40000, users: 2900, growth: 11.1, verified: true },
      { date: '2026-03-01', mrr: 45000, users: 3200, growth: 15.7, verified: true },
    ],
    txHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    blockNumber: 14524200,
  },
  {
    id: 'datavault',
    name: 'DataVault',
    category: 'SaaS',
    verified: false,
    trustScore: 65,
    mrr: 67000,
    users: 12000,
    growth: 5.2,
    mrrHistory: [52000, 55000, 58000, 61000, 64000, 67000],
    description: 'Encrypted data storage and sharing platform with zero-knowledge proof verification.',
    website: 'https://datavault.example.com',
    registeredAt: 1698249600,
    owner: '0x5e6f7890abcdef1234567890abcdef1234567890',
    burnRate: 55000,
    runway: 8,
    carbonOffset: 13,
    revenueHistory: [
      { month: 'Oct', value: 52000 }, { month: 'Nov', value: 55000 }, { month: 'Dec', value: 58000 },
      { month: 'Jan', value: 61000 }, { month: 'Feb', value: 64000 }, { month: 'Mar', value: 67000 },
    ],
    userHistory: [
      { month: 'Oct', value: 9500 }, { month: 'Nov', value: 10100 }, { month: 'Dec', value: 10600 },
      { month: 'Jan', value: 11000 }, { month: 'Feb', value: 11500 }, { month: 'Mar', value: 12000 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 8 }, { month: 'Nov', value: 9 }, { month: 'Dec', value: 10 },
      { month: 'Jan', value: 11 }, { month: 'Feb', value: 12 }, { month: 'Mar', value: 13 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 52000, users: 9500, growth: 4.0, verified: false },
      { date: '2025-11-01', mrr: 55000, users: 10100, growth: 5.8, verified: false },
      { date: '2025-12-01', mrr: 58000, users: 10600, growth: 5.5, verified: false },
      { date: '2026-01-01', mrr: 61000, users: 11000, growth: 5.2, verified: false },
      { date: '2026-02-01', mrr: 64000, users: 11500, growth: 4.9, verified: false },
      { date: '2026-03-01', mrr: 67000, users: 12000, growth: 5.2, verified: false },
    ],
    txHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    blockNumber: 14524350,
  },
  {
    id: 'tokenbridge',
    name: 'TokenBridge',
    category: 'DeFi',
    verified: false,
    trustScore: 43,
    mrr: 156000,
    users: 9800,
    growth: -3.4,
    mrrHistory: [180000, 175000, 170000, 165000, 160000, 156000],
    description: 'Cross-chain bridge protocol enabling seamless token transfers between L1 and L2 networks.',
    website: 'https://tokenbridge.example.com',
    registeredAt: 1698854400,
    owner: '0x6f7890abcdef1234567890abcdef123456789012',
    burnRate: 120000,
    runway: 6,
    carbonOffset: 5,
    revenueHistory: [
      { month: 'Oct', value: 180000 }, { month: 'Nov', value: 175000 }, { month: 'Dec', value: 170000 },
      { month: 'Jan', value: 165000 }, { month: 'Feb', value: 160000 }, { month: 'Mar', value: 156000 },
    ],
    userHistory: [
      { month: 'Oct', value: 11200 }, { month: 'Nov', value: 10900 }, { month: 'Dec', value: 10600 },
      { month: 'Jan', value: 10300 }, { month: 'Feb', value: 10000 }, { month: 'Mar', value: 9800 },
    ],
    carbonHistory: [
      { month: 'Oct', value: 3 }, { month: 'Nov', value: 3 }, { month: 'Dec', value: 4 },
      { month: 'Jan', value: 4 }, { month: 'Feb', value: 5 }, { month: 'Mar', value: 5 },
    ],
    metricsHistory: [
      { date: '2025-10-01', mrr: 180000, users: 11200, growth: -1.5, verified: false },
      { date: '2025-11-01', mrr: 175000, users: 10900, growth: -2.8, verified: false },
      { date: '2025-12-01', mrr: 170000, users: 10600, growth: -2.9, verified: false },
      { date: '2026-01-01', mrr: 165000, users: 10300, growth: -2.9, verified: false },
      { date: '2026-02-01', mrr: 160000, users: 10000, growth: -3.0, verified: false },
      { date: '2026-03-01', mrr: 156000, users: 9800, growth: -3.4, verified: false },
    ],
    txHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    blockNumber: 14524500,
  },
];

export const ACTIVITY_FEED = [
  { text: 'PayFlow published monthly metrics', color: 'bg-blue-500', time: '5 min ago' },
  { text: 'DeFiYield verified by Chainlink oracle', color: 'bg-emerald-500', time: '12 min ago' },
  { text: 'New startup GreenChain registered', color: 'bg-primary', time: '1 hr ago' },
  { text: 'CloudMetrics earned Gold Badge', color: 'bg-amber-500', time: '2 hrs ago' },
  { text: 'TokenBridge trust score updated', color: 'bg-orange-500', time: '3 hrs ago' },
  { text: 'DataVault connected Stripe API', color: 'bg-cyan-500', time: '5 hrs ago' },
];

export const PROPOSALS = [
  { id: 1, title: 'Increase verification fee to 500 CMT', description: 'Proposal to raise the oracle verification fee from 100 CMT to 500 CMT to ensure higher quality submissions.', status: 'Active' as const, forVotes: 325000, againstVotes: 175000, abstainVotes: 50000, endDate: '2026-04-05', proposer: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12' },
  { id: 2, title: 'Add NFT marketplace category', description: 'Introduce a new NFT Marketplace category to attract web3-native startups building NFT infrastructure.', status: 'Active' as const, forVotes: 492000, againstVotes: 108000, abstainVotes: 30000, endDate: '2026-04-03', proposer: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234' },
  { id: 3, title: 'Fund ecosystem grants - 50K CMT', description: 'Allocate 50,000 CMT from treasury to fund ecosystem grants for builders integrating with ChainMetrics.', status: 'Active' as const, forVotes: 225000, againstVotes: 275000, abstainVotes: 100000, endDate: '2026-04-07', proposer: '0x3c4d5e6f7890abcdef1234567890abcdef123456' },
  { id: 4, title: 'Reduce quorum to 3%', description: 'Lower the governance quorum from 4% to 3% to enable faster decision-making.', status: 'Passed' as const, forVotes: 546000, againstVotes: 54000, abstainVotes: 20000, endDate: '2026-03-15', proposer: '0x4d5e6f7890abcdef1234567890abcdef12345678' },
  { id: 5, title: 'Add burn mechanism to staking rewards', description: 'Implement a 2% burn on staking rewards to create deflationary pressure on CMT supply.', status: 'Passed' as const, forVotes: 438000, againstVotes: 162000, abstainVotes: 40000, endDate: '2026-03-10', proposer: '0x5e6f7890abcdef1234567890abcdef1234567890' },
  { id: 6, title: 'Remove Cleantech category', description: 'Proposal to remove the Cleantech category due to low adoption and merge into a broader "Impact" category.', status: 'Defeated' as const, forVotes: 115000, againstVotes: 385000, abstainVotes: 60000, endDate: '2026-03-08', proposer: '0x6f7890abcdef1234567890abcdef123456789012' },
];

export const CATEGORIES = ['All', 'Fintech', 'SaaS', 'DeFi', 'Cleantech'];

export const TIERS = [
  { name: 'Free', minStake: 0, color: '#9CA3AF', features: ['View public metrics', 'Basic dashboard'] },
  { name: 'Basic', minStake: 100, color: '#3B82F6', features: ['Historical data access', 'Category filters', 'Email alerts'] },
  { name: 'Pro', minStake: 1000, color: '#A855F7', features: ['Raw data & API', 'Advanced analytics', 'Priority support'] },
  { name: 'Whale', minStake: 10000, color: '#F59E0B', features: ['Everything in Pro', 'Real-time alerts', 'Direct startup chat', 'Governance boost'] },
];
