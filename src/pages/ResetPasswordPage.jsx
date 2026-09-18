import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";
import AuthLayout, { Em, inputClass, labelClass, eyeClass } from "../components/AuthLayout.jsx";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(token ? "form" : "invalid");
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    return <InvalidLink />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    try {
      const data = await authApi.resetPassword(token, form.password, form.confirm);
      toast.success(data.message);
      setStatus("success");
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      if (message.includes("invalid or has expired")) {
        setStatus("invalid");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Security · New password"
      title={
        <>
          Set a new <Em>password.</Em>
        </>
      }
      subtitle="Choose something strong — your money data depends on it."
      backTo={{ to: "/login", label: "Back to login" }}
    >
      {status === "success" && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-mint dark:bg-[#1B2A21] mx-auto">
            <CheckCircle2 className="w-8 h-8 text-brand-deep dark:text-[#8FD0B4]" />
          </div>
          <h3 className="text-xl font-bold mt-4">Password reset successful</h3>
          <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
            Your password has been reset. You can now sign in.
          </p>
          <button className="btn-landing-primary w-full !py-3 mt-6" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      )}

      {status === "invalid" && (
        <div className="text-center py-4">
          <h3 className="text-xl font-bold">Invalid link</h3>
          <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
            {errorMessage || "This password reset link is invalid or has expired."}
          </p>
          <Link to="/forgot-password" className="btn-landing-ghost w-full sm:w-auto !py-3 mt-6">
            Request a new reset link
          </Link>
        </div>
      )}

      {status === "form" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Min 6 characters"
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
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirm"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                className={inputClass + " pr-11"}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
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
            {form.confirm && (
              form.password === form.confirm ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-deep dark:text-[#8FD0B4]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </p>
              ) : (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-accent-sienna dark:text-[#F0865A]">
                  <CheckCircle2 className="w-3.5 h-3.5 opacity-0" /> Passwords don't match
                </p>
              )
            )}
          </div>
          {errorMessage && (
            <p className="text-sm font-medium text-accent-sienna dark:text-[#F0865A]">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !form.password || !form.confirm || form.password !== form.confirm}
            className="btn-landing-primary w-full !py-3"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

function InvalidLink() {
  return (
    <AuthLayout
      eyebrow="Security · Reset"
      title={
        <>
          That link is <Em>expired.</Em>
        </>
      }
      subtitle="Share the route to a fresh start: request a new reset link below."
      backTo={{ to: "/login", label: "Back to login" }}
    >
      <div className="text-center py-4">
        <p className="text-sm text-ink-muted dark:text-[#9A907C]">
          This password reset link is invalid or has expired.
        </p>
        <Link to="/forgot-password" className="btn-landing-primary w-full !py-3 mt-6">
          Request a new reset link
        </Link>
      </div>
    </AuthLayout>
  );
}