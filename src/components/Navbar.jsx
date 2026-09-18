import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-8 py-4 bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
      <button
        className="btn-icon lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:flex relative flex-1 max-w-md items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-sienna" />
        <p className="text-sm text-gray-500 font-display">
          Keep your money simple and tracked.
        </p>
      </div>
      <div className="flex-1 lg:flex-none" />
    </header>
  );
}