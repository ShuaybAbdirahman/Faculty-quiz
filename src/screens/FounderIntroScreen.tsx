import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { founderPhotoDataUrl } from "../data/founderPhoto";
import { useApp } from "../context/AppContext";

const FOUNDER_MSG_KEY =
  "Asc! Waxaan ahay Shuayb. Arday badan oo dhammeysa dugsiga sare ayaa ku wareersan kulliyadda ay dooran lahaayeen, sidaas darteed waxaan dhisay Hagaha Kulliyadda. Waxay ku weydiinaysaa su’aalo gaagaaban oo ku saabsan waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah. Kadib waxay kuu soo bandhigaysaa saddexda kulliyadood ee kuugu habboon, boqolkiiba, sababta, waaxaha iyo shaqooyinka. Waa hage oo kaa caawinaya inaad si cad u fikirto, ma aha go’aan kama dambays ah, la tasho waalidkaaga iyo macallimiintaada. Guul!";

export function FounderIntroScreen({ onContinue }: { onContinue: () => void }) {
  const { tr, rtl, animationsOn, markFounderIntroSeen } = useApp();
  const fullText = tr(FOUNDER_MSG_KEY);
  const [shown, setShown] = useState(animationsOn ? 0 : fullText.length);

  useEffect(() => {
    if (!animationsOn) {
      setShown(fullText.length);
      return;
    }
    setShown(0);
    let intervalId: number | undefined;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setShown((prev) => {
          if (prev >= fullText.length) {
            if (intervalId) window.clearInterval(intervalId);
            return fullText.length;
          }
          return prev + 1;
        });
      }, 14);
    }, 900);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [fullText, animationsOn]);

  const done = shown >= fullText.length;

  const finishTyping = () => {
    if (!done) setShown(fullText.length);
  };

  const handleGo = () => {
    markFounderIntroSeen();
    onContinue();
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg, #061D42 0%, #165FB8 52%, #4189DD 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -top-28 -right-24 w-[340px] h-[340px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-28 w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(122,231,255,0.22), transparent 70%)" }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-3 pb-4 max-w-[520px] w-full mx-auto">
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={handleGo}
            className="px-3 py-1.5 text-[15px] font-semibold text-white/85 hover:text-white cursor-pointer"
          >
            {tr("Ka bood")}
          </button>
        </div>

        <p className="text-center text-[13.5px] font-bold tracking-[0.2em] uppercase text-[#FFD86B] animate-rise">
          {tr("Fariin ka timid aasaasaha")}
        </p>

        {/* Avatar with spinning rainbow/gold ring */}
        <div className="mt-3 relative w-[176px] h-[176px] flex items-center justify-center animate-rise">
          <div
            className="absolute w-[164px] h-[164px] rounded-full animate-gold-pulse"
            style={{ boxShadow: "0 0 42px rgba(255,201,60,0.35)" }}
          />
          <div
            className="absolute w-[164px] h-[164px] rounded-full animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, #FFFFFF, #7CB7FF, #4189DD, #FFC93C, #FFFFFF)",
            }}
          />
          <div className="relative w-[152px] h-[152px] rounded-full bg-[#061D42] flex items-center justify-center">
            <img
              src={founderPhotoDataUrl}
              alt="Eng. Shuayb Abdirahman"
              className="w-[142px] h-[142px] rounded-full object-cover"
            />
          </div>
          <div
            className="absolute right-2 bottom-2.5 w-[38px] h-[38px] rounded-full flex items-center justify-center border-[3px] border-[#061D42]"
            style={{ background: "linear-gradient(135deg, #FFD86B 0%, #FFC93C 100%)" }}
          >
            <GraduationCap className="w-5 h-5 text-[#061D42]" />
          </div>
        </div>

        <h1 className="mt-3 font-head font-extrabold text-[26px] leading-tight text-center animate-rise">
          {tr("Eng. Shuayb Abdirahman")}
        </h1>
        <p className="mt-1 text-[14px] font-semibold text-[#FFD86B] text-center animate-rise">
          Aasaasaha CAAWIYE
        </p>

        {/* Glass message card */}
        <div
          onClick={finishTyping}
          className="mt-4 w-full rounded-[26px] p-[18px] bg-white/10 border border-white/25 shadow-2xl cursor-pointer animate-rise"
          style={{ animationDelay: "250ms" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[22px]" role="img" aria-label="wave">
              👋
            </span>
            <h2 className="font-head font-extrabold text-[20px] text-[#FFD86B]">
              {tr("Soo dhawoow!")}
            </h2>
          </div>

          <p className="mt-3 text-[15.5px] leading-relaxed text-white/95 min-h-[120px]">
            {fullText.slice(0, shown)}
            {!done && (
              <span className="inline-block w-[3px] h-[18px] bg-[#FFC93C] align-middle mx-0.5 animate-pulse" />
            )}
          </p>

          {done && (
            <p className="mt-3 text-[14px] font-extrabold tracking-widest uppercase text-[#FFD86B]">
              {tr("Eng. Shuayb Abdirahman")}
            </p>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="relative z-10 max-w-[520px] w-full mx-auto px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={handleGo}
          className="w-full h-[58px] rounded-[20px] bg-[#FFC93C] hover:bg-[#FFD35E] text-[#0B1533] font-head font-extrabold text-[19px] flex items-center justify-center gap-2.5 cursor-pointer transition-transform active:scale-[0.98]"
          style={{ boxShadow: "0 10px 28px rgba(255,201,60,0.45)" }}
        >
          <span>{tr("Bilow su’aalaha")}</span>
          {rtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
