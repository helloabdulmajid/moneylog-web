import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "../api/user";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { configureFormatting } from "../utils/helpers";

const PreferencesContext = createContext(null);

export const DEFAULT_PREFERENCES = {
  theme: "LIGHT",
  currency: "INR",
  timezone: null,
  dateFormat: "DD_MMM_YYYY",
  timeFormat: "TWENTY_FOUR_HOUR",
  language: "en",
  billReminderEnabled: true,
  mismatchAlertEnabled: true,
  spendingSummaryEnabled: false,
  reminderDaysBefore: "DAYS_7",
};

export function PreferencesProvider({ children }) {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const [preferences, setPreferencesState] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureFormatting(preferences);
  }, [preferences]);

  useEffect(() => {
    if (!user) {
      setPreferencesState(DEFAULT_PREFERENCES);
      configureFormatting(DEFAULT_PREFERENCES);
      return;
    }

    let cancelled = false;
    setLoading(true);
    userApi
      .getPreferences()
      .then((data) => {
        if (cancelled) return;
        const merged = { ...DEFAULT_PREFERENCES, ...data };
        setPreferencesState(merged);
        if (merged.theme) setTheme(String(merged.theme).toLowerCase());
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const applyServer = (data) => {
    const merged = { ...DEFAULT_PREFERENCES, ...data };
    setPreferencesState(merged);
    if (merged.theme) setTheme(String(merged.theme).toLowerCase());
    return merged;
  };

  const savePreferences = async (partial) => {
    const data = await userApi.updatePreferences(partial);
    return applyServer(data);
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, setPreferences: setPreferencesState, savePreferences, loading }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context)
    throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}
