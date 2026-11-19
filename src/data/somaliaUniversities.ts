import type { LocalizedString } from "./quizData";

export interface SomaliaUniversity {
  id: string;
  name: string;
  city: string;
  type: "public" | "private";
  website: string;
  facultyIds: string[];
  note: LocalizedString;
}

export const somaliaUniversitiesDisclaimer: LocalizedString = {
  so: "Xogtan waa hage guud oo ka kooban macluumaadka dadweynaha u furan ee jaamacadaha Soomaaliya. Hagaha Kulliyadda ma aha wakiil rasmi ah ee jaamacadahan; fadlan ka eeg khidmadda iyo shuruudaha rasmiga ah bogga jaamacadda.",
  en: "This is an independent public directory compiled from publicly available university information. Faculty Guide is not officially affiliated with these institutions; check each university's official website for current fees and admissions.",
  ar: "هذا دليل عام مستقل مبني على المعلومات المتاحة للجمهور عن الجامعات الصومالية. دليل الكليات ليس وكيلاً رسمياً لهذه الجامعات؛ يرجى مراجعة الموقع الرسمي لكل جامعة للرسوم وشروط القبول.",
};

export const somaliaUniversities: SomaliaUniversity[] = [
  {
    id: "snu",
    name: "Jaamacadda Ummadda Soomaaliyeed (SNU)",
    city: "Muqdisho",
    type: "public",
    website: "https://snu.edu.so",
    facultyIds: ["med", "eng", "law", "econ", "edu", "agri", "vet", "sci", "arts", "pol"],
    note: {
      so: "Jaamacadda qaranka ee dowladda; gelitaankeedu wuxuu ku xiran yahay imtixaan tartan ah oo shahaadada dugsiga sare.",
      en: "Somalia's national public university; admission is based on competitive national entrance examinations.",
      ar: "الجامعة الوطنية الحكومية في الصومال؛ يعتمد القبول على امتحانات القبول التنافسية.",
    },
  },
  {
    id: "simad",
    name: "SIMAD University",
    city: "Muqdisho",
    type: "private",
    website: "https://simad.edu.so",
    facultyIds: ["cs", "econ", "med", "health", "eng", "law", "edu", "pol"],
    note: {
      so: "Waxay caan ku tahay maamulka ganacsiga, teknoolajiyadda (Computing), caafimaadka, iyo sharciga.",
      en: "Known for Business & Economics, Computing, Medicine & Health Sciences, Engineering, and Law.",
      ar: "معروفة بكليات الاقتصاد والإدارة والحاسوب والطب والهندسة والقانون.",
    },
  },
  {
    id: "mu",
    name: "Mogadishu University",
    city: "Muqdisho",
    type: "private",
    website: "https://mu.edu.so",
    facultyIds: ["cs", "eng", "med", "health", "econ", "law", "edu", "arts", "pol"],
    note: {
      so: "Mid ka mid ah jaamacadaha ugu faca weyn ee gaarka loo leeyahay, lehna kulliyado ballaaran oo Carabi iyo Ingiriisi ah.",
      en: "One of Somalia's oldest private universities, offering broad programs in English and Arabic.",
      ar: "من أعرق الجامعات الخاصة في الصومال وتقدم برامج متنوعة بالإنجليزية والعربية.",
    },
  },
  {
    id: "bu",
    name: "Benadir University",
    city: "Muqdisho",
    type: "private",
    website: "https://bu.edu.so",
    facultyIds: ["med", "dent", "pharm", "health", "eng", "cs", "vet", "agri", "econ", "edu"],
    note: {
      so: "Waxaa si gaar ah loogu yaqaan kulliyadaha caafimaadka (Medicine, Dentistry, Pharmacy) iyo injineernimada.",
      en: "Widely recognized for Medicine, Dentistry, Pharmacy, Health Sciences, and Engineering.",
      ar: "تشتهر بكليات الطب وطب الأسنان والصيدلة والعلوم الصحية والهندسة.",
    },
  },
  {
    id: "just",
    name: "Jamhuriya University of Science & Technology (JUST)",
    city: "Muqdisho",
    type: "private",
    website: "https://just.edu.so",
    facultyIds: ["cs", "eng", "med", "health", "econ", "edu"],
    note: {
      so: "Waxay xoogga saartaa sayniska, teknoolajiyadda (Computer Applications & Networking), injineernimada, iyo caafimaadka.",
      en: "Strong focus on Computer Science, Civil & Electrical Engineering, Medicine, and Health Sciences.",
      ar: "تركز بقوة على علوم الحاسوب والهندسة المدنية والكهربائية والطب والعلوم الصحية.",
    },
  },
  {
    id: "hormuud",
    name: "Hormuud University",
    city: "Muqdisho",
    type: "private",
    website: "https://hu.edu.so",
    facultyIds: ["cs", "eng", "econ", "agri", "arts", "sci"],
    note: {
      so: "Waxay bixisaa barnaamijyo injineernimo (Electrical, Telecom, Civil), Kombiyuutar, iyo Dhaqaale.",
      en: "Offers Electrical, Telecom, and Civil Engineering alongside Computer Science and Economics.",
      ar: "تقدم برامج الهندسة الكهربائية والاتصالات والمدنية وعلوم الحاسوب والاقتصاد.",
    },
  },
  {
    id: "uoh",
    name: "University of Hargeisa (UoH)",
    city: "Hargeysa",
    type: "public",
    website: "https://uoh-edu.net",
    facultyIds: ["cs", "eng", "med", "health", "law", "econ", "agri", "vet", "edu", "sci", "pol"],
    note: {
      so: "Jaamacadda ugu weyn ee dadweynaha ee Hargeysa, bixisana in ka badan 10 kulliyadood oo kala duwan.",
      en: "Major public university in Hargeisa offering Medicine, Engineering, ICT, Law, Agriculture, and Veterinary Science.",
      ar: "الجامعة الحكومية الكبرى في هرجيسا وتضم أكثر من عشر كليات متنوعة.",
    },
  },
  {
    id: "amoud",
    name: "Amoud University",
    city: "Boorama",
    type: "public",
    website: "https://amouduniversity.org",
    facultyIds: ["med", "dent", "pharm", "health", "eng", "cs", "agri", "econ", "edu", "law"],
    note: {
      so: "Mid ka mid ah jaamacadaha ugu tayada fiican ee caafimaadka, ilkaha, beeraha, iyo waxbarashada.",
      en: "Well-known public university recognized for Medicine, Dentistry, Agriculture, and Education.",
      ar: "جامعة حكومية مرموقة تشتهر بالطب وطب الأسنان والزراعة والتربية.",
    },
  },
  {
    id: "psu",
    name: "Puntland State University (PSU)",
    city: "Garowe",
    type: "public",
    website: "https://psu.edu.so",
    facultyIds: ["cs", "econ", "law", "health", "pol", "edu", "agri"],
    note: {
      so: "Jaamacadda ugu weyn Garowe, bixisa IT, Dhaqaalaha, Sharciga, Caafimaadka Bulshada, iyo Siyaasadda.",
      en: "Leading public university in Garowe offering IT, Economics, Law, Public Health, and Public Administration.",
      ar: "الجامعة الرئيسية في غروي وتقدم تقنية المعلومات والاقتصاد والقانون والصحة العامة.",
    },
  },
  {
    id: "eau",
    name: "East Africa University (EAU)",
    city: "Boosaaso / Garowe / Galkacyo",
    type: "private",
    website: "https://eau.edu.so",
    facultyIds: ["med", "health", "eng", "cs", "econ", "law", "edu", "vet", "agri"],
    note: {
      so: "Waxay xarumo ku leedahay magaalooyin badan oo Puntland ah, bixisana caafimaadka, injineernimada, iyo IT.",
      en: "Multi-campus university across Puntland offering Medicine, Engineering, Computer Science, and Business.",
      ar: "جامعة متعددة الفروع تقدم الطب والهندسة وعلوم الحاسوب وإدارة الأعمال.",
    },
  },
  {
    id: "ku",
    name: "Kismayo University",
    city: "Kismaayo",
    type: "private",
    website: "https://kismayouniversity.edu.so",
    facultyIds: ["cs", "econ", "health", "edu", "agri", "law"],
    note: {
      so: "Jaamacadda ugu weyn Kismaayo, bixisa Kombiyuutarka, Dhaqaalaha, Caafimaadka Bulshada, iyo Beeraha.",
      en: "Leading university in Kismayo offering Computer Science, Economics, Health Sciences, and Agriculture.",
      ar: "الجامعة الرائدة في كيسمايو وتقدم علوم الحاسوب والاقتصاد والعلوم الصحية والزراعة.",
    },
  },
  {
    id: "ub",
    name: "University of Southern Somalia (USS) / Baidoa",
    city: "Baydhabo",
    type: "private",
    website: "https://uss.edu.so",
    facultyIds: ["cs", "econ", "health", "edu", "agri", "pol"],
    note: {
      so: "Waxay u adeegtaa ardayda Koonfur Galbeed iyadoo bixisa IT, Maamulka, Caafimaadka, iyo Beeraha.",
      en: "Serves South West State students with Computer Science, Business, Health, Education, and Agriculture.",
      ar: "تخدم طلاب جنوب غرب الصومال ببرامج الحاسوب والإدارة والصحة والزراعة.",
    },
  },
];

export function getUniversitiesForFaculty(facultyId: string): SomaliaUniversity[] {
  return somaliaUniversities.filter((u) => u.facultyIds.includes(facultyId));
}
