import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FeatureFlagContext = createContext({
  enabledFlags: [],
  loading: true,
  isFlagEnabled: () => false,
});

export function FeatureFlagProvider({ children }) {
  const [enabledFlags, setEnabledFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/feature-flags")
      .then((res) => {
        if (!cancelled) {
          setEnabledFlags(res.data?.enabled || []);
        }
      })
      .catch(() => {
        // Public endpoint failing must never block the app; all flags stay off.
        if (!cancelled) setEnabledFlags([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isFlagEnabled = (key) => enabledFlags.includes(key);

  return (
    <FeatureFlagContext.Provider value={{ enabledFlags, loading, isFlagEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
