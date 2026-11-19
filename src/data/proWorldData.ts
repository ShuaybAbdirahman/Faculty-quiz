import type { LocalizedString } from "./quizData";

export interface WorldPioneer {
  id: string;
  name: string;
  facultyId: string;
  facultyLabel: LocalizedString;
  degree: LocalizedString;
  achievement: LocalizedString;
  lesson: LocalizedString;
  sourceName: string;
  sourceUrl: string;
}

export interface FutureJobReport {
  id: string;
  title: LocalizedString;
  growthStat: string;
  facultyTag: LocalizedString;
  summary: LocalizedString;
  somaliaOpportunity: LocalizedString;
  keySkills: string[];
  sourceName: string;
  sourceUrl: string;
}

export interface HighIncomeSkill {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  whyNow: LocalizedString;
  tools: string[];
  monthPlan: LocalizedString[];
  howToEarn: LocalizedString;
  freeResourceName: string;
  freeResourceUrl: string;
}

export interface SomaliaGrowthPillar {
  id: string;
  title: LocalizedString;
  evidenceStat: LocalizedString;
  strategy: LocalizedString[];
  verifiedLinks: { name: string; url: string }[];
  sourceName: string;
}

export const worldFacultyPioneers: WorldPioneer[] = [
  {
    id: "pioneer_hinton",
    name: "Geoffrey Hinton & Fei-Fei Li",
    facultyId: "cs",
    facultyLabel: {
      so: "Kulliyadda Kombiyuutarka iyo AI",
      en: "Computer Science & AI",
      ar: "علوم الحاسوب والذكاء الاصطناعي",
    },
    degree: {
      so: "PhD Sirdoonka Macmalka ah (Edinburgh) & PhD Injineernimada Korontada (Caltech)",
      en: "PhD in AI (Edinburgh) & PhD in Electrical Engineering (Caltech)",
      ar: "دكتوراه في الذكاء الاصطناعي (إدنبرة) والهندسة الكهربائية (كالتك)",
    },
    achievement: {
      so: "Geoffrey Hinton wuxuu ku guulaystay Nobel Prize-ka Fiisigiska 2024 ee shabakadaha neerfaha (Neural Networks); Fei-Fei Li waxay dhistay ImageNet oo furay kacaanka aragga kombiyuutarka casriga ah.",
      en: "Geoffrey Hinton won the 2024 Nobel Prize in Physics for neural networks; Fei-Fei Li created ImageNet, launching modern computer vision.",
      ar: "فاز جيفري هينتون بجائزة نوبل في الفيزياء 2024 للشبكات العصبية، وأنشأت فاي فاي لي قاعدة ImageNet التي أطلقت ثورة الرؤية الحاسوبية.",
    },
    lesson: {
      so: "Aasaaska xisaabta, xogta tayada leh, iyo ku adkaysiga cilmi-baarista ayaa abuura teknoolajiyadda adduunka beddesha.",
      en: "Strong mathematical foundations, quality data, and long-term research persistence build world-changing technology.",
      ar: "الأساس الرياضي القوي وجودة البيانات والمثابرة البحثية تصنع التكنولوجيا التي تغير العالم.",
    },
    sourceName: "NobelPrize.org & Stanford HAI",
    sourceUrl: "https://www.nobelprize.org/prizes/physics/2024/summary/",
  },
  {
    id: "pioneer_hawa",
    name: "Dr. Hawa Abdi (AUN)",
    facultyId: "med",
    facultyLabel: {
      so: "Kulliyadda Caafimaadka iyo Sharciga",
      en: "Medicine & Law",
      ar: "الطب والقانون",
    },
    degree: {
      so: "Dhakhtarnimo (Kyiv Medical Institute) iyo Sharciga (Jaamacadda Ummadda Soomaaliyeed)",
      en: "MD in Gynecology (Kyiv) & Law Degree (Somali National University)",
      ar: "بكالوريوس الطب (كييف) وبكالوريوس القانون (الجامعة الوطنية الصومالية)",
    },
    achievement: {
      so: "Waxay dhistay isbitaal, dugsi, iyo xero nabadgelyo oo badbaadisay in ka badan 90,000 oo qof oo barakacayaal ah, iyadoo loo magacaabay Nobel Peace Prize 2012.",
      en: "Built a hospital, school, and sanctuary that saved over 90,000 displaced people in Somalia, earning a 2012 Nobel Peace Prize nomination.",
      ar: "أسست مستشفى ومدرسة وملاذاً آمناً أنقذ أكثر من 90 ألف نازح في الصومال، ورُشّحت لجائزة نوبل للسلام 2012.",
    },
    lesson: {
      so: "Aqoonta caafimaadka marka lagu daro hoggaamin iyo adeeg bulsho, waxay badbaadisaa naf iyo jiilal dhan.",
      en: "Combining medical expertise with courage and community service can save entire generations.",
      ar: "الجمع بين الطب والقيادة وخدمة المجتمع ينقذ أجيالاً كاملة.",
    },
    sourceName: "The New York Times & Glamour Women of the Year",
    sourceUrl: "https://www.britannica.com/biography/Hawa-Abdi",
  },
  {
    id: "pioneer_tesla_edison",
    name: "Nikola Tesla & Edith Clarke",
    facultyId: "eng",
    facultyLabel: {
      so: "Kulliyadda Injineernimada Korontada",
      en: "Electrical Engineering",
      ar: "الهندسة الكهربائية",
    },
    degree: {
      so: "Injineernimada Korontada (Graz) & MSc Injineernimada Korontada (MIT)",
      en: "Electrical Engineering (Graz) & MSc Electrical Engineering (MIT)",
      ar: "الهندسة الكهربائية (غراتس) وماجستير الهندسة الكهربائية (MIT)",
    },
    achievement: {
      so: "Nikola Tesla wuxuu hindisay nidaamka korontada AC ee maanta adduunka iftiimiya; Edith Clarke waxay ahayd haweeneydii ugu horreysay ee injineer koronto ah ee samaysay xisaabiyaha shabakadaha korontada (Power Grid).",
      en: "Nikola Tesla pioneered the AC power system lighting the world today; Edith Clarke became the first female electrical engineer and invented graphical power-grid analysis.",
      ar: "ابتكر نيكولا تسلا نظام التيار المتردد الذي يضيء العالم، وطوّرت إيديث كلارك طرق تحليل شبكات الطاقة الحديثة.",
    },
    lesson: {
      so: "Fahamka qoto dheer ee tamarta iyo shabakadaha korontada waa furaha warshadaha iyo tamarta qorraxda (Solar) ee Soomaaliya.",
      en: "Deep mastery of electrical grids is the foundation for modern industry and Somalia's rapidly growing solar energy sector.",
      ar: "إتقان هندسة الطاقة والشبكات هو مفتاح الصناعة وقطاع الطاقة الشمسية المتنامي في الصومال.",
    },
    sourceName: "IEEE Spectrum & MIT",
    sourceUrl: "https://ethw.org/Edith_Clarke",
  },
  {
    id: "pioneer_yunus",
    name: "Prof. Muhammad Yunus",
    facultyId: "econ",
    facultyLabel: {
      so: "Kulliyadda Dhaqaalaha iyo Maaliyadda",
      en: "Economics & Finance",
      ar: "الاقتصاد والمالية",
    },
    degree: {
      so: "PhD Dhaqaalaha (Vanderbilt University)",
      en: "PhD in Economics (Vanderbilt University)",
      ar: "دكتوراه في الاقتصاد (جامعة فاندربيلت)",
    },
    achievement: {
      so: "Wuxuu aasaasay Grameen Bank oo malaayiin qof oo sabool ah siiyay maalgelin yar (Microfinance), wuxuuna ku guulaystay Nobel Peace Prize 2006.",
      en: "Founded Grameen Bank, pioneering microfinance for millions of low-income entrepreneurs and winning the 2006 Nobel Peace Prize.",
      ar: "أسس بنك غرامين الرائد في التمويل الأصغر لملايين رواد الأعمال، وفاز بجائزة نوبل للسلام 2006.",
    },
    lesson: {
      so: "Dhaqaalaha dhabta ah ma aha oo keliya xisaab bangi, waa xallinta saboolnimada iyadoo la adeegsanayo nidaam maaliyadeed oo caddaalad ah.",
      en: "Real economics is not just spreadsheets; it is designing inclusive financial systems that lift communities out of poverty.",
      ar: "الاقتصاد الحقيقي هو تصميم أنظمة مالية عادلة تنتشل المجتمعات من الفقر.",
    },
    sourceName: "NobelPrize.org",
    sourceUrl: "https://www.nobelprize.org/prizes/peace/2006/yunus/facts/",
  },
  {
    id: "pioneer_yusuf",
    name: "Judge Abdulqawi Ahmed Yusuf",
    facultyId: "law",
    facultyLabel: {
      so: "Kulliyadda Sharciga iyo Qaanuunka",
      en: "Law & International Justice",
      ar: "القانون والعدالة الدولية",
    },
    degree: {
      so: "LLB (Jaamacadda Ummadda Soomaaliyeed) & PhD Qaanuunka Caalamiga ah (Geneva)",
      en: "LLB (Somali National University) & PhD in International Law (Geneva)",
      ar: "بكالوريوس القانون (الجامعة الوطنية الصومالية) ودكتوراه القانون الدولي (جنيف)",
    },
    achievement: {
      so: "Wuxuu noqday Madaxweynaha Maxkamadda Caddaaladda Adduunka (ICJ) intii u dhaxaysay 2018 ilaa 2021, isagoo ka soo baxay Jaamacadda Ummadda Soomaaliyeed.",
      en: "Served as President of the International Court of Justice (ICJ) from 2018 to 2021 after graduating from Somali National University.",
      ar: "تولى رئاسة محكمة العدل الدولية (ICJ) بين عامي 2018 و2021 بعد تخرجه من الجامعة الوطنية الصومالية.",
    },
    lesson: {
      so: "Arday ka baxay jaamacad gudaha Soomaaliya ah wuxuu gaari karaa kursiga ugu sarreeya ee caddaaladda caalamka marka uu ku dadaalo aqoonta iyo luqadaha.",
      en: "A graduate of a Somali university can reach the highest seat of international justice through academic discipline and language mastery.",
      ar: "خريج جامعة صومالية يستطيع الوصول إلى أعلى منصب قضائي في العالم بالاجتهاد وإتقان اللغات.",
    },
    sourceName: "International Court of Justice (ICJ)",
    sourceUrl: "https://www.icj-cij.org/current-members",
  },
  {
    id: "pioneer_borlaug",
    name: "Dr. Norman Borlaug",
    facultyId: "agri",
    facultyLabel: {
      so: "Kulliyadda Beeraha iyo Deegaanka",
      en: "Agriculture & Food Science",
      ar: "الزراعة وعلوم الغذاء",
    },
    degree: {
      so: "PhD Cudurrada Dhirta iyo Hidde-sidaha (University of Minnesota)",
      en: "PhD in Plant Pathology & Genetics (University of Minnesota)",
      ar: "دكتوراه في أمراض النبات وعلم الوراثة (جامعة مينيسوتا)",
    },
    achievement: {
      so: "Wuxuu hoggaamiyay kacaankii cagaarnaa (Green Revolution) isagoo soo saaray sarreen u adkaysta abaaraha iyo cudurrada, taas oo badbaadisay in ka badan hal bilyan oo qof.",
      en: "Led the Green Revolution by breeding drought- and disease-resistant wheat, credited with saving over one billion lives from famine.",
      ar: "قاد الثورة الخضراء عبر تطوير قمح مقاوم للجفاف والأمراض، مما أنقذ أكثر من مليار إنسان من المجاعة.",
    },
    lesson: {
      so: "Cilmiga beeraha casriga ah iyo waraabka habaysan waa xalka koowaad ee abaaraha iyo sugnaanta cuntada Soomaaliya.",
      en: "Modern agronomy and climate-resilient crops are the single strongest solution to drought and food security in Somalia.",
      ar: "الزراعة الحديثة والمحاصيل المقاومة للجفاف هي الحل الأقوى للأمن الغذائي في الصومال.",
    },
    sourceName: "NobelPrize.org",
    sourceUrl: "https://www.nobelprize.org/prizes/peace/1970/borlaug/biographical/",
  },
  {
    id: "pioneer_tedros",
    name: "Dr. Paul Farmer & WHO Public Health Leaders",
    facultyId: "health",
    facultyLabel: {
      so: "Kulliyadda Caafimaadka Bulshada",
      en: "Public Health",
      ar: "الصحة العامة",
    },
    degree: {
      so: "MD & PhD Anthropology Caafimaadka (Harvard University)",
      en: "MD & PhD in Medical Anthropology (Harvard University)",
      ar: "دكتوراه في الطب والأنثروبولوجيا الطبية (جامعة هارفارد)",
    },
    achievement: {
      so: "Wuxuu aasaasay Partners In Health isagoo caddeeyay in daawaynta cudurrada adag sida TB-da iyo HIV laga hirgelin karo deegaannada dakhligoodu yar yahay iyadoo la tababarayo shaqaale caafimaad oo bulshada ka tirsan.",
      en: "Co-founded Partners In Health, proving that complex care for TB and infectious diseases can succeed in low-resource regions via community health workers.",
      ar: "شارك في تأسيس Partners In Health وأثبت إمكانية تقديم رعاية طبية متقدمة في المناطق محدودة الموارد عبر العاملين الصحيين المجتمعيين.",
    },
    lesson: {
      so: "Caafimaadka bulshada wuxuu diiradda saaraa ka hortagga cudurrada ka hor inta aysan isbitaalka gaarin, waana baahida ugu weyn ee gobollada Soomaaliya.",
      en: "Public health prevents disease at scale before patients ever reach a hospital, making it vital across Somalia.",
      ar: "الصحة العامة تمنع الأمراض على نطاق واسع قبل وصولها للمستشفيات، وهي حاجة ماسة في الصومال.",
    },
    sourceName: "World Health Organization & Partners In Health",
    sourceUrl: "https://www.pih.org/our-founders",
  },
];

