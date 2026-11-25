import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  Clock,
  Crown,
  Lock,
  LockOpen,
  Medal,
  RefreshCw,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { fetchPredictRankings } from "../lib/api";
import {
  filterRankingBySubject,
  formatDurationClock,
  mergePredictRankings,
  readLocalPredictRankings,
  type PredictRankingEntry,
  type PredictRankingScope,
} from "../lib/predictRanking";
import { ProContentShield } from "./ProContentShield";
import { ProBadge } from "./ModernUI";

export interface RankingSubjectOption {
  id: string;
  code: string;
  name: string;
  accent: string;
}

export function PredictRankingBoard({
  scope,
  title,
  subjects,
  proActive,
  onUnlock,
}: {
  scope: PredictRankingScope;
  title: string;
  subjects: RankingSubjectOption[];
  proActive: boolean;
  onUnlock: () => void;
}) {
  const { deviceId } = useApp();
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [entries, setEntries] = useState<PredictRankingEntry[]>(() =>
    typeof window !== "undefined" ? readLocalPredictRankings(localStorage, scope, deviceId) : []
  );
  const [loading, setLoading] = useState(false);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const localRows =
        typeof window !== "undefined"
          ? readLocalPredictRankings(localStorage, scope, deviceId)
          : [];
      const remoteRaw = await fetchPredictRankings(scope, "all", 60);
      const remoteRows: PredictRankingEntry[] = remoteRaw.map((r) => ({
        id: r.id,
        scope: r.scope,
        subjectId: r.subject_id,
        subjectName: r.subject_name,
        studentName: r.student_name,
        deviceIdShort: r.device_id_short,
        scorePct: Number(r.score_pct ?? 0),
        correctCount: Number(r.correct_count ?? 0),
        totalQuestions: Number(r.total_questions ?? 1),
        elapsedSec: Number(r.elapsed_sec ?? 0),
        submittedAt: Number(r.submitted_at ?? 0),
      }));
      setEntries(mergePredictRankings(remoteRows, localRows, deviceId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, deviceId, proActive]);

  const ranked = useMemo(
    () => filterRankingBySubject(entries, subjectFilter),
    [entries, subjectFilter]
  );

  if (!proActive) {
    return (
      <section
        dir="ltr"
        className="rounded-3xl p-5 sm:p-8 border border-[#FFC93C]/45 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-5 max-w-3xl mx-auto"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,201,60,0.12) 0%, rgba(10,33,77,0.92) 48%, rgba(6,22,56,0.96) 100%)",
        }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-[#FFC93C]/18 border border-[#FFC93C]/40 text-[#FFD86B] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-[#FFD86B]">
                Kaalmaha Sare (Unlock+ Keliya)
              </div>
              <div className="text-xs text-white/75">{title}</div>
            </div>
          </div>
          <ProBadge />
        </div>

        <div className="space-y-2">
          <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white leading-snug">
            Arag Kaalmaha Sare &amp; Natiijooyinka Ardayda
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Qof kasta oo furta Unlock+ ($0.50 qeyb ama $1.20 Total · 20% Off) wuxuu arki karaa kaalinta uu kaga jiro imtixaanka Predict Exam, magacyada ardayda ugu sarreysa, dhibcaha, iyo waqtiga ay ku dhameeyeen.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-2.5">
          {[
            { icon: Crown, label: "Kaalmaha 1aad, 2aad & 3aad" },
            { icon: Users, label: `${entries.length} Natiijo oo La Diiwaangeliyay` },
            { icon: ShieldCheck, label: "Natiijooyin Dhab ah Keliya" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl p-3 bg-white/[0.06] border border-white/12 flex items-center gap-2.5 text-xs font-bold text-white/90"
              >
                <Icon className="w-4 h-4 text-[#FFD86B] shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onUnlock}
          className="w-full h-[52px] rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-[15px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
        >
          <LockOpen className="w-4 h-4" />
          <span>Fur Unlock+ ($0.50 | Total $1.20)</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-white/65">
          <Lock className="w-3.5 h-3.5 text-[#FFD86B]" />
          <span>Magacyada iyo dhibcaha ardayda waxaa fura Unlock+ keliya</span>
        </div>
      </section>
    );
  }

  const topThree = ranked.slice(0, 3);

  return (
    <ProContentShield active={proActive} sectionLabel={title}>
      <section dir="ltr" className="space-y-5 min-w-0">
        {/* Top Ranking Header & Refresh */}
        <div className="rounded-3xl p-5 sm:p-6 border border-white/20 bg-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFD86B]">
              <Trophy className="w-4 h-4" />
              <span>Ranking · Kaalmaha Sare (Unlock+)</span>
            </div>
            <h3 className="font-head font-extrabold text-xl sm:text-2xl text-white">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => void loadRankings()}
            disabled={loading}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/20 text-xs font-extrabold text-white inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Cusboonaysii</span>
          </button>
        </div>

        {/* Subject Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSubjectFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              subjectFilter === "all"
                ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                : "bg-white/8 text-white/85 border-white/15 hover:bg-white/15"
            }`}
          >
            Dhammaan ({entries.length})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSubjectFilter(sub.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                subjectFilter === sub.id
                  ? "bg-white text-[#061D42] border-white"
                  : "bg-white/8 text-white/85 border-white/15 hover:bg-white/15"
              }`}
            >
              {sub.code} · {sub.name}
            </button>
          ))}
        </div>

        {ranked.length === 0 ? (
          <div className="rounded-3xl p-8 sm:p-10 border border-white/18 bg-[#071D42]/85 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFC93C]/15 border border-[#FFC93C]/40 text-[#FFD86B] flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <h4 className="font-head font-extrabold text-lg sm:text-xl text-white">
              Weli Natiijo Laguma Soo Gudbin
            </h4>
            <p className="text-xs sm:text-sm text-white/75 max-w-md mx-auto leading-relaxed">
              Marka su'aalaha PDF-ka la soo geliyo oo ardaydu dhammeeyaan Predict Exam-ka, kaalmaha 1aad, 2aad, 3aad iyo dhammaan ardayda ugu cadcad si toos ah ayay halkan uga soo muuqanayaan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium Cards */}
            <div className="grid md:grid-cols-3 gap-3.5">
              {topThree.map((entry) => {
                const isFirst = entry.rank === 1;
                const isSecond = entry.rank === 2;
                const borderCls = isFirst
                  ? "border-[#FFC93C] bg-gradient-to-br from-[#FFC93C]/24 via-[#0A2960]/95 to-[#06183A]"
                  : isSecond
                    ? "border-slate-300/60 bg-gradient-to-br from-slate-200/15 via-[#0A2960]/90 to-[#06183A]"
                    : "border-amber-600/60 bg-gradient-to-br from-amber-500/15 via-[#0A2960]/90 to-[#06183A]";
                const badgeCls = isFirst
                  ? "bg-[#FFC93C] text-[#050A1C]"
                  : isSecond
                    ? "bg-slate-200 text-slate-900"
                    : "bg-amber-600 text-white";
                const RankIcon = isFirst ? Crown : isSecond ? Medal : Award;

                return (
                  <article
                    key={entry.id}
                    className={`rounded-3xl p-5 border shadow-lg space-y-3 ${borderCls}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-head font-black ${badgeCls}`}
                      >
                        <RankIcon className="w-3.5 h-3.5" />
                        <span>Kaalinta #{entry.rank}</span>
                      </span>
                      {entry.isSelf && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-400/50 text-[10px] font-black text-emerald-200">
                          ADIGA
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-head font-extrabold text-lg text-white truncate">
                        {entry.studentName}
                      </div>
                      <div className="text-xs text-white/70 truncate mt-0.5">
                        {entry.subjectName}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/12 flex items-center justify-between gap-2 text-xs">
                      <span className="font-head font-black text-2xl text-[#FFD86B] tabular-nums">
                        {entry.scorePct}%
                      </span>
                      <div className="text-end text-white/75 tabular-nums space-y-0.5">
                        <div className="font-bold text-white/90">
                          {entry.correctCount}/{entry.totalQuestions} Sax
                        </div>
                        <div className="inline-flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>{formatDurationClock(entry.elapsedSec)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Full Ranked Table */}
            <div className="rounded-3xl border border-white/15 bg-[#071D42]/90 overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white/80">
                  Liiska Buuxa ee Kaalmaha ({ranked.length})
                </span>
                <span className="text-[11px] font-semibold text-emerald-300">
                  Natiijooyin Dhab ah
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {ranked.map((row) => (
                  <div
                    key={row.id}
                    className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 ${
                      row.isSelf ? "bg-emerald-500/12" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-head font-black text-xs shrink-0 tabular-nums ${
                          row.rank === 1
                            ? "bg-[#FFC93C] text-[#050A1C]"
                            : row.rank === 2
                              ? "bg-slate-200 text-slate-900"
                              : row.rank === 3
                                ? "bg-amber-600 text-white"
                                : "bg-white/10 text-white/85"
                        }`}
                      >
                        #{row.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-head font-bold text-sm text-white truncate">
                            {row.studentName}
                          </span>
                          {row.isSelf && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 border border-emerald-400/45 text-[10px] font-black text-emerald-200 shrink-0">
                              ADIGA
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] text-white/65 truncate">
                          {row.subjectName} · {row.correctCount}/{row.totalQuestions} Sax
                        </div>
                      </div>
                    </div>

                    <div className="text-end shrink-0 tabular-nums">
                      <div className="font-head font-extrabold text-base text-[#FFD86B]">
                        {row.scorePct}%
                      </div>
                      <div className="text-[11px] text-white/60 inline-flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{formatDurationClock(row.elapsedSec)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </ProContentShield>
  );
}
