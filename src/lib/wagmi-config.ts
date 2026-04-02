import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'ChainMetrics',
  projectId: 'chainmetrics-demo-project',
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: false,
});
