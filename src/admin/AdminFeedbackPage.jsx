import { useEffect, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminFeedbackApi } from "./adminApi.js";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import { formatDate, getErrorMessage, toTitleCase } from "../utils/helpers.js";

const FEEDBACK_STATUSES = ["NEW", "UNDER_REVIEW", "IN_PROGRESS", "FIXED", "CLOSED"];
const FEEDBACK_CATEGORIES = ["BUG_REPORT", "FEATURE_REQUEST", "SUGGESTION", "GENERAL_FEEDBACK"];
const NOTIFICATION_STATUSES = ["NOT_SENT", "SENT", "LOGGED", "FAILED"];

const STATUS_BADGE = {
  NEW: "bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300",
  UNDER_REVIEW: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  IN_PROGRESS: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  FIXED: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  CLOSED: "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]",
};

const NOTIFICATION_BADGE = {
  SENT: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  LOGGED: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  FAILED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
  NOT_SENT: "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]",
};

function Badge({ value, map }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        map[value] || "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]"
      }`}
    >
      {toTitleCase(value)}
    </span>
  );
}

export default function AdminFeedbackPage() {
  const { can } = useAdminAuth();
  const canWrite = can("feedback:write");

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({
    search: "",
    status: "",
    category: "",
    notificationStatus: "",
    page: 0,
  });
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = async (overrides = {}) => {
    const params = { page: 0, size: 20, ...query, ...overrides };
    setLoading(true);
    try {
      const data = await adminFeedbackApi.list({
        search: params.search?.trim() || undefined,
        status: params.status || undefined,
        category: params.category || undefined,
        notificationStatus: params.notificationStatus || undefined,
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

  const openDetail = async (item) => {
    try {
      const full = await adminFeedbackApi.get(item.id);
      setSelected(full);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const changeStatus = async (status) => {
    if (!selected || !status || status === selected.status) return;
    setUpdating(true);
    try {
      const updated = await adminFeedbackApi.updateStatus(selected.id, status);
      setSelected(updated);
      toast.success(`Marked ${toTitleCase(status)}`);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <PageHeader title="Feedback" subtitle="Triage user reports" />

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="input pl-10"
            placeholder="Search subject, description, email..."
            value={query.search}
            onChange={(e) => setQuery({ ...query, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <select
          className="input md:w-40"
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value })}
        >
          <option value="">All statuses</option>
          {FEEDBACK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {toTitleCase(s)}
            </option>
          ))}
        </select>
        <select
          className="input md:w-44"
          value={query.category}
          onChange={(e) => setQuery({ ...query, category: e.target.value })}
        >
          <option value="">All categories</option>
          {FEEDBACK_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {toTitleCase(c)}
            </option>
          ))}
        </select>
        <select
          className="input md:w-44"
          value={query.notificationStatus}
          onChange={(e) => setQuery({ ...query, notificationStatus: e.target.value })}
        >
          <option value="">All notifications</option>
          {NOTIFICATION_STATUSES.map((n) => (
            <option key={n} value={n}>
              {toTitleCase(n)}
            </option>
          ))}
        </select>
        <button className="btn-secondary" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-ink-muted">No feedback matches these filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="md:hidden divide-y divide-borderWarm">
            {items.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.subject}</p>
                    <p className="text-xs text-ink-muted truncate">
                      {item.userEmail || item.contactEmail || "Anonymous"} •{" "}
                      {formatDate(item.submittedAt)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Badge value={item.status} map={STATUS_BADGE} />
                      <Badge value={item.category} map={{}} />
                    </div>
                  </div>
                  <button
                    className="btn-icon shrink-0"
                    onClick={() => openDetail(item)}
                    aria-label="View feedback"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-borderWarm">
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">From</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Notification</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Received</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderWarm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-mint/20 transition">
                    <td className="px-4 py-3 max-w-[16rem]">
                      <p className="font-medium truncate">{item.subject}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted hidden lg:table-cell max-w-[14rem] truncate">
                      {item.userEmail || item.contactEmail || "Anonymous"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={item.category} map={{}} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={item.status} map={STATUS_BADGE} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge value={item.notificationStatus} map={NOTIFICATION_BADGE} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap hidden lg:table-cell">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button className="btn-icon" title="View" onClick={() => openDetail(item)}>
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Feedback detail">
        {selected && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-1.5">
              <Badge value={selected.status} map={STATUS_BADGE} />
              <Badge value={selected.category} map={{}} />
              <Badge value={selected.notificationStatus} map={NOTIFICATION_BADGE} />
            </div>

            <div>
              <p className="label">Subject</p>
              <p className="text-sm font-medium text-gray-900 dark:text-[#EDE5D1]">
                {selected.subject}
              </p>
            </div>

            <div>
              <p className="label">Description</p>
              <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-[#CFC5AF]">
                {selected.description}
              </p>
            </div>

            {selected.stepsToReproduce && (
              <div>
                <p className="label">Steps to reproduce</p>
                <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-[#CFC5AF]">
                  {selected.stepsToReproduce}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label">From</p>
                <p className="truncate">{selected.userEmail || selected.contactEmail || "Anonymous"}</p>
                {selected.userName && <p className="text-xs text-ink-muted">{selected.userName}</p>}
              </div>
              <div>
                <p className="label">Received</p>
                <p>{formatDate(selected.submittedAt)}</p>
              </div>
              <div>
                <p className="label">Screenshot</p>
                <p>{selected.hasScreenshot ? "Attached (not stored)" : "None"}</p>
              </div>
              <div>
                <p className="label">Resolved</p>
                <p>{selected.resolvedAt ? formatDate(selected.resolvedAt) : "—"}</p>
              </div>
            </div>

            {selected.notificationStatus === "FAILED" && selected.notificationError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3">
                <p className="text-xs font-semibold text-red-600 dark:text-red-300 mb-1">
                  Notification failed
                </p>
                <p className="text-xs text-red-500 dark:text-red-300/80 break-all">
                  {selected.notificationError}
                </p>
              </div>
            )}

            {canWrite && (
              <div>
                <p className="label">Change status</p>
                <select
                  className="input"
                  value={selected.status}
                  disabled={updating}
                  onChange={(e) => changeStatus(e.target.value)}
                >
                  {FEEDBACK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {toTitleCase(s)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
