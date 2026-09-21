import { useEffect, useState } from "react";
import {
  TrendingUp,
  ReceiptText,
  Tags,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Inbox,
} from "lucide-react";
import { Link } from "react-router-dom";
import { expenseApi } from "../api/expense.js";
import { categoryApi } from "../api/category.js";
import { paymentApi } from "../api/payment.js";
import { formatCurrency, formatDate } from "../utils/helpers.js";

export default function DashboardPage() {
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState({
    totalThisMonth: 0,
    allTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();

    const load = async () => {
      try {
        const [recentRes, categoriesRes, sourcesRes, monthRes, allRes] =
          await Promise.all([
            expenseApi.recent(),
            categoryApi.list(),
            paymentApi.listSources(),
            expenseApi.list({
              month: now.getMonth() + 1,
              year: now.getFullYear(),
              size: 100,
            }),
            expenseApi.list({
              size: 1000,
            }),
          ]);

        const totalThisMonth =
          monthRes?.content?.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          ) || 0;

        const allTime =
          allRes?.content?.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0
          ) || 0;

        setStats({
          totalThisMonth,
          allTime,
        });

        setRecent(recentRes || []);
        setCategories(categoriesRes || []);
        setSources(sourcesRes || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="font-ledger text-[11px] uppercase tracking-[0.18em] text-accent-sienna">
          Your money log
        </p>

        <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold tracking-tight text-ink dark:text-[#F6F1E6]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-ink-muted dark:text-[#B8AE9C]">
          A simple look at where your money is going.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={TrendingUp}
          label="Spent this month"
          value={formatCurrency(stats.totalThisMonth)}
          accent="bg-accent-rose text-accent-sienna"
        />

        <StatCard
          icon={Wallet}
          label="All-time spending"
          value={formatCurrency(stats.allTime)}
          accent="bg-brand-mint text-brand-pine"
        />

        <StatCard
          icon={Tags}
          label="Categories"
          value={categories.length}
          accent="bg-accent-sand text-accent-sienna"
        />

        <StatCard
          icon={CreditCard}
          label="Payment sources"
          value={sources.length}
          accent="bg-brand-mint text-brand-deep"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent expenses */}
        <div className="lg:col-span-2 card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-ledger text-[11px] uppercase tracking-[0.15em] text-ink-muted dark:text-[#B8AE9C]">
                Ledger
              </p>

              <h2 className="mt-1 font-display font-semibold text-ink dark:text-[#F6F1E6]">
                Recent expenses
              </h2>
            </div>

            <Link
              to="/expenses"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-deep dark:text-[#C3D8CB] hover:text-brand-pine dark:hover:text-[#F6F1E6] transition"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="font-ledger text-sm text-ink-muted dark:text-[#B8AE9C]">
                Loading your ledger...
              </p>
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-mint dark:bg-[#263A30] text-brand-pine dark:text-[#C3D8CB] mb-4">
                <Inbox className="w-6 h-6" />
              </div>

              <p className="text-sm font-medium text-ink dark:text-[#F6F1E6]">
                No expenses yet.
              </p>

              <p className="mt-1 text-xs text-ink-muted dark:text-[#B8AE9C]">
                Your spending history will appear here.
              </p>

              <Link
                to="/expenses"
                className="mt-4 text-sm font-medium text-brand-deep dark:text-[#C3D8CB] hover:text-brand-pine dark:hover:text-[#F6F1E6] transition"
              >
                Add your first expense
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-borderWarm dark:divide-[#3A3326]">
              {recent.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center gap-3 sm:gap-4 py-3.5"
                >
                  {/* Category icon */}
                  <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-paper dark:bg-[#2A2418] border border-borderWarm dark:border-[#3A3326] text-lg">
                    {expense.category?.icon || "💸"}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-[#F6F1E6] truncate">
                      {expense.category?.name ||
                        expense.purpose ||
                        "Expense"}
                    </p>

                    <p className="mt-0.5 text-xs text-ink-muted dark:text-[#B8AE9C] truncate">
                      {expense.notes ||
                        expense.category?.name ||
                        "Spending"}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-accent-sienna dark:text-[#E7A27D]">
                      − {formatCurrency(expense.amount)}
                    </p>

                    <p className="mt-0.5 font-ledger text-[11px] text-ink-muted dark:text-[#B8AE9C]">
                      {formatDate(expense.expenseDate)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-ledger text-[11px] uppercase tracking-[0.15em] text-ink-muted dark:text-[#B8AE9C]">
                Shortcuts
              </p>

              <h2 className="mt-1 font-display font-semibold text-ink dark:text-[#F6F1E6]">
                Quick actions
              </h2>
            </div>

            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-mint dark:bg-[#263A30] text-brand-pine dark:text-[#C3D8CB]">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            <QuickAction
              to="/expenses"
              icon={ArrowDownRight}
              label="Add an expense"
              desc="Log a new spending entry"
            />

            <QuickAction
              to="/categories"
              icon={Tags}
              label="Manage categories"
              desc="Organize your spending"
            />

            <QuickAction
              to="/payments"
              icon={CreditCard}
              label="Payment methods"
              desc="Apps and sources"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card p-4 sm:p-5">
      <div
        className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl mb-4 ${accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <p className="text-lg sm:text-2xl font-display font-bold tracking-tight text-ink dark:text-[#F6F1E6] truncate">
        {value}
      </p>

      <p className="mt-1 text-xs sm:text-sm text-ink-muted dark:text-[#B8AE9C] truncate">
        {label}
      </p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, desc }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 p-3 rounded-xl border border-borderWarm dark:border-[#3A3326] bg-paper-card dark:bg-[#1C1711] hover:border-brand-pine/30 dark:hover:border-[#6F927F] hover:bg-brand-mint/40 dark:hover:bg-[#2A2418] transition"
    >
      <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-brand-mint dark:bg-[#263A30] text-brand-pine dark:text-[#C3D8CB] group-hover:bg-brand-deep group-hover:text-paper-card transition">
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-ink dark:text-[#F6F1E6]">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-ink-muted dark:text-[#B8AE9C] truncate">
          {desc}
        </p>
      </div>

      <ArrowUpRight className="ml-auto w-4 h-4 text-ink-muted dark:text-[#8F8573] opacity-0 group-hover:opacity-100 transition" />
    </Link>
  );
}
