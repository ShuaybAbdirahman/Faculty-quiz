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
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
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
  predictQuestions: PredictQuestion[];
}

export const FORM4_EXAM_DATE = "June 2027";

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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
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
    predictDurationMin: 15,
    predictPrice: "$0.10",
    predictQuestions: [],
  },
];

export function getForm4Subject(id: string): Form4Subject {
  return form4Subjects.find((s) => s.id === id) ?? form4Subjects[0];
}
