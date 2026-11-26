import type { OfficialExamBlueprint, PdfSlot, PredictQuestion } from "./schoolForm4Data";
import { somaliaChallenges, readinessChecklist, type SomaliaChallenge, type ReadinessItem } from "./proHubData";

export type { SomaliaChallenge, ReadinessItem };
export { somaliaChallenges, readinessChecklist };

export const GAP_EXAM_DATE = "October 2027";

export const JUS_EXAM_BLUEPRINT: OfficialExamBlueprint = {
  questionScale: "40 ilaa 50 su'aalood",
  part1Label: "Qaybta 1aad: Goobo-gelin (MCQ)",
  part2Label: "Qaybta 2aad: Xallin & Faham",
  totalMarks: 100,
  pastPaperPolicy: "Xulashada imtixaannadii hore (Jaamacadaha & JUS) · Qish ma ahan.",
};

export interface BridgeSubject {
  id: string;
  code: string;
  name: string;
  group: "science" | "language";
  groupLabel: string;
  accent: string;
  examDate: string;
  durationMin: number;
  price: string;
  examBlueprint: OfficialExamBlueprint;
  pdfs: PdfSlot[];
  predictQuestions: PredictQuestion[];
}

/**
 * 5-ta Maado ee Imtixaanka Gelitaanka Jaamacadda Ummadda (JUS) & Jaamacadaha:
 * 4 Maado oo Saynis ah (Bayoolaji, Kimistari, Fiisigis, Xisaab) + Ingiriisi (English).
 */
export const bridgeSubjects: BridgeSubject[] = [
  {
    id: "jus_bio",
    code: "BIO",
    name: "Bayoolaji (Biology)",
    group: "science",
    groupLabel: "Saynis (1/4) · Gelitaan",
    accent: "#16A34A",
    examDate: GAP_EXAM_DATE,
    durationMin: 60,
    price: "$0.50",
    examBlueprint: JUS_EXAM_BLUEPRINT,
    pdfs: [],
    predictQuestions: [],
  },
  {
    id: "jus_chem",
    code: "CHM",
    name: "Kimistari (Chemistry)",
    group: "science",
    groupLabel: "Saynis (2/4) · Gelitaan",
    accent: "#0284C7",
    examDate: GAP_EXAM_DATE,
    durationMin: 60,
    price: "$0.50",
    examBlueprint: JUS_EXAM_BLUEPRINT,
    pdfs: [],
    predictQuestions: [],
  },
  {
    id: "jus_phys",
    code: "PHY",
    name: "Fiisigis (Physics)",
    group: "science",
    groupLabel: "Saynis (3/4) · Gelitaan",
    accent: "#2563EB",
    examDate: GAP_EXAM_DATE,
    durationMin: 60,
    price: "$0.50",
    examBlueprint: JUS_EXAM_BLUEPRINT,
    pdfs: [],
    predictQuestions: [],
  },
  {
    id: "jus_math",
    code: "MTH",
    name: "Xisaab (Mathematics)",
    group: "science",
    groupLabel: "Saynis (4/4) · Gelitaan",
    accent: "#4189DD",
    examDate: GAP_EXAM_DATE,
    durationMin: 60,
    price: "$0.50",
    examBlueprint: JUS_EXAM_BLUEPRINT,
    pdfs: [],
    predictQuestions: [],
  },
  {
    id: "jus_eng",
    code: "ENG",
    name: "Ingiriisi (English)",
    group: "language",
    groupLabel: "Luqadda (5/5) · Gelitaan",
    accent: "#0D9488",
    examDate: GAP_EXAM_DATE,
    durationMin: 60,
    price: "$0.50",
    examBlueprint: JUS_EXAM_BLUEPRINT,
    pdfs: [],
    predictQuestions: [],
  },
];

export interface BridgeExamTrack {
  id: string;
  badge: string;
  title: string;
  examDate: string;
  subtitle: string;
  description: string;
  subjectCount: number;
  subjectSummary: string;
  durationMin: number;
  price: string;
  freeTips: string[];
  pdfs: PdfSlot[];
  predictQuestions: PredictQuestion[];
}

export const bridgeExamTracks: BridgeExamTrack[] = [
  {
    id: "snu_tartanka",
    badge: "Imtixaannada Gelitaanka (Jaamacadaha & JUS)",
    title: "Imtixaanka Gelitaanka Jaamacadda (5 Maado)",
    examDate: GAP_EXAM_DATE,
    subtitle: "",
    description: "",
    subjectCount: 5,
    subjectSummary: "4 Saynis (Bayoolaji, Kimistari, Fiisigis, Xisaab) + Ingiriisi",
    durationMin: 60,
    price: "$0.50",
    freeTips: [],
    pdfs: [],
    predictQuestions: [],
  },
];

export function getBridgeTrack(id: string): BridgeExamTrack {
  return bridgeExamTracks.find((t) => t.id === id) ?? bridgeExamTracks[0];
}

