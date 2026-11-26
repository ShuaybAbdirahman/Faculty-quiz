import React, { useState } from "react";
import { Download, GraduationCap, Share2 } from "lucide-react";
import type { Faculty } from "../data/quizData";
import { qrDisplayUrl, qrRows, qrUrl } from "../data/qrData";
import { useApp } from "../context/AppContext";
import { argbToHex, hexToRgba, plainFacultyName } from "../lib/i18n";
import { FacultyIcon, ShinyButton } from "./ModernUI";

export interface ShareEntry {
  faculty: Faculty;
  name: string;
  percent: number;
}

function QrSvg({ size = 60 }: { size?: number }) {
  const n = qrRows.length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#FFFFFF" />
      {qrRows.map((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0B1533" /> : null
        )
      )}
    </svg>
  );
}

export type ShareFormat = "post" | "story";

async function renderShareCardPng(
  entries: ShareEntry[],
  userName: string,
  tr: (k: string) => string,
  trf: (k: string, a: Record<string, string | number>) => string,
  rtl: boolean,
  format: ShareFormat = "story"
): Promise<Blob | null> {
  const isStory = format === "story";
  const W = 1080;
  const H = isStory ? 1920 : 1440;
  const S = 3; // 360x480 or 360x640 * 3
  const yOff = isStory ? 34 * S : 0;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const top = entries[0];
  const others = entries.slice(1, 3);
  const topHex = argbToHex(top.faculty.color);
  const title = userName ? trf("Natiijada {n}", { n: userName }) : tr("Natiijadayda");
  const headFont = rtl ? "Cairo, sans-serif" : "Outfit, sans-serif";
  const bodyFont = rtl ? "Cairo, sans-serif" : '"Plus Jakarta Sans", sans-serif';

  // Background gradient (Somalia Flag Blue)
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#061D42");
  bg.addColorStop(0.52, "#165FB8");
  bg.addColorStop(1, "#4189DD");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Radial glows
  const drawGlow = (cx: number, cy: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  };
  drawGlow(60 * S, 40 * S, 150 * S, "rgba(124,183,255,0.34)");
  drawGlow(340 * S, 210 * S, 150 * S, "rgba(16,185,129,0.22)");
  drawGlow(160 * S, (isStory ? 600 : 470) * S, 150 * S, "rgba(255,201,60,0.24)");

  // Subtle dots
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  for (let y = 12 * S; y < H; y += 24 * S) {
    for (let x = 12 * S; x < W; x += 24 * S) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2 * S, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const drawRoundRect = (x: number, y: number, w: number, h: number, rad: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
  };

  // Brand header
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `800 ${11 * S}px ${bodyFont}`;
  ctx.textAlign = rtl ? "right" : "left";
  ctx.fillText(
    "HIRAAL · " + tr("Hagaha Kulliyadda").toUpperCase(),
    rtl ? (360 - 22) * S : 22 * S,
    36 * S
  );

  // 2027 pill badge on opposite side
  const pillW = 68 * S;
  const pillH = 20 * S;
  const pillX = rtl ? 22 * S : (360 - 22) * S - pillW;
  drawRoundRect(pillX, 22 * S, pillW, pillH, 10 * S);
  ctx.fillStyle = "rgba(255, 201, 60, 0.22)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 201, 60, 0.55)";
  ctx.lineWidth = 1 * S;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFE484";
  ctx.font = `800 ${9 * S}px ${bodyFont}`;
  ctx.fillText("2027", pillX + pillW / 2, 35 * S);

  // Title
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = `600 ${14 * S}px ${bodyFont}`;
  ctx.fillText(title, W / 2, 66 * S + yOff);

  // Ring
  const cx = W / 2;
  const cy = 140 * S + yOff;
  const rr = 54.5 * S;
  ctx.lineWidth = 9 * S;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.arc(cx, cy, rr, 0, Math.PI * 2);
  ctx.stroke();

  const arcGrad = ctx.createLinearGradient(cx - rr, cy - rr, cx + rr, cy + rr);
  arcGrad.addColorStop(0, "#FFE28F");
  arcGrad.addColorStop(0.5, "#FFC93C");
  arcGrad.addColorStop(1, "#FF9F5B");
  ctx.strokeStyle = arcGrad;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, top.percent / 100));
  ctx.stroke();

  // Percent inside ring
  ctx.fillStyle = "#FFD86B";
  ctx.font = `800 ${34 * S}px ${headFont}`;
  ctx.fillText(`${top.percent}%`, cx, cy + 8 * S);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = `600 ${10.5 * S}px ${bodyFont}`;
  ctx.fillText(tr("Ku habboonaan"), cx, cy + 25 * S);

  // Top faculty name
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 ${(top.name.length > 36 ? 17 : 20) * S}px ${headFont}`;
  ctx.fillText(top.name.slice(0, 44), cx, 230 * S + yOff);

  ctx.fillStyle = "#FFD86B";
  ctx.font = `700 ${11.5 * S}px ${bodyFont}`;
  ctx.fillText(tr("Kulliyadda kugu habboon"), cx, 252 * S + yOff);

  // Other rows
  others.forEach((entry, idx) => {
    const y = (268 + idx * 46) * S + yOff;
    drawRoundRect(22 * S, y, 316 * S, 39 * S, 14 * S);
    ctx.fillStyle = "rgba(255,255,255,0.13)";
    ctx.fill();
    ctx.lineWidth = 1 * S;
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.stroke();

    const rowHex = argbToHex(entry.faculty.color);
    ctx.beginPath();
    ctx.arc(43 * S, y + 19.5 * S, 11 * S, 0, Math.PI * 2);
    ctx.fillStyle = rowHex;
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = `800 ${11 * S}px ${bodyFont}`;
    ctx.fillText(String(idx + 2), 43 * S, y + 23.5 * S);

    ctx.textAlign = "left";
    ctx.font = `600 ${12.5 * S}px ${bodyFont}`;
    ctx.fillText(entry.name.slice(0, 28), 64 * S, y + 24 * S);

    ctx.textAlign = "right";
    ctx.fillStyle = "#FFD86B";
    ctx.font = `800 ${13 * S}px ${headFont}`;
    ctx.fillText(`${entry.percent}%`, 326 * S, y + 24 * S);
  });

  if (isStory) {
    // 2027 HIRAAL Platform Highlight Bar (TikTok & Status 9:16)
    const platY = 404 * S;
    drawRoundRect(22 * S, platY, 316 * S, 46 * S, 14 * S);
    ctx.fillStyle = "rgba(4, 17, 38, 0.56)";
    ctx.fill();
    ctx.lineWidth = 1 * S;
    ctx.strokeStyle = "rgba(124, 183, 255, 0.38)";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#BFDBFE";
    ctx.font = `800 ${9.5 * S}px ${bodyFont}`;
    ctx.fillText("HIRAAL 2027 · FORM 4 · DIYAARINTA JUS · UNIVERSITY", W / 2, platY + 18 * S);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `600 ${9.5 * S}px ${bodyFont}`;
    ctx.fillText("12 Maado Form 4 · 5 Maado JUS · 14 Kulliyadood · $0.50 | $1.20 Total", W / 2, platY + 34 * S);

    // Viral Story Prompt Box
    const py = 462 * S;
    drawRoundRect(22 * S, py, 316 * S, 56 * S, 16 * S);
    ctx.fillStyle = "rgba(255,201,60,0.16)";
    ctx.fill();
    ctx.lineWidth = 1.5 * S;
    ctx.strokeStyle = "rgba(255,201,60,0.48)";
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFD86B";
    ctx.font = `800 ${13 * S}px ${headFont}`;
    ctx.fillText(tr("Adigu kulliyaddee kugu habboon?"), W / 2, py + 23 * S);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `600 ${10.5 * S}px ${bodyFont}`;
    ctx.fillText(tr("Scan garee QR-ka oo tijaabi 8 daqiiqo (Bilaash)"), W / 2, py + 41 * S);
  }

  // Footer CTA + QR
  const baseH = isStory ? 640 : 480;
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 ${12 * S}px ${bodyFont}`;
  ctx.fillText(tr("Qaado imtixaanka Hagaha Kulliyadda").slice(0, 36), 22 * S, (baseH - 58) * S);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `600 ${9.5 * S}px ${bodyFont}`;
  ctx.fillText(qrDisplayUrl, 22 * S, (baseH - 38) * S);

  // QR white box
  const qSize = (isStory ? 84 : 70) * S;
  const qx = (360 - 22 - (isStory ? 84 : 70)) * S;
  const qy = (baseH - 18 - (isStory ? 84 : 70)) * S;
  drawRoundRect(qx, qy, qSize, qSize, 12 * S);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  const pad = 5 * S;
  const n = qrRows.length;
  const cell = (qSize - pad * 2) / n;
  ctx.fillStyle = "#061D42";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qrRows[r][c] === "1") {
        ctx.fillRect(qx + pad + c * cell, qy + pad + r * cell, cell + 0.5, cell + 0.5);
      }
    }
  }

  // Small colored circle badge accent near ring
  ctx.beginPath();
  ctx.arc(cx + 50 * S, cy - 42 * S, 20 * S, 0, Math.PI * 2);
  ctx.fillStyle = topHex;
  ctx.fill();
  ctx.lineWidth = 2 * S;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.stroke();

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
}

