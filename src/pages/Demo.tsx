import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Rocket, Database, Shield, Award, ChevronRight, ChevronLeft,
  Play, CheckCircle2, Clock, Loader2, FileText, Globe, Zap, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CONTRACTS } from '@/lib/contracts';

const DEMO_STEPS = [
  {
    id: 'register',
    title: 'Register Startup',
    subtitle: 'Submit startup details to the ChainMetricsRegistry contract',
    icon: Rocket,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'publish',
    title: 'Publish Metrics',
    subtitle: 'Push verifiable MRR, users, growth, and burn rate on-chain',
    icon: Database,
    color: 'hsl(var(--accent))',
  },
  {
    id: 'verify',
    title: 'Oracle Verification',
    subtitle: 'Chainlink oracles independently validate your metrics',
    icon: Shield,
    color: 'hsl(36, 78%, 41%)',
  },
  {
    id: 'badge',
    title: 'Soulbound Badge',
    subtitle: 'Earn a non-transferable ERC-5192 reputation badge',
    icon: Award,
    color: 'hsl(280, 60%, 55%)',
  },
];

const MOCK_STARTUP = {
  name: 'PayFlow',
  category: 'Fintech',
  description: 'Decentralized payment infrastructure for emerging markets',
  website: 'https://payflow.xyz',
  metadataURI: 'ipfs://QmX7b5jxn7bqvBuYCfhEqm4DfkNdEzWzqPfeGRhYJFKpvA',
};

const MOCK_METRICS = {
  mrr: 142000,
  totalUsers: 12847,
  activeUsers: 8934,
  burnRate: 89000,
  runway: 18,
  growthRate: 23,
  carbonOffset: 45,
  proofHash: '0x8f14e45fceea167a5a36dedd4bea2543…',
};

const MOCK_WALLET = '0x742d…3dF4';
const MOCK_TX = '0xa1b2c3d4e5f6…';
const MOCK_STARTUP_ID = '7';
const MOCK_BADGE_ID = '42';

