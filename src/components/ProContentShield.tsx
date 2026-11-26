import React, { useEffect, useMemo, useRef, useState } from "react";
import { EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  buildProWatermarkTileDataUri,
  isBlockedProShortcut,
  isTamperedOverlayStyle,
  PRO_IDLE_LOCK_MS,
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
  const { userName, showToast } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const outboundClickAtRef = useRef<number>(0);
  const [curtainReason, setCurtainReason] = useState<string | null>(null);
  const [watermarkRev, setWatermarkRev] = useState<number>(0);

  // Subtle personal watermark without noisy Device IDs or clock timestamps
  const cleanStamp = useMemo(() => {
    const cleanName = (userName ?? "").replace(/\s+/g, " ").trim().slice(0, 22);
    return cleanName ? `HIRAAL PRO · ${cleanName}` : "HIRAAL PRO · Ardaygaaga";
  }, [userName]);

  const watermarkTileUri = useMemo(
    () => buildProWatermarkTileDataUri(cleanStamp),
    [cleanStamp]
  );

  useEffect(() => {
    if (!active) {
      setCurtainReason(null);
      document.body.classList.remove("pro-body-locked");
      return;
    }

    document.body.classList.add("pro-body-locked");

    const triggerBlockToast = (action: string) => {
      if (action === "screenshot") {
        showToast("Screenshot lama ogola qeybta Pro. Akoonkaaga keliya ayay u furan tahay.");
      } else if (action === "print" || action === "save") {
        showToast("Dajinta ama daabacaadda (PDF/Save) waa ka xiran tahay qeybta Pro.");
      } else if (action === "devtools") {
        showToast("Furista DevTools waa ka xiran tahay qeybta Pro.");
      } else {
        showToast("Nuqul-qaadista xogta Pro waa xiran tahay.");
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
              ? "Isku-day furista baaritaanka koodhka waa la xiray."
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
        setCurtainReason("Shaashadda Pro waa la qariyay intii aad ka baxday si xogtaada loo ilaaliyo.");
      }
    };

    const handlePageHide = () => {
      setCurtainReason("Shaashadda Pro waa la xiray si xogtaada loo ilaaliyo.");
    };

    const handleBeforePrint = () => {
      setCurtainReason("Daabacaadda iyo kaydinta PDF waa ka xiran yihiin qeybta Pro.");
      triggerBlockToast("print");
    };

    const handleGlobalBlockedEvent = (e: Event) => {
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      if (e.type !== "selectstart" && e.type !== "dragstart") {
        showToast("Qeybta Pro lama koobiyeeyo, lama dajisto, lamana wadaago.");
      }
    };

    let idleTimer: number | null = null;
    const resetIdleTimer = (e?: Event) => {
      if (e && e.target instanceof Element && e.target.closest('a[target="_blank"]')) {
        outboundClickAtRef.current = Date.now();
      }
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        setCurtainReason("Shaashadda Pro waa la xiray muddo aan la taaban si loo ilaaliyo xogtaada.");
      }, PRO_IDLE_LOCK_MS);
    };
    resetIdleTimer();

    const checkWatermarkIntegrity = () => {
      const wm = watermarkRef.current;
      if (!wm || !document.body.contains(wm)) {
        setCurtainReason("Isku-day ka-saarid ilaalinta amniga ah ayaa la joojiyay.");
        setWatermarkRev((r) => r + 1);
        return;
      }
      const computed = window.getComputedStyle(wm);
      if (
        isTamperedOverlayStyle({
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
        }) ||
        !computed.backgroundImage ||
        computed.backgroundImage === "none"
      ) {
        setCurtainReason("Isku-day wax-ka-beddel ilaalinta amniga ah ayaa la joojiyay.");
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
        className="pro-shield-active relative"
        data-pro-shield="active"
      >
        <div className="relative">
          {/* Subtle Anti-Leak Watermark Overlay: opacity-100 avoids false tamper triggers while SVG uses 6% fill */}
          <div
            key={watermarkRev}
            ref={watermarkRef}
            aria-hidden="true"
            data-testid="pro-watermark-layer"
            className="pointer-events-none select-none fixed inset-0 z-20 opacity-100"
            style={{
              backgroundImage: `url("${watermarkTileUri}")`,
              backgroundRepeat: "repeat",
            }}
          />

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

      {curtainReason && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ilaalinta Xogta HIRAAL Pro"
          data-testid="pro-privacy-curtain"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-5 text-center overflow-y-auto"
        >
          <div className="w-full max-w-md rounded-2xl p-6 border border-amber-400/35 bg-slate-900 space-y-4 shadow-2xl text-white">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <EyeOff className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-amber-300">
                {sectionLabel}
              </div>
              <h4 className="font-head font-bold text-lg text-white">
                {curtainReason}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Xogta HIRAAL Pro waxay u furan tahay akoonkaaga keliya; lama duubi karo, lama dajisan karo, lamana wadaagi karo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurtainReason(null)}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs cursor-pointer transition-colors"
            >
              Sii Wad Akhriska
            </button>
          </div>
        </div>
      )}

      <div className="pro-print-block hidden">
        <h2>HIRAAL Pro | Daabacaadda iyo Kaydinta PDF waa Xiran Yihiin</h2>
        <p>Xogtan waxay si gaar ah ugu furan tahay ardayga furtay lamana daabacan karo.</p>
      </div>
    </>
  );
}
