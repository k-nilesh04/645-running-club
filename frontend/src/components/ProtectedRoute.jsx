import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authChangedEvent, isLoggedIn } from "../utils/auth.js";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    const syncAuthentication = () => setAuthenticated(isLoggedIn());
    window.addEventListener(authChangedEvent, syncAuthentication);
    window.addEventListener("storage", syncAuthentication);
    return () => {
      window.removeEventListener(authChangedEvent, syncAuthentication);
      window.removeEventListener("storage", syncAuthentication);
    };
  }, []);

  if (!authenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole) {
    let storedUser = {};
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      storedUser = {};
    }

    if (storedUser.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
