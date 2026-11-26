export interface RoadmapStage {
  id: string;
  phase: string;
  title: string;
  summary: string;
  skills: string[];
  tools: string[];
  milestone: string;
}

export interface FacultyRoadmap {
  id: string;
  facultyId: string;
  title: string;
  subtitle: string;
  sourceBadge: string;
  duration: string;
  color: string;
  stages: RoadmapStage[];
  freeResources: { name: string; note: string }[];
}

export interface SomaliaChallenge {
  id: string;
  category: string;
  title: string;
  problem: string;
  commonMistake: string;
  solutionSteps: string[];
  actionKitTitle: string;
  actionKitItems: string[];
  quickTip: string;
}

export type ReadinessPhase = "1-30 Maalmood" | "31-60 Maalmood" | "61-90 Maalmood";

export interface ReadinessItem {
  id: string;
  phase: ReadinessPhase;
  category: string;
  title: string;
  detail: string;
  timeEstimate: string;
  hiraalTip: string;
}

export const facultyRoadmaps: FacultyRoadmap[] = [
  {
    id: "ai-data-science",
    facultyId: "cs",
    title: "AI & Data Science Roadmap",
    subtitle: "Ka bilow xisaabta & Python ilaa Machine Learning, PyTorch, iyo LLMs/RAG",
    sourceBadge: "roadmap.sh Verified",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#6366F1",
    stages: [
      {
        id: "ai-1",
        phase: "Marxaladda 1 · Aasaaska (Sanadka 1aad)",
        title: "Xisaabta AI & Barnaamij-qorista Python",
        summary: "Baro Linear Algebra, Calculus, Probability & Statistics, iyo aasaaska Python & SQL.",
        skills: [
          "Linear Algebra (Vectors, Matrices, PCA) & Derivatives",
          "Probability, Distributions & Hypothesis Testing",
          "Python (Functions, OOP, Data Structures) & SQL Queries",
        ],
        tools: ["Python", "SQL", "Jupyter Notebook", "Git & GitHub"],
        milestone: "Nadiifi xog (dataset) adigoo adeegsanaya Pandas oo samee warbixin muuqaal ah (EDA).",
      },
      {
        id: "ai-2",
        phase: "Marxaladda 2 · Xog-falanqaynta (Sanadka 2aad)",
        title: "Data Wrangling, Visualization & Classical ML",
        summary: "U gudub saadaalinta xogta adigoo baranaya Scikit-learn, Feature Engineering, iyo qiimeynta models-ka.",
        skills: [
          "NumPy, Pandas, Matplotlib & Seaborn",
          "Supervised Learning (Regression, Random Forest, XGBoost)",
          "Cross-Validation, Precision/Recall & Bias-Variance Tradeoff",
        ],
        tools: ["NumPy", "Pandas", "Scikit-learn", "XGBoost"],
        milestone: "Dhis model saadaaliya qiimaha guryaha ama cudurrada adigoo isticmaalaya Scikit-learn.",
      },
      {
        id: "ai-3",
        phase: "Marxaladda 3 · Deep Learning & LLMs (Sanadka 3aad)",
        title: "Neural Networks, Transformers & Generative AI",
        summary: "Baro Deep Learning (CNNs, RNNs), Transformers, iyo sida loo dhiso nidaamyada LLMs & RAG.",
        skills: [
          "Neural Networks, Backpropagation & PyTorch",
          "Computer Vision (CNNs) & NLP / Attention Mechanism",
          "LLMs, Prompt Engineering, Fine-Tuning & RAG Systems",
        ],
        tools: ["PyTorch", "Hugging Face", "FAISS / Chroma", "LangChain"],
        milestone: "Samee kaaliye AI (RAG Assistant) oo ka jawaaba buugaagta/dugsigaaga oo ku shaqeeya Python.",
      },
      {
        id: "ai-4",
        phase: "Marxaladda 4 · Shaqada & MLOps (Sanadka 4aad)",
        title: "Deployment, APIs & Portfolio Caalami ah",
        summary: "Barnaamij ku dhex jira kombiyuutarkaaga oo keliya shaqo ma keeno, baro sida loogu xiro API, Docker, iyo shaqooyinka fog.",
        skills: [
          "Model Deployment via FastAPI / REST APIs",
          "Docker Containerization & Experiment Tracking (MLflow)",
          "GitHub Portfolio, Kaggle Competitions & Freelancing",
        ],
        tools: ["FastAPI", "Docker", "MLflow", "Kaggle"],
        milestone: "Daabac mashruuc AI oo dhammaystiran (Frontend + FastAPI + Docker) oo ku jira GitHub-kaaga.",
      },
    ],
    freeResources: [
      { name: "roadmap.sh/ai-data-scientist", note: "Khariidadda rasmiga ah ee tallaabo-tallaabo" },
      { name: "Kaggle Learn", note: "Casharro bilaash ah oo Python, Pandas & ML ah" },
      { name: "Fast.ai & Andrew Ng (Coursera Aid)", note: "Deep Learning oo ficil ah oo bilaash ah" },
    ],
  },
  {
    id: "electrical-engineering",
    facultyId: "eng",
    title: "Electrical Engineering Roadmap",
    subtitle: "Ka bilow Circuits & Physics ilaa Embedded Systems, PCB Design, iyo Power/Solar Grids",
    sourceBadge: "IEEE & ABET Standard",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#F59E0B",
    stages: [
      {
        id: "ee-1",
        phase: "Sanadka 1aad · Aasaaska Injineernimada",
        title: "Engineering Math, Physics & Programming",
        summary: "Xooji Calculus, Linear Algebra, Electricity & Magnetism, iyo C/Python programming.",
        skills: [
          "Engineering Math I & II (Calculus & Linear Algebra)",
          "Physics (Mechanics, Electricity & Magnetism)",
          "C / Python Fundamentals & Technical CAD Drawing",
        ],
        tools: ["C / Python", "MATLAB / Octave", "AutoCAD Basics"],
        milestone: "Xalli 20 mas’alo oo DC circuits ah oo qor barnaamij MATLAB/Python ah oo xisaabiya.",
      },
      {
        id: "ee-2",
        phase: "Sanadka 2aad · Core Electrical Engineering",
        title: "Circuit Analysis, Electronics & Digital Logic",
        summary: "Baro AC/DC circuits, diodes/MOSFETs, Digital Logic, Signals & Systems, iyo qalabka shaybaarka.",
        skills: [
          "DC/AC Circuit Analysis, Network Theorems & Transients",
          "Electronic Devices (Diodes, BJTs, MOSFETs) & Digital Logic",
          "Differential Equations, Electromagnetics & Signals/Systems",
        ],
        tools: ["LTspice / Multisim", "MATLAB / Simulink", "Oscilloscope & DMM"],
        milestone: "Ku tijaabi (simulate) power supply regulator gudaha LTspice oo ku dhis breadboard.",
      },
      {
        id: "ee-3",
        phase: "Sanadka 3aad · Systems, Power & Embedded",
        title: "Power Systems, Control, Microcontrollers & PCB",
        summary: "Baro matoorrada, transformers, korontada cadceedda (Solar), microcontrollers, iyo naqshadaynta PCB.",
        skills: [
          "Electrical Machines, Power Systems & Power Electronics",
          "Control Systems (Feedback, Stability, PID) & Comms",
          "Microcontrollers (Arduino/STM32/ESP32) & PCB Layout",
        ],
        tools: ["KiCad / Altium", "STM32 / Arduino IDE", "ETAP / Simscape"],
        milestone: "Naqshadee PCB shaqeynaya oo leh ESP32/Arduino (sida Smart Solar Monitor).",
      },
      {
        id: "ee-4",
        phase: "Sanadka 4aad · Capstone & Suuqa Soomaaliya",
        title: "Renewable Energy, Smart Grids & Capstone Project",
        summary: "Ku dabaq aqoontaada mashruuca qalin-jabinta, tababar shirkad koronto/isgaarsiin, iyo xeerarka IEEE.",
        skills: [
          "Solar PV Sizing, Hybrid Inverters & Microgrid Design",
          "Engineering Ethics, Safety Codes (IEEE/IEC) & Management",
          "Final Year Capstone Design & Industrial Internship",
        ],
        tools: ["PVsyst / ETAP", "IEEE Xplore", "GitHub Firmware"],
        milestone: "Dhammaystir mashruuc qalin-jabin oo xallinaya baahi koronto ama IoT ah oo Soomaaliya ka jirta.",
      },
    ],
    freeResources: [
      { name: "MIT OpenCourseWare (6.002 & 6.003)", note: "Casharrada Circuits & Signals ee MIT" },
      { name: "All About Circuits & LTspice", note: "Hagaha electronics iyo simulation bilaash ah" },
      { name: "KiCad + IEEE Student Resources", note: "Naqshadaynta PCB bilaash ah iyo halbeegyada IEEE" },
    ],
  },
  {
    id: "software-engineering",
    facultyId: "cs",
    title: "Software & Full-Stack Roadmap",
    subtitle: "Web, barnaamijyada mobile-ka, kaydinta xogta iyo Cloud, waa xirfadda ugu shaqada badan caalamka",
    sourceBadge: "roadmap.sh Verified",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#3B82F6",
    stages: [
      {
        id: "swe-1",
        phase: "Sanadka 1aad · Foundations",
        title: "HTML, CSS, JavaScript & Computer Science Basics",
        summary: "Baro sida web-ku u shaqeeyo, Git/GitHub, iyo barnaamij-qorista nadiifka ah.",
        skills: ["HTML5, CSS3 & Responsive Design", "JavaScript / TypeScript Core", "Git, GitHub & Terminal"],
        tools: ["VS Code", "Git", "Chrome DevTools"],
        milestone: "Dhis website portfolio gaar ah oo ku daabacan GitHub Pages.",
      },
      {
        id: "swe-2",
        phase: "Sanadka 2aad · Frontend & Databases",
        title: "React, SQL Databases & REST APIs",
        summary: "Baro dhisidda apps casri ah, xog-kaydinta PostgreSQL/Supabase, iyo Data Structures.",
        skills: ["React + TypeScript + Tailwind CSS", "PostgreSQL / Supabase & Auth Security", "Data Structures & Algorithms"],
        tools: ["React", "Supabase / PostgreSQL", "Tailwind CSS"],
        milestone: "Dhis app xog kaydiya oo leh login iyo dashboard (sida maamulka dugsiga/dukaanka).",
      },
      {
        id: "swe-3",
        phase: "Sanadka 3aad · Backend, Mobile & Testing",
        title: "Node.js / APIs, Mobile Apps & Software Architecture",
        summary: "Baro backend ammaan ah, mobile development (Flutter/React Native), iyo automated testing.",
        skills: ["Node.js / Express or Go Backend", "Mobile Apps & Payment Integrations (EVC/Stripe)", "Automated Testing & CI/CD"],
        tools: ["Node.js", "Docker", "GitHub Actions"],
        milestone: "Daabac app dhab ah oo dadku isticmaalaan (web ama mobile).",
      },
    ],
    freeResources: [
      { name: "The Odin Project & FreeCodeCamp", note: "Manhaj full-stack ah oo 100% bilaash ah" },
      { name: "CS50x (Harvard)", note: "Aasaaska Computer Science ee ugu fiican caalamka" },
    ],
  },
  {
    id: "medicine-surgery",
    facultyId: "med",
    title: "Medicine & Surgery (MBBS) Roadmap",
    subtitle: "Laga bilaabo Pre-Clinical ilaa Clinical Rotations, Internship & Takhasus",
    sourceBadge: "WHO / Medical Track",
    duration: "Sanadka 1aad ilaa 6aad",
    color: "#EF4444",
    stages: [
      {
        id: "med-1",
        phase: "Sanadka 1aad ilaa 2aad · Pre-Clinical",
        title: "Anatomy, Physiology & Biochemistry",
        summary: "Faham dhismaha iyo shaqada jirka bini’aadamka adigoo adeegsanaya Active Recall iyo Anki.",
        skills: ["Gross Anatomy & Histology", "Human Physiology & Biochemistry", "Medical Terminology & Study Systems (Anki)"],
        tools: ["Anki Flashcards", "Osmosis", "TeachMeAnatomy"],
        milestone: "Samee jadwal Anki ah oo maalinle ah si xifdintaadu u noqoto mid aan lumin.",
      },
      {
        id: "med-2",
        phase: "Sanadka 3aad ilaa 4aad · Para-Clinical",
        title: "Pathology, Pharmacology & Microbiology",
        summary: "Baro sababaha cudurrada, dawooyinka, iyo bilowga taariikh-qaadista bukaanka (History Taking).",
        skills: ["Pathology & Pathophysiology", "Pharmacology & Clinical Microbiology", "Physical Examination & Patient Communication"],
        tools: ["Pathoma / Sketchy", "PubMed", "WHO Clinical Guidelines"],
        milestone: "Ku tababaro qaadista taariikhda bukaanka iyo baaritaanka guud ee isbitaalka.",
      },
      {
        id: "med-3",
        phase: "Sanadka 5aad ilaa 6aad · Clinical & Internship",
        title: "Hospital Rotations, Research & Licensing",
        summary: "Ka shaqee waaxaha Internal Medicine, Surgery, Pediatrics, OB/GYN, una diyaargaroow takhasus.",
        skills: ["Internal Medicine, Surgery, Pediatrics & OB/GYN", "Emergency Triage & Clinical Case Presentation", "Medical Research & Postgrad Prep (USMLE/PLAB/Local)"],
        tools: ["UpToDate / Medscape", "SPSS / Research Tools"],
        milestone: "Dhammaystir Internship-ka oo qor warqad cilmi-baaris ah (Case Report / Thesis).",
      },
    ],
    freeResources: [
      { name: "Ninja Nerd & Osmosis (YouTube)", note: "Sharaxaad caafimaad oo aad u cad" },
      { name: "PubMed & WHO OpenWHO", note: "Koorsooyin caafimaad oo shahaado bilaash ah leh" },
    ],
  },
  {
    id: "civil-engineering",
    facultyId: "eng",
    title: "Civil & Structural Engineering Roadmap",
    subtitle: "Dhismaha, waddooyinka, biyaha, AutoCAD/Revit BIM & Maamulka Mashaariicda",
    sourceBadge: "ABET Standard",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#EA580C",
    stages: [
      {
        id: "civ-1",
        phase: "Sanadka 1aad ilaa 2aad",
        title: "Statics, Mechanics of Materials & AutoCAD",
        summary: "Baro xisaabta dhismaha, Surveying, iyo sawiridda naqshadaha injineernimada.",
        skills: ["Statics, Dynamics & Strength of Materials", "Land Surveying & Civil Materials", "2D/3D Technical Drawing (AutoCAD)"],
        tools: ["AutoCAD", "Excel Engineering", "Total Station"],
        milestone: "Sawir naqshad dhisme 2-dabaq ah oo dhammaystiran adigoo adeegsanaya AutoCAD.",
      },
      {
        id: "civ-2",
        phase: "Sanadka 3aad ilaa 4aad",
        title: "Structural Design, Hydraulics & Site Supervision",
        summary: "Baro naqshadaynta shubka iyo birta (RC Design), qiyaasta kharashka (BOQ), iyo maamulka goobta dhismaha.",
        skills: ["Reinforced Concrete & Steel Design", "Geotechnical, Water & Road Engineering", "Quantity Surveying (BOQ) & Project Management"],
        tools: ["ETABS / SAP2000", "Revit BIM", "MS Project"],
        milestone: "Diyaari Structural Analysis iyo BOQ dhammaystiran oo booqo 3 goob dhisme oo dhab ah.",
      },
    ],
    freeResources: [
      { name: "Structurefree & Practical Engineering", note: "Sharaxaad cad oo structural mechanics ah" },
      { name: "Autodesk Student License", note: "AutoCAD iyo Revit bilaash ah oo ardayda jaamacadda" },
    ],
  },
  {
    id: "economics-business-finance",
    facultyId: "econ",
    title: "Economics, Finance & Business Roadmap",
    subtitle: "Xisaabaadka, Maaliyadda, Excel/Power BI, Bangiyada iyo Ganacsiga Soomaaliya",
    sourceBadge: "CFA / ACCA Aligned",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#10B981",
    stages: [
      {
        id: "eco-1",
        phase: "Sanadka 1aad ilaa 2aad",
        title: "Accounting, Micro/Macro Economics & Excel",
        summary: "Baro aasaaska xisaabaadka, dhaqaalaha, iyo xirfadda Excel ee suuqa shaqada.",
        skills: ["Financial & Managerial Accounting (IFRS)", "Microeconomics, Macroeconomics & Statistics", "Advanced Excel (Pivot Tables, Modeling)"],
        tools: ["Microsoft Excel", "QuickBooks / Tally", "Google Sheets"],
        milestone: "Samee miisaaniyad iyo warbixin maaliyadeed (Income Statement iyo Cash Flow) gudaha Excel.",
      },
      {
        id: "eco-2",
        phase: "Sanadka 3aad ilaa 4aad",
        title: "Financial Analysis, Data BI & NGO/Bank Careers",
        summary: "Baro falanqaynta xogta dhaqaalaha, maaliyadda Islaamiga ah, iyo diyaarinta qorshe ganacsi.",
        skills: ["Corporate & Islamic Finance Fundamentals", "Business Intelligence (Power BI) & Econometrics", "Grant/NGO Financial Reporting & Entrepreneurship"],
        tools: ["Power BI", "Stata / SPSS", "IFRS Standards"],
        milestone: "Dhis Dashboard Power BI ah oo falanqaynaya iibka iyo kharashka shirkad ama hay’ad.",
      },
    ],
    freeResources: [
      { name: "Corporate Finance Institute (Free Courses)", note: "Excel iyo Financial Modeling bilaash ah" },
      { name: "Khan Academy Economics & Finance", note: "Aasaaska dhaqaalaha oo fudud" },
    ],
  },
  {
    id: "law-sharia",
    facultyId: "law",
    title: "Law & Sharia Roadmap",
    subtitle: "Shareecada, Qaanuunka, Qorista Heshiisyada, Maxkamad-matalidda iyo La-talinta Sharciga",
    sourceBadge: "Legal Practice Track",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#8B5CF6",
    stages: [
      {
        id: "law-1",
        phase: "Sanadka 1aad ilaa 2aad",
        title: "Legal Foundations, Fiqh & Constitutional Law",
        summary: "Baro fahamka qaanuunka, Usuulul-Fiqhi, iyo habka doodda sharciga ah.",
        skills: ["Introduction to Law & Somali Legal System", "Usul al-Fiqh & Islamic Jurisprudence", "Legal Research, Writing & Case Analysis"],
        tools: ["Legal Citations", "Somali Constitution & Statutes"],
        milestone: "Qor qoraal falanqayn sharci ah (Legal Memo) oo ku saabsan heshiis ganacsi.",
      },
      {
        id: "law-2",
        phase: "Sanadka 3aad ilaa 4aad",
        title: "Contract Drafting, Advocacy & International Law",
        summary: "Baro qorista heshiisyada shirkadaha, maxkamad-matalidda (Moot Court), iyo xuquuqul insaanka.",
        skills: ["Commercial, Contract & Corporate Law", "Criminal Procedure & Courtroom Advocacy", "International Law, Arbitration & NGO Legal Work"],
        tools: ["Contract Templates", "Moot Court Practice"],
        milestone: "Ka qayb-gal dood maxkamadeed (Moot Court) ama tababar xafiis qareen iyo maxkamad.",
      },
    ],
    freeResources: [
      { name: "Coursera Legal Writing (Financial Aid)", note: "Qorista sharciga iyo heshiisyada caalamiga ah" },
    ],
  },
  {
    id: "public-health-pharmacy",
    facultyId: "health",
    title: "Public Health, Nursing & Pharmacy Roadmap",
    subtitle: "Caafimaadka Bulshada, Dawooyinka, M&E iyo Shaqooyinka Hay’adaha Caafimaadka",
    sourceBadge: "WHO / NGO Aligned",
    duration: "Sanadka 1aad ilaa 4aad",
    color: "#06B6D4",
    stages: [
      {
        id: "hlth-1",
        phase: "Sanadka 1aad ilaa 2aad",
        title: "Human Biology, Epidemiology & Biostatistics",
        summary: "Baro aasaaska caafimaadka, ka-hortagga cudurrada faafa, iyo tirakoobka caafimaadka.",
        skills: ["Epidemiology & Disease Prevention", "Biostatistics & Health Data Collection", "Nutrition, Maternal & Child Health"],
        tools: ["KoboToolbox", "Excel / SPSS", "OpenWHO"],
        milestone: "Samee foom xog-ururin caafimaad gudaha KoboToolbox oo falanqee natiijada.",
      },
      {
        id: "hlth-2",
        phase: "Sanadka 3aad ilaa 4aad",
        title: "Health Program Management, M&E & Field Practice",
        summary: "U diyaargaroow shaqooyinka Wasaaradda Caafimaadka, WHO, UNICEF, iyo isbitaallada.",
        skills: ["Monitoring & Evaluation (M&E) & Project Proposal Writing", "Supply Chain & Rational Drug Use", "Community Health Campaign & Field Internship"],
        tools: ["DHIS2", "SPSS / R", "WHO Protocols"],
        milestone: "Qaado 2 shahaado oo OpenWHO ah oo samee tababar xarun caafimaad/NGO.",
      },
    ],
    freeResources: [
      { name: "OpenWHO.org", note: "Koorsooyin caafimaad oo bilaash ah oo shahaado WHO leh" },
      { name: "Kaya (Humanitarian Leadership Academy)", note: "Koorsooyinka NGO & M&E oo bilaash ah" },
    ],
  },
];

