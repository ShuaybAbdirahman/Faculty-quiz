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
    id: "founder",
    tag: { so: "Aasaasaha", en: "Founder", ar: "المؤسس" },
    text: {
      so: "Aasaasaha: Shuceyb Cabdiraxmaan",
      en: "Founder: Shuceyb Abdirahman",
      ar: "المؤسس: شعيب عبد الرحمن",
    },
    accent: "gold",
  },
  {
    id: "faculties_count",
    tag: { so: "Kulliyadaha", en: "Faculties", ar: "الكليات" },
    text: {
      so: "Tirada kulliyadaha: 14",
      en: "Total faculties: 14",
      ar: "عدد الكليات: ١٤ كلية",
    },
    accent: "sky",
  },
  {
    id: "app_promo",
    tag: { so: "Hagaha Kulliyadda", en: "Faculty Guide", ar: "دليل الكليات" },
    text: {
      so: "Ogoow kulliyaddaada · 3 daqiiqo",
      en: "Find your faculty · 3 minutes",
      ar: "اكتشف كليتك · ٣ دقائق",
    },
    accent: "violet",
  },
  {
    id: "pro_price",
    tag: { so: "Pro", en: "Pro", ar: "Pro" },
    text: {
      so: "Qiimaha Pro: $0.10 · Abid",
      en: "Pro price: $0.10 · Lifetime",
      ar: "سعر Pro: 0.10$ · مدى الحياة",
    },
    accent: "gold",
  },
  {
    id: "somali_free",
    tag: { so: "Luqadda", en: "Language", ar: "اللغة" },
    text: {
      so: "Af-Soomaaliga: 100% Bilaash",
      en: "Somali: 100% Free",
      ar: "الصومالية: مجانية 100%",
    },
    accent: "emerald",
  },
  {
    id: "pro_70_questions",
    tag: { so: "Pro Waaxaha", en: "Pro Guide", ar: "دليل Pro" },
    text: {
      so: "Su'aalaha Pro: 70 Su'aalood",
      en: "Pro questions: 70 tailored",
      ar: "أسئلة Pro: ٧٠ سؤالاً",
    },
    accent: "violet",
  },
  {
    id: "roadmaps_skills",
    tag: { so: "Xirfado", en: "Skills", ar: "مهارات" },
    text: {
      so: "AI, Video Editing & Design",
      en: "AI, Video Editing & Design",
      ar: "الذكاء الاصطناعي والمونتاج والتصميم",
    },
    accent: "sky",
  },
  {
    id: "private_result",
    tag: { so: "Qarsoodi", en: "Private", ar: "سري" },
    text: {
      so: "Natiijada: Qarsoodi ilaa dhamaadka",
      en: "Result: Hidden until finish",
      ar: "النتيجة: سرية حتى النهاية",
    },
    accent: "rose",
  },
  {
    id: "viral_card",
    tag: { so: "Wadaag", en: "Share", ar: "مشاركة" },
    text: {
      so: "Kaar Status & TikTok (9:16)",
      en: "Status & TikTok Card (9:16)",
      ar: "بطاقة واتساب وتيك توك (9:16)",
    },
    accent: "gold",
  },
  {
    id: "universities_jobs",
    tag: { so: "Xarunta Pro", en: "Pro Hub", ar: "مركز Pro" },
    text: {
      so: "Jaamacadaha Soomaaliya & Deeqaha",
      en: "Somalia Universities & Scholarships",
      ar: "جامعات الصومال والمنح الدراسية",
    },
    accent: "sky",
  },
];

export function buildHeroTickerSlides(now: Date = new Date()): HeroTickerSlide[] {
  const fridaySlide = getFridaySalawatSlide(now);
  return fridaySlide ? [fridaySlide, ...baseHeroSlides] : [...baseHeroSlides];
}
