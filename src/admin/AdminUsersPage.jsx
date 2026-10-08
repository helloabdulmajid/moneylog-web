import { useEffect, useState } from "react";
import { Search, Eye, ShieldOff, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminUsersApi } from "./adminApi.js";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import { formatDate, getErrorMessage, toTitleCase } from "../utils/helpers.js";

function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
      Unverified
    </span>
  );
}

export default function AdminUsersPage() {
  const { can } = useAdminAuth();
  const canRevoke = can("users:sessions:revoke");
  const canVerify = can("users:verify");

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ number: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({ search: "", emailVerified: "", page: 0 });
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async (overrides = {}) => {
    const params = { page: 0, size: 20, ...query, ...overrides };
    setLoading(true);
    try {
      const data = await adminUsersApi.list({
        search: params.search?.trim() || undefined,
        emailVerified:
          params.emailVerified === "" ? undefined : params.emailVerified === "true",
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

  const openDetail = async (user) => {
    setSelected({ id: user.id });
    setDetailLoading(true);
    try {
      const detail = await adminUsersApi.get(user.id);
      setSelected(detail);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selected?.id) return;
    setBusy(true);
    try {
      const result = await adminUsersApi.verifyEmail(selected.id);
      toast.success(result.message || "Email verified");
      const detail = await adminUsersApi.get(selected.id);
      setSelected(detail);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    if (!selected?.id) return;
    setBusy(true);
    try {
      const result = await adminUsersApi.revokeSessions(selected.id);
      toast.success(result.message || "Sessions revoked");
      const detail = await adminUsersApi.get(selected.id);
      setSelected(detail);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Accounts and access" />

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            className="input pl-10"
            placeholder="Search email or name..."
            value={query.search}
            onChange={(e) => setQuery({ ...query, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
        <select
          className="input md:w-44"
          value={query.emailVerified}
          onChange={(e) => setQuery({ ...query, emailVerified: e.target.value })}
        >
          <option value="">All accounts</option>
          <option value="true">Verified only</option>
          <option value="false">Unverified only</option>
        </select>
        <button className="btn-secondary" onClick={applyFilters}>
          Apply
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-ink-muted">No users match this search.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="md:hidden divide-y divide-borderWarm">
            {items.map((user) => (
              <li key={user.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{user.email}</p>
                  <p className="text-xs text-ink-muted truncate">
                    {user.name} • {user.activeSessions} active session
                    {user.activeSessions === 1 ? "" : "s"} • {user.feedbackCount} feedback
                  </p>
                  <div className="mt-1.5">
                    <VerifiedBadge verified={user.emailVerified} />
                  </div>
                </div>
                <button
                  className="btn-icon shrink-0"
                  onClick={() => openDetail(user)}
                  aria-label="View user"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-borderWarm">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Sessions</th>
                  <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">Feedback</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderWarm">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-mint/20 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[18rem]">{user.email}</p>
                      <p className="text-xs text-ink-muted truncate">{user.name}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <VerifiedBadge verified={user.emailVerified} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{user.activeSessions}</td>
                    <td className="px-4 py-3 text-right font-mono hidden sm:table-cell">
                      {user.feedbackCount}
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap hidden lg:table-cell">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button className="btn-icon" title="View" onClick={() => openDetail(user)}>
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
                  Prev
                </button>
                <button
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                  disabled={pagination.number + 1 >= pagination.totalPages}
                  onClick={() => load({ page: pagination.number + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.email || "User detail"}
      >
        {detailLoading || !selected?.id ? (
          <Loading text="Loading user..." />
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center gap-2">
              <VerifiedBadge verified={selected.emailVerified} />
              <span className="text-xs text-ink-muted">
                Joined {formatDate(selected.createdAt)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="label">Name</p>
                <p>{selected.name}</p>
              </div>
              <div>
                <p className="label">Gender</p>
                <p>{selected.gender ? toTitleCase(selected.gender) : "—"}</p>
              </div>
              <div>
                <p className="label">Active sessions</p>
                <p className="font-mono">{selected.activeSessions}</p>
              </div>
              <div>
                <p className="label">Feedback</p>
                <p className="font-mono">{selected.feedback?.length || 0}</p>
              </div>
            </div>

            {selected.preference && (
              <div>
                <p className="label">Preferences</p>
                <div className="rounded-lg bg-gray-50 dark:bg-[#241E14] p-3 text-xs grid grid-cols-2 gap-2">
                  <span>Currency: {selected.preference.currency}</span>
                  <span>Theme: {toTitleCase(selected.preference.theme || "")}</span>
                  <span>Language: {selected.preference.language}</span>
                  <span>Date: {toTitleCase(selected.preference.dateFormat || "")}</span>
                </div>
              </div>
            )}

            <div>
              <p className="label">Sessions</p>
              {(selected.sessions || []).length === 0 ? (
                <p className="text-sm text-ink-muted">No sessions recorded.</p>
              ) : (
                <ul className="divide-y divide-borderWarm rounded-lg border border-borderWarm">
                  {selected.sessions.map((session, index) => (
                    <li key={index} className="px-3 py-2 text-xs flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {session.deviceLabel || "Unknown device"}
                        </p>
                        <p className="text-ink-muted truncate">
                          Last active {formatDate(session.lastActivityAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          session.active
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]"
                        }`}
                      >
                        {session.active ? "Active" : "Revoked"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="label">Recent feedback</p>
              {(selected.feedback || []).length === 0 ? (
                <p className="text-sm text-ink-muted">No feedback from this user.</p>
              ) : (
                <ul className="space-y-2">
                  {selected.feedback.map((item) => (
                    <li key={item.id} className="rounded-lg border border-borderWarm px-3 py-2">
                      <p className="text-sm font-medium truncate">{item.subject}</p>
                      <p className="text-xs text-ink-muted">
                        {toTitleCase(item.category)} • {item.status} •{" "}
                        {formatDate(item.submittedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-borderWarm">
              {canVerify && !selected.emailVerified && (
                <button className="btn-secondary" disabled={busy} onClick={handleVerify}>
                  <BadgeCheck className="w-4 h-4" /> Verify email
                </button>
              )}
              {canRevoke && (
                <button
                  className="btn-danger"
                  disabled={busy || selected.activeSessions === 0}
                  onClick={handleRevoke}
                >
                  <ShieldOff className="w-4 h-4" /> Revoke all sessions
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
