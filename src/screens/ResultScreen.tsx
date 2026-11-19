import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Briefcase,
  CheckSquare,
  Compass,
  Copy,
  GitBranch,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Moon,
  RotateCcw,
  Sun,
} from "lucide-react";
import type { Faculty } from "../data/quizData";
import { useApp } from "../context/AppContext";
import { backendEnabled } from "../lib/config";
import { argbToHex, darkenHex, hexToRgba, plainFacultyName } from "../lib/i18n";
import { minNeeded, type FacultyMatch } from "../lib/scoring";
import {
  ConfettiBurst,
  CountUp,
  FacultyBanner,
  FacultyIcon,
  Footer,
  ProgressRing,
} from "../components/ModernUI";
import { ShareSection } from "../components/ShareCard";
import { SaveResultCard } from "../components/SaveResultCard";
import { ReviewCard } from "../components/ReviewsComponents";
import { ProEntryCard } from "./ProGuideScreen";

function Heading({ icon, label }: { icon: React.ReactNode; label: string }) {
  const { tr } = useApp();
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[26px] h-[26px] rounded-[8px] bg-[#4A6CF7]/15 text-[#5D7BFF] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="font-head font-bold text-sm">{tr(label)}</span>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const { tr } = useApp();
  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      <span className="w-16 opacity-75 shrink-0">{tr(label)}</span>
      <div
        className="flex-1 h-[9px] rounded-full overflow-hidden"
        style={{ background: hexToRgba(color, 0.15) }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: `linear-gradient(90deg, ${hexToRgba(color, 0.65)}, ${color})`,
          }}
        />
      </div>
      <span className="w-10 text-end font-bold">{value}%</span>
    </div>
  );
}

