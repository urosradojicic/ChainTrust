import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIERS } from '@/lib/mock-data';

const TOKEN_DISTRIBUTION = [
  { label: 'Staking Rewards', pct: 35, color: 'bg-purple-500' },
  { label: 'Treasury', pct: 25, color: 'bg-blue-500' },
  { label: 'Community', pct: 20, color: 'bg-emerald-500' },
  { label: 'Team (vested)', pct: 15, color: 'bg-amber-500' },
  { label: 'Liquidity', pct: 5, color: 'bg-pink-500' },
];

function StakeModal({ mode, onClose }: { mode: 'stake' | 'unstake'; onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [pending, setPending] = useState(false);
  const balance = mode === 'stake' ? 10000 : 5000;

  const currentTier = 'Basic';
  const newTier = () => {
    const val = Number(amount) || 0;
    const total = mode === 'stake' ? 5000 + val : 5000 - val;
    if (total >= 10000) return 'Whale';
    if (total >= 1000) return 'Pro';
    if (total >= 100) return 'Basic';
    return 'Free';
  };

  const handleSubmit = async () => {
    setPending(true);
    await new Promise(r => setTimeout(r, 2000));
    setPending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mx-4 w-full max-w-md rounded-2xl border bg-card p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">{mode === 'stake' ? 'Stake Tokens' : 'Unstake Tokens'}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-sm mb-4">
          <span className="text-muted-foreground">{mode === 'stake' ? 'Available Balance' : 'Currently Staked'}</span>
          <div className="font-bold font-mono">{balance.toLocaleString()} CMT</div>
        </div>

        <div className="relative mb-4">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border bg-card px-4 py-3 pr-20 font-mono text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <button
            onClick={() => setAmount(balance.toString())}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary"
          >
            MAX
          </button>
        </div>

        {amount && (
          <div className="mb-4 rounded-lg bg-muted/50 p-3 text-sm">
            <span className="text-muted-foreground">Tier: </span>
            <span className="font-medium">{currentTier}</span>
            <span className="mx-2">→</span>
            <span className={`font-bold ${newTier() !== currentTier ? (TIERS.findIndex(t => t.name === newTier()) > TIERS.findIndex(t => t.name === currentTier) ? 'text-accent' : 'text-warning') : ''}`}>
              {newTier()}
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!amount || Number(amount) <= 0 || Number(amount) > balance || pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
        >
          {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
          {pending ? 'Confirming...' : mode === 'stake' ? 'Stake CMT' : 'Unstake CMT'}
        </button>
      </motion.div>
    </div>
  );
}

export default function Staking() {
  const [modal, setModal] = useState<'stake' | 'unstake' | null>(null);
  const userTierIdx = 1; // Basic

  const stats = [
    { label: 'Total Staked', value: '2.45M CMT' },
    { label: 'Total Stakers', value: '1,823' },
    { label: 'Current APY', value: '12.5%', accent: true },
    { label: 'Your Stake', value: '5K CMT', sub: 'Tier: Basic' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Staking</h1>
      <p className="mt-1 text-muted-foreground">Stake CMT tokens to unlock premium analytics and earn rewards</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border bg-card p-5"
          >
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold font-mono ${s.accent ? 'text-accent' : ''}`}>{s.value}</div>
            {s.sub && <div className="mt-0.5 text-xs text-blue-500 font-medium">{s.sub}</div>}
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button onClick={() => setModal('stake')} className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90">
          Stake CMT
        </button>
        <button onClick={() => setModal('unstake')} className="rounded-xl border px-6 py-3 font-semibold transition hover:border-destructive hover:text-destructive">
          Unstake CMT
        </button>
      </div>

      {/* Tiers */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl border bg-card"
            style={{ borderTopColor: tier.color, borderTopWidth: '3px' }}
          >
            {i > userTierIdx && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold" style={{ color: tier.color }}>{tier.name}</span>
                {i === userTierIdx && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Current</span>
                )}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{tier.minStake > 0 ? `${tier.minStake.toLocaleString()} CMT` : 'Free'}</div>
              <ul className="mt-4 space-y-2">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 flex-shrink-0" style={{ color: tier.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Token Distribution */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">CMT Token Distribution</h3>
          <span className="text-sm font-mono text-muted-foreground">Total Supply: 100,000,000 CMT</span>
        </div>
        <div className="space-y-3">
          {TOKEN_DISTRIBUTION.map((d, i) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-32 text-sm text-muted-foreground">{d.label}</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${d.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
              <span className="w-10 text-right text-sm font-mono font-medium">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <StakeModal mode={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
