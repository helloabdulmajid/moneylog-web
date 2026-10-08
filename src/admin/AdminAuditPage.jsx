import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminAuditApi } from "./adminApi.js";
import PageHeader from "../components/PageHeader.jsx";
import Loading from "../components/Loading.jsx";
import { formatDate, getErrorMessage } from "../utils/helpers.js";

export default function AdminAuditPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ action: "", from: "", to: "", page: 0 });

  const load = async (overrides = {}) => {
    const params = { page: 0, size: 20, ...query, ...overrides };
    setLoading(true);
    try {
      const data = await adminAuditApi.list({
        action: params.action?.trim() || undefined,
        from: params.from ? `${params.from}T00:00:00` : undefined,
        to: params.to ? `${params.to}T23:59:59` : undefined,
        page: params.page,
        size: params.size,
      });
      setItems(data.content || []);
      setPagination({
        number: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
      setQuery((prev) => ({ ...prev, page: params.page }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => load({ page: 0 });

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Who did what" />

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="input pl-10"
            placeholder="Filter by action (e.g. feedback.status_changed)..."
            value={query.action}
            onChange={(e) => setQuery({ ...query, action: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <input
          type="date"
          className="input md:w-40"
          value={query.from}
          onChange={(e) => setQuery({ ...query, from: e.target.value })}
          title="From date"
        />
        <input
          type="date"
          className="input md:w-40"
          value={query.to}
          onChange={(e) => setQuery({ ...query, to: e.target.value })}
          title="To date"
        />
        <button className="btn-secondary" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-ink-muted">No audit entries match these filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-borderWarm">
            {items.map((entry) => (
              <li key={entry.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-[#EDE5D1]">
                    {entry.action}
                  </p>
                  <p className="text-xs text-ink-muted whitespace-nowrap">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-ink-muted">
                  <span>{entry.adminEmail || "system"}</span>
                  {entry.targetType && (
                    <span>
                      target: {entry.targetType}
                      {entry.targetId ? `/${entry.targetId.slice(0, 8)}` : ""}
                    </span>
                  )}
                  {entry.ip && <span>ip: {entry.ip}</span>}
                </div>
                {entry.details && (
                  <p className="text-xs text-ink-muted mt-1 break-all">{entry.details}</p>
                )}
              </li>
            ))}
          </ul>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-borderWarm">
              <p className="text-xs text-ink-muted">
                Page {pagination.number + 1} of {pagination.totalPages} •{" "}
                {pagination.totalElements} total
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number === 0}
                  onClick={() => load({ page: pagination.number - 1 })}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number + 1 >= pagination.totalPages}
                  onClick={() => load({ page: pagination.number + 1 })}
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
