import { Navigate } from "react-router-dom";
import {
  isAuthenticated,
  getAuthUser,
  clearAuthSession,
  hasRole,
} from "../../utils/authStorage.js";

export default function ProtectedRoute({ allowedRoles, children }) {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const user = getAuthUser();

  if (!user || !user.role) {
    clearAuthSession();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const authorized = allowedRoles.some((role) => hasRole(role));
    if (!authorized) {
      if (user.role === "pasien") {
        return <Navigate to="/pasien/beranda" replace />;
      }
      if (user.role === "resepsionis") {
        return <Navigate to="/resepsionis/dashboard" replace />;
      }
      clearAuthSession();
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
