export interface Top10Trick {
  id: string;
  tag: string;
  title: string;
  whyItWorks: string;
  steps: string[];
  avoid: string;
}

export interface LegalSubjectSecret {
  id: string;
  code: string;
  name: string;
  group: "science" | "language" | "social" | "applied";
  groupLabel: string;
  accent: string;
  examinerFocus: string;
  legalSecrets: string[];
  highYieldTopics: string[];
  commonTrap: string;
}

export interface ExamHallRule {
  id: string;
  phase: string;
  title: string;
  detail: string;
}

export const HIRAAL_INTEGRITY_CHARTER = {
  badge: "Xeerka Xalaasha ah · Zero Cheating",
  headline: "Qishku waa xaaraam: HIRAAL ma taageero qish iyo khiyaano",
  body: "Barnaamijkani kama mid aha meelaha qishka laga raadiyo. Qishku wuxuu burburiyaa barakada aqoonta, kalsoonidaada, iyo mustaqbalkaaga jaamacadeed. Xeeladaha halkan ku qoran waa habab waxbarasho oo 100% xalaal ah oo ay adeegsadaan ardayda kaalmaha Top-10 gala.",
};

export const top10StudyTricks: Top10Trick[] = [
  {
    id: "active_recall",
    tag: "Xeeladda 1aad · Xusuusta",
    title: "Active Recall (Xir Buugga oo Qor Waxaad Xasuusato)",
    whyItWorks:
      "Ardayda caadiga ahi waxay akhriyaan buugga 5 jeer, maskaxdu way ka caajistaa. Ardayda Top-10 waxay akhriyaan hal mar, kadibna way xiraan buugga oo warqad cad ayay ku tijaabiyaan waxay xasuustaan.",
    steps: [
      "Akhri hal cutub 20 daqiiqo adigoo diiradda saaraya fikradaha waaweyn.",
      "Xir buugga gabi ahaanba, kadibna qor ama sharax qaacidooyinka iyo qeexitaannada aad xasuusato.",
      "Fur buugga oo ku calaamadee qalin cas meelaha aad ilowday, meelahaas keliya ku noqo.",
    ],
    avoid: "Ha ku lumin waqti badan inaad qoraallo midabyo ku xarriiqdo adigoon is tijaabin.",
  },
  {
    id: "spaced_repetition",
    tag: "Xeeladda 2aad · Jadwalka",
    title: "Qorshaha Dib-u-Eegista 1 · 3 · 7 · 21",
    whyItWorks:
      "Maskaxda bini'aadamku waxay illowdaa 70% casharka 48 saac gudahood haddii aan dib loo eegin. Kala-fogaanshaha dib-u-eegistu wuxuu casharka u wareejiyaa xusuusta fog.",
    steps: [
      "Maalinta 1aad: Samee soo koobid yar (1 bog) kadib fasalka.",
      "Maalinta 3aad: Xalli 5 su'aalood oo cutubkaas ah adigoon eegin buugga.",
      "Maalinta 7aad & 21aad: Qaado 15 daqiiqo oo tijaabo degdeg ah si maskaxdu u adkeyso.",
    ],
    avoid: "Ha isku dayin inaad 12 maado hal habeen ka hor imtixaanka wada xafiddo.",
  },
  {
    id: "error_logbook",
    tag: "Xeeladda 3aad · Past Papers",
    title: "Buugga Qaladaadka (Error Logbook)",
    whyItWorks:
      "Ardayda ugu dhibcaha sarreeya kama shaqeeyaan oo keliya imtixaannadii hore (2018 ilaa 2026); waxay qoraan qalad kasta oo ay sameeyaan si uusan u soo noqon.",
    steps: [
      "Qaado buug gaar ah oo qeybi 12-ka maado (2 bog maado kasta).",
      "Markasta oo aad su'aal ku qaldanto tijaabada, qor: Su'aasha, qaladkaagii, iyo jawaabta saxda ah.",
      "Toddobaadka ka hor imtixaanka, dib u eeg Buugga Qaladaadka; waxaad hagaajinaysaa dhibcaha kaa lumi jiray.",
    ],
    avoid: "Ha ku farxin oo keliya inta aad saxday; baro sababta aad u qaladday kuwa yar ee kaa tagay.",
  },
  {
    id: "feynman_somali",
    tag: "Xeeladda 4aad · Faham Qoto Dheer",
    title: "Habka Feynman: Af-Soomaali Fudud Ku Sharax",
    whyItWorks:
      "Xafididda ereyo adag oo Ingiriisi ama Carabi ah iyadoo aan la fahmin waxay ku fashilantaa marka su'aasha qaabkeeda la beddelo.",
    steps: [
      "Qaado mawduuc adag (tusaale: Osmosis, Electromagnetic Induction, ama Elasticity).",
      "Ugu sharax saaxiibkaa ama naftaada Af-Soomaali fudud sidii qof aan weligiis baran.",
      "Halka aad ku istaagto ama aad ereyada ku wareerto waa meesha u baahan inaad dib u akhrido.",
    ],
    avoid: "Ha xafidin jawaabta hal su'aal oo keliya adigoon fahmin sababta ay sax u tahay.",
  },
  {
    id: "hall_pacing_60_25_15",
    tag: "Xeeladda 5aad · Hoolka Imtixaanka",
    title: "Xeerka Waqtiga 60% · 25% · 15%",
    whyItWorks:
      "Arday badan way yaqaannaan casharka laakiin wakhtiga ayaa ka dhammaada iyagoo ku dhaggan hal su'aal oo adag bilowgii.",
    steps: [
      "60% Waqtiga: U horumar su'aalaha aad 100% hubto si aad dhibco degdeg ah iyo kalsooni u hesho.",
      "25% Waqtiga: Ku xalli su'aalaha u baahan fikir iyo xisaab dhexe.",
      "15% Waqtiga: Ku hubi halbeegyada (Units), calaamadaha (+/-), iyo su'aalaha kugu adkaa.",
    ],
    avoid: "Ha ku lumin 15 daqiiqo hal su'aal oo 2 dhibic ah inta su'aalo 10 dhibic ah kaa harsan yihiin.",
  },
  {
    id: "mcq_elimination",
    tag: "Xeeladda 6aad · Imtixaannada Tartanka (JUS & MCQ)",
    title: "Ka-Saarista Xulashada Khaldan (Elimination & Units)",
    whyItWorks:
      "Imtixaannada gelitaanka jaamacadaha (JUS) iyo qaybaha MCQ waxay leeyihiin doorashooyin lagu qaldo ardayga degdega ah.",
    steps: [
      "Akhri su'aasha oo dhan ilaa dhammaadka. Iska ilaali ereyada sida: EXCEPT, NOT, ALWAYS.",
      "Ka saar 2 doorasho oo aan macquul ahayn ama halbeeggoodu (Unit) uusan la mid ahayn jawaabta la rabo.",
      "Labada haray midba midda kale la barbardhig adigoo eegaya qaanuunka ama xogta su'aasha.",
    ],
    avoid: "Ha beddelin jawaabtii hore ee aad ka fikirtay adigoon helin caddayn cusub oo cad.",
  },
];

