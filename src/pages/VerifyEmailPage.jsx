import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, MailCheck, MailX, MailWarning } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../utils/helpers.js";
import AuthLayout, { Em } from "../components/AuthLayout.jsx";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || location.state?.email || "";

  const [status, setStatus] = useState("idle");
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
    <AuthLayout
      eyebrow="Verify · Get started"
      title={
        <>
          One last step&mdash;<Em>verify.</Em>
        </>
      }
      subtitle="Confirm your email address so you can start your money log securely."
      backTo={{ to: "/login", label: "Back to login" }}
    >
      <div className="text-center">
        {status === "checking" && (
          <div className="py-4 flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-brand-deep dark:text-[#8FD0B4] animate-spin" />
            <h3 className="text-lg font-bold mt-4">Verifying your email...</h3>
            <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">Please wait a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-mint dark:bg-[#1B2A21]">
              <MailCheck className="w-8 h-8 text-brand-deep dark:text-[#8FD0B4]" />
            </div>
            <h3 className="text-xl font-bold mt-4">Email verified successfully</h3>
            <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
              {message || "Your account is now active."}
            </p>
            <button className="btn-landing-primary w-full !py-3 mt-6" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent-rose dark:bg-[#2B1D12]">
              <MailX className="w-8 h-8 text-accent-sienna dark:text-[#E0784A]" />
            </div>
            <h3 className="text-xl font-bold mt-4">Verification failed</h3>
            <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">{message}</p>
            {showResend && (
              <button
                className="btn-landing-primary w-full !py-3 mt-6"
                onClick={handleResend}
                disabled={sending}
              >
                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                {sending ? "Sending..." : "Resend verification email"}
              </button>
            )}
            <Link
              to="/login"
              className="inline-flex items-center font-semibold text-sm text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4] mt-5"
            >
              Back to login
            </Link>
          </div>
        )}

        {status === "idle" && (
          <div className="py-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-mint dark:bg-[#1B2A21]">
              <MailWarning className="w-8 h-8 text-brand-deep dark:text-[#8FD0B4]" />
            </div>
            <h3 className="text-xl font-bold mt-4">Check your email</h3>
            <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
              {email ? (
                <>
                  We sent a verification link to{" "}
                  <span className="font-semibold text-ink dark:text-[#EDE7DA]">{email}</span>.
                </>
              ) : (
                "We sent a verification link to your email address."
              )}
              <br />
              Please verify your email before logging in.
            </p>
            {showResend && (
              <button className="btn-landing-primary w-full !py-3 mt-6" onClick={handleResend} disabled={sending}>
                {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                {sending ? "Sending..." : "Resend verification email"}
              </button>
            )}
            <Link
              to="/login"
              className="inline-flex items-center font-semibold text-sm text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4] mt-5"
            >
              Back to login
            </Link>
          </div>
        )}

        {status === "resent" && (
          <div className="py-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-mint dark:bg-[#1B2A21]">
              <MailCheck className="w-8 h-8 text-brand-deep dark:text-[#8FD0B4]" />
            </div>
            <h3 className="text-xl font-bold mt-4">Verification email sent</h3>
            <p className="text-sm text-ink-muted dark:text-[#9A907C] mt-2">
              Check your inbox for the latest link. Please verify your email before logging in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center font-semibold text-sm text-brand-deep hover:text-brand-hover dark:text-[#8FD0B4] dark:hover:text-[#A7DCC4] mt-5"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}