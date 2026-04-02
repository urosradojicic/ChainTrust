import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'ChainMetrics',
  projectId: 'chainmetrics-demo-project',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
  ssr: false,
});