export const examHallRules: ExamHallRule[] = [
  {
    id: "sleep_protocol",
    phase: "Habeenka Ka Horreeya",
    title: "Hurdo 7 ilaa 8 Saacadood ah (Ha Soo Jeedin)",
    detail:
      "Maskaxdu waxay xogta u beddeshaa xusuus adag xilliga hurdada qoto dheer. Soo jeedka habeenka imtixaanku wuxuu hoos u dhigaa xisaabta iyo xasuusta.",
  },
  {
    id: "scan_3_min",
    phase: "3-da Daqiiqo ee Ugu Horreysa",
    title: "Akhri Warqadda Kahor Qoraalka",
    detail:
      "Akhri warqadda oo dhan ka hor inta aadan qalin qaban. Calaamadee su'aalaha dhibcaha badan leh iyo kuwa kuu fudud.",
  },
  {
    id: "clean_numbering",
    phase: "Qaabka Qoraalka",
    title: "Nidaami Lambarrada & Meelaha Banaan",
    detail:
      "Nidaami nambarada (Q1 a, Q1 b), ka tag meel yar oo u dhexeysa jawaabaha, hana tirtirin xallin ilaa aad mid sax ah ku beddesho.",
  },
  {
    id: "no_blank_method",
    phase: "Dhibcaha Qaybta ah (Partial Credit)",
    title: "Ha Ka Tegin Meel Banaan (Qor Qaanuunka)",
    detail:
      "Xitaa haddii xisaabtu kugu adkaato, qor Xogta la siiyay (Given) iyo Qaanuunka (Formula); waxay ku siinayaan dhibco sharci ah.",
  },
];

