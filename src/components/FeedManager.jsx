import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function FeedManager({ onAdd, onClear, count }) {
  const [url, setUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      onAdd(trimmed);
      setUrl('');
    } catch {
      alert('Please enter a valid URL');
    }
  }

  return (
    <section id="add" className="-mt-16 relative z-10 mx-auto -mb-2 w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          placeholder="Paste a post URL from X, YouTube, TikTok, Instagram, Reddit..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0 placeholder:text-white/40 focus:border-fuchsia-500/50"
        />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:opacity-95">
          <Plus size={16} />
          Add
        </button>
      </form>
      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
        <span>{count} source{count === 1 ? '' : 's'} in your VibeFeed</span>
        <button onClick={onClear} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10">
          <Trash2 size={14} /> Clear all
        </button>
      </div>
    </section>
  );
}
