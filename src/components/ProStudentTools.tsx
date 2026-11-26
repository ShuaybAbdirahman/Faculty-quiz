import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookCheck,
  Calculator,
  CalendarDays,
  Check,
  GraduationCap,
  MessageSquareQuote,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  calculateGradeInsight,
  DEFAULT_GRADE_SUBJECTS,
  PRO_INTERVIEW_PREP,
  WEEKLY_STUDY_BLUEPRINT,
  type StudentStream,
  type SubjectScoreInput,
} from "../lib/proTools";

const STORAGE_STUDY_KEY = "hk_pro_weekly_study_v1";

export function ProStudentTools() {
  const { darkMode } = useApp();
  const [subTab, setSubTab] = useState<"gpa" | "planner" | "interview">("gpa");

  // 1. Grade & Admission Simulator state
  const [stream, setStream] = useState<StudentStream>("science");
  const [subjects, setSubjects] = useState<SubjectScoreInput[]>(() => DEFAULT_GRADE_SUBJECTS.science);

  const handleStreamChange = (next: StudentStream) => {
    setStream(next);
    setSubjects(DEFAULT_GRADE_SUBJECTS[next]);
  };

  const updateScore = (id: string, val: number) => {
    const clamped = Math.min(100, Math.max(0, Number.isFinite(val) ? val : 0));
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, score: clamped } : s)));
  };

  const insight = useMemo(() => calculateGradeInsight(subjects, stream), [subjects, stream]);

  // 2. Weekly Study Planner & Pomodoro Timer
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_STUDY_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const toggleDay = (id: string) => {
    setCompletedDays((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_STUDY_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const doneDaysCount = WEEKLY_STUDY_BLUEPRINT.filter((b) => Boolean(completedDays[b.id])).length;

  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);

  useEffect(() => {
    if (!focusRunning) return;
    const id = window.setInterval(() => {
      setFocusSeconds((prev) => {
        if (prev <= 1) {
          setFocusRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [focusRunning]);

  const mins = String(Math.floor(focusSeconds / 60)).padStart(2, "0");
  const secs = String(focusSeconds % 60).padStart(2, "0");

  const cardCls = darkMode
    ? "bg-[#111C33] border-white/10 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const mutedCls = darkMode ? "text-slate-300" : "text-slate-600";
  const subtleSurface = darkMode ? "bg-[#0B1325] border-white/10" : "bg-slate-50 border-slate-200";

  return (
    <section className="space-y-6">
      {/* Header + Sub-tabs */}
      <div className={`rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-amber-400">
              Qalabka Gaarka ah ee Ardayga Pro
            </p>
            <h2 className="font-head font-bold text-xl sm:text-2xl tracking-tight mt-0.5">
              Xisaabiyaha Fursadda, Jadwalka &amp; Wareysiga
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Qalabka Ardayga Pro"
            className={`inline-flex p-1 rounded-xl border ${
              darkMode ? "bg-[#0B1325] border-white/10" : "bg-slate-100 border-slate-200"
            }`}
          >
            {[
              { id: "gpa" as const, label: "Darajada & GPA", icon: Calculator },
              { id: "planner" as const, label: "Jadwalka & Focus", icon: CalendarDays },
              { id: "interview" as const, label: "Wareysiga", icon: MessageSquareQuote },
            ].map((t) => {
              const Icon = t.icon;
              const active = subTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSubTab(t.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {subTab === "gpa" && (
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* Left: Subject Score Controls */}
          <div className={`lg:col-span-7 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-head font-bold text-lg">Geli Dhibcahaaga Qiyaasta ah</h3>
                <p className={`text-xs mt-0.5 ${mutedCls}`}>
                  Ku tijaabi dhibcaha Form 4 ama JUS si aad u aragto kulliyadaha kuu furmaya.
                </p>
              </div>
              <div
                className={`inline-flex p-1 rounded-lg border ${
                  darkMode ? "bg-[#0B1325] border-white/10" : "bg-slate-100 border-slate-200"
                }`}
              >
                {[
                  { id: "science" as const, label: "Saynis" },
                  { id: "tech" as const, label: "Tech" },
                  { id: "arts" as const, label: "Suugaan" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleStreamChange(st.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                      stream === st.id
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                        : mutedCls
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {subjects.map((sub) => (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor={`score-${sub.id}`} className="font-semibold">
                      {sub.label}
                    </label>
                    <span className="font-head font-bold tabular-nums text-blue-600 dark:text-amber-400">
                      {sub.score}%
                    </span>
                  </div>
                  <input
                    id={`score-${sub.id}`}
                    type="range"
                    min={30}
                    max={100}
                    value={sub.score}
                    onChange={(e) => updateScore(sub.id, Number(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-amber-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Academic Forecast */}
          <div className={`lg:col-span-5 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-5`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <p className={`text-xs font-medium ${mutedCls}`}>Celceliska La Saadaaliyay</p>
                <div className="mt-1 flex items-baseline gap-2.5">
                  <span className="font-head font-extrabold text-3xl sm:text-4xl tabular-nums text-blue-600 dark:text-amber-400">
                    {insight.averagePct}%
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    Darajada {insight.letter} · GPA {insight.gpa4.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-amber-400/15 text-blue-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 shrink-0" />
                <span>{insight.tierTitle}</span>
              </div>
              <p className={`text-sm leading-relaxed ${mutedCls}`}>{insight.summary}</p>
            </div>

            <div className={`rounded-xl p-4 border ${subtleSurface} space-y-2.5`}>
              <div className="text-xs font-bold">
                Kulliyadaha Ugu Habboon Darajadan ({insight.scholarshipReady ? "Deeq-u-qalma" : "Tartanka Caadiga ah"})
              </div>
              <ul className="space-y-1.5">
                {insight.eligibleFaculties.map((fac) => (
                  <li key={fac} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {subTab === "planner" && (
        <div className="grid lg:grid-cols-12 gap-5 items-start">
          {/* Weekly Study Blueprint */}
          <div className={`lg:col-span-8 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-4`}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-head font-bold text-lg">Jadwalka Toddobaadlaha ee Ardayga Sare</h3>
                <p className={`text-xs mt-0.5 ${mutedCls}`}>
                  Calaamadee maalin kasta marka aad dhammayso wax-akhriskaaga.
                </p>
              </div>
              <span className="text-xs font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {doneDaysCount}/{WEEKLY_STUDY_BLUEPRINT.length} Maalmood
              </span>
            </div>

            <div className="space-y-2.5">
              {WEEKLY_STUDY_BLUEPRINT.map((block) => {
                const done = Boolean(completedDays[block.id]);
                return (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => toggleDay(block.id)}
                    className={`w-full text-start rounded-xl p-4 border transition-colors cursor-pointer flex items-start gap-3 ${
                      done
                        ? "bg-emerald-50 dark:bg-emerald-500/12 border-emerald-300 dark:border-emerald-400/35"
                        : `${subtleSurface} hover:border-blue-400 dark:hover:border-white/25`
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        done
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-white/30"
                      }`}
                    >
                      {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-head font-bold text-sm">
                          {block.day} · {block.focus}
                        </span>
                        <span className={`text-xs font-semibold tabular-nums ${mutedCls}`}>
                          {block.durationMin} daqiiqo
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${mutedCls}`}>{block.tip}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pomodoro Study Focus Timer */}
          <div className={`lg:col-span-4 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-5`}>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="font-head font-bold text-lg">Saacadda Diiradda (25m)</h3>
            </div>

            <p className={`text-xs leading-relaxed ${mutedCls}`}>
              25 daqiiqo oo akhris buuxa ah adigoon eegin baraha bulshada, kadibna 5 daqiiqo oo nasasho ah.
            </p>

            <div className={`rounded-2xl py-6 px-4 border text-center ${subtleSurface}`}>
              <div className="font-head font-extrabold text-4xl sm:text-5xl tabular-nums tracking-tight">
                {mins}:{secs}
              </div>
              <div className={`text-xs mt-1.5 font-medium ${mutedCls}`}>
                {focusRunning ? "Diiraddu way shaqaynaysaa" : "Diyaar u ah bilowga"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFocusRunning((r) => !r)}
                className="min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {focusRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{focusRunning ? "Haki" : "Bilow"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocusRunning(false);
                  setFocusSeconds(25 * 60);
                }}
                className={`min-h-[44px] rounded-xl border font-head font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  darkMode
                    ? "border-white/15 hover:bg-white/8 text-slate-200"
                    : "border-slate-300 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Dib u celi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {subTab === "interview" && (
        <div className="space-y-4">
          {PRO_INTERVIEW_PREP.map((item, idx) => (
            <article key={item.id} className={`rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-3`}>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600/12 dark:bg-amber-400/15 text-blue-600 dark:text-amber-400 font-head font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-head font-bold text-base sm:text-lg leading-snug">
                    {item.question}
                  </h3>
                  <p className={`text-xs ${mutedCls}`}>
                    <strong>Sababta la isu weydiiyo:</strong> {item.whyAsked}
                  </p>
                </div>
              </div>
              <div className={`rounded-xl p-3.5 border ${subtleSurface} flex items-start gap-2.5 text-sm leading-relaxed`}>
                <BookCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-700 dark:text-emerald-400">Qaabka Jawaabta Guusha: </strong>
                  <span>{item.winningAnswerTip}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
