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
  const [stats, setStats] = useState({ totalThisMonth: 0, allTime: 0 });
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
            expenseApi.list({ month: now.getMonth() + 1, year: now.getFullYear(), size: 100 }),
            expenseApi.list({ size: 1000 }),
          ]);

        const totalThisMonth = monthRes?.content?.reduce((sum, e) => sum + e.amount, 0);
        const allTime = allRes?.content?.reduce((sum, e) => sum + e.amount, 0);

        setStats({ totalThisMonth, allTime });
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's a quick look at your money.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Spent this month"
          value={formatCurrency(stats.totalThisMonth)}
          accent="bg-rose-50 text-rose-600"
        />
        <StatCard
          icon={Wallet}
          label="All-time spending"
          value={formatCurrency(stats.allTime)}
          accent="bg-primary-50 text-primary-600"
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={categories.length}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={CreditCard}
          label="Payment sources"
          value={sources.length}
          accent="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent expenses</h2>
            <Link
              to="/expenses"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-400">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <Inbox className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No expenses yet.</p>
              <Link to="/expenses" className="mt-2 text-sm font-medium text-primary-600">
                Add your first expense
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((expense) => (
                <li key={expense.id} className="flex items-center gap-4 py-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 text-xl">
                    {expense.category?.icon || "💸"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {expense.category?.name || expense.purpose || "Expense"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {expense.notes || expense.category?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-600">
                      − {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(expense.expenseDate)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Quick actions</h2>
            <ReceiptText className="w-5 h-5 text-gray-300" />
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
    <div className="card p-5">
      <div className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl mb-3 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xl sm:text-2xl font-bold tracking-tight truncate">{value}</p>
      <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">{label}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-400 truncate">{desc}</p>
      </div>
    </Link>
  );
}