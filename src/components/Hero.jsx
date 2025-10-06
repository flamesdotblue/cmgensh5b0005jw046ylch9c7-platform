export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[44vh] w-full overflow-hidden md:h-[56vh]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(124,92,255,0.25),transparent_60%),radial-gradient(1200px_600px_at_100%_0%,rgba(0,225,255,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950" />
        <div className="absolute inset-0 grid place-items-center px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance bg-gradient-to-br from-white to-white/70 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl">
              All your social vibes. One feed.
            </h1>
            <p className="mt-4 text-pretty text-white/80 sm:text-lg">
              A vibrant stream mixing Hacker News, Reddit, GitHub, and your favorite RSS into one playful timeline.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="#controls" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90">Choose sources</a>
              <a href="#feed" className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">View feed</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
