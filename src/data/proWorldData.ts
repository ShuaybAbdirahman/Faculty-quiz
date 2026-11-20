import type { LocalizedString } from "./quizData";

export interface WorldPioneer {
  id: string;
  name: string;
  region: "somalia" | "world";
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
  // ---- SOOMAALIYA (7 Verified Modern 21st-Century Pioneers) ----
  {
    id: "pioneer_ismail_ahmed",
    name: "Dr. Ismail Ahmed",
    region: "somalia",
    facultyId: "econ",
    facultyLabel: {
      so: "Dhaqaalaha & Tiknoolajiyada Maaliyadda (FinTech)",
      en: "Economics & FinTech",
      ar: "الاقتصاد والتقنية المالية",
    },
    degree: {
      so: "PhD Dhaqaalaha (University of London) & MBA (London Business School)",
      en: "PhD in Economics (University of London) & MBA (London Business School)",
      ar: "دكتوراه في الاقتصاد (جامعة لندن) وماجستير إدارة الأعمال (لندن)",
    },
    achievement: {
      so: "Wuxuu aasaasay WorldRemit (Zepz), shirkad FinTech ah oo qiimaheedu gaaray $5 bilyan oo dadka qurbajoogta ah u sahashay inay lacag u diraan in ka badan 130 dal, isagoo maalgeliya mashaariic waxbarasho oo Geeska Afrika ah.",
      en: "Founded WorldRemit (Zepz), a $5B global digital remittance platform serving 130+ countries, and launched major education philanthropy across the Horn of Africa.",
      ar: "أسس شركة WorldRemit (Zepz) للتحويلات الرقمية بقيمة 5 مليارات دولار لخدمة أكثر من 130 دولة، ويدعم مشاريع التعليم في القرن الأفريقي.",
    },
    lesson: {
      so: "Dhibaatada aad adigu la kulanto (sida xawaaladda) waxay noqon kartaa fikradda ganacsi ee bilyan-doolar ah marka lagu daro aqoon dhaqaale iyo tiknoolajiyad.",
      en: "Solving a real problem you personally understand can become a billion-dollar venture when backed by economics and modern tech.",
      ar: "حل مشكلة واقعية تعيشها بنفسك يمكن أن يصبح مشروعاً عالمياً بمليارات الدولارات عند دمجه بالاقتصاد والتقنية.",
    },
    sourceName: "WorldRemit / Zepz",
    sourceUrl: "https://www.worldremit.com/en/about-us",
  },
  {
    id: "pioneer_yusuf",
    name: "Judge Abdulqawi Ahmed Yusuf",
    region: "somalia",
    facultyId: "law",
    facultyLabel: {
      so: "Kulliyadda Sharciga iyo Qaanuunka Caalamiga ah",
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
    id: "pioneer_edna_adan",
    name: "Dr. Edna Adan Ismail",
    region: "somalia",
    facultyId: "health",
    facultyLabel: {
      so: "Caafimaadka Bulshada & Kalkaalisada",
      en: "Public Health & Nursing",
      ar: "الصحة العامة والتمريض",
    },
    degree: {
      so: "Kalkaalisada & Umulisada (London South Bank University), Aasaasaha Edna Adan University",
      en: "Nursing & Midwifery (London South Bank University), Founder of Edna Adan University",
      ar: "التمريض والقبالة (جامعة لندن ساوث بانك)، مؤسسة جامعة ومستشفى إدنا عدن",
    },
    achievement: {
      so: "Waxay ku guulaysatay abaalmarinta caalamiga ah ee Templeton Prize 2023 kadib markii ay Hargeysa ka dhistay isbitaal iyo jaamacad soo saartay kumannaan umulisooyin iyo kalkaaliyeyaal ah oo hoos u dhigay dhimashada hooyada.",
      en: "Won the 2023 Templeton Prize for building the Edna Adan University Hospital in Hargeisa, training thousands of midwives and nurses and cutting maternal mortality.",
      ar: "فازت بجائزة تمبلتون العالمية 2023 لبنائها مستشفى وجامعة إدنا عدن في هرجيسا وتدريب آلاف القابلات والممرضات.",
    },
    lesson: {
      so: "Hal qof oo go'aan leh wuxuu dhisi karaa hay'ad waxbarasho iyo caafimaad oo badbaadisa kumannaan hooyo iyo carruur ah.",
      en: "One determined professional can build an entire hospital and university that saves thousands of mothers and newborns.",
      ar: "شخص واحد صاحب عزيمة يستطيع بناء مستشفى وجامعة تنقذ آلاف الأمهات والأطفال.",
    },
    sourceName: "Templeton Prize (2023)",
    sourceUrl: "https://www.templetonprize.org/laureate/edna-adan-ismail/",
  },
  {
    id: "pioneer_hawa_deqo",
    name: "Dr. Hawa Abdi (AUN) & Dr. Deqo Mohamed",
    region: "somalia",
    facultyId: "med",
    facultyLabel: {
      so: "Kulliyadda Caafimaadka & Hoggaaminta Isbitaallada",
      en: "Medicine & Healthcare Leadership",
      ar: "الطب وقيادة المستشفيات",
    },
    degree: {
      so: "Dhakhtarnimo (MD) & Sharciga (Jaamacadda Ummadda Soomaaliyeed)",
      en: "MD in Gynecology & Law Degree (Somali National University)",
      ar: "بكالوريوس الطب وبكالوريوس القانون (الجامعة الوطنية الصومالية)",
    },
    achievement: {
      so: "Waxay dhiseen isbitaal, dugsi, iyo xero badbaadisay in ka badan 90,000 oo barakacayaal ah (Nobel Peace Prize nominee 2012); Dr. Deqo Mohamed ayaa maanta sii wadda hoggaaminta Dr. Hawa Abdi Foundation.",
      en: "Built a hospital, school, and sanctuary serving 90,000+ displaced people (2012 Nobel Peace Prize nominee); Dr. Deqo Mohamed continues leading the foundation today.",
      ar: "أسستا مستشفى ومدرسة وملاذاً أنقذ أكثر من 90 ألف نازح (ترشيح نوبل 2012)، وتواصل د. ديكو محمد قيادة المؤسسة اليوم.",
    },
    lesson: {
      so: "Aqoonta caafimaadka marka lagu daro geesinimo iyo adeeg bulsho, waxay dhisaysaa dhaxal joogto ah oo jiilal dhan badbaadiya.",
      en: "Medical mastery paired with courage and service builds a lasting legacy that saves entire generations.",
      ar: "الجمع بين الطب والشجاعة وخدمة المجتمع يبني إرثاً مستداماً ينقذ أجيالاً كاملة.",
    },
    sourceName: "Encyclopedia Britannica",
    sourceUrl: "https://www.britannica.com/biography/Hawa-Abdi",
  },
  {
    id: "pioneer_elman",
    name: "Ilwad Elman & Fartuun Adan",
    region: "somalia",
    facultyId: "pol",
    facultyLabel: {
      so: "Siyaasadda, Nabadda & Hal-abuurka Bulshada",
      en: "Peace, Governance & Social Innovation",
      ar: "العلوم السياسية والسلام والابتكار الاجتماعي",
    },
    degree: {
      so: "Conflict Management & Business (Eastern Mennonite University) & Hoggaaminta Bulshada",
      en: "Conflict Management & Business (Eastern Mennonite University) & Leadership",
      ar: "إدارة النزاعات والأعمال (الولايات المتحدة) والقيادة المجتمعية",
    },
    achievement: {
      so: "Waxay ku guulaysteen abaalmarinta Right Livelihood Award 2022 ('Alternative Nobel Prize') iyo Aurora Prize 2020 iyagoo dhisay barnaamijyo dhallinyarada Muqdisho loogu abuuro shaqo iyo rajo cusub.",
      en: "Won the 2022 Right Livelihood Award ('Alternative Nobel') and 2020 Aurora Prize for Elman Peace programs rebuilding youth livelihoods in Mogadishu.",
      ar: "فازتا بجائزة رايت لايفليهود 2022 (نوبل البديلة) وجائزة أورورا 2020 لجهودهما في تمكين الشباب وإعادة الإعمار في مقديشو.",
    },
    lesson: {
      so: "Dhallinyarada Soomaaliyeed ee qarniga 21-aad waxay nabad iyo fursado dhab ah ku abuuri karaan hal-abuur bulsho iyo hoggaamin daacad ah.",
      en: "21st-century Somali youth can transform communities through courageous social innovation and transparent leadership.",
      ar: "شباب الصومال في القرن الحادي والعشرين قادرون على صناعة السلام والفرص عبر الابتكار الاجتماعي والقيادة النزيهة.",
    },
    sourceName: "Right Livelihood Award (2022)",
    sourceUrl: "https://rightlivelihood.org/the-change-makers/find-a-laureate/fartuun-adan-and-ilwad-elman/",
  },
  {
    id: "pioneer_duale",
    name: "Abdirashid Duale",
    region: "somalia",
    facultyId: "econ",
    facultyLabel: {
      so: "Maamulka Ganacsiga, Bangiyada & Isgaarsiinta",
      en: "Business, Banking & Telecom",
      ar: "إدارة الأعمال والبنوك والاتصالات",
    },
    degree: {
      so: "Maamulka Ganacsiga & Maaliyadda Caalamiga ah (UK)",
      en: "Business & International Finance Leadership (UK)",
      ar: "إدارة الأعمال والقيادة المالية الدولية (المملكة المتحدة)",
    },
    achievement: {
      so: "Maamulaha Guud ee Dahabshiil Group oo ka hawlgala 126+ dal (xawaalad, bangi, isgaarsiinta Somtel, iyo tamar), kuna guulaystay abaalmarinno caalami ah oo ay ka mid tahay Global Good Governance (3G) Awards.",
      en: "CEO of Dahabshiil Group operating across 126+ countries in banking, remittances, Somtel telecom, and energy, honored with Global Good Governance (3G) Awards.",
      ar: "الرئيس التنفيذي لمجموعة دهبشيل العاملة في أكثر من 126 دولة في البنوك والاتصالات والطاقة، والحائز على جوائز الحوكمة الرشيدة (3G).",
    },
    lesson: {
      so: "Kalsoonida, maamulka nidaamsan, iyo adeegsiga tiknoolajiyada casriga ah waxay shirkad maxalli ah u rogaan shabakad caalami ah.",
      en: "Trust, disciplined governance, and modern digital infrastructure can scale a local African enterprise into a global network.",
      ar: "الثقة والحوكمة المنظمة والتقنية الحديثة تحوّل شركة محلية إلى شبكة عالمية.",
    },
    sourceName: "Dahabshiil Group & Forbes Africa",
    sourceUrl: "https://www.dahabshiil.com/about-us",
  },
  {
    id: "pioneer_jamal_osman",
    name: "Jamal Osman",
    region: "somalia",
    facultyId: "arts",
    facultyLabel: {
      so: "Saxaafadda, Warbaahinta & Filim-samaynta",
      en: "Journalism, Media & Filmmaking",
      ar: "الصحافة والإعلام وصناعة الأفلام",
    },
    degree: {
      so: "Saxaafadda & Soo-saarista Muuqaallada (Broadcast Journalism, UK)",
      en: "Broadcast Journalism & Documentary Filmmaking (UK)",
      ar: "الصحافة الإذاعية وصناعة الأفلام الوثائقية (المملكة المتحدة)",
    },
    achievement: {
      so: "Wariye iyo filim-sameeye Soomaaliyeed oo abaalmarinno caalami ah (Royal Television Society & Amnesty Media Awards) ku helay warbixinnada qoto dheer ee Channel 4 News, The Guardian, iyo Al Jazeera.",
      en: "Award-winning Somali-British investigative journalist and filmmaker for Channel 4 News, The Guardian, and Al Jazeera (Royal Television Society & Amnesty Awards).",
      ar: "صحفي وصانع أفلام وثائقية صومالي حائز على جوائز دولية كبرى في تقاريره لقناة Channel 4 والغارديان والجزيرة.",
    },
    lesson: {
      so: "Sheeko-xariirka xirfadaysan iyo muuqaalka tayada leh waxay codka Soomaaliya gaarsiiyaan shaashadaha ugu waaweyn adduunka.",
      en: "Professional investigative storytelling and visual journalism carry Somalia's voice to the world's largest global stages.",
      ar: "السرد الصحفي الاحترافي وصناعة المحتوى عالي الجودة يوصلان صوت الصومال إلى أكبر المنصات العالمية.",
    },
    sourceName: "Channel 4 News",
    sourceUrl: "https://www.channel4.com/news/by/jamal-osman",
  },

  // ---- ADDUUNKA / WORLD (5 Modern 21st-Century Leaders) ----
  {
    id: "pioneer_hassabis",
    name: "Demis Hassabis",
    region: "world",
    facultyId: "cs",
    facultyLabel: {
      so: "Kombiyuutarka & Sirdoonka Macmalka ah (AI)",
      en: "Computer Science & AI",
      ar: "علوم الحاسوب والذكاء الاصطناعي",
    },
    degree: {
      so: "BA Computer Science (Cambridge) & PhD Cognitive Neuroscience (UCL)",
      en: "BA Computer Science (Cambridge) & PhD Cognitive Neuroscience (UCL)",
      ar: "بكالوريوس علوم الحاسوب (كامبريدج) ودكتوراه علوم الأعصاب (UCL)",
    },
    achievement: {
      so: "Aasaasaha Google DeepMind, kuna guulaystay Nobel Prize-ka Kiimikada 2024 kadib markii nidaamkooda AI (AlphaFold2) uu xalliyay qaab-dhismeedka in ka badan 200 milyan oo borotiin ah.",
      en: "Co-founder & CEO of Google DeepMind; won the 2024 Nobel Prize in Chemistry for AlphaFold2, which solved 200M+ protein structures using AI.",
      ar: "مؤسس Google DeepMind والحائز على جائزة نوبل في الكيمياء 2024 لتطوير نظام الذكاء الاصطناعي AlphaFold2.",
    },
    lesson: {
      so: "Isku-darka Coding-ka, AI, iyo saynis kale (sida bayoolajiga ama caafimaadka) waa halka ay ka dhashaan guulaha ugu waaweyn qarniga 21-aad.",
      en: "Combining Computer Science and AI with another science like biology or medicine creates the biggest breakthroughs of the 21st century.",
      ar: "دمج البرمجة والذكاء الاصطناعي مع علوم أخرى كالطب والأحياء يصنع أعظم اكتشافات القرن الحادي والعشرين.",
    },
    sourceName: "NobelPrize.org (2024)",
    sourceUrl: "https://www.nobelprize.org/prizes/chemistry/2024/hassabis/facts/",
  },
  {
    id: "pioneer_lisa_su",
    name: "Dr. Lisa Su",
    region: "world",
    facultyId: "eng",
    facultyLabel: {
      so: "Injineernimada Korontada & Chips-ka AI",
      en: "Electrical Engineering & AI Hardware",
      ar: "الهندسة الكهربائية ورقائق الذكاء الاصطناعي",
    },
    degree: {
      so: "BSc, MSc & PhD Injineernimada Korontada (MIT, USA)",
      en: "BSc, MSc & PhD in Electrical Engineering (MIT)",
      ar: "بكالوريوس وماجستير ودكتوراه في الهندسة الكهربائية (MIT)",
    },
    achievement: {
      so: "Guddoomiyaha iyo Maamulaha Guud ee AMD, oo shirkadda ka dhigtay mid ka mid ah hoggaamiyeyaasha ugu waaweyn ee chips-ka AI iyo supercomputers-ka, kuna guuleysatay abaalmarinta National Medal of Science.",
      en: "Chair and CEO of AMD, leading breakthroughs in AI accelerators and high-performance chips, and recipient of the National Medal of Science.",
      ar: "رئيسة مجلس الإدارة والرئيسة التنفيذية لشركة AMD، قادت طفرة رقائق الذكاء الاصطناعي والحوسبة الفائقة، وحصلت على الوسام الوطني للعلوم.",
    },
    lesson: {
      so: "Injineernimada Korontada ee qarnigan ma aha oo keliya fiilooyin, waa chips-ka AI, tamarta casriga ah, iyo qalabka adduunka haga.",
      en: "Modern Electrical Engineering powers the AI chips, renewable grids, and smart hardware running the 21st-century economy.",
      ar: "الهندسة الكهربائية اليوم تقود رقائق الذكاء الاصطناعي وشبكات الطاقة الذكية والاقتصاد الحديث.",
    },
    sourceName: "AMD Leadership & MIT",
    sourceUrl: "https://www.amd.com/en/corporate/leadership/lisa-su.html",
  },
  {
    id: "pioneer_kariko",
    name: "Dr. Katalin Kariko",
    region: "world",
    facultyId: "med",
    facultyLabel: {
      so: "Caafimaadka & Cilmi-baarista Daawooyinka (Biotech)",
      en: "Medicine & Biotechnology",
      ar: "الطب والتقنية الحيوية",
    },
    degree: {
      so: "PhD Biochemistry (University of Szeged)",
      en: "PhD in Biochemistry (University of Szeged)",
      ar: "دكتوراه في الكيمياء الحيوية (جامعة سيغيد)",
    },
    achievement: {
      so: "Waxay ku guulaysatay Nobel Prize-ka Caafimaadka 2023 kadib sanado badan oo adkaysi ah oo ay ku horumarisay tiknoolajiyada mRNA ee badbaadisay malaayiin qof caalamka oo dhan.",
      en: "Won the 2023 Nobel Prize in Physiology or Medicine for decades of mRNA research that enabled life-saving vaccines and next-generation therapies.",
      ar: "فازت بجائزة نوبل في الطب 2023 لأبحاثها الرائدة في تقنية mRNA التي أنقذت ملايين الأرواح حول العالم.",
    },
    lesson: {
      so: "Xitaa marka dadka kale ku diidaan fikraddaada, ku adkaysiga cilmi-baarista dhabta ah wuxuu maalin beddelaa caafimaadka aadanaha.",
      en: "Even when others doubt your research, relentless persistence in science can transform global medicine.",
      ar: "المثابرة في البحث العلمي الحقيقي قادرة على تغيير مستقبل الطب العالمي رغم كل التحديات.",
    },
    sourceName: "NobelPrize.org (2023)",
    sourceUrl: "https://www.nobelprize.org/prizes/medicine/2023/kariko/facts/",
  },
  {
    id: "pioneer_feifei_li",
    name: "Prof. Fei-Fei Li",
    region: "world",
    facultyId: "cs",
    facultyLabel: {
      so: "Kombiyuutarka, Aragga AI & Xogta",
      en: "Computer Science & Computer Vision",
      ar: "علوم الحاسوب والرؤية الحاسوبية",
    },
    degree: {
      so: "BA Fiisigiska (Princeton) & PhD Injineernimada Korontada (Caltech)",
      en: "BA Physics (Princeton) & PhD Electrical Engineering (Caltech)",
      ar: "بكالوريوس الفيزياء (برينستون) ودكتوراه الهندسة الكهربائية (كالتك)",
    },
    achievement: {
      so: "Waxay dhistay ImageNet oo furay kacaanka casriga ah ee AI, waana agaasimaha Stanford HAI iyo aasaasaha World Labs ee horumarinta Spatial AI.",
      en: "Created ImageNet, co-directs Stanford HAI, and founded World Labs to pioneer 3D Spatial Intelligence in modern AI.",
      ar: "أنشأت قاعدة ImageNet التي أطلقت ثورة الذكاء الاصطناعي الحديثة، وتقود معهد Stanford HAI وشركة World Labs.",
    },
    lesson: {
      so: "Xogta nadiifka ah iyo fikirka hal-abuurka leh ayaa ka muhiimsan qalabka qaaliga ah marka la dhisayo nidaam AI ah.",
      en: "High-quality data and original scientific vision matter more than hype when building real AI systems.",
      ar: "جودة البيانات والرؤية العلمية الأصيلة هما الأساس الحقيقي لبناء أنظمة ذكاء اصطناعي مؤثرة.",
    },
    sourceName: "Stanford HAI",
    sourceUrl: "https://hai.stanford.edu/people/fei-fei-li",
  },
  {
    id: "pioneer_tedros",
    name: "Dr. Tedros Adhanom Ghebreyesus",
    region: "world",
    facultyId: "health",
    facultyLabel: {
      so: "Caafimaadka Bulshada & Hoggaaminta Caalamiga ah",
      en: "Public Health & Global Leadership",
      ar: "الصحة العامة والقيادة العالمية",
    },
    degree: {
      so: "MSc Immunology (London) & PhD Community Health (University of Nottingham)",
      en: "MSc Immunology (London) & PhD Community Health (University of Nottingham)",
      ar: "ماجستير المناعة (لندن) ودكتوراه صحة المجتمع (جامعة نوتنغهام)",
    },
    achievement: {
      so: "Agaasimaha Guud ee ugu horreeyay ee Afrikaan ah ee Hay'adda Caafimaadka Adduunka (WHO), isagoo hoggaaminaya caafimaadka dhijitaalka ah iyo ka hortagga cudurrada faafa ee qarnigan.",
      en: "First African Director-General of the World Health Organization (WHO), leading modern digital health systems and global pandemic preparedness.",
      ar: "أول مدير عام أفريقي لمنظمة الصحة العالمية (WHO)، ويقود جهود الصحة الرقمية ومكافحة الأوبئة عالمياً.",
    },
    lesson: {
      so: "Caafimaadka bulshadu wuxuu ku xiran yahay ka hortag, nidaam xogeed, iyo hoggaamin heer caalami ah oo Afrika ka soo bixi karta.",
      en: "Public health combines prevention, data systems, and global leadership that African scholars can lead at the highest level.",
      ar: "الصحة العامة تجمع بين الوقاية والبيانات والقيادة العالمية التي يمكن لعلماء أفريقيا قيادتها.",
    },
    sourceName: "World Health Organization (WHO)",
    sourceUrl: "https://www.who.int/director-general/biography",
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
