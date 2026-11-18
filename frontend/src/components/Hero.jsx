import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-shell relative isolate overflow-hidden">
      <div className="hero-photo absolute inset-0 -z-20" aria-hidden="true" />
      <div className="hero-overlay absolute inset-0 -z-10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-[#a9e66e]/10 blur-3xl" />
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-7 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-white/90 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#a9e66e] shadow-[0_0_14px_#a9e66e]" />
            Dwarka, New Delhi · Every Sunday
          </div>
          <h1 className="font-display text-5xl font-bold leading-[.99] tracking-[-.06em] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Find your<br />pace. <span className="text-[#b9ed89]">Find your</span><br /><span className="text-[#b9ed89]">people.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            More than a Sunday run. A community to move with, grow with and feel better with — one kilometre at a time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <NavLink to="/join" className="btn-primary">Run with us <span aria-hidden="true">↗</span></NavLink>
            <a href="#sunday-run" className="hero-secondary">Explore the club <span aria-hidden="true">↓</span></a>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6 text-xs font-medium text-white/65">
            <span><strong className="mr-2 text-white">03</strong> distance options</span>
            <span><strong className="mr-2 text-white">01</strong> welcoming community</span>
            <span><strong className="mr-2 text-white">∞</strong> good energy</span>
          </div>
        </div>

        <aside className="hero-plan-card ml-auto w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Your Sunday reset</p>
            <span className="rounded-full border border-[#a9e66e]/30 bg-[#a9e66e]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#c9f5a5]">Open to all</span>
          </div>
          <p className="mt-8 font-display text-6xl font-bold tracking-[-.06em] text-white sm:text-7xl">6:15<span className="ml-2 text-2xl font-semibold text-[#b9ed89]">AM</span></p>
          <p className="mt-2 text-sm text-white/60">A fresh start at Dwarka Sector 19B Park</p>
          <div className="my-7 h-px bg-white/15" />
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-white/55">Choose your distance</p>
          <div className="grid grid-cols-3 gap-2">
            {["3 KM", "5 KM", "10 KM"].map((distance, index) => (
              <div key={distance} className={`rounded-2xl border p-3 text-center ${index === 1 ? "border-[#a9e66e]/50 bg-[#a9e66e]/10" : "border-white/10 bg-white/[.04]"}`}>
                <p className="font-display text-xl font-bold text-white sm:text-2xl">{distance}</p>
                <p className="mt-1 text-[10px] text-white/50">{["Easy", "Steady", "Challenge"][index]}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white/[.06] p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#a9e66e]/15 text-lg text-[#b9ed89]">✳</span>
            <div><p className="text-sm font-semibold text-white">Come as you are.</p><p className="mt-1 text-xs text-white/50">Walk, jog or run. Your pace belongs here.</p></div>
          </div>
        </aside>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a9e66e]/50 to-transparent" />
    </section>
  );
}