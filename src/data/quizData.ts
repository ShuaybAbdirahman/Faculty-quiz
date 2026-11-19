export type Lang = "so" | "en" | "ar";

export interface LocalizedString {
  so: string;
  en: string;
  ar: string;
}

export interface LocalizedList {
  so: string[];
  en: string[];
  ar: string[];
}

export interface Faculty {
  id: string;
  short: string;
  code: string;
  en: string;
  color: number;
  depts: string[];
  icon: string;
  p: Record<string, number>;
  name: LocalizedString;
  desc: LocalizedString;
  jobs: LocalizedList;
  tips: LocalizedList;
}

export interface QuizSection {
  n: LocalizedString;
  h: LocalizedString;
  sc: LocalizedList;
}

export interface QuizItem {
  s: number;
  type: "sc" | "l" | "t" | "m";
  k?: string;
  deep?: boolean;
  c?: string[];
  a?: number;
  d?: number;
  t: LocalizedString;
  o?: LocalizedList;
  ow?: Record<string, number>[];
}

export const appOwner = "ShuaybAbdirahman";
export const clusterOrder: string[] = ["health","tech","society","business","nature"];
export const clusterFaculties: Record<string, string[]> = {"health":["med","dent","pharm","health","vet"],"tech":["cs","eng","sci"],"society":["law","pol","edu","arts"],"business":["econ","pol","law"],"nature":["agri","vet","health","sci"]};
export const clusterNames: Record<string, string> = {"health":"Caafimaad","tech":"Tignoolajiyada iyo injineerinka","society":"Sharciga, siyaasadda iyo waxbarashada","business":"Ganacsiga iyo dhaqaalaha","nature":"Beeraha iyo deegaanka"};
export const faculties: Faculty[] = [
  {
    "id": "law",
    "short": "Law",
    "code": "LAW",
    "en": "Sharia & Law",
    "color": 4284170124,
    "depts": [
      "Law (LLB)",
      "Sharia (Islamic Law)",
      "Sharia & Law",
      "International Law"
    ],
    "icon": "<path d=\"M24 7v32\"/><path d=\"M13 39h22\"/><path d=\"M9 15h30\"/><path d=\"M9 15l-5 12a6 6 0 0 0 10 0z\"/><path d=\"M39 15l-5 12a6 6 0 0 0 10 0z\"/><circle cx=\"24\" cy=\"7\" r=\"1.6\"/>",
    "p": {
      "C": 2,
      "E": 2,
      "I": 1,
      "lang": 3,
      "soc": 2,
      "help": 1,
      "stable": 2,
      "just": 3,
      "media": 1
    },
    "name": {
      "so": "Kulliyadda Shari’ada iyo Sharciga",
      "en": "Faculty of Sharia & Law",
      "ar": "كلية الشريعة والقانون"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel cadaaladda, doodda iyo fahamka sharciga iyo shareecada.",
      "en": "Suited to people who care about justice, debate, and understanding Islamic and civil law.",
      "ar": "مناسبة لمن يهتم بالعدالة والمناظرة وفهم الشريعة والقانون."
    },
    "jobs": {
      "so": [
        "Garsoore",
        "Qareen",
        "Xeer-ilaaliye",
        "La-taliye sharci"
      ],
      "en": [
        "Judge",
        "Lawyer",
        "Prosecutor",
        "Legal advisor"
      ],
      "ar": [
        "قاضٍ",
        "محامٍ",
        "مدعٍ عام",
        "مستشار قانوني"
      ]
    },
    "tips": {
      "so": [
        "Akhri Dastuurka iyo xeerarka aasaasiga ah si aad aasaas u yeelato.",
        "Ku dhaqan doodda iyo hadalka dadweynaha, tusaale kooxda doodda ee dugsiga.",
        "Barbar-dhig barnaamijyada Sharciga iyo Shareecada, oo weydii kee ayaa kuu horseedaya shaqada aad rabto."
      ],
      "en": [
        "Read the Constitution and basic laws to build a foundation.",
        "Practise debating and public speaking, for example in a school debate club.",
        "Compare the Law and Sharia programmes and ask which one leads to the career you want."
      ],
      "ar": [
        "اقرأ الدستور والقوانين الأساسية لبناء قاعدة معرفية.",
        "تدرّب على المناظرة والخطابة، مثلاً في نادي المناظرات بالمدرسة.",
        "قارن بين برنامجي القانون والشريعة واسأل أيهما يقودك إلى المهنة التي تريدها."
      ]
    }
  },
  {
    "id": "edu",
    "short": "Education",
    "code": "EDU",
    "en": "Education",
    "color": 4290920716,
    "depts": [
      "Primary Education",
      "Secondary Education",
      "Early Childhood Education",
      "Educational Leadership & Administration",
      "Subject Teaching (Maths, Science, Languages)"
    ],
    "icon": "<path d=\"M3 18L24 8l21 10-21 10z\"/><path d=\"M11 23v10c0 3 6.500 6 13 6s13-3 13-6V23\"/><path d=\"M45 18v13\"/>",
    "p": {
      "S": 3,
      "C": 1,
      "lang": 2,
      "soc": 2,
      "math": 1,
      "bio": 1,
      "help": 1,
      "stable": 2,
      "teach": 3
    },
    "name": {
      "so": "Kulliyadda Waxbarashada",
      "en": "Faculty of Education",
      "ar": "كلية التربية"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel barista iyo kobcinta jiilka cusub.",
      "en": "Suited to people who enjoy teaching and helping the next generation grow.",
      "ar": "مناسبة لمن يحب التعليم ويرغب في تنشئة الجيل الجديد."
    },
    "jobs": {
      "so": [
        "Macallin",
        "Maamule dugsi",
        "La-taliye waxbarasho",
        "Cilmi-baare waxbarasho"
      ],
      "en": [
        "Teacher",
        "School administrator",
        "Education advisor",
        "Education researcher"
      ],
      "ar": [
        "معلم",
        "مدير مدرسة",
        "مستشار تربوي",
        "باحث تربوي"
      ]
    },
    "tips": {
      "so": [
        "Dooro maaddada aad u badan tahay inaad ku fiicnaan doonto, tusaale xisaab, Ingiriisi ama sayniska.",
        "Ku tijaabi barista adigoo caawinaya carruur ama ardayda yar.",
        "Eeg baahida macallimiinta ee degmadaada si aad fursad shaqo u hesho."
      ],
      "en": [
        "Choose the subject you are most likely to excel in, such as mathematics, English, or science.",
        "Try out teaching by helping children or younger students.",
        "Check the demand for teachers in your district to find job opportunities."
      ],
      "ar": [
        "اختر المادة التي من المرجح أن تتفوق فيها، مثل الرياضيات أو الإنجليزية أو العلوم.",
        "جرّب التدريس بمساعدة الأطفال أو الطلاب الأصغر سناً.",
        "تحقّق من الطلب على المعلمين في منطقتك لتعرف فرص العمل."
      ]
    }
  },
  {
    "id": "econ",
    "short": "Economics",
    "code": "ECO",
    "en": "Economics & Management Sciences",
    "color": 4279203438,
    "depts": [
      "Business Administration",
      "Accounting & Finance",
      "Economics",
      "Marketing",
      "Banking & Finance",
      "International Trade",
      "Supply Chain & Logistics",
      "Project Management",
      "Human Resource Management",
      "Management Information Systems"
    ],
    "icon": "<path d=\"M7 7v34h35\"/><path d=\"M14 31l8-9 7 6 12-15\"/><path d=\"M33 13h8v8\"/>",
    "p": {
      "E": 3,
      "C": 3,
      "math": 2,
      "soc": 2,
      "ict": 1,
      "money": 3,
      "stable": 1,
      "acct": 3,
      "mkt": 2,
      "ops": 1,
      "proj": 2
    },
    "name": {
      "so": "Kulliyadda Dhaqaalaha iyo Maaraynta",
      "en": "Faculty of Economics & Management Sciences",
      "ar": "كلية الاقتصاد وعلوم الإدارة"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel xisaabta, ganacsiga, lacagta iyo hoggaaminta.",
      "en": "Suited to people who enjoy mathematics, business, money, and leadership.",
      "ar": "مناسبة لمن يحب الرياضيات والتجارة والمال والقيادة."
    },
    "jobs": {
      "so": [
        "Xisaabiye",
        "Shaqaale bangi",
        "Maamule mashruuc",
        "Ganacsade"
      ],
      "en": [
        "Accountant",
        "Bank officer",
        "Project manager",
        "Entrepreneur"
      ],
      "ar": [
        "محاسب",
        "موظف مصرف",
        "مدير مشاريع",
        "رائد أعمال"
      ]
    },
    "tips": {
      "so": [
        "Bilow barashada xisaabta ganacsiga iyo barnaamijka Excel hadda.",
        "Waaxaha Accounting iyo Finance waxay u baahan yihiin tiro badan; Marketing wuxuu u baahan yahay hal-abuur.",
        "Isku day ganacsi yar intaad wax baranayso si aad khibrad u hesho."
      ],
      "en": [
        "Start learning business mathematics and Excel now.",
        "Accounting and Finance need many graduates; Marketing needs creativity.",
        "Try a small business while you study to gain experience."
      ],
      "ar": [
        "ابدأ الآن بتعلم رياضيات الأعمال وبرنامج إكسل.",
        "تحتاج المحاسبة والمالية إلى كثير من الخريجين، بينما يحتاج التسويق إلى الإبداع.",
        "جرّب مشروعاً تجارياً صغيراً أثناء دراستك لتكتسب خبرة."
      ]
    }
  },
  {
    "id": "health",
    "short": "Health Sci.",
    "code": "HLT",
    "en": "Health Sciences",
    "color": 4279137424,
    "depts": [
      "Nursing",
      "Midwifery",
      "Public Health",
      "Medical Laboratory Science",
      "Nutrition & Dietetics",
      "Physiotherapy",
      "Radiography"
    ],
    "icon": "<path d=\"M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z\"/><path d=\"M10 25h8l3-6 5 11 3-5h9\"/>",
    "p": {
      "S": 3,
      "I": 2,
      "bio": 3,
      "blood": 2,
      "long": 1,
      "help": 3,
      "stable": 2,
      "lab": 2,
      "care": 3,
      "comm": 3,
      "diag": 1
    },
    "name": {
      "so": "Kulliyadda Sayniska Caafimaadka",
      "en": "Faculty of Health Sciences",
      "ar": "كلية العلوم الصحية"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka naxariista leh ee rabta inuu si toos ah u daryeelo bukaannada.",
      "en": "Suited to caring people who want to look after patients directly.",
      "ar": "مناسبة للشخص الحنون الذي يرغب في رعاية المرضى مباشرة."
    },
    "jobs": {
      "so": [
        "Kalkaaliye",
        "Umuliso",
        "Farsamoyaqaan shaybaar",
        "Khabiir nafaqo"
      ],
      "en": [
        "Nurse",
        "Midwife",
        "Laboratory technician",
        "Nutrition specialist"
      ],
      "ar": [
        "ممرض",
        "قابلة",
        "فني مختبر",
        "أخصائي تغذية"
      ]
    },
    "tips": {
      "so": [
        "Ka dooro waaxda adigoo eegaya daryeelka toos ah (Nursing, Midwifery) iyo shaybaarka (Laboratory).",
        "Booqo rug caafimaad si aad u aragto shaqada maalinlaha ah.",
        "Xoogee Bayoloji iyo Kimistari si aad u gudubto imtixaanka gelitaanka."
      ],
      "en": [
        "Choose a department by looking at direct care (Nursing, Midwifery) versus laboratory work.",
        "Visit a clinic to see the daily work first-hand.",
        "Strengthen Biology and Chemistry to pass the entrance exam."
      ],
      "ar": [
        "اختر القسم بالموازنة بين الرعاية المباشرة (التمريض، القبالة) والعمل المخبري.",
        "زُر عيادة لترى العمل اليومي بنفسك.",
        "قوِّ مستواك في الأحياء والكيمياء لاجتياز اختبار القبول."
      ]
    }
  },
  {
    "id": "cs",
    "short": "Comp. Sci.",
    "code": "CS",
    "en": "Computer Science & Information Technology",
    "color": 4280110808,
    "depts": [
      "Computer Science",
      "Information Technology",
      "Software Engineering",
      "Information Systems",
      "Computer Networks",
      "Cybersecurity",
      "Artificial Intelligence & Data Science"
    ],
    "icon": "<rect x=\"5\" y=\"8\" width=\"38\" height=\"26\" rx=\"3\"/><path d=\"M17 42h14M24 34v8\"/><path d=\"M19 16l-5 5 5 5M29 16l5 5-5 5M26 14l-4 14\"/>",
    "p": {
      "I": 2,
      "R": 1,
      "A": 1,
      "math": 3,
      "ict": 3,
      "money": 2,
      "code": 3,
      "elec": 1
    },
    "name": {
      "so": "Kulliyadda Sayniska Kombuyuutarka iyo Tignoolajiyada Macluumaadka",
      "en": "Faculty of Computer Science & Information Technology",
      "ar": "كلية علوم الحاسوب وتقنية المعلومات"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel tignoolajiyada, barnaamijyada, amniga internetka iyo sirdoonka macmalka ah (AI).",
      "en": "Suited to people who enjoy technology, programming, cybersecurity, and artificial intelligence (AI).",
      "ar": "مناسبة لمن يحب التكنولوجيا والبرمجة والأمن السيبراني والذكاء الاصطناعي."
    },
    "jobs": {
      "so": [
        "Horumariye software",
        "Khabiir amniga internetka",
        "Injineer shabakadeed",
        "Falanqeeye xog"
      ],
      "en": [
        "Software developer",
        "Cybersecurity specialist",
        "Network engineer",
        "Data analyst"
      ],
      "ar": [
        "مطوّر برمجيات",
        "خبير أمن سيبراني",
        "مهندس شبكات",
        "محلل بيانات"
      ]
    },
    "tips": {
      "so": [
        "Bilow barashada barnaamijinta (Python ama JavaScript) adigoo isticmaalaya ilaha bilaashka ah.",
        "Dhis mashruuc yar, sida website ama app, si aad khibrad u yeelato.",
        "Amniga internetka iyo AI waa meelo fursado badan leh."
      ],
      "en": [
        "Start learning programming (Python or JavaScript) with free resources.",
        "Build a small project, such as a website or an app, to gain experience.",
        "Cybersecurity and AI are areas with strong future opportunities."
      ],
      "ar": [
        "ابدأ بتعلم البرمجة (بايثون أو جافاسكربت) باستخدام مصادر مجانية.",
        "ابنِ مشروعاً صغيراً، مثل موقع إلكتروني أو تطبيق، لتكتسب خبرة.",
        "الأمن السيبراني والذكاء الاصطناعي مجالان واعدان بفرص قوية في المستقبل."
      ]
    }
  },
  {
    "id": "pol",
    "short": "Political Sci.",
    "code": "POL",
    "en": "Political Science & Public Administration",
    "color": 4290321436,
    "depts": [
      "Political Science",
      "Public Administration",
      "International Relations",
      "Diplomacy & Strategic Studies"
    ],
    "icon": "<path d=\"M4 18L24 6l20 12z\"/><path d=\"M8 41h32M7 36h34\"/><path d=\"M12 22v14M20 22v14M28 22v14M36 22v14\"/>",
    "p": {
      "E": 3,
      "S": 1,
      "C": 1,
      "lang": 3,
      "soc": 3,
      "stable": 2,
      "gov": 3,
      "media": 1,
      "proj": 1
    },
    "name": {
      "so": "Kulliyadda Cilmiga Siyaasadda iyo Maamulka Dadweynaha",
      "en": "Faculty of Political Science & Public Administration",
      "ar": "كلية العلوم السياسية والإدارة العامة"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel hoggaanka, maamulka dowladda iyo siyaasadda caalamiga ah.",
      "en": "Suited to people interested in leadership, public administration, and international affairs.",
      "ar": "مناسبة لمن يهتم بالقيادة والإدارة العامة والشؤون الدولية."
    },
    "jobs": {
      "so": [
        "Diblomaasi",
        "Maamule dowladeed",
        "Falanqeeye siyaasadeed",
        "Sarkaal ururro caalami ah"
      ],
      "en": [
        "Diplomat",
        "Public administrator",
        "Policy analyst",
        "International organisation officer"
      ],
      "ar": [
        "دبلوماسي",
        "موظف إدارة عامة",
        "محلل سياسات",
        "موظف في منظمة دولية"
      ]
    },
    "tips": {
      "so": [
        "Akhri wararka iyo falanqaynta siyaasadeed maalin kasta.",
        "Ku biir koox ardayda ama urur dhallinyaro si aad khibrad u hesho.",
        "Baro luqad labaad (Ingiriisi ama Carabi), waa muhiim ku ah diblomaasiyadda."
      ],
      "en": [
        "Read the news and political analysis every day.",
        "Join a student group or youth organisation to gain experience.",
        "Learn a second language (English or Arabic); it matters a lot in diplomacy."
      ],
      "ar": [
        "اقرأ الأخبار والتحليلات السياسية كل يوم.",
        "انضم إلى مجموعة طلابية أو منظمة شبابية لتكتسب خبرة.",
        "تعلّم لغة ثانية (الإنجليزية أو العربية)؛ فهي مهمة جدًا في الدبلوماسية."
      ]
    }
  },
  {
    "id": "eng",
    "short": "Engineering",
    "code": "ENG",
    "en": "Engineering",
    "color": 4290007817,
    "depts": [
      "Architecture",
      "Interior Design",
      "Civil Engineering",
      "Electrical & Electronic Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
      "Telecommunications Engineering",
      "Aeronautical Engineering"
    ],
    "icon": "<circle cx=\"24\" cy=\"24\" r=\"7\"/><circle cx=\"24\" cy=\"24\" r=\"14\"/><path d=\"M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4\"/>",
    "p": {
      "R": 3,
      "I": 2,
      "A": 2,
      "math": 3,
      "ict": 1,
      "field": 2,
      "money": 1,
      "build": 3,
      "elec": 3,
      "fly": 2
    },
    "name": {
      "so": "Kulliyadda Injineerinka",
      "en": "Faculty of Engineering",
      "ar": "كلية الهندسة"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel xisaabta iyo naqshadaha, ee rabta inuu wax dhiso ama hagaajiyo.",
      "en": "Suited to people who enjoy mathematics and design and want to build or improve things.",
      "ar": "مناسبة لمن يحب الرياضيات والتصميم ويرغب في البناء أو الإصلاح."
    },
    "jobs": {
      "so": [
        "Naqshadeeye dhismeed",
        "Injineer dhismo",
        "Injineer koronto",
        "Injineer makaanik"
      ],
      "en": [
        "Architect",
        "Civil engineer",
        "Electrical engineer",
        "Mechanical engineer"
      ],
      "ar": [
        "مهندس معماري",
        "مهندس مدني",
        "مهندس كهربائي",
        "مهندس ميكانيكي"
      ]
    },
    "tips": {
      "so": [
        "Xoogee xisaabta iyo fiisigiska, waa aasaaska injineerinka.",
        "Dooro laan: naqshadda (Architecture), dhismaha (Civil), korontada (Electrical) ama makiinadaha (Mechanical).",
        "Daawo mashaariicda dhismaha ee deegaankaaga si aad u aragto shaqada dhabta ah."
      ],
      "en": [
        "Strengthen mathematics and physics; they are the foundation of engineering.",
        "Choose a branch: design (Architecture), construction (Civil), electricity (Electrical) or machines (Mechanical).",
        "Watch building projects in your area to see the real work."
      ],
      "ar": [
        "قوِّ مستواك في الرياضيات والفيزياء، فهما أساس الهندسة.",
        "اختر فرعًا: التصميم (العمارة) أو الإنشاءات (المدنية) أو الكهرباء أو الآلات (الميكانيكية).",
        "تابع مشاريع البناء في منطقتك لترى العمل الحقيقي."
      ]
    }
  },
  {
    "id": "agri",
    "short": "Agriculture",
    "code": "AGR",
    "en": "Agriculture & Environmental Science",
    "color": 4282350880,
    "depts": [
      "Agriculture",
      "Agribusiness",
      "Environmental Science",
      "Food Science & Technology",
      "Fisheries & Marine Science",
      "Natural Resource Management"
    ],
    "icon": "<path d=\"M24 43V24\"/><path d=\"M24 28C24 17 17 12 7 12c0 11 6 16 17 16z\"/><path d=\"M24 22c0-9 6-13 16-13 0 10-6 14-16 14z\"/>",
    "p": {
      "R": 3,
      "I": 2,
      "bio": 2,
      "field": 3,
      "help": 1,
      "soc": 1,
      "crop": 3,
      "env": 2,
      "anim": 1
    },
    "name": {
      "so": "Kulliyadda Beeraha iyo Sayniska Deegaanka",
      "en": "Faculty of Agriculture & Environmental Science",
      "ar": "كلية الزراعة وعلوم البيئة"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel dabeecadda, beeraha, cuntada iyo ilaalinta deegaanka.",
      "en": "Suited to people who love nature, farming, food, and protecting the environment.",
      "ar": "مناسبة لمن يحب الطبيعة والزراعة والغذاء وحماية البيئة."
    },
    "jobs": {
      "so": [
        "Khabiir beereed",
        "Cilmi-baare deegaan",
        "La-taliye beeraha",
        "Maamule mashruuc beereed"
      ],
      "en": [
        "Agronomist",
        "Environmental researcher",
        "Farming advisor",
        "Agricultural project manager"
      ],
      "ar": [
        "مهندس زراعي",
        "باحث بيئي",
        "مستشار زراعي",
        "مدير مشاريع زراعية"
      ]
    },
    "tips": {
      "so": [
        "Booqo beer casri ah si aad u aragto fursadaha.",
        "Cuntada iyo isbeddelka cimilada waa mowduucyo muhiim ah oo mustaqbalka leh.",
        "Isku day beerid yar si aad u ogaato inaad jeceshahay."
      ],
      "en": [
        "Visit a modern farm to see the opportunities.",
        "Food security and climate change are important topics with a future.",
        "Try growing a small garden to find out whether you enjoy it."
      ],
      "ar": [
        "زُر مزرعة حديثة لترى الفرص المتاحة.",
        "الأمن الغذائي وتغيّر المناخ موضوعان مهمان لهما مستقبل.",
        "جرّب زراعة حديقة صغيرة لتعرف إن كنت تحب ذلك."
      ]
    }
  },
  {
    "id": "med",
    "short": "Medicine",
    "code": "MED",
    "en": "Medicine",
    "color": 4290646588,
    "depts": [
      "Medicine & Surgery (MBBS / MD)"
    ],
    "icon": "<rect x=\"6\" y=\"6\" width=\"36\" height=\"36\" rx=\"9\"/><path d=\"M24 14v20M14 24h20\"/>",
    "p": {
      "I": 3,
      "S": 2,
      "bio": 3,
      "math": 1,
      "blood": 3,
      "long": 3,
      "help": 3,
      "money": 2,
      "stable": 1,
      "surg": 3,
      "lab": 1,
      "care": 2,
      "diag": 3
    },
    "name": {
      "so": "Kulliyadda Dhakhtarnimada",
      "en": "Faculty of Medicine",
      "ar": "كلية الطب"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka dadaalka badan ee rabta inuu daweeyo bukaannada oo badbaadiyo nolosha.",
      "en": "Suited to hardworking people who want to treat patients and save lives.",
      "ar": "مناسبة للشخص المجتهد الذي يرغب في علاج المرضى وإنقاذ الأرواح."
    },
    "jobs": {
      "so": [
        "Dhakhtar",
        "Dhakhtar qalliin",
        "Cilmi-baare caafimaad",
        "Takhasus dhakhtar"
      ],
      "en": [
        "Doctor",
        "Surgeon",
        "Medical researcher",
        "Specialist physician"
      ],
      "ar": [
        "طبيب",
        "جراح",
        "باحث طبي",
        "طبيب اختصاصي"
      ]
    },
    "tips": {
      "so": [
        "Waa barnaamij dheer oo adag; hubi inaad diyaar u tahay dadaal badan.",
        "Xoogee Bayoloji iyo Kimistari.",
        "La hadal dhakhtar shaqeeya si aad u ogaato nolosha shaqada dhabta ah."
      ],
      "en": [
        "It is a long and demanding programme; make sure you are ready for a lot of effort.",
        "Strengthen Biology and Chemistry.",
        "Talk to a practising doctor to understand the reality of the work."
      ],
      "ar": [
        "إنه برنامج طويل وصعب، فتأكد من استعدادك لبذل جهد كبير.",
        "قوِّ مستواك في الأحياء والكيمياء.",
        "تحدّث مع طبيب يمارس المهنة لتفهم واقع العمل."
      ]
    }
  },
  {
    "id": "vet",
    "short": "Veterinary",
    "code": "VET",
    "en": "Veterinary Medicine",
    "color": 4284839210,
    "depts": [
      "Veterinary Medicine (DVM)",
      "Animal Health",
      "Animal Production"
    ],
    "icon": "<circle cx=\"14\" cy=\"19\" r=\"3.800\"/><circle cx=\"22\" cy=\"12\" r=\"3.800\"/><circle cx=\"31\" cy=\"12\" r=\"3.800\"/><circle cx=\"38\" cy=\"19\" r=\"3.800\"/><path d=\"M26 24c-6 0-11 6-9 11 1.500 3.500 5 2.500 9 2.500s7.500 1 9-2.500c2-5-3-11-9-11z\"/>",
    "p": {
      "R": 2,
      "I": 3,
      "bio": 3,
      "blood": 2,
      "long": 2,
      "field": 2,
      "help": 2,
      "surg": 2,
      "lab": 1,
      "anim": 3,
      "care": 1,
      "diag": 2
    },
    "name": {
      "so": "Kulliyadda Dhakhtarnimada Xoolaha",
      "en": "Faculty of Veterinary Medicine",
      "ar": "كلية الطب البيطري"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel xoolaha, gaar ahaan meelaha ay xoolaha dhaqaalaha ugu muhiimsan yihiin.",
      "en": "Suited to people who love animals, especially where livestock matters to the economy.",
      "ar": "مناسبة لمن يحب الحيوانات، خاصة حيث تمثل الثروة الحيوانية أهمية اقتصادية."
    },
    "jobs": {
      "so": [
        "Dhakhtarka xoolaha",
        "Kormeere caafimaad",
        "Cilmi-baare",
        "Ganacsade xoolo"
      ],
      "en": [
        "Veterinarian",
        "Animal health inspector",
        "Researcher",
        "Livestock trader"
      ],
      "ar": [
        "طبيب بيطري",
        "مفتش صحة حيوانية",
        "باحث",
        "تاجر ماشية"
      ]
    },
    "tips": {
      "so": [
        "Booqo qof xoolo daryeela ama rug caafimaad xoolaha si aad u aragto shaqada.",
        "Waa qayb baahi badan leh meelaha dalka ku tiirsan yahay xoolaha.",
        "Diyaari Bayoloji iyo daryeelka xoolaha."
      ],
      "en": [
        "Visit a livestock keeper or an animal clinic to see the work.",
        "It is a field with high demand in countries that depend on livestock.",
        "Prepare in Biology and animal care."
      ],
      "ar": [
        "زُر مربي ماشية أو عيادة بيطرية لترى طبيعة العمل.",
        "مجال عليه طلب كبير في البلدان التي تعتمد على الثروة الحيوانية.",
        "استعد في الأحياء ورعاية الحيوان."
      ]
    }
  },
  {
    "id": "dent",
    "short": "Dentistry",
    "code": "DNT",
    "en": "Dentistry",
    "color": 4278355143,
    "depts": [
      "Dentistry (BDS / DDS)",
      "Dental Hygiene & Therapy",
      "Dental Assisting"
    ],
    "icon": "<path d=\"M17 8c-4 0-8 3-8 9 0 5 2 8 3 13 .8 4 2 9 4.500 9 2 0 2.500-4 3.500-9 .4-2 .8-3 1-3s.6 1 1 3c1 5 1.500 9 3.500 9 2.500 0 3.700-5 4.500-9 1-5 3-8 3-13 0-6-4-9-8-9-3 0-5 1.500-7 1.500S20 8 17 8z\"/>",
    "p": {
      "R": 3,
      "I": 1,
      "S": 2,
      "bio": 2,
      "blood": 2,
      "long": 2,
      "money": 2,
      "help": 2,
      "surg": 3,
      "care": 1,
      "teeth": 3,
      "diag": 1
    },
    "name": {
      "so": "Kulliyadda Ilkaha",
      "en": "Faculty of Dentistry",
      "ar": "كلية طب الأسنان"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka gacan-fiican, ee jecel daryeelka ilkaha iyo afka.",
      "en": "Suited to people with steady hands who care about dental and oral health.",
      "ar": "مناسبة لصاحب اليد الثابتة الذي يهتم بصحة الأسنان والفم."
    },
    "jobs": {
      "so": [
        "Dhakhtarka ilkaha",
        "Kaaliyaha ilkaha",
        "Hoggaamiye rug ilko",
        "Cilmi-baare"
      ],
      "en": [
        "Dentist",
        "Dental assistant",
        "Dental clinic manager",
        "Researcher"
      ],
      "ar": [
        "طبيب أسنان",
        "مساعد طبيب أسنان",
        "مدير عيادة أسنان",
        "باحث"
      ]
    },
    "tips": {
      "so": [
        "Hubi inaad leedahay gacan degan oo taxaddar leh.",
        "Dentistry waa mid dheer; Dental Assistant waa mid kale: isbarbar dhig labada.",
        "La hadal dhakhtarka ilkaha si aad u aragto maalinta shaqada."
      ],
      "en": [
        "Make sure you have a steady, careful hand.",
        "Dentistry is longer; Dental Assistant is a different programme: compare the two.",
        "Talk to a dentist to see a day of work."
      ],
      "ar": [
        "تأكد من أن لديك يداً ثابتة ودقيقة.",
        "طب الأسنان أطول؛ أما مساعد طبيب الأسنان فبرنامج مختلف، فقارن بينهما.",
        "تحدّث مع طبيب أسنان لتتعرف على يوم عمل."
      ]
    }
  },
  {
    "id": "pharm",
    "short": "Pharmacy",
    "code": "PHM",
    "en": "Pharmacy",
    "color": 4288814255,
    "depts": [
      "Pharmacy (BPharm / PharmD)",
      "Clinical Pharmacy",
      "Pharmaceutical Sciences"
    ],
    "icon": "<g transform=\"rotate(-40 24 24)\"><rect x=\"4\" y=\"15\" width=\"40\" height=\"18\" rx=\"9\"/><path d=\"M24 15v18\"/></g><path d=\"M36 8v6M33 11h6\"/>",
    "p": {
      "I": 2,
      "C": 2,
      "bio": 2,
      "math": 2,
      "lab": 3,
      "help": 1,
      "stable": 3,
      "money": 2,
      "long": 2
    },
    "name": {
      "so": "Kulliyadda Farmashiyaha",
      "en": "Faculty of Pharmacy",
      "ar": "كلية الصيدلة"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel kimistariga iyo daawooyinka, ee rabta inuu si ammaan ah u caawiyo bukaannada.",
      "en": "Suited to people who enjoy chemistry and medicines and want to help patients use them safely.",
      "ar": "مناسبة لمن يحب الكيمياء والأدوية ويريد مساعدة المرضى على استخدامها بأمان."
    },
    "jobs": {
      "so": [
        "Farmashiye",
        "Farmashiye isbitaal",
        "Sarkaal xakamaynta daawooyinka",
        "Cilmi-baare daawo"
      ],
      "en": [
        "Pharmacist",
        "Hospital pharmacist",
        "Drug regulation officer",
        "Pharmaceutical researcher"
      ],
      "ar": [
        "صيدلاني",
        "صيدلاني مستشفى",
        "مسؤول رقابة دوائية",
        "باحث في علوم الدواء"
      ]
    },
    "tips": {
      "so": [
        "Xoojiso kimistariga iyo bayoolajiga dugsiga sare.",
        "Booqo farmashiyo deegaankaaga si aad u aragto shaqada maalinlaha ah.",
        "Hubi in barnaamijka farmashiyaha ee jaamacadda uu leeyahay aqoonsi rasmi ah."
      ],
      "en": [
        "Strengthen your chemistry and biology in high school.",
        "Visit a local pharmacy to see the daily work.",
        "Check that the university’s pharmacy programme is officially accredited."
      ],
      "ar": [
        "قوِّ مادتي الكيمياء والأحياء في الثانوية.",
        "زر صيدلية قريبة لترى طبيعة العمل اليومي.",
        "تأكد من أن برنامج الصيدلة في الجامعة معتمد رسميًا."
      ]
    }
  },
  {
    "id": "sci",
    "short": "Sciences",
    "code": "SCI",
    "en": "Natural Sciences",
    "color": 4282595530,
    "depts": [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Statistics",
      "Geology"
    ],
    "icon": "<path d=\"M19 6h10\"/><path d=\"M21 6v13L9 38a3 3 0 0 0 2.600 4.500h24.800A3 3 0 0 0 39 38L27 19V6\"/><path d=\"M14 31h20\"/>",
    "p": {
      "I": 3,
      "R": 1,
      "math": 3,
      "bio": 2,
      "ict": 1,
      "lab": 3,
      "long": 1,
      "stable": 1,
      "field": 1
    },
    "name": {
      "so": "Kulliyadda Sayniska Dabiiciga ah",
      "en": "Faculty of Natural Sciences",
      "ar": "كلية العلوم"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka xiiseeya sida adduunku u shaqeeyo, ee jecel xisaabta, fiisigiska, kimistariga iyo bayoolajiga.",
      "en": "Suited to curious people who want to understand how the world works through maths, physics, chemistry and biology.",
      "ar": "مناسبة للفضوليين الذين يريدون فهم كيف يعمل العالم عبر الرياضيات والفيزياء والكيمياء والأحياء."
    },
    "jobs": {
      "so": [
        "Cilmi-baare sayniis",
        "Macallin jaamacad",
        "Falanqeeye xog",
        "Farsamoyaqaan shaybaar"
      ],
      "en": [
        "Research scientist",
        "University lecturer",
        "Data analyst",
        "Laboratory technician"
      ],
      "ar": [
        "باحث علمي",
        "محاضر جامعي",
        "محلل بيانات",
        "فني مختبر"
      ]
    },
    "tips": {
      "so": [
        "Xoojiso xisaabta iyo sayniska dugsiga sare.",
        "Ku dhaqan tijaabooyin yaryar iyo xalinta dhibaatooyinka.",
        "Weydii jaamacadda shaybaarrada ay leedahay iyo barnaamijyada cilmi-baarista."
      ],
      "en": [
        "Strengthen your maths and science grades in high school.",
        "Practise small experiments and problem-solving.",
        "Ask the university about its laboratories and research programmes."
      ],
      "ar": [
        "قوِّ درجاتك في الرياضيات والعلوم بالثانوية.",
        "تدرّب على تجارب صغيرة وحل المسائل.",
        "اسأل الجامعة عن مختبراتها وبرامج البحث لديها."
      ]
    }
  },
  {
    "id": "arts",
    "short": "Arts & Media",
    "code": "ART",
    "en": "Arts, Humanities & Media",
    "color": 4292552567,
    "depts": [
      "Languages & Literature",
      "History",
      "Islamic Studies",
      "Psychology",
      "Sociology & Social Work",
      "Journalism & Communication"
    ],
    "icon": "<path d=\"M24 12c-4-3-10-4-18-4v28c8 0 14 1 18 4 4-3 10-4 18-4V8c-8 0-14 1-18 4z\"/><path d=\"M24 12v28\"/>",
    "p": {
      "A": 2,
      "S": 2,
      "E": 1,
      "lang": 3,
      "soc": 3,
      "help": 1,
      "stable": 1,
      "media": 3,
      "comm": 1
    },
    "name": {
      "so": "Kulliyadda Farshaxanka, Aadanaha iyo Warbaahinta",
      "en": "Faculty of Arts, Humanities & Media",
      "ar": "كلية الآداب والعلوم الإنسانية والإعلام"
    },
    "desc": {
      "so": "Waxay ku habboon tahay qofka jecel luqadaha, taariikhda, qoraalka iyo fahamka dadka iyo bulshada.",
      "en": "Suited to people who love languages, history, writing, and understanding people and society.",
      "ar": "مناسبة لمن يحب اللغات والتاريخ والكتابة وفهم الناس والمجتمع."
    },
    "jobs": {
      "so": [
        "Weriye",
        "Qoraa ama tarjumaan",
        "Khabiir cilmi-nafsi",
        "Shaqaale bulsho"
      ],
      "en": [
        "Journalist",
        "Writer or translator",
        "Psychologist",
        "Social worker"
      ],
      "ar": [
        "صحفي",
        "كاتب أو مترجم",
        "أخصائي نفسي",
        "أخصائي اجتماعي"
      ]
    },
    "tips": {
      "so": [
        "Qor maqaallo gaagaaban ama joornaal si aad u horumariso qoraalkaaga.",
        "Akhri buugaag kala duwan oo ku saabsan taariikhda iyo bulshada.",
        "Ka qaybgal kooxda warbaahinta ama doodda dugsiga."
      ],
      "en": [
        "Write short articles or a journal to improve your writing.",
        "Read widely about history and society.",
        "Join a school media or debate club."
      ],
      "ar": [
        "اكتب مقالات قصيرة أو يوميات لتطوير كتابتك.",
        "اقرأ كثيرًا في التاريخ والمجتمع.",
        "شارك في نادٍ إعلامي أو نادي مناظرات بالمدرسة."
      ]
    }
  }
];
export const sections: QuizSection[] = [
  {
    "n": {
      "so": "Bilowga",
      "en": "Getting started",
      "ar": "البداية"
    },
    "h": {
      "so": "Dooro doorashada kuugu dhow. Waxay naga caawinaysaa inaan su’aalaha kuu habeyno.",
      "en": "Choose the option that fits you best. It helps us tailor the questions for you.",
      "ar": "اختر الخيار الأقرب إليك. يساعدنا ذلك على تخصيص الأسئلة لك."
    },
    "sc": {
      "so": [],
      "en": [],
      "ar": []
    }
  },
  {
    "n": {
      "so": "Waxa aad jeceshahay",
      "en": "What you enjoy",
      "ar": "ما تستمتع به"
    },
    "h": {
      "so": "Dooro intee ayaad ku raaxaysataa hawlahan.",
      "en": "Choose how much you enjoy these activities.",
      "ar": "اختر مدى استمتاعك بهذه الأنشطة."
    },
    "sc": {
      "so": [
        "Gabi ahaanba ma jecli",
        "Wax yar ayaan jeclahay",
        "Dhexdhexaad",
        "Waan jeclahay",
        "Aad baan u jeclahay"
      ],
      "en": [
        "Not at all",
        "A little",
        "Neutral",
        "I like it",
        "I like it a lot"
      ],
      "ar": [
        "لا أحبه إطلاقاً",
        "أحبه قليلاً",
        "محايد",
        "أحبه",
        "أحبه كثيراً"
      ]
    }
  },
  {
    "n": {
      "so": "Natiijadaadii dugsiga",
      "en": "Your school results",
      "ar": "نتائجك الدراسية"
    },
    "h": {
      "so": "Dooro natiijadii aad ka heshay maaddooyinka dugsiga sare. Haddii aadan qaadan ama aadan xasuusan, ka bood.",
      "en": "Choose the result you got in each subject in secondary school. If you did not take it or do not remember, skip.",
      "ar": "اختر النتيجة التي حصلت عليها في كل مادة في الثانوية. إذا لم تدرسها أو لا تتذكر، فتجاوز السؤال."
    },
    "sc": {
      "so": [
        "Hoose",
        "Wax ka hooseeya celceliska",
        "Dhexdhexaad",
        "Wanaagsan",
        "Aad u wanaagsan"
      ],
      "en": [
        "Low",
        "Below average",
        "Average",
        "Good",
        "Very good"
      ],
      "ar": [
        "منخفضة",
        "أقل من المتوسط",
        "متوسطة",
        "جيدة",
        "جيدة جداً"
      ]
    }
  },
  {
    "n": {
      "so": "Tijaabo gaaban",
      "en": "Short test",
      "ar": "اختبار قصير"
    },
    "h": {
      "so": "Tani ma aha imtixaan. Waxay naga caawinaysaa inaan fahanno sida aad wax u fikirto. Haddii aadan hubin, ka bood.",
      "en": "This is not an exam. It helps us understand how you think. If you are not sure, skip.",
      "ar": "هذا ليس امتحاناً. إنه يساعدنا على فهم طريقة تفكيرك. إذا لم تكن متأكداً، فتجاوز السؤال."
    },
    "sc": {
      "so": [],
      "en": [],
      "ar": []
    }
  },
  {
    "n": {
      "so": "Waxa kuu muhiim ah",
      "en": "What matters to you",
      "ar": "ما يهمّك"
    },
    "h": {
      "so": "Dooro intee ayaad ku raacsan tahay hadalkan.",
      "en": "Choose how much you agree with the statement.",
      "ar": "اختر مدى موافقتك على العبارة."
    },
    "sc": {
      "so": [
        "Gabi ahaanba kuma raacsani",
        "Kuma raacsani",
        "Dhexdhexaad",
        "Waan ku raacsanahay",
        "Aad baan ugu raacsanahay"
      ],
      "en": [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree"
      ],
      "ar": [
        "لا أوافق إطلاقاً",
        "لا أوافق",
        "محايد",
        "أوافق",
        "أوافق بشدة"
      ]
    }
  }
];
export const items: QuizItem[] = [
  {
    "type": "sc",
    "k": "scr",
    "s": 0,
    "t": {
      "so": "Marka aad firaaqo hesho, maxaad ugu jeceshahay inaad sameyso?",
      "en": "In your free time, what do you most enjoy doing?",
      "ar": "في وقت فراغك، ما الذي تحب فعله أكثر؟"
    },
    "o": {
      "so": [
        "Inaan caawiyo ama daryeelo dadka buka",
        "Inaan hagaajiyo mashiinno, kombuyuutar ama dhismo",
        "Inaan doodo, wax qoro ama dadka wax baro",
        "Inaan wax iibiyo, ganacsi sameeyo ama koox hoggaamiyo",
        "Inaan beero, xoolaha ama dabeecadda ku mashquulo"
      ],
      "en": [
        "Helping or caring for sick people",
        "Fixing machines, computers, or buildings",
        "Debating, writing, or teaching people",
        "Selling, doing business, or leading a team",
        "Spending time on farms, animals, or nature"
      ],
      "ar": [
        "مساعدة المرضى أو رعايتهم",
        "إصلاح الآلات أو الحواسيب أو المباني",
        "المناظرة أو الكتابة أو تعليم الناس",
        "البيع أو التجارة أو قيادة فريق",
        "قضاء الوقت في المزارع أو مع الحيوانات أو في الطبيعة"
      ]
    },
    "ow": [
      {
        "health": 2
      },
      {
        "tech": 2
      },
      {
        "society": 2
      },
      {
        "business": 2
      },
      {
        "nature": 2
      }
    ]
  },
  {
    "type": "sc",
    "k": "scr",
    "s": 0,
    "t": {
      "so": "Dhibaatada aad jeceshahay inaad xalliso waa?",
      "en": "Which problem would you most like to solve?",
      "ar": "ما المشكلة التي تود حلّها أكثر؟"
    },
    "o": {
      "so": [
        "Cudur ama xanuun dadka ku dhaca",
        "Nidaam, qalab ama barnaamij aan shaqaynayn",
        "Xaq la’aan ama isku-dhac bulshada ka dhex jirta",
        "Ganacsi ama shirkad lacag waysey",
        "Abaar, cunto yaraan ama xoolo dhimanaya"
      ],
      "en": [
        "A disease or illness affecting people",
        "A system, device, or program that does not work",
        "Injustice or conflict within society",
        "A business or company that is losing money",
        "Drought, food shortage, or dying livestock"
      ],
      "ar": [
        "مرض أو علّة تصيب الناس",
        "نظام أو جهاز أو برنامج لا يعمل",
        "ظلم أو نزاع داخل المجتمع",
        "مشروع أو شركة تخسر المال",
        "جفاف أو نقص غذاء أو موت المواشي"
      ]
    },
    "ow": [
      {
        "health": 2
      },
      {
        "tech": 2
      },
      {
        "society": 2
      },
      {
        "business": 2
      },
      {
        "nature": 2
      }
    ]
  },
  {
    "type": "sc",
    "k": "scr",
    "s": 0,
    "t": {
      "so": "Maaddada dugsiga aad ugu jeclayd waa?",
      "en": "Which school subject did you enjoy most?",
      "ar": "ما المادة الدراسية التي أحببتها أكثر؟"
    },
    "o": {
      "so": [
        "Bayoloji ama Kimistari",
        "Xisaab, Fiisigis ama Kombuyuutar",
        "Luqadda, Taariikhda ama Diinta",
        "Dhaqaale ama Ganacsi",
        "Juqraafi ama Sayniska deegaanka"
      ],
      "en": [
        "Biology or Chemistry",
        "Mathematics, Physics, or Computer studies",
        "Language, History, or Religion",
        "Economics or Business",
        "Geography or Environmental science"
      ],
      "ar": [
        "الأحياء أو الكيمياء",
        "الرياضيات أو الفيزياء أو الحاسوب",
        "اللغة أو التاريخ أو الدين",
        "الاقتصاد أو التجارة",
        "الجغرافيا أو علوم البيئة"
      ]
    },
    "ow": [
      {
        "health": 2,
        "nature": 1
      },
      {
        "tech": 2,
        "business": 1
      },
      {
        "society": 2
      },
      {
        "business": 2,
        "society": 1
      },
      {
        "nature": 2
      }
    ]
  },
  {
    "type": "sc",
    "k": "scr",
    "s": 0,
    "t": {
      "so": "Shaqada riyadaada waa?",
      "en": "What is your dream job?",
      "ar": "ما هي وظيفة أحلامك؟"
    },
    "o": {
      "so": [
        "Dhakhtar, kalkaaliye ama shaqaale caafimaad",
        "Injineer, barnaamijiye ama duuliye",
        "Garsoore, macallin, weriye ama siyaasi",
        "Ganacsade, bangi ama maamule",
        "Beeralay, dhakhtarka xoolaha ama ilaaliyaha deegaanka"
      ],
      "en": [
        "Doctor, nurse, or health worker",
        "Engineer, programmer, or pilot",
        "Judge, teacher, journalist, or politician",
        "Businessperson, banker, or manager",
        "Farmer, veterinarian, or environmental protector"
      ],
      "ar": [
        "طبيب أو ممرض أو عامل صحي",
        "مهندس أو مبرمج أو طيار",
        "قاضٍ أو معلم أو صحفي أو سياسي",
        "رجل أعمال أو مصرفي أو مدير",
        "مزارع أو طبيب بيطري أو حامي للبيئة"
      ]
    },
    "ow": [
      {
        "health": 2
      },
      {
        "tech": 2
      },
      {
        "society": 2
      },
      {
        "business": 2
      },
      {
        "nature": 2
      }
    ]
  },
  {
    "type": "l",
    "k": "care",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan bukaan si toos ah u daryeelo maalin kasta, anigoo la hadlaya oo u naxariisanaya",
      "en": "Caring directly for a patient every day, talking with them and reassuring them",
      "ar": "رعاية مريض بشكل مباشر كل يوم، والتحدث معه وطمأنته"
    }
  },
  {
    "type": "l",
    "k": "surg",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan qalliin ama daaweyn gacmeed oo sax ah sameeyo",
      "en": "Performing precise surgery or hands-on treatment",
      "ar": "إجراء عملية جراحية أو علاج يدوي بدقة"
    }
  },
  {
    "type": "l",
    "k": "teeth",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ka shaqeeyo ilkaha iyo afka, sida nadiifinta, buuxinta iyo daaweynta ilkaha",
      "en": "Working on teeth and the mouth, such as cleaning, fillings, and dental treatment",
      "ar": "العمل على الأسنان والفم، مثل التنظيف والحشوات وعلاج الأسنان"
    }
  },
  {
    "type": "l",
    "k": "lab",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan shaybaar ku shaqeeyo oo baadho dhiig, bakteeriya ama caabuqa",
      "en": "Working in a laboratory testing blood, bacteria, or infections",
      "ar": "العمل في مختبر لفحص الدم أو البكتيريا أو العدوى"
    }
  },
  {
    "type": "l",
    "k": "comm",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan dadka bulshada baro sida looga hortago cudurada iyo sida loo cuno cunto fiican",
      "en": "Teaching communities how to prevent diseases and eat healthily",
      "ar": "تعليم المجتمع كيفية الوقاية من الأمراض والتغذية الصحية"
    }
  },
  {
    "type": "l",
    "k": "care",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan caawiyo dumarka uurka leh iyo dhalmada",
      "en": "Helping pregnant women and childbirth",
      "ar": "مساعدة النساء الحوامل والولادة"
    }
  },
  {
    "type": "l",
    "k": "anim",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan daryeelo xoolaha jirran, sida geela, riyaha ama ariga",
      "en": "Caring for sick animals, such as camels, goats, or sheep",
      "ar": "رعاية الحيوانات المريضة، مثل الإبل والماعز والأغنام"
    }
  },
  {
    "type": "l",
    "k": "diag",
    "s": 1,
    "c": [
      "health"
    ],
    "deep": true,
    "t": {
      "so": "Inaan baadho calaamadaha cudurka oo go’aan ka gaaro sababta iyo daaweynta saxda ah",
      "en": "Investigating why a disease occurred and deciding the right treatment",
      "ar": "البحث عن سبب المرض واتخاذ قرار بالعلاج المناسب"
    }
  },
  {
    "type": "l",
    "k": "code",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan qoro koodh ama dhiso app ama website",
      "en": "Writing code or building an app or website",
      "ar": "كتابة البرمجيات أو بناء تطبيق أو موقع إلكتروني"
    }
  },
  {
    "type": "l",
    "k": "build",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan naqshadeeyo guri, buundo ama waddo, oo aan arko sida loo dhiso",
      "en": "Designing a house, bridge, or road and seeing how it is built",
      "ar": "تصميم منزل أو جسر أو طريق ومتابعة كيفية بنائه"
    }
  },
  {
    "type": "l",
    "k": "elec",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ku shaqeeyo korontada iyo qalabka elektaroonigga ah",
      "en": "Working with electricity and electronic equipment",
      "ar": "العمل مع الكهرباء والمعدات الإلكترونية"
    }
  },
  {
    "type": "l",
    "k": "fly",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ka shaqeeyo garoonka diyaaradaha, duulimaadyada ama maamulka hawada",
      "en": "Working at an airport, with flights, or in air traffic management",
      "ar": "العمل في المطار أو مع الرحلات الجوية أو إدارة الحركة الجوية"
    }
  },
  {
    "type": "l",
    "k": "code",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ilaaliyo kombuyuutarrada iyo xogta dadka kuwa jabsada",
      "en": "Protecting computers and people's data from hackers",
      "ar": "حماية الحواسيب وبيانات الناس من المخترقين"
    }
  },
  {
    "type": "l",
    "k": "code",
    "s": 1,
    "c": [
      "tech"
    ],
    "deep": true,
    "t": {
      "so": "Inaan falanqeeyo xog badan oo aan ka soo saaro natiijo faa’iido leh",
      "en": "Analysing lots of data to draw useful conclusions",
      "ar": "تحليل كمية كبيرة من البيانات لاستخلاص نتائج مفيدة"
    }
  },
  {
    "type": "l",
    "k": "just",
    "s": 1,
    "c": [
      "society"
    ],
    "deep": true,
    "t": {
      "so": "Inaan qof sharci ahaan u difaaco ama aan khilaaf dadka u dhexeeya xalliyo",
      "en": "Defending someone legally or resolving a dispute between people",
      "ar": "الدفاع عن شخص قانونياً أو حل نزاع بين الناس"
    }
  },
  {
    "type": "l",
    "k": "gov",
    "s": 1,
    "c": [
      "society"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ka shaqeeyo maamulka dowladda ama siyaasadda",
      "en": "Working in government administration or politics",
      "ar": "العمل في الإدارة الحكومية أو السياسة"
    }
  },
  {
    "type": "l",
    "k": "media",
    "s": 1,
    "c": [
      "society"
    ],
    "deep": true,
    "t": {
      "so": "Inaan wariyo, qoro ama sameeyo barnaamij warbaahineed",
      "en": "Reporting, writing, or producing media programmes",
      "ar": "إعداد التقارير أو الكتابة أو إنتاج برامج إعلامية"
    }
  },
  {
    "type": "l",
    "k": "teach",
    "s": 1,
    "c": [
      "society"
    ],
    "deep": true,
    "t": {
      "so": "Inaan dugsi dhigo ama dadka tababaro si joogto ah",
      "en": "Teaching at a school or training people regularly",
      "ar": "التدريس في مدرسة أو تدريب الناس بانتظام"
    }
  },
  {
    "type": "l",
    "k": "gov",
    "s": 1,
    "c": [
      "society"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ka shaqeeyo xiriirka caalamka iyo diblomaasiyadda",
      "en": "Working in international relations and diplomacy",
      "ar": "العمل في العلاقات الدولية والدبلوماسية"
    }
  },
  {
    "type": "l",
    "k": "acct",
    "s": 1,
    "c": [
      "business"
    ],
    "deep": true,
    "t": {
      "so": "Inaan xisaabiyo lacagta oo qoro warbixinno maaliyadeed",
      "en": "Doing accounts and writing financial reports",
      "ar": "إجراء الحسابات وكتابة التقارير المالية"
    }
  },
  {
    "type": "l",
    "k": "mkt",
    "s": 1,
    "c": [
      "business"
    ],
    "deep": true,
    "t": {
      "so": "Inaan suuq-geeyo alaab oo helo macaamiil cusub",
      "en": "Marketing products and winning new customers",
      "ar": "تسويق المنتجات واكتساب عملاء جدد"
    }
  },
  {
    "type": "l",
    "k": "ops",
    "s": 1,
    "c": [
      "business"
    ],
    "deep": true,
    "t": {
      "so": "Inaan nidaamiyo gaadiidka, bakhaarka iyo keenista alaabta",
      "en": "Organising transport, warehouses, and the delivery of goods",
      "ar": "تنظيم النقل والمستودعات وتوصيل البضائع"
    }
  },
  {
    "type": "l",
    "k": "proj",
    "s": 1,
    "c": [
      "business"
    ],
    "deep": true,
    "t": {
      "so": "Inaan maareeyo mashruuc, miisaaniyad iyo waqti",
      "en": "Managing a project, a budget, and a schedule",
      "ar": "إدارة مشروع وميزانية وجدول زمني"
    }
  },
  {
    "type": "l",
    "k": "proj",
    "s": 1,
    "c": [
      "business"
    ],
    "deep": true,
    "t": {
      "so": "Inaan bilaabo ganacsi aniga u gaar ah oo aan maareeyo",
      "en": "Starting and running my own business",
      "ar": "بدء مشروع تجاري خاص بي وإدارته"
    }
  },
  {
    "type": "l",
    "k": "crop",
    "s": 1,
    "c": [
      "nature"
    ],
    "deep": true,
    "t": {
      "so": "Inaan beero ama dhirta kobciyo oo yareeyo khasaaraha dalagga",
      "en": "Growing crops or plants and reducing crop losses",
      "ar": "زراعة المحاصيل أو النباتات وتقليل خسائر الإنتاج"
    }
  },
  {
    "type": "l",
    "k": "env",
    "s": 1,
    "c": [
      "nature"
    ],
    "deep": true,
    "t": {
      "so": "Inaan ilaaliyo deegaanka, biyaha iyo cimilada",
      "en": "Protecting the environment, water, and climate",
      "ar": "حماية البيئة والمياه والمناخ"
    }
  },
  {
    "type": "l",
    "k": "anim",
    "s": 1,
    "c": [
      "nature"
    ],
    "deep": true,
    "t": {
      "so": "Inaan xoolaha daryeelo, calaf iyo daawo",
      "en": "Looking after livestock, feeding and treating them",
      "ar": "رعاية الماشية وتغذيتها وعلاجها"
    }
  },
  {
    "type": "l",
    "k": "env",
    "s": 1,
    "c": [
      "nature"
    ],
    "deep": true,
    "t": {
      "so": "Inaan baadho carrada, abaaraha iyo sida cuntada loo badin karo",
      "en": "Studying soil, droughts, and how to increase food production",
      "ar": "دراسة التربة والجفاف وكيفية زيادة إنتاج الغذاء"
    }
  },
  {
    "k": "R",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Hagaajinta waxyaabaha jaban, sida taleefan, baaskiil, nal ama mashiin",
      "en": "Fixing broken things, such as phones, bicycles, lights, or machines",
      "ar": "إصلاح الأشياء المعطّلة، مثل الهواتف والدراجات والمصابيح والآلات"
    },
    "c": [
      "tech"
    ]
  },
  {
    "k": "I",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Ogaanshaha sida wax u shaqeeyaan iyo sababta ay u dhacaan",
      "en": "Understanding how things work and why they happen",
      "ar": "فهم كيف تعمل الأشياء ولماذا تحدث"
    },
    "c": [
      "tech",
      "health",
      "nature"
    ]
  },
  {
    "k": "A",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Sawirka, naqshadaynta, ama samaynta muuqaallo iyo qaabab quruxsan",
      "en": "Drawing, designing, or creating beautiful visuals and styles",
      "ar": "الرسم والتصميم أو صناعة مظاهر وأشكال جميلة"
    },
    "c": [
      "tech"
    ]
  },
  {
    "k": "S",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Daryeelka dadka buka ama dhibaataysan",
      "en": "Caring for people who are sick or in difficulty",
      "ar": "رعاية الأشخاص المرضى أو الذين يمرون بصعوبة"
    },
    "c": [
      "health"
    ]
  },
  {
    "k": "E",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Hoggaaminta koox, sida kooxda kubadda, shirka ama mashruuc",
      "en": "Leading a group, such as a football team, a meeting, or a project",
      "ar": "قيادة مجموعة، مثل فريق كرة القدم أو اجتماع أو مشروع"
    },
    "c": [
      "business",
      "society"
    ]
  },
  {
    "k": "C",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Hubinta lacagta, tirinta iyo diiwaangelinta si nidaamsan",
      "en": "Checking money, counting, and keeping records in an organised way",
      "ar": "مراجعة الأموال والعدّ وحفظ السجلات بشكل منظّم"
    },
    "c": [
      "business"
    ]
  },
  {
    "k": "R",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Shaqo bannaanka ah, sida beero, xoolo ama dhismo",
      "en": "Working outdoors, such as farming, with animals, or on construction",
      "ar": "العمل في الهواء الطلق، مثل الزراعة أو مع الحيوانات أو في البناء"
    },
    "c": [
      "nature",
      "tech"
    ]
  },
  {
    "k": "I",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Xallinta xujooyin adag iyo ciyaaraha u baahan fikir qoto dheer",
      "en": "Solving hard puzzles and thinking games, such as chess",
      "ar": "حل الألغاز الصعبة وألعاب التفكير، مثل الشطرنج"
    },
    "c": [
      "tech",
      "health"
    ]
  },
  {
    "k": "A",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Abuurista fikrado cusub, sida sheeko, ciyaar ama ganacsi",
      "en": "Coming up with new ideas, such as a story, a game, or a business",
      "ar": "ابتكار أفكار جديدة، مثل قصة أو لعبة أو مشروع تجاري"
    },
    "c": [
      "business",
      "tech",
      "society"
    ]
  },
  {
    "k": "S",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Baridda iyo tababarka dadka kale, sida carruurta ama asxaabta",
      "en": "Teaching or training others, such as children or friends",
      "ar": "تعليم الآخرين أو تدريبهم، مثل الأطفال أو الأصدقاء"
    },
    "c": [
      "society",
      "health"
    ]
  },
  {
    "k": "E",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Iibinta alaabta ama ka dhaadhicinta dadka fikrad",
      "en": "Selling products or convincing people of an idea",
      "ar": "بيع المنتجات أو إقناع الناس بفكرة"
    },
    "c": [
      "business",
      "society"
    ]
  },
  {
    "k": "C",
    "s": 1,
    "type": "l",
    "t": {
      "so": "Raacidda tilmaamo iyo xeerar si taxaddar leh",
      "en": "Following instructions and rules carefully",
      "ar": "اتباع التعليمات والقواعد بدقة"
    },
    "c": [
      "society",
      "business"
    ]
  },
  {
    "k": "math",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Xisaab",
      "en": "Mathematics",
      "ar": "الرياضيات"
    },
    "c": [
      "tech",
      "business"
    ]
  },
  {
    "k": "bio",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Bayoloji",
      "en": "Biology",
      "ar": "الأحياء"
    },
    "c": [
      "health",
      "nature"
    ]
  },
  {
    "k": "lang",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Ingiriisi",
      "en": "English",
      "ar": "اللغة الإنجليزية"
    }
  },
  {
    "k": "ict",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Kombuyuutar (haddii aad bartay)",
      "en": "Computer studies (if you took it)",
      "ar": "الحاسوب (إن درسته)"
    },
    "c": [
      "tech",
      "business"
    ]
  },
  {
    "k": "soc",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Taariikh, Juqraafi ama Dhaqaale",
      "en": "History, Geography or Economics",
      "ar": "التاريخ أو الجغرافيا أو الاقتصاد"
    },
    "c": [
      "society",
      "business",
      "nature"
    ]
  },
  {
    "k": "math",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Fiisigis",
      "en": "Physics",
      "ar": "الفيزياء"
    },
    "c": [
      "tech"
    ]
  },
  {
    "k": "bio",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Kimistari",
      "en": "Chemistry",
      "ar": "الكيمياء"
    },
    "c": [
      "health",
      "nature"
    ]
  },
  {
    "k": "lang",
    "s": 2,
    "type": "l",
    "t": {
      "so": "Af-Soomaali ama Carabi",
      "en": "Somali or Arabic language",
      "ar": "اللغة الصومالية أو العربية"
    },
    "c": [
      "society"
    ]
  },
  {
    "k": "math",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 2,
    "t": {
      "so": "Shirkad bishii hore waxay heshay $4,000 oo dakhli ah. Bishan dakhligu wuxuu kordhay 15%, kadibna kharashka guud wuxuu noqday $3,100. Faa'iidada saafiga ah ee bishan waa:",
      "en": "A company earned $4,000 last month. This month revenue rose by 15%, and total expenses were $3,100. What is this month's net profit?",
      "ar": "حققت شركة إيرادات قدرها 4,000 دولار الشهر الماضي. هذا الشهر ارتفعت الإيرادات بنسبة 15%، وبلغت المصاريف 3,100 دولار. كم صافي الربح هذا الشهر؟"
    },
    "o": {
      "so": [
        "$1,200",
        "$1,500",
        "$1,600",
        "$900"
      ],
      "en": [
        "$1,200",
        "$1,500",
        "$1,600",
        "$900"
      ],
      "ar": [
        "1,200 دولار",
        "1,500 دولار",
        "1,600 دولار",
        "900 دولار"
      ]
    }
  },
  {
    "k": "ict",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 2,
    "t": {
      "so": "Barnaamij ayaa hubiya baasidda ardayga: haddii dhibcuhu yihiin 50 ama ka badan OO uusan ka maqnayn imtixaanka kama dambaysta ah, wuu baasay. Axmed wuxuu helay 68 balse wuu ka maqnaa imtixaanka kama dambaysta ah. Natiijada barnaamijku waa:",
      "en": "A program checks if a student passed: score must be at least 50 AND final exam attended. Ahmed scored 68 but missed the final exam. What does the program output?",
      "ar": "يتحقق برنامج من نجاح الطالب بشرطين معاً: درجة 50 فأكثر وحضور الاختبار النهائي. حصل أحمد على 68 لكنه تغيب عن الاختبار النهائي. ما نتيجة البرنامج؟"
    },
    "o": {
      "so": [
        "Wuu baasay",
        "Ma baasin",
        "Dhibcaha ayaa kordhaya",
        "Lama xisaabin karo"
      ],
      "en": [
        "Passed",
        "Failed",
        "Score increases",
        "Cannot be computed"
      ],
      "ar": [
        "ناجح",
        "راسب",
        "تزداد الدرجة",
        "لا يمكن الحساب"
      ]
    }
  },
  {
    "k": "lang",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 2,
    "t": {
      "so": "Cilmi-baaris jaamacadeed ayaa muujisay in ardayda barta xirfadaha ficilka ah (sida xisaabta, barnaamij-qorista ama shaybaarka) inta ay jaamacadda dhigtaan ay shaqo helaan labo jeer ka degdeg badan kuwa buugaagta keliya akhriya.\n\nUjeeddada ugu weyn ee qoraalkan waa:",
      "en": "University research shows that students who build practical skills (such as accounting, coding, or lab work) during university get hired twice as fast as those who only read textbooks.\n\nWhat is the main conclusion of this statement?",
      "ar": "أظهر بحث جامعي أن الطلاب الذين يكتسبون مهارات عملية (مثل المحاسبة أو البرمجة أو العمل المخبري) أثناء الدراسة يحصلون على وظيفة أسرع بمرتين ممن يكتفون بقراءة الكتب.\n\nما الفكرة الرئيسية في هذا النص؟"
    },
    "o": {
      "so": [
        "In buugaagta jaamacadda aan loo baahnayn",
        "In xirfadda ficilka ah ay kordhiso fursadda shaqo ee qalin-jabinta kadib",
        "In dhammaan ardaydu bartaan barnaamij-qorista keliya",
        "In shaqo la heli karo iyadoon jaamacad la gelin"
      ],
      "en": [
        "University textbooks are unnecessary",
        "Practical skills significantly improve job prospects after graduation",
        "Every student must study programming only",
        "University education has no value"
      ],
      "ar": [
        "الكتب الجامعية غير ضرورية",
        "المهارات العملية تزيد بشكل كبير فرص التوظيف بعد التخرج",
        "يجب على جميع الطلاب دراسة البرمجة فقط",
        "لا فائدة من الدراسة الجامعية"
      ]
    }
  },
  {
    "k": "math",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 2,
    "t": {
      "so": "Daawo ayaa loogu qoraa bukaan 5 mg halkii kiilogaraam oo miisaankiisa ah maalintii. Haddii bukaanku miisaankiisu yahay 60 kg, oo daawada loo qaybiyo 2 jeer maalintii, qiyaasta hal mar la siinayo waa:",
      "en": "A medication dosage is 5 mg per kg of body weight per day. If a patient weighs 60 kg and takes it in 2 equal doses daily, what is each single dose?",
      "ar": "جرعة دواء هي 5 ملغ لكل كيلوغرام من وزن المريض يومياً. إذا كان وزن المريض 60 كغ ويأخذ الدواء على جرعتين متساويتين يومياً، كم مقدار الجرعة الواحدة؟"
    },
    "o": {
      "so": [
        "300 mg",
        "150 mg",
        "120 mg",
        "60 mg"
      ],
      "en": [
        "300 mg",
        "150 mg",
        "120 mg",
        "60 mg"
      ],
      "ar": [
        "300 ملغ",
        "150 ملغ",
        "120 ملغ",
        "60 ملغ"
      ]
    },
    "c": [
      "health",
      "business",
      "tech",
      "nature"
    ]
  },
  {
    "k": "ict",
    "s": 3,
    "type": "m",
    "a": 2,
    "d": 2,
    "t": {
      "so": "Nidaam xog-kaydin ah ayaa saacad kasta labanlaaba tirada faylasha uu habeeyo: 3, 6, 12, 24, ... Saacadda 6aad immisa fayl ayuu habeynayaa?",
      "en": "A data system doubles the number of files it processes every hour: 3, 6, 12, 24, ... How many files will it process in hour 6?",
      "ar": "نظام معالجة بيانات يضاعف عدد الملفات كل ساعة: 3، 6، 12، 24، ... كم ملفاً سيعالج في الساعة السادسة؟"
    },
    "o": {
      "so": [
        "48",
        "72",
        "96",
        "128"
      ],
      "en": [
        "48",
        "72",
        "96",
        "128"
      ],
      "ar": [
        "48",
        "72",
        "96",
        "128"
      ]
    },
    "c": [
      "tech",
      "business"
    ]
  },
  {
    "k": "lang",
    "s": 3,
    "type": "m",
    "a": 0,
    "d": 2,
    "t": {
      "so": "Xeer jaamacadeed ayaa dhigaya: 'Ardaygii ka maqnaada in ka badan 25% fasallada ma geli karo imtixaanka, haddii uusan keenin warqad dhakhtar oo rasmi ah.' Arday ka maqnaaday 30% oo keenay warqad dhakhtar oo rasmi ah:",
      "en": "A university rule states: 'Any student who misses more than 25% of classes cannot sit the final exam unless they submit an official medical certificate.' A student missed 30% and submitted an official medical certificate:",
      "ar": "ينص نظام جامعي على أن: 'الطالب الذي يتغيب عن أكثر من 25% من المحاضرات يُحرم من الاختبار النهائي، إلا إذا قدّم تقريراً طبياً رسمياً'. طالب تغيب بنسبة 30% وقدّم تقريراً طبياً رسمياً:"
    },
    "o": {
      "so": [
        "Wuu geli karaa imtixaanka maadaama uu buuxiyay shuruudda ka-reebista",
        "Ma geli karo imtixaanka xaalad kasta",
        "Waa inuu dib u dhigtaa sannadka oo dhan",
        "Xeerku ma quseeyo ardaygaas"
      ],
      "en": [
        "May sit the exam because they met the exception condition",
        "Cannot sit the exam under any circumstance",
        "Must repeat the entire academic year",
        "The rule does not mention medical cases"
      ],
      "ar": [
        "يحق له دخول الاختبار لأنه استوفى شرط الاستثناء",
        "لا يحق له دخول الاختبار في جميع الأحوال",
        "يجب عليه إعادة السنة الدراسية كاملة",
        "النظام لا يذكر الحالات الطبية"
      ]
    }
  },
  {
    "k": "math",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 2,
    "t": {
      "so": "Laba iska-caabbi (resistors) oo midkiiba yahay 10 Ohm ayaa si isku xigta (series) loogu xiray batari 20 Volt ah. Qulqulka korontada (Current = V / R_total) ee maraya wareegga waa:",
      "en": "Two 10-Ohm resistors are connected in series to a 20-Volt battery. What is the electric current (Current = V / R_total) flowing through the circuit?",
      "ar": "تم توصيل مقاومتين قيمة كل منهما 10 أوم على التوالي مع بطارية 20 فولت. ما شدة التيار الكهربائي (التيار = الجهد / المقاومة الكلية)؟"
    },
    "o": {
      "so": [
        "0.5 Ampere",
        "1 Ampere",
        "2 Ampere",
        "4 Ampere"
      ],
      "en": [
        "0.5 Ampere",
        "1 Ampere",
        "2 Ampere",
        "4 Ampere"
      ],
      "ar": [
        "0.5 أمبير",
        "1 أمبير",
        "2 أمبير",
        "4 أمبير"
      ]
    },
    "c": [
      "tech"
    ]
  },
  {
    "k": "math",
    "s": 3,
    "type": "m",
    "a": 1,
    "d": 3,
    "t": {
      "so": "Koox 4 injineer ah ayaa mashruuc dhammaystira 15 maalmood. Haddii 2 injineer oo kale oo isla xawaarahaas leh lagu soo daro bilowga, mashruucu wuxuu ku dhammaanayaa:",
      "en": "A team of 4 engineers completes a project in 15 days. If 2 more engineers working at the same pace join from the start, how many days will the project take?",
      "ar": "فريق من 4 مهندسين ينجز مشروعاً في 15 يوماً. إذا انضم إليهم مهندسان إضافيان بنفس السرعة منذ البداية، فكم يوماً يستغرق المشروع؟"
    },
    "o": {
      "so": [
        "8 maalmood",
        "10 maalmood",
        "12 maalmood",
        "20 maalmood"
      ],
      "en": [
        "8 days",
        "10 days",
        "12 days",
        "20 days"
      ],
      "ar": [
        "8 أيام",
        "10 أيام",
        "12 يوماً",
        "20 يوماً"
      ]
    },
    "c": [
      "tech",
      "business",
      "nature"
    ]
  },
  {
    "k": "ict",
    "s": 3,
    "type": "m",
    "a": 0,
    "d": 3,
    "t": {
      "so": "Dhammaan shirkadaha ku guulaysta suuqa caalamiga ah waxay leeyihiin adeeg macmiil oo degdeg ah. Shirkadda X adeeggeeda macmiilku wuu gaabiyaa. Sidaas darteed:",
      "en": "All companies that succeed globally have fast customer support. Company X has slow customer support. Therefore:",
      "ar": "جميع الشركات الناجحة عالمياً تمتلك خدمة عملاء سريعة. خدمة العملاء في الشركة X بطيئة. بناءً على ذلك:"
    },
    "o": {
      "so": [
        "Shirkadda X ma buuxin shuruudda guusha suuqa caalamiga ah",
        "Shirkadda X way ku guulaysatay suuqa caalamiga ah",
        "Adeegga macmiilku muhiim ma aha",
        "Lama go'aamin karo"
      ],
      "en": [
        "Company X does not meet the condition for global success",
        "Company X has succeeded globally",
        "Customer support is not important",
        "Cannot be determined"
      ],
      "ar": [
        "الشركة X لا تستوفي شرط النجاح في السوق العالمي",
        "الشركة X نجحت في السوق العالمي",
        "خدمة العملاء غير مهمة",
        "لا يمكن تحديد ذلك"
      ]
    }
  },
  {
    "k": "blood",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Waxaan qaadan karaa inaan arko dhiig ama dhaawac, oo aan degenaado",
      "en": "I can see blood or injuries and stay calm",
      "ar": "أستطيع رؤية الدم أو الإصابات والبقاء هادئاً"
    },
    "c": [
      "health"
    ]
  },
  {
    "k": "long",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Waxaan diyaar u ahay inaan waxbarasho dheer oo adag sii wado dhowr sano",
      "en": "I am ready to continue demanding study for several years",
      "ar": "أنا مستعد لمواصلة دراسة طويلة وصعبة لعدة سنوات"
    },
    "c": [
      "health",
      "tech",
      "society"
    ]
  },
  {
    "k": "help",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Waxaan rabaa in shaqadaydu si toos ah u badbaadiso ama u caawiso dadka",
      "en": "I want my work to directly save or help people's lives",
      "ar": "أريد أن يُنقذ عملي حياة الناس أو يساعدهم بشكل مباشر"
    },
    "c": [
      "health",
      "society",
      "nature"
    ]
  },
  {
    "k": "money",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Dakhli sare iyo fursad ganacsi ayaa ii muhiim ah",
      "en": "A high income and business opportunities matter to me",
      "ar": "الدخل المرتفع وفرص العمل التجاري مهمة بالنسبة لي"
    }
  },
  {
    "k": "stable",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Waxaan door bidayaa shaqo degan oo mushahar joogto ah",
      "en": "I prefer a stable job with a regular salary",
      "ar": "أفضّل وظيفة مستقرة براتب منتظم"
    }
  },
  {
    "k": "field",
    "s": 4,
    "type": "l",
    "t": {
      "so": "Waxaan door bidayaa shaqo aan ku fadhiisan xafiis, sida garoomada, beeraha, goobaha dhismaha ama safarka",
      "en": "I prefer work away from an office, such as airports, farms, construction sites, or travel",
      "ar": "أفضّل العمل خارج المكتب، مثل المطارات والمزارع ومواقع البناء أو السفر"
    },
    "c": [
      "tech",
      "nature",
      "business"
    ]
  }
];
