import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo.jsx";

const panelCards = [
  { merchant: "Chai", amount: "₹25", tag: "Daily ritual", w: "w-44", pos: "left-[2%] top-[6%] -rotate-3", accent: true },
  { merchant: "Metro", amount: "₹60", tag: "Travel", w: "w-40", pos: "right-[4%] top-[2%] rotate-2" },
  { merchant: "Groceries", amount: "₹840", tag: "Groceries", w: "w-48", pos: "left-[16%] top-[44%] rotate-1" },
  { merchant: "Netflix", amount: "₹649", tag: "Subscription", w: "w-44", pos: "right-[8%] bottom-[2%] -rotate-2" },
];

const inputClass =
  "w-full px-4 py-3 text-sm rounded-xl bg-paper-deep dark:bg-[#14110C] border border-ink/10 dark:border-[#2A2418] " +
  "text-ink dark:text-[#EDE7DA] placeholder:text-ink-faint dark:placeholder:text-[#8A907C] outline-none transition " +
  "focus:border-brand-light dark:focus:border-brand-pine focus:ring-2 focus:ring-brand-mint/70 dark:focus:ring-[#2E6B55]/40";

const labelClass =
  "block text-sm font-semibold text-ink dark:text-[#EDE7DA] mb-1.5";

const eyeClass =
  "absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:text-[#8A907C] dark:hover:text-[#EDE7DA] transition-colors";

function Em({ children }) {
  return (
    <span className="relative inline-block text-accent-sienna dark:text-[#E0784A]">
      {children}
      <span className="absolute left-0 bottom-0 w-full h-[4px] rounded-full bg-accent-sienna/50 dark:bg-[#E0784A]/40" />
    </span>
  );
}

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  backTo = { to: "/", label: "Back to home" },
  children,
  below,
}) {
  return (
    <div className="min-h-screen flex font-display bg-paper text-ink dark:bg-[#14110C] dark:text-[#EDE7DA]">
      {/* ─── LEFT — forest brand panel ─── */}
      <aside className="hidden lg:flex w-[44%] flex-col justify-between p-12 xl:p-14 relative overflow-hidden bg-brand-deep dark:bg-brand-pine">
        <div className="absolute -right-14 top-1/4 w-64 h-64 bg-white/[0.06] rounded-full pointer-events-none" />
        <div className="absolute right-24 top-10 w-12 h-12 bg-accent-sienna/40 rounded-xl rotate-12 pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-brand-mint/20 rounded-[60%_40%_45%_55%/45%_60%_40%_55%] pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <Logo size={34} />
          <span className="font-bold tracking-tight text-lg text-[#F6F1E6]">MoneyLog</span>
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 font-ledger text-[11px] uppercase tracking-[.18em] font-semibold text-[#A7C4B8] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sienna" />
            {eyebrow}
          </span>
          <h1 className="text-4xl xl:text-[2.9rem] font-bold text-[#F6F1E6] tracking-[-0.02em] leading-[1.12] mb-4">
            {title}
          </h1>
          <p className="text-[#C3D8CB] text-lg mb-10">{subtitle}</p>

          {/* floating ledger cards */}
          <div className="relative h-[240px] select-none pointer-events-none">
            {panelCards.map((c) => (
              <div
                key={c.merchant}
                className={`absolute ${c.pos} ${c.w} bg-[#FFFDF6] rounded-xl border border-white/30 shadow-[0_16px_32px_-14px_rgba(0,0,0,0.45)] px-4 py-3`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-[13px] text-[#211B11] leading-tight">{c.merchant}</span>
                  <span className={`font-ledger font-medium text-sm ${c.accent ? "text-[#B4501E]" : "text-[#211B11]"}`}>
                    {c.amount}
                  </span>
                </div>
                <span className="text-[10px] text-[#6E675A] uppercase tracking-wide font-medium">{c.tag}</span>
              </div>
            ))}
            <span className="absolute top-[40%] right-[30%] font-hand text-xl text-[#E4C99E] -rotate-3">
              Chai first.<br />Ledger later.
            </span>
          </div>
        </div>

        <p className="relative text-sm text-[#9FB8AB]">Every rupee has a story.</p>
      </aside>

      {/* ─── RIGHT — form panel ─── */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -left-16 -top-16 w-56 h-56 bg-brand-mint/60 dark:bg-[#1B2A21]/60 rounded-[42%_58%_65%_35%/55%_45%_55%_45%] pointer-events-none select-none" />
        <div className="absolute -right-14 -bottom-14 w-48 h-48 bg-accent-sand/70 dark:bg-[#262015]/70 rounded-[60%_40%_45%_55%/45%_60%_40%_55%] pointer-events-none select-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <Logo size={40} />
            <span className="font-bold tracking-tight text-2xl">MoneyLog</span>
          </div>

          <Link
            to={backTo.to}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink dark:text-[#9A907C] dark:hover:text-[#EDE7DA] mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backTo.label}
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[.18em] font-semibold font-ledger text-ink-muted dark:text-[#9A907C] border border-ink/10 dark:border-[#2A2418] rounded-full px-3 py-1 mb-5 block w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-deep dark:bg-brand-pine" />
            {eyebrow}
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-[1.1] mb-3">{title}</h2>
          <p className="text-ink-muted dark:text-[#9A907C] leading-relaxed mb-8">{subtitle}</p>

          <div className="bg-paper-card dark:bg-[#1C1711] rounded-2xl border border-borderWarm/80 dark:border-[#2A2418]/80 shadow-[0_18px_40px_-18px_rgba(33,27,17,0.25)] px-6 sm:px-8 py-8">
            {children}
          </div>

          {below && (
            <div className="mt-6 text-center text-sm text-ink-muted dark:text-[#9A907C]">{below}</div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-faint dark:text-[#8A907C]">
            <span>Every rupee has a story.</span>
            <span>© {new Date().getFullYear()} MoneyLog</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export { Em, inputClass, labelClass, eyeClass };