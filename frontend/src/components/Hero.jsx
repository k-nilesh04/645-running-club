import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(15,157,88,0.32),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(255,213,79,0.14),transparent_24%),linear-gradient(135deg,#101512_0%,#1a1a1a_55%,#102319_100%)]" />
      <div className="absolute -right-24 top-12 h-72 w-72 rounded-full border border-primary/20" />
      <div className="absolute -right-10 top-28 h-48 w-48 rounded-full border border-primary/15" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.25fr_0.75fr] md:items-end md:py-28">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Every Sunday · 6:15 AM
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-7xl">
            Start your Sunday
            <span className="block text-primary">in motion.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-offwhite/75 md:text-lg">
            645 Run Club brings people together at Dwarka Sector 19B Park to build a healthier routine, one Sunday run at a time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <NavLink to="/join" className="btn-primary">
              Join the club
            </NavLink>
            <a href="#sunday-run" className="btn-outline border-white/25 text-white hover:border-primary">
              This Sunday&apos;s run
            </a>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-7">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">Weekly meet-up</p>
          <div className="mt-7 space-y-6">
            <div>
              <p className="text-sm text-offwhite/55">Meet at</p>
              <p className="mt-1 font-display text-xl font-semibold text-white">Dwarka Sector 19B Park</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5">
              <div>
                <p className="text-sm text-offwhite/55">Time</p>
                <p className="mt-1 font-display text-lg font-semibold text-accent">6:15 AM</p>
              </div>
              <div>
                <p className="text-sm text-offwhite/55">Options</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">3 · 5 · 10 KM</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-offwhite/70">Run every Sunday. Stay healthy. Inspire others.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
