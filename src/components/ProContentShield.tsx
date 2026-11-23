import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ban, EyeOff, Lock, ShieldAlert, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  buildProWatermarkStamp,
  formatShortDeviceId,
  isBlockedProShortcut,
  PRO_PERSONAL_REMINDER,
} from "../lib/proSecurity";

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function ProContentShield({
  active,
  sectionLabel,
  children,
}: {
  active: boolean;
  sectionLabel: string;
  children: React.ReactNode;
}) {
  const { deviceId, userName, showToast } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [curtainReason, setCurtainReason] = useState<string | null>(null);

  const shortDev = useMemo(() => formatShortDeviceId(deviceId), [deviceId]);
  const watermarkStamp = useMemo(
    () => buildProWatermarkStamp(deviceId, userName),
    [deviceId, userName]
  );

  useEffect(() => {
    if (!active) {
      setCurtainReason(null);
      return;
    }

    const triggerBlockToast = (action: string) => {
      if (action === "screenshot") {
        showToast("Screenshot lama ogola qeybta Pro. Qalabkaaga keliya ayay u furan tahay.");
      } else if (action === "print" || action === "save") {
        showToast("Dajinta ama daabacaadda (PDF/Save) waa ka xiran tahay qeybta Pro.");
      } else {
        showToast("Nuqul-qaadista iyo wadaagidda xogta Pro waa xiran tahay.");
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      const editable = isEditableElement(e.target);
      const blocked = isBlockedProShortcut(e, editable);
      if (!blocked) return;

      e.preventDefault();
      e.stopPropagation();

      if (blocked === "screenshot" || blocked === "print" || blocked === "save") {
        setCurtainReason(
          blocked === "screenshot"
            ? "Isku-day screenshot ama sawir-qaadis ayaa la joojiyay."
            : "Isku-day dajin ama daabacaad (PDF/Save) ayaa la joojiyay."
        );
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          navigator.clipboard.writeText("").catch(() => {});
        }
      }
      triggerBlockToast(blocked);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setCurtainReason("Shaashadda Pro waa la qariyay intii aad ka baxday si looga ilaaliyo screenshot ama duubis.");
      }
    };

    const handleWindowBlur = () => {
      if (document.activeElement && document.activeElement.tagName === "SELECT") {
        return;
      }
      setCurtainReason("Shaashadda Pro waa la qariyay si looga ilaaliyo duubis ama sawir-qaadis.");
    };

    const handleBeforePrint = () => {
      setCurtainReason("Daabacaadda iyo kaydinta PDF waa ka xiran yihiin qeybta Pro.");
      triggerBlockToast("print");
    };

    const el = containerRef.current;
    const handleSelectStart = (e: Event) => {
      if (!isEditableElement(e.target)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKey, true);
    window.addEventListener("keyup", handleKey, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeprint", handleBeforePrint);
    document.addEventListener("visibilitychange", handleVisibility);
    if (el) {
      el.addEventListener("selectstart", handleSelectStart);
    }

    return () => {
      window.removeEventListener("keydown", handleKey, true);
      window.removeEventListener("keyup", handleKey, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeprint", handleBeforePrint);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (el) {
        el.removeEventListener("selectstart", handleSelectStart);
      }
    };
  }, [active, showToast]);

  if (!active) {
    return <>{children}</>;
  }

  const handleBlockedInteraction = (e: React.SyntheticEvent) => {
    if (isEditableElement(e.target)) return;
    e.preventDefault();
    showToast("Qeybta Pro lama koobiyeeyo, lama dajisto, lamana wadaago.");
  };

  return (
    <>
      <div
        ref={containerRef}
        onContextMenu={handleBlockedInteraction}
        onCopy={handleBlockedInteraction}
        onCut={handleBlockedInteraction}
        onDragStart={handleBlockedInteraction}
        className="pro-shield-active relative space-y-4"
        data-pro-shield="active"
      >
        {/* Qoraal Xasuusin ah: Strictly 1 Student = 1 Device, No Screenshot/Download/Share */}
        <aside
          aria-label="Xasuusinta Ilaalinta Pro"
          className="rounded-2xl p-4 sm:p-5 border border-[#FFC93C]/50 bg-[#051836]/92 shadow-[0_10px_28px_rgba(0,0,0,0.28)] space-y-3"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-[#FFC93C]/18 border border-[#FFC93C]/45 text-[#FFD86B] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD86B]">
                  Qoraal Xasuusin ah · {sectionLabel}
                </div>
                <h3 className="font-head font-extrabold text-sm sm:text-base text-white leading-snug mt-0.5">
                  {PRO_PERSONAL_REMINDER.title}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#93C5FD] shrink-0">
              <Smartphone className="w-3.5 h-3.5" />
              <span>ID: {shortDev}</span>
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-white/85 leading-relaxed">
            {PRO_PERSONAL_REMINDER.body}
          </p>

          <div className="pt-2.5 border-t border-white/12 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-white/75">
            <span className="inline-flex items-center gap-1 text-rose-300">
              <Ban className="w-3.5 h-3.5" />
              <span>Screenshot: Waa Xiran Yahay</span>
            </span>
            <span className="inline-flex items-center gap-1 text-rose-300">
              <Ban className="w-3.5 h-3.5" />
              <span>Dajin / Download: Waa Xiran Yahay</span>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Wadaagid La'aan: Naftaada Keliya</span>
            </span>
          </div>
        </aside>

        {/* Protected Content Area with Anti-Leak Device Watermark + Privacy Curtain */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Repeating Diagonal Personalized Watermark Overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 z-20 overflow-hidden opacity-[0.075]"
          >
            <div className="w-[150%] h-[150%] -translate-x-[15%] -translate-y-[10%] -rotate-12 grid grid-cols-2 sm:grid-cols-3 gap-12 content-around justify-items-center py-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="font-mono font-extrabold text-[11px] sm:text-xs tracking-widest text-white whitespace-nowrap"
                >
                  {watermarkStamp}
                </span>
              ))}
            </div>
          </div>

          {/* Unlocked Pro Content */}
          <div className={curtainReason ? "blur-xl opacity-15 pointer-events-none transition-all duration-150" : "relative z-10"}>
            {children}
          </div>

          {/* Privacy Blur Overlay on Screenshot Attempt / App Switch / Print */}
          {curtainReason && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Ilaalinta Xogta Pro"
              className="absolute inset-0 z-30 bg-[#041024]/92 backdrop-blur-2xl flex items-center justify-center p-6 text-center"
            >
              <div className="max-w-md rounded-3xl p-6 border border-[#FFC93C]/45 bg-[#072047] space-y-4 shadow-2xl">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFC93C]/20 border border-[#FFC93C]/50 text-[#FFD86B] flex items-center justify-center">
                  <EyeOff className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD86B]">
                    Ilaalinta Xogta Pro · {shortDev}
                  </div>
                  <h4 className="font-head font-extrabold text-lg text-white">
                    {curtainReason}
                  </h4>
                  <p className="text-xs text-white/75 leading-relaxed">
                    Xogta Pro waxay u furan tahay qalabkaaga keliya; lama duubi karo, lama dajisan karo, lamana la wadaagi karo dad kale.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurtainReason(null)}
                  className="w-full h-11 rounded-xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-xs cursor-pointer transition-colors"
                >
                  Sii Wad Akhriska Qeybta Pro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print / PDF Export Blocker Fallback */}
      <div className="pro-print-block hidden">
        <h2>CAAWIYE Pro - Daabacaadda iyo Kaydinta PDF waa Xiran Yihiin</h2>
        <p>
          Xogtan Pro waxay si gaar ah ugu furan tahay ardayga furtay (ID: {shortDev}) lamana daabacan karo, lamana dajisan karo, lamana wadaagi karo amar la'aan.
        </p>
      </div>
    </>
  );
}
