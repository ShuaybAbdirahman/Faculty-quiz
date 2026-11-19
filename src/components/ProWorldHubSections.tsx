import React, { useState } from "react";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe2,
  GraduationCap,
  Info,
  Lock,
  MapPin,
  Rocket,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { faculties } from "../data/quizData";
import {
  futureJobsNews,
  highIncomeSkills,
  somaliaStudentGrowthPillars,
  worldFacultyPioneers,
} from "../data/proWorldData";
import {
  somaliaUniversities,
  somaliaUniversitiesDisclaimer,
} from "../data/somaliaUniversities";

function SourceBadge({ name, url }: { name: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 hover:bg-white/15 border border-white/15 text-[11px] font-semibold text-white/85 transition-colors"
    >
      <Globe2 className="w-3 h-3 text-[#FFD86B] shrink-0" />
      <span>{name}</span>
      <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
    </a>
  );
}

function ProLockedFooter({ onUnlock }: { onUnlock: () => void }) {
  const { tr } = useApp();
  return (
    <div className="mt-4 rounded-2xl p-4 border border-[#FFC93C]/40 bg-[#FFC93C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-2.5 text-xs text-[#FFE599] leading-relaxed">
        <Lock className="w-4 h-4 text-[#FFD86B] shrink-0 mt-0.5" />
        <span>
          {tr("Fur Pro Waaxaha & Xarunta ($0.10 · Abid) si aad u aragto dhammaan xogta, ilaha la hubiyay, iyo qorshayaasha.")}
        </span>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="shrink-0 px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{tr("Fur Pro ($0.10 · Abid)")}</span>
      </button>
    </div>
  );
}

export function WorldPioneersSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr, tx } = useApp();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? worldFacultyPioneers
      : worldFacultyPioneers.filter((p) => p.facultyId === filter);

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
          <Award className="w-4 h-4" />
          <span>{tr("Dadka Caanka ah ee Adduunka (Ilaha La Hubiyay)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Kulliyadaha iyo Dadka Heerka Sare ka Gaaray Adduunka")}
        </h2>
        <p className="mt-1.5 text-sm text-white/75 leading-relaxed">
          {tr("Baro shakhsiyaad dhab ah oo adduunka iyo Soomaaliya magac ku yeeshay, shahaadadii ay qaateen, iyo casharka ardaygu ka baran karo.")}
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: "all", label: tr("Dhammaan") },
          { id: "cs", label: "CS & AI" },
          { id: "med", label: tr("Caafimaadka") },
          { id: "eng", label: tr("Injineernimada") },
          { id: "econ", label: tr("Dhaqaalaha") },
          { id: "law", label: tr("Sharciga") },
          { id: "agri", label: tr("Beeraha") },
          { id: "health", label: tr("Caaf. Bulshada") },
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border shrink-0 cursor-pointer transition-colors ${
              filter === chip.id
                ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                : "bg-white/6 text-white/80 border-white/15 hover:bg-white/12"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => {
          const locked = !isPro;
          return (
            <article
              key={p.id}
              className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] flex flex-col justify-between gap-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD86B]">
                      {tx(p.facultyLabel)}
                    </span>
                    <h3 className="font-head font-extrabold text-lg text-white mt-0.5">
                      {p.name}
                    </h3>
                  </div>
                  <GraduationCap className="w-5 h-5 text-[#FFD86B] shrink-0 mt-1" />
                </div>

                {locked ? (
                  <button
                    type="button"
                    onClick={onUnlock}
                    className="w-full text-start rounded-xl p-3 bg-white/[0.04] hover:bg-[#FFC93C]/10 border border-white/10 hover:border-[#FFC93C]/35 text-xs text-white/70 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                    <span>{tr("Fur Pro si aad u akhrido guusha, casharka ardayga, iyo isha rasmiga ah.")}</span>
                  </button>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-sky-200/90">{tx(p.degree)}</p>
                    <p className="text-sm text-white/85 leading-relaxed">{tx(p.achievement)}</p>
                    <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-400/25 text-xs text-emerald-100 leading-relaxed">
                      <strong className="text-emerald-300">{tr("Casharka Ardayga:")} </strong>
                      {tx(p.lesson)}
                    </div>
                  </>
                )}
              </div>

              {!locked && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-white/55">{tr("Isha la hubiyay:")}</span>
                  <SourceBadge name={p.sourceName} url={p.sourceUrl} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!isPro && <ProLockedFooter onUnlock={onUnlock} />}
    </section>
  );
}

