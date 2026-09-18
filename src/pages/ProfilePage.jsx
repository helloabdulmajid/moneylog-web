import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Palette,
  SlidersHorizontal,
  Bell,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Download,
  Check,
} from "lucide-react";
import { userApi } from "../api/user.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  usePreferences,
  DEFAULT_PREFERENCES,
} from "../context/PreferencesContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import Toggle from "../components/Toggle.jsx";
import {
  getErrorMessage,
  formatDate,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
  LANGUAGE_OPTIONS,
  REMINDER_TIMING_OPTIONS,
  GENDER_OPTIONS,
} from "../utils/helpers.js";

const THEME_OPTIONS = [
  { value: "LIGHT", label: "Light" },
  { value: "DARK", label: "Dark" },
  { value: "SYSTEM", label: "Auto / System" },
];

const DELETION_PHRASE = "DELETE MY MONEYLOG ACCOUNT";

const matchesDeletionPhrase = (text) =>
  text.trim().toUpperCase().replace(/\s+/g, " ") === DELETION_PHRASE;

const TIMEZONES = (() => {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return [];
  }
})();

const BROWSER_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

function Section({ title, description, icon: Icon, danger = false, children }) {
  return (
    <section
      className={`card p-5 sm:p-6 ${
        danger ? "border-red-200 dark:border-red-900/60" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
            danger
              ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
              : "bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2
            className={`text-base font-semibold ${
              danger ? "text-red-700 dark:text-red-400" : ""
            }`}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { preferences, savePreferences } = usePreferences();

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", gender: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [prefsForm, setPrefsForm] = useState(DEFAULT_PREFERENCES);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [deleteStep, setDeleteStep] = useState(0);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    userApi
      .getProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setProfileForm({
          name: data.name || "",
          gender: data.gender || "",
        });
      })
      .catch((error) => toast.error(getErrorMessage(error)));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPrefsForm({ ...DEFAULT_PREFERENCES, ...preferences });
  }, [preferences]);

  const avatarInitial = (profileForm.name || user?.name || "U")
    .charAt(0)
    .toUpperCase();

  const timezoneOptions = useMemo(() => {
    const zones = TIMEZONES.length ? TIMEZONES : [BROWSER_TIMEZONE];
    if (!zones.includes(BROWSER_TIMEZONE)) {
      return [BROWSER_TIMEZONE, ...zones];
    }
    return zones;
  }, []);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await userApi.updateProfile({
        name: profileForm.name.trim(),
        gender: profileForm.gender || null,
      });
      setProfile(updated);
      setProfileForm((f) => ({ ...f, gender: updated.gender || "" }));
      updateUser({ name: updated.name });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleThemeChange = async (value) => {
    if (value === theme.toUpperCase()) return;
    setTheme(value.toLowerCase());
    setPrefsForm((f) => ({ ...f, theme: value }));
    setSavingTheme(true);
    try {
      await savePreferences({ theme: value });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingTheme(false);
    }
  };

  const handleSavePreferences = async (event) => {
    event.preventDefault();
    setSavingPrefs(true);
    try {
      await savePreferences({
        currency: prefsForm.currency,
        timezone: prefsForm.timezone || BROWSER_TIMEZONE,
        dateFormat: prefsForm.dateFormat,
        timeFormat: prefsForm.timeFormat,
        language: prefsForm.language,
      });
      toast.success("Preferences saved");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await savePreferences({
        billReminderEnabled: prefsForm.billReminderEnabled,
        mismatchAlertEnabled: prefsForm.mismatchAlertEnabled,
        spendingSummaryEnabled: prefsForm.spendingSummaryEnabled,
        reminderDaysBefore: prefsForm.reminderDaysBefore,
      });
      toast.success("Notification preferences saved");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await userApi.changePassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setChangingPassword(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteStep(0);
    setConfirmText("");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userApi.deleteAccount();
      toast.success("Your account has been deleted");
      logout();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
      setDeleting(false);
      setDeleteStep(0);
      setConfirmText("");
    }
  };

  return (
    <>
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your account, appearance and preferences"
      />

      <div className="space-y-6">
        <Section
          title="Personal Information"
          description="Your basic MoneyLog account details"
          icon={UserIcon}
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 text-2xl font-semibold">
                {avatarInitial}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {profile?.name || user?.name}
                </p>
                <p className="text-xs">Profile photo coming soon</p>
              </div>
            </div>

            <Field label="Display name">
              <input
                className="input"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Your name"
                maxLength={100}
              />
            </Field>

            <Field
              label="Email address"
              hint="Your email identifies your account and can't be changed here."
            >
              <input
                className="input opacity-70 cursor-not-allowed"
                value={profile?.email || user?.email || ""}
                disabled
              />
            </Field>

            <Field label="Gender">
              <select
                className="input"
                value={profileForm.gender || ""}
                onChange={(e) =>
                  setProfileForm((f) => ({ ...f, gender: e.target.value }))
                }
              >
                <option value="">Prefer not to say</option>
                {GENDER_OPTIONS.filter((o) => o.value).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            {profile?.createdAt && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Member since {formatDate(profile.createdAt)}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </Section>

        <Section
          title="Appearance"
          description="Choose how MoneyLog looks on this device"
          icon={Palette}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const active = theme.toUpperCase() === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value)}
                  disabled={savingTheme}
                  className={`flex items-center justify-between gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition ${
                    active
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {option.label}
                  {active && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </Section>

        <Section
          title="Preferences"
          description="Currency, time zone, date and language formats"
          icon={SlidersHorizontal}
        >
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Currency">
                <select
                  className="input"
                  value={prefsForm.currency}
                  onChange={(e) =>
                    setPrefsForm((f) => ({ ...f, currency: e.target.value }))
                  }
                >
                  {CURRENCY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Language">
                <select
                  className="input"
                  value={prefsForm.language}
                  onChange={(e) =>
                    setPrefsForm((f) => ({ ...f, language: e.target.value }))
                  }
                >
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Date format">
                <select
                  className="input"
                  value={prefsForm.dateFormat}
                  onChange={(e) =>
                    setPrefsForm((f) => ({ ...f, dateFormat: e.target.value }))
                  }
                >
                  {DATE_FORMAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Time format">
                <select
                  className="input"
                  value={prefsForm.timeFormat}
                  onChange={(e) =>
                    setPrefsForm((f) => ({ ...f, timeFormat: e.target.value }))
                  }
                >
                  {TIME_FORMAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              label="Time zone"
              hint={`System default: ${BROWSER_TIMEZONE}`}
            >
              <select
                className="input"
                value={prefsForm.timezone || BROWSER_TIMEZONE}
                onChange={(e) =>
                  setPrefsForm((f) => ({ ...f, timezone: e.target.value }))
                }
              >
                {timezoneOptions.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingPrefs}
              >
                {savingPrefs ? "Saving..." : "Save preferences"}
              </button>
            </div>
          </form>
        </Section>

        <Section
          title="Notifications"
          description="Choose what MoneyLog should notify you about"
          icon={Bell}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium">Credit-card bill due-date reminders</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get reminded before your credit-card bills are due
                </p>
              </div>
              <Toggle
                checked={!!prefsForm.billReminderEnabled}
                onChange={(v) =>
                  setPrefsForm((f) => ({ ...f, billReminderEnabled: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium">Statement / mismatch alerts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Alerts when recorded amounts look inconsistent
                </p>
              </div>
              <Toggle
                checked={!!prefsForm.mismatchAlertEnabled}
                onChange={(v) =>
                  setPrefsForm((f) => ({ ...f, mismatchAlertEnabled: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium">Spending summaries</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Periodic summaries of your spending
                </p>
              </div>
              <Toggle
                checked={!!prefsForm.spendingSummaryEnabled}
                onChange={(v) =>
                  setPrefsForm((f) => ({ ...f, spendingSummaryEnabled: v }))
                }
              />
            </div>

            <div className="pt-4">
              <Field label="Reminder timing">
                <select
                  className="input"
                  value={prefsForm.reminderDaysBefore}
                  onChange={(e) =>
                    setPrefsForm((f) => ({
                      ...f,
                      reminderDaysBefore: e.target.value,
                    }))
                  }
                  disabled={!prefsForm.billReminderEnabled}
                >
                  {REMINDER_TIMING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveNotifications}
                disabled={savingNotifications}
              >
                {savingNotifications ? "Saving..." : "Save notifications"}
              </button>
            </div>
          </div>
        </Section>

        <Section
          title="Change Password"
          description="Update the password used to sign in"
          icon={Lock}
        >
          <form
            onSubmit={handleChangePassword}
            className="space-y-4 max-w-lg"
          >
            <Field label="Current password">
              <input
                type="password"
                className="input"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    currentPassword: e.target.value,
                  }))
                }
              />
            </Field>
            <Field label="New password" hint="At least 6 characters">
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    confirmNewPassword: e.target.value,
                  }))
                }
              />
            </Field>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={changingPassword}
              >
                {changingPassword ? "Updating..." : "Change password"}
              </button>
            </div>
          </form>
        </Section>

        <Section
          title="Privacy & Data"
          description="What MoneyLog stores and how to manage it"
          icon={ShieldCheck}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            MoneyLog stores the following information linked to your account:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-5">
            {[
              "Account information",
              "Expenses",
              "Categories & subcategories",
              "Payment apps",
              "Payment sources",
              "Credit cards",
              "Bill payments",
              "User preferences",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                {item}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn-secondary"
            disabled
            title="Coming soon"
          >
            <Download className="w-4 h-4" /> Export My Data
          </button>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Data export is coming soon.
          </p>
        </Section>

        <Section
          title="Danger Zone"
          description="Permanently delete your account and all associated data"
          icon={AlertTriangle}
          danger
        >
          <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 dark:border-red-900/60 dark:bg-red-950/20">
            <p className="text-sm text-red-700 dark:text-red-300">
              Deleting your account is permanent and cannot be undone. This
              removes your account and all user-related MoneyLog data, including
              expenses, categories &amp; subcategories, payment apps, payment
              sources, credit cards, bill payments and your preferences.
            </p>
            <button
              type="button"
              className="btn-danger mt-4"
              onClick={() => setDeleteStep(1)}
            >
              Delete Account
            </button>
          </div>
        </Section>
      </div>

      <Modal
        open={deleteStep > 0}
        onClose={closeDeleteModal}
        title={deleteStep === 1 ? "Delete account?" : "Confirm deletion"}
      >
        {deleteStep === 1 ? (
          <div className="space-y-5">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This will permanently delete your account and all data associated
              with it, including expenses, categories, payment apps, payment
              sources, credit cards and bill payments.
            </p>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => setDeleteStep(2)}
              >
                I understand, continue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Type{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {DELETION_PHRASE}
              </span>{" "}
              to permanently delete your account.
            </p>
            <input
              className="input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={DELETION_PHRASE}
              autoFocus
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck="false"
              onKeyDown={(e) => {
                if (e.key === "Enter" && matchesDeletionPhrase(confirmText) && !deleting) {
                  handleDeleteAccount();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={!matchesDeletionPhrase(confirmText) || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
