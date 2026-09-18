const DEFAULT_PREFERENCES = {
  currency: "INR",
  dateFormat: "DD_MMM_YYYY",
  timeFormat: "TWENTY_FOUR_HOUR",
  timezone: null,
};

let activePreferences = { ...DEFAULT_PREFERENCES };

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "DD_MMM_YYYY", label: "18 Sep 2026" },
  { value: "DD_MM_YYYY", label: "18/09/2026" },
  { value: "MM_DD_YYYY", label: "09/18/2026" },
  { value: "YYYY_MM_DD", label: "2026-09-18" },
];

export const TIME_FORMAT_OPTIONS = [
  { value: "TWENTY_FOUR_HOUR", label: "24-hour (18:30)" },
  { value: "TWELVE_HOUR", label: "12-hour (6:30 PM)" },
];

export const LANGUAGE_OPTIONS = [{ value: "en", label: "English" }];

export const REMINDER_TIMING_OPTIONS = [
  { value: "DAYS_1", label: "1 day before" },
  { value: "DAYS_3", label: "3 days before" },
  { value: "DAYS_7", label: "7 days before" },
  { value: "DAYS_10", label: "10 days before" },
];

export const GENDER_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

export function configureFormatting(preferences) {
  activePreferences = { ...DEFAULT_PREFERENCES, ...(preferences || {}) };
}

const DATE_LOCALES = {
  DD_MMM_YYYY: { locale: "en-GB", options: { day: "2-digit", month: "short", year: "numeric" } },
  DD_MM_YYYY: { locale: "en-GB", options: { day: "2-digit", month: "2-digit", year: "numeric" } },
  MM_DD_YYYY: { locale: "en-US", options: { day: "2-digit", month: "2-digit", year: "numeric" } },
  YYYY_MM_DD: { locale: "en-CA", options: { day: "2-digit", month: "2-digit", year: "numeric" } },
};

function localeForCurrency(currency) {
  return currency === "INR" ? "en-IN" : "en-US";
}

export function formatCurrency(value) {
  const currency = activePreferences.currency || "INR";
  return new Intl.NumberFormat(localeForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";

  const config =
    DATE_LOCALES[activePreferences.dateFormat] || DATE_LOCALES.DD_MMM_YYYY;

  const isDateOnly =
    typeof isoDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(isoDate);
  const timeZone = isDateOnly
    ? "UTC"
    : activePreferences.timezone || undefined;

  try {
    return new Intl.DateTimeFormat(config.locale, {
      ...config.options,
      timeZone,
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat(config.locale, config.options).format(d);
  }
}

export function formatTime(time) {
  if (!time) return "";
  const raw = String(time).slice(0, 5);
  if (activePreferences.timeFormat !== "TWELVE_HOUR") return raw;

  const [hourStr, minute] = raw.split(":");
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return raw;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) {
    const first = Object.values(error.response.data.errors)[0];
    if (first) return first;
  }
  return "Something went wrong. Please try again.";
}

export function toTitleCase(value) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
