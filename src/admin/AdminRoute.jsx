import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext.jsx";

/**
 * UX guard only — the backend enforces ADMIN + per-permission authorization
 * on every admin endpoint regardless of what this component renders.
 */
export default function AdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#141009] text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p className="mt-3 text-sm">Checking admin session...</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
