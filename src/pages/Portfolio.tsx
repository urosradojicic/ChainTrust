import { useWallet } from '@/contexts/WalletContext';
import { useStartups } from '@/hooks/use-startups';
import { Navigate, Link } from 'react-router-dom';
import { Bookmark, Bell, TrendingDown, FileText, Shield, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

const TIER_COLORS: Record<string, string> = {
  Free: 'bg-muted text-muted-foreground',
  Basic: 'bg-blue-500/15 text-blue-400',
  Pro: 'bg-primary/15 text-primary',
  Whale: 'bg-amber-500/15 text-amber-400',
};

const ALERTS = [
  { icon: TrendingDown, text: 'DeFiYield sustainability score dropped below 80', time: '2h ago', color: 'text-destructive' },
  { icon: FileText, text: 'GreenChain published Q4 sustainability report', time: '5h ago', color: 'text-primary' },
  { icon: Shield, text: 'PayFlow committed to new carbon neutrality pledge', time: '1d ago', color: 'text-primary' },
  { icon: Bell, text: 'TokenBridge governance proposal #4 is ending soon', time: '1d ago', color: 'text-amber-400' },
];

export default function Portfolio() {
  const { connected, address, balance, tier, stakedAmount, bookmarkedStartups, toggleBookmark } = useWallet();
  const { data: startups } = useStartups();

  if (!connected) return <Navigate to="/dashboard" replace />;

  const bookmarked = startups?.filter(s => bookmarkedStartups.includes(s.id)) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">My Portfolio</h1>

      {/* Wallet overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wallet</p>
          <p className="mt-1 font-mono text-sm text-foreground">{address.slice(0, 6)}...{address.slice(-4)}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{balance.toLocaleString()} CMT</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Staked</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stakedAmount.toLocaleString()} CMT</p>
          <p className="mt-2 text-xs text-muted-foreground">7-day lock period active</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tier</p>
          <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold ${TIER_COLORS[tier]}`}>{tier}</span>
          <p className="mt-2 text-xs text-muted-foreground">
            {tier === 'Whale' ? 'Max tier unlocked' : `${tier === 'Pro' ? '10,000' : tier === 'Basic' ? '1,000' : '100'} CMT for next tier`}
          </p>
        </div>
      </div>

      {/* Bookmarked startups */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <Bookmark className="h-5 w-5 text-primary" /> Bookmarked Startups
        </h2>
        {bookmarked.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-muted-foreground">No startups bookmarked yet. Visit the <Link to="/dashboard" className="text-primary underline">Dashboard</Link> to bookmark startups.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bookmarked.map(s => (
              <Link key={s.id} to={`/startup/${s.id}`} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition hover:bg-secondary">
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category} · {s.blockchain}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{s.sustainability_score}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(s.mrr)} MRR</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Watchlist Alerts */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
          <Bell className="h-5 w-5 text-primary" /> Watchlist Alerts
        </h2>
        <div className="space-y-2">
          {ALERTS.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.color}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
