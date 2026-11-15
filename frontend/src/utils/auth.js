export const authChangedEvent = "auth-changed";
const userKey = "user";
const legacyTokenKey = "token";

// Versions before cookie sessions stored a JWT in localStorage. Treat that data as
// an expired session so an upgraded browser is redirected to Log in cleanly.
const discardLegacySession = () => {
  if (localStorage.getItem(legacyTokenKey)) {
    localStorage.removeItem(legacyTokenKey);
    localStorage.removeItem(userKey);
  }
};

discardLegacySession();

export const getStoredToken = () => null;

export const isLoggedIn = () => {
  try {
    return Boolean(JSON.parse(localStorage.getItem(userKey) || "null"));
  } catch {
    return false;
  }
};

// Authentication is held in the server-issued HttpOnly cookie. The browser stores
// only non-sensitive display data for routing and navigation state.
export const saveAuthSession = ({ user }) => {
  localStorage.removeItem(legacyTokenKey);
  if (user) localStorage.setItem(userKey, JSON.stringify(user));
  window.dispatchEvent(new Event(authChangedEvent));
};

export const clearAuthSession = () => {
  localStorage.removeItem(legacyTokenKey);
  localStorage.removeItem(userKey);
  window.dispatchEvent(new Event(authChangedEvent));
};
