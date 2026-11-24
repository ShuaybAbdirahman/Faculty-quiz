import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Share2, X } from "lucide-react";
import { qrDisplayUrl, qrRows, qrUrl } from "../data/qrData";
import { useApp } from "../context/AppContext";

function drawSomaliStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the official 1080x1440 HIRAAL promotional poster in Somalia Flag Blue
 * with School (June 2027), Gap (Oct 2027), University (RIASEC), and real scannable QR code.
 */
export function renderCaawiyePromoPoster(canvas: HTMLCanvasElement): void {
  const w = 1080;
  const h = 1440;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Somalia Flag Blue Executive Background Gradient
  const bg = ctx.createLinearGradient(0, 0, w * 0.2, h);
  bg.addColorStop(0, "#071E44");
  bg.addColorStop(0.45, "#0F4085");
  bg.addColorStop(0.8, "#165FB8");
  bg.addColorStop(1, "#061A3B");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle top-right Somali Sky Blue radial glow
  const glow1 = ctx.createRadialGradient(w * 0.85, h * 0.1, 10, w * 0.85, h * 0.1, 540);
  glow1.addColorStop(0, "rgba(124, 183, 255, 0.34)");
  glow1.addColorStop(1, "rgba(65, 137, 221, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  // Subtle emerald lower accent glow
  const glow2 = ctx.createRadialGradient(w * 0.15, h * 0.72, 10, w * 0.15, h * 0.72, 460);
  glow2.addColorStop(0, "rgba(16, 185, 129, 0.16)");
  glow2.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);

  // Micro dot pattern
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let gx = 48; gx < w - 36; gx += 42) {
    for (let gy = 48; gy < h - 36; gy += 42) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer sleek frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(24, 24, w - 48, h - 48, 38);
  ctx.stroke();

  // 2. Top Brand Header: Somali Star Badge + HIRAAL Wordmark
  const badgeX = 76;
  const badgeY = 72;
  const badgeSize = 86;
  const starBg = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeSize, badgeY + badgeSize);
  starBg.addColorStop(0, "#5CA2F2");
  starBg.addColorStop(1, "#165FB8");
  ctx.fillStyle = starBg;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  drawSomaliStar(ctx, badgeX + badgeSize / 2, badgeY + badgeSize / 2 - 4, 24, 10);

  // Golden horizon arc in poster emblem
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(badgeX + badgeSize / 2, badgeY + badgeSize + 2, 34, Math.PI * 1.18, Math.PI * 1.82);
  ctx.stroke();

  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 54px "Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
  ctx.fillText("HIRAAL", badgeX + badgeSize + 24, badgeY + 4);

  ctx.fillStyle = "#BFDBFE";
  ctx.font = '700 22px "DM Sans", system-ui, sans-serif';
  ctx.fillText("SCHOOL  ·  GAP  ·  UNIVERSITY", badgeX + badgeSize + 24, badgeY + 62);

  // Right Flag Pill Tag
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.beginPath();
  ctx.roundRect(w - 280, badgeY + 18, 204, 48, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#FFE484";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '800 19px "DM Sans", system-ui, sans-serif';
  ctx.fillText("HAL MADAL · 2027", w - 178, badgeY + 42);
  ctx.textBaseline = "top";

  // 3. Main Hero Headline
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 62px "Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
  ctx.fillText("Safarkaaga Waxbarasho", 76, 206);

  ctx.fillStyle = "#FFC93C";
  ctx.font = '800 58px "Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
  ctx.fillText("Hal Meel Ku Diyaari", 76, 276);

  ctx.fillStyle = "rgba(235, 245, 255, 0.88)";
  ctx.font = '500 24px "DM Sans", system-ui, sans-serif';
  ctx.fillText("Imtixaanka Qaranka, Tartanka Jaamacadaha & Doorashada Kulliyadda", 76, 354);

  // 4. Three Distinct Colored Stage Cards
  const cards = [
    {
      num: "01",
      tag: "QEYBTA 1AAD · SCHOOL",
      title: "Dugsiga Sare · Form 4 (12 Maado)",
      sub: "Imtixaanka Qaranka (June 2027) · Saynis, Luqado & Tech",
      topStat: "PDFs: Free",
      botStat: "Predict: $0.25",
      c1: "#4189DD",
      c2: "#165FB8",
      numBg: "#FFFFFF",
      numFg: "#0A2B5E",
      border: "rgba(255, 255, 255, 0.35)",
    },
    {
      num: "02",
      tag: "QEYBTA 2AAD · GAP",
      title: "School ilaa University (Gap)",
      sub: "Tartanka JUS (Oct 2027) · 90 Maalmood & Xalka",
      topStat: "PDFs: Free",
      botStat: "Predict: $0.50",
      c1: "#059669",
      c2: "#047857",
      numBg: "#FFFFFF",
      numFg: "#064E3B",
      border: "rgba(167, 243, 208, 0.42)",
    },
    {
      num: "03",
      tag: "QEYBTA 3AAD · UNIVERSITY",
      title: "Hagaha Kulliyadda & Unlock+ Hub",
      sub: "RIASEC · 14 Kulliyadood · Waaxaha & Jaamacadaha",
      topStat: "RIASEC: Free",
      botStat: "Unlock+ Hub: $0.50",
      c1: "#4338CA",
      c2: "#312E81",
      numBg: "#FFC93C",
      numFg: "#051428",
      border: "rgba(255, 201, 60, 0.55)",
    },
  ];

  let cy = 418;
  const cw = w - 152;
  const ch = 176;
  const gap = 22;

  for (const card of cards) {
    const cg = ctx.createLinearGradient(76, cy, 76 + cw, cy + ch);
    cg.addColorStop(0, card.c1);
    cg.addColorStop(1, card.c2);

    ctx.save();
    ctx.shadowColor = "rgba(3, 12, 32, 0.36)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.roundRect(76, cy, cw, ch, 28);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = card.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(76, cy, cw, ch, 28);
    ctx.stroke();

    // Left number tile
    ctx.fillStyle = card.numBg;
    ctx.beginPath();
    ctx.roundRect(104, cy + 52, 72, 72, 20);
    ctx.fill();

    ctx.fillStyle = card.numFg;
    ctx.textAlign = "center";
    ctx.font = '800 30px "Bricolage Grotesque", system-ui, sans-serif';
    ctx.fillText(card.num, 140, cy + 72);

    // Center title & info
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = '800 18px "DM Sans", system-ui, sans-serif';
    ctx.fillText(card.tag, 200, cy + 32);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '800 30px "Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
    ctx.fillText(card.title, 200, cy + 64);

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = '500 19px "DM Sans", system-ui, sans-serif';
    ctx.fillText(card.sub, 200, cy + 112);

    // Right price / free summary
    ctx.textAlign = "right";
    ctx.fillStyle = "#A7F3D0";
    ctx.font = '800 20px "DM Sans", system-ui, sans-serif';
    ctx.fillText(card.topStat, 76 + cw - 28, cy + 58);

    ctx.fillStyle = "#FFE484";
    ctx.font = '800 22px "DM Sans", system-ui, sans-serif';
    ctx.fillText(card.botStat, 76 + cw - 28, cy + 96);

    cy += ch + gap;
  }

  // 5. Highlight Metrics Strip (hairline divider style)
  const statY = 1020;
  ctx.fillStyle = "rgba(5, 20, 46, 0.55)";
  ctx.beginPath();
  ctx.roundRect(76, statY, cw, 114, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const metrics = [
    { val: "12 Maado", lbl: "Form 4 Exam" },
    { val: "2027", lbl: "June & Oct" },
    { val: "14", lbl: "Kulliyadood" },
    { val: "Af-Soomaali", lbl: "100% Diyaar" },
  ];
  const colW = cw / 4;
  metrics.forEach((m, i) => {
    const cx = 76 + colW * i + colW / 2;
    if (i > 0) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
      ctx.beginPath();
      ctx.moveTo(76 + colW * i, statY + 22);
      ctx.lineTo(76 + colW * i, statY + 92);
      ctx.stroke();
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFC93C";
    ctx.font = '800 28px "Bricolage Grotesque", system-ui, sans-serif';
    ctx.fillText(m.val, cx, statY + 26);

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = '600 18px "DM Sans", system-ui, sans-serif';
    ctx.fillText(m.lbl, cx, statY + 66);
  });

  // 6. Bottom CTA Strip + Real Scannable QR Code
  const qrBarY = 1166;
  const qrBarH = 212;
  ctx.fillStyle = "#041126";
  ctx.beginPath();
  ctx.roundRect(76, qrBarY, cw, qrBarH, 30);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 201, 60, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left pill
  ctx.fillStyle = "#FFC93C";
  ctx.beginPath();
  ctx.roundRect(108, qrBarY + 28, 290, 34, 17);
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#051428";
  ctx.font = '800 16px "DM Sans", system-ui, sans-serif';
  ctx.fillText("ISKAAN GAREE OO BILOW", 253, qrBarY + 45);
  ctx.textBaseline = "top";

  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 34px "Bricolage Grotesque", system-ui, sans-serif';
  ctx.fillText("Ku Bilow Taleefankaaga Hadda", 108, qrBarY + 78);

  ctx.fillStyle = "#7CB7FF";
  ctx.font = '700 22px "DM Sans", system-ui, sans-serif';
  ctx.fillText(qrDisplayUrl, 108, qrBarY + 128);

  ctx.fillStyle = "rgba(255, 255, 255, 0.58)";
  ctx.font = '600 17px "DM Sans", system-ui, sans-serif';
  ctx.fillText("HIRAAL · ShuaybAbdirahman · 1 Qalab = 1 Arday", 108, qrBarY + 164);

  // Right Crisp White QR Box with Real Matrix
  const boxSize = 172;
  const boxX = 76 + cw - boxSize - 22;
  const boxY = qrBarY + 20;

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, 18);
  ctx.fill();

  const n = qrRows.length;
  const pad = 14;
  const inner = boxSize - pad * 2;
  const cell = inner / n;

  ctx.fillStyle = "#061D42";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qrRows[r][c] === "1") {
        ctx.fillRect(
          boxX + pad + c * cell,
          boxY + pad + r * cell,
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }
}

