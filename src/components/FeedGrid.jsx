function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function extraMeta(it) {
  if (it.source === 'hn') return `${it.meta.points ?? 0} points • ${it.meta.comments ?? 0} comments`;
  if (it.source === 'reddit') return `r/${it.meta.subreddit} • ${it.meta.score ?? 0} points • ${it.meta.comments ?? 0} comments`;
  if (it.source === 'github') return it.meta.type || '';
  if (it.source === 'rss') return it.meta.feed || 'RSS';
  return '';
}

function badgeStyles(source) {
  const map = {
    hn: 'bg-orange-400 text-slate-900',
    reddit: 'bg-orange-500 text-slate-900',
    github: 'bg-emerald-400 text-slate-900',
    rss: 'bg-amber-400 text-slate-900',
  };
  return map[source] || 'bg-white text-slate-900';
}

export default function FeedGrid({ items, loading }) {
  return (
    <section id="feed" className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your VibeFeed</h2>
          <p className="text-sm text-white/60">Mixed posts sorted by time from your selected sources.</p>
        </div>
        {loading && <div className="text-sm text-white/60">Loading vibes…</div>}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article key={it.id} className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-blue-500/5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles(it.source)}`}>
                {it.source.toUpperCase()}
              </span>
              <span className="text-xs text-white/60">by {it.author || 'unknown'} • {timeAgo(it.ts)}</span>
            </div>
            <a className="block text-base font-semibold leading-snug text-white hover:underline" href={it.url} target="_blank" rel="noreferrer">
              {it.title || 'Untitled'}
            </a>
            <div className="mt-2 text-xs text-white/60">{extraMeta(it)}</div>
          </article>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/70">
          No items yet. Try enabling more sources or refreshing.
        </div>
      )}
    </section>
  );
}
