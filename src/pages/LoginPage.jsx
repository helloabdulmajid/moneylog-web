import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, MailWarning } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";
import AuthLayout, { Em, inputClass, labelClass, eyeClass } from "../components/AuthLayout.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUnverified(false);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/app");
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      if (message.toLowerCase().includes("verify your email")) {
        setUnverified(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const data = await authApi.resendVerification(form.email);
      toast.success(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Member · Welcome back"
      title={
        <>
          Welcome back to your <Em>MoneyLog.</Em>
        </>
      }
      subtitle="Sign in to see where your money went — and where it's going."
      backTo={{ to: "/", label: "Back to home" }}
      below={
        <>
          New to MoneyLog?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4]"
          >
            Create your account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Password</label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4]"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="••••••••"
            className={inputClass + " pr-11"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            className={eyeClass}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button type="submit" disabled={submitting} className="btn-landing-primary w-full !py-3">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {unverified && (
        <div className="mt-5 p-4 rounded-xl bg-accent-sand/60 border border-borderWarm dark:bg-[#262015] dark:border-[#2A2418]">
          <div className="flex items-start gap-3">
            <MailWarning className="w-5 h-5 text-accent-sienna dark:text-[#E0784A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-ink dark:text-[#EDE7DA]">
                Please verify your email before logging in.
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 text-sm font-semibold text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4] disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}