export const comingSoonRoadmaps: { title: string; faculty: string; eta: string }[] = [
  { title: "Cybersecurity & Ethical Hacking", faculty: "Computer Science", eta: "Dhawaan" },
  { title: "Solar PV & Renewable Energy Grids", faculty: "Electrical Eng.", eta: "Dhawaan" },
  { title: "Flutter & React Native Mobile Dev", faculty: "Computer Science", eta: "Dhawaan" },
  { title: "Agribusiness & Climate-Smart Farming", faculty: "Agriculture", eta: "Dhawaan" },
  { title: "Clinical Dentistry & Orthodontics", faculty: "Dentistry", eta: "Dhawaan" },
  { title: "Journalism, Media & Digital Marketing", faculty: "Arts & Media", eta: "Dhawaan" },
];

export const somaliaChallenges: SomaliaChallenge[] = [
  {
    id: "english-barrier",
    category: "Luqadda & Waxbarashada",
    title: "Caqabadda 1: Ka guuridda Soomaali/Carabi una guuridda English-ka Jaamacadda",
    problem:
      "Arday badan oo dugsiga sare ku dhigtay Soomaali ama Carabi ayaa semester-ka koowaad ku adkaata fahamka buugaagta, slides-ka, iyo imtixaannada English-ka ah.",
    commonMistake:
      "Inaad cutubka oo dhan Google Translate geliso. Taasi waxay kaa luminaysaa erayada farsamada ah ee macallinku imtixaanka ku weydiiyo.",
    solutionSteps: [
      "90 maalmood ka hor jaamacadda, maalin kasta 30 daqiiqo baro erayada muhiimka ah ee kulliyaddaada (Academic Vocabulary).",
      "Isticmaal YouTube subtitles (English captions) marka aad daawanayso casharrada, hana ku tiirsanaan tarjumaad toos ah oo keliya.",
      "Samee buug yar oo 'Glossary' ah oo aad ku qorto 10 eray oo cusub maalin kasta oo kulliyaddaada la xiriira.",
      "La samee koox 3 arday ah oo usbuucii laba jeer English ku sharaxda casharka (Peer Explanation).",
    ],
    actionKitTitle: "Qorshaha 7-da Maalmood ee Luqadda Kulliyadda",
    actionKitItems: [
      "Maalinta 1-2: Soo ururi 30 eray oo aasaasi u ah kulliyaddaada (sida Anatomy, Algorithm, Balance Sheet).",
      "Maalinta 3-4: Akhri 2 bog oo hordhac ah adigoo hoosta ka xarriiqaya erayada soo noqnoqda oo keliya.",
      "Maalinta 5-7: Ku duub codkaaga 2 daqiiqo adigoo sharaxaya casharka, kadibna dhageyso si aad kalsooni u hesho.",
    ],
    quickTip: "Ha ka xishoon qaladka hadalka. Jaamacaddu waxay rabtaa faham iyo qoraal cad, ma aha lahjad Ingiriis ah.",
  },
  {
    id: "university-choice-fees",
    category: "Doorashada iyo Khidmadda",
    title: "Caqabadda 2: Doorashada Jaamacadda Saxda ah iyo Maareynta Khidmadda",
    problem:
      "Jaamacado badan ayaa dalka ka jira, wayna adag tahay in la kala garto tayada, aqoonsiga, iyo sida loo helo deeq waxbarasho.",
    commonMistake:
      "Inaad isqorto jaamacad xayeysiiskeedu qurux badan yahay adigoon eegin shaybaarka kulliyaddaada ama weydiin ardayda hadda dhigata.",
    solutionSteps: [
      "Hubi in kulliyadda aad rabto ay jaamacaddaasi ku leedahay shaybaar, macallimiin khibrad leh, iyo arday hore u qalin-jabiyay oo shaqeeya.",
      "La hadal ugu yaraan 2 arday oo hadda dhigta sanadka 3aad ama 4aad ee jaamacaddaas, oo weydii tayada waxbarashada dhabta ah.",
      "Isbarbar dhig khidmadda xilli-dugsiyeedka, gaadiidka, iyo buugaagta si aadan dhexda uga joogsan.",
      "Diyaari shahaadada dugsiga sare iyo dhibco sare si aad u codsato deeqaha waxbarasho ee gudaha iyo dibadda.",
    ],
    actionKitTitle: "5 Su'aalood oo Aad Weydiiso Xafiiska Diiwaangelinta",
    actionKitItems: [
      "1. Kulliyaddan ma leedahay shaybaar u gaar ah iyo saacado tababar oo rasmi ah?",
      "2. Imisa boqolkiiba qalin-jabiyayaasha kulliyaddan ayaa hela internship ama shaqo sanadka ugu horreeya?",
      "3. Khidmadda semester-ka ma ku jiraan imtixaanka, aqoonsiga (ID), iyo shaybaarka mise waa lacag gooni ah?",
      "4. Haddii darajadaydu ka sarrayso 3.7 GPA, ma jirtaa deeq ama dhimis khidmad ah (Merit Discount)?",
    ],
    quickTip: "Jaamacadda ugu magaca weyn mar walba ma aha tan ugu fiican kulliyaddaada. Eeg tayada kulliyadda gaarka ah.",
  },
  {
    id: "degree-vs-skills",
    category: "Shaqada iyo Mustaqbalka",
    title: "Caqabadda 3: Shahaado Keliya Shaqo Ma Keento",
    problem:
      "Soomaaliya waxaa ka jira arday badan oo qalin-jabisay balse aan lahayn xirfad gacanta lagu qabto ama khibrad shaqo.",
    commonMistake:
      "Inaad sugto ilaa sanadka 4aad ama qalin-jabinta ka hor inta aadan baran xirfad suuqa shaqada laga rabo.",
    solutionSteps: [
      "Laga bilaabo Sanadka 1aad, raac khariidadda kulliyaddaada oo baro ugu yaraan hal xirfad oo suuqa laga rabo (Excel, Python, AutoCAD, KoboToolbox, PCB, iwm).",
      "Sanadka 2aad bilow inaad samayso mashaariic dhab ah oo aad ku kaydiso fayl shaqo (Portfolio).",
      "Sanadka 3aad raadi tababar bilaash ah (Internship ama mutadawacnimo) xitaa 2 bilood. Khibraddaas ayaa kaa saaraysa tartanka.",
      "Sameyso akoon LinkedIn ah oo nadiif ah oo la xiriir dadka ka shaqeeya mihnaddaada gudaha Soomaaliya iyo dibadda.",
    ],
    actionKitTitle: "Qaaciddada Sanad-Sanadka ee Dhisidda Xirfadda",
    actionKitItems: [
      "Sanadka 1aad: Baro Computer + Excel/English + xirfad aasaasi ah oo kulliyaddaada la xiriirta.",
      "Sanadka 2aad: Dhis 2 mashruuc oo la taaban karo (sida xog-falanqayn, naqshad, ama warbixin cilmiyeed).",
      "Sanadka 3aad: U shaqee si mutadawacnimo ah xitaa 6 toddobaad xilli fasax si aad CV dhab ah u hesho.",
    ],
    quickTip: "Qaaciddada guusha: Shahaadada Jaamacadda + Hal Xirfad Adag + Hal Tababar Shaqo = Fursad shaqo oo degdeg ah.",
  },
  {
    id: "family-pressure",
    category: "Go’aanka iyo Qoyska",
    title: "Caqabadda 4: Rabitaanka Waalidka iyo Doonistaada Dhabta ah",
    problem:
      "Waalidiin badan waxay jecel yihiin kulliyado gaar ah (sida Caafimaadka ama Injineernimada) iyagoo u raba wanaaggaaga, xitaa haddii kartidaadu meel kale jirto.",
    commonMistake:
      "Inaad waalidka la muranto adigoon tusin xog cad, shaqooyinka kulliyadda aad rabto, iyo qorshe dhaqaale.",
    solutionSteps: [
      "Ha la murmin waalidka. Tusi ixtiraam, kadibna la wadaag natiijadaada Hagaha Kulliyadda iyo boqolkiiba ku habboonaantaada.",
      "U sharax 3-da shaqo ee laga helo kulliyadda aad doorbidayso iyo dadka guulaystay ee ka baxay.",
      "Haddii aad u dhaxayso labo kulliyadood, samee isbarbardhig cad oo wadajir u eega.",
    ],
    actionKitTitle: "Qoraalka Wadahadalka Waalidka (La Soco Tallaabooyinkan)",
    actionKitItems: [
      "Bilow ixtiraam: 'Aabbo/Hooyo, waxaan ogahay inaad wanaaggayga rabtaan, waana idinkaga mahadcelinayaa.'",
      "Tusi xogta: 'Imtixaankan cilmiyeed wuxuu ii soo saaray inaan X% ku habboonahay kulliyaddan.'",
      "Tusi mustaqbalka: 'Kulliyaddani waxay leedahay shaqooyinkan, waxaana diyaar u ahay inaan dadaal buuxa geliyo.'",
    ],
    quickTip: "Waalidku wuxuu rabaa mustaqbal ammaan ah. Marka aad tusto qorshe waxbarasho oo cad, way ku garab istaagayaan.",
  },
  {
    id: "study-system-gpa",
    category: "Waxbarashada iyo Darajada",
    title: "Caqabadda 5: Habka Waxbarashada Jaamacadda iyo Ilaalinta Darajada (GPA)",
    problem:
      "Jaamacaddu ma aha sida dugsiga sare oo macallinku wax walba kuu yeeriyo. Ardayda qaar darajadoodu way hoos u dhacdaa bilowga hore.",
    commonMistake:
      "Inaad ka maqnaato fasallada labada toddobaad ee hore ama aad sugto toddobaadka imtixaanka (Midterm/Final).",
    solutionSteps: [
      "Isticmaal habka is-weydiinta su’aalaha (Active Recall) halkii aad qoraalka 10 jeer ka akhrin lahayd.",
      "Sannadka koowaad ula dhaqan sida midka ugu muhiimsan: darajo sare oo bilowga ah way fududahay in la ilaaliyo.",
      "Maalin kasta 90 daqiiqo oo joogto ah ayaa ka fiican 10 saac oo habeenka imtixaanka la soo jeedo.",
      "Isticmaal habka Pomodoro (25 daqiiqo waxbarasho iyo 5 daqiiqo nasasho) adigoo taleefanka fogeynaya.",
    ],
    actionKitTitle: "Nidaamka Ilaalinta 3.5+ GPA ee Semester-ka 1aad",
    actionKitItems: [
      "Toddobaad kasta Jimcaha: Dib u eeg 3-da mawduuc ee toddobaadkaas la dhigtay muddo 45 daqiiqo ah.",
      "Midterm ka hor: Xalli ugu yaraan 2 imtixaan oo hore (Past Quizzes) oo saacad ku cabbiran.",
      "La xiriir macallinka (Office Hours) isla marka hal cutub kugu adkaado inta uusan urursamin.",
    ],
    quickTip: "Haddii aad rabto deeq waxbarasho oo heerka labaad ah (Master’s) qalin-jabinta kadib, ilaali in darajadaadu ka sarreyso 3.5 / 4.0.",
  },
  {
    id: "phone-first-low-bandwidth",
    category: "Teknolojiyadda iyo Internetka",
    title: "Caqabadda 6: Waxbarashada haddii aadan haysan Kombiyuutar qaali ah ama Internet degdeg ah",
    problem:
      "Arday badan oo cusub ma haystaan kombiyuutar bilowga jaamacadda, internetkuna wuu xaddidnaan karaa.",
    commonMistake:
      "Inaad waxbarashada dib u dhigto ilaa aad ka iibsato laptop qaali ah, adigoo taleefanka iyo shaybaarka jaamacadda ka faa'iidaysan karay.",
    solutionSteps: [
      "Soo degso buugaagta PDF iyo muuqaallada waxbarashada marka aad Wi-Fi hesho (jaamacadda ama maktabadda).",
      "Isticmaal barnaamijyo bilaash ah oo taleefanka ka shaqeeya: AnkiDroid, Google Docs offline, iyo Khan Academy.",
      "Ka faa’iidayso shaybaarka kombiyuutarka ee jaamacadda saacadaha firaaqada si aad ugu tababarto Excel, AutoCAD, ama barnaamij-qorista.",
    ],
    actionKitTitle: "Qalabka Bilaashka ah ee Taleefanka (Offline Ready)",
    actionKitItems: [
      "AnkiDroid / Quizlet: Xifdinta erayada iyo qaacidooyinka adigoon internet isticmaalin.",
      "Google Docs & Sheets Offline: Qorista warbixinada iyo xisaabaadka meel kasta.",
      "Termux / SoloLearn / Khan Academy: Tababar barnaamij-qoris iyo saynis oo ku jira taleefanka.",
    ],
    quickTip: "Qalab qaali ah kuguma xirna bilowga. Joogteynta iyo ka faa’iidaysiga shaybaarka jaamacadda ayaa ku filan.",
  },
];

