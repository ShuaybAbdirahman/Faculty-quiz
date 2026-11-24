import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Compass, MoonStar } from "lucide-react";
import { useApp } from "../context/AppContext";
import { buildHeroTickerSlides, type TickerAccent } from "../lib/heroTicker";

const ACCENT_STYLES: Record<
  TickerAccent,
  { border: string; bg: string; badge: string; bar: string; glow: string }
> = {
  emerald: {
    border: "border-emerald-300/45",
    bg: "from-[#063A3B]/90 via-[#0B2D5C]/92 to-[#071F45]/95",
    badge: "bg-emerald-400/20 text-emerald-100 border-emerald-300/40",
    bar: "bg-emerald-400",
    glow: "rgba(16, 185, 129, 0.22)",
  },
  gold: {
    border: "border-[#FFC93C]/45",
    bg: "from-[#1A294B]/90 via-[#0C2F66]/92 to-[#071F45]/95",
    badge: "bg-[#FFC93C]/22 text-[#FFE484] border-[#FFC93C]/45",
    bar: "bg-[#FFC93C]",
    glow: "rgba(255, 201, 60, 0.20)",
  },
  sky: {
    border: "border-[#7CB7FF]/45",
    bg: "from-[#0E448A]/90 via-[#0B3066]/92 to-[#071F45]/95",
    badge: "bg-[#4189DD]/30 text-[#DBEAFE] border-[#7CB7FF]/45",
    bar: "bg-[#60A5FA]",
    glow: "rgba(65, 137, 221, 0.28)",
  },
  violet: {
    border: "border-indigo-300/45",
    bg: "from-[#1E2E7A]/90 via-[#0E316A]/92 to-[#071F45]/95",
    badge: "bg-indigo-400/25 text-indigo-100 border-indigo-300/45",
    bar: "bg-indigo-400",
    glow: "rgba(99, 102, 241, 0.22)",
  },
  rose: {
    border: "border-sky-300/45",
    bg: "from-[#123D78]/90 via-[#0B2C5D]/92 to-[#071F45]/95",
    badge: "bg-sky-400/25 text-sky-100 border-sky-300/40",
    bar: "bg-sky-300",
    glow: "rgba(56, 189, 248, 0.22)",
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-head font-extrabold uppercase tracking-wider text-[#FFE484] shrink-0">
              {current.arabicLine ? (
                <MoonStar className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Compass className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{tx(current.tag)}</span>
            </span>
            <span className="text-white/30" aria-hidden="true">·</span>
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
