// © 2026 Xuquuqdu way dhowrsan tahay. Beddel magacan:
const String appOwner = "ShuaybAbdirahman";

// Xogta app-ka: 12 kulliyadood + 12 su’aalood. Doorasho kasta waxay dhibco ugu darsaa kulliyado.
const List<Map<String, dynamic>> faculties = [
 {
  "id": "law",
  "short": "Law",
  "en": "Sharia & Law",
  "so": "Kulliyadda Shari’ada iyo Sharciga",
  "emoji": "⚖️",
  "color": 4284170124,
  "depts": [
   "Sharia & Law",
   "Sharia",
   "Law"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel cadaalada, doodda iyo fahamka xeerarka diinta iyo dalka.",
  "jobs": [
   "Garsoore",
   "Qareen",
   "Xeer-ilaalin",
   "La-taliye sharci"
  ],
  "tips": [
   "Ku dar akhriska Dastuurka iyo Xeerka Madaniga si aad u hesho aasaas.",
   "Ku celceli hadalka iyo doodda (debate club ama koox ardayda).",
   "Is-barbar dhig labada waaxood: Sharia & Law iyo Law, oo weydii ardayda jirta kala duwanaanshaha."
  ]
 },
 {
  "id": "edu",
  "short": "Education",
  "en": "Education & Humanities",
  "so": "Kulliyadda Waxbarashada iyo Aadanaha",
  "emoji": "🎓",
  "color": 4290920716,
  "depts": [
   "History & Geography",
   "English & History",
   "English & Geography",
   "Social Work",
   "Math & Physics",
   "Biology & Chemistry",
   "Arabic Language & Islamic Studies"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel barista, luuqadaha, cilmiga bulshada iyo dhisidda jiilka cusub.",
  "jobs": [
   "Macallin",
   "Hawlwadeen bulsho",
   "Cilmi-baare",
   "Maamule dugsi"
  ],
  "tips": [
   "Door waaxda aad macallinka ka noqon doonto (tusaale Math & Physics ama Ingiriisi).",
   "Iskaa u tijaabi barista: la shaqee carruur ama ardayda yar.",
   "Ka fiirso baahida macallimiinta ee deegaankaaga si shaqo u hesho."
  ]
 },
 {
  "id": "econ",
  "short": "Economics",
  "en": "Economics & Management Sciences",
  "so": "Kulliyadda Dhaqaalaha iyo Maaraynta",
  "emoji": "📊",
  "color": 4279203438,
  "depts": [
   "Business Administration",
   "International Trade and Business",
   "Management Information Systems",
   "Finance & Banking",
   "Procurement & Logistics Management",
   "Statistics & Planning",
   "Project Management",
   "Marketing",
   "Accounting",
   "Economics"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel xisaabta, ganacsiga, lacagta iyo hoggaaminta.",
  "jobs": [
   "Xisaabiye",
   "Bangi",
   "Maareeye mashruuc",
   "Ganacsade"
  ],
  "tips": [
   "Bilow xisaab-hay'adeed iyo Excel hadda: waxay kaa horreysiinayaan.",
   "Waaxda Accounting iyo Finance waxay leeyihiin baahi weyn; Marketing wuxuu u habboon yahay hal-abuurka.",
   "Isku day inaad ganacsi yar bilowdo inta aad wax barato."
  ]
 },
 {
  "id": "health",
  "short": "Health Sci.",
  "en": "Health Sciences",
  "so": "Kulliyadda Sayniska Caafimaadka",
  "emoji": "🩺",
  "color": 4279137424,
  "depts": [
   "Clinical Officer",
   "Public Health",
   "Midwifery",
   "General Nursing",
   "Micro-biology",
   "Medical Laboratory Sciences",
   "Nutrition and Dietetics"
  ],
  "desc": "Waxay u habboon tahay ardayga naxariista leh ee rabta inuu si toos ah u daryeelo bukaannada.",
  "jobs": [
   "Kalkaaliye",
   "Umulisada",
   "Farsamoyaqaan shaybaar",
   "Khabiir nafaqo"
  ],
  "tips": [
   "Waaxda ka dooro adigoo fiirinaya daryeelka toos ah (Nursing) iyo shaybaarka (Lab).",
   "Booqo isbitaal si aad u aragto shaqada maalinlaha ah.",
   "Diyaari Bayoloji iyo Kimistari si aad uga gudubto imtixaanka gelitaanka."
  ]
 },
 {
  "id": "cs",
  "short": "Comp. Sci.",
  "en": "Computer Science & Information Technology",
  "so": "Kulliyadda Computer Science iyo IT",
  "emoji": "💻",
  "color": 4280110808,
  "depts": [
   "Computer Science",
   "Information Technology",
   "Software Engineering",
   "Enterprise Networking",
   "Geography Information System (GIS)",
   "Cybersecurity and Artificial Intelligence (AI)"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel tignoolajiyada, barnaamijyada, amniga internetka iyo AI.",
  "jobs": [
   "Developer",
   "Khabiir amni cyber",
   "Injineer shabakad",
   "Falanqeeye xog"
  ],
  "tips": [
   "Bilow barashada barnaamijka hadda (Python ama JavaScript) oo bilaash ah.",
   "Dhis mashruuc yar (website ama app) si aad portfolio u yeelato.",
   "Cybersecurity iyo AI waa waaxaha ugu baahida badan mustaqbalka."
  ]
 },
 {
  "id": "pol",
  "short": "Political Sci.",
  "en": "Political Science & Public Administration",
  "so": "Kulliyadda Siyaasadda iyo Maamulka Dadweynaha",
  "emoji": "🏛️",
  "color": 4290321436,
  "depts": [
   "Political Science",
   "Public Administration",
   "International Relations",
   "Journalism & Communication"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel hoggaanka, dowladnimada, diblomaasiyadda iyo warbaahinta.",
  "jobs": [
   "Diblomaasi",
   "Weriye",
   "Madaxa waaxda",
   "Falanqeeye siyaasad"
  ],
  "tips": [
   "Akhri wargeysyada iyo falanqaynta siyaasadeed maalin kasta.",
   "Ku biir koox ardayda ama golaha dhallinyarada si aad khibrad u hesho.",
   "Journalism wuxuu u baahan yahay qoris badan: bilow blog ama podcast."
  ]
 },
 {
  "id": "eng",
  "short": "Engineering",
  "en": "Engineering",
  "so": "Kulliyadda Injineerinka",
  "emoji": "🏗️",
  "color": 4290007817,
  "depts": [
   "Architecture",
   "Civil Engineering",
   "Electric & Electronic Engineering",
   "Interior Design"
  ],
  "desc": "Waxay u habboon tahay ardayga xisaabta iyo naqshadaha jecel, ee rabta inuu wax dhiso.",
  "jobs": [
   "Naqshadeeye dhismo",
   "Injineer dhismo",
   "Injineer koronto",
   "Naqshadeeye gudaha"
  ],
  "tips": [
   "Xisaabta iyo Fiisigiska xoojii, waa aasaaska injineerinka.",
   "Qiimee waaxda: naqshad (Architecture), dhismo (Civil) ama koronto (Electric).",
   "Daawo mashaariicda dhismaha deegaankaaga si aad u aragto shaqada dhabta ah."
  ]
 },
 {
  "id": "agri",
  "short": "Agriculture",
  "en": "Agriculture & Environmental Science",
  "so": "Kulliyadda Beeraha iyo Sayniska Deegaanka",
  "emoji": "🌱",
  "color": 4282350880,
  "depts": [
   "Agriculture",
   "Environmental Science"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel dabiicadda, cuntada, beeraha iyo ilaalinta deegaanka.",
  "jobs": [
   "Khabiir beereed",
   "Cilmi-baare deegaan",
   "La-taliye beeraha",
   "Maamule mashruuc cagaaran"
  ],
  "tips": [
   "Booqo beer ama mashruuc beereed oo casri ah si aad u aragto fursadaha.",
   "Ka fiirso baahida cuntada iyo isbeddelka cimilada: waa fursado waaweyn.",
   "Isku day beerid yar (xitaa guriga) si aad u tijaabiso xiisahaaga."
  ]
 },
 {
  "id": "med",
  "short": "Medicine",
  "en": "Medicine",
  "so": "Kulliyadda Dhakhtarnimada",
  "emoji": "🏥",
  "color": 4290646588,
  "depts": [
   "Medicine & Surgery"
  ],
  "desc": "Waxay u habboon tahay ardayga aadka u dadaala ee rabta inuu daaweeyo oo badbaadiyo nolosha.",
  "jobs": [
   "Dhakhtar",
   "Dhakhtar qalliin",
   "Cilmi-baare caafimaad",
   "Takhasus dhakhtar"
  ],
  "tips": [
   "Waa barnaamij dheer oo adag: hubi inaad u diyaar tahay dadaal 6-7 sano ah.",
   "Bayoloji iyo Kimistari ka dhig kuwa aad ugu xoogga badan tahay.",
   "La hadal dhakhtar shaqeeya si aad u ogaato nolosha dhabta ah."
  ]
 },
 {
  "id": "vet",
  "short": "Veterinary",
  "en": "Veterinary Medicine",
  "so": "Kulliyadda Dhakhtarnimada Xoolaha",
  "emoji": "🐄",
  "color": 4284839210,
  "depts": [
   "Health & Veterinary Care"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel xoolaha, gaar ahaan dalka xoolaha ku tiirsan yahay.",
  "jobs": [
   "Dhakhtarka xoolaha",
   "Kormeere caafimaad",
   "Cilmi-baare",
   "Ganacsi xoolo"
  ],
  "tips": [
   "Booqo xoolo-dhaqato ama rugta xoolaha si aad u aragto shaqada.",
   "Waa kulliyad leh baahi weyn, maadaama dalka xoolaha ku tiirsan yahay.",
   "Bayoloji iyo daryeelka xoolaha ha ku jiraan diyaar-garowgaaga."
  ]
 },
 {
  "id": "dent",
  "short": "Dentistry",
  "en": "Dentistry",
  "so": "Kulliyadda Ilkaha",
  "emoji": "🦷",
  "color": 4278355143,
  "depts": [
   "Dentistry",
   "Dental Assistant"
  ],
  "desc": "Waxay u habboon tahay ardayga gacan-fiican ee jecel daryeelka afka, ilkaha iyo sifaynta.",
  "jobs": [
   "Dhakhtarka ilkaha",
   "Kaaliyaha ilkaha",
   "Rugta ilkaha",
   "Cilmi-baare"
  ],
  "tips": [
   "Ka hubi inaad jeceshahay shaqo gacmeed oo sax ah (gacan degan).",
   "Dentistry waa mid dheer, Dental Assistant waa mid ka gaaban: kala dooro.",
   "La hadal dhakhtar ilkaha ah si aad u aragto maalinta shaqada."
  ]
 },
 {
  "id": "avia",
  "short": "Aviation",
  "en": "Civil Aviation",
  "so": "Kulliyadda Duulista Rayidka",
  "emoji": "✈️",
  "color": 4282595530,
  "depts": [
   "Civil Aviation Management"
  ],
  "desc": "Waxay u habboon tahay ardayga jecel duullimaadka, garoomada iyo maaraynta hawada.",
  "jobs": [
   "Maareeye garoon",
   "Hawlwadeen duullimaad",
   "Xakameeye hawada",
   "Maamule duulimaad"
  ],
  "tips": [
   "Xisaabta iyo Ingiriisiga xoojii: waa luuqadda duulista caalamka.",
   "Ka baro nidaamka garoonka diyaaradaha iyo amniga duulista.",
   "Fursadaha shaqo waa kuwo xaddidan: is-barbar dhig kulliyad kale oo kuu dhow."
  ]
 }
];

const List<Map<String, dynamic>> questions = [
 {
  "q": "Marka aad firaaqo hesho, maxaad ugu badan jeceshahay inaad sameyso?",
  "o": [
   {
    "t": "Inaan kombuyuutar, app ama tignoolajiyad ku mashquulo",
    "w": {
     "cs": 3,
     "eng": 1
    }
   },
   {
    "t": "Inaan dadka caafimaad u hayo oo ka caawiyo",
    "w": {
     "health": 3,
     "med": 2,
     "dent": 1
    }
   },
   {
    "t": "Inaan akhriyo, doodo ama wax qoro",
    "w": {
     "law": 2,
     "pol": 2,
     "edu": 1
    }
   },
   {
    "t": "Inaan beero, xayawaan ama deegaanka ku dhex mashquulo",
    "w": {
     "agri": 3,
     "vet": 2
    }
   },
   {
    "t": "Inaan ganacsi, lacag iyo maaraynta ku mashquulo",
    "w": {
     "econ": 3,
     "pol": 1
    }
   }
  ]
 },
 {
  "q": "Maaddooyinkee ayaad dugsiga sare ugu fiicnayd?",
  "o": [
   {
    "t": "Xisaab iyo Fiisigis",
    "w": {
     "eng": 3,
     "cs": 2,
     "avia": 1,
     "edu": 1
    }
   },
   {
    "t": "Bayoloji iyo Kimistari",
    "w": {
     "med": 3,
     "health": 2,
     "dent": 2,
     "vet": 2,
     "agri": 1
    }
   },
   {
    "t": "Ingiriisi, Carabi, Taariikh iyo Juqraafi",
    "w": {
     "edu": 3,
     "law": 1,
     "pol": 1
    }
   },
   {
    "t": "Ganacsi iyo Dhaqaale",
    "w": {
     "econ": 3,
     "pol": 1
    }
   }
  ]
 },
 {
  "q": "Shaqadee ayaad rabtaa inaad mustaqbalka ku aragto naftaada?",
  "o": [
   {
    "t": "Inaan bukaan daaweeyo ama qalliin sameeyo",
    "w": {
     "med": 3,
     "dent": 2,
     "health": 1
    }
   },
   {
    "t": "Inaan hormuud ka noqdo shirkad ama mashruuc ganacsi",
    "w": {
     "econ": 3,
     "pol": 1
    }
   },
   {
    "t": "Inaan buundooyin, guryo ama nidaamyo naqshadeeyo",
    "w": {
     "eng": 3,
     "avia": 1
    }
   },
   {
    "t": "Inaan sharci ka difaaco ama garsoore noqdo",
    "w": {
     "law": 3,
     "pol": 1
    }
   }
  ]
 },
 {
  "q": "Goobtee shaqo ayaa kuu raaxo badan?",
  "o": [
   {
    "t": "Rugta caafimaadka, shaybaarka ama qolka qalliinka",
    "w": {
     "health": 3,
     "med": 2,
     "dent": 2,
     "vet": 1
    }
   },
   {
    "t": "Xafiis casri ah oo kombuyuutar leh",
    "w": {
     "cs": 2,
     "econ": 2,
     "pol": 1
    }
   },
   {
    "t": "Garoonka diyaaradaha iyo hawada",
    "w": {
     "avia": 3,
     "eng": 1
    }
   },
   {
    "t": "Beer, xoolo-dhaqasho ama dabiicadda bannaan",
    "w": {
     "agri": 3,
     "vet": 3
    }
   }
  ]
 },
 {
  "q": "Marka dhibaato timaado, sidee u xalliyaa?",
  "o": [
   {
    "t": "Waan falanqeeyaa xogta oo nidaam ama koodh ayaan ka sameeyaa",
    "w": {
     "cs": 3,
     "econ": 1,
     "eng": 1
    }
   },
   {
    "t": "Waan wada-hadlaa oo dadka isku afgaranayaa",
    "w": {
     "pol": 3,
     "law": 2,
     "edu": 1
    }
   },
   {
    "t": "Waxaan raadiyaa sababta caafimaad ee ka dambeysa",
    "w": {
     "med": 2,
     "health": 3,
     "dent": 1
    }
   },
   {
    "t": "Waxaan dhisaa qalab ama nidaam jireed oo xalinaya",
    "w": {
     "eng": 3,
     "avia": 1,
     "cs": 1
    }
   }
  ]
 },
 {
  "q": "Shaqadee ayaad ugu faani lahayd?",
  "o": [
   {
    "t": "Hoggaaminta iyo adeegga dadweynaha",
    "w": {
     "pol": 3,
     "law": 1,
     "econ": 1
    }
   },
   {
    "t": "Barista ardayda iyo dhisidda jiilka cusub",
    "w": {
     "edu": 3,
     "law": 1
    }
   },
   {
    "t": "Badbaadinta nolosha dadka ama xoolaha",
    "w": {
     "med": 2,
     "health": 2,
     "vet": 2,
     "dent": 1,
     "avia": 1
    }
   },
   {
    "t": "Soo saarista cuntada iyo ilaalinta deegaanka",
    "w": {
     "agri": 3,
     "health": 1
    }
   }
  ]
 },
 {
  "q": "Sidee ku aragtaa dhiigga iyo qalliinka?",
  "o": [
   {
    "t": "Waan qaabili karaa, xitaa waan jeclahay",
    "w": {
     "med": 3,
     "vet": 2,
     "dent": 1
    }
   },
   {
    "t": "Waxaan jeclahay daryeelka afka iyo ilkaha",
    "w": {
     "dent": 3,
     "health": 1
    }
   },
   {
    "t": "Waan qaabili karaa laakiin ma door bidayo",
    "w": {
     "health": 2,
     "dent": 1,
     "agri": 1
    }
   },
   {
    "t": "Ma jecli, waxaan door bidayaa shaqo aan dhiig lahayn",
    "w": {
     "cs": 1,
     "econ": 1,
     "law": 1,
     "pol": 1,
     "eng": 1,
     "edu": 1
    }
   }
  ]
 },
 {
  "q": "Hawshee ayaa kuu raaxo badan?",
  "o": [
   {
    "t": "Hal-abuur iyo naqshad (guri, gudaha, qaab)",
    "w": {
     "eng": 3,
     "cs": 1
    }
   },
   {
    "t": "Xisaab, lacag iyo tirooyin",
    "w": {
     "econ": 3,
     "cs": 1
    }
   },
   {
    "t": "Safar, duulimaad iyo nidaamka caalamka",
    "w": {
     "avia": 3,
     "pol": 1,
     "econ": 1
    }
   },
   {
    "t": "Wada-hadal, wargeys iyo warbaahin",
    "w": {
     "pol": 3,
     "edu": 1,
     "law": 1
    }
   }
  ]
 },
 {
  "q": "Yaad door bidaysaa inaad la shaqayso?",
  "o": [
   {
    "t": "Mashiinno, koronto iyo qalab farsamo",
    "w": {
     "eng": 3,
     "cs": 1,
     "avia": 1
    }
   },
   {
    "t": "Bukaanno iyo qoysas",
    "w": {
     "health": 3,
     "med": 2,
     "dent": 1
    }
   },
   {
    "t": "Ardayda iyo carruurta",
    "w": {
     "edu": 3,
     "law": 1
    }
   },
   {
    "t": "Guddiyo, golayaal iyo sharciyo",
    "w": {
     "law": 2,
     "pol": 3
    }
   }
  ]
 },
 {
  "q": "Qiimaha kuugu weyn shaqada?",
  "o": [
   {
    "t": "Cadaalad iyo xaq",
    "w": {
     "law": 3,
     "pol": 1
    }
   },
   {
    "t": "Daryeel iyo naxariis",
    "w": {
     "health": 3,
     "med": 1,
     "dent": 1,
     "vet": 1
    }
   },
   {
    "t": "Hal-abuur iyo tignoolajiyad",
    "w": {
     "cs": 3,
     "eng": 2
    }
   },
   {
    "t": "Guul dhaqaale iyo hoggaamin",
    "w": {
     "econ": 3,
     "pol": 1,
     "avia": 1
    }
   }
  ]
 },
 {
  "q": "Intee in le’eg ayaad diyaar u tahay inaad wax barato?",
  "o": [
   {
    "t": "Waqti dheer (6-7 sano) iyo dadaal weyn",
    "w": {
     "med": 3,
     "dent": 2,
     "vet": 1
    }
   },
   {
    "t": "4-5 sano oo adag oo farsamo leh",
    "w": {
     "eng": 2,
     "vet": 2,
     "health": 1,
     "cs": 1
    }
   },
   {
    "t": "Afar sano oo caadi ah",
    "w": {
     "econ": 1,
     "law": 1,
     "pol": 1,
     "cs": 1,
     "edu": 1
    }
   },
   {
    "t": "Barnaamij gaaban oo xirfad leh",
    "w": {
     "health": 2,
     "dent": 1,
     "agri": 1
    }
   }
  ]
 },
 {
  "q": "Halkee ayaad jeceshahay inaad ka shaqeyso?",
  "o": [
   {
    "t": "Isbitaal ama rugta caafimaadka",
    "w": {
     "med": 2,
     "health": 3,
     "dent": 2
    }
   },
   {
    "t": "Maxkamad, golaha ama xafiis dowladeed",
    "w": {
     "law": 3,
     "pol": 3
    }
   },
   {
    "t": "Shirkad, bangi ama xarun IT",
    "w": {
     "econ": 3,
     "cs": 3
    }
   },
   {
    "t": "Garoon, beer ama goob dhismo",
    "w": {
     "eng": 2,
     "avia": 2,
     "agri": 2,
     "vet": 1
    }
   }
  ]
 },
 {
  "q": "Marka aad aragto qof dhaawac ah, maxaad sameyn lahayd?",
  "o": [
   {
    "t": "Si degdeg ah ayaan gacan u siinayaa oo daaweyn bilaabayaa",
    "w": {
     "med": 3,
     "health": 2
    }
   },
   {
    "t": "Waan la joogayaa, daryeelayaa oo qalbi qabowsiinayaa",
    "w": {
     "health": 3,
     "med": 1
    }
   },
   {
    "t": "Waxaan raadinayaa sababta iyada oo la baadhayo",
    "w": {
     "health": 2,
     "med": 2
    }
   },
   {
    "t": "Waxaan isku dayayaa inaan ogaado sida looga hortago",
    "w": {
     "health": 3,
     "vet": 1
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Nooca bukaannada aad jeceshahay inaad la shaqeyso?",
  "o": [
   {
    "t": "Dumarka uurka leh iyo ilmaha dhasha",
    "w": {
     "health": 3,
     "med": 1
    }
   },
   {
    "t": "Dadka waaweyn iyo kuwa jirran",
    "w": {
     "med": 3,
     "health": 2
    }
   },
   {
    "t": "Bulshada oo dhan (ka hortag iyo wacyigelin)",
    "w": {
     "health": 3
    }
   },
   {
    "t": "Xoolaha iyo duur-joogta",
    "w": {
     "vet": 3,
     "agri": 1
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Qaybtee ayaad door bidaysaa?",
  "o": [
   {
    "t": "Qalliin iyo daaweyn hore",
    "w": {
     "med": 3,
     "dent": 1
    }
   },
   {
    "t": "Shaybaar, mikroskoob iyo baadhitaan",
    "w": {
     "health": 3,
     "med": 1
    }
   },
   {
    "t": "Nafaqada iyo cuntada caafimaadka",
    "w": {
     "health": 3,
     "agri": 1
    }
   },
   {
    "t": "Ilkaha iyo daryeelka afka",
    "w": {
     "dent": 3
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Tayada kuugu xoogga badan?",
  "o": [
   {
    "t": "Gacan sax ah oo degan",
    "w": {
     "dent": 3,
     "med": 2
    }
   },
   {
    "t": "Degenaan marka xaalad degdeg ah jirto",
    "w": {
     "med": 3,
     "health": 2
    }
   },
   {
    "t": "Samir iyo dhegeysi",
    "w": {
     "health": 3,
     "dent": 1
    }
   },
   {
    "t": "Jacayl xayawaanka iyo dabiicadda",
    "w": {
     "vet": 3,
     "agri": 2
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Meesha shaqo ee aad ugu raaxo badan?",
  "o": [
   {
    "t": "Isbitaal weyn oo wax kala duwan",
    "w": {
     "med": 3,
     "health": 2
    }
   },
   {
    "t": "Rugta ilkaha ama rugta gaarka ah",
    "w": {
     "dent": 3,
     "health": 1
    }
   },
   {
    "t": "Beero, xoolo-dhaqato ama bannaanka",
    "w": {
     "vet": 3,
     "agri": 3
    }
   },
   {
    "t": "Xarun bulsho ama barnaamij ka hortag",
    "w": {
     "health": 3
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Waqtiga waxbarasho ee aad doorbidayso?",
  "o": [
   {
    "t": "6-7 sano oo adag (dhakhtar)",
    "w": {
     "med": 3,
     "dent": 2,
     "vet": 1
    }
   },
   {
    "t": "4 sano oo caadi ah",
    "w": {
     "health": 3,
     "vet": 1,
     "agri": 1
    }
   },
   {
    "t": "Barnaamij gaaban si aan dhakhso u shaqeeyo",
    "w": {
     "health": 2,
     "dent": 1
    }
   },
   {
    "t": "5 sano oo ku saabsan xoolaha ama beeraha",
    "w": {
     "vet": 3,
     "agri": 2
    }
   }
  ],
  "g": "health"
 },
 {
  "q": "Maxaad ugu fiicantahay ganacsiga?",
  "o": [
   {
    "t": "Xisaabinta iyo lacagta",
    "w": {
     "econ": 3
    }
   },
   {
    "t": "Iibinta iyo suuq-geynta",
    "w": {
     "econ": 3,
     "pol": 1
    }
   },
   {
    "t": "Tignoolajiyada ganacsiga (e-commerce, nidaamyo)",
    "w": {
     "cs": 3,
     "econ": 2
    }
   },
   {
    "t": "Maaraynta dadka iyo hoggaaminta",
    "w": {
     "pol": 3,
     "econ": 2
    }
   }
  ],
  "g": "business"
 },
 {
  "q": "Shaqada ganacsiga ee kuu raaxo badan?",
  "o": [
   {
    "t": "Bangi iyo maaliyadda",
    "w": {
     "econ": 3
    }
   },
   {
    "t": "Logistics, soo-iibsiga iyo gaadiidka",
    "w": {
     "econ": 3,
     "avia": 2
    }
   },
   {
    "t": "Maaraynta mashruuc iyo qorshaynta",
    "w": {
     "econ": 3,
     "pol": 1
    }
   },
   {
    "t": "Shirkad duulimaad ama safar",
    "w": {
     "avia": 3,
     "econ": 2
    }
   }
  ],
  "g": "business"
 },
 {
  "q": "Sidee u hoggaamisaa?",
  "o": [
   {
    "t": "Tirooyin iyo falanqayn",
    "w": {
     "econ": 3,
     "cs": 1
    }
   },
   {
    "t": "Xiriirka dadka iyo wada-xaajood",
    "w": {
     "pol": 3,
     "econ": 1
    }
   },
   {
    "t": "Hal-abuur iyo fikrado cusub",
    "w": {
     "econ": 2,
     "cs": 2
    }
   },
   {
    "t": "Nidaam iyo hab-raac",
    "w": {
     "econ": 2,
     "avia": 2,
     "pol": 1
    }
   }
  ],
  "g": "business"
 }
];
