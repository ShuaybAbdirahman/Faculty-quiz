export type SchoolSubjectGroup = "science" | "language" | "social" | "applied";

export interface PdfSlot {
  id: string;
  title: string;
  kind: "past_papers" | "summary" | "formulas";
  description: string;
  statusText: string;
}

export interface PredictQuestion {
  id: string;
  topic: string;
  part?: "part1_mcq" | "part2_structured";
  marks?: number;
  pastPaperYear?: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface OfficialExamBlueprint {
  questionScale: string;
  part1Label: string;
  part2Label: string;
  totalMarks: number;
  pastPaperPolicy: string;
}

export interface Form4Subject {
  id: string;
  code: string;
  name: string;
  group: SchoolSubjectGroup;
  groupLabel: string;
  accent: string;
  examDate: string;
  summary: string;
  freeTopics: string[];
  freeExamTip: string;
  pdfs: PdfSlot[];
  predictDurationMin: number;
  predictPrice: string;
  examBlueprint: OfficialExamBlueprint;
  predictQuestions: PredictQuestion[];
}

export const FORM4_EXAM_DATE = "June 2027";

export const NATIONAL_EXAM_BLUEPRINT: OfficialExamBlueprint = {
  questionScale: "40 ilaa 50 su'aalood",
  part1Label: "Qaybta 1aad: Goobo-gelin (MCQ)",
  part2Label: "Qaybta 2aad: Xallin & Qoraal Kooban",
  totalMarks: 100,
  pastPaperPolicy: "Xulashada imtixaannadii hore (Form 4) · Qish ma ahan.",
};

export const FORM4_GROUPS: { id: "all" | SchoolSubjectGroup; label: string }[] = [
  { id: "all", label: "Dhammaan (12)" },
  { id: "science", label: "Sayniska (4)" },
  { id: "language", label: "Luqadaha (3)" },
  { id: "social", label: "Bulshada (2)" },
  { id: "applied", label: "Ganacsi, Tech & Tarbiyo (3)" },
];

export const form4Subjects: Form4Subject[] = [
  // ---- 4 SCIENTIFIC SUBJECTS ----
  {
    id: "bio",
    code: "BIO",
    name: "Bayoolaji (Biology)",
    group: "science",
    groupLabel: "Saynis · Form 4",
    accent: "#16A34A",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "chem",
    code: "CHM",
    name: "Kimistari (Chemistry)",
    group: "science",
    groupLabel: "Saynis · Form 4",
    accent: "#0284C7",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "phys",
    code: "PHY",
    name: "Fiisigis (Physics)",
    group: "science",
    groupLabel: "Saynis · Form 4",
    accent: "#2563EB",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "math",
    code: "MTH",
    name: "Xisaab (Mathematics)",
    group: "science",
    groupLabel: "Saynis · Form 4",
    accent: "#4189DD",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },

  // ---- 3 LANGUAGES (SO, ENG, ARAB) ----
  {
    id: "so",
    code: "SOM",
    name: "Af-Soomaali",
    group: "language",
    groupLabel: "Luqad · Form 4",
    accent: "#0D9488",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "en",
    code: "ENG",
    name: "Ingiriisi (English)",
    group: "language",
    groupLabel: "Luqad · Form 4",
    accent: "#0369A1",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "ar",
    code: "ARB",
    name: "Carabi (Arabic)",
    group: "language",
    groupLabel: "Luqad · Form 4",
    accent: "#0F766E",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },

  // ---- 2 SOCIAL SCIENCES ----
  {
    id: "hist",
    code: "HIS",
    name: "Taariikh (History)",
    group: "social",
    groupLabel: "Bulsho · Form 4",
    accent: "#D97706",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "geo",
    code: "GEO",
    name: "Juqraafi (Geography)",
    group: "social",
    groupLabel: "Bulsho · Form 4",
    accent: "#15803D",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },

  // ---- 3 APPLIED SUBJECTS (BUSINESS, TECH, TARBIYA) ----
  {
    id: "bus",
    code: "BUS",
    name: "Ganacsiga (Business)",
    group: "applied",
    groupLabel: "Ganacsi · Form 4",
    accent: "#059669",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "tech",
    code: "TEC",
    name: "Tiknoolajiyad (Technology)",
    group: "applied",
    groupLabel: "Tech · Form 4",
    accent: "#1D4ED8",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
  {
    id: "isl",
    code: "TRB",
    name: "Tarbiyo (Islamic Studies)",
    group: "applied",
    groupLabel: "Tarbiyo · Form 4",
    accent: "#B45309",
    examDate: FORM4_EXAM_DATE,
    summary: "",
    freeTopics: [],
    freeExamTip: "",
    pdfs: [],
    predictDurationMin: 60,
    predictPrice: "$0.50",
    examBlueprint: NATIONAL_EXAM_BLUEPRINT,
    predictQuestions: [],
  },
];

export function getForm4Subject(id: string): Form4Subject {
  return form4Subjects.find((s) => s.id === id) ?? form4Subjects[0];
}
