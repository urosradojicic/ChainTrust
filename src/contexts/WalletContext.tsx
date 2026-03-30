import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string;
  balance: number;
  tier: 'Free' | 'Basic' | 'Pro' | 'Whale';
  stakedAmount: number;
  walletType: string | null;
  bookmarkedStartups: string[];
}

interface WalletContextType extends WalletState {
  connect: (walletType: string) => Promise<void>;
  disconnect: () => void;
  toggleBookmark: (startupId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const FAKE_ADDRESS = '0x7a3b8C91dE42f6A8b3c5D7e1F09a2B4c6d8E4f2e';

function getTier(staked: number): 'Free' | 'Basic' | 'Pro' | 'Whale' {
  if (staked >= 10000) return 'Whale';
  if (staked >= 1000) return 'Pro';
  if (staked >= 100) return 'Basic';
  return 'Free';
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    connecting: false,
    address: '',
    balance: 0,
    tier: 'Free',
    stakedAmount: 0,
    walletType: null,
    bookmarkedStartups: [],
  });

  const connect = useCallback(async (walletType: string) => {
    setState(s => ({ ...s, connecting: true, walletType }));
    await new Promise(r => setTimeout(r, 2000));
    const staked = 1250;
    setState({
      connected: true,
      connecting: false,
      address: FAKE_ADDRESS,
      balance: 2450,
      tier: getTier(staked),
      stakedAmount: staked,
      walletType,
      bookmarkedStartups: [],
    });
  }, []);

  const disconnect = useCallback(() => {
    setState({
      connected: false,
      connecting: false,
      address: '',
      balance: 0,
      tier: 'Free',
      stakedAmount: 0,
      walletType: null,
      bookmarkedStartups: [],
    });
  }, []);

  const toggleBookmark = useCallback((startupId: string) => {
    setState(s => ({
      ...s,
      bookmarkedStartups: s.bookmarkedStartups.includes(startupId)
        ? s.bookmarkedStartups.filter(id => id !== startupId)
        : [...s.bookmarkedStartups, startupId],
    }));
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, toggleBookmark }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be inside WalletProvider');
  return ctx;
}
