import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";
import AuthLayout, { Em, inputClass, labelClass } from "../components/AuthLayout.jsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await authApi.forgotPassword(email);
      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Security · Reset"
      title={
        <>
          Get back into your <Em>MoneyLog.</Em>
        </>
      }
      subtitle="Enter your account email and we'll send you a link to reset your password."
      backTo={{ to: "/login", label: "Back to login" }}
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-mint dark:bg-[#1B2A21] mx-auto">
            <MailCheck className="w-8 h-8 text-brand-deep dark:text-[#8FD0B4]" />
          </div>
          <h3 className="text-xl font-bold mt-4">Check your email</h3>
          <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
            If an account exists for this email, we sent a password reset link.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center font-semibold text-sm text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4] mt-6"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-landing-primary w-full !py-3">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}