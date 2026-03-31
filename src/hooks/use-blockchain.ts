import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { encodePacked, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { CONTRACTS, REGISTRY_ABI } from '@/lib/contracts';
import { useState, useCallback } from 'react';
import { baseSepolia } from 'wagmi/chains';

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
        chain: baseSepolia,
      });

      setTxHash(hash);
      return hash;
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || 'Transaction failed';
      setError(msg);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, writeContractAsync]);

  return { publish, isPending, txHash, error };
}

export function useRegisterStartup() {
  const { writeContractAsync } = useWriteContract();
  const { isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (params: {
    name: string;
    category: string;
    metadataURI: string;
  }) => {
    if (!isConnected) throw new Error('Wallet not connected');
    setIsPending(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await writeContractAsync({
        address: CONTRACTS.ChainMetricsRegistry as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'registerStartup',
        args: [params.name, params.category, params.metadataURI],
        chain: baseSepolia,
      });

      setTxHash(hash);
      return hash;
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || 'Transaction failed';
      setError(msg);
      throw e;
    } finally {
      setIsPending(false);
    }
  }, [isConnected, writeContractAsync]);

  return { register, isPending, txHash, error };
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
