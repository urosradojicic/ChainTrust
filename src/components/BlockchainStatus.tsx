import { useReadContract } from 'wagmi';
import { CONTRACTS, REGISTRY_ABI } from '@/lib/contracts';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BlockchainStatus() {
  const { data, isError, isLoading } = useReadContract({
    address: CONTRACTS.ChainMetricsRegistry as `0x${string}`,
    abi: REGISTRY_ABI,
    functionName: 'getStartupCount',
  });

  const isDemo = isError || (!isLoading && data === undefined);

  if (isLoading || !isDemo) return null;

  return (
    <div className="mx-auto mb-4 flex max-w-5xl items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
      <span className="text-muted-foreground">
        <span className="font-medium text-foreground">Demo mode</span> — Contracts not yet deployed on Base Sepolia. On-chain calls will use simulated tx hashes.
      </span>
    </div>
  );
}
