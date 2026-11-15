export const authChangedEvent = "auth-changed";
const userKey = "user";

export const getStoredToken = () => null;

export const isLoggedIn = () => {
  try {
    return Boolean(JSON.parse(localStorage.getItem(userKey) || "null"));
  } catch {
    return false;
  }
};

// Authentication is held in the server-issued HttpOnly cookie. The browser stores
// only non-sensitive display data for routing and the navigation state.
export const saveAuthSession = ({ user }) => {
  localStorage.removeItem("token");
  if (user) localStorage.setItem(userKey, JSON.stringify(user));
  window.dispatchEvent(new Event(authChangedEvent));
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem(userKey);
  window.dispatchEvent(new Event(authChangedEvent));
};
