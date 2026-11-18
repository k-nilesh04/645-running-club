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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    `nav-link whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all xl:text-sm ${isActive ? "is-active" : ""}`;

  return (
    <header className={`site-header sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "site-header-scrolled" : ""}`}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-7 lg:gap-6 lg:px-10">
        <NavLink to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3" aria-label="645 Run Club home">
          <span className="brand-mark grid h-11 w-11 place-items-center rounded-2xl font-display text-lg font-black tracking-tighter">645</span>
          <span className="leading-tight"><span className="block font-display text-sm font-bold tracking-wide text-white">RUN CLUB</span><span className="mt-1 block text-[9px] font-medium uppercase tracking-[.2em] text-white/45">Dwarka · Delhi</span></span>
        </NavLink>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {primaryLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>{link.label}</NavLink>)}
          {loggedIn && currentUser.role === "admin" && <NavLink to="/admin" className={navClass}>Admin</NavLink>}
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          {loggedIn ? (
            <>
              <NavLink to="/profile" className="profile-avatar" aria-label="Open profile">{userInitial}</NavLink>
              <button type="button" onClick={handleLogout} className="text-xs font-medium text-white/55 transition hover:text-white lg:text-sm">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/auth" className="text-xs font-semibold text-white/65 transition hover:text-white lg:text-sm">Log in</NavLink>
              <NavLink to="/auth" className="btn-primary !px-5 !py-2.5 !text-xs">Join the club <span aria-hidden="true">↗</span></NavLink>
            </>
          )}
        </div>

        <button type="button" className="mobile-menu-button grid h-10 w-10 shrink-0 place-items-center rounded-xl lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen}>
          <span className="text-xl leading-none">{menuOpen ? "×" : "≡"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu border-t border-white/10 px-5 pb-5 pt-3 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col">
            {primaryLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu} className={({ isActive }) => `border-b border-white/10 py-3 text-sm font-medium ${isActive ? "text-[#b9ed89]" : "text-white/70"}`}>{link.label}</NavLink>)}
            {loggedIn && currentUser.role === "admin" && <NavLink to="/admin" onClick={closeMenu} className="border-b border-white/10 py-3 text-sm text-[#b9ed89]">Admin</NavLink>}
            <div className="flex items-center justify-between pt-4">
              {loggedIn ? <><NavLink to="/profile" onClick={closeMenu} className="text-sm text-white">My profile</NavLink><button type="button" onClick={handleLogout} className="text-sm text-[#b9ed89]">Log out</button></> : <><NavLink to="/auth" onClick={closeMenu} className="text-sm text-white/70">Log in</NavLink><NavLink to="/auth" onClick={closeMenu} className="text-sm font-semibold text-[#b9ed89]">Join the club →</NavLink></>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}