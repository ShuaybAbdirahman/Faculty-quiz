import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  Lock,
  LockOpen,
  Target,
  Trophy,
  UploadCloud,
} from "lucide-react";
import {
  bridgeExamTracks,
  bridgeSubjects,
  GAP_EXAM_DATE,
  type BridgeExamTrack,
} from "../data/bridgingPrepData";
import { useApp } from "../context/AppContext";
import { HiraalLogoMark } from "../components/ModernUI";
import { ProContentShield } from "../components/ProContentShield";
import { ReadinessTracker, SomaliaChallengesHub } from "../components/ProHubContent";
import { PredictExamGateCard, PredictExamRunner } from "../components/PredictExamRunner";
import { PredictRankingBoard } from "../components/PredictRankingBoard";
import { saveLocalPredictScore } from "../lib/predictRanking";
import { submitPredictRanking } from "../lib/api";

export type BridgingSectionTab = "exams" | "readiness" | "challenges" | "ranking";

export function BridgingPrepScreen({
  initialSection = "exams",
  onBackHome,
  onUnlockBridge,
  onOpenPaywall,
}: {
  initialSection?: BridgingSectionTab;
  onBackHome: () => void;
  onUnlockBridge: (track: BridgeExamTrack) => void;
  onOpenPaywall: () => void;
}) {
  const { hasBridgeAccess, proActive, deviceId, userName } = useApp();
  const [section, setSection] = useState<BridgingSectionTab>(initialSection);
  const [subjectId, setSubjectId] = useState<string>(bridgeSubjects[0].id);
  const [examSubTab, setExamSubTab] = useState<"pdfs" | "predict">("pdfs");

  const activeTrack = bridgeExamTracks[0];
  const activeSubject = bridgeSubjects.find((s) => s.id === subjectId) ?? bridgeSubjects[0];
  const unlocked = proActive || hasBridgeAccess(activeTrack.id) || hasBridgeAccess(activeSubject.id);

  const handleRecordJusScore = (res: {
    correctCount: number;
    totalQuestions: number;
    scorePct: number;
    elapsedSec: number;
    studentName: string;
  }) => {
    saveLocalPredictScore(localStorage, {
      scope: "jus",
      subjectId: activeSubject.id,
      subjectName: activeSubject.name,
      studentName: res.studentName,
      deviceId,
      scorePct: res.scorePct,
      correctCount: res.correctCount,
      totalQuestions: res.totalQuestions,
      elapsedSec: res.elapsedSec,
    });
    void submitPredictRanking({
      deviceId,
      scope: "jus",
      subjectId: activeSubject.id,
      subjectName: activeSubject.name,
      studentName: res.studentName,
      scorePct: res.scorePct,
      correctCount: res.correctCount,
      totalQuestions: res.totalQuestions,
      elapsedSec: res.elapsedSec,
    });
  };

  return (
    <div
      dir="ltr"
      lang="so"
      className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col text-white relative"
      style={{
        background: "linear-gradient(180deg, #06212C 0%, #07383E 52%, #095252 100%)",
      }}
    >
      {/* Single-Row Top Bar */}
      <header className="border-b border-white/15 relative z-30 bg-[#06212C]/92 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBackHome}
              aria-label="Ku noqo HIRAAL"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-xs font-bold text-white cursor-pointer transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">HIRAAL</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 border border-white/30 flex items-center justify-center shrink-0">
                <HiraalLogoMark size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="font-head font-extrabold text-[15px] sm:text-lg leading-tight truncate">
                  Diyaarinta Jaamacadda (JUS · 5 Maado)
                </h1>
                <p className="text-[11px] text-white/75 truncate">
                  Tartanka Jaamacadda Ummadda · {GAP_EXAM_DATE}
                </p>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-200 whitespace-nowrap shrink-0">
            Af-Soomaali Keliya
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 space-y-5">
        {/* Focused JUS Stage Header */}
        <section className="rounded-3xl p-5 sm:p-6 border border-emerald-300/30 bg-white/[0.08] backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              <Target className="w-4 h-4" />
              <span>Qeybta 2aad · Jaamacadda Ummadda (JUS Keliya)</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white/85 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#FFD86B]" />
              <span>{GAP_EXAM_DATE}</span>
              <span className="text-white/35" aria-hidden="true">·</span>
              <span>JUS $0.50 · Total $1.20 (20% Off)</span>
            </div>
          </div>

          <h2 className="font-head font-extrabold text-xl sm:text-2xl text-white leading-tight">
            Tartanka JUS (4 Saynis + Ingiriisi), 90 Maalmood &amp; Ranking
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: "exams" as const,
                label: "Imtixaanka JUS (5 Maado)",
                icon: <Target className="w-4 h-4" />,
              },
              {
                id: "readiness" as const,
                label: "90 Maalmood (Free)",
                icon: <ClipboardCheck className="w-4 h-4" />,
              },
              {
                id: "challenges" as const,
                label: "Xalka Caqabadaha (Free)",
                icon: <Lightbulb className="w-4 h-4" />,
              },
              {
                id: "ranking" as const,
                label: "Ranking JUS",
                icon: proActive ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                className={`px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold border inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
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
            {/* 5 Core JUS Entrance Subjects Selector (4 Scientific + English) */}
            <section aria-label="5-ta Maado ee Jaamacadda Ummadda (JUS)" className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap px-1">
                <h3 className="font-head font-extrabold text-sm sm:text-base text-white">
                  5-ta Maado ee JUS (4 Saynis + Ingiriisi)
                </h3>
                <span className="text-xs font-bold text-emerald-200">
                  {activeTrack.examDate}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {bridgeSubjects.map((sub) => {
                  const isSel = sub.id === activeSubject.id;
                  const subOpen =
                    proActive || hasBridgeAccess(activeTrack.id) || hasBridgeAccess(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSubjectId(sub.id)}
                      className={`text-start rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSel
                          ? "bg-white text-[#06212C] border-white shadow-md"
                          : "bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-head font-black text-[11px] text-white shrink-0"
                          style={{ backgroundColor: sub.accent }}
                        >
                          {sub.code}
                        </span>
                        <div className="min-w-0">
                          <div className="font-head font-extrabold text-xs leading-tight truncate">
                            {sub.name}
                          </div>
                          <div
                            className={`text-[10.5px] font-semibold mt-0.5 truncate ${
                              isSel ? "text-emerald-800" : "text-white/65"
                            }`}
                          >
                            {subOpen ? "Furan" : sub.groupLabel}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Subject Workspace */}
            <div className="rounded-3xl p-5 sm:p-6 border border-white/20 bg-white/[0.08] space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                    {activeTrack.badge} · {activeSubject.groupLabel} · {activeSubject.examDate}
                  </span>
                  <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">
                    {activeSubject.name}
                  </h3>
                </div>

                {!unlocked ? (
                  activeSubject.predictQuestions.length > 0 || activeTrack.predictQuestions.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => onUnlockBridge(activeTrack)}
                      className="px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#051531] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <LockOpen className="w-3.5 h-3.5" />
                      <span>Fur Predict ({activeTrack.price})</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>Diyaar ({activeSubject.examDate})</span>
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{proActive ? "Unlock+ Furan" : "Predict Furan"}</span>
                  </span>
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
                  {unlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{unlocked ? "Predict Exam" : `Predict (${activeTrack.price})`}</span>
                </button>
              </div>
            </div>

            {examSubTab === "pdfs" ? (
              <div className="rounded-3xl p-6 sm:p-8 border border-white/20 bg-white/[0.07] text-center space-y-3 animate-pro-enter">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/25 border border-emerald-300/40 text-emerald-200 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                    PDF-yada JUS · {activeSubject.name}
                  </div>
                  <h4 className="font-head font-extrabold text-lg text-white">
                    Diyaar · Markii PDFs la soo geliyo ({activeSubject.examDate})
                  </h4>
                  <p className="text-xs text-white/75 max-w-md mx-auto leading-relaxed">
                    Kaydka PDF-yada imtixaannadii hore waa xog dadweyne oo mar walba bilaash u ah arday kasta.
                  </p>
                </div>
              </div>
            ) : !unlocked ? (
              <PredictExamGateCard
                badgeText={`${activeTrack.badge} · ${activeSubject.code}`}
                title={`Predict Exam · ${activeSubject.name}`}
                subtitle=""
                examDate={activeSubject.examDate}
                questionCount={activeSubject.predictQuestions.length}
                durationMin={activeSubject.durationMin}
                price={activeTrack.price}
                blueprint={activeSubject.examBlueprint}
                onUnlock={() => onUnlockBridge(activeTrack)}
              />
            ) : (
              <ProContentShield
                active={unlocked}
                sectionLabel={`Qeybta 2aad · JUS (${activeSubject.name})`}
              >
                <PredictExamRunner
                  title={`${activeSubject.name} (JUS)`}
                  durationMin={activeSubject.durationMin}
                  examDate={activeSubject.examDate}
                  blueprint={activeSubject.examBlueprint}
                  questions={activeSubject.predictQuestions}
                  defaultStudentName={userName}
                  onExamCompleted={handleRecordJusScore}
                />
              </ProContentShield>
            )}
          </div>
        )}

        {section === "readiness" && (
          <div className="animate-pro-enter">
            <ReadinessTracker locked={false} onUnlockClick={onOpenPaywall} />
          </div>
        )}

        {section === "challenges" && (
          <div className="animate-pro-enter">
            <SomaliaChallengesHub locked={false} onUnlockClick={onOpenPaywall} />
          </div>
        )}

        {section === "ranking" && (
          <div className="animate-pro-enter">
            <PredictRankingBoard
              scope="jus"
              title="Kaalmaha Sare · Tartanka JUS (5 Maado)"
              subjects={bridgeSubjects}
              proActive={proActive}
              onUnlock={onOpenPaywall}
            />
          </div>
        )}
      </main>
    </div>
  );
}
