import { useId } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Controls({ enabledSources, toggleSource, rssUrl, setRssUrl, query, setQuery, onRefresh, loading }) {
  const searchId = useId();
  const rssId = useId();

  const isOn = (k) => enabledSources.has(k);

  return (
    <section id="controls" className="-mt-10 relative z-10 mx-auto -mb-2 w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor={searchId} className="sr-only">Search</label>
          <input
            id={searchId}
            type="search"
            placeholder="Search posts, users, keywords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm placeholder:text-white/40 focus:border-fuchsia-500/50 focus:outline-none"
          />
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['hn', 'reddit', 'github', 'rss'].map((src) => (
            <button
              key={src}
              onClick={() => toggleSource(src)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                isOn(src)
                  ? 'border-fuchsia-400/30 bg-fuchsia-500/15 text-fuchsia-200'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isOn(src) ? '#f0abfc' : '#64748b' }}
              ></span>
              {src.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={rssId} className="text-xs text-white/60">RSS/Atom URL</label>
          <input
            id={rssId}
            type="url"
            placeholder="https://example.com/feed.xml"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            className="w-full min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs placeholder:text-white/40 focus:border-cyan-400/50 focus:outline-none md:w-96"
          />
        </div>
      </div>
    </section>
  );
}
