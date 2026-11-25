import React, { useEffect, useMemo, useRef, useState } from "react";
import { Ban, EyeOff, Lock, ShieldAlert, Smartphone } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  buildProWatermarkStamp,
  buildProWatermarkTileDataUri,
  formatShortDeviceId,
  formatWatermarkTimeTag,
  isBlockedProShortcut,
  isTamperedOverlayStyle,
  PRO_IDLE_LOCK_MS,
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
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const outboundClickAtRef = useRef<number>(0);
  const [curtainReason, setCurtainReason] = useState<string | null>(null);
  const [timeTag, setTimeTag] = useState<string>(() => formatWatermarkTimeTag());
  const [watermarkRev, setWatermarkRev] = useState<number>(0);

  const shortDev = useMemo(() => formatShortDeviceId(deviceId), [deviceId]);
  const watermarkStamp = useMemo(
    () => buildProWatermarkStamp(deviceId, userName, timeTag),
    [deviceId, userName, timeTag]
  );
  const watermarkTileUri = useMemo(
    () => buildProWatermarkTileDataUri(watermarkStamp),
    [watermarkStamp]
  );

  useEffect(() => {
    if (!active) return;
    setTimeTag(formatWatermarkTimeTag());
    const id = window.setInterval(() => {
      setTimeTag(formatWatermarkTimeTag());
    }, 60_000);
    return () => window.clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) {
      setCurtainReason(null);
      document.body.classList.remove("pro-body-locked");
      return;
    }

    document.body.classList.add("pro-body-locked");

    const triggerBlockToast = (action: string) => {
      if (action === "screenshot") {
        showToast("Screenshot lama ogola qeybta Unlock+. Qalabkaaga keliya ayay u furan tahay.");
      } else if (action === "print" || action === "save") {
        showToast("Dajinta ama daabacaadda (PDF/Save) waa ka xiran tahay qeybta Unlock+.");
      } else if (action === "devtools") {
        showToast("Furista DevTools iyo baaritaanka koodhka waa ka xiran tahay qeybta Unlock+.");
      } else {
        showToast("Nuqul-qaadista iyo wadaagidda xogta Unlock+ waa xiran tahay.");
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      const editable = isEditableElement(e.target);
      const blocked = isBlockedProShortcut(e, editable);
      if (!blocked) return;

      e.preventDefault();
      e.stopPropagation();

      if (
        blocked === "screenshot" ||
        blocked === "print" ||
        blocked === "save" ||
        blocked === "devtools"
      ) {
        setCurtainReason(
          blocked === "screenshot"
            ? "Isku-day screenshot ama sawir-qaadis ayaa la joojiyay."
            : blocked === "devtools"
            ? "Isku-day furista DevTools ama baaritaanka koodhka waa la xiray."
            : "Isku-day dajin ama daabacaad (PDF/Save) ayaa la joojiyay."
        );
      }
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText("").catch(() => {});
      }
      triggerBlockToast(blocked);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setCurtainReason("Shaashadda Unlock+ waa la qariyay intii aad ka baxday si looga ilaaliyo screenshot ama duubis.");
      }
    };

    const handleWindowBlur = () => {
      if (isEditableElement(document.activeElement)) {
        return;
      }
      if (Date.now() - outboundClickAtRef.current < 1500) {
        return;
      }
      setCurtainReason("Shaashadda Unlock+ waa la qariyay si looga ilaaliyo duubis ama sawir-qaadis.");
    };

    const handlePageHide = () => {
      setCurtainReason("Shaashadda Unlock+ waa la xiray si looga ilaaliyo qabashada xogta.");
    };

    const handleBeforePrint = () => {
      setCurtainReason("Daabacaadda iyo kaydinta PDF waa ka xiran yihiin qeybta Unlock+.");
      triggerBlockToast("print");
    };

    const handleGlobalBlockedEvent = (e: Event) => {
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      if (e.type !== "selectstart" && e.type !== "dragstart") {
        showToast("Qeybta Unlock+ lama koobiyeeyo, lama dajisto, lamana wadaago.");
      }
    };

    // Idle auto-lock if student leaves phone unattended on Unlock+ screen
    let idleTimer: number | null = null;
    const resetIdleTimer = (e?: Event) => {
      if (e && e.target instanceof Element && e.target.closest('a[target="_blank"]')) {
        outboundClickAtRef.current = Date.now();
      }
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        setCurtainReason("Shaashadda Unlock+ waa la xiray muddo aan la taaban si loo ilaaliyo xogtaada.");
      }, PRO_IDLE_LOCK_MS);
    };
    resetIdleTimer();

    // Anti-tampering guard: locks & re-mounts watermark if deleted or hidden via DevTools
    const checkWatermarkIntegrity = () => {
      const wm = watermarkRef.current;
      if (!wm || !document.body.contains(wm)) {
        setCurtainReason("Isku-day ka-saarid calaamadda amniga ah ayaa la joojiyay.");
        setWatermarkRev((r) => r + 1);
        return;
      }
      const computed = window.getComputedStyle(wm);
      if (isTamperedOverlayStyle({
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
      }) || !computed.backgroundImage || computed.backgroundImage === "none") {
        setCurtainReason("Isku-day wax-ka-beddel calaamadda amniga ah ayaa la joojiyay.");
        setWatermarkRev((r) => r + 1);
      }
    };

    const tamperObserver = new MutationObserver(() => {
      checkWatermarkIntegrity();
    });
    if (containerRef.current) {
      tamperObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class", "hidden"],
      });
    }
    const integrityInterval = window.setInterval(checkWatermarkIntegrity, 1500);

    window.addEventListener("keydown", handleKey, true);
    window.addEventListener("keyup", handleKey, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("scroll", resetIdleTimer, { passive: true });
    window.addEventListener("pointerdown", resetIdleTimer, { passive: true });
    window.addEventListener("touchstart", resetIdleTimer, { passive: true });
    window.addEventListener("keydown", resetIdleTimer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("freeze", handlePageHide);
    document.addEventListener("contextmenu", handleGlobalBlockedEvent, true);
    document.addEventListener("copy", handleGlobalBlockedEvent, true);
    document.addEventListener("cut", handleGlobalBlockedEvent, true);
    document.addEventListener("dragstart", handleGlobalBlockedEvent, true);
    document.addEventListener("selectstart", handleGlobalBlockedEvent, true);

    return () => {
      document.body.classList.remove("pro-body-locked");
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      window.clearInterval(integrityInterval);
      tamperObserver.disconnect();
      window.removeEventListener("keydown", handleKey, true);
      window.removeEventListener("keyup", handleKey, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("pointerdown", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("freeze", handlePageHide);
      document.removeEventListener("contextmenu", handleGlobalBlockedEvent, true);
      document.removeEventListener("copy", handleGlobalBlockedEvent, true);
      document.removeEventListener("cut", handleGlobalBlockedEvent, true);
      document.removeEventListener("dragstart", handleGlobalBlockedEvent, true);
      document.removeEventListener("selectstart", handleGlobalBlockedEvent, true);
    };
  }, [active, showToast]);

  if (!active) {
    return <>{children}</>;
  }

  const handleBlockedInteraction = (e: React.SyntheticEvent) => {
    if (isEditableElement(e.target)) return;
    e.preventDefault();
    showToast("Qeybta Unlock+ lama koobiyeeyo, lama dajisto, lamana wadaago.");
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
          aria-label="Xasuusinta Ilaalinta Unlock+"
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

        {/* Protected Content Area with Viewport-Fixed Anti-Leak Watermark + Privacy Curtain */}
        <div className="relative rounded-3xl">
          {/* Repeating Full-Viewport Timestamped Watermark (visible at every scroll depth) */}
          <div
            key={watermarkRev}
            ref={watermarkRef}
            aria-hidden="true"
            data-testid="pro-watermark-layer"
            className="pointer-events-none select-none fixed inset-0 z-30"
            style={{
              backgroundImage: `url("${watermarkTileUri}")`,
              backgroundRepeat: "repeat",
            }}
          />

          {/* Unlocked Pro Content */}
          <div
            className={
              curtainReason
                ? "blur-2xl opacity-10 pointer-events-none select-none transition-all duration-150"
                : "relative z-10"
            }
          >
            {children}
          </div>
        </div>
      </div>

      {/* Fixed Viewport-Centered Privacy Blur Curtain on Screenshot Attempt / App Switch / Print / Idle */}
      {curtainReason && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ilaalinta Xogta Unlock+"
          data-testid="pro-privacy-curtain"
          className="fixed inset-0 z-50 bg-[#041024]/95 backdrop-blur-2xl flex items-center justify-center p-5 text-center overflow-y-auto"
        >
          <div className="w-full max-w-md rounded-3xl p-6 border border-[#FFC93C]/45 bg-[#072047] space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFC93C]/20 border border-[#FFC93C]/50 text-[#FFD86B] flex items-center justify-center">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD86B]">
                Ilaalinta Xogta Unlock+ · {shortDev}
              </div>
              <h4 className="font-head font-extrabold text-lg text-white">
                {curtainReason}
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                Xogta Unlock+ waxay u furan tahay qalabkaaga keliya; lama duubi karo, lama dajisan karo, lamana la wadaagi karo dad kale.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurtainReason(null)}
              className="w-full h-11 rounded-xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-xs cursor-pointer transition-colors"
            >
              Sii Wad Akhriska Qeybta Unlock+
            </button>
          </div>
        </div>
      )}

      {/* Print / PDF Export Blocker Fallback */}
      <div className="pro-print-block hidden">
        <h2>HIRAAL Unlock+ | Daabacaadda iyo Kaydinta PDF waa Xiran Yihiin</h2>
        <p>
          Xogtan Unlock+ waxay si gaar ah ugu furan tahay ardayga furtay (ID: {shortDev}) lamana daabacan karo, lamana dajisan karo, lamana wadaagi karo amar la'aan.
        </p>
      </div>
    </>
  );
}
