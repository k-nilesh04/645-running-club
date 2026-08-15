import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authChangedEvent, clearAuthSession, isLoggedIn } from "../utils/auth.js";
import { logoutUser } from "../api/api.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
];

const privateLinks = [
  { to: "/runs/register", label: "Run Register" },
];



export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [userInitial, setUserInitial] = useState("U");
  const [currentUser, setCurrentUser] = useState({ role: "member" });
  const navigate = useNavigate();
  
  const handlePrivateLinkClick = (event, to) => {
    if (loggedIn) return;

    event.preventDefault();
    navigate("/auth", { state: { from: to } });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      setLoggedIn(isLoggedIn());

      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setCurrentUser(user);
        setUserInitial((user.name || user.email || "U").trim().charAt(0).toUpperCase());
      } catch (error) {
        setCurrentUser({ role: "member" });
        setUserInitial("U");
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Local logout should still happen if the backend session is already gone.
    } finally {
      clearAuthSession();
      setMenuOpen(false);
      navigate("/auth");
    }
  };

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
          Run Club
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
          {
            privateLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={(event) => handlePrivateLinkClick(event, link.to)}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          {loggedIn && (
            <NavLink to="/join" className="btn-primary py-2 px-5 text-sm">
              Join Club
            </NavLink>
          )}
          {loggedIn && currentUser.role === "admin" && (
            <NavLink to="/admin" className="text-sm text-primary hover:text-white font-display font-medium">
              Admin
            </NavLink>
          )}
          {loggedIn ? (
            <>
              <NavLink
                to="/profile"
                aria-label="Profile"
                title="Profile"
                className={({ isActive }) =>
                  `w-10 h-10 rounded-full flex items-center justify-center font-display font-bold border transition-colors ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-dark text-primary border-primary/60 hover:bg-primary hover:text-white"
                  }`
                }
              >
                {userInitial}
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn-outline py-2 px-5 text-sm">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="btn-outline py-2 px-5 text-sm">
              Login
            </NavLink>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          {loggedIn && (
            <NavLink
              to="/profile"
              aria-label="Profile"
              title="Profile"
              className={({ isActive }) =>
                `w-10 h-10 rounded-full flex items-center justify-center font-display font-bold border transition-colors ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-dark text-primary border-primary/60 hover:bg-primary hover:text-white"
                }`
              }
            >
              {userInitial}
            </NavLink>
          )}
          <button
            className="text-white font-medium border border-white rounded px-3 py-1 hover:bg-white hover:text-dark transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
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
          {
            privateLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={(event) => {
                  handlePrivateLinkClick(event, link.to);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </NavLink>
            ))}
          {loggedIn && (
            <NavLink to="/join" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
              Join Club
            </NavLink>
          )}
          {loggedIn && currentUser.role === "admin" && (
            <NavLink
              to="/admin"
              className="font-display text-sm font-medium text-primary hover:text-white"
              onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          {loggedIn ? (
            <button type="button" onClick={handleLogout} className="btn-outline text-center">
              Logout
            </button>
          ) : (
            <NavLink to="/auth" className="btn-outline text-center" onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
