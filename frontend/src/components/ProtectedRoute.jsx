import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole) {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
