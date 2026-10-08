import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import { getErrorMessage } from "../utils/helpers.js";

export default function AdminLoginPage() {
  const { admin, loading: authLoading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#141009] text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Signed in");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#141009]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white font-display font-bold text-xl shadow-sm mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-[#EDE5D1]">
            MoneyLog Admin
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-[#9C927A]">
            Sign in with an administrator account
          </p>
          <span className="mt-3 block h-0.5 w-10 rounded-full bg-accent-sienna mx-auto" />
        </div>

        <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="input"
              autoComplete="username"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="input"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign in
          </button>
          <p className="text-xs text-center text-gray-400">
            Administrator sessions are separate from your MoneyLog account.
          </p>
        </form>
      </div>
    </div>
  );
}