function SimulatedTerminal({ lines, speed = 60 }: { lines: string[]; speed?: number }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    setVisibleLines([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [lines, speed]);

  return (
    <div className="rounded-xl bg-[#0d1117] border border-[#30363d] p-4 font-mono text-xs overflow-x-auto">
      {visibleLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`py-0.5 ${
            line.startsWith('✓') ? 'text-emerald-400' :
            line.startsWith('⏳') || line.startsWith('→') ? 'text-yellow-400' :
            line.startsWith('⚡') ? 'text-purple-400' :
            line.startsWith('🛡') || line.startsWith('🏆') ? 'text-blue-400' :
            line.startsWith('❯') ? 'text-cyan-400' :
            'text-gray-400'
          }`}
        >
          {line}
        </motion.div>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-cyan-400 ml-0.5"
      />
    </div>
  );
}

function StepRegister({ playing, onComplete }: { playing: boolean; onComplete: () => void }) {
  const terminalLines = [
    `❯ Connecting wallet ${MOCK_WALLET}…`,
    '✓ Wallet connected to Base Sepolia (chainId: 84532)',
    '',
    `❯ ChainMetricsRegistry.registerStartup("${MOCK_STARTUP.name}", "${MOCK_STARTUP.category}", "${MOCK_STARTUP.metadataURI}")`,
    `⏳ Sending transaction to ${CONTRACTS.ChainMetricsRegistry.slice(0, 10)}…`,
    `⏳ Mining… block #4,218,733`,
    `✓ Transaction confirmed: ${MOCK_TX}`,
    `✓ Startup registered with ID: ${MOCK_STARTUP_ID}`,
    '',
    '✓ Metadata pinned to IPFS',
    `✓ Registry event: StartupRegistered(${MOCK_STARTUP_ID}, ${MOCK_WALLET})`,
  ];

  useEffect(() => {
    if (playing) {
      const timer = setTimeout(onComplete, terminalLines.length * 80 + 500);
      return () => clearTimeout(timer);
    }
  }, [playing]);

  return (
    <div className="space-y-5">
      <Card className="border-border/60">
        <CardContent className="p-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Startup Details
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(MOCK_STARTUP).map(([k, v]) => (
              <div key={k}>
                <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <p className="font-medium truncate">{v}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {playing && <SimulatedTerminal lines={terminalLines} speed={80} />}
    </div>
  );
}

function StepPublish({ playing, onComplete }: { playing: boolean; onComplete: () => void }) {
  const terminalLines = [
    `❯ Fetching Stripe MRR data via oracle adapter…`,
    `✓ Stripe MRR: $${MOCK_METRICS.mrr.toLocaleString()}`,
    `❯ Fetching analytics data…`,
    `✓ Total Users: ${MOCK_METRICS.totalUsers.toLocaleString()} | Active: ${MOCK_METRICS.activeUsers.toLocaleString()}`,
    '',
    `❯ Computing proof hash…`,
    `✓ keccak256(mrr, users, growth, burn, runway) = ${MOCK_METRICS.proofHash}`,
    '',
    `❯ ChainMetricsRegistry.publishMetrics(${MOCK_STARTUP_ID}, ${MOCK_METRICS.mrr}, ${MOCK_METRICS.totalUsers}, …, proofHash)`,
    `⏳ Sending transaction…`,
    `⏳ Mining… block #4,218,740`,
    `✓ Transaction confirmed`,
    `✓ Event: MetricsPublished(${MOCK_STARTUP_ID}, timestamp: ${Math.floor(Date.now() / 1000)})`,
  ];

  useEffect(() => {
    if (playing) {
      const timer = setTimeout(onComplete, terminalLines.length * 80 + 500);
      return () => clearTimeout(timer);
    }
  }, [playing]);

  return (
    <div className="space-y-5">
      <Card className="border-border/60">
        <CardContent className="p-5">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-accent" /> Published Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              ['MRR', `$${MOCK_METRICS.mrr.toLocaleString()}`],
              ['Total Users', MOCK_METRICS.totalUsers.toLocaleString()],
              ['Active Users', MOCK_METRICS.activeUsers.toLocaleString()],
              ['Burn Rate', `$${MOCK_METRICS.burnRate.toLocaleString()}/mo`],
              ['Runway', `${MOCK_METRICS.runway} months`],
              ['Growth', `+${MOCK_METRICS.growthRate}%`],
              ['Carbon Offset', `${MOCK_METRICS.carbonOffset} tons`],
            ].map(([label, val]) => (
              <div key={label}>
                <span className="text-muted-foreground">{label}</span>
                <p className="font-bold font-mono">{val}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {playing && <SimulatedTerminal lines={terminalLines} speed={80} />}
    </div>
  );
}

function StepVerify({ playing, onComplete }: { playing: boolean; onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!playing) { setPhase(0); return; }
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000),
      setTimeout(() => { setPhase(4); onComplete(); }, 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  const checks = [
    { label: 'Stripe MRR cross-reference', detail: '$142,000 ↔ $142,000' },
    { label: 'Analytics user count validation', detail: '12,847 ↔ 12,847' },
    { label: 'Growth rate calculation audit', detail: '+23% confirmed' },
    { label: 'Burn rate / runway consistency', detail: '$89K/mo → 18mo ✓' },
  ];

  return (
    <div className="space-y-5">
      <Card className="border-border/60">
        <CardContent className="p-5">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" style={{ color: 'hsl(36, 78%, 41%)' }} /> Chainlink Oracle Network
          </h4>
          <div className="space-y-3">
            {checks.map((check, i) => {
              const status = !playing ? 'waiting' : phase > i ? 'done' : phase === i ? 'running' : 'waiting';
              return (
                <motion.div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  animate={{
                    borderColor: status === 'done' ? 'hsl(160, 70%, 37%)' : status === 'running' ? 'hsl(36, 78%, 51%)' : 'hsl(var(--border))',
                    backgroundColor: status === 'done' ? 'hsla(160, 70%, 37%, 0.05)' : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2">
                    {status === 'done' && <CheckCircle2 className="h-4 w-4 text-accent" />}
                    {status === 'running' && <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'hsl(36, 78%, 41%)' }} />}
                    {status === 'waiting' && <Clock className="h-4 w-4 text-muted-foreground" />}
                    <span className={status === 'done' ? 'font-medium' : 'text-muted-foreground'}>{check.label}</span>
                  </div>
                  {status === 'done' && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs text-accent"
                    >
                      {check.detail}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {playing && phase >= 4 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-accent/40 bg-accent/5 p-4"
        >
          <div className="flex items-center gap-2 text-accent font-semibold">
            <Shield className="h-5 w-5" />
            Oracle Consensus Reached — All Metrics Verified ✓
          </div>
          <p className="text-xs text-muted-foreground mt-1">3 of 3 oracle nodes confirmed. Trust score: 94/100</p>
        </motion.div>
      )}
    </div>
  );
}

function StepBadge({ playing, onComplete }: { playing: boolean; onComplete: () => void }) {
  const [minted, setMinted] = useState(false);

  useEffect(() => {
    if (!playing) { setMinted(false); return; }
    const timer = setTimeout(() => { setMinted(true); onComplete(); }, 3000);
    return () => clearTimeout(timer);
  }, [playing]);

  const terminalLines = [
    `❯ VerificationBadge.mintBadge(${MOCK_WALLET}, ${MOCK_STARTUP_ID}, trustScore: 94)`,
    `⏳ Minting soulbound ERC-5192 token…`,
    `⏳ Mining… block #4,218,755`,
    `✓ Badge minted: Token #${MOCK_BADGE_ID}`,
    `🛡 Badge is LOCKED (soulbound) — non-transferable`,
    `✓ Event: BadgeMinted(${MOCK_BADGE_ID}, ${MOCK_WALLET}, trustScore: 94)`,
  ];

  return (
    <div className="space-y-5">
      {playing && <SimulatedTerminal lines={terminalLines} speed={100} />}

      <AnimatePresence>
        {minted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mx-auto max-w-sm"
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-purple-400/50 bg-gradient-to-br from-purple-950/40 via-card to-primary/10 p-6 text-center shadow-2xl shadow-purple-500/10">
              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-primary">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Verified Startup</h3>
                <p className="text-sm text-muted-foreground mt-1">{MOCK_STARTUP.name} — Fintech</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <span className="text-muted-foreground">Trust Score</span>
                    <p className="font-bold text-lg text-accent">94/100</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <span className="text-muted-foreground">Token ID</span>
                    <p className="font-bold text-lg font-mono">#{MOCK_BADGE_ID}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-purple-400">
                  <Lock className="h-3 w-3" />
                  Soulbound — Non-Transferable (ERC-5192)
                </div>

                <div className="mt-3 font-mono text-[10px] text-muted-foreground">
                  {CONTRACTS.VerificationBadge}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setPlaying(false);
  };

  const handlePlay = () => {
    setPlaying(true);
    // Reset completed for this step so it replays
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.delete(currentStep);
      return next;
    });
  };

  const goNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setPlaying(false);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setPlaying(false);
    }
  };

  const allDone = completedSteps.size === DEMO_STEPS.length;
  const stepInfo = DEMO_STEPS[currentStep];
  const Icon = stepInfo.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Interactive Demo</h1>
        <p className="mt-1 text-muted-foreground">
          Walk through the full startup lifecycle — from registration to soulbound badge
        </p>
      </div>

      {/* Step Progress */}
      <div className="mb-8 flex items-center justify-between">
        {DEMO_STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const done = completedSteps.has(i);
          const active = i === currentStep;
          return (
            <button
              key={i}
              onClick={() => { setCurrentStep(i); setPlaying(false); }}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  done ? 'border-accent bg-accent/10' :
                  active ? 'border-primary bg-primary/10 scale-110' :
                  'border-muted bg-muted/30'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <StepIcon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
              {i < DEMO_STEPS.length - 1 && (
                <div className="absolute" />
              )}
            </button>
          );
        })}
      </div>

      {/* Connecting lines */}
      <div className="relative -mt-[4.5rem] mb-8 flex justify-between px-5 pointer-events-none">
        {DEMO_STEPS.slice(0, -1).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 mx-3 mt-5 rounded ${
              completedSteps.has(i) ? 'bg-accent' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Current Step Header */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: stepInfo.color + '15', color: stepInfo.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{stepInfo.title}</h2>
            <p className="text-sm text-muted-foreground">{stepInfo.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 0 && <StepRegister playing={playing} onComplete={handleComplete} />}
          {currentStep === 1 && <StepPublish playing={playing} onComplete={handleComplete} />}
          {currentStep === 2 && <StepVerify playing={playing} onComplete={handleComplete} />}
          {currentStep === 3 && <StepBadge playing={playing} onComplete={handleComplete} />}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <Button
          onClick={handlePlay}
          disabled={playing}
          className="gap-2 px-6"
          style={!playing ? { backgroundColor: stepInfo.color } : undefined}
        >
          {playing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Simulating…
            </>
          ) : completedSteps.has(currentStep) ? (
            <>
              <Play className="h-4 w-4" /> Replay
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Run Step
            </>
          )}
        </Button>

        {completedSteps.has(currentStep) && currentStep < DEMO_STEPS.length - 1 ? (
          <Button onClick={goNext} className="gap-1">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-24" />
        )}
      </div>

      {/* Completion */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border-2 border-accent/40 bg-accent/5 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <Zap className="h-7 w-7 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold">Demo Complete!</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              You've walked through the full ChainMetrics lifecycle: registration, metric publishing,
              oracle verification, and soulbound badge issuance.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  <Rocket className="h-4 w-4" /> Register for Real
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
