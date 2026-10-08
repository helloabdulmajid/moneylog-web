import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext.jsx";
import { adminNav } from "./adminNav.js";
import { toTitleCase } from "../utils/helpers.js";

export default function AdminLayout() {
  const { admin, logout, can } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = adminNav.filter((item) => !item.permission || can(item.permission));

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  const navLinks = (
    <nav className="flex-1 px-3 space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-[#9C927A] dark:hover:bg-[#241E14] dark:hover:text-[#EDE5D1]"
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white font-display font-bold text-lg shadow-sm">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div>
        <p className="font-display font-bold leading-tight text-gray-900 dark:text-[#EDE5D1]">
          MoneyLog
          <span className="ml-2 align-middle inline-flex items-center px-1.5 py-0.5 rounded-full border border-primary-200 text-[9px] font-semibold font-ledger tracking-[.18em] text-primary-600 dark:border-primary-500/40 dark:text-primary-300">
            ADMIN
          </span>
        </p>
        <p className="text-xs text-gray-400">Operations console</p>
      </div>
    </div>
  );

  const account = (
    <div className="border-t border-gray-100 dark:border-[#2A2418] px-3 py-4">
      <div className="px-2 mb-3 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate dark:text-[#EDE5D1]">
          {admin?.name}
        </p>
        <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
        <span className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold font-ledger tracking-wider bg-accent-sienna/10 text-accent-sienna">
          {toTitleCase(admin?.role || "")}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 transition hover:bg-accent-rose/40 hover:text-accent-sienna dark:text-[#9C927A]"
      >
        <LogOut className="w-5 h-5" />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#141009]">
      <aside className="hidden lg:flex lg:sticky top-0 h-screen w-64 shrink-0 flex-col bg-white dark:bg-[#1A150E] border-r border-gray-100 dark:border-[#2A2418]">
        {brand}
        {navLinks}
        {account}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 flex flex-col bg-white dark:bg-[#1A150E] border-r border-gray-100 dark:border-[#2A2418] transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          {brand}
          <button className="btn-icon mr-2 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {navLinks}
        {account}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-gray-100 dark:bg-[#1A150E]/95 dark:border-[#2A2418]">
          <button className="btn-icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-display font-bold text-sm text-gray-900 dark:text-[#EDE5D1]">
            MoneyLog Admin
          </p>
          <div className="w-9" />
        </header>

        <main className="flex-1 px-4 sm:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
