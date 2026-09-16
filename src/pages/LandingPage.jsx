import { Link } from "react-router-dom";
import { Wallet, ReceiptText, Tags, CreditCard, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ReceiptText,
    title: "Track Every Expense",
    description:
      "Log your spending in seconds with amount, date, notes and payment method. Search, filter and find any expense instantly.",
  },
  {
    icon: Tags,
    title: "Organize by Categories",
    description:
      "Create color-coded categories with icons and subcategories so your spending stays neatly organized and easy to scan.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Methods",
    description:
      "Register your UPI apps, bank accounts and cards. Assign a payment method to each expense and know exactly where money went.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">MoneyLog</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary !py-2">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary !py-2">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
          <span className="badge bg-primary-50 text-primary-700 border border-primary-100 mb-5 !py-1.5 !px-3">
            Simple • Minimal • Private
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
            Take control of
            <span className="text-primary-600"> your money.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-500 mb-8">
            No more guessing where your money went. Log expenses, organize them
            by categories and payment methods, and understand your spending — all
            in a clean, minimal dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary !px-6 !py-3 text-base w-full sm:w-auto">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary !px-6 !py-3 text-base w-full sm:w-auto">
              Sign in
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="card p-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="font-semibold text-lg mb-2">{feature.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-600 text-white">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold">MoneyLog</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MoneyLog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}