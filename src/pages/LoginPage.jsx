import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/helpers.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/app");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">MoneyLog</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Simple money tracking for everyday life.
          </h1>
          <p className="text-white/70">
            Log expenses, organize categories and payment methods, and understand
            where your money goes — all in one minimal dashboard.
          </p>
        </div>
        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} MoneyLog
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">MoneyLog</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-8">
            Welcome back, enter your details.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="input pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}