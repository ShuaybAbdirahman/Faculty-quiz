import type { Faculty } from "../data/quizData";
import type { FacultyMatch } from "./scoring";

export interface DecisionPriorityWeights {
  interest: number;
  aptitude: number;
  conditions: number;
}

export interface PersonalCareerStrategy {
  gap: number;
  clarityLevel: "close_race" | "clear_lead" | "strong_fit";
  clarityTitle: string;
  claritySummary: string;
  strongestPillar: "Xiisaha" | "Kartida" | "Qiimaha";
  growthPillar: "Xiisaha" | "Kartida" | "Qiimaha";
  pillarAdvice: string;
  actionPlan30Days: {
    weekLabel: string;
    title: string;
    detail: string;
  }[];
  marketAdvantageNote: string;
}

export interface ComparisonMatrixResult {
  scoreA: number;
  scoreB: number;
  recommended: "a" | "b" | "tie";
  interestWinner: "a" | "b" | "tie";
  aptitudeWinner: "a" | "b" | "tie";
  conditionsWinner: "a" | "b" | "tie";
  verdictTitle: string;
  verdictBody: string;
  hybridComboNote: string;
  decisionQuestions: string[];
}

function cleanName(raw: string): string {
  return raw.replace(/^(Kulliyadda|Faculty of|كلية)\s+/, "").trim();
}

function pickWinner(a: number, b: number): "a" | "b" | "tie" {
  if (a > b + 1) return "a";
  if (b > a + 1) return "b";
  return "tie";
}

function weightedFit(m: FacultyMatch | undefined, w: DecisionPriorityWeights): number {
  if (!m || !m.inPool) return 0;
  const sumW = Math.max(1, w.interest + w.aptitude + w.conditions);
  const raw =
    (m.interest * w.interest + m.aptitude * w.aptitude + m.conditions * w.conditions) / sumW;
  return Math.round(raw);
}

function buildHybridAdvice(fa: Faculty, fb: Faculty, nameA: string, nameB: string): string {
  const pair = [fa.id, fb.id].sort().join("+");
  switch (pair) {
    case "cs+econ":
      return "Isku-darka Computer Science + Economics wuxuu kaa dhigayaa qof ku xeel dheer FinTech, Xog-falanqaynta Bangiyada (Business Analytics), iyo nidaamyada ganacsiga casriga ah.";
    case "cs+eng":
      return "Isku-darka Computer Science + Engineering wuxuu furayaa waddada Embedded AI, Robotics, Smart Grids, iyo xalka tiknoolajiyada Soomaaliya.";
    case "cs+med":
    case "cs+health":
    case "cs+pharm":
      return `Haddii aad doorato ${nameA}, waxaad ku kordhin kartaa xirfadda Health Informatics ama xog-maamulka isbitaallada adigoo adeegsanaya tiknoolajiyada caafimaadka.`;
    case "econ+eng":
      return "Injineerinka oo lagu daro Xisaabaadka iyo Maamulka Mashaariicda wuxuu kaa dhigayaa Project Manager iyo qandaraasle qiime sare suuqa ku leh.";
    case "econ+law":
    case "law+pol":
      return "Sharciga iyo Dhaqaalaha/Siyaasadda waa isku-dar aad looga raadiyo hay'adaha caalamiga ah, bangiyada, iyo la-talinta heshiisyada ganacsiga.";
    case "agri+econ":
    case "agri+eng":
      return "Beeraha casriga ah (Agribusiness & Irrigation Engineering) waa mid ka mid ah fursadaha ugu waaweyn ee wax-soo-saarka Soomaaliya.";
    default:
      return `Xitaa haddii aad doorato ${nameA} shahaado ahaan, waxaad Sanadka 1aad ilaa 2aad qaadan kartaa koorsooyin yaryar ama mashaariic ku saabsan ${nameB} si aad suuqa shaqada uga dhex muuqato.`;
  }
}