export const legalSubjectSecrets: LegalSubjectSecret[] = [
  {
    id: "math",
    code: "MTH",
    name: "Xisaab (Mathematics)",
    group: "science",
    groupLabel: "Saynis",
    accent: "#4189DD",
    examinerFocus:
      "Macallinka saxaya wuxuu dhibcaha ugu badan (60% ilaa 70%) ku bixiyaa qaabka xallinta (Method Marks), ma aha tirada ugu dambeysa oo keliya.",
    legalSecrets: [
      "Qor tallaabo kasta si cad; haddii xisaabta ugu dambeysa kaa qaldanto, tallaabooyinka saxda ah dhibco ayaad ku helaysaa.",
      "Ku hubi jawaabta adigoo dib ugu geliya isla'egta asalka ah (Substitute back) haddii waqti kuu haro.",
      "Sawir jaantuska (Graph ama Triangle) su'aalaha Trigonometry iyo Geometry si aadan u khaldin xaglaha.",
    ],
    highYieldTopics: ["Derivatives & Integrals", "Matrices & Determinants", "Trigonometric Identities", "Probability & Vectors"],
    commonTrap: "Illowga calaamadda taban (-) marka aad furayso qowska ama aad wareejinayso dhinaca kale.",
  },
  {
    id: "phys",
    code: "PHY",
    name: "Fiisigis (Physics)",
    group: "science",
    groupLabel: "Saynis",
    accent: "#2563EB",
    examinerFocus:
      "Su'aalaha xisaabta ah waxaa lagu saxaa afar tallaabo oo aan kala go'in: Given -> Formula -> Substitution -> Unit.",
    legalSecrets: [
      "Beddel halbeegyada ka hor xisaabta (tusaale: cm u beddel m, g u beddel kg, daqiiqo u beddel ilbiriqsi).",
      "Qor halbeegga saxda ah (N, J, W, Ω, m/s²) dhammaadka jawaabta; halbeeg la'aan dhibic baa go'da.",
      "Su'aalaha qeexidda ah (Definitions) ku dar qaanuunka iyo hal tusaale oo kooban.",
    ],
    highYieldTopics: ["Newton's Laws & Momentum", "Electricity & Ohm's Law", "Waves, Optics & Lenses", "Electromagnetism"],
    commonTrap: "Isticmaalka diameter (D) halkii laga rabay radius (r = D/2) ee qaacidooyinka wareegga iyo muraayadaha.",
  },
  {
    id: "chem",
    code: "CHM",
    name: "Kimistari (Chemistry)",
    group: "science",
    groupLabel: "Saynis",
    accent: "#0284C7",
    examinerFocus:
      "Saxnaanta isla'egyada dheellitiran (Balanced Equations) iyo saamiga Mole-ka ayaa furaha u ah dhibcaha sare.",
    legalSecrets: [
      "Mar walba dheellitir isla'egta (Balance the equation) ka hor inta aadan bilaabin xisaabta Mole-ka (n = m/M).",
      "Kala saar kooxaha Organic-ga adigoo fiirinaya Functional Group-ka (-OH, -CHO, -COOH).",
      "Qor xaaladaha falgalka (Catalyst, Heat, Pressure) haddii su'aashu waydiiso hab-soo-saarka warshadaha.",
    ],
    highYieldTopics: ["Mole Calculations & Stoichiometry", "Acid-Base Titration & pH", "Organic Naming (IUPAC)", "Periodic Trends & Bonding"],
    commonTrap: "Isku darka Molarity (mol/L) iyo Volume ku qoran mL iyadoon loo qaybin 1000.",
  },
  {
    id: "bio",
    code: "BIO",
    name: "Bayoolaji (Biology)",
    group: "science",
    groupLabel: "Saynis",
    accent: "#16A34A",
    examinerFocus:
      "Erayada cilmiga ah ee saxda ah (Keywords) iyo jaantusyada calaamadeysan ayaa si toos ah dhibco loo siiyaa.",
    legalSecrets: [
      "Xariiq qallafsan ha ku qorin jaantusyada, isticmaal qalin qori ah, xariiqyo toosan oo calaamadaha geesaha u saaran yihiin.",
      "Su'aalaha isbarbardhigga (sida Mitosis vs Meiosis, ama Artery vs Vein) u samee shax (Table).",
      "Adeegso ereyada saxda ah halkii aad sheeko dheer qori lahayd (tusaale: Active Transport, Osmosis, ATP, Enzyme specificity).",
    ],
    highYieldTopics: ["Cell Division (Mitosis/Meiosis)", "Human Heart, Kidney & Nervous System", "Genetics & Punnett Squares", "Photosynthesis & Respiration"],
    commonTrap: "In la isku qaldo Osmosis (biyaha keliya + semi-permeable membrane) iyo Diffusion guud.",
  },
  {
    id: "so",
    code: "SOM",
    name: "Af-Soomaali",
    group: "language",
    groupLabel: "Luqad",
    accent: "#0D9488",
    examinerFocus:
      "Nidaamka curiska, saxnaanta higgaadda (labalaabka & shaqallada dheer), iyo falanqaynta suugaanta ayaa dhibcaha ugu badan keena.",
    legalSecrets: [
      "Curiska u dhig saddex qaybood oo muuqda: Hordhac kooban -> 3 faqradood oo tusaale leh -> Gabagabo.",
      "Hubi shaqallada dhaadheer (aa, ee, ii, oo, uu) iyo xarfaha labanlaabma (m, n, l, r, g, d, b).",
      "Qaybta suugaanta ku xooji magaca gabayga, ujeeddada guud, iyo laba tusaale oo tuducyo ah.",
    ],
    highYieldTopics: ["Qoraalka Curiska", "Naxwaha & Qaybaha Hadalka", "Suugaanta & Murtida", "Higgaadda Rasmiga ah"],
    commonTrap: "Curis aan lahayn kala-bax faqrado ah ama jawaabo maanso ah oo aan la xiriirin ujeeddada su'aasha.",
  },
  {
    id: "en",
    code: "ENG",
    name: "Ingiriisi (English)",
    group: "language",
    groupLabel: "Luqad",
    accent: "#0369A1",
    examinerFocus:
      "Fahamka akhriska (Comprehension), is-waafajinta waqtiyada (Tenses), iyo qoraal nadiif ah oo aan khalad naxweed lahayn.",
    legalSecrets: [
      "Reading Comprehension: Marka hore akhri su'aalaha ka hor inta aadan sheekada akhrin si aad jawaabta isla markiiba u qabsato.",
      "Essay-ga ku bilow weedh cad (Topic Sentence) faqrad kasta oo adeegso ereyo isku xira (However, Furthermore, Therefore).",
      "Hubi Subject-Verb Agreement iyo Tense-ka su'aashu ku weydiisay ka hor inta aadan qorin jawaabta.",
    ],
    highYieldTopics: ["Reading Comprehension", "Tenses & Conditionals", "Active & Passive Voice", "Structured Essay Writing"],
    commonTrap: "Soo koobista sheekada adigoo ereyo dhan iska soo guuriya halkii aad su'aasha toos uga jawaabi lahayd.",
  },
  {
    id: "ar",
    code: "ARB",
    name: "Carabi (Arabic)",
    group: "language",
    groupLabel: "Luqad",
    accent: "#0F766E",
    examinerFocus:
      "I'raabka erayada, falkii iyo magacii (Nahw), iyo qurxinta hadalka (Balagha) oo leh tusaalooyin sax ah.",
    legalSecrets: [
      "Markaad I'raab samaynayso, marka hore ogow: weedhu ma Jumla Ismiyyah baa mise waa Jumla Fi'liyyah?",
      "Xafid calaamadaha I'raabka ee asalka ah (Damma, Fatha, Kasra) iyo kuwa faraca ah (Alif, Waw, Ya).",
      "Qaybta Balagha kala saar Tashbih (oo leh adaat) iyo Isti'arah (oo mid ka maqan yahay).",
    ],
    highYieldTopics: ["المبتدأ والخبر والفاعل", "إنّ وأخواتها وكان وأخواتها", "البلاغة (التشبيه والاستعارة)", "فهم المقروء والتعبير"],
    commonTrap: "In la isku qaldo magaca (اسم إنّ منصوب) iyo kan (اسم كان مرفوع).",
  },
  {
    id: "hist",
    code: "HIS",
    name: "Taariikh (History)",
    group: "social",
    groupLabel: "Bulsho",
    accent: "#D97706",
    examinerFocus:
      "Qodobbada saxda ah ee taariikhda, goobta, sababaha keenay dhacdada, iyo natiijadii ka dhalatay.",
    legalSecrets: [
      "Dhacdo kasta ku xafid qaabka 4-ta ah: Goorma (Date), Halkee (Place), Yaa hoggaaminayay, iyo Maxaa ka dhashay?",
      "Jawaabaha dhaadheer u qor qodob-qodob (Numbered points) halkii aad hal bog oo isku dhagan qori lahayd.",
      "Isku xir taariikhda Soomaaliya (halgankii xornimada & qoraalkii farta) iyo isbeddellada Geeska Afrika.",
    ],
    highYieldTopics: ["Halgankii Xornimada Soomaaliya", "Dagaalladii Adduunka & Cold War", "Taariikhda Islaamka & Geeska Afrika"],
    commonTrap: "Qorista sheeko guud oo aan lahayn sanad ama magacyada dhacdooyinka muhiimka ah.",
  },
  {
    id: "geo",
    code: "GEO",
    name: "Juqraafi (Geography)",
    group: "social",
    groupLabel: "Bulsho",
    accent: "#15803D",
    examinerFocus:
      "Akhriska khariidadaha, fahamka cimilada iyo roobabka, iyo kheyraadka dabiiciga ah ee Soomaaliya iyo adduunka.",
    legalSecrets: [
      "Su'aalaha Map Reading: Marka hore akhri cabbirka (Scale) iyo furaha (Key) khariidadda; xasuuso Eastings ka hor Northings.",
      "Sawir jaantus yar oo fudud markaad sharraxayso roobabka (Relief/Convectional) ama wabiyada.",
      "Kala saar sababaha dabiiciga ah iyo kuwa dadku keeno marka laga hadlayo nabaad-guurka iyo deegaanka.",
    ],
    highYieldTopics: ["Map Reading & Grid Reference", "Climate & Vegetation Zones", "Webiyada, Beeraha & Macdanta Soomaaliya"],
    commonTrap: "Beddelidda jihooyinka ama lambarada Grid Reference-ka ee 4-figure iyo 6-figure.",
  },
  {
    id: "bus",
    code: "BUS",
    name: "Ganacsiga (Business)",
    group: "applied",
    groupLabel: "Ganacsi",
    accent: "#059669",
    examinerFocus:
      "Dheellitirnaanta xisaabaadka (Accounting Equation), fahamka suuq-geynta, iyo maaraynta kharashka.",
    legalSecrets: [
      "Xasuuso qaanuunka dahabiga ah: Assets = Liabilities + Capital. Haddii Balance Sheet-ku isku dheellitirmi waayo dib u hubi.",
      "Kala saar Fixed Costs (kirada, mushaarka joogtada ah) iyo Variable Costs (alaabta cayriin ee tirada la socota).",
      "Jawaabaha maamulka ku xooji tusaale ganacsi oo Soomaaliya ka jira.",
    ],
    highYieldTopics: ["Income Statement & Balance Sheet", "Break-even Point", "Marketing Mix (4Ps) & Supply/Demand"],
    commonTrap: "In Gross Profit iyo Net Profit la isku qaldo marka laga jarayo Operating Expenses.",
  },
  {
    id: "tech",
    code: "TEC",
    name: "Tiknoolajiyad (Technology)",
    group: "applied",
    groupLabel: "Tech",
    accent: "#1D4ED8",
    examinerFocus:
      "Fahamka shaqada qaybaha kombiyuutarka, shabakadaha, amniga xogta, iyo isticmaalka saxda ah ee databases.",
    legalSecrets: [
      "Kala saar Hardware vs Software, RAM (ku-meel-gaar) vs ROM/SSD (joogto), iyo Router vs Switch.",
      "Su'aalaha amniga internet-ka (Cybersecurity) ku dar xalka: 2FA, Strong Passwords, Backups, iyo Encryption.",
      "Database-ka ku sharax Primary Key vs Foreign Key adigoo tusaale ka dhigaya liiska ardayda.",
    ],
    highYieldTopics: ["Networking (IP, DNS, LAN/WAN)", "Cybersecurity & Data Safety", "Database Basics & Logic"],
    commonTrap: "In la isku qaldo Internet (shabakadda guud) iyo World Wide Web (boggaga & adeegyada).",
  },
  {
    id: "isl",
    code: "TRB",
    name: "Tarbiyo (Islamic Studies)",
    group: "applied",
    groupLabel: "Tarbiyo",
    accent: "#B45309",
    examinerFocus:
      "Saxnaanta Aayadaha & Axaadiista, macnaha saxda ah ee Fiqh-ga, iyo anshaxa wanaagsan ee ardayga.",
    legalSecrets: [
      "Aayadaha iyo Xadiisyada u qor si sax ah iyadoon erey laga boodin; haddii aadan xasuusan erayada oo buuxa, sheeg macnaha saxda ah adigoon wax ku darin.",
      "Qaybta Fiqh-ga kala caddee Arkaan, Shuruud, iyo Waxyaabaha buriya (tusaale: Salaadda, Soonka, Zakada).",
      "U qor casharrada laga faa'iidaysanayo si nidaamsan (3 ilaa 4 qodob oo cad).",
    ],
    highYieldTopics: ["Tafsiirka & Axaadiista", "Fiqh-ga Cibaadada & Mucaamalaadka", "Siirada & Akhlaaqda (Diidmada Qishka)"],
    commonTrap: "Isku darka Shuruudda Salaadda (ka hor salaadda) iyo Arkaanta Salaadda (gudaha salaadda).",
  },
];
