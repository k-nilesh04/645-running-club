import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display font-bold text-white">645 Dwarka Chapter Running Club</p>
          <p className="text-sm text-offwhite/60">Run Every Sunday.</p>
        </div>

        <div className="flex gap-6 text-sm text-offwhite/70">

          <NavLink to="/" className="hover:text-primary">
            Email
          </NavLink>
          <a href="https://instagram.com/645dwarkachapter" target="_blank" rel="noreferrer" className="hover:text-primary">
            Instagram
          </a>
          
        </div>

        <p className="text-xs text-offwhite/40">Copyright {new Date().getFullYear()} 645 Dwarka Chapter Running Club</p>
      </div>
    </footer>
  );
}
