import { Rocket, Settings } from 'lucide-react';

export default function HeaderNav() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/30">
            <Rocket size={18} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">VibeFeed</div>
            <div className="text-xs text-white/60">All your vibes, one playful stream</div>
          </div>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <a href="#feed" className="rounded-md px-3 py-2 text-white/80 hover:text-white">Feed</a>
          <a href="#controls" className="rounded-md px-3 py-2 text-white/80 hover:text-white">Sources</a>
          <button className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white/80 hover:bg-white/10">
            <Settings size={16} />
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}