export function buildPersonalCareerStrategy(
  matches: FacultyMatch[],
  profile: string[]
): PersonalCareerStrategy | null {
  if (matches.length === 0) return null;
  const top1 = matches[0];
  const top2 = matches[1];
  const name1 = cleanName(top1.f.name.so || top1.f.en);
  const name2 = top2 ? cleanName(top2.f.name.so || top2.f.en) : "";
  const gap = top2 ? Math.max(0, top1.percent - top2.percent) : top1.percent;

  let clarityLevel: PersonalCareerStrategy["clarityLevel"] = "strong_fit";
  let clarityTitle = "Go'aan Xooggan oo Cad";
  let claritySummary = `${name1} ayaa hoggaaminaysa natiijadaada (${top1.percent}%). Astaamahaaga iyo jawaabahaagu si toos ah ayay ugu beegan yihiin mihnaddan.`;

  if (top2 && gap < 5) {
    clarityLevel = "close_race";
    clarityTitle = "Doorbid Isku Dhow (Laba Kulliyadood oo Tartamaya)";
    claritySummary = `Farqiga u dhexeeya ${name1} (${top1.percent}%) iyo ${name2} (${top2.percent}%) waa ${gap}% keliya. Ha degdegin: isticmaal Isbarbardhigga Pro si aad labadooda u kala miisaanto ka hor inta aadan isqorin.`;
  } else if (top2 && gap < 12) {
    clarityLevel = "clear_lead";
    clarityTitle = "Hoggaamin Muuqata oo leh Ikhtiyaar Labaad";
    claritySummary = `${name1} (${top1.percent}%) ayaa ka horreysa ${name2} (${top2.percent}%) farqi dhan ${gap}%. Waxaad ${name1} ka dhigtaa doorashada 1aad, ${name2}-na ka dhig keydka 2aad (Option B) haddii shuruuduhu isbeddelaan.`;
  }

  const pillars: { key: "Xiisaha" | "Kartida" | "Qiimaha"; val: number }[] = [
    { key: "Xiisaha", val: top1.interest },
    { key: "Kartida", val: top1.aptitude },
    { key: "Qiimaha", val: top1.conditions },
  ];
  const sorted = [...pillars].sort((a, b) => b.val - a.val);
  const strongestPillar = sorted[0].key;
  const growthPillar = sorted[sorted.length - 1].key;

  let pillarAdvice = "";
  if (strongestPillar === "Xiisaha" && growthPillar === "Qiimaha") {
    pillarAdvice = `Xiisahaaga ku aaddan ${name1} waa mid aad u sarreeya (${top1.interest}%), balse dhinaca Qiimaha/Xaaladaha (${top1.conditions}%) wuxuu u baahan yahay qorshe dhaqaale iyo xulasho jaamacad khidmaddeedu kugu habboon tahay.`;
  } else if (strongestPillar === "Kartida" && growthPillar === "Xiisaha") {
    pillarAdvice = `Kartidaada dabiiciga ah ee ${name1} waa xooggan tahay (${top1.aptitude}%), laakiin Xiisaha (${top1.interest}%) wuu ka hooseeyaa. Daawashada 3 mashruuc oo dhab ah oo kulliyaddan ah ayaa kuu xaqiijinaysa inaad ku raaxaysan doonto.`;
  } else if (strongestPillar === "Qiimaha") {
    pillarAdvice = `Xaaladahaaga iyo qiyamkaaga (${top1.conditions}%) waxay si fiican u taageerayaan ${name1}. Si aad uga dhex muuqato fasalka, xooji ${growthPillar.toLowerCase()} ka hor Semester 1.`;
  } else {
    pillarAdvice = `Isku-dheellitirkaaga ${strongestPillar} (${sorted[0].val}%) iyo ${sorted[1].key} (${sorted[1].val}%) wuxuu ku siinayaa bilow adag gudaha ${name1}.`;
  }

  const topDept = top1.f.depts[0] ?? name1;
  const topJob = top1.f.jobs.so[0] ?? name1;
  const profileLabel = profile.slice(0, 3).join(", ") || "Xiisahaaga gaarka ah";

  return {
    gap,
    clarityLevel,
    clarityTitle,
    claritySummary,
    strongestPillar,
    growthPillar,
    pillarAdvice,
    actionPlan30Days: [
      {
        weekLabel: "Toddobaadka 1aad",
        title: `La hadal arday dhigta ${topDept}`,
        detail: `Weydii 3 su'aalood: maaddooyinka ugu adag Sanadka 1aad, tayada shaybaarka, iyo buugaagta/qalabka loo baahan yahay.`,
      },
      {
        weekLabel: "Toddobaadka 2aad ilaa 3aad",
        title: `Tijaabi xirfad la xiriirta ${topJob}`,
        detail: `Samee hal tababar yar ama ku daawo 5 cashar oo hordhac ah YouTube si aad u aragto nolol-maalmeedka dhabta ah ee ${name1}.`,
      },
      {
        weekLabel: "Toddobaadka 4aad",
        title: "Hubi shuruudaha & deeqaha waxbarasho",
        detail: top2
          ? `Diyaari dukumiintiyada, isbarbar dhig khidmadda 2 jaamacadood ee bixiya ${name1}, una hay ${name2} meel keyd ah.`
          : `Diyaari shahaadada, hubi taariikhda diiwaangelinta jaamacadaha bixiya ${name1}, oo bilow diyaargarowga luqadda.`,
      },
    ],
    marketAdvantageNote: `Astaantaada (${profileLabel}) waxay xoog ku leedahay ${name1}. Ardayda ku dara hal xirfad gacan-qabasho ah sanadka koowaad waxay helaan fursad shaqo ka hor qalin-jabinta.`,
  };
}

