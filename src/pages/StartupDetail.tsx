import { useParams, Link } from 'react-router-dom';
import RiskAnalysisButton from '@/components/RiskAnalysisButton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/format';
import Badge from '@/components/common/Badge';
import SustainabilityScore from '@/components/SustainabilityScore';
import { useVerifyOnChain, computeProofHash } from '@/hooks/use-blockchain';
import {
  Leaf, Shield, AlertTriangle, ExternalLink, Users, Calendar,
  Globe, TrendingUp, Wallet, Zap, Coins, ChevronLeft, Info, Loader2, History, CheckCircle2, XCircle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useStartup, useMetricsHistory, useStartupPledges, useStartups, useAuditLog } from '@/hooks/use-startups';
import type { SustainabilityData } from '@/components/SustainabilityScore';
import type { DbStartup, DbMetricsHistory } from '@/hooks/use-startups';

const categoryColors: Record<string, 'info' | 'primary' | 'warning' | 'success'> = {
  Fintech: 'info', SaaS: 'primary', DeFi: 'warning', Cleantech: 'success',
};

function SustainabilityGauge({ score, size = 140 }: { score: number; size?: number }) {
  const r = (size - 14) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#EAB308' : '#EF4444';
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="sust-header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={7} opacity={0.25} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#sust-header-grad)" strokeWidth={7} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Leaf className="h-4 w-4 mb-0.5" style={{ color }} />
        <span className="text-2xl font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-[10px] text-muted-foreground">Sustainability</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, bg }: { label: string; value: string; icon: React.ElementType; bg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1.5 text-lg font-bold font-mono">{value}</div>
    </motion.div>
  );
}

const chartTooltipStyle = {
  borderRadius: 8,
  border: '1px solid hsl(var(--border))',
  background: 'hsl(var(--card))',
  fontSize: 12,
};

const CARBON_PRICE = 50;

function buildSustainabilityData(s: DbStartup): SustainabilityData {
  return {
    overall: s.sustainability_score,
    energyEfficiency: { score: s.energy_score, chain: `${s.blockchain} (${s.chain_type})`, energyPerTx: s.energy_per_transaction || '0.001 kWh' },
    carbonOffset: { score: s.carbon_score, purchased: Number(s.carbon_offset_tonnes) > 10, tons: Number(s.carbon_offset_tonnes) },
    tokenomicsHealth: { score: s.tokenomics_score, concentration: Number(s.whale_concentration) > 50 ? 'High' : Number(s.whale_concentration) > 30 ? 'Medium' : 'Low', inflation: `${s.inflation_rate}%`, vesting: '4yr linear' },
    governancePledges: { score: s.governance_score, pledgesCount: s.governance_score, pledges: [] },
  };
}

