export type StudentStream = "science" | "arts" | "tech";

export interface SubjectScoreInput {
  id: string;
  label: string;
  score: number;
}

export interface GradeInsight {
  averagePct: number;
  gpa4: number;
  letter: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";
  tierTitle: string;
  summary: string;
  eligibleFaculties: string[];
  scholarshipReady: boolean;
}

export function calculateGradeInsight(
  scores: SubjectScoreInput[],
  stream: StudentStream
): GradeInsight {
  const valid = scores.map((s) => Math.min(100, Math.max(0, Number.isFinite(s.score) ? s.score : 0)));
  const avg = valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  const averagePct = Math.round(avg * 10) / 10;
  const gpa4 = Math.round(Math.min(4.0, Math.max(0, (averagePct / 100) * 4.0)) * 100) / 100;

  let letter: GradeInsight["letter"] = "D";
  if (averagePct >= 90) letter = "A+";
  else if (averagePct >= 82) letter = "A";
  else if (averagePct >= 75) letter = "B+";
  else if (averagePct >= 68) letter = "B";
  else if (averagePct >= 60) letter = "C+";
  else if (averagePct >= 50) letter = "C";

  const scholarshipReady = averagePct >= 82;

  const streamFaculties: Record<StudentStream, { high: string[]; mid: string[]; base: string[] }> = {
    science: {
      high: ["Dhakhtarnimada (Medicine)", "Injineerinka (Engineering)", "Sayniska Kombuyuutarka & AI", "Farmashiyaha"],
      mid: ["Sayniska Caafimaadka", "Sayniska Kombuyuutarka & IT", "Beeraha & Deegaanka", "Sayniska Dabiiciga ah"],
      base: ["Waxbarashada Sayniska", "Sayniska Dabiiciga ah", "Beeraha & Deegaanka"],
    },
    tech: {
      high: ["Sayniska Kombuyuutarka & AI", "Injineerinka Software & Koronto", "Dhaqaalaha & Xisaabaadka"],
      mid: ["Sayniska Kombuyuutarka & IT", "Dhaqaalaha & Maaraynta", "Farshaxanka & Warbaahinta Dijitaalka"],
      base: ["Tiknoolajiyada IT-ga", "Maaraynta Ganacsiga", "Warbaahinta"],
    },
    arts: {
      high: ["Shari'ada iyo Sharciga", "Siyaasadda & Maamulka Dadweynaha", "Dhaqaalaha & Maaraynta", "Warbaahinta"],
      mid: ["Dhaqaalaha & Maaraynta", "Waxbarashada", "Siyaasadda & Maamulka", "Farshaxanka & Aadanaha"],
      base: ["Waxbarashada", "Farshaxanka & Warbaahinta", "Maamulka Bulshada"],
    },
  };

  const bank = streamFaculties[stream];
  let tierTitle = "Heerka Aasaasiga ah";
  let summary =
    "Waxaad haysataa fursad aad ku xoojiso maaddooyinka muhiimka ah inta ka dhiman imtixaanka si aad kor ugu qaaddo celceliskaaga.";
  let eligibleFaculties = bank.base;

  if (averagePct >= 85) {
    tierTitle = "Heerka Tartanka Sare & Deeqaha";
    summary =
      "Celceliskaagu wuxuu ku jiraa kaalmaha ugu sarreeya ee tartanka JUS, kulliyadaha adag, iyo deeqaha waxbarasho.";
    eligibleFaculties = bank.high;
  } else if (averagePct >= 70) {
    tierTitle = "Heerka Kalsoonida & Xulashada Wanaagsan";
    summary =
      "Natiijo aad u wanaagsan! Waxaad u furan tahay kulliyado badan oo tayo leh, xoogaa dadaal ah ayaana ku gaarsiinaya 85%+.";
    eligibleFaculties = bank.mid;
  }

  return {
    averagePct,
    gpa4,
    letter,
    tierTitle,
    summary,
    eligibleFaculties,
    scholarshipReady,
  };
}