export const futureJobsNews: FutureJobReport[] = [
  {
    id: "job_bigdata",
    title: {
      so: "Khubarada Xogta Weyn (Big Data Specialists)",
      en: "Big Data Specialists",
      ar: "متخصصو البيانات الضخمة (Big Data)",
    },
    growthStat: "+113% (2025 - 2030)",
    facultyTag: {
      so: "Kombiyuutarka & Xisaabta",
      en: "CS & Statistics",
      ar: "الحاسوب والإحصاء",
    },
    summary: {
      so: "Sida uu sheegay warbixinta World Economic Forum (Future of Jobs 2025), waa shaqada ugu kororka badan adduunka marka la eego boqolleyda (+113%), maadaama shirkad kasta ay go'aankeeda ku salayso xog.",
      en: "Ranked #1 fastest-growing role globally in percentage terms (+113%) in the WEF Future of Jobs Report 2025 as organizations shift to data-driven decisions.",
      ar: "الوظيفة الأسرع نمواً عالمياً بنسبة (+113%) وفق تقرير المنتدى الاقتصادي العالمي 2025 مع تحول الشركات للقرارات المبنية على البيانات.",
    },
    somaliaOpportunity: {
      so: "Shirkadaha isgaarsiinta, bangiyada, iyo hay'adaha gargaarka ee Soomaaliya waxay si degdeg ah u raadiyaan khubaro falanqeeya xogta (SQL, Python, Power BI).",
      en: "Telecoms, banks, and humanitarian NGOs in Somalia increasingly hire data analysts skilled in SQL, Python, and Power BI.",
      ar: "شركات الاتصالات والبنوك والمنظمات في الصومال تبحث بشدة عن محللي بيانات يتقنون SQL وPython وPower BI.",
    },
    keySkills: ["SQL", "Python", "Power BI", "Data Modeling"],
    sourceName: "WEF Future of Jobs Report 2025",
    sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
  {
    id: "job_fintech",
    title: {
      so: "Injineerrada Maaliyadda Teknoolajiyadda (FinTech Engineers)",
      en: "FinTech Engineers",
      ar: "مهندسو التكنولوجيا المالية (FinTech)",
    },
    growthStat: "+93% (2025 - 2030)",
    facultyTag: {
      so: "Dhaqaalaha & Kombiyuutarka",
      en: "Finance & CS",
      ar: "المالية والحاسوب",
    },
    summary: {
      so: "Kaalinta 2-aad ee adduunka (+93% kobac). Waxay isku xirtaa barnaamijyada lacag-bixinta mobile-ka, bangiyada dijitaalka ah, iyo amniga xawaaladaha.",
      en: "Ranked #2 fastest-growing role worldwide (+93%), combining mobile payments, digital banking systems, and secure financial infrastructure.",
      ar: "المرتبة الثانية عالمياً (+93%) وتجمع بين الدفع عبر الهاتف والبنوك الرقمية وأمن التحويلات المالية.",
    },
    somaliaOpportunity: {
      so: "Soomaaliya waxay ka mid tahay dalalka ugu horreeya Afrika ee isticmaalka lacagta mobile-ka (EVC Plus, ZAAD, Sahal). Xirfaddan waa dahab gudaha dalka.",
      en: "Somalia has one of Africa's highest mobile-money adoption rates (EVC Plus, ZAAD, Sahal), making FinTech talent hugely valuable locally.",
      ar: "الصومال من أعلى دول أفريقيا استخداماً للدفع عبر الهاتف، مما يجعل مهندسي التكنولوجيا المالية مطلوبين جداً محلياً.",
    },
    keySkills: ["Payment APIs", "Cybersecurity", "Accounting Basics", "Cloud"],
    sourceName: "WEF Future of Jobs Report 2025",
    sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
  {
    id: "job_ai_ml",
    title: {
      so: "Khubarada Sirdoonka Macmalka ah (AI & Machine Learning)",
      en: "AI & Machine Learning Specialists",
      ar: "متخصصو الذكاء الاصطناعي وتعلم الآلة",
    },
    growthStat: "+82% (2025 - 2030)",
    facultyTag: {
      so: "Kombiyuutarka & Injineernimada",
      en: "CS & Engineering",
      ar: "الحاسوب والهندسة",
    },
    summary: {
      so: "86% shirkadaha adduunka ee la waraystay waxay sheegeen in AI ay beddeli doonto ganacsigooda ka hor 2030, taas oo abuuraysa baahi ballaaran oo loo qabo injineerrada AI (+82%).",
      en: "86% of surveyed global employers expect AI to transform their business by 2030, driving +82% projected growth in AI & ML specialists.",
      ar: "86% من أصحاب العمل يتوقعون أن يغير الذكاء الاصطناعي أعمالهم بحلول 2030، مع نمو متوقع بنسبة +82% في وظائف الذكاء الاصطناعي.",
    },
    somaliaOpportunity: {
      so: "Waxaad dhisi kartaa barnaamijyo AI ah oo ku hadla Af-Soomaali (caafimaad, waxbarasho, adeegga macaamiisha) ama waxaad u shaqayn kartaa shirkado caalami ah adigoo jooga dalkaaga (Remote).",
      en: "Build Somali-language AI tools for education, healthcare, and customer support, or work remotely for global AI teams.",
      ar: "بناء أدوات ذكاء اصطناعي باللغة الصومالية للتعليم والصحة، أو العمل عن بُعد مع شركات عالمية.",
    },
    keySkills: ["Python", "PyTorch", "LLM APIs", "Linear Algebra"],
    sourceName: "WEF Future of Jobs Report 2025",
    sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
  {
    id: "job_security",
    title: {
      so: "Khubarada Amniga Internetka (Cybersecurity Specialists)",
      en: "Information & Cybersecurity Specialists",
      ar: "متخصصو الأمن السيبراني",
    },
    growthStat: "+53% (2025 - 2030)",
    facultyTag: {
      so: "Kombiyuutarka & Shabakadaha",
      en: "CS & Networking",
      ar: "الحاسوب والشبكات",
    },
    summary: {
      so: "Iyadoo 60% shirkaduhu u guurayaan adeegyo dijitaal ah, ilaalinta xogta bangiyada, isbitaallada, iyo dowladaha waxay kor u qaadday baahida amniga internetka (+53%).",
      en: "With 60% of businesses expanding digital access, protecting banking, hospital, and government data drives +53% growth in security specialists.",
      ar: "مع توسع التحول الرقمي، تزداد الحاجة لحماية بيانات البنوك والمستشفيات والحكومات بنمو متوقع +53%.",
    },
    somaliaOpportunity: {
      so: "Bangiyada Soomaaliya iyo hay'adaha dowladda waxay u baahan yihiin khubaro xaqiijiya amniga shabakadaha iyo nidaamyada lacag-bixinta.",
      en: "Somali banks, telecoms, and public institutions actively need certified network and application security specialists.",
      ar: "البنوك وشركات الاتصالات والمؤسسات الحكومية في الصومال تحتاج بشدة لمتخصصين معتمدين في أمن الشبكات.",
    },
    keySkills: ["Linux", "Networking", "CompTIA Security+", "Ethical Hacking"],
    sourceName: "WEF Future of Jobs Report 2025",
    sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
  {
    id: "job_renewable",
    title: {
      so: "Injineerrada Tamarta Qorraxda & La Cusboonaysiiyo (Renewable Energy)",
      en: "Renewable Energy & Solar Engineers",
      ar: "مهندسو الطاقة المتجددة والشمسية",
    },
    growthStat: "Top Green Role (41% Shift)",
    facultyTag: {
      so: "Injineernimada Korontada",
      en: "Electrical Engineering",
      ar: "الهندسة الكهربائية",
    },
    summary: {
      so: "41% ganacsiyada adduunka waxay sheegeen in teknoolajiyadda tamarta (solar, batariyada, iyo qaybinta korontada) ay dib u qaabayn doonto suuqa ka hor 2030.",
      en: "41% of global businesses expect energy generation and storage technologies to transform operations by 2030, making renewable engineers top green roles.",
      ar: "41% من الشركات تتوقع أن تعيد تقنيات توليد وتخزين الطاقة تشكيل السوق بحلول 2030.",
    },
    somaliaOpportunity: {
      so: "Soomaaliya waxay leedahay cadceed sanadka oo dhan ah; shirkadaha korontada, isbitaallada, iyo beeraha waxay si degdeg ah ugu guurayaan nidaamka Solar-ka iyo batariyada casriga ah.",
      en: "Somalia enjoys year-round sunshine; power utilities, hospitals, and farms are rapidly transitioning to solar microgrids and battery storage.",
      ar: "تتمتع الصومال بشمس ساطعة طوال العام، وتتحول شركات الكهرباء والمستشفيات والمزارع بسرعة إلى الطاقة الشمسية.",
    },
    keySkills: ["Solar PV Sizing", "AutoCAD Electrical", "Inverters & Batteries", "Power Systems"],
    sourceName: "WEF Future of Jobs Report 2025",
    sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
  },
];

export const highIncomeSkills: HighIncomeSkill[] = [
  {
    id: "skill_video",
    title: {
      so: "Tafatirka Muuqaallada (Video Editing & Short-Form)",
      en: "Video Editing & Short-Form Storytelling",
      ar: "مونتاج الفيديو وصناعة المحتوى المرئي",
    },
    category: {
      so: "Hal-abuur & Warbaahin",
      en: "Creative & Media",
      ar: "الإبداع والإعلام",
    },
    whyNow: {
      so: "Ganacsi kasta, macallin kasta, iyo YouTuber kasta wuxuu u baahan yahay muuqaallo tayo leh (Reels, TikTok, YouTube). Waa xirfadda ugu dhaqsaha badan ee arday jaamacadeed lacag kaga samayn karo 60 maalmood gudahood.",
      en: "Every business, educator, and creator needs high-retention Reels, Shorts, and YouTube videos. It is one of the fastest skills a student can monetize within 60 days.",
      ar: "كل شركة وصانع محتوى يحتاج إلى فيديوهات احترافية. إنها من أسرع المهارات التي يمكن للطالب تحقيق دخل منها خلال 60 يوماً.",
    },
    tools: ["DaVinci Resolve (Bilaash)", "CapCut Desktop", "Adobe Premiere Pro"],
    monthPlan: [
      {
        so: "Toddobaadka 1: Baro jarista nadiifta ah, codka (Audio cleanup), iyo qoraalka shaashadda (Captions).",
        en: "Week 1: Master clean pacing cuts, audio cleanup, and readable captions.",
        ar: "الأسبوع 1: إتقان القص السلس وتنقية الصوت وإضافة الترجمة.",
      },
      {
        so: "Toddobaadka 2: Baro midabaynta (Color grading) iyo dhaqaaqa fudud (Keyframes & B-roll).",
        en: "Week 2: Learn color grading, smooth keyframes, and visual B-roll storytelling.",
        ar: "الأسبوع 2: تعلم تصحيح الألوان والحركة السلسة ولقطات الدعم.",
      },
      {
        so: "Toddobaadka 3-4: Samee 5 muuqaal oo tusaale ah (Portfolio) oo la wadaag ganacsiyada maxalliga ah ama Upwork.",
        en: "Weeks 3-4: Build a 5-video sample portfolio and pitch local businesses or global remote clients.",
        ar: "الأسبوع 3-4: أنشئ معرض أعمال من 5 فيديوهات واعرض خدماتك على الشركات المحلية أو منصات العمل الحر.",
      },
    ],
    howToEarn: {
      so: "U samee muuqaallo xayeysiin ah ganacsiyada Muqdisho/Hargeysa/Garowe ($15-$50 halkii muuqaal) ama u shaqee kanaallada YouTube-ka ee caalamiga ah.",
      en: "Edit promo reels for local businesses ($15-$50/video) or work monthly retainers for YouTube creators worldwide.",
      ar: "تعديل فيديوهات إعلانية للشركات المحلية أو العمل بعقود شهرية مع قنوات يوتيوب عالمية.",
    },
    freeResourceName: "Blackmagic Design Official DaVinci Training (Free)",
    freeResourceUrl: "https://www.blackmagicdesign.com/products/davinciresolve/training",
  },
  {
    id: "skill_design",
    title: {
      so: "Naqshadaynta (Graphic Design & UI/UX)",
      en: "Graphic Design & UI/UX (Figma)",
      ar: "التصميم الجرافيكي وتصميم واجهات المستخدم (UI/UX)",
    },
    category: {
      so: "Naqshad & Teknoolajiyad",
      en: "Design & Tech",
      ar: "التصميم والتقنية",
    },
    whyNow: {
      so: "Shirkadaha barnaamijyada (Apps), dukaamada, iyo hay'adaha waxay u baahan yihiin astaamo (Logos), xayeysiisyo, iyo naqshadda app-yada (UI/UX).",
      en: "Startups, shops, and NGOs constantly need brand identities, social graphics, and clean mobile/web UI designs.",
      ar: "الشركات الناشئة والمتاجر والمنظمات تحتاج باستمرار إلى هويات بصرية وتصاميم واجهات تطبيقات ومواقع.",
    },
    tools: ["Figma (Bilaash)", "Canva", "Adobe Illustrator / Photopea"],
    monthPlan: [
      {
        so: "Toddobaadka 1: Baro xeerarka midabka, farta (Typography), iyo kala horreynta aragga (Hierarchy).",
        en: "Week 1: Learn color contrast, typography pairing, and visual hierarchy.",
        ar: "الأسبوع 1: تعلم تباين الألوان وتناسق الخطوط والتسلسل البصري.",
      },
      {
        so: "Toddobaadka 2: Ku celceli Figma adigoo dib u naqshadaynaya 3 bog oo app-yo caan ah.",
        en: "Week 2: Practice Figma by redesigning 3 screens from popular mobile apps.",
        ar: "الأسبوع 2: تدرب على Figma عبر إعادة تصميم 3 شاشات من تطبيقات معروفة.",
      },
      {
        so: "Toddobaadka 3-4: Ku daabac shaqadaada Behance ama Dribbble oo bilow qabashada shaqooyinka naqshadaynta.",
        en: "Weeks 3-4: Publish 3 polished case studies on Behance and start taking client projects.",
        ar: "الأسبوع 3-4: انشر 3 مشاريع متقنة على Behance وابدأ باستقبال طلبات العملاء.",
      },
    ],
    howToEarn: {
      so: "Sameynta boorarka xayeysiinta, astaamaha shirkadaha (Brand Identity), iyo naqshadaynta bogagga website-yada (UI/UX).",
      en: "Sell brand identity packs, social media kits for local businesses, and UI/UX prototypes for software developers.",
      ar: "تقديم باقات الهوية البصرية وتصاميم السوشيال ميديا وتصاميم واجهات التطبيقات للمبرمجين.",
    },
    freeResourceName: "Figma Official Free Design Course",
    freeResourceUrl: "https://help.figma.com/hc/en-us/sections/4405269443991-Figma-for-Beginners",
  },
  {
    id: "skill_web",
    title: {
      so: "Dhisidda Website-yada & Freelancing",
      en: "Web Development & Business Websites",
      ar: "تطوير المواقع والعمل الحر",
    },
    category: {
      so: "Barnaamijyada & Ganacsiga",
      en: "Software & Business",
      ar: "البرمجة والأعمال",
    },
    whyNow: {
      so: "Dugsiyada, isbitaallada, hoteellada, iyo ganacsiyada Soomaaliya intooda badan weli ma laha website casri ah. Hal website oo aad dhisto wuxuu bixin karaa khidmadda simistarkaaga.",
      en: "Many schools, clinics, hotels, and businesses still lack modern websites. Building even one client website can cover a full semester of tuition.",
      ar: "الكثير من المدارس والعيادات والفنادق تحتاج مواقع حديثة. بناء موقع واحد فقط يمكن أن يغطي رسوم فصل دراسي كامل.",
    },
    tools: ["HTML/CSS & Tailwind", "React / Next.js", "WordPress", "GitHub Pages"],
    monthPlan: [
      {
        so: "Toddobaadka 1-2: Baro HTML, CSS, iyo sida website-ku ugu habboonaado taleefanka (Responsive).",
        en: "Weeks 1-2: Master HTML, CSS, and mobile-first responsive layouts.",
        ar: "الأسبوع 1-2: إتقان HTML وCSS والتصميم المتجاوب مع الهاتف.",
      },
      {
        so: "Toddobaadka 3: Dhis website dhab ah oo tusaale u ah isbitaal, dugsi, ama maqaaxi.",
        en: "Week 3: Build a complete demo website for a clinic, school, or restaurant.",
        ar: "الأسبوع 3: ابنِ موقعاً تجريبياً متكاملاً لعيادة أو مدرسة أو مطعم.",
      },
      {
        so: "Toddobaadka 4: Ku soo bandhig GitHub Pages oo u bandhig 10 ganacsi oo xaafaddaada ah.",
        en: "Week 4: Deploy live on GitHub Pages/Vercel and demo it to 10 local businesses.",
        ar: "الأسبوع 4: انشر الموقع مجاناً واعرضه على 10 شركات محلية.",
      },
    ],
    howToEarn: {
      so: "Dhisidda website-yada ganacsiyada ($100-$400) iyo dayactirka bilaha ah ee bogagga shirkadaha.",
      en: "Build local business websites ($100-$400) plus monthly maintenance, or freelance globally on Upwork.",
      ar: "بناء مواقع الشركات المحلية (100-400 دولار) مع صيانة شهرية أو العمل عبر Upwork.",
    },
    freeResourceName: "freeCodeCamp Responsive Web Design (Free)",
    freeResourceUrl: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    id: "skill_ai_auto",
    title: {
      so: "Adeegsiga AI & Otomaatigga Ganacsiga (AI Workflows)",
      en: "AI Productivity & No-Code Automation",
      ar: "أدوات الذكاء الاصطناعي وأتمتة الأعمال",
    },
    category: {
      so: "Teknoolajiyadda Cusub",
      en: "Emerging Tech",
      ar: "التقنية الحديثة",
    },
    whyNow: {
      so: "Ardayda barta sida AI loogu dardargeliyo cilmi-baarista, xisaabaadka, iyo adeegga macaamiisha waxay shaqada ku qabtaan 3 jeer ka dhakhso badan.",
      en: "Students who master AI workflows for research, spreadsheets, and customer support deliver 3x faster than peers.",
      ar: "الطلاب الذين يتقنون أدوات الذكاء الاصطناعي في البحث والجداول وخدمة العملاء ينجزون العمل أسرع بـ 3 مرات.",
    },
    tools: ["Python Basics", "Google Sheets & Excel", "Make / Zapier", "AI APIs"],
    monthPlan: [
      {
        so: "Toddobaadka 1-2: Baro qorista tilmaamaha saxda ah (Structured Prompting) iyo xallinta xogta Excel/Sheets.",
        en: "Weeks 1-2: Master structured prompting and automated Excel/Google Sheets analysis.",
        ar: "الأسبوع 1-2: إتقان صياغة الأوامر الدقيقة وتحليل الجداول آلياً.",
      },
      {
        so: "Toddobaadka 3-4: Baro isku xirka foomamka, WhatsApp/Email, iyo xogta ganacsiga adigoon koodh badan qorin.",
        en: "Weeks 3-4: Build automated form-to-sheet and customer reply workflows.",
        ar: "الأسبوع 3-4: بناء مسارات أتمتة للنماذج والردود وتنظيم بيانات العملاء.",
      },
    ],
    howToEarn: {
      so: "Ka caawi shirkadaha yar yar inay nidaamiyaan xogta macaamiisha, warbixinnada, iyo jawaabaha degdegga ah.",
      en: "Help small businesses automate reporting, invoices, and customer inquiries.",
      ar: "مساعدة الشركات الصغيرة في أتمتة التقارير والفواتير وتنظيم بيانات العملاء.",
    },
    freeResourceName: "DeepLearning.AI Free Short Courses",
    freeResourceUrl: "https://www.deeplearning.ai/short-courses/",
  },
];

export const somaliaStudentGrowthPillars: SomaliaGrowthPillar[] = [
  {
    id: "growth_digital_gap",
    title: {
      so: "1. Isku-darka Shahaadada Jaamacadda iyo Xirfad Dijitaal ah",
      en: "1. Pairing Your University Degree with a Digital Skill",
      ar: "١. الجمع بين الشهادة الجامعية ومهارة رقمية عملية",
    },
    evidenceStat: {
      so: "Xogta Bangiga Adduunka (DE4A & Mashruuca Rajo Kaaba ee Soomaaliya) waxay caddeynaysaa in dhallinyarada isku darta waxbarashada iyo xirfadaha dijitaalka ah ay si degdeg ah shaqo u helaan.",
      en: "World Bank DE4A and Somalia's Rajo Kaaba program highlight that pairing formal education with practical digital/TVET skills is the fastest path into the formal economy.",
      ar: "تشير تقارير البنك الدولي (DE4A ومشروع راجو كابا في الصومال) إلى أن دمج التعليم الجامعي مع المهارات الرقمية هو أسرع طريق لدخول سوق العمل.",
    },
    strategy: [
      {
        so: "Ha sugin ilaa qalin-jabinta: sannadka 1-aad ee jaamacadda ku darso hal xirfad oo la taaban karo (Excel, Data, Design, Video Editing, ama Coding).",
        en: "Do not wait for graduation: pick one marketable digital skill in Year 1 (Excel, Data, Design, Video Editing, or Coding).",
        ar: "لا تنتظر التخرج: اختر مهارة رقمية عملية من السنة الأولى (إكسل، تحليل البيانات، التصميم، المونتاج، أو البرمجة).",
      },
      {
        so: "Bishii samee 1 mashruuc dhab ah oo xallinaya dhibaato aad ku aragtay jaamacaddaada ama xaafaddaada.",
        en: "Complete 1 real-world mini-project every month solving a problem you see in your university or neighborhood.",
        ar: "أنجز مشروعاً عملياً واحداً كل شهر لحل مشكلة حقيقية في جامعتك أو مجتمعك.",
      },
    ],
    verifiedLinks: [
      { name: "World Bank DE4A (Africa Digital Economy)", url: "https://www.worldbank.org/en/programs/all-africa-digital-transformation" },
      { name: "Coursera Financial Aid (Free Certificates)", url: "https://www.coursera.org/" },
    ],
    sourceName: "World Bank DE4A & Rajo Kaaba Somalia",
  },
  {
    id: "growth_scholarships",
    title: {
      so: "2. Deeqaha Waxbarasho ee La Hubiyay ee Ardayda Soomaaliya",
      en: "2. Verified Global Scholarships Open to Somali Students",
      ar: "٢. المنح الدراسية العالمية الموثوقة للطلاب الصوماليين",
    },
    evidenceStat: {
      so: "Boqolaal arday oo Soomaali ah ayaa sanad walba bilaash wax ku barta iyagoo adeegsanaya deeqaha rasmiga ah ee dowladaha iyo hay'adaha caalamiga ah.",
      en: "Hundreds of Somali students win fully funded scholarships every year through official government and foundation portals.",
      ar: "يفوز مئات الطلاب الصوماليين سنوياً بمنح ممولة بالكامل عبر البوابات الرسمية للحكومات والمؤسسات العالمية.",
    },
    strategy: [
      {
        so: "Ilaali darajadaada (GPA 3.4+ ama 80%+ dugsiga sare) oo ururi shahaadooyinka tabarucaadda (Volunteering) iyo hoggaaminta.",
        en: "Protect your grades (80%+ high school / 3.4+ GPA) and document community leadership or volunteering.",
        ar: "حافظ على معدل مرتفع (80%+ في الثانوية أو 3.4+ في الجامعة) ووثّق مشاركتك التطوعية والقيادية.",
      },
      {
        so: "Waligaa cidna lacag ha siin si ay kuu xarayso deeq waxbarasho; codsiyada rasmiga ah waa bilaash boqolkiiba boqol.",
        en: "Never pay middlemen for scholarships; official government portals are 100% free to apply to directly.",
        ar: "لا تدفع أبداً لوسطاء المنح؛ التقديم عبر البوابات الرسمية مجاني 100%.",
      },
    ],
    verifiedLinks: [
      { name: "Türkiye Bursları (Bachelor & Master)", url: "https://www.turkiyeburslari.gov.tr/" },
      { name: "Chevening Scholarships (UK Master's)", url: "https://www.chevening.org/scholarship/somalia/" },
      { name: "DAAD Scholarships (Germany)", url: "https://www.daad.de/en/" },
    ],
    sourceName: "Official Government Scholarship Portals",
  },
  {
    id: "growth_english_research",
    title: {
      so: "3. Kordhinta Awoodda Ingiriisiga Cilmiga ah iyo Cilmi-baarista",
      en: "3. Accelerating Academic English & Research Writing",
      ar: "٣. تطوير اللغة الإنجليزية الأكاديمية والبحث العلمي",
    },
    evidenceStat: {
      so: "In ka badan 80% buugaagta iyo warbixinnada cilmiga ah ee jaamacadaha waxay ku qoran yihiin Ingiriisi; barashada erey-bixinta kulliyaddaada 90 maalmood gudahood waxay labanlaabtaa natiijada imtixaanka.",
      en: "Over 80% of university scientific papers and textbooks are in English; mastering your faculty's core vocabulary in 90 days doubles comprehension.",
      ar: "أكثر من 80% من المراجع الجامعية باللغة الإنجليزية؛ إتقان مصطلحات تخصصك خلال 90 يوماً يضاعف فهمك وتفوقك.",
    },
    strategy: [
      {
        so: "Maalin walba 25 daqiiqo ku akhri maqaal ku saabsan kulliyaddaada oo qor 5 erey oo cusub (Active Recall).",
        en: "Read 25 minutes daily in your specific major and write down 5 new technical terms in your own words.",
        ar: "اقرأ 25 دقيقة يومياً في تخصصك وسجّل 5 مصطلحات جديدة بأسلوبك الخاص.",
      },
      {
        so: "Baro habka qorista cilmi-baarista (APA/IEEE citations) si aad diyaar ugu noqoto buugga qalin-jabinta (Thesis).",
        en: "Learn proper research citation (APA/IEEE) early so your graduation thesis stands out.",
        ar: "تعلّم مبكراً أصول البحث العلمي والتوثيق (APA/IEEE) لتتميز في بحث التخرج.",
      },
    ],
    verifiedLinks: [
      { name: "British Council LearnEnglish (Free)", url: "https://learnenglish.britishcouncil.org/" },
      { name: "Purdue OWL Academic Writing Guide", url: "https://owl.purdue.edu/" },
    ],
    sourceName: "British Council & Purdue University OWL",
  },
  {
    id: "growth_local_solutions",
    title: {
      so: "4. Xallinta Baahiyaha Dhabta ah ee Soomaaliya (Fursadaha Ganacsiga)",
      en: "4. Turning Real Local Challenges into Student Projects & Startups",
      ar: "٤. تحويل التحديات المحلية في الصومال إلى مشاريع وفرص عمل",
    },
    evidenceStat: {
      so: "Qaybaha ugu kororka badan ee Soomaaliya waa: Tamarta Qorraxda (Solar), Adeegyada Lacagta Mobile-ka (FinTech), Caafimaadka fog (Telehealth), Beeraha Waraabka, iyo Gaadiidka/Logistics.",
      en: "Somalia's highest-growth sectors are Solar Energy, Mobile Money/FinTech, Telehealth, Modern Irrigation/AgriTech, and Logistics.",
      ar: "أسرع القطاعات نمواً في الصومال هي: الطاقة الشمسية، التكنولوجيا المالية، الصحة عن بُعد، الزراعة الحديثة، واللوجستيات.",
    },
    strategy: [
      {
        so: "Dooro mawduuca qalin-jabinta (Graduation Project) mid xallinaya dhibaato dhab ah oo gudaha dalka ka jirta, hana soo koobiyin mawduuc qadiimi ah.",
        en: "Choose a graduation project that solves a real local Somali problem rather than copying outdated templates.",
        ar: "اختر مشروع تخرج يحل مشكلة واقعية في الصومال بدلاً من تكرار المواضيع التقليدية.",
      },
      {
        so: "Ku biir naadiyada ardayda, tartamada hal-abuurka (Hackathons), oo sameyso xiriir (Networking) LinkedIn ah oo leh 30+ xirfadlayaal kulliyaddaada ah.",
        en: "Join student clubs, hackathons, and connect on LinkedIn with 30+ professionals working in your target field.",
        ar: "انضم إلى الأندية الطلابية ومسابقات الابتكار وابنِ شبكة علاقات مهنية على LinkedIn في مجالك.",
      },
    ],
    verifiedLinks: [
      { name: "LinkedIn Student Career Hub", url: "https://www.linkedin.com/" },
      { name: "GitHub Student Developer Pack (Free Tools)", url: "https://education.github.com/pack" },
    ],
    sourceName: "World Bank Somalia & GitHub Education",
  },
];
