import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Share2, X } from "lucide-react";
import promoPosterUrl from "../assets/images/hagaha_kulliyadda_promo_1795079553879.jpg";
import { qrDisplayUrl, qrRows, qrUrl } from "../data/qrData";
import { useApp } from "../context/AppContext";

/**
 * Composites the studio promotional poster with the REAL scannable QR code
 * for https://shuaybabdirahman.github.io/Faculty-quiz/ over the bottom-right QR box.
 */
async function renderPosterWithRealQr(canvas: HTMLCanvasElement): Promise<void> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = promoPosterUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load promo poster"));
  });

  const w = img.naturalWidth || 960;
  const h = img.naturalHeight || 1280;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0, w, h);

  // Locate the white QR square box in the bottom-right of the 3:4 poster
  const boxSize = Math.round(w * 0.168);
  const boxX = Math.round(w * 0.768);
  const boxY = Math.round(h * 0.858);
  const radius = Math.round(boxSize * 0.08);

  // Clean crisp white rounded background covering the illustrative QR
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  // Draw the real scannable QR code matrix centered inside the white box
  const n = qrRows.length;
  const pad = Math.round(boxSize * 0.085);
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

export function PromoPosterModal({ onClose }: { onClose: () => void }) {
  const { darkMode, tr, showToast } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPosterWithRealQr(canvas)
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setReady(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const href = ready && canvas ? canvas.toDataURL("image/png") : promoPosterUrl;
    const a = document.createElement("a");
    a.href = href;
    a.download = "Hagaha-Kulliyadda-Xayeysiin.png";
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
          const file = new File([blob], "Hagaha-Kulliyadda-Xayeysiin.png", {
            type: "image/png",
          });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Hagaha Kulliyadda",
              text: `Hel kulliyadda kugu habboon 8 daqiiqo gudahood: ${qrUrl}`,
              files: [file],
            });
            return;
          }
        }
      }
      if (navigator.share) {
        await navigator.share({
          title: "Hagaha Kulliyadda",
          text: "Hel kulliyadda kugu habboon 8 daqiiqo gudahood!",
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
            ? "bg-[#0D152C] border-white/15 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className="px-5 py-4 border-b border-current/10 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-head font-extrabold text-[17px]">
              {tr("Sawirka Xayeysiinta (QR Dhab ah)")}
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
          <div className="w-full max-w-[360px] rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-[#061D42]">
            <canvas
              ref={canvasRef}
              className={`w-full h-auto block ${ready ? "" : "hidden"}`}
            />
            {!ready && (
              <img
                src={promoPosterUrl}
                alt="Hagaha Kulliyadda Promotional Poster"
                referrerPolicy="no-referrer"
                className="w-full h-auto block"
              />
            )}
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
              className="h-12 rounded-2xl bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-head font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
            <span>{copied ? tr("La koobiyay") : qrUrl}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