export const DEFAULT_GRADE_SUBJECTS: Record<StudentStream, SubjectScoreInput[]> = {
  science: [
    { id: "bio", label: "Biology (Bayoolaji)", score: 86 },
    { id: "chem", label: "Chemistry (Kiimiko)", score: 82 },
    { id: "phys", label: "Physics (Fiisigis)", score: 80 },
    { id: "math", label: "Mathematics (Xisaab)", score: 84 },
    { id: "eng", label: "English (Ingiriisi)", score: 85 },
  ],
  tech: [
    { id: "math", label: "Mathematics (Xisaab)", score: 88 },
    { id: "phys", label: "Physics (Fiisigis)", score: 82 },
    { id: "eng", label: "English (Ingiriisi)", score: 86 },
    { id: "it", label: "Computer / Tech", score: 90 },
    { id: "som", label: "Af-Soomaali", score: 84 },
  ],
  arts: [
    { id: "som", label: "Af-Soomaali", score: 88 },
    { id: "ar", label: "Carabi & Tarbiyo", score: 85 },
    { id: "hist", label: "Taariikh & Juqraafi", score: 82 },
    { id: "eng", label: "English (Ingiriisi)", score: 80 },
    { id: "math", label: "Mathematics (Xisaab)", score: 76 },
  ],
};

export interface StudyBlock {
  id: string;
  day: string;
  focus: string;
  durationMin: number;
  tip: string;
}

export const WEEKLY_STUDY_BLUEPRINT: StudyBlock[] = [
  {
    id: "sat",
    day: "Sabti",
    focus: "Xisaab & Fiisigis (Xallinta Su'aalaha)",
    durationMin: 90,
    tip: "Ku bilow 20 daqiiqo oo dib-u-eegis ah, kadibna xalli 10 su'aalood adigoon eegin jawaabta.",
  },
  {
    id: "sun",
    day: "Axad",
    focus: "Biology & Chemistry (Jaantusyada & Fikradaha)",
    durationMin: 90,
    tip: "Sawir hababka muhiimka ah oo ku sharax Af-Soomaali kooban si maskaxdu u xasuusato.",
  },
  {
    id: "mon",
    day: "Isniin",
    focus: "English & Akhris Faham (Reading + Grammar)",
    durationMin: 60,
    tip: "Akhri hal maqaal oo kooban oo qor 5 erey oo cusub iyo jumladooda.",
  },
  {
    id: "tue",
    day: "Talaado",
    focus: "Imtixaan Tijaabo ah (Timed Predict Practice)",
    durationMin: 75,
    tip: "Saacadda iska xir: 45 daqiiqo imtixaan, 30 daqiiqo saxidda khaladaadka.",
  },
  {
    id: "wed",
    day: "Arbaco",
    focus: "Af-Soomaali, Taariikh & Tarbiyo",
    durationMin: 60,
    tip: "Soo koob cutub kasta adigoo qoraya 3 qodob oo fure ah.",
  },
  {
    id: "thu",
    day: "Khamiis",
    focus: "Xirfadda Mustaqbalka (AI, Design ama Coding)",
    durationMin: 60,
    tip: "Hal saac oo xirfad casri ah toddobaadkiiba waxay ku siinaysaa faa'iido weyn jaamacadda.",
  },
];

export interface ProInterviewItem {
  id: string;
  question: string;
  whyAsked: string;
  winningAnswerTip: string;
}

export const PRO_INTERVIEW_PREP: ProInterviewItem[] = [
  {
    id: "why-faculty",
    question: "Maxaad u dooratay kulliyaddan, maxaadse ku soo kordhin kartaa?",
    whyAsked: "Waxay hubiyaan inaad fahansan tahay waxa kulliyaddu tahay iyo haddii aad leedahay hadaf cad.",
    winningAnswerTip:
      "Isku xir xirfaddaada dabiiciga ah, baahida ka jirta Soomaaliya, iyo hal mashruuc ama yool cad oo aad rabto inaad gaarto 4 sano kadib.",
  },
  {
    id: "weakness-growth",
    question: "Sheeg caqabad waxbarasho oo ku soo martay iyo sidaad uga gudubtay.",
    whyAsked: "Waxay eegaan adkeysigaaga iyo qaabka aad wax u xalliso marka culays yimaado.",
    winningAnswerTip:
      "Sheeg caqabad dhab ah oo yar (tusaale: maareynta waqtiga xisaabta), kadibna xoogga saar nidaamka aad samaysay ee natiijada beddelay.",
  },
  {
    id: "scholarship-impact",
    question: "Haddii aad hesho deeqdan waxbarasho, sidee bay bulshadaadu uga faa'iidaysan doontaa?",
    whyAsked: "Deeqaha caalamiga ah waxay maalgeliyaan arday dib u dhisa bulshadooda.",
    winningAnswerTip:
      "Magacaw hal dhibaato oo deegaankaaga ka jirta (caafimaad, waxbarasho, tamarta, ama tiknoolajiyada) oo sharax sida aqoontaadu xal ugu noqonayso.",
  },
];