export function FutureJobsNewsSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr, tx } = useApp();

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <TrendingUp className="w-4 h-4" />
          <span>{tr("Wararka Shaqooyinka Cusub (WEF 2025 - 2030)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Shaqooyinka Ugu Kororka Badan Adduunka & Fursadda Soomaaliya")}
        </h2>
        <p className="mt-1.5 text-sm text-white/75 leading-relaxed">
          {tr("Xog rasmi ah oo laga soo xigtay World Economic Forum (Future of Jobs Report 2025): 170 milyan oo shaqo cusub ayaa abuurmaya ka hor 2030, 86% shirkaduhuna waxay adeegsan doonaan AI.")}
        </p>
      </div>

      {/* Key Macro Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { stat: "170M", label: tr("Shaqooyin cusub (2030)") },
          { stat: "86%", label: tr("Shirkadaha AI adeegsanaya") },
          { stat: "+113%", label: tr("Kobaca Xogta & AI") },
        ].map((s) => (
          <div
            key={s.stat}
            className="rounded-2xl p-3.5 border border-white/15 bg-white/[0.05] text-center"
          >
            <div className="font-head font-black text-xl sm:text-2xl text-[#FFD86B] tabular-nums">
              {s.stat}
            </div>
            <div className="text-[11px] text-white/75 mt-0.5 leading-snug">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3.5">
        {futureJobsNews.map((job) => {
          const locked = !isPro;
          return (
            <article
              key={job.id}
              className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    {tx(job.facultyTag)}
                  </span>
                  <h3 className="font-head font-extrabold text-lg text-white mt-0.5">
                    {tx(job.title)}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/18 border border-emerald-400/35 text-emerald-300 font-head font-extrabold text-xs tabular-nums">
                  {job.growthStat}
                </span>
              </div>

              {locked ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="w-full text-start rounded-xl p-3 bg-white/[0.04] hover:bg-[#FFC93C]/10 border border-white/10 hover:border-[#FFC93C]/35 text-xs text-white/70 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                  <span>{tr("Fur Pro si aad u aragto falanqaynta suuqa Soomaaliya, xirfadaha loo baahan yahay, iyo isha warbixinta.")}</span>
                </button>
              ) : (
                <>
                  <p className="text-sm text-white/85 leading-relaxed">{tx(job.summary)}</p>
                  <div className="rounded-xl p-3.5 bg-[#091233]/80 border border-white/10 text-xs text-white/90 leading-relaxed">
                    <strong className="text-[#FFD86B]">{tr("Fursadda Soomaaliya:")} </strong>
                    {tx(job.somaliaOpportunity)}
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.keySkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg bg-white/8 border border-white/12 text-[11px] font-semibold text-white/85"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                    <SourceBadge name={job.sourceName} url={job.sourceUrl} />
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>

      {!isPro && <ProLockedFooter onUnlock={onUnlock} />}
    </section>
  );
}

export function HighIncomeSkillsSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr, tx } = useApp();

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
          <Wrench className="w-4 h-4" />
          <span>{tr("Xirfadaha Dakhliga Sare (Baro Adigoo Arday ah)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Xirfadaha Lacagta Laga Sameeyo (Video Editing, Design, Web & AI)")}
        </h2>
        <p className="mt-1.5 text-sm text-white/75 leading-relaxed">
          {tr("Xirfado waxtar leh oo aad barbar baran karto jaamacadda, adigoo adeegsanaya koorsooyin bilaash ah oo rasmi ah si aad dakhli ugu samayso gudaha Soomaaliya iyo caalamkaba.")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {highIncomeSkills.map((skill) => {
          const locked = !isPro;
          return (
            <article
              key={skill.id}
              className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] flex flex-col justify-between gap-3.5"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    {tx(skill.category)}
                  </span>
                  <h3 className="font-head font-extrabold text-lg text-white mt-0.5">
                    {tx(skill.title)}
                  </h3>
                </div>

                {locked ? (
                  <button
                    type="button"
                    onClick={onUnlock}
                    className="w-full text-start rounded-xl p-3 bg-white/[0.04] hover:bg-[#FFC93C]/10 border border-white/10 hover:border-[#FFC93C]/35 text-xs text-white/70 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                    <span>{tr("Fur Pro si aad u aragto qorshaha 30-ka maalmood, sida lacag looga sameeyo, iyo koorsada bilaashka ah.")}</span>
                  </button>
                ) : (
                  <>
                    <p className="text-sm text-white/85 leading-relaxed">{tx(skill.whyNow)}</p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {skill.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-lg bg-[#FFC93C]/12 border border-[#FFC93C]/30 text-[11px] font-bold text-[#FFE599]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-white/75">{tr("Qorshaha 30-ka Maalmood:")}</div>
                      {skill.monthPlan.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-white/85 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tx(step)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-400/25 text-xs text-emerald-100 leading-relaxed">
                      <strong className="text-emerald-300 flex items-center gap-1 mb-0.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {tr("Sida Ardaygu Lacag Uga Sameeyo:")}
                      </strong>
                      {tx(skill.howToEarn)}
                    </div>
                  </>
                )}
              </div>

              {!locked && (
                <div className="pt-2 border-t border-white/10">
                  <SourceBadge name={skill.freeResourceName} url={skill.freeResourceUrl} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!isPro && <ProLockedFooter onUnlock={onUnlock} />}
    </section>
  );
}

export function SomaliaGrowthSection({
  isPro,
  onUnlock,
}: {
  isPro: boolean;
  onUnlock: () => void;
}) {
  const { tr, tx } = useApp();

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <Rocket className="w-4 h-4" />
          <span>{tr("Horumarinta Ardayga Soomaaliya (Qorshe La Hubiyay)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Sidee Ardayga Soomaaliya Heer Caalami ah u Gaari Karaa?")}
        </h2>
        <p className="mt-1.5 text-sm text-white/75 leading-relaxed">
          {tr("Tallaabooyin dhab ah oo ku salaysan warbixinnada Bangiga Adduunka (DE4A & Rajo Kaaba) iyo deeqaha waxbarasho ee rasmiga ah ee u furan ardayda Soomaaliya.")}
        </p>
      </div>

      <div className="space-y-4">
        {somaliaStudentGrowthPillars.map((pillar) => {
          const locked = !isPro;
          return (
            <article
              key={pillar.id}
              className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] space-y-3"
            >
              <h3 className="font-head font-extrabold text-lg text-white">
                {tx(pillar.title)}
              </h3>

              {locked ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="w-full text-start rounded-xl p-3 bg-white/[0.04] hover:bg-[#FFC93C]/10 border border-white/10 hover:border-[#FFC93C]/35 text-xs text-white/70 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                  <span>{tr("Fur Pro si aad u aragto istiraatiijiyadda iyo xiriirrada rasmiga ah ee deeqaha waxbarasho.")}</span>
                </button>
              ) : (
                <>
                  <p className="text-xs sm:text-sm text-[#FFE599] bg-[#FFC93C]/10 border border-[#FFC93C]/25 rounded-xl p-3 leading-relaxed">
                    {tx(pillar.evidenceStat)}
                  </p>
                  <div className="space-y-2">
                    {pillar.strategy.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-sm text-white/90 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tx(st)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {pillar.verifiedLinks.map((lnk) => (
                        <SourceBadge key={lnk.url} name={lnk.name} url={lnk.url} />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/55">{pillar.sourceName}</span>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>

      {!isPro && <ProLockedFooter onUnlock={onUnlock} />}
    </section>
  );
}

export function SomaliaUniversitiesSection({
  isPro,
  onUnlock,
  initialFacultyId,
}: {
  isPro: boolean;
  onUnlock: () => void;
  initialFacultyId?: string;
}) {
  const { tr, tx } = useApp();
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [facultyFilter, setFacultyFilter] = useState<string>(initialFacultyId || "all");

  const cities = ["all", "Muqdisho", "Hargeysa", "Boorama", "Garowe", "Kismaayo", "Baydhabo"];

  const filtered = somaliaUniversities.filter((u) => {
    const matchCity = cityFilter === "all" || u.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchFac = facultyFilter === "all" || u.facultyIds.includes(facultyFilter);
    return matchCity && matchFac;
  });

  return (
    <section className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
          <Building2 className="w-4 h-4" />
          <span>{tr("Hagaha Jaamacadaha Soomaaliya (Hage Guud)")}</span>
        </div>
        <h2 className="mt-1 font-head font-extrabold text-2xl sm:text-3xl text-white">
          {tr("Jaamacadaha Bixiya Kulliyaddaada")}
        </h2>
      </div>

      {/* Clear Public Directory Non-Affiliation Disclaimer */}
      <div className="rounded-2xl p-3.5 bg-sky-500/10 border border-sky-400/25 flex items-start gap-2.5 text-xs text-sky-100 leading-relaxed">
        <Info className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
        <span>{tx(somaliaUniversitiesDisclaimer)}</span>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
            {tr("Magaalada")}
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCityFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 cursor-pointer transition-colors ${
                  cityFilter === c
                    ? "bg-[#FFC93C] text-[#050A1C] border-[#FFC93C]"
                    : "bg-white/6 text-white/80 border-white/15 hover:bg-white/12"
                }`}
              >
                {c === "all" ? tr("Dhammaan") : c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="uni-fac-filter" className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
            {tr("Kulliyadda")}
          </label>
          <select
            id="uni-fac-filter"
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="w-full rounded-xl px-3.5 py-2 text-xs font-bold bg-[#091233] border border-white/20 text-white outline-none focus:border-[#FFC93C]"
          >
            <option value="all">{tr("Dhammaan Kulliyadaha (14)")}</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {tx(f.name)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* University Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((u) => (
          <article
            key={u.id}
            className="rounded-3xl p-5 border border-white/15 bg-white/[0.05] flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-head font-extrabold text-base sm:text-lg text-white leading-snug">
                  {u.name}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold shrink-0 ${
                    u.type === "public"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                      : "bg-white/10 text-white/80 border border-white/15"
                  }`}
                >
                  {u.type === "public" ? tr("Dowli") : tr("Gaar ah")}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFD86B]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{u.city}</span>
              </div>

              {!isPro ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  className="w-full text-start rounded-xl p-3 bg-white/[0.04] hover:bg-[#FFC93C]/10 border border-white/10 hover:border-[#FFC93C]/35 text-xs text-white/70 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#FFD86B] shrink-0" />
                  <span>{tr("Fur Pro si aad u aragto kulliyadaha, faahfaahinta, iyo website-ka rasmiga ah.")}</span>
                </button>
              ) : (
                <>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{tx(u.note)}</p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {u.facultyIds.slice(0, 6).map((fid) => {
                      const fac = faculties.find((f) => f.id === fid);
                      if (!fac) return null;
                      return (
                        <span
                          key={fid}
                          className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${
                            facultyFilter === fid
                              ? "bg-[#FFC93C]/20 border-[#FFC93C]/50 text-[#FFE599]"
                              : "bg-white/6 border-white/12 text-white/75"
                          }`}
                        >
                          {tx(fac.name).split("(")[0].trim()}
                        </span>
                      );
                    })}
                    {u.facultyIds.length > 6 && (
                      <span className="text-[10.5px] text-white/55 font-semibold">
                        +{u.facultyIds.length - 6}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {isPro && (
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-white/55">{tr("Khidmadda & gelitaanka:")}</span>
                <SourceBadge name={u.website.replace(/^https?:\/\//, "")} url={u.website} />
              </div>
            )}
          </article>
        ))}
      </div>

      {!isPro && <ProLockedFooter onUnlock={onUnlock} />}
    </section>
  );
}