function Celebration({ top, onDone }: { top: FacultyMatch; onDone: () => void }) {
  const { tr, tx, rtl, userName, animationsOn } = useApp();
  const hex = argbToHex(top.f.color);
  const darkColor = darkenHex(hex, 0.3);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-7 text-white"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${darkColor} 0%, #070B18 80%)`,
      }}
    >
      {animationsOn && <ConfettiBurst accent={hex} />}

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <div className="relative w-[190px] h-[190px] flex items-center justify-center">
          {animationsOn && (
            <>
              <div className="absolute w-[170px] h-[170px] rounded-full border-2 border-white/70 animate-ripple" />
              <div
                className="absolute w-[170px] h-[170px] rounded-full border-2 border-white/70 animate-ripple"
                style={{ animationDelay: "1.2s" }}
              />
            </>
          )}
          <ProgressRing
            percent={top.percent}
            color="#FFD86B"
            track="rgba(255,255,255,0.24)"
            size={170}
            stroke={7}
          >
            <div
              className="w-[124px] h-[124px] rounded-full flex items-center justify-center border-[1.5px] border-white/45"
              style={{
                background: "rgba(255,255,255,0.14)",
                boxShadow: "0 0 40px 2px rgba(255,255,255,0.3)",
              }}
            >
              <FacultyIcon faculty={top.f} size={66} />
            </div>
          </ProgressRing>
        </div>

        <h1 className="mt-5 font-head font-extrabold text-[44px] leading-tight animate-rise">
          {tr("Hambalyo!")}
        </h1>

        {userName && (
          <p className="mt-0.5 font-head font-extrabold text-[38px] leading-tight text-[#FFD86B] animate-rise">
            {userName}
          </p>
        )}

        <p className="mt-2 text-[15px] text-white/75 animate-rise">
          {tr("Kulliyadda kugu habboon waa")}
        </p>

        <h2 className="mt-1.5 font-head font-bold text-[22px] leading-snug animate-rise">
          {tx(top.f.name)}
        </h2>

        <div className="mt-3 flex flex-col items-center animate-rise">
          <CountUp
            value={top.percent}
            ms={1900}
            className="font-head font-extrabold text-[42px] text-[#FFD86B] leading-none"
          />
          <span className="mt-1 text-[13px] text-white/75">{tr("ku habboonaan")}</span>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="mt-7 min-w-[230px] h-[52px] px-6 rounded-[16px] bg-white text-[#14213D] font-bold text-[15px] inline-flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 cursor-pointer transition-transform active:scale-[0.98]"
        >
          <span>{tr("Eeg faahfaahinta")}</span>
          {rtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function ResultCard({ rank, m }: { rank: number; m: FacultyMatch }) {
  const { lang, tr, tx, txl, darkMode } = useApp();
  const f = m.f;
  const hex = argbToHex(f.color);

  return (
    <article
      className={`mt-4 rounded-[22px] overflow-hidden border ${
        darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200"
      }`}
      style={{
        boxShadow:
          rank === 1
            ? `0 10px 28px ${hexToRgba(hex, 0.25)}`
            : `0 4px 12px ${hexToRgba(hex, 0.12)}`,
      }}
    >
      <FacultyBanner
        faculty={f}
        height={rank === 1 ? 200 : 146}
        badge={rank === 1 ? tr("Kugu habboon") : `#${rank}`}
        float
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-head font-extrabold text-[17px] leading-snug">{tx(f.name)}</h3>
            {lang !== "en" && <p className="text-xs opacity-65 mt-0.5">{f.en}</p>}
          </div>
          <ProgressRing percent={m.percent} color={hex} size={68} stroke={6}>
            <CountUp
              value={m.percent}
              ms={1200 + rank * 200}
              className="font-head font-extrabold text-[16px]"
              style={{ color: hex }}
            />
          </ProgressRing>
        </div>

        <div className="mt-2.5">
          <MetricBar label="Xiisaha" value={m.interest} color={hex} />
          <MetricBar label="Kartida" value={m.aptitude} color={hex} />
          <MetricBar label="Qiimaha" value={m.conditions} color={hex} />
        </div>

        <p className="mt-3 text-sm leading-relaxed opacity-90">{tx(f.desc)}</p>

        {m.reasons.length > 0 && (
          <div className="mt-3.5">
            <Heading icon={<CheckSquare className="w-4 h-4" />} label="Sababta natiijada" />
            <p className="mt-1 text-xs opacity-65">{tr("Jawaabaha ugu saameeyay:")}</p>
            <ul className="mt-1 space-y-1 text-sm opacity-90">
              {m.reasons.map((r, idx) => (
                <li key={idx} className="leading-snug">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3.5">
          <Heading icon={<GitBranch className="w-4 h-4" />} label="Waaxaha" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {f.depts.map((d) => (
              <span
                key={d}
                className="px-2.5 py-1 rounded-lg text-[12.5px] font-medium"
                style={{ background: hexToRgba(hex, 0.14) }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3.5">
          <Heading icon={<Briefcase className="w-4 h-4" />} label="Shaqooyinka laga helo" />
          <p className="mt-1 text-sm opacity-90">{txl(f.jobs).join(" · ")}</p>
        </div>

        <div className="mt-3.5">
          <Heading icon={<Lightbulb className="w-4 h-4" />} label="Talooyin" />
          <ul className="mt-1.5 space-y-1.5 text-sm opacity-90">
            {txl(f.tips).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-snug">
                <span className="font-extrabold" style={{ color: hex }}>
                  •
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function ResultScreen({
  matches,
  answered,
  planLen,
  profile,
  onCompare,
  onRestart,
  onOpenPro,
}: {
  matches: FacultyMatch[];
  answered: number;
  planLen: number;
  profile: string[];
  onCompare: () => void;
  onRestart: () => void;
  onOpenPro: (faculty: Faculty) => void;
}) {
  const { tr, trf, tx, darkMode, setDarkMode, userName, showToast } = useApp();
  const confident = answered >= minNeeded(planLen);
  const [celebrate, setCelebrate] = useState(confident);

  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(false), 9000);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  if (celebrate && matches.length > 0) {
    return <Celebration top={matches[0]} onDone={() => setCelebrate(false)} />;
  }

  const top = matches.slice(0, 3);
  const unclear = top.length === 3 && top[0].percent - top[2].percent < 6;

  const nextSteps = [
    "La hadal arday hadda ku jira kulliyaddan, ama macallinkaaga.",
    "La xiriir xafiiska diiwaangelinta si aad u hesho shuruudaha gelitaanka, khidmadda iyo waqtiyada diiwaangelinta.",
    "Isbarbar dhig labada kulliyadood ee ugu sarreeya: waxbarashada, shaqada iyo kharashka.",
    "U hay hal usbuuc ugu yaraan ka hor intaadan go’aan gaarin, oo la tasho qoyskaaga.",
  ];

  const handleCopySummary = async () => {
    const lines = top.map((m, i) => `${i + 1}) ${tx(m.f.name)}: ${m.percent}%`).join("\n");
    const text = `${tr("Natiijadayda, Hagaha Kulliyadda:")}\n${lines}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast(tr("Waa la koobiyeeyay"));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen px-4 pt-3 pb-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{tr(darkMode ? "Iftiin" : "Mugdi")}</span>
        </button>
      </div>

      <div className="px-2 mt-1">
        <h1 className="font-head font-extrabold text-[28px] leading-tight">{tr("Natiijadaada")}</h1>
        <p className="mt-1 text-sm opacity-75">{tr("Saddexda kulliyadood ee kugu habboon")}</p>
      </div>

      {!confident && (
        <div
          className={`mt-3 rounded-[16px] p-3.5 text-sm leading-relaxed border ${
            darkMode
              ? "bg-red-950/60 border-red-400/30 text-red-100"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {trf(
            "Waxaad ka jawaabtay {a} / {b} su’aalood. Natiijadu waxay noqotaa mid kalsooni yar haddii su’aalo badan la boodo. Dib u bilow oo ka jawaab ugu yaraan {c} su’aalood.",
            { a: answered, b: planLen, c: minNeeded(planLen) }
          )}
        </div>
      )}

      {unclear && (
        <div
          className={`mt-3 rounded-[16px] p-3.5 border ${
            darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <Heading icon={<HelpCircle className="w-4 h-4" />} label="Doorbidkaagu ma cadda" />
          <p className="mt-1.5 text-sm opacity-85 leading-relaxed">
            {tr(
              "Saddexda kulliyadood waa isku dhow yihiin. Jawaabahaagu ma muujinayaan doorbid cad, sidaas awgeed isbarbar dhig dhammaan saddexda, oo la hadal qof ku aqaan."
            )}
          </p>
        </div>
      )}

      {/* Share Card Section */}
      {top.length > 0 && (
        <div className="mt-4">
          <ShareSection
            name={userName}
            entries={top.map((m) => ({
              faculty: m.f,
              name: plainFacultyName(tx(m.f.name)),
              percent: m.percent,
            }))}
          />
        </div>
      )}

      {/* Pro Entry Card */}
      {confident && top.length > 0 && (
        <div className="mt-4">
          <ProEntryCard
            entries={top.map((m) => ({ f: m.f, percent: m.percent }))}
            onOpenPro={onOpenPro}
          />
        </div>
      )}

      {/* Interest Profile Card */}
      <div
        className={`mt-4 rounded-[16px] p-3.5 border ${
          darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <Heading icon={<Compass className="w-4 h-4" />} label="Astaanta xiisahaaga" />
        <p className="mt-1.5 text-sm opacity-90">
          {profile.length === 0 ? "—" : profile.join(" · ")}
        </p>
      </div>

      {/* Top 3 Faculty Cards */}
      {top.map((m, i) => (
        <ResultCard key={m.f.id} rank={i + 1} m={m} />
      ))}

      {/* Anonymous Save + Review */}
      {backendEnabled && confident && top.length > 0 && (
        <div className="mt-4 space-y-3">
          <SaveResultCard ids={top.map((m) => m.f.id)} pcts={top.map((m) => m.percent)} />
          <ReviewCard facultyId={top[0].f.id} />
        </div>
      )}

      {/* Next Steps */}
      <div
        className={`mt-4 rounded-[20px] p-4 border ${
          darkMode ? "bg-[#151D33] border-white/10" : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <Heading icon={<ListChecks className="w-4 h-4" />} label="Tallaabooyinka xiga" />
        <ol className="mt-2.5 space-y-2.5">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-snug">
              <span
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  darkMode ? "bg-[#24346B] text-[#C8D8FF]" : "bg-[#DCE4F7] text-[#1F3A93]"
                }`}
              >
                {i + 1}
              </span>
              <span className="opacity-90">{tr(step)}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={onCompare}
          className="w-full h-[52px] rounded-[16px] bg-[#3B5BDB] hover:bg-[#324EC2] text-white font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span>{tr("Isbarbardhig kulliyadaha")}</span>
        </button>

        <button
          type="button"
          onClick={handleCopySummary}
          className={`w-full h-[52px] rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            darkMode
              ? "bg-[#222C47] text-[#C8D4FF] hover:bg-[#2B3759]"
              : "bg-[#DCE4F7] text-[#1A2D6B] hover:bg-[#CFD9F4]"
          }`}
        >
          <Copy className="w-5 h-5" />
          <span>{tr("Nuqul ka samee natiijada")}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className={`w-full h-[52px] rounded-[16px] border font-bold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            darkMode
              ? "border-white/20 text-white hover:bg-white/5"
              : "border-slate-300 text-slate-800 hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>{tr("Dib u bilow")}</span>
        </button>
      </div>

      <p className="mt-4 px-3 text-xs opacity-65 leading-relaxed">
        {tr(
          "Qiimeyntani waxay ku salaysan tahay qaab Holland RIASEC oo la fududeeyay. Ma aha imtixaan rasmi ah. U isticmaal hage, ma aha go’aan kama dambeys ah."
        )}
      </p>

      <Footer />
    </div>
  );
}
