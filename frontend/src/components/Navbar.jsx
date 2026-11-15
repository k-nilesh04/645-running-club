import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api.js";
import { authChangedEvent, clearAuthSession, isLoggedIn } from "../utils/auth.js";

const primaryLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
  { to: "/runs/register", label: "Runs" },
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
      try {
        setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
      } catch {
        setCurrentUser({});
      }
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
    try {
      await logoutUser();
    } catch {
      // Clear the local display state even if the previous session has expired.
    } finally {
      clearAuthSession();
      closeMenu();
      navigate("/", { replace: true });
    }
  };

  const navClass = ({ isActive }) =>
    `relative py-2 font-display text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:bg-primary after:transition-all ${
      isActive ? "text-white after:w-full" : "text-offwhite/65 hover:text-white after:w-0 hover:after:w-full"
    }`;

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${
      scrolled ? "border-white/10 bg-dark/95 shadow-xl shadow-black/20 backdrop-blur-xl" : "border-transparent bg-dark/80 backdrop-blur-md"
    }`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <NavLink to="/" onClick={closeMenu} className="group flex items-center gap-3" aria-label="645 Run Club home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-sm font-extrabold tracking-tight text-white shadow-lg shadow-primary/20 transition-transform group-hover:-rotate-6">
            645
          </span>
          <span className="leading-none">
            <span className="block font-display text-base font-bold tracking-tight text-white">Run Club</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Every Sunday</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-7 lg:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
          {loggedIn && currentUser.role === "admin" && (
            <NavLink to="/admin" className={navClass}>Admin</NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <>
              <NavLink to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-bold text-primary transition hover:bg-primary hover:text-white" aria-label="Open profile">
                {userInitial}
              </NavLink>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-offwhite/65 transition hover:text-white">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/auth" className="px-2 py-2 text-sm font-medium text-offwhite/75 transition hover:text-white">Log in</NavLink>
              <NavLink to="/auth" className="btn-primary px-5 py-2.5 text-sm">Join the club</NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white transition hover:border-primary/60 hover:bg-primary/10 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-lg leading-none">{menuOpen ? "×" : "≡"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#161616] px-5 pb-6 pt-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu} className={({ isActive }) => `rounded-xl px-4 py-3 font-display text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-offwhite/75 hover:bg-white/5 hover:text-white"}`}>
                {link.label}
              </NavLink>
            ))}
            {loggedIn && currentUser.role === "admin" && (
              <NavLink to="/admin" onClick={closeMenu} className="rounded-xl px-4 py-3 font-display text-sm font-medium text-primary hover:bg-primary/10">Admin</NavLink>
            )}
            <div className="mt-3 border-t border-white/10 pt-4">
              {loggedIn ? (
                <div className="flex items-center justify-between px-4">
                  <NavLink to="/profile" onClick={closeMenu} className="font-display text-sm font-medium text-white">My profile</NavLink>
                  <button type="button" onClick={handleLogout} className="text-sm font-medium text-primary">Log out</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NavLink to="/auth" onClick={closeMenu} className="btn-outline px-4 py-2.5 text-center text-sm">Log in</NavLink>
                  <NavLink to="/auth" onClick={closeMenu} className="btn-primary px-4 py-2.5 text-center text-sm">Join now</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
