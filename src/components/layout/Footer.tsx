import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-foreground">ChainMetrics © 2024</p>
          <p className="text-xs text-muted-foreground">Transparent on-chain startup metrics</p>
        </div>
        <div className="flex gap-6">
          {['Docs', 'GitHub', 'Discord'].map((l) => (
            <a key={l} href="#" className="text-sm text-muted-foreground transition hover:text-foreground">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-primary-foreground">B</span>
          Built on Base
        </div>
      </div>
    </footer>
  );
}
