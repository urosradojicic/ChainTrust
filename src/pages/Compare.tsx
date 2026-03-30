import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, GitCompareArrows } from 'lucide-react';
import { STARTUPS } from '@/lib/mock-data';
import { formatCurrency, formatNumber } from '@/lib/format';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts';

const RADAR_COLORS = ['#10B981', '#3B82F6', '#F59E0B'];

interface Row {
  label: string;
  key: string;
  getValue: (s: typeof STARTUPS[0]) => number | string;
  getNumeric: (s: typeof STARTUPS[0]) => number;
  higherIsBetter: boolean;
  format?: (v: number | string) => string;
}

const rows: Row[] = [
  {
    label: 'Sustainability Score', key: 'sustainability',
    getValue: s => s.sustainability.overall,
    getNumeric: s => s.sustainability.overall,
    higherIsBetter: true,
    format: v => `${v}/100`,
  },
  {
    label: 'MRR', key: 'mrr',
    getValue: s => s.mrr,
    getNumeric: s => s.mrr,
    higherIsBetter: true,
    format: v => formatCurrency(v as number),
  },
  {
    label: 'Monthly Active Users', key: 'users',
    getValue: s => s.users,
    getNumeric: s => s.users,
    higherIsBetter: true,
    format: v => formatNumber(v as number),
  },
  {
    label: 'Growth Rate', key: 'growth',
    getValue: s => s.growth,
    getNumeric: s => s.growth,
    higherIsBetter: true,
    format: v => `${v}%`,
  },
  {
    label: 'Energy / Transaction', key: 'energy',
    getValue: s => s.sustainability.energyEfficiency.energyPerTx,
    getNumeric: s => parseFloat(s.sustainability.energyEfficiency.energyPerTx) || 0,
    higherIsBetter: false,
  },
  {
    label: 'Carbon Offsets (tonnes)', key: 'carbon',
    getValue: s => s.carbonOffset,
    getNumeric: s => s.carbonOffset,
    higherIsBetter: true,
    format: v => `${Number(v).toLocaleString()}t`,
  },
  {
    label: 'Token Concentration (top 10)', key: 'concentration',
    getValue: s => s.extended.whaleConcentration,
    getNumeric: s => s.extended.whaleConcentration,
    higherIsBetter: false,
    format: v => `${v}%`,
  },
  {
    label: 'Active Pledges', key: 'pledges',
    getValue: s => s.extended.pledges.filter(p => p.active).length,
    getNumeric: s => s.extended.pledges.filter(p => p.active).length,
    higherIsBetter: true,
  },
  {
    label: 'Governance Participation', key: 'governance',
    getValue: s => s.sustainability.governancePledges.score,
    getNumeric: s => s.sustainability.governancePledges.score,
    higherIsBetter: true,
    format: v => `${v}/25`,
  },
];

function cellHighlight(values: number[], idx: number, higherIsBetter: boolean) {
  if (values.length < 2) return '';
  const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
  const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
  if (values[idx] === best && best !== worst) return 'bg-emerald-500/10';
  if (values[idx] === worst && best !== worst) return 'bg-red-500/10';
  return '';
}

export default function Compare() {
  const [selected, setSelected] = useState<string[]>([STARTUPS[0]?.id ?? '', STARTUPS[1]?.id ?? '']);

  const startups = useMemo(
    () => selected.map(id => STARTUPS.find(s => s.id === id)).filter(Boolean) as typeof STARTUPS,
    [selected]
  );

  const canAddMore = selected.length < 3;

  const updateSelection = (idx: number, val: string) => {
    setSelected(prev => prev.map((v, i) => (i === idx ? val : v)));
  };

  const removeSlot = (idx: number) => {
    if (selected.length <= 2) return;
    setSelected(prev => prev.filter((_, i) => i !== idx));
  };

  const addSlot = () => {
    if (!canAddMore) return;
    const unused = STARTUPS.find(s => !selected.includes(s.id));
    setSelected(prev => [...prev, unused?.id ?? STARTUPS[0].id]);
  };

  // Radar data — normalize each dimension to 0–100
  const radarData = useMemo(() => {
    const dims = [
      { key: 'Revenue', get: (s: typeof STARTUPS[0]) => s.mrr, max: Math.max(...STARTUPS.map(s => s.mrr)) },
      { key: 'Users', get: (s: typeof STARTUPS[0]) => s.users, max: Math.max(...STARTUPS.map(s => s.users)) },
      { key: 'Growth', get: (s: typeof STARTUPS[0]) => s.growth, max: Math.max(...STARTUPS.map(s => s.growth)) },
      { key: 'Sustainability', get: (s: typeof STARTUPS[0]) => s.sustainability.overall, max: 100 },
      { key: 'Tokenomics', get: (s: typeof STARTUPS[0]) => s.sustainability.tokenomicsHealth.score, max: 25 },
      { key: 'Governance', get: (s: typeof STARTUPS[0]) => s.sustainability.governancePledges.score, max: 25 },
    ];
    return dims.map(d => {
      const point: Record<string, string | number> = { dimension: d.key };
      startups.forEach(s => {
        point[s.name] = Math.round((d.get(s) / (d.max || 1)) * 100);
      });
      return point;
    });
  }, [startups]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <GitCompareArrows className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Compare Startups</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Side-by-side analysis across financial, sustainability, and governance metrics.
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap items-end gap-3"
      >
        {selected.map((id, idx) => (
          <div key={idx} className="flex items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Startup {idx + 1}
              </label>
              <Select value={id} onValueChange={v => updateSelection(idx, v)}>
                <SelectTrigger className="w-52 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STARTUPS.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selected.length > 2 && (
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeSlot(idx)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {canAddMore && (
          <Button variant="outline" size="sm" className="border-dashed border-border text-muted-foreground" onClick={addSlot}>
            <Plus className="h-4 w-4 mr-1" /> Add Startup
          </Button>
        )}
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 overflow-x-auto rounded-xl glass-card"
      >
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-5 py-4 text-left font-medium text-muted-foreground w-56">Metric</th>
              {startups.map(s => (
                <th key={s.id} className="px-5 py-4 text-center font-semibold text-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {s.name.charAt(0)}
                    </div>
                    {s.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map(row => {
              const numericValues = startups.map(s => row.getNumeric(s));
              return (
                <tr key={row.key} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-muted-foreground">{row.label}</td>
                  {startups.map((s, idx) => {
                    const val = row.getValue(s);
                    const display = row.format ? row.format(val as number) : String(val);
                    return (
                      <td
                        key={s.id}
                        className={`px-5 py-3.5 text-center font-mono font-medium text-foreground ${cellHighlight(numericValues, idx, row.higherIsBetter)}`}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl glass-card p-6"
      >
        <h2 className="mb-6 text-xl font-bold text-foreground">Multi-Dimensional Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="hsl(217 20% 25%)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 13, fontFamily: 'EB Garamond' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            {startups.map((s, i) => (
              <Radar
                key={s.id}
                name={s.name}
                dataKey={s.name}
                stroke={RADAR_COLORS[i]}
                fill={RADAR_COLORS[i]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: 13, fontFamily: 'EB Garamond' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
