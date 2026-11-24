import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  Lock,
  LockOpen,
  UploadCloud,
} from "lucide-react";
import {
  FORM4_EXAM_DATE,
  FORM4_GROUPS,
  form4Subjects,
  type Form4Subject,
  type SchoolSubjectGroup,
} from "../data/schoolForm4Data";
import { useApp } from "../context/AppContext";
import { HiraalLogoMark } from "../components/ModernUI";
import { ProContentShield } from "../components/ProContentShield";
import { PredictExamGateCard, PredictExamRunner } from "../components/PredictExamRunner";

export function SchoolForm4Screen({
  initialSubjectId,
  onBackHome,
  onUnlockSubject,
}: {
  initialSubjectId?: string;
  onBackHome: () => void;
  onUnlockSubject: (subject: Form4Subject) => void;
}) {
  const { hasSchoolAccess } = useApp();
  const [groupFilter, setGroupFilter] = useState<"all" | SchoolSubjectGroup>("all");
  const [selectedId, setSelectedId] = useState<string>(initialSubjectId || form4Subjects[0].id);
  const [innerTab, setInnerTab] = useState<"pdfs" | "predict">("pdfs");

  const visibleSubjects = useMemo(() => {
    if (groupFilter === "all") return form4Subjects;
    return form4Subjects.filter((s) => s.group === groupFilter);
  }, [groupFilter]);

  const activeSubject = useMemo(() => {
    return (
      visibleSubjects.find((s) => s.id === selectedId) ??
      form4Subjects.find((s) => s.id === selectedId) ??
      visibleSubjects[0] ??
      form4Subjects[0]
    );
  }, [visibleSubjects, selectedId]);

  const subjectUnlocked = hasSchoolAccess(activeSubject.id);

  return (
    <div
      dir="ltr"
      lang="so"
      className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col text-white relative"
      style={{
        background: "linear-gradient(180deg, #062147 0%, #093E78 52%, #0284C7 100%)",
      }}
    >
      {/* Single-Row Top Bar */}
      <header className="border-b border-white/15 relative z-30 bg-[#062147]/92 backdrop-blur-xl">
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
              <div className="w-8 h-8 rounded-lg bg-[#0284C7] border border-white/30 flex items-center justify-center shrink-0">
                <HiraalLogoMark size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="font-head font-extrabold text-[15px] sm:text-lg leading-tight truncate">
                  School · Form 4 (12 Maado)
                </h1>
                <p className="text-[11px] text-white/75 truncate">
                  Imtixaanka Qaranka · {FORM4_EXAM_DATE}
                </p>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold text-[#BFDBFE] whitespace-nowrap shrink-0">
            Af-Soomaali Keliya
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 space-y-6">
        {/* Prepared Flagship Intro Banner (June 2027) */}
        <section className="rounded-3xl p-5 sm:p-6 border border-[#7CB7FF]/35 bg-white/[0.08] backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#BFDBFE]">
              <GraduationCap className="w-4 h-4 text-[#93C5FD]" />
              <span>Qeybta 1aad · School (Form 4)</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-white/85 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#FFD86B]" />
              <span>Imtixaanka: {FORM4_EXAM_DATE}</span>
              <span className="text-white/35" aria-hidden="true">·</span>
              <span>Predict $0.25 / Maado</span>
            </div>
          </div>

          <h2 className="font-head font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            Diyaar u ah Imtixaanka Qaranka ({FORM4_EXAM_DATE})
          </h2>
          <p className="text-sm text-white/85 leading-relaxed max-w-3xl">
            12-ka maado ee Imtixaanka Qaranka waa la diyaariyay. PDF-yada iyo su'aalaha Predict Exam-ka waxaa si rasmi ah loo soo gelin doonaa ka hor {FORM4_EXAM_DATE} insha Allah.
          </p>

          {/* Group Filter Tabs */}
          <div className="pt-1 flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {FORM4_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupFilter(g.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  groupFilter === g.id
                    ? "bg-white text-[#0A2B5E] border-white shadow-sm"
                    : "bg-white/10 text-white/90 border-white/20 hover:bg-white/18"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Two-Column Interactive Subject Selector & Upload-Ready Workspace */}
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* Left: 12 Subjects Grid Selector */}
          <section
            aria-label="Liiska 12-ka Maado"
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5"
          >
            {visibleSubjects.map((sub) => {
              const isSelected = sub.id === activeSubject.id;
              const unlocked = hasSchoolAccess(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedId(sub.id)}
                  className={`w-full text-start rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#4189DD]/35 border-white shadow-lg"
                      : "bg-white/[0.06] hover:bg-white/[0.12] border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-head font-black text-xs text-white shrink-0 border border-white/25"
                      style={{ backgroundColor: sub.accent }}
                    >
                      {sub.code}
                    </span>
                    <div className="min-w-0">
                      <div className="font-head font-extrabold text-sm text-white truncate">
                        {sub.name}
                      </div>
                      <div className="text-[11px] text-white/75 truncate">
                        {sub.groupLabel} · {sub.examDate}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-extrabold shrink-0 whitespace-nowrap ${
                      unlocked ? "text-emerald-300" : "text-[#FFD86B]"
                    }`}
                  >
                    {unlocked ? "Furan" : sub.predictPrice}
                  </span>
                </button>
              );
            })}
          </section>

          {/* Right: Active Subject Ready-State Workspace */}
          <section className="lg:col-span-7 space-y-4 min-w-0">
            <div className="rounded-3xl p-5 sm:p-6 border border-white/20 bg-white/[0.08] space-y-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-head font-black text-sm text-white shrink-0 border border-white/25"
                    style={{ backgroundColor: activeSubject.accent }}
                  >
                    {activeSubject.code}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#BFDBFE]">
                      {activeSubject.groupLabel} · {activeSubject.examDate}
                    </div>
                    <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white leading-tight">
                      {activeSubject.name}
                    </h3>
                  </div>
                </div>

                {!subjectUnlocked ? (
                  activeSubject.predictQuestions.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => onUnlockSubject(activeSubject)}
                      className="px-4 py-2 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#051531] font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <LockOpen className="w-3.5 h-3.5" />
                      <span>Fur Predict ({activeSubject.predictPrice})</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BFDBFE] shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>Soo Socda ({activeSubject.examDate})</span>
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Predict Waa Furan Yahay</span>
                  </span>
                )}
              </div>

              {/* Clean 2-Tab Selector (PDFs Free & Predict Exam) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: "pdfs" as const, label: "PDF-yada (Free)", icon: <FileText className="w-4 h-4" /> },
                  {
                    id: "predict" as const,
                    label: subjectUnlocked ? "Predict Exam" : `Predict (${activeSubject.predictPrice})`,
                    icon: subjectUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInnerTab(t.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold border inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap truncate ${
                      innerTab === t.id
                        ? "bg-white text-[#0A2B5E] border-white shadow-sm"
                        : "bg-white/[0.08] text-white border-white/20 hover:bg-white/15"
                    }`}
                  >
                    {t.icon}
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {innerTab === "pdfs" && (
              <div className="rounded-3xl p-6 sm:p-8 border border-white/20 bg-white/[0.07] text-center space-y-4 animate-pro-enter">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4189DD]/25 border border-[#93C5FD]/40 text-[#BFDBFE] flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#93C5FD]">
                    PDF-yada · {activeSubject.name}
                  </div>
                  <h4 className="font-head font-extrabold text-lg sm:text-xl text-white">
                    Diyaar u ah Soo-Gelinta ({FORM4_EXAM_DATE})
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Weli lama soo gelin faylasha PDF-ka ee maadadan. Waxaa si bilaash ah loo soo gelin doonaa ka hor {FORM4_EXAM_DATE} insha Allah.
                  </p>
                </div>
              </div>
            )}

            {innerTab === "predict" && (
              <div className="animate-pro-enter">
                {!subjectUnlocked ? (
                  <PredictExamGateCard
                    badgeText={`Form 4 Predict Exam · ${activeSubject.code}`}
                    title={`Predict Exam · ${activeSubject.name}`}
                    subtitle=""
                    examDate={activeSubject.examDate}
                    questionCount={activeSubject.predictQuestions.length}
                    durationMin={activeSubject.predictDurationMin}
                    price={activeSubject.predictPrice}
                    onUnlock={() => onUnlockSubject(activeSubject)}
                  />
                ) : (
                  <ProContentShield
                    active={subjectUnlocked}
                    sectionLabel={`Qeybta 1aad · School (${activeSubject.name})`}
                  >
                    <PredictExamRunner
                      title={`Predict Exam: ${activeSubject.name}`}
                      durationMin={activeSubject.predictDurationMin}
                      examDate={activeSubject.examDate}
                      questions={activeSubject.predictQuestions}
                    />
                  </ProContentShield>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
