import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminFlagsApi } from "./adminApi.js";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import { formatDate, getErrorMessage } from "../utils/helpers.js";

const EMPTY_FORM = { key: "", description: "", enabled: false };

export default function AdminFlagsPage() {
  const { can } = useAdminAuth();
  const canWrite = can("flags:write");

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {id?, key, description, enabled}
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setFlags(await adminFlagsApi.list());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      if (editing.id) {
        await adminFlagsApi.update(editing.id, {
          description: editing.description,
          enabled: editing.enabled,
        });
        toast.success("Flag updated");
      } else {
        await adminFlagsApi.create({
          key: editing.key.trim(),
          description: editing.description,
          enabled: editing.enabled,
        });
        toast.success("Flag created");
      }
      setEditing(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const toggleFlag = async (flag) => {
    try {
      await adminFlagsApi.update(flag.id, { enabled: !flag.enabled });
      toast.success(`${flag.key} ${flag.enabled ? "disabled" : "enabled"}`);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await adminFlagsApi.remove(deleting.id);
      toast.success("Flag deleted");
      setDeleting(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Feature Flags"
        subtitle="Toggle features safely"
        action={
          canWrite && (
            <button className="btn-primary" onClick={() => setEditing({ ...EMPTY_FORM })}>
              <Plus className="w-4 h-4" /> New flag
            </button>
          )
        }
      />

      {loading ? (
        <Loading />
      ) : flags.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-ink-muted mb-4">No feature flags yet.</p>
          {canWrite && (
            <button className="btn-primary" onClick={() => setEditing({ ...EMPTY_FORM })}>
              <Plus className="w-4 h-4" /> Create the first flag
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-borderWarm">
            {flags.map((flag) => (
              <li key={flag.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-[#EDE5D1] truncate">
                    {flag.key}
                  </p>
                  <p className="text-xs text-ink-muted truncate">
                    {flag.description || "No description"}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {flag.updatedBy ? `by ${flag.updatedBy} • ` : ""}
                    {flag.updatedAt ? formatDate(flag.updatedAt) : ""}
                  </p>
                </div>

                <span
                  className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    flag.enabled
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-500 dark:bg-[#241E14] dark:text-[#9C927A]"
                  }`}
                >
                  {flag.enabled ? "Enabled" : "Disabled"}
                </span>

                {canWrite && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      className="btn-icon"
                      title={flag.enabled ? "Disable" : "Enable"}
                      onClick={() => toggleFlag(flag)}
                    >
                      {flag.enabled ? (
                        <ToggleRight className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      className="btn-icon"
                      title="Edit"
                      onClick={() =>
                        setEditing({
                          id: flag.id,
                          key: flag.key,
                          description: flag.description || "",
                          enabled: flag.enabled,
                        })
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="btn-icon text-ink-muted hover:text-accent-sienna hover:bg-accent-rose"
                      title="Delete"
                      onClick={() => setDeleting(flag)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.key}` : "New feature flag"}
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <p className="label">Key</p>
              <input
                className="input font-mono"
                placeholder="e.g. expenses.bulk_edit"
                value={editing.key}
                disabled={Boolean(editing.id)}
                onChange={(e) => setEditing({ ...editing, key: e.target.value })}
              />
              {!editing.id && (
                <p className="text-xs text-ink-muted mt-1">
                  Lowercase letters, digits, _ . : - only.
                </p>
              )}
            </div>
            <div>
              <p className="label">Description</p>
              <textarea
                className="input min-h-[80px]"
                placeholder="What does this flag control?"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.enabled}
                onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
              />
              Enabled
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={busy}>
                {editing.id ? "Save changes" : "Create flag"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete flag">
        {deleting && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-[#CFC5AF]">
              Delete <span className="font-mono font-semibold">{deleting.key}</span>? Clients will
              treat it as absent.
            </p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDelete} disabled={busy}>
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
