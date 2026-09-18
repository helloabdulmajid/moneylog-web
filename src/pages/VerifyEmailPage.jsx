import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Wallet, Loader2, ArrowLeft, MailCheck, MailX, MailWarning } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || location.state?.email || "";

  const [status, setStatus] = useState("idle"); // idle | checking | success | error | resent
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setStatus("checking");
    authApi
      .verifyEmail(token)
      .then((data) => {
        if (cancelled) return;
        setStatus("success");
        setMessage(data.message);
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(getErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    try {
      const data = await authApi.resendVerification(email);
      toast.success(data.message);
      setStatus("resent");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  const showResend = email && status !== "success";

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
          <h1 className="text-4xl font-bold leading-tight mb-4">Verify your email.</h1>
          <p className="text-white/70">
            Confirm your email address so you can start tracking your money securely.
          </p>
        </div>
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} MoneyLog</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl">MoneyLog</span>
          </div>

          {status === "checking" && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
              <h2 className="text-xl font-bold mt-4">Verifying your email...</h2>
              <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <MailCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Email verified successfully</h2>
              <p className="text-sm text-gray-500 mt-2">Your account is now active. You can sign in.</p>
              <button className="btn-primary w-full mt-6" onClick={() => navigate("/login")}>
                Go to Login
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                <MailX className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Verification failed</h2>
              <p className="text-sm text-gray-500 mt-2">{message}</p>
              {showResend && (
                <button
                  className="btn-primary w-full mt-6"
                  onClick={handleResend}
                  disabled={sending}
                >
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {sending ? "Sending..." : "Resend verification email"}
                </button>
              )}
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          )}

          {status === "idle" && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100">
                <MailWarning className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Check your email</h2>
              <p className="text-sm text-gray-500 mt-2">
                {email ? (
                  <>
                    We sent a verification link to <span className="font-medium text-gray-700">{email}</span>.
                  </>
                ) : (
                  "We sent a verification link to your email address."
                )}
                <br />
                Please verify your email before logging in.
              </p>
              {showResend && (
                <button className="btn-primary w-full mt-6" onClick={handleResend} disabled={sending}>
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {sending ? "Sending..." : "Resend verification email"}
                </button>
              )}
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          )}

          {status === "resent" && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <MailCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mt-4">Verification email sent</h2>
              <p className="text-sm text-gray-500 mt-2">
                Check your inbox for the latest link. Please verify your email before logging in.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-4">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}