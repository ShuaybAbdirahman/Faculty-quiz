import type { PdfSlot, PredictQuestion } from "./schoolForm4Data";
import { somaliaChallenges, readinessChecklist, type SomaliaChallenge, type ReadinessItem } from "./proHubData";

export type { SomaliaChallenge, ReadinessItem };
export { somaliaChallenges, readinessChecklist };

export const GAP_EXAM_DATE = "October 2027";

export interface BridgeExamTrack {
  id: string;
  badge: string;
  title: string;
  examDate: string;
  subtitle: string;
  description: string;
  durationMin: number;
  price: string;
  freeTips: string[];
  pdfs: PdfSlot[];
  predictQuestions: PredictQuestion[];
}

export const bridgeExamTracks: BridgeExamTrack[] = [
  {
    id: "snu_tartanka",
    badge: "Tartanka Jaamacadda Ummadda (JUS)",
    title: "Imtixaanka Tartanka Jaamacadda Ummadda",
    examDate: GAP_EXAM_DATE,
    subtitle: "",
    description: "",
    durationMin: 15,
    price: "$0.10",
    freeTips: [],
    pdfs: [],
    predictQuestions: [],
  },
  {
    id: "uni_placement",
    badge: "Tartanka Jaamacadaha Kale & Deeqaha",
    title: "Imtixaannada Gelitaanka Jaamacadaha",
    examDate: GAP_EXAM_DATE,
    subtitle: "",
    description: "",
    durationMin: 15,
    price: "$0.10",
    freeTips: [],
    pdfs: [],
    predictQuestions: [],
  },
];

export function getBridgeTrack(id: string): BridgeExamTrack {
  return bridgeExamTracks.find((t) => t.id === id) ?? bridgeExamTracks[0];
}
