import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ClipboardCheck,
  FileText,
  Lightbulb,
  Lock,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";
import { bridgeExamTracks, GAP_EXAM_DATE, type BridgeExamTrack } from "../data/bridgingPrepData";
import { useApp } from "../context/AppContext";
import { AuroraBackground, SomaliStarIcon } from "../components/ModernUI";
import { ProContentShield } from "../components/ProContentShield";
import { ReadinessTracker, SomaliaChallengesHub } from "../components/ProHubContent";
import { PredictExamGateCard, PredictExamRunner } from "../components/PredictExamRunner";

export function BridgingPrepScreen({
  initialSection = "exams",
  onBackHome,
  onUnlockBridge,
}: {
  initialSection?: "exams" | "readiness" | "challenges";
  onBackHome: () => void;
  onUnlockBridge: (track: BridgeExamTrack) => void;
}) {
  const { hasBridgeAccess } = useApp();
  const [section, setSection] = useState<"exams" | "readiness" | "challenges">(initialSection);
  const [trackId, setTrackId] = useState<string>(bridgeExamTracks[0].id);
  const [examSubTab, setExamSubTab] = useState<"pdfs" | "predict">("pdfs");

  const activeTrack = bridgeExamTracks.find((t) => t.id === trackId) ?? bridgeExamTracks[0];
  const unlocked = hasBridgeAccess(activeTrack.id);

  return (
    <div
      dir="ltr"
      lang="so"
      className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col text-white relative"
      style={{
        background: "linear-gradient(180deg, #06212C 0%, #07383E 52%, #095252 100%)",
      }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <AuroraBackground />
      </div>

      {/* Single-Row Top Bar */}
      <header className="border-b border-white/15 sticky top-0 z-30 bg-[#06212C]/92 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBackHome}
              aria-label="Ku noqo CAAWIYE"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-xs font-bold text-white cursor-pointer transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">CAAWIYE</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 border border-white/30 flex items-center justify-center shrink-0">
                <SomaliStarIcon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-head font-extrabold text-[15px] sm:text-lg leading-tight truncate">
                  Gap · School ilaa University
                </h1>
                <p className="text-[11px] text-white/75 truncate">
                  Imtixaanka Jaamacadaha · {GAP_EXAM_DATE}
                </p>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-200 whitespace-nowrap shrink-0">
            Af-Soomaali Keliya
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-14 space-y-6">
        {/* Prepared Gap Intro Banner (October 2027) */}
        <section className="rounded-3xl p-5 sm:p-6 border border-emerald-300/30 bg-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              <Target className="w-4 h-4" />
              <span>Qeybta 2aad · Gap (Diyaargarowga Jaamacadda)</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white/85 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#FFD86B]" />
              <span>Imtixaanka: {GAP_EXAM_DATE}</span>
              <span className="text-white/35" aria-hidden="true">·</span>
              <span>Predict $0.10</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-head font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              Diyaar u ah Tartanka Jaamacadaha ({GAP_EXAM_DATE})
            </h2>
            <p className="text-sm text-white/85 leading-relaxed max-w-3xl">
              Qeybtani waxay u diyaarsan tahay waqtiga u dhexeeya Form 4 iyo Jaamacadda. PDF-yada iyo su'aalaha Predict Exam-ka waxaa la soo gelin doonaa ka hor {GAP_EXAM_DATE} insha Allah.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-2.5">
            {[
              {
                id: "exams" as const,
                label: "Tartanka Jaamacadaha",
                icon: <Target className="w-4 h-4" />,
              },
              {
                id: "readiness" as const,
                label: "Diyaargarowga 90 Maalmood",
                icon: <ClipboardCheck className="w-4 h-4" />,
              },
              {
                id: "challenges" as const,
                label: "Xalka Caqabadaha Kala-Guurka",
                icon: <Lightbulb className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold border inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  section === tab.id
                    ? "bg-white text-[#06212C] border-white shadow-sm"
                    : "bg-white/[0.08] text-white border-white/20 hover:bg-white/15"
                }`}
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {section === "exams" && (
          <div className="space-y-5 animate-pro-enter">
            {/* Select Track */}
            <div className="grid md:grid-cols-2 gap-3.5">
              {bridgeExamTracks.map((tr) => {
                const isSel = tr.id === activeTrack.id;
                const isOpen = hasBridgeAccess(tr.id);
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setTrackId(tr.id)}
                    className={`text-start rounded-3xl p-5 border transition-all cursor-pointer space-y-2 ${
                      isSel
                        ? "bg-emerald-500/25 border-white shadow-lg"
                        : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                        {tr.badge}
                      </span>
                      <span className={`text-xs font-extrabold ${isOpen ? "text-emerald-300" : "text-[#FFD86B]"}`}>
                        {isOpen ? "Furan" : tr.price}
                      </span>
                    </div>
                    <h3 className="font-head font-extrabold text-lg text-white leading-snug">
                      {tr.title}
                    </h3>
                    <div className="text-xs text-white/75 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD86B]" />
                      <span>Imtixaanka: {tr.examDate}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Track Detail Workspace */}
            <div className="rounded-3xl p-5 sm:p-6 border border-white/20 bg-white/[0.08] space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    {activeTrack.badge} · {activeTrack.examDate}
                  </span>
                  <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">
                    {activeTrack.title}
                  </h3>
                </div>

                {!unlocked && (
                  <button
                    type="button"
                    onClick={() => onUnlockBridge(activeTrack)}
                    className="px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#051531] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fur Predict ({activeTrack.price})</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-w-md">
                <button
                  type="button"
                  onClick={() => setExamSubTab("pdfs")}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold border inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    examSubTab === "pdfs"
                      ? "bg-white text-[#06212C] border-white shadow-sm"
                      : "bg-white/[0.08] text-white border-white/20 hover:bg-white/15"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF-yada (Free)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExamSubTab("predict")}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold border inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    examSubTab === "predict"
                      ? "bg-white text-[#06212C] border-white shadow-sm"
                      : "bg-white/[0.08] text-white border-white/20 hover:bg-white/15"
                  }`}
                >
                  {unlocked ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{unlocked ? "Predict Exam" : `Predict (${activeTrack.price})`}</span>
                </button>
              </div>
            </div>

            {examSubTab === "pdfs" ? (
              <div className="rounded-3xl p-6 sm:p-8 border border-white/20 bg-white/[0.07] text-center space-y-4 animate-pro-enter">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/25 border border-emerald-300/40 text-emerald-200 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                    PDF-yada · {activeTrack.title}
                  </div>
                  <h4 className="font-head font-extrabold text-lg sm:text-xl text-white">
                    Diyaar u ah Soo-Gelinta ({activeTrack.examDate})
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Weli lama soo gelin faylasha PDF-ka ee tartankan. Waxaa si bilaash ah loo soo gelin doonaa ka hor {activeTrack.examDate} insha Allah.
                  </p>
                </div>
              </div>
            ) : !unlocked ? (
              <PredictExamGateCard
                badgeText={activeTrack.badge}
                title={`Predict Exam · ${activeTrack.title}`}
                subtitle=""
                examDate={activeTrack.examDate}
                questionCount={activeTrack.predictQuestions.length}
                durationMin={activeTrack.durationMin}
                price={activeTrack.price}
                onUnlock={() => onUnlockBridge(activeTrack)}
              />
            ) : (
              <ProContentShield
                active={unlocked}
                sectionLabel={`Qeybta 2aad · Gap (${activeTrack.title})`}
              >
                <PredictExamRunner
                  title={activeTrack.title}
                  durationMin={activeTrack.durationMin}
                  examDate={activeTrack.examDate}
                  questions={activeTrack.predictQuestions}
                />
              </ProContentShield>
            )}
          </div>
        )}

        {section === "readiness" && (
          <div className="animate-pro-enter">
            <ReadinessTracker locked={false} />
          </div>
        )}

        {section === "challenges" && (
          <div className="animate-pro-enter">
            <SomaliaChallengesHub locked={false} />
          </div>
        )}
      </main>
    </div>
  );
}
