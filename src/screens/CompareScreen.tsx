import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react";
import { faculties, type Faculty } from "../data/quizData";
import { useApp } from "../context/AppContext";
import { argbToHex } from "../lib/i18n";
import type { FacultyMatch } from "../lib/scoring";
import { FacultyBanner, Footer } from "../components/ModernUI";

export function CompareScreen({
  matches,
  onBack,
}: {
  matches: FacultyMatch[];
  onBack: () => void;
}) {
  const { tr, trf, tx, txl, rtl, darkMode, setDarkMode } = useApp();
  const [aId, setAId] = useState(matches[0]?.f.id ?? faculties[0].id);
  const [bId, setBId] = useState(matches[1]?.f.id ?? faculties[1].id);

  const getF = (id: string): Faculty => faculties.find((f) => f.id === id) ?? faculties[0];
  const getM = (id: string): FacultyMatch | undefined => matches.find((m) => m.f.id === id);

  const fa = getF(aId);
  const fb = getF(bId);
  const ma = getM(aId);
  const mb = getM(bId);

  const Pair = ({
    title,
    render,
  }: {
    title?: string;
    render: (f: Faculty, m?: FacultyMatch) => React.ReactNode;
  }) => (
    <div className={title ? "mt-5" : ""}>
      {title && <h3 className="text-center font-head font-extrabold text-sm mb-2">{tr(title)}</h3>}
      <div className="grid grid-cols-2 gap-3 items-start">
        <div className="min-w-0">{render(fa, ma)}</div>
        <div className="min-w-0">{render(fb, mb)}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <h1 className="font-head font-bold text-[19px]">{tr("Isbarbardhig")}</h1>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{tr(darkMode ? "Iftiin" : "Mugdi")}</span>
        </button>
      </header>

      <main className="px-4 pt-2 pb-6 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: aId, set: setAId },
            { val: bId, set: setBId },
          ].map((sel, i) => (
            <select
              key={i}
              value={sel.val}
              onChange={(e) => sel.set(e.target.value)}
              className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold border outline-none ${
                darkMode
                  ? "bg-[#151D33] border-white/15 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.short}
                </option>
              ))}
            </select>
          ))}
        </div>

        <div className="mt-3.5">
          <Pair
            render={(f) => (
              <div className="rounded-[16px] overflow-hidden">
                <FacultyBanner faculty={f} height={100} label />
              </div>
            )}
          />
          <Pair
            title="Ku habboonaanta"
            render={(f, m) => (
              <p
                className="font-head font-extrabold text-[24px]"
                style={{ color: argbToHex(f.color) }}
              >
                {m?.inPool ? `${m.percent}%` : "-"}
              </p>
            )}
          />
          <Pair
            title="Xiisaha · Kartida · Qiimaha"
            render={(_, m) => (
              <p className="text-xs opacity-75">
                {m?.inPool ? `${m.interest}% · ${m.aptitude}% · ${m.conditions}%` : "-"}
              </p>
            )}
          />
          <Pair
            title="Magaca"
            render={(f) => <p className="text-sm font-semibold leading-snug">{tx(f.name)}</p>}
          />
          <Pair
            title="Sharaxaad"
            render={(f) => <p className="text-xs leading-relaxed opacity-85">{tx(f.desc)}</p>}
          />
          <Pair
            title="Waaxaha"
            render={(f) => (
              <p className="text-xs leading-relaxed opacity-85">
                {trf("{n} waax: {list}", { n: f.depts.length, list: f.depts.join(", ") })}
              </p>
            )}
          />
          <Pair
            title="Shaqooyinka"
            render={(f) => (
              <p className="text-xs leading-relaxed opacity-85">{txl(f.jobs).join(" · ")}</p>
            )}
          />
          <Pair
            title="Talo"
            render={(f) => (
              <p className="text-xs leading-relaxed opacity-85">{txl(f.tips)[0] ?? ""}</p>
            )}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
