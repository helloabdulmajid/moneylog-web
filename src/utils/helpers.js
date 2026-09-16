export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDate(isoDate) {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function formatTime(time) {
  if (!time) return "";
  return time.slice(0, 5);
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