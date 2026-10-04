import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bug,
  Lightbulb,
  Sparkles,
  Megaphone,
  Loader2,
  CheckCircle2,
  FileImage,
  X,
  MessageSquare,
} from "lucide-react";
import { feedbackApi } from "../api/feedback.js";
import { getErrorMessage } from "../utils/helpers.js";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

const CATEGORIES = [
  { value: "BUG_REPORT", label: "Report a bug", desc: "Something isn't working as expected.", Icon: Bug },
  { value: "SUGGESTION", label: "Make a suggestion", desc: "A small improvement to something existing.", Icon: Sparkles },
  { value: "FEATURE_REQUEST", label: "Request a feature", desc: "Something you'd like MoneyLog to do.", Icon: Lightbulb },
  { value: "GENERAL_FEEDBACK", label: "General feedback", desc: "Anything else on your mind.", Icon: Megaphone },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function shortReportId(id) {
  if (!id) return "";
  return String(id).replace(/-/g, "").slice(0, 8).toUpperCase();
}

const SUCCESS_COPY = {
  BUG_REPORT: {
    Icon: Bug,
    tint: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    heading: "Bug report received",
    body: "Thanks for flagging this. We've recorded it for the team to review — we'll look into what went wrong, though we can't promise when or whether it will be fixed.",
    repeatLabel: "Report another bug",
  },
  FEATURE_REQUEST: {
    Icon: Lightbulb,
    tint: "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400",
    heading: "Feature request received",
    body: "Thanks for the idea. We've added it to our list of requests and will consider it for a future update — no guarantee it'll be built, but every request is read.",
    repeatLabel: "Request another feature",
  },
  SUGGESTION: {
    Icon: Sparkles,
    tint: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    heading: "Suggestion received",
    body: "Thanks for the suggestion. We've noted it for the team to review and decide whether it fits MoneyLog.",
    repeatLabel: "Send another suggestion",
  },
  GENERAL_FEEDBACK: {
    Icon: Megaphone,
    tint: "bg-brand-mint text-brand-forest dark:bg-brand-forest dark:text-brand-mint",
    heading: "Feedback received",
    body: "Thanks for sharing. We've recorded your feedback for the team to review.",
    repeatLabel: "Send more feedback",
  },
};

const STORAGE_KEY = "moneylog:feedback:last";

function deliveryMessage(status) {
  switch (status) {
    case "SENT":
      return {
        text: "The team was notified by email and will review your report.",
        ok: true,
      };
    case "LOGGED":
      return {
        text: "Report saved. In this preview environment the notification email isn't delivered — it was written to the server log instead. The team will still review it.",
        ok: false,
      };
    case "FAILED":
      return {
        text: "Your report was saved, but a notification email couldn't be sent right now. The team will still review it.",
        ok: false,
      };
    default:
      return {
        text: "Your report was saved for review.",
        ok: false,
      };
  }
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-[#E6DFCE]">
        {label}
        <span className="text-[11px] font-ledger uppercase tracking-wider text-accent-sienna ml-1.5">
          {hint}
        </span>
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function FeedbackPage({ embedded = false }) {
  const { user } = useAuth();

  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [contactEmail, setContactEmail] = useState(
    () => user?.email || ""
  );
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && saved.id && SUCCESS_COPY[saved.category]) {
        setSubmitted(saved);
      }
    } catch {
      // Ignore malformed or stale entries.
    }
  }, []);

  const rememberSubmission = (res) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: res.id,
          category: res.category,
          notificationStatus: res.notificationStatus,
        })
      );
    } catch {
      // Storage may be unavailable; in-memory state is enough.
    }
  };

  const pickFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please choose a PNG, JPEG or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Screenshot must be 5 MB or smaller.");
      return;
    }
    setScreenshot(file);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const removeFile = () => {
    setScreenshot(null);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setCategory("");
    setSubject("");
    setDescription("");
    setSteps("");
    setContactEmail(user?.email || "");
    removeFile();
    setErrors({});
    setSubmitted(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();
    const trimmedSteps = steps.trim();

    const errs = {};
    if (!category) errs.category = "Please choose a category.";
    if (!trimmedSubject) errs.subject = "A short subject is required.";
    else if (trimmedSubject.length > 150)
      errs.subject = "Keep the subject under 150 characters.";
    if (!trimmedDescription) errs.description = "Please describe what happened.";
    else if (trimmedDescription.length > 10000)
      errs.description = "Keep the description under 10,000 characters.";
    if (trimmedSteps.length > 5000)
      errs.steps = "Keep it under 5,000 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await feedbackApi.submit(
        {
          category,
          subject: trimmedSubject,
          description: trimmedDescription,
          stepsToReproduce: trimmedSteps || null,
          contactEmail: contactEmail.trim() || null,
        },
        screenshot
      );
      setSubmitted(res);
      rememberSubmission(res);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div>
      <div className="mb-8">
        <p className="mb-1 flex items-center gap-1.5 font-ledger text-[11px] uppercase tracking-[0.16em] text-accent-sienna">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-sienna inline-block" />
          Beta · We&apos;re listening
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-[#EDE7DA]">
          Feedback &amp; Support
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-[#9A907C] max-w-lg">
          Found a bug, have a suggestion, or want a new feature? Tell us about
          it — it takes a minute and it genuinely helps us improve MoneyLog.
        </p>
        <span className="mt-3 block h-0.5 w-10 rounded-full bg-accent-sienna" />
      </div>

      {submitted ? (() => {
        const meta = SUCCESS_COPY[submitted.category] || SUCCESS_COPY.GENERAL_FEEDBACK;
        const delivery = deliveryMessage(submitted.notificationStatus);
        const SuccessIcon = meta.Icon;
        return (
          <div className="card p-8 sm:p-10 text-center">
            <div
              className={`mx-auto w-14 h-14 rounded-full ${meta.tint} flex items-center justify-center`}
            >
              <SuccessIcon className="w-7 h-7" />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-gray-900 dark:text-[#EDE7DA]">
              {meta.heading}
            </h2>
            <p className="mt-2 font-ledger text-[11px] uppercase tracking-[0.18em] text-accent-sienna">
              Report ID · {shortReportId(submitted.id)}
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-[#9A907C] max-w-sm mx-auto leading-relaxed">
              {meta.body}
            </p>
            <p
              className={`mt-3 inline-flex items-start gap-1.5 text-xs leading-relaxed text-left ${
                delivery.ok
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-400 dark:text-[#8A8070]"
              }`}
            >
              {delivery.ok ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-accent-sienna inline-block mt-1 shrink-0" />
              )}
              {delivery.text}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button onClick={resetForm} className="btn-secondary w-full sm:w-auto">
                {meta.repeatLabel}
              </button>
              {embedded && (
                <Link to="/app" className="btn-primary w-full sm:w-auto">
                  Back to home
                </Link>
              )}
            </div>
          </div>
        );
      })() : (
        <form onSubmit={submit} noValidate className="card p-5 sm:p-6 space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-[#E6DFCE]">
              What are you trying to do?<span className="text-accent-sienna"> ·</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((c) => {
                const active = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition active:scale-[0.98] ${
                      active
                        ? "border-primary-300 bg-primary-50 text-primary-700 ring-2 ring-primary-100 dark:bg-primary-950/40 dark:border-primary-500/50"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#161310] dark:border-[#3A3226] dark:text-[#E6DFCE] dark:hover:bg-[#2A2418]"
                    }`}
                    aria-pressed={active}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                        active
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-500 dark:bg-[#2A2418] dark:text-[#8A8070]"
                      }`}
                    >
                      <c.Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{c.label}</span>
                      <span className="block mt-0.5 text-xs text-gray-400 dark:text-[#8A8070]">
                        {c.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                {errors.category}
              </p>
            )}
          </div>

          <Field label="Subject" hint="required" error={errors.subject}>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={150}
              placeholder="e.g. Expense says 'saved' but doesn't show up"
              className={`input ${errors.subject ? "!border-red-300" : ""}`}
            />
          </Field>

          <Field label="Description" hint="required" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={10000}
              placeholder="Tell us what you were doing, what you expected, and what actually happened."
              className={`input resize-none ${errors.description ? "!border-red-300" : ""}`}
            />
          </Field>

          <Field
            label="Steps to reproduce"
            hint="optional"
            error={errors.steps}
          >
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={2}
              maxLength={5000}
              placeholder="1. Open MoneyLog  2. Tap Home  3. ..."
              className={`input resize-none ${errors.steps ? "!border-red-300" : ""}`}
            />
          </Field>

          <Field
            label="Contact email"
            hint="optional"
            error={errors.contact}
          >
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              maxLength={254}
              placeholder="you@example.com"
              className="input"
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-[#8A8070]">
              Only used if we need to follow up on this report.
            </p>
          </Field>

          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-[#E6DFCE]">
              Screenshot<span className="text-[11px] font-ledger uppercase tracking-wider text-accent-sienna ml-1.5">
                optional · PNG, JPEG or WebP · 5&nbsp;MB max
              </span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
            {screenshot && previewUrl ? (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-[#161310] dark:border-[#3A3226]">
                <img
                  src={previewUrl}
                  alt="Screenshot preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-[#3A3226]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-[#E6DFCE] truncate">
                    {screenshot.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#8A8070]">
                    {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label="Remove screenshot"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 dark:border-[#3A3226] dark:text-[#8A8070] dark:hover:text-[#E6DFCE] dark:hover:border-[#5A5042] transition select-none"
              >
                <FileImage className="w-4 h-4" />
                Attach a screenshot
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <p className="text-xs text-gray-400 dark:text-[#8A8070]">
              Your report is stored privately and reviewed by the MoneyLog team.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary sm:!px-6"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendIcon />
              )}
              Submit feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (embedded) {
    return <div>{content}</div>;
  }

  return (
    <div className="min-h-screen bg-paper font-display text-ink dark:bg-[#14110C] dark:text-[#EDE7DA] flex flex-col">
      <header className="sticky inset-x-0 top-0 z-20 border-b bg-paper/80 backdrop-blur-lg border-borderWarm/70 dark:bg-[#14110C]/80 dark:border-[#2A2418]/70">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={30} />
            <span className="font-bold tracking-tight text-lg">MoneyLog</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted dark:text-[#9A907C] hover:text-ink dark:hover:text-[#EDE7DA] transition-colors"
          >
            Back to MoneyLog
          </Link>
        </div>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        {content}
      </main>
      <footer className="border-t border-borderWarm/70 dark:border-[#2A2418]/70 py-6 text-center font-ledger text-[11px] uppercase tracking-[0.18em] text-ink-muted dark:text-[#9A907C]">
        Every rupee has a story. &middot; &copy; 2026 MoneyLog
      </footer>
    </div>
  );
}

function SendIcon() {
  return <MessageSquare className="w-4 h-4" />;
}