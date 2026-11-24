import React from "react";
import { BookOpen, GraduationCap, Home, LockOpen, Target } from "lucide-react";
import { useApp } from "../context/AppContext";

export type MainNavTab = "home" | "school" | "bridging" | "faculty_home" | "pro_hub";

interface NavItem {
  id: MainNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeGradient: string;
  activeShadow: string;
  inactiveIconClass: string;
  hoverTintClass: string;
  dotColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Hoyga",
    icon: Home,
    activeGradient: "linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)",
    activeShadow: "0 6px 18px rgba(37, 99, 235, 0.42)",
    inactiveIconClass: "text-[#2563EB] dark:text-[#60A5FA]",
    hoverTintClass: "hover:bg-blue-500/10",
    dotColor: "#60A5FA",
  },
  {
    id: "school",
    label: "School",
    icon: BookOpen,
    activeGradient: "linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)",
    activeShadow: "0 6px 18px rgba(6, 182, 212, 0.40)",
    inactiveIconClass: "text-[#0284C7] dark:text-[#38BDF8]",
    hoverTintClass: "hover:bg-cyan-500/10",
    dotColor: "#38BDF8",
  },
  {
    id: "bridging",
    label: "Gap",
    icon: Target,
    activeGradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    activeShadow: "0 6px 18px rgba(16, 185, 129, 0.40)",
    inactiveIconClass: "text-[#059669] dark:text-[#34D399]",
    hoverTintClass: "hover:bg-emerald-500/10",
    dotColor: "#34D399",
  },
  {
    id: "faculty_home",
    label: "Jaamacad",
    icon: GraduationCap,
    activeGradient: "linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)",
    activeShadow: "0 6px 18px rgba(99, 102, 241, 0.42)",
    inactiveIconClass: "text-[#4F46E5] dark:text-[#A78BFA]",
    hoverTintClass: "hover:bg-indigo-500/10",
    dotColor: "#A78BFA",
  },
  {
    id: "pro_hub",
    label: "Unlock+",
    icon: LockOpen,
    activeGradient: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
    activeShadow: "0 6px 18px rgba(245, 158, 11, 0.42)",
    inactiveIconClass: "text-[#D97706] dark:text-[#FBBF24]",
    hoverTintClass: "hover:bg-amber-500/10",
    dotColor: "#FBBF24",
  },
];

export function BottomNavBar({
  activeTab,
  onSelect,
}: {
  activeTab: MainNavTab;
  onSelect: (tab: MainNavTab) => void;
}) {
  const { darkMode, tr } = useApp();

  return (
    <nav
      aria-label="Qeybaha Waaweyn"
      dir="ltr"
      className="fixed bottom-0 inset-x-0 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(640px,94vw)] z-40 pointer-events-none"
    >
      <div
        className={`pointer-events-auto grid grid-cols-5 gap-1 sm:gap-1.5 px-2 sm:px-2.5 pt-1.5 pb-[calc(0.45rem+env(safe-area-inset-bottom))] sm:py-2 sm:rounded-2xl backdrop-blur-2xl border-t sm:border transition-colors ${
          darkMode
            ? "bg-[#06142B]/92 border-white/15 shadow-[0_-8px_28px_rgba(0,0,0,0.45)] sm:shadow-[0_16px_44px_rgba(0,0,0,0.55)]"
            : "bg-white/94 border-slate-200/90 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] sm:shadow-[0_14px_38px_rgba(15,23,42,0.14)]"
        }`}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const displayLabel =
            item.id === "faculty_home"
              ? tr("Jaamacad")
              : item.id === "pro_hub"
                ? tr("Unlock+")
                : item.label;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative min-h-[48px] sm:min-h-[50px] rounded-xl flex flex-col items-center justify-center gap-0.5 px-1 cursor-pointer transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isActive
                  ? "text-white -translate-y-0.5"
                  : `${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    } ${item.hoverTintClass}`
              }`}
              style={
                isActive
                  ? {
                      background: item.activeGradient,
                      boxShadow: item.activeShadow,
                    }
                  : undefined
              }
            >
              <Icon
                className={`w-[19px] h-[19px] sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 ${
                  isActive ? "text-white scale-105" : item.inactiveIconClass
                }`}
              />
              <span
                className={`text-[10.5px] sm:text-[11px] leading-none tracking-tight whitespace-nowrap truncate max-w-full ${
                  isActive ? "font-extrabold text-white" : "font-bold opacity-90"
                }`}
              >
                {displayLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
