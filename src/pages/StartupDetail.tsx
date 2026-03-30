import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { STARTUPS } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/format';
import Badge from '@/components/common/Badge';
import SustainabilityScore from '@/components/SustainabilityScore';
import {
  Leaf, Shield, AlertTriangle, ExternalLink, Users, Calendar,
  Globe, TrendingUp, Wallet, Zap, Coins, Vote, ChevronLeft,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryColors: Record<string, 'info' | 'primary' | 'warning' | 'success'> = {
  Fintech: 'info', SaaS: 'primary', DeFi: 'warning', Cleantech: 'success',
};

const SDG_NAMES: Record<number, string> = {
  7: 'Affordable & Clean Energy', 9: 'Industry, Innovation & Infrastructure',
  11: 'Sustainable Cities', 12: 'Responsible Consumption', 13: 'Climate Action',
  15: 'Life on Land',
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
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#sust-header-grad)" strokeWidth={7} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
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
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${bg}`}
    >
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

export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const startup = STARTUPS.find(s => s.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!startup) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Startup not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const ext = startup.extended;
  const sus = startup.sustainability;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{startup.name}</h1>
            <Badge variant={categoryColors[startup.category] || 'neutral'}>{startup.category}</Badge>
            {startup.verified && <Badge variant="success">✓ Verified</Badge>}
            <Badge variant="info">Base Sepolia</Badge>
          </div>
          <p className="mt-2 max-w-xl text-muted-foreground">{startup.description}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Founded {ext.foundedDate}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {ext.teamSize} team members</span>
            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
              <Globe className="h-3.5 w-3.5" /> {startup.website}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <SustainabilityGauge score={sus.overall} />
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <MetricCard label="MRR" value={formatCurrency(startup.mrr)} icon={Wallet} bg="bg-blue-50 dark:bg-blue-950/30" />
            <MetricCard label="Total Users" value={formatNumber(startup.users)} icon={Users} bg="bg-purple-50 dark:bg-purple-950/30" />
            <MetricCard label="Growth" value={`${startup.growth >= 0 ? '+' : ''}${startup.growth}%`} icon={TrendingUp} bg="bg-emerald-50 dark:bg-emerald-950/30" />
            <MetricCard label="Treasury" value={formatCurrency(ext.treasury)} icon={Coins} bg="bg-amber-50 dark:bg-amber-950/30" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={startup.revenueHistory}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#534AB7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#534AB7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                <AreaChart data={startup.userHistory}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [formatNumber(v), 'Users']} />
                  <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics History Table */}
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
                {startup.metricsHistory.map(m => (
                  <tr key={m.date} className="hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-mono">{m.date}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(m.mrr)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatNumber(m.users)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${m.growth >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {m.growth >= 0 ? '+' : ''}{m.growth}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.verified ? <span className="text-accent">✓</span> : <span className="text-muted-foreground">—</span>}
                    </td>
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
              <LineChart data={ext.financials}>
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
              <AreaChart data={ext.financials}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${formatNumber(v)}`, 'Profit']} />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">Funding Rounds</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6 pl-10">
                {ext.fundingRounds.map((round, i) => (
                  <motion.div
                    key={round.round}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{round.round}</span>
                        <span className="text-xs text-muted-foreground">{round.date}</span>
                      </div>
                      <div className="mt-2 flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Raised</span>
                          <p className="font-bold font-mono text-accent">{formatCurrency(round.amount)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valuation</span>
                          <p className="font-bold font-mono">{formatCurrency(round.valuation)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
                  <span className="text-3xl font-bold font-mono" style={{ color: ext.energyConsumption < 200 ? '#10B981' : ext.energyConsumption < 500 ? '#EAB308' : '#EF4444' }}>
                    {ext.energyConsumption}
                  </span>
                  <p className="text-xs text-muted-foreground">kWh/month</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: ext.energyConsumption < 200 ? '#10B981' : ext.energyConsumption < 500 ? '#EAB308' : '#EF4444' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((ext.energyConsumption / 1000) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0</span><span>500</span><span>1000 kWh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold flex items-center gap-2">
                <Leaf className="h-4 w-4" style={{ color: '#10B981' }} /> Carbon Offset History
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ext.carbonOffsetHistory}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v} tons`, 'Offset']} />
                  <Bar dataKey="tons" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">vs Platform Average</h3>
            <div className="space-y-3">
              {[
                { label: startup.name, score: sus.overall, color: '#10B981' },
                { label: 'Platform Average', score: ext.platformAvgSustainability, color: '#9CA3AF' },
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-mono font-bold">{item.score}/100</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UN SDG Alignment */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 font-bold">UN SDG Alignment</h3>
            <div className="flex flex-wrap gap-3">
              {ext.sdgAlignment.map(sdg => (
                <div
                  key={sdg}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  style={{ borderColor: '#10B98140', backgroundColor: '#10B98108' }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md font-bold text-sm text-white" style={{ backgroundColor: '#10B981' }}>
                    {sdg}
                  </div>
                  <span className="text-xs font-medium">{SDG_NAMES[sdg] || `SDG ${sdg}`}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tokenomics */}
        <TabsContent value="tokenomics" className="mt-6 space-y-6">
          {ext.whaleConcentration > 50 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border-2 border-destructive/50 bg-destructive/5 p-4"
            >
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <span className="font-bold text-destructive">Whale Concentration Warning</span>
                <p className="text-sm text-muted-foreground">
                  Top 10 wallets hold {ext.whaleConcentration}% of total supply. High concentration risk.
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-bold">Token Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={ext.tokenDistribution}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    dataKey="value" nameKey="label"
                    paddingAngle={3}
                  >
                    {ext.tokenDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
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
                  <span className={`font-bold font-mono ${ext.whaleConcentration > 50 ? 'text-destructive' : ext.whaleConcentration > 35 ? 'text-yellow-500' : 'text-accent'}`}>
                    {ext.whaleConcentration}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Inflation Rate</span>
                  <span className={`font-bold font-mono ${ext.inflationRate > 5 ? 'text-destructive' : 'text-accent'}`}>
                    {ext.inflationRate}%/yr
                  </span>
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
              <AreaChart data={ext.vestingSchedule}>
                <defs>
                  <linearGradient id="vestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#534AB7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#534AB7" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
              Sustainability Pledges ({ext.pledges.length})
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Commitments this startup has made toward sustainability goals</p>
          </div>
          {ext.pledges.map((pledge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-xl border bg-card p-5"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: '#10B98115', color: '#10B981' }}
              >
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{pledge.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Committed on {new Date(pledge.dateCommitted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <Badge variant={pledge.active ? 'success' : 'neutral'}>
                {pledge.active ? 'Active' : 'Inactive'}
              </Badge>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