export function buildComparisonMatrix(
  fa: Faculty,
  fb: Faculty,
  ma?: FacultyMatch,
  mb?: FacultyMatch,
  weights: DecisionPriorityWeights = { interest: 1, aptitude: 1, conditions: 1 }
): ComparisonMatrixResult {
  const nameA = cleanName(fa.name.so || fa.en);
  const nameB = cleanName(fb.name.so || fb.en);

  const scoreA = weightedFit(ma, weights);
  const scoreB = weightedFit(mb, weights);
  const recommended =
    ma?.inPool && mb?.inPool
      ? pickWinner(scoreA, scoreB)
      : ma?.inPool
      ? "a"
      : mb?.inPool
      ? "b"
      : "tie";

  const interestWinner =
    ma?.inPool && mb?.inPool ? pickWinner(ma.interest, mb.interest) : "tie";
  const aptitudeWinner =
    ma?.inPool && mb?.inPool ? pickWinner(ma.aptitude, mb.aptitude) : "tie";
  const conditionsWinner =
    ma?.inPool && mb?.inPool ? pickWinner(ma.conditions, mb.conditions) : "tie";

  let verdictTitle = `Isbarbardhigga ${nameA} iyo ${nameB}`;
  let verdictBody = `Labada kulliyadood mid walba wuxuu leeyahay waaxyo u gaar ah (${fa.depts.length} vs ${fb.depts.length} waaxood). Qaado imtixaanka RIASEC haddii aadan weli dhibco lahayn.`;

  if (fa.id === fb.id) {
    verdictTitle = `${nameA} (Kulliyad Isku Mid ah)`;
    verdictBody = `Waxaad dooratay hal kulliyad labada dhinacba. Dooro kulliyad kale dhanka midig si aad u hesho isbarbardhig dhab ah.`;
  } else if (recommended === "a") {
    verdictTitle = `${nameA} ayaa kuugu habboon (${scoreA}% vs ${scoreB}%)`;
    verdictBody = `Marka la eego miisaanka aad dooratay, ${nameA} waxay ku hoggaaminaysaa ${scoreA - scoreB}% dhibcood. Waxay leedahay ${fa.depts.length} waaxood iyo shaqooyin ay ka mid yihiin ${fa.jobs.so.slice(0, 2).join(", ")}.`;
  } else if (recommended === "b") {
    verdictTitle = `${nameB} ayaa kuugu habboon (${scoreB}% vs ${scoreA}%)`;
    verdictBody = `Marka la eego miisaanka aad dooratay, ${nameB} waxay ku hoggaaminaysaa ${scoreB - scoreA}% dhibcood. Waxay leedahay ${fb.depts.length} waaxood iyo shaqooyin ay ka mid yihiin ${fb.jobs.so.slice(0, 2).join(", ")}.`;
  } else if (ma?.inPool && mb?.inPool) {
    verdictTitle = `Way isku dhow yihiin (${scoreA}% vs ${scoreB}%)`;
    verdictBody = `${nameA} iyo ${nameB} aad ayay isugu dhow yihiin natiijadaada. Go'aanka waxaa kala saari doona tayada jaamacadda iyo deegaanka shaqada aad jeceshahay.`;
  }

  return {
    scoreA,
    scoreB,
    recommended,
    interestWinner,
    aptitudeWinner,
    conditionsWinner,
    verdictTitle,
    verdictBody,
    hybridComboNote: buildHybridAdvice(fa, fb, nameA, nameB),
    decisionQuestions: [
      `Magaaladaada ama dalkaaga gudihiisa, ${nameA} vs ${nameB} tee fursado tababar (internship) oo degdeg ah leh?`,
      `Maaddooyinka aasaasiga ah ee Sanadka 1aad (${fa.depts[0] ?? nameA} vs ${fb.depts[0] ?? nameB}), tee kuu fudud inaad maalin kasta 2 saacadood barato?`,
      `Haddii aad qalin-jabiso 4 sano kadib adigoon waqti badan haysan, shaqada ${fa.jobs.so[0] ?? nameA} vs ${fb.jobs.so[0] ?? nameB} tee u dhow nolosha aad rabto?`,
    ],
  };
}
