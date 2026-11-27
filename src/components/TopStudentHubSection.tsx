import React, { useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Lock,
  LockOpen,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  examHallRules,
  HIRAAL_INTEGRITY_CHARTER,
  legalSubjectSecrets,
  top10StudyTricks,
  type LegalSubjectSecret,
} from "../data/topStudentData";

function IntegrityBanner() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 border border-emerald-400/40 bg-emerald-500/12 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/45 text-emerald-300 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </span>
      <div className="space-y-0.5 min-w-0">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
          {HIRAAL_INTEGRITY_CHARTER.badge}
        </div>
        <h3 className="font-head font-extrabold text-sm sm:text-base text-white leading-snug">
          {HIRAAL_INTEGRITY_CHARTER.headline}
        </h3>
      </div>
    </div>
  );
}

function LockedUnlockBanner({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="mt-4 rounded-2xl p-4 border border-[#FFC93C]/40 bg-[#FFC93C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-xs text-[#FFE599] font-semibold">
        <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
        <span>School Unlock+ · Rukun $0.25+</span>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="shrink-0 px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <LockOpen className="w-3.5 h-3.5" />
        <span>Fur School ($0.25+)</span>
      </button>
    </div>
  );
}

export function Top10TricksSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr } = useApp();
  const [doneIds, setDoneIds] = useState<Record<string, boolean>>({});

  const togglePracticed = (id: string) => {
    setDoneIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="space-y-5 min-w-0">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
          <Trophy className="w-4 h-4" />
          <span>{tr("Xeeladaha Ardayda Top-10 (100% Xalaal)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Sida Ardayda Kaalmaha Sare Galaan U Diyaar-garoobaan")}
        </h2>
      </div>

      <IntegrityBanner />

      <div className="grid md:grid-cols-2 gap-4">
        {top10StudyTricks.map((trick) => {
          const practiced = Boolean(doneIds[trick.id]);
          return (
            <article
              key={trick.id}
              className="rounded-3xl p-5 border border-white/15 bg-[#091233]/85 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD86B]">
                      {trick.tag}
                    </div>
                    <h3 className="mt-0.5 font-head font-extrabold text-lg text-white leading-snug">
                      {trick.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePracticed(trick.id)}
                    aria-label="Calaamadee inaad ku dhaqantay"
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1 cursor-pointer shrink-0 transition-colors ${
                      practiced
                        ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200"
                        : "bg-white/6 border-white/15 text-white/70 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{practiced ? "Diyaar" : "Ku dhaqan"}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-[13.5px] text-white/80 leading-relaxed">
                  {trick.whyItWorks}
                </p>

                <div className="space-y-2 pt-1">
                  {trick.steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-white/90 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#4189DD]/25 border border-[#4189DD]/45 text-[#93C5FD] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl px-3.5 py-2.5 bg-rose-500/12 border border-rose-400/30 text-xs text-rose-200 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                <span>
                  <strong>Iska ilaali:</strong> {trick.avoid}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Exam Hall & Night-Before Protocol */}
      <div className="rounded-3xl p-5 sm:p-6 border border-[#7CB7FF]/35 bg-white/[0.05] space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#93C5FD]">
          <Clock className="w-4 h-4" />
          <span>Xeerka Habeenka & Hoolka Imtixaanka</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {examHallRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-2xl p-4 bg-[#071636]/90 border border-white/12 space-y-1.5"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                {rule.phase}
              </div>
              <h4 className="font-head font-bold text-sm text-white leading-snug">
                {rule.title}
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">{rule.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {!isPro && <LockedUnlockBanner onUnlock={onUnlock} />}
    </section>
  );
}

export function ExamHallRulesSection() {
  return (
    <section className="space-y-5 min-w-0">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
          <Clock className="w-4 h-4" />
          <span>Xeerka Habeenka & Hoolka Imtixaanka</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          Anshaxa & Maamulka Waqtiga Hoolka
        </h2>
      </div>

      <IntegrityBanner />

      <div className="grid sm:grid-cols-2 gap-3.5">
        {examHallRules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-2xl p-4 sm:p-5 bg-[#091233]/90 border border-white/15 space-y-2"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
              {rule.phase}
            </div>
            <h3 className="font-head font-bold text-base text-white leading-snug">
              {rule.title}
            </h3>
            <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">{rule.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LegalSubjectSecretsSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr } = useApp();
  const [group, setGroup] = useState<"all" | LegalSubjectSecret["group"]>("all");
  const [selectedId, setSelectedId] = useState<string>(legalSubjectSecrets[0].id);

  const visible =
    group === "all"
      ? legalSubjectSecrets
      : legalSubjectSecrets.filter((s) => s.group === group);

  const active =
    visible.find((s) => s.id === selectedId) ?? visible[0] ?? legalSubjectSecrets[0];

  return (
    <section className="space-y-5 min-w-0">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
          <BookOpenCheck className="w-4 h-4" />
          <span>{tr("Sirta Xalaasha ah ee Maaddooyinka (Form 4 & Gelitaan)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Meelaha Dhibcaha Laga Helo Maaddo Kasta (12 Maado)")}
        </h2>
      </div>

      <IntegrityBanner />

      {/* Group Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: "all" as const, label: "Dhammaan (12)" },
          { id: "science" as const, label: "Saynis (4)" },
          { id: "language" as const, label: "Luqado (3)" },
          { id: "social" as const, label: "Bulsho (2)" },
          { id: "applied" as const, label: "Ganacsi, Tech & Tarbiyo (3)" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setGroup(f.id);
              const firstMatch =
                f.id === "all"
                  ? legalSubjectSecrets[0]
                  : legalSubjectSecrets.find((x) => x.group === f.id);
              if (firstMatch) setSelectedId(firstMatch.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              group === f.id
                ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                : "bg-white/8 text-white/85 border-white/15 hover:bg-white/15"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Subject Picker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {visible.map((sub) => {
          const isSelected = sub.id === active.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedId(sub.id)}
              className={`p-3 rounded-2xl border text-start cursor-pointer transition-all flex items-center gap-2.5 ${
                isSelected
                  ? "bg-white text-[#071D42] border-white shadow-md"
                  : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]"
              }`}
            >
              <span
                className="w-9 h-9 rounded-xl font-head font-black text-[11px] flex items-center justify-center shrink-0 text-white"
                style={{ backgroundColor: sub.accent }}
              >
                {sub.code}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-extrabold leading-tight truncate">{sub.name}</div>
                <div
                  className={`text-[10.5px] font-semibold mt-0.5 ${
                    isSelected ? "text-slate-600" : "text-white/60"
                  }`}
                >
                  {sub.groupLabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Subject Deep Blueprint Card */}
      <article className="rounded-3xl p-5 sm:p-7 border border-white/18 bg-[#091233]/90 space-y-5 shadow-xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-2xl font-head font-black text-xs flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: active.accent }}
            >
              {active.code}
            </span>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                {active.groupLabel} · Xeeladda Xalaasha ah
              </div>
              <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">
                {active.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Examiner Focus */}
        <div className="rounded-2xl p-4 bg-[#4189DD]/14 border border-[#4189DD]/35 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#93C5FD]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Waxa Saxaha Imtixaanku Eego (Marking Focus)</span>
          </div>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {active.examinerFocus}
          </p>
        </div>

        {/* 3 Legal Secrets */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
            3-da Xeeladood ee Maaddadan Dhibcaha Ku Keena
          </div>
          {active.legalSecrets.map((sec, idx) => (
            <div
              key={idx}
              className="rounded-xl p-3 bg-white/[0.04] border border-white/10 flex items-start gap-2.5 text-xs sm:text-[13.5px] text-white/90 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{sec}</span>
            </div>
          ))}
        </div>

        {/* High-Yield Topics + Common Trap */}
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div className="rounded-2xl p-4 bg-white/[0.04] border border-white/12 space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              Mowduucyada Muhiimka ah ee Imtixaanka
            </div>
            <ul className="space-y-1.5 text-xs text-white/85">
              {active.highYieldTopics.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-[#FFD86B] font-bold">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-400/35 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FFD86B]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Khaladka Ugu Badan ee Dhibcaha Lumiya</span>
            </div>
            <p className="text-xs sm:text-[13px] text-amber-100 leading-relaxed">
              {active.commonTrap}
            </p>
          </div>
        </div>
      </article>

      {!isPro && <LockedUnlockBanner onUnlock={onUnlock} />}
    </section>
  );
}
