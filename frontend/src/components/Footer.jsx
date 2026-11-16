import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Our story" },
  { to: "/members", label: "Members" },
  { to: "/runs/register", label: "Sunday runs" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[#141714]">
      <div className="mx-auto grid max-w-6xl gap-9 px-6 py-10 md:grid-cols-[1.4fr_0.7fr_1fr] md:py-12">
        <div>
          <NavLink to="/" className="inline-flex items-baseline gap-2"><span className="font-display text-3xl font-black tracking-tighter text-primary">645</span><span className="font-display text-base font-semibold text-white">Run Club</span></NavLink>
          <p className="mt-4 max-w-sm text-sm leading-6 text-offwhite/55">A local running community in Dwarka. Good mornings, steady miles and better company.</p>
          <a href="https://instagram.com/645_runclub" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-primary transition hover:text-white">Find us on Instagram <span aria-hidden="true">↗</span></a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white">Explore</p>
          <ul className="mt-4 space-y-3">{links.map((link) => <li key={link.to}><NavLink to={link.to} className="text-sm text-offwhite/55 transition hover:text-white">{link.label}</NavLink></li>)}</ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white">Meet us on Sunday</p>
          <p className="mt-4 text-sm text-offwhite/55">Dwarka Sector 19B Park</p>
          <p className="mt-2 text-sm font-medium text-white">6:15 AM <span className="mx-2 text-offwhite/30">·</span> 3 / 5 / 10 KM</p>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-offwhite/35 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} 645 Run Club</p><p>Run together. Keep showing up.</p></div></div>
    </footer>
  );
}