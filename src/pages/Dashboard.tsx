import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, ACTIVITY_FEED } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/format';
import Sparkline from '@/components/common/Sparkline';
import Badge from '@/components/common/Badge';
import { useStartups } from '@/hooks/use-startups';
import { Loader2 } from 'lucide-react';
import LiveFeed from '@/components/LiveFeed';

const categoryColors: Record<string, 'info' | 'primary' | 'warning' | 'success'> = {
  Fintech: 'info',
  SaaS: 'primary',
  DeFi: 'warning',
  Cleantech: 'success',
};

type SortKey = 'mrr' | 'growth_rate' | 'trust_score' | 'users';

export default function Dashboard() {
  const { data: startups, isLoading } = useStartups();
  const [category, setCategory] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('mrr');
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    if (!startups) return [];
    let list = category === 'All' ? startups : startups.filter(s => s.category === category);
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return list;
  }, [startups, category, sortKey, sortAsc]);

  const trustColor = (s: number) => s > 70 ? 'bg-emerald-500' : s > 40 ? 'bg-amber-500' : 'bg-red-500';

  const totalMrr = startups?.reduce((s, x) => s + x.mrr, 0) ?? 0;
  const totalUsers = startups?.reduce((s, x) => s + x.users, 0) ?? 0;
  const totalCarbon = startups?.reduce((s, x) => s + Number(x.carbon_offset_tonnes), 0) ?? 0;
  const startupCount = startups?.length ?? 0;

  const platformStats = [
    { label: 'Total MRR', value: formatCurrency(totalMrr), change: '+11.4%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'text-blue-400' },
    { label: 'Total Users', value: formatNumber(totalUsers), change: '+8.7%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', accent: 'text-purple-400' },
    { label: 'Startups', value: String(startupCount), change: '+16.7%', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', accent: 'text-amber-400' },
    { label: 'Carbon Offset', value: `${formatNumber(totalCarbon)}t`, change: '+22.3%', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', accent: 'text-emerald-400' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LiveFeed />

      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform-wide metrics and startup leaderboard</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card gradient-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <svg className={`h-5 w-5 ${s.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{s.value}</span>
              <span className="mb-0.5 text-sm font-medium text-primary">{s.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${category === c ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground">
                <option value="mrr">MRR</option>
                <option value="growth_rate">Growth</option>
                <option value="trust_score">Trust Score</option>
                <option value="users">Users</option>
              </select>
              <button onClick={() => setSortAsc(!sortAsc)} className="rounded-lg border border-border bg-card p-1.5 text-foreground transition hover:bg-secondary">
                <svg className={`h-4 w-4 transition ${sortAsc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex rounded-lg border border-border">
                {(['grid', 'table'] as const).map(v => (
                  <button key={v} onClick={() => setViewMode(v)} className={`p-1.5 transition ${viewMode === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'} ${v === 'grid' ? 'rounded-l-lg' : 'rounded-r-lg'}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {v === 'grid' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/startup/${s.id}`} className="block rounded-xl glass-card p-5 startup-card-hover">
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryColors[s.category] || 'neutral'}>{s.category}</Badge>
                      {s.verified && (
                        <Badge variant="success">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-foreground">{s.name}</h3>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">MRR</div>
                        <div className="font-semibold font-mono text-foreground">{formatCurrency(s.mrr)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Users</div>
                        <div className="font-semibold font-mono text-foreground">{formatNumber(s.users)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Growth</div>
                        <div className={`font-semibold font-mono ${Number(s.growth_rate) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {Number(s.growth_rate) >= 0 ? '+' : ''}{Number(s.growth_rate)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${trustColor(s.trust_score)}`} />
                        <span className="text-sm font-mono font-medium text-foreground">{s.trust_score}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl glass-card">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Startup</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">MRR</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Users</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Growth</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Trust</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((s, i) => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="cursor-pointer transition hover:bg-white/[0.03]" onClick={() => window.location.href = `/startup/${s.id}`}>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <Link to={`/startup/${s.id}`} className="flex items-center gap-2">
                          {s.name}
                          {s.verified && (
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><Badge variant={categoryColors[s.category] || 'neutral'}>{s.category}</Badge></td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">{formatCurrency(s.mrr)}</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">{formatNumber(s.users)}</td>
                      <td className={`px-4 py-3 text-right font-mono ${Number(s.growth_rate) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {Number(s.growth_rate) >= 0 ? '+' : ''}{Number(s.growth_rate)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${trustColor(s.trust_score)}`} />
                          <span className="font-mono text-foreground">{s.trust_score}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {s.verified ? (
                          <svg className="mx-auto h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="hidden w-80 lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 font-bold text-foreground">Recent Activity</h3>
            <div className="space-y-4">
              {ACTIVITY_FEED.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-3">
                  <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full glow-dot ${e.color}`} />
                  <div>
                    <p className="text-sm text-foreground">{e.text}</p>
                    <p className="text-xs text-muted-foreground">{e.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