export function ShareSection({
  entries,
  name,
}: {
  entries: ShareEntry[];
  name: string;
}) {
  const { tr, trf, rtl, darkMode, showToast } = useApp();
  const [busy, setBusy] = useState(false);
  const [format, setFormat] = useState<ShareFormat>("story");

  const top = entries[0];
  const others = entries.slice(1, 3);
  const title = name ? trf("Natiijada {n}", { n: name }) : tr("Natiijadayda");
  const topHex = argbToHex(top.faculty.color);

  const fileName =
    format === "story" ? "hiraal-tiktok-status-9x16.png" : "hiraal-natiijo-3x4.png";

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(tr("Sawirka waa la soo dejiyay"));
  };

  const handleAction = async (share: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderShareCardPng(entries, name, tr, trf, rtl, format);
      if (!blob) {
        showToast(tr("Lama wadaagi karin. Mar kale isku day."));
        return;
      }
      if (!share) {
        downloadBlob(blob);
        return;
      }
      const text = trf("Natiijadayda ee Hagaha Kulliyadda: {f} ({p}%). Tijaabi adigu: {url}", {
        f: top.name,
        p: top.percent,
        url: qrUrl,
      });
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `HIRAAL · ${tr("Hagaha Kulliyadda")}`,
          text,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `HIRAAL · ${tr("Hagaha Kulliyadda")}`,
          text,
          url: qrUrl,
        });
      } else {
        downloadBlob(blob);
      }
    } catch {
      // User cancelled or share failed; fallback quietly
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Format Switcher: Status / TikTok 9:16 vs Post 3:4 */}
      <div className="mb-3 inline-flex rounded-xl p-1 border border-slate-300/60 dark:border-white/15 bg-black/5 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setFormat("story")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            format === "story"
              ? "bg-[#165FB8] text-white shadow-sm"
              : "opacity-75 hover:opacity-100"
          }`}
        >
          {tr("TikTok / WhatsApp Status (9:16)")}
        </button>
        <button
          type="button"
          onClick={() => setFormat("post")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
            format === "post"
              ? "bg-[#165FB8] text-white shadow-sm"
              : "opacity-75 hover:opacity-100"
          }`}
        >
          {tr("Kaar Caadi ah (3:4)")}
        </button>
      </div>

      {/* Share Card Preview (Somalia Flag Blue matching PNG export) */}
      <div
        className={`relative w-full max-w-[360px] ${
          format === "story" ? "aspect-[9/16]" : "aspect-[3/4]"
        } rounded-[26px] overflow-hidden text-white select-none transition-all duration-200`}
        style={{
          background: "linear-gradient(135deg, #061D42 0%, #165FB8 52%, #4189DD 100%)",
          boxShadow: "0 14px 28px rgba(22, 95, 184, 0.38)",
        }}
      >
        {/* Glows */}
        <div
          className="pointer-events-none absolute -top-24 -left-20 w-[260px] h-[260px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,183,255,0.34), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute top-14 -right-28 w-[260px] h-[260px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-4 w-[240px] h-[240px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,201,60,0.24), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col px-5 pt-4 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-[30px] h-[30px] rounded-[10px] bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                <GraduationCap className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-white/95 truncate">
                HIRAAL · {tr("Hagaha Kulliyadda")}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FFC93C]/22 border border-[#FFC93C]/55 text-[#FFE484] text-[9px] font-extrabold shrink-0">
              2027
            </span>
          </div>

          <p className="mt-2.5 text-center text-[14px] font-semibold text-white/90 truncate">{title}</p>

          {/* Ring & Top Icon */}
          <div className="mt-2 mx-auto relative w-[124px] h-[118px] flex items-center justify-center">
            <svg width="118" height="118" className="-rotate-90">
              <defs>
                <linearGradient id="shareCardGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE28F" />
                  <stop offset="50%" stopColor="#FFC93C" />
                  <stop offset="100%" stopColor="#FF9F5B" />
                </linearGradient>
              </defs>
              <circle cx="59" cy="59" r="54.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="9" />
              <circle
                cx="59"
                cy="59"
                r="54.5"
                fill="none"
                stroke="url(#shareCardGoldRing)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54.5}
                strokeDashoffset={2 * Math.PI * 54.5 * (1 - top.percent / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-head font-extrabold text-[32px] leading-none text-[#FFD86B]">
                {top.percent}%
              </span>
              <span className="mt-0.5 text-[10.5px] font-semibold text-white/85">
                {tr("Ku habboonaan")}
              </span>
            </div>
            <div
              className="absolute -top-1 -end-2 w-11 h-11 rounded-full flex items-center justify-center border-[1.5px] border-white/60"
              style={{
                background: `linear-gradient(135deg, ${topHex} 0%, ${hexToRgba(topHex, 0.65)} 100%)`,
              }}
            >
              <FacultyIcon faculty={top.faculty} size={24} />
            </div>
          </div>

          <h3
            className={`mt-2 text-center font-head font-extrabold leading-tight line-clamp-2 ${
              top.name.length > 36 ? "text-[17px]" : "text-[20px]"
            }`}
          >
            {top.name}
          </h3>
          <p className="mt-1 text-center text-[11.5px] font-bold tracking-wide text-[#FFD86B]">
            {tr("Kulliyadda kugu habboon")}
          </p>

          {/* 2nd and 3rd */}
          <div className="mt-2.5 space-y-1.5">
            {others.map((e, i) => {
              const hex = argbToHex(e.faculty.color);
              return (
                <div
                  key={e.faculty.id}
                  className="h-10 px-2.5 rounded-[14px] flex items-center gap-2.5 border border-white/25"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 100%)",
                  }}
                >
                  <span
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{ background: hex }}
                  >
                    {i + 2}
                  </span>
                  <span className="flex-1 text-[12.5px] font-semibold truncate">{e.name}</span>
                  <span className="font-head font-extrabold text-[13px] text-[#FFD86B]">
                    {e.percent}%
                  </span>
                </div>
              );
            })}
          </div>

          {format === "story" && (
            <>
              <div className="mt-3 rounded-xl px-3 py-2 bg-[#041126]/55 border border-[#7CB7FF]/35 text-center">
                <p className="text-[9.5px] font-extrabold tracking-wide text-[#BFDBFE] uppercase">
                  HIRAAL 2027 · FORM 4 · DIYAARINTA JUS · UNIVERSITY
                </p>
                <p className="text-[9.5px] font-semibold text-white/85 mt-0.5">
                  12 Maado Form 4 · 5 Maado JUS · 14 Kulliyadood · Rukun
                </p>
              </div>

              <div className="mt-2.5 rounded-2xl px-3.5 py-2.5 bg-[#FFC93C]/16 border border-[#FFC93C]/48 text-center">
                <p className="font-head font-extrabold text-[13px] text-[#FFD86B]">
                  {tr("Adigu kulliyaddee kugu habboon?")}
                </p>
                <p className="text-[10.5px] font-semibold text-white/92 mt-0.5">
                  {tr("Scan garee QR-ka oo tijaabi 8 daqiiqo (Bilaash)")}
                </p>
              </div>
            </>
          )}

          {/* Bottom QR Row */}
          <div className="mt-auto pt-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold leading-snug line-clamp-2">
                {tr("Qaado imtixaanka Hagaha Kulliyadda")}
              </p>
              <p className="mt-1 text-[9.5px] font-semibold text-white/80 truncate">{qrDisplayUrl}</p>
            </div>
            <div className="w-[70px] h-[70px] p-1.5 rounded-[12px] bg-white shrink-0 flex items-center justify-center">
              <QrSvg size={58} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-3.5 space-y-2.5">
        <ShinyButton
          label="Wadaag natiijada"
          icon={<Share2 className="w-5 h-5 text-[#0B1533]" />}
          showArrow={false}
          disabled={busy}
          onClick={() => handleAction(true)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => handleAction(false)}
          className={`w-full h-[50px] rounded-[16px] flex items-center justify-center gap-2 font-semibold text-[15px] cursor-pointer transition-colors disabled:opacity-50 ${
            darkMode
              ? "bg-[#222C47] text-[#C8D4FF] hover:bg-[#2B3759]"
              : "bg-[#DCE4F7] text-[#1A2D6B] hover:bg-[#CFD9F4]"
          }`}
        >
          <Download className="w-5 h-5" />
          <span>{tr("Soo deji sawirka")}</span>
        </button>
      </div>
    </div>
  );
}

export { plainFacultyName };
