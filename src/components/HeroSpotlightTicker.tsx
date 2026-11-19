import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoonStar, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { buildHeroTickerSlides, type TickerAccent } from "../lib/heroTicker";

const ACCENT_STYLES: Record<
  TickerAccent,
  { border: string; bg: string; badge: string; bar: string; glow: string }
> = {
  emerald: {
    border: "border-emerald-400/45",
    bg: "from-emerald-950/80 via-[#0C2135]/90 to-[#0B1533]/95",
    badge: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40",
    bar: "bg-emerald-400",
    glow: "rgba(52, 211, 153, 0.22)",
  },
  gold: {
    border: "border-[#FFC93C]/45",
    bg: "from-[#221A0A]/80 via-[#121A3D]/90 to-[#0B1533]/95",
    badge: "bg-[#FFC93C]/20 text-[#FFE28A] border-[#FFC93C]/40",
    bar: "bg-[#FFC93C]",
    glow: "rgba(255, 201, 60, 0.22)",
  },
  sky: {
    border: "border-sky-400/40",
    bg: "from-[#0B2242]/85 via-[#0E1B42]/90 to-[#0B1533]/95",
    badge: "bg-sky-400/20 text-sky-200 border-sky-400/40",
    bar: "bg-sky-400",
    glow: "rgba(56, 189, 248, 0.20)",
  },
  violet: {
    border: "border-violet-400/40",
    bg: "from-[#1E1242]/85 via-[#131842]/90 to-[#0B1533]/95",
    badge: "bg-violet-400/20 text-violet-200 border-violet-400/40",
    bar: "bg-violet-400",
    glow: "rgba(167, 139, 250, 0.22)",
  },
  rose: {
    border: "border-rose-400/40",
    bg: "from-[#2B1028]/80 via-[#15173E]/90 to-[#0B1533]/95",
    badge: "bg-rose-400/20 text-rose-200 border-rose-400/40",
    bar: "bg-rose-400",
    glow: "rgba(251, 113, 133, 0.20)",
  },
};

export function HeroSpotlightTicker() {
  const { tx, rtl } = useApp();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tickNow, setTickNow] = useState<Date>(() => new Date());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  // Only animate/rotate while the top hero ticker is actually visible in the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(Boolean(entry?.isIntersecting && window.scrollY < 180));
      },
      { threshold: 0.25 }
    );
    observer.observe(el);

    const onScroll = () => {
      setInView(window.scrollY < 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Re-evaluate clock once every minute so 18:00 Thursday and 07:00 Friday transitions happen automatically
  useEffect(() => {
    const clockTimer = window.setInterval(() => setTickNow(new Date()), 60_000);
    return () => window.clearInterval(clockTimer);
  }, []);

  const slides = useMemo(() => buildHeroTickerSlides(tickNow), [tickNow]);
  const safeIndex = index % slides.length;
  const current = slides[safeIndex];
  const style = ACCENT_STYLES[current.accent];

  useEffect(() => {
    if (paused || !inView) return;
    const duration = current.arabicLine ? 6200 : 3800;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, duration);
    return () => window.clearTimeout(t);
  }, [safeIndex, paused, inView, slides.length, current.arabicLine]);

  const goNext = () => setIndex((i) => (i + 1) % slides.length);
  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`mt-5 relative rounded-2xl border ${style.border} bg-gradient-to-r ${style.bg} overflow-hidden transition-colors duration-500`}
      style={{ boxShadow: `0 10px 26px ${style.glow}` }}
    >
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3">
        <div key={current.id} className="min-w-0 flex-1 animate-rise">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-head font-extrabold uppercase tracking-wider shrink-0 ${style.badge}`}
            >
              {current.arabicLine ? (
                <MoonStar className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{tx(current.tag)}</span>
            </span>

            <p className="font-head font-extrabold text-[14.5px] sm:text-[16px] text-white leading-snug">
              {tx(current.text)}
            </p>
          </div>

          {current.arabicLine && (
            <p
              dir="rtl"
              className="mt-1.5 text-[17px] sm:text-[19px] font-bold text-[#FFE28A] leading-relaxed"
              style={{ fontFamily: '"Amiri", "Cairo", serif' }}
            >
              {current.arabicLine}
            </p>
          )}
        </div>

        {/* Manual Next/Prev Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/16 border border-white/15 flex items-center justify-center text-white/85 cursor-pointer transition-colors"
          >
            {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/16 border border-white/15 flex items-center justify-center text-white/85 cursor-pointer transition-colors"
          >
            {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Subtle segmented progress bar at bottom */}
      <div className="h-[3px] w-full bg-white/10 flex">
        <div
          className={`h-full ${style.bar} transition-all duration-500`}
          style={{ width: `${((safeIndex + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
