import type { LocalizedString } from "../data/quizData";

export type TickerAccent = "emerald" | "gold" | "sky" | "violet" | "rose";

export interface HeroTickerSlide {
  id: string;
  tag: LocalizedString;
  text: LocalizedString;
  arabicLine?: string;
  accent: TickerAccent;
}

/**
 * Automatic Friday Eve / Friday Day Salawat reminder:
 * - Thursday >= 18:00 through Friday < 07:00 => Friday Night ("Caawa waa habeen Jimce ah...")
 * - Friday >= 07:00 through Friday < 18:00   => Friday Day ("Maanta waa maalin Jimce ah...")
 * - All other times                          => null
 */
export function getFridaySalawatSlide(now: Date = new Date()): HeroTickerSlide | null {
  const day = now.getDay(); // 4 = Thursday, 5 = Friday
  const hour = now.getHours();

  const isFridayNight = (day === 4 && hour >= 18) || (day === 5 && hour < 7);
  const isFridayDay = day === 5 && hour >= 7 && hour < 18;

  if (isFridayNight) {
    return {
      id: "friday_night_salawat",
      tag: {
        so: "Habeenka Jimcaha",
        en: "Friday Night",
        ar: "ليلة الجمعة",
      },
      text: {
        so: "Caawa waa habeen Jimce ah, ku salli Nabiga (SCW)",
        en: "Tonight is Friday night, send blessings upon the Prophet (PBUH)",
        ar: "الليلة ليلة الجمعة، صلّوا على النبي ﷺ",
      },
      arabicLine: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ",
      accent: "emerald",
    };
  }

  if (isFridayDay) {
    return {
      id: "friday_day_salawat",
      tag: {
        so: "Maalinta Jimcaha",
        en: "Blessed Friday",
        ar: "يوم الجمعة",
      },
      text: {
        so: "Maanta waa maalin Jimce ah, ku salli Nabiga (SCW)",
        en: "Today is Friday, send blessings upon the Prophet (PBUH)",
        ar: "اليوم يوم الجمعة، أكثروا من الصلاة على النبي ﷺ",
      },
      arabicLine: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ ﷺ",
      accent: "emerald",
    };
  }

  return null;
}

export const baseHeroSlides: HeroTickerSlide[] = [
  {
    id: "hiraal_brand",
    tag: { so: "HIRAAL", en: "HIRAAL", ar: "هيرال" },
    text: {
      so: "School · Diyaarinta Jaamacadda · University (Hal Meel)",
      en: "School · University Prep · Faculty Guide Platform",
      ar: "المدرسة · الإعداد الجامعي · الجامعة",
    },
    accent: "sky",
  },
  {
    id: "school_june_2027",
    tag: { so: "School", en: "School", ar: "الثانوية" },
    text: {
      so: "Form 4 National Exam (June 2027) · Diyaar",
      en: "Form 4 National Exam (June 2027) · Ready",
      ar: "الامتحان الوطني للثانوية (يونيو ٢٠٢٧)",
    },
    accent: "sky",
  },
  {
    id: "gap_oct_2027",
    tag: { so: "Diyaarinta", en: "Uni Prep", ar: "الإعداد الجامعي" },
    text: {
      so: "Gelitaanka Jaamacadaha: 5 Maado (4 Saynis + EN · Oct 2027)",
      en: "University Entrance: 5 Subjects (4 Science + EN · Oct 2027)",
      ar: "اختبارات القبول الجامعي: 5 مواد (أكتوبر ٢٠٢٧)",
    },
    accent: "emerald",
  },
  {
    id: "predict_exam_price",
    tag: { so: "HIRAAL Pro", en: "HIRAAL Pro", ar: "HIRAAL Pro" },
    text: {
      so: "Toddobaadle $0.50 · Bille $1.20 · Sannadle $5.00",
      en: "Weekly $0.50 · Monthly $1.20 · Yearly $5.00",
      ar: "أسبوعي 0.50$ · شهري 1.20$ · سنوي 5.00$",
    },
    accent: "gold",
  },
  {
    id: "university_guide",
    tag: { so: "University", en: "University", ar: "الجامعة" },
    text: {
      so: "Hagaha Kulliyadda: 14 Kulliyadood (RIASEC)",
      en: "Faculty Guide: 14 University Faculties",
      ar: "دليل الكليات: ١٤ كلية جامعية",
    },
    accent: "violet",
  },
  {
    id: "founder",
    tag: { so: "Aasaasaha", en: "Founder", ar: "المؤسس" },
    text: {
      so: "Aasaasaha HIRAAL: ShuaybAbdirahman",
      en: "HIRAAL Founder: ShuaybAbdirahman",
      ar: "مؤسس هيرال: ShuaybAbdirahman",
    },
    accent: "gold",
  },
  {
    id: "somali_free",
    tag: { so: "Af-Soomaali", en: "Somali Free", ar: "الصومالية مجاناً" },
    text: {
      so: "Af-Soomaaliga: 100% Bilaash (School, Diyaarinta & Uni)",
      en: "Somali Language: 100% Free Across HIRAAL",
      ar: "اللغة الصومالية مجانية ١٠٠٪",
    },
    accent: "emerald",
  },
  {
    id: "pro_70_questions",
    tag: { so: "Pro Waaxaha", en: "Pro Guide", ar: "دليل Pro" },
    text: {
      so: "Su'aalaha Waaxaha HIRAAL Pro: 70 Su'aalood",
      en: "HIRAAL Pro Department Guide: 70 Precision Questions",
      ar: "دليل الأقسام HIRAAL Pro: ٧٠ سؤالاً",
    },
    accent: "violet",
  },
  {
    id: "roadmaps_skills",
    tag: { so: "Xirfado", en: "Skills", ar: "مهارات" },
    text: {
      so: "AI, Video Editing, Design & Khariidadaha",
      en: "AI, Video Editing, Design & Career Roadmaps",
      ar: "الذكاء الاصطناعي والمونتاج والتصميم",
    },
    accent: "sky",
  },
  {
    id: "universities_jobs",
    tag: { so: "HIRAAL Pro Hub", en: "HIRAAL Pro Hub", ar: "مركز HIRAAL Pro" },
    text: {
      so: "Jaamacadaha Soomaaliya, Xisaabiyaha GPA & Dadka Caanka ah",
      en: "Somalia Universities, GPA Planner & 21st-Century Pioneers",
      ar: "جامعات الصومال وحاسبة المعدل وروّاد القرن ٢١",
    },
    accent: "rose",
  },
];

export function buildHeroTickerSlides(now: Date = new Date()): HeroTickerSlide[] {
  const fridaySlide = getFridaySalawatSlide(now);
  return fridaySlide ? [fridaySlide, ...baseHeroSlides] : [...baseHeroSlides];
}
