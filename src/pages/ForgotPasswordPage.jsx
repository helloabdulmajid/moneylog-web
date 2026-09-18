import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";

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
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">MoneyLog</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">We'll help you get back in.</h1>
          <p className="text-white/70">
            Enter your account email and we'll send you a link to reset your password.
          </p>
        </div>
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} MoneyLog</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">MoneyLog</span>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                <MailCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Check your email</h2>
              <p className="text-sm text-gray-500 mt-2">
                If an account exists for this email, we sent a password reset link.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">Forgot your password?</h2>
              <p className="text-sm text-gray-500 mb-8">
                Enter your email and we'll send you a reset link.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}