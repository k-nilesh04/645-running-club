export const authChangedEvent = "auth-changed";

export const getStoredToken = () => localStorage.getItem("token");

export const isLoggedIn = () => Boolean(getStoredToken());

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  window.dispatchEvent(new Event(authChangedEvent));
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(authChangedEvent));
};
