import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  ArrowRight,
  CheckCircle2,
  Moon,
  Sun,
  ReceiptText,
  Layers,
  Tags,
  TrendingUp,
  Split,
} from "lucide-react";
import Logo from "../components/Logo.jsx";

const navFeatures = [
  { title: "Track Every Expense", desc: "See Log your spending with amount, date, notes ,purpose ,payement apps and payment method. Find any expense instantly.", tint: "bg-brand-mint text-brand-pine dark:bg-[#1B2A21] dark:text-[#8FD0B4]", Icon: ReceiptText },
  { title: "Track Multiple Accounts", desc: "Track expenses and bills across your bank accounts, credit cards and wallets — all in one place.", tint: "bg-accent-rose text-[#A35427] dark:bg-[#2B1D12] dark:text-[#E0784A]", Icon: Layers },
  { title: "Stay Organized", desc: "Use categories and subcategories to see where your money goes. Clean, simple and easy to understand.", tint: "bg-accent-sand text-[#8A6B33] dark:bg-[#262015] dark:text-[#D9B572]", Icon: Tags },
  { title: "Get a Clearer Picture", desc: "See monthly insights and spending patterns. Understand your spending with confidence.", tint: "bg-brand-sage text-[#4E6347] dark:bg-[#1F261B] dark:text-[#9BB496]", Icon: TrendingUp },
  { title: "Split Expenses", desc: "Split shared expenses with friends, family or roommates. Keep track without confusion.", tint: "bg-[#E4DDE9] text-[#655A71] dark:bg-[#221E27] dark:text-[#C0B3CC]", Icon: Split },
];

