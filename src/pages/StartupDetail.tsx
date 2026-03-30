import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { STARTUPS } from '@/lib/mock-data';
import { formatCurrency, formatNumber, formatAddress } from '@/lib/format';
import { CONTRACTS } from '@/lib/contracts';
import Badge from '@/components/common/Badge';
import { useState } from 'react';

const categoryColors: Record<string, 'info' | 'primary' | 'warning' | 'success'> = {
  Fintech: 'info', SaaS: 'primary', DeFi: 'warning', Cleantech: 'success',
};

function TrustScoreBadge({ score, verified }: { score: number; verified: boolean }) {
  const color = score > 70 ? '#1D9E75' : score > 40 ? '#BA7517' : '#E24B4A';
  const label = score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low';
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={112} height={112} className="-rotate-90">
        <circle cx={56} cy={56} r={48} fill="none" stroke="hsl(var(--border))" strokeWidth={6} />
        <motion.circle
          cx={56} cy={56} r={48} fill="none" stroke={color} strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="relative -mt-[76px] flex flex-col items-center">
        <span className="text-2xl font-bold font-mono">{score}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-10 flex items-center gap-1.5 text-sm">
        {verified ? (
          <>
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-accent font-medium">Verified</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Unverified</span>
          </>
        )}
      </div>
    </div>
  );
}

function OnChainProof({ txHash, blockNumber }: { txHash: string; blockNumber: number }) {
  const [copied, setCopied] = useState('');
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const rows = [
    { label: 'Contract', value: formatAddress(CONTRACTS.ChainMetricsRegistry), full: CONTRACTS.ChainMetricsRegistry, key: 'contract' },
    { label: 'Last Tx', value: formatAddress(txHash), full: txHash, key: 'tx', link: `https://sepolia.basescan.org/tx/${txHash}` },
    { label: 'Block', value: blockNumber.toLocaleString(), full: '', key: 'block' },
    { label: 'Network', value: 'Base Sepolia', full: '', key: 'network', badge: true },
  ];

  return (
    <div className="rounded-xl border bg-muted/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
        <span className="font-bold">On-Chain Verification</span>
      </div>
      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.key} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <div className="flex items-center gap-2">
              {r.badge ? (
                <Badge variant="info">{r.value}</Badge>
              ) : r.link ? (
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline">
                  {r.value}
                  <svg className="ml-1 inline h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span className="font-mono">{r.value}</span>
              )}
              {r.full && (
                <button onClick={() => copy(r.full, r.key)} className="text-muted-foreground hover:text-foreground transition">
                  {copied === r.key ? (
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsChart({ data, color, prefix = '' }: { data: { month: string; value: number }[]; color: string; prefix?: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
          formatter={(value: number) => [`${prefix}${formatNumber(value)}`, '']}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const startup = STARTUPS.find(s => s.id === id);

  if (!startup) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Startup not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const metrics = [
    { label: 'MRR', value: formatCurrency(startup.mrr), bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Total Users', value: formatNumber(startup.users), bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { label: 'Burn Rate', value: `${formatCurrency(startup.burnRate)}/mo`, bg: 'bg-red-50 dark:bg-red-950/30' },
    { label: 'Runway', value: `${startup.runway} months`, bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Growth', value: `${startup.growth >= 0 ? '+' : ''}${startup.growth}%`, bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Trust Score', value: `${startup.trustScore}/100`, bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{startup.name}</h1>
            <Badge variant={categoryColors[startup.category] || 'neutral'}>{startup.category}</Badge>
            {startup.verified && <Badge variant="success">✓ Verified</Badge>}
          </div>
          <p className="mt-2 max-w-xl text-muted-foreground">{startup.description}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Registered {new Date(startup.registeredAt * 1000).toLocaleDateString()}</span>
            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{startup.website}</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <TrustScoreBadge score={startup.trustScore} verified={startup.verified} />
        </motion.div>
      </div>

      {/* On-chain proof */}
      <div className="mt-8">
        <OnChainProof txHash={startup.txHash} blockNumber={startup.blockNumber} />
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border p-4 ${m.bg}`}
          >
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="mt-1 text-lg font-bold font-mono">{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Revenue Trend', data: startup.revenueHistory, color: '#534AB7', prefix: '$' },
          { title: 'User Growth', data: startup.userHistory, color: '#1D9E75' },
          { title: 'Carbon Offset (tons)', data: startup.carbonHistory, color: '#22c55e' },
        ].map((chart) => (
          <div key={chart.title} className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">{chart.title}</h3>
            <MetricsChart data={chart.data} color={chart.color} prefix={chart.prefix} />
          </div>
        ))}
      </div>

      {/* Metrics History */}
      <div className="mt-8">
        <h3 className="mb-4 font-bold">Metrics History</h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">MRR</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Users</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Growth</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {startup.metricsHistory.map((m) => (
                <tr key={m.date} className="hover:bg-muted/50 transition">
                  <td className="px-4 py-3 font-mono">{m.date}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(m.mrr)}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatNumber(m.users)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${m.growth >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {m.growth >= 0 ? '+' : ''}{m.growth}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    {m.verified ? (
                      <svg className="mx-auto h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