export const readinessChecklist: ReadinessItem[] = [
  {
    id: "rc-1",
    phase: "1-30 Maalmood",
    category: "Dukumiinti",
    title: "Diyaari Shahaadada Dugsiga Sare, Transcript-ka & Aqoonsiga",
    detail: "Hubi in magacaagu saddexda magac isku mid ka yahay shahaadada, aqoonsiga (ID), iyo baasaboorka.",
    timeEstimate: "Maalinta 1 ilaa 7",
    hiraalTip: "Khadlad yar oo xarfaha magaca ah wuxuu dib u dhigi karaa diiwaangelinta jaamacadaha iyo deeqaha.",
  },
  {
    id: "rc-2",
    phase: "1-30 Maalmood",
    category: "Go’aan",
    title: "Xulo Kulliyadda 1aad & Keydka 2aad (Option B)",
    detail: "Isticmaal natiijada Hagaha Kulliyadda + Isbarbardhigga Pro si aad u hubiso inaad leedahay labo waddo oo cad.",
    timeEstimate: "Maalinta 8 ilaa 14",
    hiraalTip: "Mar walba hay Option B haddii tartanka gelitaanka ama khidmaddu isbeddelaan.",
  },
  {
    id: "rc-3",
    phase: "1-30 Maalmood",
    category: "Dhaqaale",
    title: "Xisaabi Miisaaniyadda Semester-ka (Khidmad + Gaadiid + Buugaag)",
    detail: "La fariiso qoyskaaga oo deji qorshe dhaqaale oo daboolaya ugu yaraan 2 semester ee ugu horreeya.",
    timeEstimate: "Maalinta 15 ilaa 22",
    hiraalTip: "Ku dar 15% kharash kayd ah oo loogu talagalay daabacaadda, shaybaarka, iyo gaadiidka.",
  },
  {
    id: "rc-4",
    phase: "1-30 Maalmood",
    category: "Wadaagis Qoys",
    title: "La fariiso Waalidka oo Tusi Qorshahaaga Waxbarasho",
    detail: "U sharax natiijadaada, sababta kulliyaddan kuugu habboon tahay, iyo 3 shaqo oo laga helo.",
    timeEstimate: "Maalinta 23 ilaa 30",
    hiraalTip: "Tusaalaynta qorshe cad waxay waalidka siisaa kalsooni ay kugu garab istaagaan.",
  },
  {
    id: "rc-5",
    phase: "31-60 Maalmood",
    category: "Luqad",
    title: "Bilow 30 Daqiiqo oo Academic English & Glossary ah",
    detail: "Maalin kasta qor oo xifdi 10 eray oo kulliyaddaada la xiriira si Semester 1 kuugu fududaado.",
    timeEstimate: "Maalinta 31 ilaa 45",
    hiraalTip: "Daawo casharro leh English Subtitles halkii aad ka akhrin lahayd tarjumaad keliya.",
  },
  {
    id: "rc-6",
    phase: "31-60 Maalmood",
    category: "Diyaarinta",
    title: "Dib u Eeg 5-ta Maado ee Gelitaanka (4 Saynis + Ingiriisi)",
    detail: "Ku tababaro PDFs-ka bilaashka ah iyo Imtixaanka Predict adigoo saacad iska eegaya.",
    timeEstimate: "Maalinta 35 ilaa 55",
    hiraalTip: "Xoogga saar su'aalaha xallinta iyo fahamka ereyada Sayniska ee Ingiriisiga.",
  },
  {
    id: "rc-7",
    phase: "31-60 Maalmood",
    category: "Xirfad",
    title: "Baro Aasaaska Computer-ka (Word, PowerPoint, Email Rasmi ah)",
    detail: "Sameyso email xirfad leh (magacaaga@gmail.com) oo baro sida loo qoro warqad iyo presentation.",
    timeEstimate: "Maalinta 45 ilaa 52",
    hiraalTip: "Assignment-yada jaamacadda badankood waxay rabaan Word, PDF, iyo PowerPoint nadiif ah.",
  },
  {
    id: "rc-8",
    phase: "31-60 Maalmood",
    category: "Jaamacad",
    title: "Booqo 2 Jaamacadood oo La Hadal Arday Sanadka 3aad ah",
    detail: "Weydii tayada macallimiinta, xaaladda shaybaarka, iyo nidaamka imtixaannada dhabta ah.",
    timeEstimate: "Maalinta 53 ilaa 60",
    hiraalTip: "Ardayga dhigta jaamacadda wuxuu kuu sheegayaa runta uusan xayeysiisku qorin.",
  },
  {
    id: "rc-9",
    phase: "61-90 Maalmood",
    category: "Qorshe",
    title: "Dooro Roadmap-kaaga oo Calaamadee Marxaladda 1aad",
    detail: "Ogow xirfadaha iyo tools-ka suuqa shaqada ee aad baran doonto 6-da bilood ee soo socda.",
    timeEstimate: "Maalinta 61 ilaa 70",
    hiraalTip: "Ardayda bilaaba hal xirfad gacan-qabasho ah Sanadka 1aad way ka horreeyaan kuwa suga qalin-jabinta.",
  },
  {
    id: "rc-10",
    phase: "61-90 Maalmood",
    category: "Imtixaan",
    title: "Dhammaystir 3 Tijaabo oo Predict ah & Eeg Ranking-ka",
    detail: "Hubi heerkaaga diyaarinta jaamacadda ama School si aad u saxdo meelaha daciifka ah ka hor maalinta rasmiga ah.",
    timeEstimate: "Maalinta 71 ilaa 80",
    hiraalTip: "Qor buug yar oo qaladaadkaaga ah si aadan hal su'aal laba jeer ugu khaldamin.",
  },
  {
    id: "rc-11",
    phase: "61-90 Maalmood",
    category: "Diiwaangelin",
    title: "Hubi Waqtiga Diiwaangelinta & Codsiga Deeqaha",
    detail: "U diyaari fayl PDF ah oo ku jira shahaadada, sawirka passport-size, iyo ID-gaaga si degdeg ah.",
    timeEstimate: "Maalinta 81 ilaa 86",
    hiraalTip: "Diiwaangelinta hore waxay kaa badbaadinaysaa boos buuxsama ama khidmad dheeraad ah.",
  },
  {
    id: "rc-12",
    phase: "61-90 Maalmood",
    category: "Mustaqbal",
    title: "Sameyso Akoon LinkedIn ah & Koox Waxbarasho (3 Arday)",
    detail: "Bilow dhisidda xiriirkaaga xirfadeed oo hel 2 arday oo kula mid ah oo kula diyaargarooba.",
    timeEstimate: "Maalinta 87 ilaa 90",
    hiraalTip: "Koox waxbarasho oo dhab ah waxay labanlaabtaa joogteynta iyo GPA-gaaga Sanadka 1aad.",
  },
];
