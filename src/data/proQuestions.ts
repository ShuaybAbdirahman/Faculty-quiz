import type { LocalizedString } from "./quizData";

export interface ProDeepQuestion {
  id: string;
  /** Trait key matching Pro department profiles (e.g., code, elec, build, acct, surg, etc.) */
  k: string;
  /** Optional secondary trait boosted by this Pro question */
  k2?: string;
  t: LocalizedString;
}

/**
 * Dedicated Pro-only department precision questions tailored for every faculty.
 * Unlike general free screening items, these distinguish specific departments
 * and career specializations within the student's chosen faculty.
 */
export const proFacultyQuestions: Record<string, ProDeepQuestion[]> = {
  cs: [
    {
      id: "pro_cs_1",
      k: "code",
      k2: "A",
      t: {
        so: "Inaan dhiso barnaamijyo web iyo mobile ah oo dadku maalin kasta adeegsadaan (Frontend iyo Backend)",
        en: "Building web and mobile applications that people use every day (Frontend & Backend)",
        ar: "بناء تطبيقات الويب والهاتف التي يستخدمها الناس يومياً (الواجهات والخوادم)",
      },
    },
    {
      id: "pro_cs_2",
      k: "I",
      k2: "math",
      t: {
        so: "Inaan ka shaqeeyo Sirdoonka Macmalka ah (AI), barashada mashiinka, iyo saadaalinta xogta",
        en: "Working on Artificial Intelligence (AI), machine learning, and predictive data models",
        ar: "العمل في الذكاء الاصطناعي وتعلم الآلة وبناء نماذج التنبؤ بالبيانات",
      },
    },
    {
      id: "pro_cs_3",
      k: "ict",
      k2: "R",
      t: {
        so: "Inaan ilaaliyo amniga shabakadaha, baadho daldaloollada, oo ka hortago weerarrada internetka (Cybersecurity)",
        en: "Securing networks, finding vulnerabilities, and defending against cyber attacks (Cybersecurity)",
        ar: "حماية الشبكات واكتشاف الثغرات والتصدي للهجمات السيبرانية (الأمن السيبراني)",
      },
    },
    {
      id: "pro_cs_4",
      k: "C",
      k2: "ops",
      t: {
        so: "Inaan maareeyo kaydka xogta (Databases), servers-ka, iyo nidaamyada shirkadaha waaweyn",
        en: "Managing databases, cloud servers, and enterprise IT infrastructure",
        ar: "إدارة قواعد البيانات والخوادم السحابية والبنية التحتية التقنية للشركات",
      },
    },
    {
      id: "pro_cs_5",
      k: "E",
      k2: "proj",
      t: {
        so: "Inaan hoggaamiyo koox farsamo, dejiyo qorshaha mashruuca, oo xalliyo baahida macaamiisha",
        en: "Leading a tech team, planning software products, and aligning with business needs",
        ar: "قيادة فريق تقني والتخطيط للمنتجات الرقمية وربطها باحتياجات العملاء",
      },
    },
  ],
  eng: [
    {
      id: "pro_eng_1",
      k: "elec",
      k2: "I",
      t: {
        so: "Inaan ka shaqeeyo korontada, tamarta cadceedda (Solar), microcontrollers, iyo naqshadaynta PCB",
        en: "Working on power grids, solar energy, microcontrollers, and PCB circuit design",
        ar: "العمل في شبكات الكهرباء والطاقة الشمسية والمتحكمات الدقيقة وتصميم الدوائر",
      },
    },
    {
      id: "pro_eng_2",
      k: "build",
      k2: "field",
      t: {
        so: "Inaan naqshadeeyo dhismayaal, waddooyin, iyo buundooyin oo aan korjoogteeyo goobta dhismaha",
        en: "Designing buildings, roads, and bridges and supervising construction sites",
        ar: "تصميم المباني والطرق والجسور والإشراف الميداني على مواقع البناء",
      },
    },
    {
      id: "pro_eng_3",
      k: "R",
      k2: "math",
      t: {
        so: "Inaan naqshadeeyo mashiinno, matoorro, iyo qalab farsamo oo si toos ah u shaqeeya (Mechanical)",
        en: "Designing engines, mechanical machines, and automated industrial equipment",
        ar: "تصميم المحركات والآلات الميكانيكية والمعدات الصناعية المؤتمتة",
      },
    },
    {
      id: "pro_eng_4",
      k: "ict",
      k2: "elec",
      t: {
        so: "Inaan ka shaqeeyo isgaarsiinta casriga ah (5G, Fiber Optic, iyo shabakadaha raadiyaha)",
        en: "Working on modern telecommunications (5G, fiber optics, and wireless networks)",
        ar: "العمل في الاتصالات الحديثة (شبكات الجيل الخامس والألياف الضوئية)",
      },
    },
    {
      id: "pro_eng_5",
      k: "fly",
      k2: "A",
      t: {
        so: "Inaan isku daro quruxda naqshadda (Architecture) ama farsamada duulimaadyada iyo garoommada",
        en: "Combining creative architectural design or aviation and airport systems engineering",
        ar: "الجمع بين التصميم المعماري الإبداعي أو هندسة الطيران وأنظمة المطارات",
      },
    },
  ],
  med: [
    {
      id: "pro_med_1",
      k: "surg",
      k2: "blood",
      t: {
        so: "Inaan sameeyo qalliinno degdeg ah iyo shaqo gacmeed sax ah gudaha qolka qalliinka",
        en: "Performing precise surgical operations inside the operating theatre",
        ar: "إجراء العمليات الجراحية الدقيقة داخل غرفة العمليات",
      },
    },
    {
      id: "pro_med_2",
      k: "diag",
      k2: "I",
      t: {
        so: "Inaan baadho cudurro adag oo gudaha ah anigoo isku xiraya calaamadaha iyo baaritaannada shaybaarka",
        en: "Diagnosing complex internal diseases by connecting symptoms with lab findings",
        ar: "تشخيص الأمراض الباطنية المعقدة عبر ربط الأعراض بنتائج المختبر",
      },
    },
    {
      id: "pro_med_3",
      k: "care",
      k2: "S",
      t: {
        so: "Inaan la shaqeeyo carruurta, hooyooyinka, iyo qoysaska si joogto ah anigoo daryeel dhow siinaya",
        en: "Caring closely for children, mothers, and families over the long term",
        ar: "تقديم الرعاية المستمرة والقريبة للأطفال والأمهات والأسر",
      },
    },
    {
      id: "pro_med_4",
      k: "lab",
      k2: "bio",
      t: {
        so: "Inaan ka shaqeeyo baaritaanka sawirrada (Radiology), shaybaarka, ama cilmi-baarista caafimaadka",
        en: "Working in medical imaging (Radiology), pathology labs, or clinical research",
        ar: "العمل في الأشعة التشخيصية أو المختبرات المرضية أو الأبحاث الطبية",
      },
    },
    {
      id: "pro_med_5",
      k: "comm",
      k2: "E",
      t: {
        so: "Inaan hoggaamiyo barnaamijyada ka-hortagga cudurrada iyo maamulka caafimaadka bulshada",
        en: "Leading disease prevention campaigns and public health system management",
        ar: "قيادة برامج الوقاية من الأمراض وإدارة أنظمة الصحة العامة",
      },
    },
  ],
  econ: [
    {
      id: "pro_econ_1",
      k: "acct",
      k2: "C",
      t: {
        so: "Inaan hubiyo xisaabaadka, diyaariyo warbixinnada maaliyadeed (IFRS), oo sameeyo hanti-dhawr (Audit)",
        en: "Auditing accounts, preparing IFRS financial statements, and ensuring compliance",
        ar: "تدقيق الحسابات وإعداد التقارير المالية وفق المعايير الدولية",
      },
    },
    {
      id: "pro_econ_2",
      k: "math",
      k2: "I",
      t: {
        so: "Inaan falanqeeyo suuqyada maaliyadda, bangiyada Islaamiga ah, iyo go'aannada maalgashiga",
        en: "Analysing financial markets, Islamic banking, and investment decisions",
        ar: "تحليل الأسواق المالية والمصارف الإسلامية وقرارات الاستثمار",
      },
    },
    {
      id: "pro_econ_3",
      k: "mkt",
      k2: "A",
      t: {
        so: "Inaan dejiyo qorshe suuq-geyn ah, kordhiyo iibka, oo dhiso sumcadda shirkad (Branding)",
        en: "Building marketing strategies, growing sales, and shaping strong brands",
        ar: "وضع خطط التسويق وزيادة المبيعات وبناء الهوية التجارية للشركات",
      },
    },
    {
      id: "pro_econ_4",
      k: "ops",
      k2: "field",
      t: {
        so: "Inaan maareeyo soo-dejinta, dekadaha, bakhaarrada, iyo silsiladda saadka (Supply Chain)",
        en: "Managing imports, ports, warehouses, and supply chain logistics",
        ar: "إدارة الاستيراد والموانئ والمستودعات وسلاسل الإمداد",
      },
    },
    {
      id: "pro_econ_5",
      k: "proj",
      k2: "E",
      t: {
        so: "Inaan bilaabo ganacsi cusub ama maareeyo mashaariic horumarineed oo miisaaniyad weyn leh",
        en: "Launching a new venture or managing large development and business projects",
        ar: "تأسيس مشروع تجاري جديد أو إدارة مشاريع تنموية بميزانيات كبيرة",
      },
    },
  ],
  law: [
    {
      id: "pro_law_1",
      k: "just",
      k2: "E",
      t: {
        so: "Inaan maxkamadaha ka difaaco dadka ama u doodo xuquuqda sharciga ah si furan",
        en: "Representing clients in court and arguing legal cases persuasively",
        ar: "الترافع أمام المحاكم والدفاع عن الحقوق القانونية بوضوح",
      },
    },
    {
      id: "pro_law_2",
      k: "lang",
      k2: "C",
      t: {
        so: "Inaan qoro heshiisyada ganacsiga, shuruucda shirkadaha, iyo dukumiintiyada rasmiga ah",
        en: "Drafting commercial contracts, corporate agreements, and legal policies",
        ar: "صياغة العقود التجارية واتفاقيات الشركات واللوائح القانونية",
      },
    },
    {
      id: "pro_law_3",
      k: "soc",
      k2: "I",
      t: {
        so: "Inaan si qoto dheer u barto Shareecada Islaamka, Usuulul-Fiqhi, iyo xallinta khilaafaadka qoyska",
        en: "Studying Islamic Jurisprudence (Sharia & Fiqh) and family dispute resolution deeply",
        ar: "التعمق في الشريعة الإسلامية وأصول الفقه وحل النزاعات الأسرية",
      },
    },
    {
      id: "pro_law_4",
      k: "gov",
      k2: "help",
      t: {
        so: "Inaan ka shaqeeyo qaanuunka caalamiga ah, xuquuqul insaanka, iyo hay'adaha caalamiga ah",
        en: "Working in international law, human rights, and global organizations",
        ar: "العمل في القانون الدولي وحقوق الإنسان والمنظمات الدولية",
      },
    },
    {
      id: "pro_law_5",
      k: "C",
      k2: "stable",
      t: {
        so: "Inaan baadho kiisas, ururiyo caddaymo, oo sameeyo go'aanno caddaalad ku salaysan",
        en: "Investigating cases, examining evidence, and making impartial judicial decisions",
        ar: "التحقيق في القضايا وفحص الأدلة وإصدار قرارات عادلة وموضوعية",
      },
    },
  ],
  health: [
    {
      id: "pro_hlth_1",
      k: "care",
      k2: "S",
      t: {
        so: "Inaan si toos ah isbitaalka ugu daryeelo bukaannada maalin kasta (Kalkaalin ama Umuliso)",
        en: "Providing direct bedside patient care every day in hospitals (Nursing or Midwifery)",
        ar: "تقديم الرعاية المباشرة للمرضى يومياً في المستشفيات (التمريض أو القبالة)",
      },
    },
    {
      id: "pro_hlth_2",
      k: "lab",
      k2: "I",
      t: {
        so: "Inaan ka shaqeeyo shaybaarka caafimaadka, baadho dhiigga iyo jeermiska, oo soo saaro natiijooyin sax ah",
        en: "Working in medical labs analysing blood, microbes, and diagnostic samples",
        ar: "العمل في المختبرات الطبية لتحليل الدم والميكروبات وإصدار نتائج دقيقة",
      },
    },
    {
      id: "pro_hlth_3",
      k: "comm",
      k2: "proj",
      t: {
        so: "Inaan maareeyo mashaariic caafimaad oo bulshada ah, tallaal, iyo qiimaynta hay'adaha (Public Health & M&E)",
        en: "Managing community health programs, vaccination drives, and NGO monitoring (M&E)",
        ar: "إدارة برامج الصحة المجتمعية وحملات التطعيم والتقييم في المنظمات",
      },
    },
    {
      id: "pro_hlth_4",
      k: "bio",
      k2: "help",
      t: {
        so: "Inaan ka shaqeeyo nafaqada hooyada iyo dhallaanka iyo la-talinta cuntada caafimaadka leh",
        en: "Working on maternal and child nutrition and healthy diet planning",
        ar: "العمل في تغذية الأمهات والأطفال والتخطيط الغذائي الصحي",
      },
    },
    {
      id: "pro_hlth_5",
      k: "field",
      k2: "ops",
      t: {
        so: "Inaan ka shaqeeyo xaaladaha degdegga ah, gargaarka caafimaad, iyo booqashada degmooyinka",
        en: "Working in emergency health response, field clinics, and community outreach",
        ar: "العمل في الاستجابة الصحية الطارئة والعيادات الميدانية",
      },
    },
  ],
  pharm: [
    {
      id: "pro_ph_1",
      k: "lab",
      k2: "bio",
      t: {
        so: "Inaan barto kiimikada dawooyinka, tayadooda, iyo sida loo sameeyo loona hubiyo",
        en: "Studying drug chemistry, formulation, and pharmaceutical quality control",
        ar: "دراسة كيمياء الأدوية وتصنيعها ومراقبة جودتها المخبرية",
      },
    },
    {
      id: "pro_ph_2",
      k: "care",
      k2: "diag",
      t: {
        so: "Inaan isbitaalka kala shaqeeyo dhakhaatiirta si bukaanka loo siiyo daawada iyo qiyaasta saxda ah (Clinical Pharmacy)",
        en: "Collaborating with hospital doctors to optimize patient drug dosages (Clinical Pharmacy)",
        ar: "التعاون مع الأطباء في المستشفى لضبط الجرعات الدوائية للمرضى (الصيدلة السريرية)",
      },
    },
    {
      id: "pro_ph_3",
      k: "E",
      k2: "ops",
      t: {
        so: "Inaan maareeyo farmashiyo, shirkad soo dejisa dawooyin, ama qaybinta dawooyinka dalka",
        en: "Running a community pharmacy or managing pharmaceutical import and distribution",
        ar: "إدارة صيدلية مجتمعية أو العمل في استيراد وتوزيع الأدوية",
      },
    },
    {
      id: "pro_ph_4",
      k: "C",
      k2: "just",
      t: {
        so: "Inaan ka shaqeeyo hubinta sharciga dawooyinka iyo ka-hortagga dawooyinka tayada hooseysa",
        en: "Working in drug regulation and preventing substandard or counterfeit medicines",
        ar: "العمل في الرقابة الدوائية ومنع الأدوية غير المطابقة للمواصفات",
      },
    },
    {
      id: "pro_ph_5",
      k: "comm",
      k2: "S",
      t: {
        so: "Inaan bulshada ka wacyigeliyo isticmaalka saxda ah ee antibiyootigga iyo dawooyinka",
        en: "Educating patients on safe antibiotic use and medication adherence",
        ar: "توعية المجتمع بالاستخدام الآمن للمضادات الحيوية والالتزام بالعلاج",
      },
    },
  ],
  dent: [
    {
      id: "pro_dn_1",
      k: "teeth",
      k2: "R",
      t: {
        so: "Inaan sameeyo shaqo gacmeed aad u fiiqan sida buuxinta, toosinta, iyo qurxinta ilkaha",
        en: "Performing delicate hands-on procedures like fillings, orthodontics, and cosmetic dentistry",
        ar: "إجراء أعمال يدوية دقيقة مثل الحشوات وتقويم وتجميل الأسنان",
      },
    },
    {
      id: "pro_dn_2",
      k: "surg",
      k2: "blood",
      t: {
        so: "Inaan sameeyo qalliinnada afka iyo daanka (Oral Surgery) iyo tallaalidda ilkaha (Implants)",
        en: "Performing oral and maxillofacial surgery and dental implants",
        ar: "إجراء جراحات الفم والفكين وزراعة الأسنان",
      },
    },
    {
      id: "pro_dn_3",
      k: "care",
      k2: "S",
      t: {
        so: "Inaan si deggen ula dhaqmo carruurta iyo bukaannada ka baqa daaweynta ilkaha",
        en: "Calming and treating children or anxious dental patients with patience",
        ar: "التعامل بلطف وصبر مع الأطفال والمرضى القلقين من علاج الأسنان",
      },
    },
    {
      id: "pro_dn_4",
      k: "E",
      k2: "money",
      t: {
        so: "Inaan mustaqbalka furto oo maareeyo xarun caafimaad oo ilkaha ah oo ii gaar ah",
        en: "Opening and managing my own private dental clinic in the future",
        ar: "افتتاح وإدارة عيادة أسنان خاصة بي في المستقبل",
      },
    },
    {
      id: "pro_dn_5",
      k: "comm",
      k2: "help",
      t: {
        so: "Inaan dugsiyada iyo bulshada baro ka-hortagga suuska iyo daryeelka caafimaadka afka",
        en: "Teaching schools and communities how to prevent tooth decay and gum disease",
        ar: "توعية المدارس والمجتمع بالوقاية من التسوس والعناية بصحة الفم",
      },
    },
  ],
  vet: [
    {
      id: "pro_vt_1",
      k: "anim",
      k2: "field",
      t: {
        so: "Inaan goobaha xoolaha ku daaweeyo geela, lo'da, iyo ariga oo la tacaalo xaaladaha degdegga ah",
        en: "Treating camels, cattle, and goats directly in the field and handling emergencies",
        ar: "علاج الإبل والأبقار والأغنام ميدانياً والتعامل مع الحالات الطارئة",
      },
    },
    {
      id: "pro_vt_2",
      k: "lab",
      k2: "bio",
      t: {
        so: "Inaan shaybaar ku baadho cudurrada xoolaha iyo kuwa u gudba dadka (Zoonotic diseases)",
        en: "Testing animal diseases and zoonotic infections in diagnostic laboratories",
        ar: "فحص أمراض الحيوانات والأمراض المشتركة مع الإنسان في المختبر",
      },
    },
    {
      id: "pro_vt_3",
      k: "ops",
      k2: "C",
      t: {
        so: "Inaan hubiyo caafimaadka xoolaha la dhoofiyo iyo tayada hilibka iyo caanaha (Export Inspection)",
        en: "Inspecting livestock for export and ensuring meat and dairy food safety",
        ar: "فحص المواشي المعدة للتصدير وضمان سلامة اللحوم والألبان",
      },
    },
    {
      id: "pro_vt_4",
      k: "E",
      k2: "proj",
      t: {
        so: "Inaan maareeyo mashruuc xoolo-dhaqasho casri ah ama farmashiye dawooyinka xoolaha ah",
        en: "Running a modern livestock production farm or veterinary pharmacy business",
        ar: "إدارة مشروع حديث لتربية المواشي أو صيدلية بيطرية",
      },
    },
    {
      id: "pro_vt_5",
      k: "comm",
      k2: "help",
      t: {
        so: "Inaan la shaqeeyo xoolo-dhaqatada si looga hortago abaarta iyo cudurrada faafa",
        en: "Working with pastoralists on vaccination and drought resilience programs",
        ar: "العمل مع الرعاة في برامج التحصين والوقاية من آثار الجفاف",
      },
    },
  ],
  agri: [
    {
      id: "pro_ag_1",
      k: "crop",
      k2: "field",
      t: {
        so: "Inaan kordhiyo wax-soo-saarka beeraha adigoo adeegsanaya abuur casri ah iyo waraab tayo leh",
        en: "Boosting crop yields using modern seeds, irrigation, and smart agronomy",
        ar: "زيادة إنتاج المحاصيل باستخدام البذور الحديثة والري الذكي",
      },
    },
    {
      id: "pro_ag_2",
      k: "env",
      k2: "I",
      t: {
        so: "Inaan ka shaqeeyo ilaalinta deegaanka, biyaha, iyo la-qabsiga isbeddelka cimilada",
        en: "Working on environmental conservation, water management, and climate adaptation",
        ar: "العمل في حماية البيئة وإدارة المياه والتكيف مع التغير المناخي",
      },
    },
    {
      id: "pro_ag_3",
      k: "E",
      k2: "mkt",
      t: {
        so: "Inaan ganacsi ka dhigo beeraha, warshadaynta cuntada, iyo dhoofinta dalagga (Agribusiness)",
        en: "Building agribusinesses, food processing, and agricultural export value chains",
        ar: "تطوير الأعمال الزراعية وتصنيع الأغذية وتصدير المحاصيل",
      },
    },
    {
      id: "pro_ag_4",
      k: "lab",
      k2: "bio",
      t: {
        so: "Inaan baadho carrada, cudurrada dhirta, iyo tayada cuntada gudaha shaybaarka",
        en: "Testing soil health, plant diseases, and food quality in laboratories",
        ar: "فحص خصوبة التربة وأمراض النباتات وجودة الغذاء في المختبر",
      },
    },
    {
      id: "pro_ag_5",
      k: "proj",
      k2: "help",
      t: {
        so: "Inaan la shaqeeyo hay'adaha sugnaanta cuntada (FAO, WFP) si loo taageero beeralayda",
        en: "Working with food security organizations (FAO, WFP) to support local farmers",
        ar: "العمل مع منظمات الأمن الغذائي لدعم المزارعين المحليين",
      },
    },
  ],
  pol: [
    {
      id: "pro_pol_1",
      k: "gov",
      k2: "E",
      t: {
        so: "Inaan ka shaqeeyo xiriirka caalamiga ah, safaaradaha, iyo diblomaasiyadda",
        en: "Working in international relations, embassies, and diplomacy",
        ar: "العمل في العلاقات الدولية والسفارات والدبلوماسية",
      },
    },
    {
      id: "pro_pol_2",
      k: "C",
      k2: "ops",
      t: {
        so: "Inaan dejiyo siyaasadaha dowladda, maamulka guud, iyo horumarinta hay'adaha (Public Admin)",
        en: "Designing public policy, governance systems, and public administration",
        ar: "تصميم السياسات العامة والإدارة الحكومية وتطوير المؤسسات",
      },
    },
    {
      id: "pro_pol_3",
      k: "soc",
      k2: "I",
      t: {
        so: "Inaan sameeyo cilmi-baaris siyaasadeed, falanqayn amniga, iyo xallinta khilaafaadka",
        en: "Conducting political research, security analysis, and conflict resolution",
        ar: "إجراء البحوث السياسية وتحليل الأمن وحل النزاعات",
      },
    },
    {
      id: "pro_pol_4",
      k: "proj",
      k2: "help",
      t: {
        so: "Inaan maareeyo mashaariicda horumarinta bulshada iyo hay'adaha caalamiga ah (NGOs)",
        en: "Managing community development projects with international NGOs",
        ar: "إدارة مشاريع التنمية المجتمعية في المنظمات الدولية",
      },
    },
    {
      id: "pro_pol_5",
      k: "media",
      k2: "lang",
      t: {
        so: "Inaan ka hadlo fagaarayaasha, qoro faallooyin siyaasadeed, oo maareeyo ololeyaal",
        en: "Speaking publicly, writing policy commentary, and managing campaigns",
        ar: "الخطابة العامة وكتابة التحليلات السياسية وإدارة الحملات",
      },
    },
  ],
  edu: [
    {
      id: "pro_ed_1",
      k: "teach",
      k2: "S",
      t: {
        so: "Inaan si toos ah fasalka ugu dhigo maaddooyinka sayniska, xisaabta, ama luqadaha",
        en: "Teaching science, mathematics, or languages directly in the classroom",
        ar: "تدريس مواد العلوم أو الرياضيات أو اللغات مباشرة في الصف",
      },
    },
    {
      id: "pro_ed_2",
      k: "E",
      k2: "C",
      t: {
        so: "Inaan maamulo dugsiyo, dejiyo qorshe waxbarasho, oo hoggaamiyo macallimiin (Leadership)",
        en: "Managing schools, leading teachers, and shaping educational administration",
        ar: "إدارة المدارس وقيادة المعلمين وتطوير الإدارة التربوية",
      },
    },
    {
      id: "pro_ed_3",
      k: "care",
      k2: "help",
      t: {
        so: "Inaan diiradda saaro barbaarinta carruurta yaryar iyo waxbarashada aasaasiga ah",
        en: "Focusing on early childhood development and primary education",
        ar: "التركيز على الطفولة المبكرة والتعليم الأساسي",
      },
    },
    {
      id: "pro_ed_4",
      k: "I",
      k2: "lang",
      t: {
        so: "Inaan dejiyo manhaj cusub, qoro buugaag waxbarasho, oo sameeyo cilmi-baaris",
        en: "Designing modern curricula, writing textbooks, and researching learning methods",
        ar: "تصميم المناهج الحديثة وتأليف الكتب الدراسية والبحث التربوي",
      },
    },
    {
      id: "pro_ed_5",
      k: "ict",
      k2: "A",
      t: {
        so: "Inaan adeegsado teknolojiyadda waxbarashada (EdTech) iyo koorsooyinka internetka",
        en: "Using educational technology (EdTech) and digital online learning platforms",
        ar: "توظيف تقنيات التعليم الحديثة ومنصات التعلم الرقمي",
      },
    },
  ],
  arts: [
    {
      id: "pro_ar_1",
      k: "media",
      k2: "E",
      t: {
        so: "Inaan ka shaqeeyo saxaafadda, warbaahinta dijitaalka ah, iyo soo-saaridda barnaamijyada",
        en: "Working in journalism, digital media production, and broadcasting",
        ar: "العمل في الصحافة والإعلام الرقمي وإنتاج البرامج",
      },
    },
    {
      id: "pro_ar_2",
      k: "lang",
      k2: "A",
      t: {
        so: "Inaan barto luqadaha, tarjumaadda, qoraalka hal-abuurka leh, iyo suugaanta",
        en: "Focusing on languages, translation, creative writing, and literature",
        ar: "التخصص في اللغات والترجمة والكتابة الإبداعية والأدب",
      },
    },
    {
      id: "pro_ar_3",
      k: "S",
      k2: "help",
      t: {
        so: "Inaan fahmo maskaxda dadka, la-talinta nafsiyeed (Psychology), iyo adeegga bulshada",
        en: "Understanding human psychology, counseling, and community social work",
        ar: "فهم علم النفس وتقديم الإرشاد النفسي والخدمة الاجتماعية",
      },
    },
    {
      id: "pro_ar_4",
      k: "soc",
      k2: "I",
      t: {
        so: "Inaan baadho taariikhda, dhaqanka, iyo cilmiga bulshada (Sociology & History)",
        en: "Researching history, culture, and social change (Sociology & History)",
        ar: "البحث في التاريخ والثقافة وعلم الاجتماع",
      },
    },
    {
      id: "pro_ar_5",
      k: "mkt",
      k2: "comm",
      t: {
        so: "Inaan maareeyo xiriirka dadweynaha (PR) iyo warbaahinta shirkadaha iyo hay'adaha",
        en: "Managing public relations (PR) and corporate communications for organizations",
        ar: "إدارة العلاقات العامة والتواصل المؤسسي للشركات والمنظمات",
      },
    },
  ],
  sci: [
    {
      id: "pro_sc_1",
      k: "math",
      k2: "I",
      t: {
        so: "Inaan si qoto dheer u barto xisaabta, tirakoobka (Statistics), iyo falanqaynta xogta sayniska",
        en: "Studying mathematics, statistics, and quantitative data science deeply",
        ar: "التعمق في الرياضيات والإحصاء وتحليل البيانات العلمية",
      },
    },
    {
      id: "pro_sc_2",
      k: "lab",
      k2: "bio",
      t: {
        so: "Inaan tijaabooyin ku sameeyo shaybaarka Bayolojiga, Kiimikada, ama Microbiology",
        en: "Conducting experiments in biology, chemistry, or microbiology labs",
        ar: "إجراء التجارب في مختبرات الأحياء أو الكيمياء أو الأحياء الدقيقة",
      },
    },
    {
      id: "pro_sc_3",
      k: "elec",
      k2: "R",
      t: {
        so: "Inaan barto Fiisigiska, tamarta, iyo sida qalabka saynisku u shaqeeyo",
        en: "Studying physics, energy systems, and applied physical sciences",
        ar: "دراسة الفيزياء وأنظمة الطاقة والعلوم الفيزيائية التطبيقية",
      },
    },
    {
      id: "pro_sc_4",
      k: "env",
      k2: "field",
      t: {
        so: "Inaan baadho dhulka, khayraadka dabiiciga ah, biyaha, iyo cimilada (Geology & Environmental Science)",
        en: "Studying geology, natural resources, hydrology, and environmental science",
        ar: "دراسة الجيولوجيا والموارد الطبيعية والمياه وعلوم البيئة",
      },
    },
    {
      id: "pro_sc_5",
      k: "teach",
      k2: "code",
      t: {
        so: "Inaan noqdo cilmi-baare jaamacadeed ama u gudbo xisaabinta iyo barnaamijyada sayniska",
        en: "Pursuing academic research or computational science and modeling",
        ar: "التوجه نحو البحث الأكاديمي أو العلوم الحاسوبية والنمذجة",
      },
    },
  ],
};

export function getProQuestionsForFaculty(facultyId: string): ProDeepQuestion[] {
  return proFacultyQuestions[facultyId] ?? proFacultyQuestions.cs;
}
