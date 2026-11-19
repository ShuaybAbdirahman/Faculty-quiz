import type { LocalizedList, LocalizedString } from "./quizData";

export interface FacultyFunPrompt {
  facultyId: string;
  badge: LocalizedString;
  question: LocalizedString;
  placeholder: LocalizedString;
  quickOptions: LocalizedList;
  insight: LocalizedString;
}

export const facultyFunPrompts: Record<string, FacultyFunPrompt> = {
  cs: {
    facultyId: "cs",
    badge: {
      so: "Su'aal Gaar ah · IT & CS",
      en: "Quick Spark · IT & CS",
      ar: "سؤال سريع · تقنية المعلومات",
    },
    question: {
      so: "Maxay ardayda Gamers-ka ku fiican u doortaan Kulliyadda IT & CS? Adiga ma ku fiican tahay Video Gaming?",
      en: "Why do top Gamers keep choosing IT & CS? Are you actually good at Video Gaming?",
      ar: "لماذا يختار اللاعبون الماهرون كلية تقنية المعلومات وعلوم الحاسوب؟ هل أنت بارع في ألعاب الفيديو؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban (tusaale: Haa, FIFA / PUBG / Code)...",
      en: "Write your short answer (e.g. Yes, FIFA / Coding)...",
      ar: "اكتب إجابتك القصيرة هنا...",
    },
    quickOptions: {
      so: ["Haa, Gamer ayaan ahay", "Wax yar", "Maya, Code & AI ayaan rabaa"],
      en: ["Yes, I'm a Gamer", "A little bit", "No, I'm here for Code & AI"],
      ar: ["نعم، أنا لاعب ماهر", "قليلاً", "لا، أريد البرمجة والذكاء الاصطناعي"],
    },
    insight: {
      so: "Xaqiiqada: Ciyaaraha adag waxay maskaxda ku tababaraan xallinta dhibaatooyinka degdegga ah, fikirka xeeladaysan, iyo u adkaysiga qaladaadka (debugging). Taas ayaa ka dhigta ardayda IT & CS kuwo si dhaqso ah u barta Coding-ka iyo AI!",
      en: "The secret: Tough games train your brain for fast problem solving, strategy, and patience through trial and error (debugging). That exact mindset helps IT & CS students master coding and AI fast!",
      ar: "الحقيقة: الألعاب الصعبة تدرّب العقل على حل المشكلات بسرعة والتفكير الاستراتيجي والصبر على الأخطاء (Debugging)، وهي نفس المهارة التي تجعل طلاب الحاسوب يتقنون البرمجة والذكاء الاصطناعي بسرعة!",
    },
  },
  eng: {
    facultyId: "eng",
    badge: {
      so: "Su'aal Gaar ah · Engineering",
      en: "Quick Spark · Engineering",
      ar: "سؤال سريع · الهندسة",
    },
    question: {
      so: "Do you know 1 + 1? Xisaabta caadiga ah waa 2, balse Injineerku muxuu ku darayaa?",
      en: "Do you know 1 + 1? In pure math it is 2, but what does an Engineer answer?",
      ar: "هل تعرف ناتج 1 + 1؟ في الرياضيات هو 2، لكن ماذا يضيف المهندس؟",
    },
    placeholder: {
      so: "Qor jawaabtaada (2, 2.5, ama 11?)...",
      en: "Type your answer (2, 2.5, or 11?)...",
      ar: "اكتب إجابتك (2 أم 2.5 أم 11؟)...",
    },
    quickOptions: {
      so: ["2 (Xisaab sax ah)", "2.5 (Safety Factor)", "11 (Hal-abuur)"],
      en: ["2 (Pure math)", "2.5 (Safety Factor)", "11 (Creative)"],
      ar: ["2 (رياضيات)", "2.5 (معامل أمان)", "11 (إبداع)"],
    },
    insight: {
      so: "Injineernimada dhabta ah, 1 + 1 kaliya ma aha 2: waxaa lagu daraa 'Factor of Safety' (tusaale 2.5 ama 3) si buundadu uusan weligeed u dumin xitaa marka culays lama filaan ah yimaado. Maskaxdaadu waxay diyaar u tahay xisaab dhab ah!",
      en: "In real engineering, 1 + 1 is never just 2: you add a Factor of Safety (like 2.5 or 3) so the bridge never collapses under unexpected load. Your mind is built for real-world precision!",
      ar: "في الهندسة الحقيقية، 1 + 1 لا تساوي 2 فقط، بل يُضاف إليها معامل أمان (مثل 2.5 أو 3) حتى لا ينهار الجسر أبداً عند الأحمال المفاجئة. عقلك مستعد للدقة العملية!",
    },
  },
  med: {
    facultyId: "med",
    badge: {
      so: "Su'aal Gaar ah · Caafimaadka",
      en: "Quick Spark · Medicine",
      ar: "سؤال سريع · الطب",
    },
    question: {
      so: "Ma u adkaysan kartaa 6 sano oo waxbarasho ah iyo far-qor dhakhtar oo qofna uusan akhrin karin?",
      en: "Can you handle 6 years of study and handwriting that only pharmacists can decode?",
      ar: "هل تتحمل 6 سنوات من الدراسة وخط يد طبي لا يفهمه إلا الصيدلي؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, diyaar ayaan ahay", "Fartaydu way qurux badan tahay", "Waan isku dayayaa"],
      en: ["Yes, I'm ready", "My handwriting is neat", "I'll do my best"],
      ar: ["نعم، مستعد تماماً", "خطي جميل جداً", "سأبذل جهدي"],
    },
    insight: {
      so: "Dhakhtarnimadu waa mihnadda kaliya ee hal go'aan oo sax ah uu nolol badbaadin karo. Far-qorka xun waa kaftan, balse dulqaadka, diiradda iyo naxariista ayaa ah sirta dhakhtarka guulaysta.",
      en: "Medicine is the one profession where a single sharp decision can save a life. Bad handwriting is just the joke; patience, focus, and empathy are the real superpower.",
      ar: "الطب هو المهنة التي قد ينقذ فيها قرار واحد دقيق حياة إنسان. الخط غير المقروء مجرد مزحة، أما الصبر والتركيز والرحمة فهي سر الطبيب الناجح.",
    },
  },
  dent: {
    facultyId: "dent",
    badge: {
      so: "Su'aal Gaar ah · Ilkaha",
      en: "Quick Spark · Dentistry",
      ar: "سؤال سريع · طب الأسنان",
    },
    question: {
      so: "Dadku marka ay arkaan kursiga dhakhtarka ilkaha way naxaan. Adigu sidee uga dhigi lahayd inuu dhoolla-caddeeyo?",
      en: "Most people get nervous seeing the dentist chair. How would you make them smile?",
      ar: "معظم الناس يتوترون عند رؤية كرسي طبيب الأسنان. كيف ستجعل المريض يبتسم؟",
    },
    placeholder: {
      so: "Qor fikraddaada gaaban...",
      en: "Write your short idea...",
      ar: "اكتب فكرتك القصيرة...",
    },
    quickOptions: {
      so: ["Hadallo deggan", "Farsamo xanuun yar", "Labadaba"],
      en: ["Calm reassurance", "Gentle precision", "Both"],
      ar: ["كلام مطمئن", "دقة بدون ألم", "كلاهما"],
    },
    insight: {
      so: "Dhakhtarka ilkuhu waa farshaxanle caafimaad: hal millimitir oo sax ah wuxuu soo celiyaa kalsoonida iyo dhoolla-caddaynta qofka.",
      en: "A great dentist blends medicine with artistry: one millimeter of precision restores a person's comfort and confidence.",
      ar: "طبيب الأسنان يجمع بين الطب والفن؛ مليمتر واحد دقيق يعيد للإنسان راحته وثقته بابتسامته.",
    },
  },
  pharm: {
    facultyId: "pharm",
    badge: {
      so: "Su'aal Gaar ah · Farmashiga",
      en: "Quick Spark · Pharmacy",
      ar: "سؤال سريع · الصيدلة",
    },
    question: {
      so: "Ma xifdin kartaa 300 oo magac daawo ah oo u eg luqad aan dhulka laga hadlin?",
      en: "Ready to memorize 300 drug names that sound like a secret alien language?",
      ar: "هل تستطيع حفظ 300 اسم دواء تبدو وكأنها لغة من كوكب آخر؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, xusuustaydu waa adag tahay", "Fahamka ayaa ka muhiimsan", "Waan baranayaa"],
      en: ["Yes, sharp memory", "Understanding beats cramming", "I'll master it"],
      ar: ["نعم، ذاكرتي قوية", "الفهم أهم من الحفظ", "سأتعلمها بالتدريج"],
    },
    insight: {
      so: "Farmashiistuhu ma xifdiyo magacyada oo keliya, wuxuu fahmaa kiimikada jidhka iyo sida laba daawo isugu falgalaan. Hal qalad oo yar ayuu ka ilaaliyaa bukaanka.",
      en: "Pharmacists do more than memorize names; they understand body chemistry and drug interactions, acting as the final safety shield for every patient.",
      ar: "الصيدلي لا يحفظ الأسماء فقط، بل يفهم كيمياء الجسم وتفاعلات الأدوية ليكون خط الأمان الأخير لكل مريض.",
    },
  },
  health: {
    facultyId: "health",
    badge: {
      so: "Su'aal Gaar ah · Caafimaadka Bulshada",
      en: "Quick Spark · Health Sciences",
      ar: "سؤال سريع · العلوم الصحية",
    },
    question: {
      so: "Haddii hal xaafad uu ka dillaaco hargab degdeg ah, maxaa ugu horreeya ee aad samayn lahayd?",
      en: "If a sudden flu hits a neighborhood, what is your very first move?",
      ar: "إذا انتشرت إنفلونزا مفاجئة في أحد الأحياء، ما أول خطوة تتخذها؟",
    },
    placeholder: {
      so: "Qor tallaabadada koowaad...",
      en: "Write your first step...",
      ar: "اكتب خطوتك الأولى...",
    },
    quickOptions: {
      so: ["Baadhista isha cudurka", "Wacyigelin degdeg ah", "Labadaba hal mar"],
      en: ["Trace the source", "Launch awareness", "Both at once"],
      ar: ["تتبع مصدر العدوى", "توعية سريعة", "كلاهما معاً"],
    },
    insight: {
      so: "Dhakhtarku wuxuu daweeyaa hal qof, balse khabiirka Caafimaadka Bulshadu wuxuu badbaadiyaa kumannaan qof ka hor inta uusan cudurku faafin.",
      en: "A clinician heals one patient at a time, while a Public Health specialist protects thousands before an outbreak even spreads.",
      ar: "الطبيب يعالج مريضاً واحداً، بينما خبير الصحة العامة يحمي آلاف الأشخاص قبل أن ينتشر المرض.",
    },
  },
  vet: {
    facultyId: "vet",
    badge: {
      so: "Su'aal Gaar ah · Xoolaha",
      en: "Quick Spark · Veterinary",
      ar: "سؤال سريع · الطب البيطري",
    },
    question: {
      so: "Bukaankaagu kuuma sheegi karo 'madaxa ayaa i xanuunaya'. Sidee ku ogaanaysaa xanuunkiisa?",
      en: "Your patient cannot say 'my head hurts'. How will you figure out what is wrong?",
      ar: "مريضك لا يستطيع أن يقول لك أين يؤلمه. كيف ستكتشف المرض؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Eegidda dhaqankiisa", "Baadhitaan shaybaar", "Labadaba"],
      en: ["Observe behavior", "Lab diagnostics", "Both together"],
      ar: ["ملاحظة سلوكه", "فحص مخبري", "كلاهما معاً"],
    },
    insight: {
      so: "Taas ayaa dhakhtarka xoolaha ka dhigta baadhe (detective) dhab ah! Soomaaliya oo xooluhu laf-dhabar u yihiin dhaqaalaheeda, xirfaddan waxay leedahay qiimo aan dhammaan.",
      en: "That makes veterinarians true medical detectives! In Somalia, where livestock is the backbone of the economy, this expertise is always in high demand.",
      ar: "هذا يجعل الطبيب البيطري محققاً طبياً حقيقياً، وفي الصومال حيث الثروة الحيوانية عماد الاقتصاد، تبقى هذه المهارة مطلوبة دائماً.",
    },
  },
  sci: {
    facultyId: "sci",
    badge: {
      so: "Su'aal Gaar ah · Sayniska",
      en: "Quick Spark · Sciences",
      ar: "سؤال سريع · العلوم",
    },
    question: {
      so: "Marka aad aragto wax yaab leh, ma iska dhaaftaa mise waxaad is weydiisaa 'Sidee ayay tani u shaqaysaa?'",
      en: "When you see something unusual, do you walk past or immediately ask 'How does that actually work?'",
      ar: "عندما ترى ظاهرة غريبة، هل تتجاهلها أم تتساءل فوراً: كيف تعمل هذه؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Mar walba waan baadhaa", "Tijaabo ayaan jecelahay", "Xogta ayaan hubiyaa"],
      en: ["Always investigate", "I love experiments", "I check the data"],
      ar: ["أبحث دائماً", "أحب التجارب", "أتحقق من البيانات"],
    },
    insight: {
      so: "Su'aasha 'Sidee iyo Maxay?' waa bilowga cilmi kasta. Caalamka maanta (AI, tamarta, daawooyinka) wuxuu ku taagan yahay ardayda Sayniska ee aan joojin baadhista.",
      en: "Asking 'How and Why?' is the spark behind every breakthrough. Modern AI, clean energy, and medicine all rest on curious science minds.",
      ar: "سؤال «كيف ولماذا؟» هو شرارة كل اكتشاف عظيم، وعالم اليوم من الذكاء الاصطناعي والطاقة والدواء يقوم على عقول العلوم.",
    },
  },
  econ: {
    facultyId: "econ",
    badge: {
      so: "Su'aal Gaar ah · Dhaqaalaha",
      en: "Quick Spark · Economics",
      ar: "سؤال سريع · الاقتصاد",
    },
    question: {
      so: "Haddii maanta laguu dhiibo $100, ma iibsan lahayd wax aad jeceshahay mise waxaad ka dhigi lahayd $200?",
      en: "If someone hands you $100 today, do you spend it right away or figure out how to turn it into $200?",
      ar: "لو حصلت اليوم على 100 دولار، هل تنفقها فوراً أم تفكر كيف تحولها إلى 200 دولار؟",
    },
    placeholder: {
      so: "Qor qorshahaaga $100...",
      en: "Write your $100 plan...",
      ar: "اكتب خطتك للـ 100 دولار...",
    },
    quickOptions: {
      so: ["$200 ayaan ka dhigayaa", "Qayb baan maalgashanayaa", "Qorshe ayaan dejinayaa"],
      en: ["Turn it into $200", "Invest half", "Build a budget first"],
      ar: ["أحولها إلى 200 دولار", "أستثمر نصفها", "أضع ميزانية أولاً"],
    },
    insight: {
      so: "Maskaxda ganacsiga iyo dhaqaaluhu waxay aragtaa fursad halka dadka kale ka arkaan kharash. Taasi waa sababta kulliyaddan kuugu soo baxday.",
      en: "An economic mind sees opportunity and leverage where others only see spending. That instinct is why this faculty matched you.",
      ar: "العقلية الاقتصادية ترى الفرصة والاستثمار حيث يرى الآخرون مجرد إنفاق، وهذا سبب توافق هذه الكلية معك.",
    },
  },
  law: {
    facultyId: "law",
    badge: {
      so: "Su'aal Gaar ah · Sharciga",
      en: "Quick Spark · Sharia & Law",
      ar: "سؤال سريع · الشريعة والقانون",
    },
    question: {
      so: "Asxaabtaadu ma ku yidhaahdaan 'Dooddaada lama gaari karo' marka muran yar yimaado?",
      en: "Do your friends say 'Nobody wins a debate against you' whenever a disagreement pops up?",
      ar: "هل يقول لك أصدقاؤك دائماً «لا أحد يستطيع هزيمتك في النقاش» عند أي خلاف؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, mar walba", "Kaliya marka aan xaq leeyahay", "Caddeyn ayaan raadiyaa"],
      en: ["Yes, every time", "Only when I'm right", "I bring receipts"],
      ar: ["نعم دائماً", "فقط عندما أكون على حق", "أعتمد على الدليل"],
    },
    insight: {
      so: "Qareenka iyo garsooraha wanaagsan kuma guulaysto qaylo, wuxuu ku guulaystaa caddeyn, degganaan, iyo garashada xaqqa iyo xeerka.",
      en: "Great lawyers and judges never win by shouting; they win with evidence, calm logic, and a deep sense of fairness.",
      ar: "المحامي والقاضي الناجح لا ينتصر برفع الصوت، بل بالدليل والمنطق الهادئ وفهم الحق والقانون.",
    },
  },
  pol: {
    facultyId: "pol",
    badge: {
      so: "Su'aal Gaar ah · Siyaasadda",
      en: "Quick Spark · Political Science",
      ar: "سؤال سريع · العلوم السياسية",
    },
    question: {
      so: "Haddii laba saaxiib isku dhacaan, ma tahay qofka heshiisiiya ee labada dhinacba dhegaysta?",
      en: "When two friends clash, are you the diplomat who gets both sides to shake hands?",
      ar: "إذا اختلف صديقان، هل أنت الدبلوماسي الذي يستمع للطرفين ويصلح بينهما؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, waan heshiisiiyaa", "Labada dhinac baan dhegaystaa", "Xal fog baan raadiyaa"],
      en: ["Yes, I mediate", "I listen to both sides", "I look for long-term solutions"],
      ar: ["نعم، أصلح بينهما", "أستمع للطرفين", "أبحث عن حل جذري"],
    },
    insight: {
      so: "Diblomaasiyadda iyo hoggaamintu waxay ka bilaabmaan dhegaysi iyo xal-raadin. Adduunka maanta wuxuu u baahan yahay hoggaamiyeyaal deggen oo leh aragti fog.",
      en: "Real diplomacy and leadership begin with listening and building consensus. The world always needs calm leaders with long-term vision.",
      ar: "الدبلوماسية والقيادة تبدآن بالإنصات وبناء التوافق، والعالم اليوم يحتاج قادة هادئين برؤية بعيدة.",
    },
  },
  edu: {
    facultyId: "edu",
    badge: {
      so: "Su'aal Gaar ah · Waxbarashada",
      en: "Quick Spark · Education",
      ar: "سؤال سريع · التربية",
    },
    question: {
      so: "Marka ardaydu ku wareeraan cashar adag, ma adigaa 3 daqiiqo ugu sharraxa oo ay fahmaan?",
      en: "When classmates get stuck on a tough lesson, are you the one who explains it clearly in 3 minutes?",
      ar: "عندما يجد زملاؤك صعوبة في درس معقد، هل أنت من يشرحه ببساطة في 3 دقائق؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, aad bay iigu fududdahay", "Waan jecelahay caawinta", "Tusaalooyin baan adeegsadaa"],
      en: ["Yes, comes naturally", "I love helping others", "I use simple examples"],
      ar: ["نعم، بسهولة", "أحب مساعدة الآخرين", "أستخدم أمثلة بسيطة"],
    },
    insight: {
      so: "Macallinku waa aasaaska dhakhtarka, injineerka, iyo madaxweynaha. Awoodda aad wax adag uga dhigi karto mid fudud waa hibo qaali ah.",
      en: "Teachers build the doctors, engineers, and leaders of tomorrow. Turning complex ideas into clear understanding is a rare gift.",
      ar: "المعلم هو أساس الطبيب والمهندس والقائد؛ والقدرة على تبسيط الأفكار المعقدة موهبة نادرة.",
    },
  },
  arts: {
    facultyId: "arts",
    badge: {
      so: "Su'aal Gaar ah · Warbaahinta & Hal-abuurka",
      en: "Quick Spark · Media & Arts",
      ar: "سؤال سريع · الإعلام والفنون",
    },
    question: {
      so: "Ma tahay qofka sheeko 2 daqiiqo ah ka dhigi kara muuqaal qof walba u dheg-taago?",
      en: "Can you turn an ordinary 2-minute story into something everyone stops scrolling to watch?",
      ar: "هل تستطيع تحويل قصة عادية مدتها دقيقتان إلى محتوى يجذب انتباه الجميع؟",
    },
    placeholder: {
      so: "Qor jawaabtaada gaaban...",
      en: "Write your short answer...",
      ar: "اكتب إجابتك القصيرة...",
    },
    quickOptions: {
      so: ["Haa, sheeko-xariir baan ahay", "Muuqaal & Design baan jecelahay", "Qoraal baan ku fiicanahay"],
      en: ["Yes, I'm a storyteller", "I love video & design", "Writing is my strength"],
      ar: ["نعم، أجيد سرد القصص", "أحب الفيديو والتصميم", "الكتابة قوتي"],
    },
    insight: {
      so: "Warbaahinta iyo hal-abuurka casriga ah ayaa maanta xukuma dareenka iyo ganacsiga adduunka. Codkaaga iyo aragtidaadu waxay gaari karaan malaayiin qof.",
      en: "Modern media and creative storytelling shape global culture and business. Your voice and perspective can reach millions.",
      ar: "الإعلام وصناعة المحتوى الإبداعي يقودان التأثير والأعمال اليوم، وصوتك ورؤيتك يمكن أن يصلا إلى الملايين.",
    },
  },
  agri: {
    facultyId: "agri",
    badge: {
      so: "Su'aal Gaar ah · Beeraha & Deegaanka",
      en: "Quick Spark · Agriculture",
      ar: "سؤال سريع · الزراعة والبيئة",
    },
    question: {
      so: "Ma ogtahay in qofka cunto abuura uu ka awood badan yahay qofka lacag daabaca?",
      en: "Ever thought about how the person who grows food holds more real power than the one who prints money?",
      ar: "هل فكرت يوماً أن من ينتج الغذاء يملك قوة حقيقية أكبر ممن يطبع المال؟",
    },
    placeholder: {
      so: "Qor ra'yigaaga gaaban...",
      en: "Write your short thought...",
      ar: "اكتب رأيك القصير...",
    },
    quickOptions: {
      so: ["Run weeye", "Mustaqbalku waa AgriTech", "Deegaanka ayaan jecelahay"],
      en: ["100% true", "AgriTech is the future", "I care about nature"],
      ar: ["صحيح تماماً", "المستقبل للزراعة الذكية", "أهتم بالبيئة"],
    },
    insight: {
      so: "Sugnaanta cuntada iyo beeraha casriga ah (AgriTech) waa hantida ugu weyn ee qarnigan, gaar ahaan Soomaaliya oo leh dhul beereed iyo wabiyo qani ah.",
      en: "Food security and modern AgriTech are among the biggest opportunities of this century, especially with Somalia's rich land and rivers.",
      ar: "الأمن الغذائي والزراعة الحديثة من أعظم فرص هذا القرن، خاصة مع الأراضي الخصبة والأنهار في الصومال.",
    },
  },
};

export function getFacultyFunPrompt(facultyId: string): FacultyFunPrompt {
  return facultyFunPrompts[facultyId] ?? facultyFunPrompts.cs;
}
