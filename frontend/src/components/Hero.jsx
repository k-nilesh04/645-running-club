import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section className="border-b border-white/10 bg-[#171b18]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Dwarka · Every Sunday · 6:15 AM</p>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
            A better Sunday<br /><span className="text-primary">starts with a run.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-offwhite/65 md:text-lg">
            A local running community for people who want to move more, meet good people and build a healthy habit — one Sunday at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink to="/join" className="btn-primary">Join the club</NavLink>
            <a href="#sunday-run" className="btn-outline border-white/25 text-white hover:border-primary">Know the routine</a>
          </div>
        </div>
        <aside className="border-l border-primary/40 pl-6 md:ml-8 md:pl-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The Sunday plan</p>
          <p className="mt-5 font-display text-4xl font-bold text-white">6:15<span className="text-primary"> AM</span></p>
          <p className="mt-1 text-sm text-offwhite/55">Meet at Dwarka Sector 19B Park</p>
          <div className="mt-7 flex gap-6 border-t border-white/10 pt-5">
            <div><p className="font-display text-2xl font-bold text-white">3 KM</p><p className="mt-1 text-xs text-offwhite/45">Easy start</p></div>
            <div><p className="font-display text-2xl font-bold text-white">5 KM</p><p className="mt-1 text-xs text-offwhite/45">Find your pace</p></div>
            <div><p className="font-display text-2xl font-bold text-white">10 KM</p><p className="mt-1 text-xs text-offwhite/45">Go further</p></div>
          </div>
        </aside>
      </div>
    </section>
  );
}