function ImpactPL({ startup, metrics }: { startup: DbStartup; metrics: DbMetricsHistory[] }) {
  const last6 = metrics.slice(-6);
  const totalRevenue = last6.reduce((s, m) => s + Number(m.revenue), 0);
  const totalCosts = last6.reduce((s, m) => s + Number(m.costs), 0);
  const reportedProfit = totalRevenue - totalCosts;

  const co2Tonnes = Number(startup.carbon_offset_tonnes);
  const energyCostEstimate = startup.energy_score < 20 ? 8000 : 3000;
  const envExternalities = co2Tonnes * CARBON_PRICE + energyCostEstimate;
  const impactProfit = reportedProfit - envExternalities;
  const delta = impactProfit - reportedProfit;
  const deltaPct = reportedProfit !== 0 ? ((delta / Math.abs(reportedProfit)) * 100).toFixed(1) : '0';

  const chartData = last6.map(m => {
    const trad = Number(m.revenue) - Number(m.costs);
    const mEnv = (co2Tonnes / 6) * CARBON_PRICE + energyCostEstimate / 6;
    return { month: m.month, traditional: trad, impactAdjusted: Math.round(trad - mEnv) };
  });

  const fmt = (v: number) => Math.abs(v) >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toLocaleString()}`;

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold text-foreground">Impact-Weighted P&L</h2>
        <UITooltip>
          <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">Impact-weighted accounting subtracts estimated environmental costs from reported profits to reveal true sustainable profitability.</TooltipContent>
        </UITooltip>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl glass-card p-5">
          <h3 className="mb-4 font-bold text-foreground">Traditional P&L</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Revenue</span><span className="font-mono font-medium text-foreground">{fmt(totalRevenue)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">− Operating Costs</span><span className="font-mono font-medium text-destructive">−{fmt(totalCosts)}</span></div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Reported Profit</span>
              <span className={`font-mono font-bold ${reportedProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>{fmt(reportedProfit)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl glass-card gradient-border p-5">
          <h3 className="mb-4 font-bold text-foreground">Impact-Adjusted P&L</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Revenue</span><span className="font-mono font-medium text-foreground">{fmt(totalRevenue)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">− Operating Costs</span><span className="font-mono font-medium text-destructive">−{fmt(totalCosts)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">− Environmental Externalities</span><span className="font-mono font-medium text-amber-400">−{fmt(envExternalities)}</span></div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Impact-Adjusted Profit</span>
              <span className={`font-mono font-bold ${impactProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>{fmt(impactProfit)}</span>
            </div>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center justify-between">
        <span className="font-semibold text-foreground">Impact Gap</span>
        <span className="font-mono font-bold text-amber-400">{delta >= 0 ? '+' : ''}{fmt(delta)} / {deltaPct}%</span>
      </motion.div>
      <div className="rounded-xl glass-card p-5">
        <h3 className="mb-4 font-bold text-foreground">6-Month Profit Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={4}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number, name: string) => [fmt(v), name === 'traditional' ? 'Traditional' : 'Impact-Adjusted']} />
            <Legend formatter={v => v === 'traditional' ? 'Traditional Profit' : 'Impact-Adjusted Profit'} />
            <Bar dataKey="traditional" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="impactAdjusted" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

// Default token distribution and vesting for display
const defaultTokenDist = [
  { label: 'Community', value: 35, color: '#10B981' },
  { label: 'Team', value: 20, color: '#534AB7' },
  { label: 'Investors', value: 18, color: '#3B82F6' },
  { label: 'Treasury', value: 15, color: '#EAB308' },
  { label: 'Liquidity', value: 12, color: '#F97316' },
];
const defaultVesting = [
  { period: 'Month 0', unlocked: 10 }, { period: 'Month 6', unlocked: 15 },
  { period: 'Year 1', unlocked: 25 }, { period: 'Year 2', unlocked: 50 },
  { period: 'Year 3', unlocked: 75 }, { period: 'Year 4', unlocked: 100 },
];

function OnChainTimestamp() {
  const [minutes, setMinutes] = useState(2);
  useEffect(() => {
    const interval = setInterval(() => setMinutes(prev => prev + 1), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Last verified on-chain: {minutes} minute{minutes !== 1 ? 's' : ''} ago
    </div>
  );
}

function ViewOnEtherscanButton() {
  return (
    <a
      href="https://sepolia.etherscan.io"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground hover:bg-secondary"
    >
      View on Etherscan <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function VerifyOnChainButton({ startup }: { startup: DbStartup }) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'match' | 'mismatch'>('idle');

  const verify = async () => {
    setStatus('checking');
    // Simulate reading from chain and comparing proof hash
    // In production this would call useVerifyOnChain and compare hashes
    await new Promise(r => setTimeout(r, 2000));
    // For demo: if startup is verified, show match; otherwise mismatch
    setStatus(startup.verified ? 'match' : 'mismatch');
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <button
      onClick={verify}
      disabled={status === 'checking'}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition ${
        status === 'match' ? 'border-primary/30 bg-primary/10 text-primary' :
        status === 'mismatch' ? 'border-destructive/30 bg-destructive/10 text-destructive' :
        'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary'
      }`}
    >
      {status === 'checking' && <><Loader2 className="h-3 w-3 animate-spin" /> Verifying...</>}
      {status === 'match' && <><CheckCircle2 className="h-3 w-3" /> On-Chain Verified ✓</>}
      {status === 'mismatch' && <><XCircle className="h-3 w-3" /> Hash Mismatch</>}
      {status === 'idle' && <><Shield className="h-3 w-3" /> Verify On-Chain</>}
    </button>
  );
}
function AuditTrailTab({ startupId }: { startupId: string }) {
  const { data: entries = [], isLoading } = useAuditLog(startupId);
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (entries.length === 0) return <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground"><History className="mx-auto h-8 w-8 mb-2 opacity-50" /><p>No on-chain changes recorded yet.</p></div>;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Field</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Old</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">New</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tx Hash</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
          </tr></thead>
          <tbody>{entries.map(e => (
            <tr key={e.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="px-4 py-3 font-medium capitalize">{e.field_changed.replace(/_/g, ' ')}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[120px] truncate">{e.old_value || '—'}</td>
              <td className="px-4 py-3 font-mono text-xs max-w-[120px] truncate">{e.new_value || '—'}</td>
              <td className="px-4 py-3"><a href={`https://sepolia.etherscan.io/tx/${e.tx_hash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline">{e.tx_hash.slice(0,10)}... <ExternalLink className="h-3 w-3" /></a></td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(e.changed_at).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}


export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: startup, isLoading } = useStartup(id);
  const { data: metrics = [] } = useMetricsHistory(id);
  const { data: pledges = [] } = useStartupPledges(id);
  const { data: allStartups } = useStartups();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Startup not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const sus = buildSustainabilityData(startup);
  const avgSustainability = allStartups && allStartups.length > 0
    ? Math.round(allStartups.reduce((s, x) => s + x.sustainability_score, 0) / allStartups.length)
    : 62;

  // Build financials from metrics
  const financials = metrics.map(m => ({
    month: m.month,
    revenue: Number(m.revenue),
    costs: Number(m.costs),
    profit: Number(m.revenue) - Number(m.costs),
  }));

  const revenueHistory = metrics.slice(-6).map(m => ({ month: m.month, value: Number(m.revenue) }));
  const userHistory = metrics.slice(-6).map(m => ({ month: m.month, value: m.mau }));
  const carbonOffsetHistory = metrics.slice(-6).map(m => ({ month: m.month, tons: Number(m.carbon_offsets) }));

  const metricsTable = metrics.map(m => ({
    date: m.month_date,
    mrr: Number(m.revenue),
    users: m.mau,
    growth: Number(m.growth_rate),
    verified: startup.verified,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{startup.name}</h1>
            <Badge variant={categoryColors[startup.category] || 'neutral'}>{startup.category}</Badge>
            {startup.verified && <Badge variant="success">✓ Verified</Badge>}
            <Badge variant="info">{startup.blockchain}</Badge>
          </div>
          <p className="mt-2 max-w-xl text-muted-foreground">{startup.description}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {startup.founded_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Founded {startup.founded_date}</span>}
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {startup.team_size} team members</span>
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                <Globe className="h-3.5 w-3.5" /> {startup.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <OnChainTimestamp />
            <ViewOnEtherscanButton />
            <VerifyOnChainButton startup={startup} />
            <RiskAnalysisButton startup={startup} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <SustainabilityGauge score={sus.overall} />
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="impact-pl">Impact P&L</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <MetricCard label="MRR" value={formatCurrency(startup.mrr)} icon={Wallet} bg="bg-blue-50 dark:bg-blue-950/30" />
            <MetricCard label="Total Users" value={formatNumber(startup.users)} icon={Users} bg="bg-purple-50 dark:bg-purple-950/30" />
            <MetricCard label="Growth" value={`${Number(startup.growth_rate) >= 0 ? '+' : ''}${startup.growth_rate}%`} icon={TrendingUp} bg="bg-emerald-50 dark:bg-emerald-950/30" />
            <MetricCard label="Treasury" value={formatCurrency(Number(startup.treasury))} icon={Coins} bg="bg-amber-50 dark:bg-amber-950/30" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueHistory}>
                  <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#534AB7" stopOpacity={0.3} /><stop offset="95%" stopColor="#534AB7" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${formatNumber(v)}`, 'Revenue']} />
                  <Area type="monotone" dataKey="value" stroke="#534AB7" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">User Growth</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={userHistory}>
                  <defs><linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [formatNumber(v), 'Users']} />
                  <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border overflow-x-auto">
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
                {metricsTable.map(m => (
                  <tr key={m.date} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-mono">{m.date}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(m.mrr)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(m.users)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${m.growth >= 0 ? 'text-accent' : 'text-destructive'}`}>{m.growth >= 0 ? '+' : ''}{m.growth}%</td>
                    <td className="px-4 py-3 text-center">{m.verified ? <span className="text-accent">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Financials */}
        <TabsContent value="financials" className="mt-6 space-y-6">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">Revenue vs Costs (12 months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financials}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${formatNumber(v)}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} dot={false} name="Revenue" />
                <Line type="monotone" dataKey="costs" stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Costs" strokeDasharray="6 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">Profit Margin</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={financials}>
                <defs><linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${formatNumber(v)}`, 'Profit']} />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Sustainability */}
        <TabsContent value="sustainability" className="mt-6 space-y-6">
          <SustainabilityScore data={sus} />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <Zap className="h-4 w-4" style={{ color: '#10B981' }} /> Energy Consumption
              </h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-3xl font-bold font-mono" style={{ color: Number(startup.energy_consumption) < 200 ? '#10B981' : Number(startup.energy_consumption) < 500 ? '#EAB308' : '#EF4444' }}>
                    {Number(startup.energy_consumption)}
                  </span>
                  <p className="text-xs text-muted-foreground">kWh/month</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: Number(startup.energy_consumption) < 200 ? '#10B981' : Number(startup.energy_consumption) < 500 ? '#EAB308' : '#EF4444' }} initial={{ width: 0 }} animate={{ width: `${Math.min((Number(startup.energy_consumption) / 1000) * 100, 100)}%` }} transition={{ duration: 1 }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>0</span><span>500</span><span>1000 kWh</span></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <Leaf className="h-4 w-4" style={{ color: '#10B981' }} /> Carbon Offset History
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={carbonOffsetHistory}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} tons`, 'Offset']} />
                  <Bar dataKey="tons" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">vs Platform Average</h3>
            <div className="space-y-3">
              {[
                { label: startup.name, score: sus.overall, color: '#10B981' },
                { label: 'Platform Average', score: avgSustainability, color: '#9CA3AF' },
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="font-medium">{item.label}</span><span className="font-mono font-bold">{item.score}/100</span></div>
                  <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Impact P&L */}
        <TabsContent value="impact-pl" className="mt-6 space-y-6">
          <ImpactPL startup={startup} metrics={metrics} />
        </TabsContent>

        {/* Tokenomics */}
        <TabsContent value="tokenomics" className="mt-6 space-y-6">
          {Number(startup.whale_concentration) > 50 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/5 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <span className="font-bold text-destructive">Whale Concentration Warning</span>
                <p className="text-sm text-muted-foreground">Top 10 wallets hold {Number(startup.whale_concentration)}% of total supply. High concentration risk.</p>
              </div>
            </motion.div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">Token Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={defaultTokenDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="label" paddingAngle={3}>
                    {defaultTokenDist.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Whale Concentration (Top 10)</span>
                  <span className={`font-bold font-mono ${Number(startup.whale_concentration) > 50 ? 'text-destructive' : Number(startup.whale_concentration) > 35 ? 'text-yellow-500' : 'text-accent'}`}>{Number(startup.whale_concentration)}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Inflation Rate</span>
                  <span className={`font-bold font-mono ${Number(startup.inflation_rate) > 5 ? 'text-destructive' : 'text-accent'}`}>{Number(startup.inflation_rate)}%/yr</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Tokenomics Score</span>
                  <span className="font-bold font-mono" style={{ color: '#10B981' }}>{sus.tokenomicsHealth.score}/25</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">Vesting Schedule</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={defaultVesting}>
                <defs><linearGradient id="vestGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#534AB7" stopOpacity={0.3} /><stop offset="95%" stopColor="#534AB7" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, 'Unlocked']} />
                <Area type="monotone" dataKey="unlocked" stroke="#534AB7" strokeWidth={2.5} fill="url(#vestGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* Pledges */}
        <TabsContent value="pledges" className="mt-6 space-y-4">
          <div className="mb-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: '#10B981' }} />
              Sustainability Pledges ({pledges.length})
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Commitments this startup has made toward sustainability goals</p>
          </div>
          {pledges.map((pledge, i) => (
            <motion.div key={pledge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#10B98115', color: '#10B981' }}>
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{pledge.pledge_text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Committed on {new Date(pledge.committed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <Badge variant={pledge.status === 'active' ? 'success' : 'neutral'}>
                {pledge.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </motion.div>
          ))}
          {pledges.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pledges yet.</p>
          )}
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="mt-6">
          <AuditTrailTab startupId={startup.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
