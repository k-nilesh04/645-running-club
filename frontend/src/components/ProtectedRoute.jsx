import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/auth.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
}
