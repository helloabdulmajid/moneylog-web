import { Home, LayoutDashboard, Plus, ReceiptText, Tags } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { path: "/app", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/expenses", label: "Expenses", icon: ReceiptText },
  { path: "/categories", label: "Categories", icon: Tags },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const openWizard = () => {
    navigate("/app", { state: { openWizard: true } });
  };

  return (
    <nav className="md:hidden sticky bottom-0 z-30 px-2 pb-2 pt-0 bg-[#F6F1E6]/95 backdrop-blur-md border-t border-gray-100 dark:bg-[#14110C]/95 dark:border-[#2A2418]">
      <div className="flex items-center justify-between">
        {TABS.slice(0, 2).map((tab) => (
          <TabButton key={tab.path} {...tab} active={isActive(tab.path)} onClick={() => navigate(tab.path)} />
        ))}

        <button
          onClick={openWizard}
          aria-label="Add expense"
          className="flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-200 transition hover:bg-primary-700 active:scale-95 dark:shadow-black/30"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {TABS.slice(2).map((tab) => (
          <TabButton key={tab.path} {...tab} active={isActive(tab.path)} onClick={() => navigate(tab.path)} />
        ))}
      </div>
    </nav>
  );
}

function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-lg transition select-none ${
        active ? "text-primary-700 dark:text-primary-300" : "text-gray-400 hover:text-gray-600 dark:text-[#8A8070] dark:hover:text-[#E6DFCE]"
      }`}
    >
      <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
      <span className={`text-[10px] font-medium ${active ? "text-primary-700 dark:text-primary-300" : "text-gray-400 dark:text-[#8A8070]"}`}>
        {label}
        {active && <span className="mx-auto block w-1 h-1 mt-0.5 rounded-full bg-primary-600" />}
      </span>
    </button>
  );
}