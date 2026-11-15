import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
  { to: "/runs/register", label: "Run register" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#141414]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_0.8fr_1fr] md:py-16">
        <div>
          <NavLink to="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-sm font-extrabold text-white">645</span>
            <span className="font-display text-lg font-bold text-white">Run Club</span>
          </NavLink>
          <p className="mt-5 max-w-sm text-sm leading-6 text-offwhite/60">
            A community built around one simple habit: showing up every Sunday.
          </p>
          <a href="https://instagram.com/645_runclub" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-white">
            Follow on Instagram <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Explore</p>
          <ul className="mt-5 space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="text-sm text-offwhite/60 transition hover:text-primary">{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Sunday run</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-offwhite/45">Meet at</dt>
              <dd className="mt-1 font-medium text-offwhite">Dwarka Sector 19B Park</dd>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-offwhite/45">Time</dt>
                <dd className="mt-1 font-medium text-accent">6:15 AM</dd>
              </div>
              <div>
                <dt className="text-offwhite/45">Distances</dt>
                <dd className="mt-1 font-medium text-offwhite">3 / 5 / 10 KM</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-offwhite/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 645 Run Club</p>
          <p>Run every Sunday. Stay healthy. Inspire others.</p>
        </div>
      </div>
    </footer>
  );
}
