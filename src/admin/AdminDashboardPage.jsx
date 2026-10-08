import { useEffect, useState } from "react";
import { Users, MessageSquare, Flag, Activity } from "lucide-react";
import { adminDashboardApi } from "./adminApi.js";
import PageHeader from "../components/PageHeader.jsx";
import Loading from "../components/Loading.jsx";
import { formatDate, toTitleCase } from "../utils/helpers.js";

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p className="font-display text-2xl font-bold text-gray-900 dark:text-[#EDE5D1]">
          {value}
        </p>
      </div>
    </div>
  );
}

const STATUS_TINT = {
  NEW: "bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300",
  UNDER_REVIEW: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  IN_PROGRESS: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  FIXED: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  CLOSED: "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardApi
      .get()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (!data) return null;

  const statusEntries = Object.entries(data.feedbackByStatus || {});

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Operations overview"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total users"
          value={data.totalUsers ?? 0}
          tint="bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"
        />
        <StatCard
          icon={Activity}
          label="Active user sessions"
          value={data.activeUserSessions ?? 0}
          tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
        />
        <StatCard
          icon={MessageSquare}
          label="Feedback received"
          value={data.feedbackTotal ?? 0}
          tint="bg-accent-sienna/10 text-accent-sienna"
        />
        <StatCard
          icon={Flag}
          label="Flags enabled"
          value={`${data.flagsEnabled ?? 0} / ${data.flagsTotal ?? 0}`}
          tint="bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-5">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-gray-400 mb-4">
            New users (30 days)
          </h2>
          <p className="font-display text-3xl font-bold text-gray-900 dark:text-[#EDE5D1]">
            {data.newUsers30d ?? 0}
          </p>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-gray-400 mb-4">
            Feedback by status
          </h2>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-gray-400">No feedback yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {statusEntries.map(([status, count]) => (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    STATUS_TINT[status] || STATUS_TINT.CLOSED
                  }`}
                >
                  {toTitleCase(status)}
                  <span className="font-mono">{count}</span>
                </span>
              ))}
            </div>
          )}

          <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-gray-400 mt-6 mb-3">
            Feedback by category
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.feedbackByCategory || {}).map(([category, count]) => (
              <span
                key={category}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-[#241E14] dark:text-[#9C927A]"
              >
                {toTitleCase(category)}
                <span className="font-mono">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#2A2418]">
            <h2 className="font-display font-semibold">Recent feedback</h2>
          </div>
          {(data.recentFeedback || []).length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No feedback yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-[#2A2418]">
              {data.recentFeedback.map((item) => (
                <li key={item.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-[#EDE5D1]">
                      {item.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {toTitleCase(item.category)}
                      {item.userEmail ? ` • ${item.userEmail}` : " • Anonymous"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#2A2418]">
            <h2 className="font-display font-semibold">Recent admin activity</h2>
          </div>
          {(data.recentAudit || []).length === 0 ? (
            <p className="p-5 text-sm text-gray-400">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-[#2A2418]">
              {data.recentAudit.map((entry) => (
                <li key={entry.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-[#EDE5D1] truncate">
                      {entry.action}
                    </p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {entry.adminEmail}
                    {entry.details ? ` • ${entry.details}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
