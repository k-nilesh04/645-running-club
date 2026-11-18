import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Our story" },
  { to: "/members", label: "Members" },
  { to: "/runs/register", label: "Sunday runs" },
];

export default function Footer() {
  return (
    <footer className="site-footer mt-16 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-7 md:grid-cols-[1.4fr_.7fr_1fr] lg:px-10 lg:py-16">
        <div>
          <NavLink to="/" className="inline-flex items-center gap-3"><span className="brand-mark grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-black">645</span><span className="font-display text-lg font-bold text-white">Run Club<span className="text-[#a9e66e]">.</span></span></NavLink>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">A community built around movement, meaningful connections and the simple joy of showing up. See you on Sunday.</p>
          <a href="https://instagram.com/645_runclub" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b9ed89] transition hover:text-white">Follow our journey <span aria-hidden="true">↗</span></a>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-3">{links.map((link) => <li key={link.to}><NavLink to={link.to} className="text-sm text-white/55 transition hover:text-[#b9ed89]">{link.label}</NavLink></li>)}</ul>
        </div>

        <div className="footer-meet-card rounded-3xl p-6">
          <p className="eyebrow">Save your Sunday</p>
          <p className="mt-4 font-display text-2xl font-bold text-white">6:15 AM<span className="text-[#b9ed89]">.</span></p>
          <p className="mt-2 text-sm text-white/55">Dwarka Sector 19B Park</p>
          <p className="mt-5 border-t border-white/10 pt-4 text-xs text-white/45">3 KM · 5 KM · 10 KM</p>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10"><p>© {new Date().getFullYear()} 645 Run Club</p><p>Move together. Feel better. Keep showing up.</p></div></div>
    </footer>
  );
}