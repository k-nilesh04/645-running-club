import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api.js";
import { authChangedEvent, clearAuthSession, isLoggedIn } from "../utils/auth.js";

const primaryLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "Our story" },
  { to: "/members", label: "Members" },
  { to: "/runs/register", label: "Sunday runs" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      setLoggedIn(isLoggedIn());
      try { setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}")); }
      catch { setCurrentUser({}); }
    };
    syncAuth();
    window.addEventListener(authChangedEvent, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(authChangedEvent, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const userInitial = (currentUser.name || currentUser.email || "U").trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* Expired sessions still need local cleanup. */ }
    finally {
      clearAuthSession();
      closeMenu();
      navigate("/", { replace: true });
    }
  };

  const navClass = ({ isActive }) =>
    `whitespace-nowrap border-b-2 py-2 text-xs font-medium transition-colors xl:text-sm ${isActive ? "border-primary text-white" : "border-transparent text-offwhite/60 hover:text-white"}`;

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${scrolled ? "border-white/10 bg-[#171b18]/95 backdrop-blur" : "border-white/5 bg-[#171b18]"}`}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:gap-6 lg:px-8 lg:py-3.5">
        <NavLink to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="645 Run Club home">
          <span className="font-display text-2xl font-black tracking-tighter text-primary">645<span className="text-white">.</span></span>
          <span className="border-l border-white/15 pl-2.5 leading-tight sm:pl-3"><span className="block font-display text-sm font-semibold text-white">Run Club</span><span className="mt-1 block text-[9px] uppercase tracking-[0.17em] text-offwhite/45">Dwarka, Delhi</span></span>
        </NavLink>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex lg:gap-5 xl:gap-7">
          {primaryLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>{link.label}</NavLink>)}
          {loggedIn && currentUser.role === "admin" && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-4">
          {loggedIn ? (
            <>
              <NavLink to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white transition hover:border-primary hover:text-primary" aria-label="Open profile">{userInitial}</NavLink>
              <button type="button" onClick={handleLogout} className="whitespace-nowrap text-xs text-offwhite/55 transition hover:text-white lg:text-sm">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/auth" className="whitespace-nowrap text-xs text-offwhite/65 transition hover:text-white lg:text-sm">Log in</NavLink>
              <NavLink to="/auth" className="whitespace-nowrap border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white lg:px-4 lg:text-sm">Join the club</NavLink>
            </>
          )}
        </div>

        <button type="button" className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-white md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen}>
          <span className="text-xl leading-none">{menuOpen ? "×" : "≡"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#171b18] px-6 pb-5 pt-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col">
            {primaryLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu} className={({ isActive }) => `border-b border-white/10 py-3 text-sm ${isActive ? "text-primary" : "text-offwhite/75"}`}>{link.label}</NavLink>)}
            {loggedIn && currentUser.role === "admin" && <NavLink to="/admin" onClick={closeMenu} className="border-b border-white/10 py-3 text-sm text-primary">Admin</NavLink>}
            <div className="flex items-center justify-between pt-4">
              {loggedIn ? <><NavLink to="/profile" onClick={closeMenu} className="text-sm text-white">My profile</NavLink><button type="button" onClick={handleLogout} className="text-sm text-primary">Log out</button></> : <><NavLink to="/auth" onClick={closeMenu} className="text-sm text-offwhite/70">Log in</NavLink><NavLink to="/auth" onClick={closeMenu} className="text-sm font-semibold text-primary">Join the club →</NavLink></>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}