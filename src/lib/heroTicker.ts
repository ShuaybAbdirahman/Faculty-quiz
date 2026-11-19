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
      so: "Aasaasaha Hagaha Kulliyadda: Shuceyb Cabdiraxmaan",
      en: "Founded by Shuceyb Abdirahman",
      ar: "مؤسس دليل الكليات: شعيب عبد الرحمن",
    },
    accent: "gold",
  },
  {
    id: "faculties_count",
    tag: { so: "14 Kulliyadood", en: "14 Faculties", ar: "١٤ كلية" },
    text: {
      so: "Barnaamijku wuxuu hal mar isku barbardhigaa 14 kulliyadood oo jaamacadeed",
      en: "Compares 14 university faculties in one smart assessment",
      ar: "يقارن التطبيق بين ١٤ كلية جامعية في اختبار ذكي واحد",
    },
    accent: "sky",
  },
  {
    id: "app_promo",
    tag: { so: "Hagaha Kulliyadda", en: "Faculty Guide", ar: "دليل الكليات" },
    text: {
      so: "3 daqiiqo ku ogoow kulliyadda kugu habboon adigoo ku salaynaya xiisahaaga iyo aqoontaada",
      en: "Discover your best-fit university faculty in 3 minutes based on interests and aptitude",
      ar: "اكتشف الكلية الأنسب لك خلال ٣ دقائق بناءً على ميولك وقدراتك",
    },
    accent: "violet",
  },
  {
    id: "pro_price",
    tag: { so: "Pro · $0.10", en: "Pro · $0.10", ar: "Pro · 0.10$" },
    text: {
      so: "Qiimaha Pro waa $0.10 keliya: hal mar bixi, abid ha kuu furnaado",
      en: "Pro costs only $0.10: pay once and keep lifetime access forever",
      ar: "سعر Pro هو 0.10$ فقط: ادفع مرة واحدة واستمتع به مدى الحياة",
    },
    accent: "gold",
  },
  {
    id: "somali_free",
    tag: { so: "Af-Soomaali Bilaash", en: "Somali Free", ar: "الصومالية مجانية" },
    text: {
      so: "Af-Soomaaligu waa bilaash boqolkiiba boqol; Ingiriisiga iyo Carabiguna waa Pro",
      en: "Somali is 100% free forever; English and Arabic unlock in Pro",
      ar: "اللغة الصومالية مجانية للأبد؛ الإنجليزية والعربية ضمن Pro",
    },
    accent: "emerald",
  },
  {
    id: "pro_70_questions",
    tag: { so: "70 Su'aalood (Pro)", en: "70 Pro Questions", ar: "٧٠ سؤالاً دقيقاً" },
    text: {
      so: "Pro waxaa ku jira 70 su'aalood oo gaar ah oo kala saara waaxaha 14-ka kulliyadood",
      en: "Pro includes 70 dedicated precision questions to rank departments across all 14 faculties",
      ar: "يتضمن Pro سبعين سؤالاً مخصصاً لترتيب أنسب الأقسام في جميع الكليات",
    },
    accent: "violet",
  },
  {
    id: "roadmaps_skills",
    tag: { so: "Khariidado & Xirfado", en: "Roadmaps & Skills", ar: "مسارات ومهارات" },
    text: {
      so: "Ka hel khariidadaha AI, Korontada, Caafimaadka iyo xirfadaha Video Editing iyo Design",
      en: "Explore verified AI, Electrical, and Medicine roadmaps plus Video Editing and Design skills",
      ar: "استكشف مسارات الذكاء الاصطناعي والهندسة والطب ومهارات المونتاج والتصميم",
    },
    accent: "sky",
  },
  {
    id: "private_result",
    tag: { so: "Xiiso & Qarsoodi", en: "Private Until Finish", ar: "نتيجة سرية" },
    text: {
      so: "Natiijadaadu waa ay qarsoontahay ilaa dhamaadka si xiisaha imtixaanku u sarreeyo",
      en: "Your predicted faculty stays hidden until the end for a genuine reveal",
      ar: "تبقى نتيجتك سرية حتى نهاية الاختبار لمزيد من التشويق",
    },
    accent: "rose",
  },
  {
    id: "viral_card",
    tag: { so: "Status & TikTok", en: "Status & TikTok", ar: "حالة واتساب وتيك توك" },
    text: {
      so: "Soo degso kaarkaaga 9:16 oo leh QR code dhab ah kuna wadaag WhatsApp Status iyo TikTok",
      en: "Download your 9:16 result card with a real QR code for WhatsApp Status and TikTok",
      ar: "حمّل بطاقة نتيجتك بمقاس 9:16 مع رمز QR حقيقي لمشاركتها على واتساب وتيك توك",
    },
    accent: "gold",
  },
  {
    id: "universities_jobs",
    tag: { so: "Jaamacado & Mustaqbal", en: "Universities & Future", ar: "جامعات ومستقبل" },
    text: {
      so: "Baro jaamacadaha Soomaaliya, wararka shaqooyinka AI (WEF 2025), iyo deeqaha waxbarasho",
      en: "Browse Somalia universities, WEF 2025 AI job trends, and verified global scholarships",
      ar: "تصفح الجامعات الصومالية وتقرير وظائف المستقبل 2025 والمنح الدراسية الرسمية",
    },
    accent: "sky",
  },
];

export function buildHeroTickerSlides(now: Date = new Date()): HeroTickerSlide[] {
  const fridaySlide = getFridaySalawatSlide(now);
  return fridaySlide ? [fridaySlide, ...baseHeroSlides] : [...baseHeroSlides];
}
