import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROPOSALS } from '@/lib/mock-data';
import { formatAddress, formatNumber } from '@/lib/format';
import Badge from '@/components/common/Badge';

type Tab = 'Active' | 'Passed' | 'All';

const statusVariant: Record<string, 'info' | 'success' | 'danger'> = {
  Active: 'info', Passed: 'success', Defeated: 'danger',
};

export default function Governance() {
  const [tab, setTab] = useState<Tab>('Active');
  const [delegateAddr, setDelegateAddr] = useState('');

  const filtered = useMemo(() => {
    if (tab === 'All') return PROPOSALS;
    return PROPOSALS.filter(p => p.status === tab);
  }, [tab]);

  const tabs: Tab[] = ['Active', 'Passed', 'All'];
  const tabCounts = {
    Active: PROPOSALS.filter(p => p.status === 'Active').length,
    Passed: PROPOSALS.filter(p => p.status === 'Passed').length,
    All: PROPOSALS.length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Governance</h1>
          <p className="mt-1 text-muted-foreground">Vote on proposals that shape the ChainMetrics protocol</p>
        </div>
        <button className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90">
          Create Proposal
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 inline-flex rounded-lg border">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${tab === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t}
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{tabCounts[t]}</span>
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="mt-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => {
            const total = p.forVotes + p.againstVotes + p.abstainVotes;
            const forPct = (p.forVotes / total) * 100;
            const againstPct = (p.againstVotes / total) * 100;
            const abstainPct = (p.abstainVotes / total) * 100;
            const isActive = p.status === 'Active';
            const endDate = new Date(p.endDate);
            const now = new Date();
            const diffMs = endDate.getTime() - now.getTime();
            const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
            const diffHours = Math.max(0, Math.floor((diffMs % 86400000) / 3600000));

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  </div>
                  <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Proposed by {formatAddress(p.proposer)}</span>
                  <span>{isActive ? `${diffDays}d ${diffHours}h remaining` : 'Ended'}</span>
                  <span>{formatNumber(total)} total votes</span>
                </div>

                {/* Vote bars */}
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'For', pct: forPct, votes: p.forVotes, color: 'bg-emerald-500' },
                    { label: 'Against', pct: againstPct, votes: p.againstVotes, color: 'bg-destructive' },
                    { label: 'Abstain', pct: abstainPct, votes: p.abstainVotes, color: 'bg-muted-foreground/50' },
                  ].map(v => (
                    <div key={v.label} className="flex items-center gap-3">
                      <span className="w-16 text-xs text-muted-foreground">{v.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${v.color}`} style={{ width: `${v.pct}%` }} />
                      </div>
                      <span className="w-20 text-right text-xs font-mono">{v.pct.toFixed(1)}% ({formatNumber(v.votes)})</span>
                    </div>
                  ))}
                </div>

                {isActive && (
                  <div className="mt-4 flex gap-2">
                    {[
                      { label: 'For', cls: 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30' },
                      { label: 'Against', cls: 'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30' },
                      { label: 'Abstain', cls: 'border-border text-muted-foreground hover:bg-muted' },
                    ].map(b => (
                      <button
                        key={b.label}
                        disabled
                        title="Connect wallet to vote"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${b.cls}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Delegate */}
      <div className="mt-12 rounded-xl border bg-card p-6">
        <h3 className="font-bold">Delegate Voting Power</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Delegate your CMT voting power to another address. You retain token ownership but the delegate can vote on your behalf.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            value={delegateAddr}
            onChange={e => setDelegateAddr(e.target.value)}
            placeholder="0x... delegate address"
            className="flex-1 rounded-lg border bg-card px-4 py-2.5 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
          />
          <button
            disabled={!delegateAddr.startsWith('0x') || delegateAddr.length <= 10}
            className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
          >
            Delegate
          </button>
        </div>
      </div>
    </div>
  );
}
