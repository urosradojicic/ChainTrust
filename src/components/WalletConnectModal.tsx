import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

const WALLETS = [
  {
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  },
  {
    name: 'Coinbase Wallet',
    icon: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo-300x300.webp',
  },
  {
    name: 'WalletConnect',
    icon: 'https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png',
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WalletConnectModal({ open, onOpenChange }: Props) {
  const { connect, connecting, connected, address } = useWallet();
  const [picked, setPicked] = useState<string | null>(null);

  const handlePick = async (name: string) => {
    setPicked(name);
    await connect(name);
    // auto-close after brief success display
    setTimeout(() => {
      onOpenChange(false);
      setPicked(null);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            {connecting ? 'Connecting...' : connected && picked ? 'Connected!' : 'Connect Wallet'}
          </DialogTitle>
        </DialogHeader>

        {connecting ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Connecting to Sepolia network...</p>
          </div>
        ) : connected && picked ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="font-mono text-sm text-foreground">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <p className="text-xs text-muted-foreground">2,450 CMT</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-2">
            {WALLETS.map(w => (
              <button
                key={w.name}
                onClick={() => handlePick(w.name)}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition hover:bg-secondary"
              >
                <img src={w.icon} alt={w.name} className="h-8 w-8 rounded-lg object-contain" />
                <span className="text-sm font-medium text-foreground">{w.name}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
