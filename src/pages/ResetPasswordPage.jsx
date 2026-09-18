import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Wallet, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(token ? "form" : "invalid"); // form | invalid | success
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    return <InvalidLink message="This password reset link is invalid or has expired." />;
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
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">MoneyLog</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">Set a new password.</h1>
          <p className="text-white/70">
            Choose a strong password to keep your money data protected.
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

          {status === "success" && (
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Password reset successful</h2>
              <p className="text-sm text-gray-500 mt-2">
                Your password has been reset successfully. You can now sign in.
              </p>
              <button className="btn-primary w-full mt-6" onClick={() => navigate("/login")}>
                Go to Login
              </button>
            </div>
          )}

          {status === "invalid" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Invalid link</h2>
              <p className="text-sm text-gray-500 mt-2">{errorMessage || "This password reset link is invalid or has expired."}</p>
              <Link to="/forgot-password" className="btn-primary w-full mt-6 text-center">
                Request a new reset link
              </Link>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          )}

          {status === "form" && (
            <>
              <h2 className="text-2xl font-bold mb-1">Reset your password</h2>
              <p className="text-sm text-gray-500 mb-8">Enter your new password below.</p>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
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
                <div>
                  <label className="label">Confirm New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm"
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    className="input pr-10"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InvalidLink({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl">MoneyLog</span>
        </div>
        <h2 className="text-2xl font-bold">Invalid link</h2>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        <Link to="/forgot-password" className="btn-primary w-full mt-6 text-center">
          Request a new reset link
        </Link>
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </div>
  );
}