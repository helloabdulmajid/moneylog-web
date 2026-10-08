import { createContext, useContext, useEffect, useState } from "react";
import {
  ADMIN_ACCESS_KEY,
  ADMIN_REFRESH_KEY,
  ADMIN_USER_KEY,
  adminAuthApi,
  clearAdminAuthState,
} from "./adminApi.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(ADMIN_ACCESS_KEY)));

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!localStorage.getItem(ADMIN_ACCESS_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const profile = await adminAuthApi.me();
        if (!cancelled) {
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(profile));
          setAdmin(profile);
        }
      } catch {
        if (!cancelled) {
          clearAdminAuthState();
          setAdmin(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await adminAuthApi.login({ email, password });
      localStorage.setItem(ADMIN_ACCESS_KEY, data.accessToken);
      localStorage.setItem(ADMIN_REFRESH_KEY, data.refreshToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
      setAdmin(data.admin);
      return data.admin;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY);
      if (refreshToken) {
        await adminAuthApi.logout(refreshToken);
      }
    } catch {
      // Best effort: revoke server-side, then always clear locally.
    } finally {
      clearAdminAuthState();
      setAdmin(null);
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
  };

  const can = (permission) => Boolean(admin?.permissions?.includes(permission));

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, can }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
}
