import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import { adminAuthApi } from "./adminApi.js";
import PageHeader from "../components/PageHeader.jsx";
import { formatDate, getErrorMessage, toTitleCase } from "../utils/helpers.js";

const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function AdminProfilePage() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 12) {
      toast.error("New password must be at least 12 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const result = await adminAuthApi.changePassword(form);
      toast.success(result.message || "Password changed");
      setForm(EMPTY_PASSWORDS);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Account" subtitle="Administrator profile" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Name</dt>
              <dd className="font-medium text-right">{admin?.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Email</dt>
              <dd className="font-medium text-right break-all">{admin?.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Role</dt>
              <dd>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent-sienna/10 text-accent-sienna">
                  {toTitleCase(admin?.role || "")}
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Last sign-in</dt>
              <dd className="text-right">
                {admin?.lastLoginAt ? formatDate(admin.lastLoginAt) : "—"}
              </dd>
            </div>
          </dl>

          <h3 className="label mt-6">Permissions</h3>
          <div className="flex flex-wrap gap-1.5">
            {(admin?.permissions || []).map((permission) => (
              <span
                key={permission}
                className="inline-flex px-2 py-0.5 rounded text-[11px] font-mono bg-gray-100 text-gray-600 dark:bg-[#241E14] dark:text-[#9C927A]"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> Change password
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <p className="label">Current password</p>
              <input
                type="password"
                className="input"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <p className="label">New password</p>
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                minLength={12}
                placeholder="At least 12 characters"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <p className="label">Confirm new password</p>
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                minLength={12}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-ink-muted">
              Changing your password signs out your other admin sessions.
            </p>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
