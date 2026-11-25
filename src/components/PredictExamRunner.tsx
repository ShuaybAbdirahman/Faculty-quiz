import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  Lock,
  LockOpen,
  Play,
  RotateCcw,
  ShieldCheck,
  Trophy,
  UploadCloud,
  User,
  XCircle,
} from "lucide-react";
import type { OfficialExamBlueprint, PredictQuestion } from "../data/schoolForm4Data";

export function PredictExamGateCard({
  title,
  subtitle,
  questionCount,
  durationMin,
  examDate,
  price = "$0.50",
  badgeText,
  blueprint,
  onUnlock,
}: {
  title: string;
  subtitle: string;
  questionCount: number;
  durationMin: number;
  examDate?: string;
  price?: string;
  badgeText: string;
  blueprint?: OfficialExamBlueprint;
  onUnlock: () => void;
}) {
  return (
    <div
      dir="ltr"
      className="rounded-3xl p-5 sm:p-6 border border-[#4189DD]/45 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-4 shadow-xl"
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
          UNLOCK+ · {price}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-head font-extrabold text-xl text-white leading-snug">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{subtitle}</p>}
      </div>

      {blueprint && (
        <div className="rounded-2xl p-3.5 bg-white/[0.06] border border-white/12 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD86B] inline-flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Qaabka Imtixaanka</span>
            </span>
            <span className="text-xs font-bold text-emerald-300 tabular-nums">
              {blueprint.questionScale} · {blueprint.totalMarks} Dhibcood
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/85">
            <div className="rounded-xl px-3 py-2 bg-[#061836]/80 border border-white/10">
              {blueprint.part1Label}
            </div>
            <div className="rounded-xl px-3 py-2 bg-[#061836]/80 border border-white/10">
              {blueprint.part2Label}
            </div>
          </div>
          <p className="text-[11px] text-emerald-200/90 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>{blueprint.pastPaperPolicy}</span>
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-white/85">
        {examDate && (
          <>
            <span className="inline-flex items-center gap-1.5 text-[#93C5FD]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{examDate}</span>
            </span>
            <span className="text-white/30" aria-hidden="true">·</span>
          </>
        )}
        <span className="tabular-nums">
          {questionCount > 0 ? `${questionCount} Su'aalood` : blueprint?.questionScale ?? "Diyaar"}
        </span>
        <span className="text-white/30" aria-hidden="true">·</span>
        <span className="tabular-nums">{durationMin} Daqiiqo</span>
      </div>

      {questionCount > 0 ? (
        <button
          type="button"
          onClick={onUnlock}
          className="w-full h-[50px] rounded-2xl bg-[#4189DD] hover:bg-[#5CA2F2] text-white font-head font-extrabold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
        >
          <LockOpen className="w-4 h-4 text-[#FFD86B]" />
          <span>Fur Predict Exam ({price} · Total $1.20 -20%)</span>
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="w-full h-[48px] rounded-2xl bg-white/10 text-white/70 border border-white/20 font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <UploadCloud className="w-4 h-4 text-[#93C5FD]" />
          <span>Diyaar · Markii PDFs la soo geliyo ({examDate ?? "2027"})</span>
        </button>
      )}
    </div>
  );
}

export function PredictExamRunner({
  title,
  durationMin,
  examDate,
  blueprint,
  questions,
  defaultStudentName = "",
  onExamCompleted,
}: {
  title: string;
  durationMin: number;
  examDate?: string;
  blueprint?: OfficialExamBlueprint;
  questions: PredictQuestion[];
  defaultStudentName?: string;
  onExamCompleted?: (res: {
    correctCount: number;
    totalQuestions: number;
    scorePct: number;
    elapsedSec: number;
    studentName: string;
  }) => void;
}) {
  const [phase, setPhase] = useState<"ready" | "active" | "done">("ready");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMin * 60);
  const [studentName, setStudentName] = useState(defaultStudentName);
  const [recordedToRanking, setRecordedToRanking] = useState(false);
  const recordedOnceRef = useRef(false);

  useEffect(() => {
    setPhase("ready");
    setIdx(0);
    setAnswers({});
    setSecondsLeft(durationMin * 60);
    setRecordedToRanking(false);
    recordedOnceRef.current = false;
  }, [title, durationMin]);

  useEffect(() => {
    if (defaultStudentName && !studentName) {
      setStudentName(defaultStudentName);
    }
  }, [defaultStudentName, studentName]);

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

  useEffect(() => {
    if (phase !== "done" || recordedOnceRef.current || questions.length === 0) return;
    recordedOnceRef.current = true;
    const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const elapsedSec = Math.max(1, durationMin * 60 - secondsLeft);
    if (onExamCompleted) {
      onExamCompleted({
        correctCount,
        totalQuestions: questions.length,
        scorePct,
        elapsedSec,
        studentName: studentName.trim() || "Arday",
      });
      setRecordedToRanking(true);
    }
  }, [phase, questions, answers, durationMin, secondsLeft, onExamCompleted, studentName]);

  if (questions.length === 0) {
    return (
      <div
        dir="ltr"
        className="rounded-3xl p-6 sm:p-8 border border-[#4189DD]/40 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-4"
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock+ Waa Diyaar</span>
          </span>
          <span className="text-xs font-bold text-[#FFD86B] tabular-nums">
            {blueprint?.questionScale ?? "40 ilaa 50 su'aalood"} · {durationMin} Daqiiqo
          </span>
        </div>

        <div className="text-center space-y-2 py-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#4189DD]/20 border border-[#4189DD]/45 text-[#93C5FD] flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#93C5FD]">
            Predict Exam · {examDate ?? "2027"}
          </div>
          <h3 className="font-head font-extrabold text-xl text-white">{title}</h3>
          <p className="text-xs sm:text-sm text-white/75">
            Diyaar · Markii PDFs la soo geliyo.
          </p>
        </div>
      </div>
    );
  }

  const startExam = () => {
    setAnswers({});
    setIdx(0);
    setSecondsLeft(durationMin * 60);
    setRecordedToRanking(false);
    recordedOnceRef.current = false;
    setPhase("active");
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (phase === "ready") {
    return (
      <div
        dir="ltr"
        className="rounded-3xl p-5 sm:p-6 border border-emerald-400/35 bg-gradient-to-br from-[#0A2B5E] via-[#072047] to-[#051531] text-white space-y-4"
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

        <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">{title}</h3>

        <div className="max-w-sm space-y-1.5">
          <label
            htmlFor="predict-student-name"
            className="flex items-center gap-1.5 text-xs font-bold text-white/80"
          >
            <User className="w-3.5 h-3.5 text-[#FFD86B]" />
            <span>Magacaaga Ranking-ga (Kaalmaha Sare)</span>
          </label>
          <input
            id="predict-student-name"
            type="text"
            value={studentName}
            maxLength={36}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Geli magacaaga (tusaale: Axmed)"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-[#041430] border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35"
          />
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
              Waxaad saxday <strong>{correctCount}</strong> / <strong>{questions.length}</strong> · Darajada: <strong className="text-[#FFD86B]">{gradeLabel}</strong>
            </p>
            {recordedToRanking && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Natiijadaada waxaa lagu daray Ranking-ga ({studentName.trim() || "Arday"})</span>
              </div>
            )}
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
                      {q.pastPaperYear ? ` (${q.pastPaperYear})` : ""}
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
            {currentQ.pastPaperYear ? ` · ${currentQ.pastPaperYear}` : ""}
            {currentQ.marks ? ` · ${currentQ.marks} Dhibcood` : ""}
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

      {/* Exam Question Number Navigator (National Exam Paper Style) */}
      <div className="flex items-center gap-1.5 flex-wrap" aria-label="Lambarrada Su'aalaha">
        {questions.map((q, qIndex) => {
          const isCur = qIndex === idx;
          const isAns = answers[q.id] !== undefined;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIdx(qIndex)}
              className={`min-w-[30px] h-7 px-1.5 rounded-lg text-[11px] font-bold tabular-nums border cursor-pointer transition-colors ${
                isCur
                  ? "bg-[#FFC93C] text-[#051531] border-[#FFC93C]"
                  : isAns
                    ? "bg-emerald-500/25 text-emerald-200 border-emerald-400/45"
                    : "bg-white/[0.06] text-white/70 border-white/15 hover:bg-white/15"
              }`}
            >
              {qIndex + 1}
            </button>
          );
        })}
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
            <span>Dhammaystir &amp; Eeg Natiijada</span>
          </button>
        )}
      </div>
    </div>
  );
}
