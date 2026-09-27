import { X } from "lucide-react";
import { usePwaInstall } from "../hooks/usePwaInstall.js";
import { useWizardStatus } from "../context/WizardStatusContext.jsx";

export default function InstallBanner() {
  const { canInstall, install, dismiss } = usePwaInstall();
  const { wizardActive } = useWizardStatus();

  if (!canInstall || wizardActive) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-white dark:bg-[#161310] border border-gray-200 dark:border-[#2A2418] shadow-lg px-4 py-3 max-w-sm w-full animate-slide-up">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-[#E6DFCE]">
            Install MoneyLog
          </p>
          <p className="text-xs text-gray-400 dark:text-[#8A8070] truncate">
            Add MoneyLog to your home screen
          </p>
        </div>
        <button onClick={install} className="btn-primary !py-2">
          Install
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#2A2418] transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}