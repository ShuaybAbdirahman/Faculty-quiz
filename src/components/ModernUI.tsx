import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { appOwner, type Faculty } from "../data/quizData";
import { useApp } from "../context/AppContext";
import { argbToHex, darkenHex } from "../lib/i18n";

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-aurora-1 absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.32) 0%, rgba(34,211,238,0) 70%)",
        }}
      />
      <div
        className="animate-aurora-2 absolute top-6 -right-28 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,106,162,0.29) 0%, rgba(255,106,162,0) 70%)",
        }}
      />
      <div
        className="animate-aurora-3 absolute -bottom-24 left-1/4 w-[340px] h-[340px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,201,60,0.20) 0%, rgba(255,201,60,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 1.3px, transparent 1.3px)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}

export function ShinyButton({
  label,
  onClick,
  icon,
  showArrow = true,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
}) {
  const { tr, rtl } = useApp();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="relative w-full h-[62px] rounded-[20px] overflow-hidden flex items-center justify-center gap-2.5 cursor-pointer transition-transform active:scale-[0.97] disabled:opacity-60 animate-gold-pulse"
      style={{
        background: "linear-gradient(135deg, #FFE28F 0%, #FFC93C 50%, #FFA927 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[-30px] left-0 w-[70px] h-[140px] animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 text-[#0B1533] font-head font-extrabold text-[19px]">
        {icon ?? <Play className="w-6 h-6 fill-[#0B1533] text-[#0B1533]" />}
        <span>{tr(label)}</span>
        {showArrow && (
          <span className="animate-arrow-nudge inline-flex">
            {rtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </span>
        )}
      </span>
    </button>
  );
}

export function AccentTitle({ label }: { label: string }) {
  const { tr } = useApp();
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-1 h-5 rounded-full shrink-0"
        style={{ background: "linear-gradient(180deg, #FFD86B 0%, #FF9F5B 100%)" }}
      />
      <h2 className="font-head font-bold text-[17px] leading-snug">{tr(label)}</h2>
    </div>
  );
}

export function AccentTitleLight({ label }: { label: string }) {
  const { tr } = useApp();
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-1 h-5 rounded-full shrink-0"
        style={{ background: "linear-gradient(180deg, #FFD86B 0%, #FF9F5B 100%)" }}
      />
      <h2 className="font-head font-bold text-[16px] text-white leading-snug">{tr(label)}</h2>
    </div>
  );
}

export function FacultyIcon({ faculty, size = 28 }: { faculty: Faculty; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className="shrink-0"
    >
      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: faculty.icon }}
      />
    </svg>
  );
}

export function FacultyBanner({
  faculty,
  height,
  badge,
  label = false,
  float = false,
  floatDelay = 0,
}: {
  faculty: Faculty;
  height: number;
  badge?: string;
  label?: boolean;
  float?: boolean;
  floatDelay?: number;
}) {
  const hex = argbToHex(faculty.color);
  const dark = darkenHex(hex, 0.5);
  const circleSize = Math.round(height * 0.52);

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        height,
        background: `linear-gradient(135deg, ${hex} 0%, ${dark} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: height * 1.2,
          height: height * 1.2,
          right: -height * 0.3,
          top: -height * 0.45,
          border: "14px solid rgba(255,255,255,0.10)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: height * 1.0,
          height: height * 1.0,
          left: -height * 0.25,
          bottom: -height * 0.6,
          border: "14px solid rgba(255,255,255,0.10)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex items-center justify-center rounded-full ${float ? "animate-float" : ""}`}
          style={{
            width: circleSize,
            height: circleSize,
            background: "rgba(255,255,255,0.14)",
            border: "1.4px solid rgba(255,255,255,0.40)",
            boxShadow: "0 0 24px 2px rgba(255,255,255,0.25)",
            animationDelay: float ? `${floatDelay}ms` : undefined,
          }}
        >
          <FacultyIcon faculty={faculty} size={Math.round(circleSize * 0.55)} />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.54) 100%)",
        }}
      />
      {badge && (
        <div className="absolute left-3 top-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white font-bold text-[13px]">
          {badge}
        </div>
      )}
      {label && (
        <div className="absolute left-3 bottom-2.5 text-white font-bold text-[14px] drop-shadow">
          {faculty.short}
        </div>
      )}
    </div>
  );
}

