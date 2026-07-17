import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import JoinClub from "../pages/JoinClub";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `font-display text-sm font-medium transition-colors ${
      isActive ? "text-primary" : "text-offwhite hover:text-primary"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-lg shadow-black/40 bg-dark/95 backdrop-blur" : "bg-dark/80 backdrop-blur"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg text-white">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">
            645
          </span>
          Dwarka Chapter Running Club
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/join" className="btn-primary py-2 px-5 text-sm">
            Join Club
          </NavLink>
        </div>

        <button
          className="md:hidden text-white font-medium border border-white rounded mx-2 px-3 py-1 hover:bg-white hover:text-dark transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/join" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
            Join Club
          </NavLink>
        </div>
      )}
    </header>
  );
}
