import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { layoutNav } from "../config/navigation.js";

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        aria-hidden={!open}
        className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-[color:var(--sb)] flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[color:var(--sb-active-bg)] text-[color:var(--sb-active-fg)] font-display font-bold text-lg shadow-sm">
            M
          </div>
          <div>
            <p className="font-display font-bold leading-tight text-[color:var(--sb-hi)]">
              MoneyLog
            </p>
            <p className="text-xs text-[color:var(--sb-lo)]">
              Chai first. Ledger later.
            </p>
          </div>
        </div>

        <nav className="flex-1 min-h-0 px-3 space-y-1">
          {layoutNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[color:var(--sb-active-bg)] text-[color:var(--sb-active-fg)]"
                    : "text-[color:var(--sb-lo)] hover:bg-[color:var(--sb-hover)] hover:text-[color:var(--sb-hi)]"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[color:var(--sb-divider)]">
          <NavLink
            to="/app/profile"
            onClick={onClose}
            className="flex items-center gap-3 mb-3 px-1 py-1 rounded-lg hover:bg-[color:var(--sb-hover)] transition"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--sb-bubble-bg)] text-[color:var(--sb-hi)] font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[color:var(--sb-hi)] truncate">
                {user?.name}
              </p>
              <p className="text-xs text-[color:var(--sb-lo)] truncate">
                {user?.email}
              </p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[color:var(--sb-logout)] hover:bg-[color:var(--sb-hover)] hover:text-[color:var(--sb-hi)] transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}