const cards = [
  { merchant: "Amazon", amount: "₹1,299", cat: "Shopping", w: "w-56", pos: "left-[3%] top-[10%] rotate-[-4deg]" },
  { merchant: "Zomato", amount: "₹320", cat: "Food", w: "w-48", pos: "right-[4%] top-[6%] rotate-[3deg]" },
  { merchant: "Metro", amount: "₹65", cat: "Travel", w: "w-44", pos: "left-[20%] top-[36%] rotate-[-1deg]" },
  { merchant: "HDFC Credit Card", amount: "₹12,450", cat: "Bill Payment", w: "w-60", pos: "right-[4%] bottom-[8%] rotate-[1.5deg]", accent: true },
];

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="scroll-smooth font-display bg-paper text-ink min-h-screen flex flex-col dark:bg-[#14110C] dark:text-[#EDE7DA]">

      {/* ─── NAVBAR ─── */}
      <header className="fixed inset-x-0 top-0 z-20 border-b bg-paper/80 backdrop-blur-lg border-borderWarm/70 dark:bg-[#14110C]/80 dark:border-[#2A2418]/70">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={30} />
            <span className="font-bold tracking-tight text-lg hidden sm:block">MoneyLog</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted dark:text-[#9A907C]">
            <a href="#features" className="hover:text-ink dark:hover:text-[#EDE7DA] transition-colors">Features</a>
            <a href="#why" className="hover:text-ink dark:hover:text-[#EDE7DA] transition-colors">Why MoneyLog</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-full text-ink-muted hover:bg-ink/5 dark:text-[#9A907C] dark:hover:bg-[#2A2418] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            <Link to="/login" className="hidden sm:inline-flex btn-landing px-4 py-2 text-sm font-medium text-ink border border-ink/10 hover:border-ink/20 hover:bg-ink/5 dark:text-[#EDE7DA] dark:border-[#2A2418] dark:hover:bg-[#2A2418]/60 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-landing-primary !px-5 !py-2.5 !text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <main className="pt-28 sm:pt-36 pb-20 sm:pb-28 max-w-6xl mx-auto px-4 sm:px-8 w-full">

        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* left */}
          <div className="order-1 lg:order-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[.18em] font-semibold font-ledger text-ink-muted dark:text-[#9A907C] border border-ink/10 dark:border-[#2A2418] rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-deep dark:bg-brand-pine" />
              Simple · Minimal · Private
            </span>

            <h1 className="text-[2.65rem] sm:text-[3.35rem] lg:text-[3.8rem] font-bold tracking-[-0.035em] leading-[1.08] mb-5">
              See your{" "}
              <span className="relative inline-block text-accent-sienna">
                MoneyLog.
                <span className="absolute left-0 bottom-0 w-full h-[4px] rounded-full bg-accent-sienna/50" />
              </span>
              <br />
              Know your money.
            </h1>

            <p className="max-w-md mx-auto lg:mx-0 text-ink-muted dark:text-[#9A907C] leading-relaxed mb-8 text-[1.05rem]">
              Track expenses, cards, and bills in one place.<br className="hidden sm:block" />
              Every rupee. Accounted for.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
              <Link to="/register" className="btn-landing-primary w-full sm:w-auto">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-landing-ghost w-full sm:w-auto">
                Sign in
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs font-medium text-ink-muted dark:text-[#9A907C]">
              {["Free to start", "Your data is private", "No ads"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-deep dark:text-brand-pine" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* right — illustration */}
          <div className="relative order-2 lg:order-2 h-[370px] sm:h-[420px] lg:h-[460px] w-full select-none pointer-events-none">

            {/* organic blobs */}
            <div className="absolute -left-10 top-4 w-56 h-56 bg-brand-mint/80 dark:bg-[#1B2A21]/80 rounded-[42%_58%_65%_35%/55%_45%_55%_45%]" />
            <div className="absolute right-0 bottom-8 w-44 h-44 bg-accent-sand/80 dark:bg-[#262015]/80 rounded-[60%_40%_45%_55%/45%_60%_40%_55%]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-accent-rose/60 dark:bg-[#2B1D12]/60 rounded-[55%_45%_60%_40%/40%_55%_45%_60%]" />

            {/* annotations */}
            <span className="absolute top-[3%] right-[10%] font-hand text-lg sm:text-xl text-ink-muted/80 dark:text-[#9A907C]/80 -rotate-2 hidden sm:block">
              Small expenses.<br />A bigger picture.
            </span>
            <span className="absolute bottom-[4%] left-[3%] font-hand text-base sm:text-lg text-ink-muted/80 dark:text-[#9A907C]/80 rotate-1 hidden sm:block">
              Track today<br />for a better tomorrow.
            </span>

            {/* cards */}
            {cards.map((c) => (
              <div key={c.merchant} className={`absolute ${c.pos} ${c.w} bg-paper-card dark:bg-[#1C1711] rounded-2xl border border-borderWarm/80 dark:border-[#2A2418]/80 shadow-[0_18px_40px_-18px_rgba(33,27,17,0.25)] px-5 py-4`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-sm leading-tight">{c.merchant}</span>
                  <span className={`font-ledger font-medium text-sm ${c.accent ? "text-accent-sienna dark:text-[#E0784A]" : "text-ink dark:text-[#EDE7DA]"}`}>
                    {c.amount}
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted dark:text-[#9A907C] uppercase tracking-wide font-medium">
                  {c.cat}
                </span>
              </div>
            ))}
          </div>

        </section>
      </main>

      {/* ─── FEATURES ─── */}
      <section id="features" className="bg-paper-card dark:bg-[#1C1711] border-y border-borderWarm/70 dark:border-[#2A2418]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
          <span className="block text-center text-[11px] uppercase tracking-[.18em] font-semibold font-ledger text-ink-muted dark:text-[#9A907C] mb-4">
            Features
          </span>
          <p className="text-center text-ink-muted dark:text-[#9A907C] max-w-lg mx-auto mb-14 leading-relaxed text-[1.05rem]">
            What MoneyLog gives you — nothing more, nothing less.
          </p>

          <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-borderWarm dark:lg:divide-[#2A2418] gap-8 lg:gap-0">
            {navFeatures.map((f) => (
              <div key={f.title} className="lg:flex-1 lg:px-6 first:lg:pl-0 last:lg:pr-0 group">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${f.tint}`}>
                  <f.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[15px] mb-2 text-ink dark:text-[#EDE7DA]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted dark:text-[#9A907C]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section id="why" className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="relative rounded-[2rem] bg-brand-deep dark:bg-brand-pine overflow-hidden px-8 py-16 sm:px-14 sm:py-20 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          {/* right shape */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none">
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/[0.07] rounded-full" />
            <div className="absolute right-20 bottom-8 w-16 h-16 bg-accent-sienna/30 rounded-xl rotate-12" />
          </div>

          <div className="relative z-10">
            <span className="inline-block font-ledger text-[11px] uppercase tracking-[.18em] text-[#A7C4B8] dark:text-[#C0DBC9] font-semibold mb-5">
              A small step towards a better you
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F6F1E6] dark:text-[#EDE7DA] leading-[1.15] tracking-[-0.02em] mb-4">
              Your MoneyLog.<br />
              Your complete money story.
            </h2>
            <p className="text-[#C3D8CB] dark:text-[#C8E2D6] text-lg">
              Because every rupee has a story.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-borderWarm/70 dark:border-[#2A2418]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-bold text-sm tracking-tight">MoneyLog</span>
            <span className="hidden sm:block text-sm text-ink-muted dark:text-[#9A907C] ml-1">
              Every rupee has a story.
            </span>
          </div>

          <div className="flex items-center gap-5 text-sm text-ink-muted dark:text-[#9A907C]">
            <a href="#privacy" className="hover:text-ink dark:hover:text-[#EDE7DA] transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-ink dark:hover:text-[#EDE7DA] transition-colors">Terms</a>
            <a href="#contact" className="hover:text-ink dark:hover:text-[#EDE7DA] transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-8 text-center text-xs text-ink-faint dark:text-[#8A907C]">
          © 2026 MoneyLog. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
