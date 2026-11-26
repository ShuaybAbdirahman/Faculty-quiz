import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Share2, X } from "lucide-react";
import { qrDisplayUrl, qrRows, qrUrl } from "../data/qrData";
import { useApp } from "../context/AppContext";

export type PromoPosterFormat = "tiktok916" | "poster34";

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
 * Draws the official HIRAAL promotional poster in Somalia Flag Blue
 * in either Post (3:4, 1080x1440) or TikTok & WhatsApp Status (9:16, 1080x1920)
 * with School (June 2027), Diyaarinta Jaamacadda JUS (5 Maado, Oct 2027), University (RIASEC), and real scannable QR code.
 */
export function renderCaawiyePromoPoster(
  canvas: HTMLCanvasElement,
  format: PromoPosterFormat = "poster34"
): void {
  const isTikTok = format === "tiktok916";
  const w = 1080;
  const h = isTikTok ? 1920 : 1440;
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
  const glow1 = ctx.createRadialGradient(w * 0.85, h * 0.1, 10, w * 0.85, h * 0.1, 560);
  glow1.addColorStop(0, "rgba(124, 183, 255, 0.34)");
  glow1.addColorStop(1, "rgba(65, 137, 221, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  // Subtle emerald lower accent glow
  const glow2 = ctx.createRadialGradient(w * 0.15, h * 0.72, 10, w * 0.15, h * 0.72, 500);
  glow2.addColorStop(0, "rgba(16, 185, 129, 0.18)");
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
  const badgeY = isTikTok ? 96 : 72;
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
  ctx.font = '800 54px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("HIRAAL", badgeX + badgeSize + 24, badgeY + 4);

  ctx.fillStyle = "#BFDBFE";
  ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("SCHOOL  ·  DIYAARINTA JUS  ·  UNIVERSITY", badgeX + badgeSize + 24, badgeY + 62);

  // Right Flag Badge Tag
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
  ctx.font = '800 19px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("HAL MADAL · 2027", w - 178, badgeY + 42);
  ctx.textBaseline = "top";

  // 3. Main Hero Headline
  const heroY = isTikTok ? 250 : 206;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 62px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("Safarkaaga Waxbarasho", 76, heroY);

  ctx.fillStyle = "#FFC93C";
  ctx.font = '800 58px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("Hal Meel Ku Diyaari", 76, heroY + 70);

  ctx.fillStyle = "rgba(235, 245, 255, 0.9)";
  ctx.font = '500 23px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("Imtixaanka Qaranka, Tartanka JUS (5 Maado) & Doorashada Kulliyadda", 76, heroY + 148);

  // 4. Three Distinct Colored Stage Cards
  const cards = [
    {
      num: "01",
      tag: "QEYBTA 1AAD · SCHOOL FORM 4",
      title: "Dugsiga Sare · Form 4 (12 Maado)",
      sub: "June 2027 · Sirta Top-10 & Ranking",
      topStat: "PDFs: Free",
      botStat: "Rukun $0.25+ · Total -20%",
      c1: "#4189DD",
      c2: "#165FB8",
      numBg: "#FFFFFF",
      numFg: "#0A2B5E",
      border: "rgba(255, 255, 255, 0.35)",
    },
    {
      num: "02",
      tag: "QEYBTA 2AAD · DIYAARINTA JUS",
      title: "Tartanka Jaamacadda (JUS · 5 Maado)",
      sub: "4 Saynis + Ingiriisi (Oct 2027) · Ranking",
      topStat: "PDFs: Free",
      botStat: "Rukun $0.25+ · Total -20%",
      c1: "#059669",
      c2: "#047857",
      numBg: "#FFFFFF",
      numFg: "#064E3B",
      border: "rgba(167, 243, 208, 0.42)",
    },
    {
      num: "03",
      tag: "QEYBTA 3AAD · UNIVERSITY & UNLOCK+",
      title: "Hagaha Kulliyadda & Unlock+ Hub",
      sub: "RIASEC · 14 Kulliyadood · 6 Qaybood",
      topStat: "RIASEC: Free",
      botStat: "Rukun $0.25+ · Total -20%",
      c1: "#4338CA",
      c2: "#312E81",
      numBg: "#FFC93C",
      numFg: "#051428",
      border: "rgba(255, 201, 60, 0.55)",
    },
  ];

  let cy = isTikTok ? 490 : 418;
  const cw = w - 152;
  const ch = isTikTok ? 204 : 176;
  const gap = isTikTok ? 28 : 22;

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
    const numSize = isTikTok ? 78 : 72;
    ctx.fillStyle = card.numBg;
    ctx.beginPath();
    ctx.roundRect(104, cy + (ch - numSize) / 2, numSize, numSize, 20);
    ctx.fill();

    ctx.fillStyle = card.numFg;
    ctx.textAlign = "center";
    ctx.font = '800 30px "Outfit", system-ui, sans-serif';
    ctx.fillText(card.num, 104 + numSize / 2, cy + ch / 2 - 14);

    // Center title & info
    const textX = 204;
    const topOff = isTikTok ? 40 : 30;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(card.tag, textX, cy + topOff);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '800 28px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(card.title, textX, cy + topOff + 32);

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.font = '500 18.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(card.sub, textX, cy + topOff + 78);

    // Right price / free summary
    ctx.textAlign = "right";
    ctx.fillStyle = "#A7F3D0";
    ctx.font = '800 19px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(card.topStat, 76 + cw - 28, cy + (isTikTok ? 68 : 56));

    ctx.fillStyle = "#FFE484";
    ctx.font = '800 19px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(card.botStat, 76 + cw - 28, cy + (isTikTok ? 106 : 92));

    cy += ch + gap;
  }

  // 5. Highlight Metrics Strip (hairline divider style)
  const statY = isTikTok ? 1202 : 1020;
  ctx.fillStyle = "rgba(5, 20, 46, 0.58)";
  ctx.beginPath();
  ctx.roundRect(76, statY, cw, 114, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const metrics = [
    { val: "12 Maado", lbl: "Form 4 Exam" },
    { val: "5 Maado", lbl: "JUS (4 Saynis + EN)" },
    { val: "14", lbl: "Kulliyadood" },
    { val: "Af-Soomaali", lbl: "100% Bilaash" },
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
    ctx.font = '800 26px "Outfit", system-ui, sans-serif';
    ctx.fillText(m.val, cx, statY + 26);

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = '600 16.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(m.lbl, cx, statY + 66);
  });

  // Extra Ethical & Unlock+ Banner in 9:16 TikTok / Status layout
  if (isTikTok) {
    const trustY = 1350;
    const trustH = 176;
    ctx.fillStyle = "rgba(6, 78, 59, 0.42)";
    ctx.beginPath();
    ctx.roundRect(76, trustY, cw, trustH, 26);
    ctx.fill();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#6EE7B7";
    ctx.font = '800 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText("100% XALAAL AH OO SHARCI AH · QISH MA AHAN", w / 2, trustY + 28);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = '700 24px "Outfit", "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      "Su'aalaha Ugu Muhiimsan ee Imtixaannadii Hore (PDFs)",
      w / 2,
      trustY + 68
    );

    ctx.fillStyle = "#FFE484";
    ctx.font = '700 18.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      "Rukun: Asbuucle $0.25 · Bille $0.50 · Sanadle $1.50 (Total -20%)",
      w / 2,
      trustY + 114
    );
  }

  // 6. Bottom CTA Strip + Real Scannable QR Code
  const qrBarY = isTikTok ? 1568 : 1166;
  const qrBarH = isTikTok ? 248 : 212;
  ctx.fillStyle = "#041126";
  ctx.beginPath();
  ctx.roundRect(76, qrBarY, cw, qrBarH, 30);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 201, 60, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left badge
  const ctaY = isTikTok ? qrBarY + 38 : qrBarY + 28;
  ctx.fillStyle = "#FFC93C";
  ctx.beginPath();
  ctx.roundRect(108, ctaY, 310, 36, 18);
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#051428";
  ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("ISKAAN GAREE OO BILOW HADDA", 263, ctaY + 18);
  ctx.textBaseline = "top";

  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 34px "Outfit", system-ui, sans-serif';
  ctx.fillText("Ku Bilow Taleefankaaga Hadda", 108, ctaY + 52);

  ctx.fillStyle = "#7CB7FF";
  ctx.font = '700 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(qrDisplayUrl, 108, ctaY + 104);

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.font = '600 17px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText("HIRAAL · ShuaybAbdirahman · 1 Qalab = 1 Arday", 108, ctaY + 144);

  // Right Crisp White QR Box with Real Matrix
  const boxSize = isTikTok ? 196 : 172;
  const boxX = 76 + cw - boxSize - 24;
  const boxY = qrBarY + (qrBarH - boxSize) / 2;

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
      renderCaawiyePromoPoster(canvasRef.current, "poster34");
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
  const [format, setFormat] = useState<PromoPosterFormat>("tiktok916");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCaawiyePromoPoster(canvas, format);
    setReady(true);
  }, [format]);

  const fileName =
    format === "tiktok916"
      ? "HIRAAL-TikTok-Status-9x16.png"
      : "HIRAAL-Sawirka-Xayeysiinta-3x4.png";

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!ready || !canvas) return;
    const href = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = href;
    a.download = fileName;
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
          const file = new File([blob], fileName, {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "HIRAAL · School, Diyaarinta JUS & University",
              text: `Barnaamijka HIRAAL (School Form 4, Diyaarinta JUS & University): ${qrUrl}`,
              files: [file],
            });
            return;
          }
        }
      }
      if (navigator.share) {
        await navigator.share({
          title: "HIRAAL · School, Diyaarinta JUS & University",
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

        <div className="p-4 sm:p-5 flex flex-col items-center gap-3.5">
          {/* Format Switcher: TikTok / Status 9:16 vs Post 3:4 */}
          <div className="inline-flex rounded-xl p-1 border border-current/15 bg-black/10">
            <button
              type="button"
              onClick={() => setFormat("tiktok916")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                format === "tiktok916"
                  ? "bg-[#FFC93C] text-[#050A1C] shadow-sm"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              {tr("TikTok / WhatsApp Status (9:16)")}
            </button>
            <button
              type="button"
              onClick={() => setFormat("poster34")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                format === "poster34"
                  ? "bg-[#FFC93C] text-[#050A1C] shadow-sm"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              {tr("Post Caadi ah (3:4)")}
            </button>
          </div>

          <div
            className={`w-full ${
              format === "tiktok916" ? "max-w-[270px]" : "max-w-[350px]"
            } rounded-2xl overflow-hidden shadow-xl border border-[#4189DD]/35 bg-[#061D42] transition-all duration-200`}
          >
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
