import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UploadCloud,
  XCircle,
} from "lucide-react";
import type { PredictQuestion } from "../data/schoolForm4Data";

export function PredictExamGateCard({
  title,
  subtitle,
  questionCount,
  durationMin,
  examDate,
  price = "$0.10",
  badgeText,
  onUnlock,
}: {
  title: string;
  subtitle: string;
  questionCount: number;
  durationMin: number;
  examDate?: string;
  price?: string;
  badgeText: string;
  onUnlock: () => void;
}) {
  return (
    <div
      dir="ltr"
      className="rounded-3xl p-5 sm:p-7 border border-[#4189DD]/45 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-5 shadow-xl"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-[#4189DD]/25 border border-[#4189DD]/50 text-[#93C5FD] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </span>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#93C5FD]">
              {badgeText}
            </div>
            <div className="text-xs text-white/70">Af-Soomaali Keliya</div>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg bg-[#FFC93C]/20 border border-[#FFC93C]/45 font-head font-black text-xs text-[#FFD86B] tabular-nums">
          PRO · {price}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white leading-snug">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm text-white/80 leading-relaxed">{subtitle}</p>
        ) : (
          <p className="text-sm text-white/80 leading-relaxed">
            Su'aalaha Predict Exam-ka waxaa la soo gelin doonaa ka hor {examDate ?? "imtixaanka"} insha Allah.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-white/85 pt-1">
        {examDate && (
          <>
            <span className="inline-flex items-center gap-1.5 text-[#93C5FD]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Imtixaanka: {examDate}</span>
            </span>
            <span className="text-white/30" aria-hidden="true">·</span>
          </>
        )}
        <span className="tabular-nums">
          {questionCount > 0 ? `${questionCount} Su'aalood` : "Diyaar u ah soo-gelinta"}
        </span>
        <span className="text-white/30" aria-hidden="true">·</span>
        <span className="tabular-nums">{durationMin} Daqiiqo</span>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onUnlock}
          className="relative overflow-hidden w-full h-[52px] rounded-2xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] shadow-[0_10px_28px_rgba(65,137,221,0.35)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer"
          />
          <Sparkles className="w-4 h-4 relative z-10 text-[#FFD86B]" />
          <span className="relative z-10">Fur Predict Exam ({price})</span>
        </button>

        <p className="text-[11.5px] text-center text-white/65 leading-relaxed">
          Hal mar bixi {price} (EVC Plus: 610999089 · Shuceyb Abdirahman).
        </p>
      </div>
    </div>
  );
}

export function PredictExamRunner({
  title,
  durationMin,
  examDate,
  questions,
}: {
  title: string;
  durationMin: number;
  examDate?: string;
  questions: PredictQuestion[];
}) {
  const [phase, setPhase] = useState<"ready" | "active" | "done">("ready");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60);

  useEffect(() => {
    setPhase("ready");
    setIdx(0);
    setAnswers({});
    setSecondsLeft(durationMin * 60);
  }, [title, durationMin]);

  useEffect(() => {
    if (phase !== "active") return;
    if (secondsLeft <= 0) {
      setPhase("done");
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, secondsLeft]);

  if (questions.length === 0) {
    return (
      <div
        dir="ltr"
        className="rounded-3xl p-6 sm:p-8 border border-[#4189DD]/40 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-4 text-center"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4189DD]/20 border border-[#4189DD]/45 text-[#93C5FD] flex items-center justify-center">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#93C5FD]">
            Predict Exam · {examDate ?? "2027"}
          </div>
          <h3 className="font-head font-extrabold text-xl text-white">{title}</h3>
          <p className="text-sm text-white/75 leading-relaxed">
            Su'aalaha Predict Exam-ka weli lama soo gelin. Waxaa la soo gelin doonaa ka hor {examDate ?? "2027"} insha Allah.
          </p>
        </div>
      </div>
    );
  }

  const startExam = () => {
    setAnswers({});
    setIdx(0);
    setSecondsLeft(durationMin * 60);
    setPhase("active");
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (phase === "ready") {
    return (
      <div
        dir="ltr"
        className="rounded-3xl p-5 sm:p-7 border border-emerald-400/35 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-5"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Predict Exam Waa Kuu Furan Yahay</span>
          </span>
          <span className="text-xs font-bold text-[#FFD86B] tabular-nums">
            {questions.length} Su'aalood · {durationMin} Daqiiqo
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">{title}</h3>
          <p className="text-sm text-white/75 leading-relaxed">
            Isku tijaabi imtixaan la mid ah qaabka rasmiga ah. Markaad dhammayso waxaad heli doontaa dhibcahaaga (%) iyo sharaxaadda su'aal kasta.
          </p>
        </div>

        <button
          type="button"
          onClick={startExam}
          className="w-full sm:w-auto px-7 h-12 rounded-2xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Bilow Imtixaanka Tijaabada</span>
        </button>
      </div>
    );
  }

  if (phase === "done") {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const gradeLabel =
      pct >= 85
        ? "Heer Sare (A)"
        : pct >= 70
        ? "Wanaagsan (B)"
        : pct >= 50
        ? "Dhexdhexaad (C)"
        : "U Baahan Ku-celin";

    return (
      <div dir="ltr" className="space-y-5">
        <div className="rounded-3xl p-6 border border-[#4189DD]/45 bg-gradient-to-br from-[#0B336B] to-[#061A3A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFD86B]">
              <Trophy className="w-4 h-4" />
              <span>Natiijada Predict Exam</span>
            </div>
            <h3 className="font-head font-extrabold text-2xl text-white">{title}</h3>
            <p className="text-sm text-white/80 tabular-nums">
              Waxaad saxday <strong>{correctCount}</strong> ka mid ah <strong>{questions.length}</strong> su'aalood · Darajada: <strong className="text-[#FFD86B]">{gradeLabel}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 text-center">
              <div className="font-head font-black text-3xl text-[#FFD86B] tabular-nums">{pct}%</div>
              <div className="text-[11px] text-white/65">Dhibcaha</div>
            </div>
            <button
              type="button"
              onClick={startExam}
              className="h-12 px-4 rounded-2xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ku Celi</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, qIndex) => {
            const chosen = answers[q.id];
            const isRight = chosen === q.correctIndex;
            return (
              <article
                key={q.id}
                className={`rounded-2xl p-4 sm:p-5 border space-y-2.5 ${
                  isRight
                    ? "bg-emerald-500/10 border-emerald-400/35"
                    : "bg-rose-500/10 border-rose-400/35"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                      Su'aal {qIndex + 1} · {q.topic}
                    </span>
                    <h4 className="font-head font-bold text-sm sm:text-base text-white mt-0.5 leading-snug">
                      {q.prompt}
                    </h4>
                  </div>
                  {isRight ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>

                <div className="text-xs sm:text-sm space-y-1">
                  {chosen !== undefined ? (
                    <p className={isRight ? "text-emerald-200" : "text-rose-200"}>
                      Jawaabtaada: <strong>{q.options[chosen]}</strong>
                    </p>
                  ) : (
                    <p className="text-rose-200">Kama aadan jawaabin su'aashan.</p>
                  )}
                  {!isRight && (
                    <p className="text-emerald-300">
                      Jawaabta saxda ah: <strong>{q.options[q.correctIndex]}</strong>
                    </p>
                  )}
                </div>

                <p className="rounded-xl p-3 bg-[#061836]/80 border border-white/10 text-xs text-white/85 leading-relaxed">
                  <strong className="text-[#FFD86B]">Sharaxaad: </strong>
                  {q.explanation}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = questions[idx];
  const selected = answers[currentQ.id];
  const answeredCount = Object.keys(answers).length;
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      dir="ltr"
      className="rounded-3xl p-5 sm:p-6 border border-white/15 bg-[#072047]/90 text-white space-y-5"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-white/10">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#93C5FD]">
            {currentQ.topic}
          </div>
          <div className="text-xs text-white/75 tabular-nums">
            Su'aal {idx + 1} / {questions.length} · La jawaabay: {answeredCount}/{questions.length}
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold tabular-nums ${
            secondsLeft < 60
              ? "bg-rose-500/20 border-rose-400/40 text-rose-200"
              : "bg-white/8 border-white/15 text-[#93C5FD]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{timeText}</span>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#4189DD] transition-all duration-300"
          style={{ width: `${Math.round(((idx + 1) / questions.length) * 100)}%` }}
        />
      </div>

      <h3 className="font-head font-extrabold text-lg sm:text-xl text-white leading-snug">
        {currentQ.prompt}
      </h3>

      <div className="space-y-2.5">
        {currentQ.options.map((opt, oi) => {
          const isSel = selected === oi;
          return (
            <button
              key={oi}
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: oi }))}
              className={`w-full text-start p-3.5 rounded-2xl border flex items-center gap-3 transition-colors cursor-pointer ${
                isSel
                  ? "bg-[#4189DD] text-white border-[#93C5FD] font-bold"
                  : "bg-white/[0.05] hover:bg-white/[0.11] text-white border-white/15"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  isSel ? "bg-white text-[#0A2B5E]" : "bg-white/12 text-[#93C5FD]"
                }`}
              >
                {letters[oi]}
              </span>
              <span className="text-sm leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-35 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-default"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Hore</span>
        </button>

        {idx < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="px-5 py-2.5 rounded-xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Xiga</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhase("done")}
            className="px-6 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#051531] font-head font-extrabold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Dhammaystir & Eeg Natiijada</span>
          </button>
        )}
      </div>
    </div>
  );
}