export function CountUp({
  value,
  ms = 1400,
  className = "",
  style,
}: {
  value: number;
  ms?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { animationsOn } = useApp();
  const [display, setDisplay] = useState(animationsOn ? 0 : value);

  useEffect(() => {
    if (!animationsOn) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms, animationsOn]);

  return (
    <span className={className} style={style}>
      {display}%
    </span>
  );
}

export function ProgressRing({
  percent,
  color,
  size = 68,
  stroke = 6,
  track = "rgba(148,163,184,0.28)",
  gradientId,
  children,
}: {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
  track?: string;
  gradientId?: string;
  children?: React.ReactNode;
}) {
  const { animationsOn } = useApp();
  const [val, setVal] = useState(animationsOn ? 0 : percent);

  useEffect(() => {
    if (!animationsOn) {
      setVal(percent);
      return;
    }
    const t = requestAnimationFrame(() => setVal(percent));
    return () => cancelAnimationFrame(t);
  }, [percent, animationsOn]);

  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, val)) / 100);

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {gradientId && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE28F" />
              <stop offset="50%" stopColor="#FFC93C" />
              <stop offset="100%" stopColor="#FF9F5B" />
            </linearGradient>
          </defs>
        )}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={gradientId ? `url(#${gradientId})` : color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: animationsOn ? "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" : "none" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = value >= i - 0.25;
        const half = !full && value >= i - 0.75;
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={
              full
                ? "text-[#FFB703] fill-[#FFB703]"
                : half
                  ? "text-[#FFB703] fill-[#FFB703]/50"
                  : "text-[#FFB703]/45"
            }
          />
        );
      })}
    </div>
  );
}

export function ProBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-head font-black tracking-wider text-[#050A1E] ${
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11.5px]"
      }`}
      style={{
        background: "linear-gradient(90deg, #FFE28F 0%, #FFC93C 50%, #FFA927 100%)",
        boxShadow: "0 0 12px rgba(255,201,60,0.4)",
      }}
    >
      <Sparkles className={small ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
      <span>PRO</span>
    </span>
  );
}

export function ConfettiBurst({ accent = "#7C5CFF" }: { accent?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();

    const colors = ["#FFD86B", "#FFFFFF", "#7C5CFF", "#4C6EF5", "#FF7A90", "#3DDC97", accent];
    const particles = Array.from({ length: 150 }, () => {
      const ang = -Math.PI * (0.08 + Math.random() * 0.84);
      const speed = 0.35 + Math.random() * 0.75;
      return {
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: 7 + Math.random() * 8,
        rot: Math.random() * 6,
        spin: (Math.random() - 0.5) * 14,
        delay: Math.random() * 0.35,
        shape: Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    let raf = 0;
    const start = performance.now();
    const totalMs = 4400;

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const ox = w / 2;
      const oy = h * 0.4;

      for (const p of particles) {
        const tau = t - p.delay;
        if (tau < 0 || tau > 3.8) continue;
        const x = ox + p.vx * w * tau * 0.9;
        const y = oy + p.vy * h * tau * 0.9 + 0.5 * 1.25 * h * tau * tau * 0.55;
        const alpha = Math.min(1, Math.max(0, 3.8 - tau));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.translate(x, y);
        ctx.rotate(p.rot + p.spin * tau);
        if (p.shape === 0) {
          ctx.fillRect(-p.size / 2, -(p.size * 0.55) / 2, p.size, p.size * 0.55);
        } else if (p.shape === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-(p.size * 0.32) / 2, -(p.size * 1.1) / 2, p.size * 0.32, p.size * 1.1);
        }
        ctx.restore();
      }
      if (now - start < totalMs) {
        raf = requestAnimationFrame(draw);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [accent]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" />;
}

export function Footer() {
  const { tr } = useApp();
  return (
    <footer className="py-5 px-6 text-center text-xs opacity-65">
      © 2026 {appOwner}. {tr("Xuquuqda oo dhan waa dhowran tahay.")}
    </footer>
  );
}
