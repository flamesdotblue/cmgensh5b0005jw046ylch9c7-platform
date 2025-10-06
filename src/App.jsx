import { useCallback, useEffect, useMemo, useState } from 'react';
import HeaderNav from './components/HeaderNav';
import Hero from './components/Hero';
import Controls from './components/Controls';
import FeedGrid from './components/FeedGrid';

function normalizeItem({ id, source, author, title, url, ts, meta = {} }) {
  return { id, source, author, title, url, ts, meta };
}

async function fetchHN(page = 0) {
  const url = `https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=30&page=${page}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('HN fetch failed');
  const data = await r.json();
  return data.hits.map((h) =>
    normalizeItem({
      id: `hn_${h.objectID}`,
      source: 'hn',
      author: h.author,
      title: h.title || h.story_title || 'HN Story',
      url: h.url || h.story_url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      ts: new Date(h.created_at).getTime(),
      meta: { points: h.points ?? 0, comments: h.num_comments ?? 0 },
    })
  );
}

async function fetchReddit() {
  const url = `https://www.reddit.com/r/all/new.json?limit=30`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Reddit fetch failed');
  const data = await r.json();
  return data.data.children.map(({ data: d }) =>
    normalizeItem({
      id: `reddit_${d.id}`,
      source: 'reddit',
      author: d.author,
      title: d.title,
      url: d.url_overridden_by_dest || `https://reddit.com${d.permalink}`,
      ts: d.created_utc * 1000,
      meta: { subreddit: d.subreddit, score: d.score, comments: d.num_comments },
    })
  );
}

async function fetchGitHub() {
  const url = `https://api.github.com/events`;
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error('GitHub fetch failed');
  const data = await r.json();
  return data.map((ev) => {
    const title = `${ev.type} — ${ev.repo?.name || ''}`;
    const url = `https://github.com/${ev.repo?.name || ''}`;
    return normalizeItem({
      id: `gh_${ev.id}`,
      source: 'github',
      author: ev.actor?.login || 'unknown',
      title,
      url,
      ts: new Date(ev.created_at).getTime(),
      meta: { type: ev.type },
    });
  });
}

async function fetchRSS(rssUrl) {
  if (!rssUrl) return [];
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  const r = await fetch(api);
  if (!r.ok) throw new Error('RSS fetch failed');
  const data = await r.json();
  if (!data.items) return [];
  return data.items.slice(0, 30).map((item) =>
    normalizeItem({
      id: `rss_${(item.guid || item.link || item.title).slice(0, 64)}`,
      source: 'rss',
      author: item.author || data.feed?.title || '',
      title: item.title,
      url: item.link,
      ts: new Date(item.pubDate || Date.now()).getTime(),
      meta: { feed: data.feed?.title || 'RSS' },
    })
  );
}

export default function App() {
  const [enabledSources, setEnabledSources] = useState(new Set(['hn', 'reddit', 'github']));
  const [rssUrl, setRssUrl] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const activeTags = useMemo(() => Array.from(enabledSources), [enabledSources]);

  const load = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const tasks = [];
      if (enabledSources.has('hn')) tasks.push(fetchHN(page));
      if (enabledSources.has('reddit')) tasks.push(fetchReddit());
      if (enabledSources.has('github')) tasks.push(fetchGitHub());
      if (enabledSources.has('rss') && rssUrl) tasks.push(fetchRSS(rssUrl));
      const results = await Promise.allSettled(tasks);
      const merged = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
      merged.sort((a, b) => b.ts - a.ts);
      setItems(merged);
    } catch (e) {
      setError('Some sources failed to load. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }, [enabledSources, page, rssUrl, loading]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTags.join('|'), page, rssUrl]);

  // Infinite scroll
  useEffect(() => {
    function onScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom && !loading) setPage((p) => p + 1);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.title?.toLowerCase().includes(q) || it.author?.toLowerCase().includes(q));
  }, [items, query]);

  function toggleSource(key) {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleRefresh() {
    setPage(0);
    load();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeaderNav />
      <Hero />
      <main className="mx-auto max-w-6xl px-4 md:px-6">
        <Controls
          enabledSources={enabledSources}
          toggleSource={toggleSource}
          rssUrl={rssUrl}
          setRssUrl={setRssUrl}
          query={query}
          setQuery={setQuery}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
        )}

        <FeedGrid items={filtered} loading={loading} />
      </main>

      <footer className="mt-14 border-t border-white/10 py-10 text-center text-sm text-white/60">
        VibeFeed • Built with React + Tailwind. Public data from Hacker News, Reddit, GitHub and your RSS.
      </footer>
    </div>
  );
}