export function PromoPosterThumb({ className = "w-full h-auto block" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderCaawiyePromoPoster(canvasRef.current);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="HIRAAL Promo Poster"
      className={className}
    />
  );
}

export function PromoPosterModal({ onClose }: { onClose: () => void }) {
  const { darkMode, tr, showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCaawiyePromoPoster(canvas);
    setReady(true);
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!ready || !canvas) return;
    const href = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = href;
    a.download = "HIRAAL-Sawirka-Xayeysiinta.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(tr("Sawirka waa la soo dejiyay!"));
  };

  const handleShare = async () => {
    try {
      const canvas = canvasRef.current;
      if (ready && canvas && navigator.share) {
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob((b) => res(b), "image/png")
        );
        if (blob) {
          const file = new File([blob], "HIRAAL-Sawirka-Xayeysiinta.png", {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "HIRAAL · School, Gap & University",
              text: `Barnaamijka HIRAAL (School Form 4, Gap & University): ${qrUrl}`,
              files: [file],
            });
            return;
          }
        }
      }
      if (navigator.share) {
        await navigator.share({
          title: "HIRAAL · School, Gap & University",
          text: "Barnaamijka HIRAAL ee ardayda Soomaaliyeed!",
          url: qrUrl,
        });
        return;
      }
      handleDownload();
    } catch {
      // User cancelled share dialog
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      showToast(tr("Waa la koobiyeeyay"));
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border animate-rise my-auto ${
          darkMode
            ? "bg-[#071D42] border-[#4189DD]/35 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="px-5 py-4 border-b border-current/10 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-head font-extrabold text-[17px]">
              {tr("Sawirka Xayeysiinta (QR Dhab ah)")} · HIRAAL
            </h3>
            <p className="text-xs opacity-70">{qrDisplayUrl}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl hover:bg-current/10 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex flex-col items-center gap-4">
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-xl border border-[#4189DD]/35 bg-[#061D42]">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="h-12 rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{tr("Soo degso Sawirka")}</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="h-12 rounded-2xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{tr("Wadaag")}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl border border-current/15 hover:bg-current/5 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? tr("La koobiyeeyay") : qrUrl}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
