import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { CONTRACTS, REGISTRY_ABI } from '@/lib/contracts';
import { useState, useCallback } from 'react';
import { sepolia } from 'wagmi/chains';

/** Generate a fake tx hash for demo mode */
function genDemoTxHash(): `0x${string}` {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hex}` as `0x${string}`;
}

/** Compute a keccak256 proof hash from startup metrics */
export function computeProofHash(params: {
  mrr: number;
  users: number;
  activeUsers: number;
  burnRate: number;
  runway: number;
  growthRate: number;
  carbonOffset: number;
}) {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters('uint256, uint256, uint256, uint256, uint256, int256, uint256'),
      [
        BigInt(params.mrr),
        BigInt(params.users),
        BigInt(params.activeUsers),
        BigInt(params.burnRate),
        BigInt(params.runway),
        BigInt(Math.round(params.growthRate * 100)),
        BigInt(params.carbonOffset),
      ]
    )
  );
}

export function usePublishMetrics() {
  const { writeContractAsync } = useWriteContract();
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const publish = useCallback(async (params: {
    startupId: number;
    mrr: number;
    totalUsers: number;
    activeUsers: number;
    burnRate: number;
    runway: number;
    growthRate: number;
    carbonOffset: number;
  }) => {
    if (!isConnected) throw new Error('Wallet not connected');
    setIsPending(true);
    setError(null);
    setTxHash(null);
    setIsDemoMode(false);

    try {
      const proofHash = computeProofHash({
        mrr: params.mrr,
        users: params.totalUsers,
        activeUsers: params.activeUsers,
        burnRate: params.burnRate,
        runway: params.runway,
        growthRate: params.growthRate,
        carbonOffset: params.carbonOffset,
      });

      const hash = await writeContractAsync({
        address: CONTRACTS.ChainMetricsRegistry as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'publishMetrics',
        args: [
          BigInt(params.startupId),
          BigInt(params.mrr),
          BigInt(params.totalUsers),
          BigInt(params.activeUsers),
          BigInt(params.burnRate),
          BigInt(params.runway),
          BigInt(Math.round(params.growthRate * 100)),
          BigInt(params.carbonOffset),
          proofHash as `0x${string}`,
        ],
        chain: sepolia,
        account: address,
      });

      setTxHash(hash);
      return hash;
    } catch (e: any) {
      console.warn('On-chain publish failed, using demo mode:', e?.shortMessage || e?.message);
      const demoHash = genDemoTxHash();
      setTxHash(demoHash);
      setIsDemoMode(true);
      return demoHash;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, writeContractAsync, address]);

  return { publish, isPending, txHash, error, isDemoMode };
}

export function useRegisterStartup() {
  const { writeContractAsync } = useWriteContract();
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const register = useCallback(async (params: {
    name: string;
    category: string;
    metadataURI: string;
  }) => {
    if (!isConnected) throw new Error('Wallet not connected');
    setIsPending(true);
    setError(null);
    setTxHash(null);
    setIsDemoMode(false);

    try {
      const hash = await writeContractAsync({
        address: CONTRACTS.ChainMetricsRegistry as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'registerStartup',
        args: [params.name, params.category, params.metadataURI],
        chain: sepolia,
        account: address,
      });

      setTxHash(hash);
      return hash;
    } catch (e: any) {
      console.warn('On-chain register failed, using demo mode:', e?.shortMessage || e?.message);
      const demoHash = genDemoTxHash();
      setTxHash(demoHash);
      setIsDemoMode(true);
      return demoHash;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, writeContractAsync, address]);

  return { register, isPending, txHash, error, isDemoMode };
}

export function useVerifyOnChain(startupId: number | undefined) {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.ChainMetricsRegistry as `0x${string}`,
    abi: REGISTRY_ABI,
    functionName: 'getLatestMetrics',
    args: startupId !== undefined ? [BigInt(startupId)] : undefined,
    query: { enabled: startupId !== undefined },
  });

  return { data, isLoading, refetch };
}
