import type { LocalizedList, LocalizedString } from "./quizData";

export interface FacultyFunPrompt {
  facultyId: string;
  badge: LocalizedString;
  question: LocalizedString;
  quickOptions: LocalizedList;
  optionInsights: LocalizedList;
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
    quickOptions: {
      so: ["Haa, Gamer ayaan ahay", "Wax yar", "Maya, Code & AI ayaan rabaa"],
      en: ["Yes, I'm a Gamer", "A little bit", "No, I'm here for Code & AI"],
      ar: ["نعم، أنا لاعب ماهر", "قليلاً", "لا، أريد البرمجة والذكاء الاصطناعي"],
    },
    optionInsights: {
      so: [
        "Maskaxda Gamer-ka dhabta ah waxay la qabsatay go'aan degdeg ah, xeelad adag, iyo inaysan ka quusan marxalad adag (Boss Level). Dabeecaddaas ayaa kuu fududaynaysa Debugging-ka iyo Software Engineering-ka!",
        "Xitaa ciyaaraha fudud waxay muujinayaan inaad jeceshahay xallinta caqabadaha. Haddii aad ku bilowdo Python ama Web Development, isla xiisihii ciyaarta ayaad ku dhisi doontaa apps adiga kuu gaar ah.",
        "Toos ayaad u abbaartay hal-abuurka dhabta ah! Ardayda tooska ugu boodda Code iyo AI ma daawadaan tiknoolajiyadda oo keliya, ee waxay dhisaan barnaamijyo iyo ganacsiyo cusub oo dalka wax ka beddela.",
      ],
      en: [
        "A true gamer's brain is wired for fast tactical choices and never quitting on a tough boss level. That exact grit makes debugging code and Software Engineering feel natural to you!",
        "Even casual gaming shows you enjoy solving patterns and challenges. Starting with Python or Web Development turns that same curiosity into building real apps of your own.",
        "Straight to building mode! Students who dive directly into Code and AI skip being mere users and become the architects creating apps, automation, and startups.",
      ],
      ar: [
        "عقل اللاعب الحقيقي متدرّب على سرعة القرار والتخطيط وعدم الاستسلام أمام المراحل الصعبة. هذه الروح نفسها تجعلك تتقن اكتشاف الأخطاء وهندسة البرمجيات!",
        "حتى اللعب الخفيف يكشف حبك لحل الألغاز والتحديات. وعندما تبدأ بلغة Python أو تطوير الويب، سيتحول هذا الشغف إلى تطبيقات حقيقية من صنعك.",
        "دخول مباشر إلى عالم البناء الحقيقي! من يتجه مباشرة إلى البرمجة والذكاء الاصطناعي لا يكتفي باستخدام التقنية بل يصنع التطبيقات والحلول الذكية.",
      ],
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
    quickOptions: {
      so: ["2 (Xisaab sax ah)", "2.5 (Safety Factor)", "11 (Hal-abuur)"],
      en: ["2 (Pure math)", "2.5 (Safety Factor)", "11 (Creative)"],
      ar: ["2 (رياضيات)", "2.5 (معامل أمان)", "11 (إبداع)"],
    },
    optionInsights: {
      so: [
        "Run weeye, aasaaska xisaabta adag waa lama huraan! Injineerku wuxuu marka hore hubiyaa in 1 + 1 ay si sax ah u tahay 2 ka hor inta uusan naqshadayn mishiin ama dhisme hal millimetir khalad lahayn.",
        "Sax! Waxaad isla markiiba fahamtay sirta Injineernimada: 'Factor of Safety'. Buundadu uma dhisna culayska maanta oo keliya, ee waxaa loogu daraa kayd badbaado oo ka ilaaliya culays lama filaan ah.",
        "Maskax hal-abuur leh! Injineerrada waaweyn mararka qaar xeerarka caadiga ah way ka gudbaan si ay u curiyaan fikrad cusub—sida tamarta qorraxda ama naqshad dhisme oo aan hore loo arag.",
      ],
      en: [
        "Spot on—rock-solid math precision comes first! Every engineer verifies exact numbers down to the millimeter before turning calculations into a machine or structure.",
        "Bullseye! You immediately nailed the core engineering rule: Factor of Safety. A bridge is never built for just today's weight; it includes extra margin for the unexpected.",
        "Inventor mindset! Great engineers know the rules—and also see 11 when combining two ideas side by side to invent cleaner energy, smarter systems, and bold designs.",
      ],
      ar: [
        "أحسنت! الدقة الحسابية هي الأساس الأول؛ فالمهندس يتأكد من صحة الأرقام حتى أصغر مليمتر قبل تحويل الحسابات إلى بناء أو آلة.",
        "إجابة هندسية ذكية! «معامل الأمان» هو سر المهندس؛ فالجسر لا يُصمم لتحمل الوزن العادي فقط بل يُضاف إليه هامش حماية لأي ظرف مفاجئ.",
        "عقلية مبتكرة! المهندس المبدع يرى ما وراء الأرقام التقليدية ليجمع الأفكار بطرق جديدة ويبتكر تصاميم وحلولاً تقنية غير مسبوقة.",
      ],
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
    quickOptions: {
      so: ["Haa, diyaar ayaan ahay", "Fartaydu way qurux badan tahay", "Waan isku dayayaa"],
      en: ["Yes, I'm ready", "My handwriting is neat", "I'll do my best"],
      ar: ["نعم، مستعد تماماً", "خطي جميل جداً", "سأبذل جهدي"],
    },
    optionInsights: {
      so: [
        "Geesinnimadaas ayaa laga rabaa kulliyadda Caafimaadka! Marka aad leedahay go'aan adag oo 6 sano ah, habeen kasta oo aad wax akhriso wuxuu berri badbaadinayaa nolol qof bini'aadam ah.",
        "Haddaba waxaad jebisay sheekadii caanka ahayd ee dhakhaatiirta! Far-qor cad oo la fahmo wuxuu bukaanka siiyaa kalsooni wuxuuna yareeyaa khaladaadka warqadda daawada.",
        "Run sheegga iyo is-hoosaysiinta ayaa dhakhtarka ka dhiga mid barasho joogto ah ku jira. Xitaa dhakhaatiirta khibradda leh maalin walba cilmi cusub ayay bartaan—tallaabo tallaabo ayaad ku gaari doontaa!",
      ],
      en: [
        "That bold commitment is what Medicine demands! With a 6-year mindset locked in, every late night of anatomy and clinical study turns into a life saved tomorrow.",
        "Then you're already breaking the biggest doctor stereotype! Clear, readable prescriptions protect patients and earn instant trust from nurses and pharmacists alike.",
        "Honesty and steady effort beat overconfidence in medical school. Medicine is a marathon of daily growth, and staying humble keeps you sharp for every patient.",
      ],
      ar: [
        "هذه العزيمة القوية هي ما تحتاجه كلية الطب! عندما تستعد لست سنوات من الجد، فإن كل ساعة دراسة اليوم قد تنقذ حياة إنسان غداً.",
        "رائع، إذن ستكسر أشهر قاعدة طبية! الخط الواضح والمرتب يحمي المرضى من أخطاء الوصفات ويزيد ثقتهم بك.",
        "الصدق والمثابرة أهم من الثقة المفرطة؛ فالطب رحلة تعلم مستمرة كل يوم، والاجتهاد التدريجي يصنع منك طبيباً متميزاً.",
      ],
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
    quickOptions: {
      so: ["Hadallo deggan", "Farsamo xanuun yar", "Labadaba"],
      en: ["Calm reassurance", "Gentle precision", "Both"],
      ar: ["كلام مطمئن", "دقة بدون ألم", "كلاهما"],
    },
    optionInsights: {
      so: [
        "Naxariistaada hadalku waa daawada koowaad! Bukaanka qaba cabsi wuxuu u baahan yahay dhakhtar si deggan ugu sharraxa waxa dhacaya ka hor inta uusan qalabka taaban.",
        "Gacan deggan oo farsamo leh waa sirta dhakhtarka ilkaha ee loogu jecel yahay. Hal millimitir oo taxaddar ah wuxuu xanuunka u beddelaa raaxo iyo natiijo qurux badan.",
        "Isku-darka ugu sarreeya! Markaad isu keento hadal qalbiga dejiya iyo gacan xirfad sare leh, bukaanku kursiga wuxuu uga soo kacaa isagoo dhoolla-caddaynaya welibana saaxiibbadiis kuu soo dira.",
      ],
      en: [
        "Calm communication is half the cure! Explaining each step gently lowers a patient's stress before you even pick up an instrument.",
        "Steady hands and painless technique are what make patients rave about their dentist. Precision down to a millimeter turns fear into confidence.",
        "The gold standard of Dentistry! Combining warm reassurance with gentle clinical skill makes nervous patients walk out smiling—and referring their whole family.",
      ],
      ar: [
        "الكلام الهادئ والمطمئن هو نصف العلاج! شرح الخطوات بلطف يبدّد خوف المريض قبل أن تبدأ العمل أصلاً.",
        "اليد الخفيفة والدقة العالية هما سر طبيب الأسنان المحبوب؛ فالعناية بكل مليمتر تحوّل القلق إلى راحة وثقة.",
        "هذا هو المزيج الذهبي لطبيب الأسنان الناجح: طمأنة إنسانية مع مهارة دقيقة تجعل المريض يغادر العيادة بابتسامة واثقة.",
      ],
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
    quickOptions: {
      so: ["Haa, xusuustaydu waa adag tahay", "Fahamka ayaa ka muhiimsan", "Waan baranayaa"],
      en: ["Yes, sharp memory", "Understanding beats cramming", "I'll master it"],
      ar: ["نعم، ذاكرتي قوية", "الفهم أهم من الحفظ", "سأتعلمها بالتدريج"],
    },
    optionInsights: {
      so: [
        "Xusuus xooggan waa hanti weyn markaad baranayso qiyaasta daawooyinka (dosage) iyo is-diidka daawooyinka. Waxaad noqon doontaa gaashaanka ugu dambeeya ee badbaadiya bukaanka!",
        "Tani waa sirta farmashiistaha sare! Marka aad fahamto kooxaha kiimikada (sida -cillin ama -pril), hal xeer ayaa kuu furaya tobannaan daawo oo isku mar ah.",
        "Halkaas ayaad ka guulaysanaysaa: farmashiistuhu ma wada xifdiyo maalin qura, balse ku-celcelinta shaybaarka iyo la-tashiga bukaanka ayaa magacyada ka dhiga sida luqaddaada koowaad.",
      ],
      en: [
        "A sharp memory is a massive edge in Pharmacy—especially when catching dangerous drug interactions and exact dosages before they reach a patient.",
        "True pro thinking! Once you understand chemical families and suffixes (like -cillin or -statin), hundreds of scary names suddenly follow clean logical patterns.",
        "Growth mindset wins every time! Nobody memorizes the whole formulary on day one—hands-on lab work and patient cases turn complex names into second nature.",
      ],
      ar: [
        "الذاكرة القوية ميزة عظيمة في الصيدلة، خصوصاً عند مراجعة الجرعات واكتشاف التفاعلات الدوائية قبل وصول الدواء للمريض.",
        "تفكير صيدلي محترف! عندما تفهم المجموعات الكيميائية ونهايات الأسماء العلمية، ستتحول مئات الأسماء المعقدة إلى قواعد منطقية سهلة.",
        "الاستمرار والتدرج يصنعان الإتقان؛ فالتطبيق العملي والممارسة اليومية يحولان أسماء الأدوية الصعبة إلى لغة مألوفة وسهلة.",
      ],
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
    quickOptions: {
      so: ["Baadhista isha cudurka", "Wacyigelin degdeg ah", "Labadaba hal mar"],
      en: ["Trace the source", "Launch awareness", "Both at once"],
      ar: ["تتبع مصدر العدوى", "توعية سريعة", "كلاهما معاً"],
    },
    optionInsights: {
      so: [
        "Fikirka baadhaha cudurrada (Epidemiologist)! Helitaanka halka uu ka soo billowday cudurku waa furaha lagu xiro silsiladda faafitaanka ka hor inta uusan magaalada wada gaarin.",
        "Xiriirinta bulshada ayaa ka badbaadisa kumannaan! Fariin cad oo degdeg ah oo ku saabsan nadaafadda iyo ka hortagga waxay joojisaa argagaxa waxayna badbaadisaa qoysas badan.",
        "Hoggaamiye dhab ah oo Caafimaadka Bulshada! Adigoo koox u diraya baadhista isha cudurka, kooxda kalena bulshada wacyigelinayso, waxaad hal mar xakamaynaysaa dillaaca cudurka.",
      ],
      en: [
        "Pure Epidemiologist instinct! Pinpointing patient zero and the transmission link stops an outbreak at the root before it overwhelms clinics.",
        "Communication saves lives at scale! Fast, clear public guidance on prevention breaks panic and slows down community spread within hours.",
        "Peak Public Health leadership! Running source tracing and rapid community outreach in parallel protects thousands of families simultaneously.",
      ],
      ar: [
        "تفكير خبير أوبئة حقيقي! الوصول إلى مصدر العدوى الأول يقطع سلسلة الانتشار قبل أن يصل المرض إلى بقية الأحياء.",
        "التوعية السريعة تحمي آلاف الأسر! الرسالة الواضحة والموثوقة تمنع الذعر وتعلّم الناس طرق الوقاية الفورية.",
        "قيادة صحية متكاملة! الجمع بين تتبع المصدر وتوعية المجتمع في وقت واحد هو الأسلوب الأنجح للسيطرة على الأوبئة.",
      ],
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
    quickOptions: {
      so: ["Eegidda dhaqankiisa", "Baadhitaan shaybaar", "Labadaba"],
      en: ["Observe behavior", "Lab diagnostics", "Both together"],
      ar: ["ملاحظة سلوكه", "فحص مخبري", "كلاهما معاً"],
    },
    optionInsights: {
      so: [
        "Indho fiiqan ayaad leedahay! Dhakhtarka xoolaha ee fiican wuxuu socodka, cunitaanka, iyo neefsiga neefka ka akhriyaa calaamado uusan qof caadi ah arki karin.",
        "Saynis iyo caddeyn! Shaybaarku wuxuu si degdeg ah u xaqiijiyaa cudurka si daawada saxda ah loogu badbaadiyo xoolaha—taas oo muhiim u ah dhaqaalaha Soomaaliya.",
        "Xeeladda baadhaha dhabta ah! Marka la isku daro il-qabashada dhaqanka iyo baadhitaanka shaybaarka, xanuunka waxaa la helaa goor hore iyadoo kharash iyo khatarba yar tahay.",
      ],
      en: [
        "Sharp clinical eye! Skilled vets read posture, appetite, and subtle breathing changes like an open book—even without a single word spoken.",
        "Evidence-driven science! Lab diagnostics lock in the exact pathogen fast, protecting herds and safeguarding Somalia's vital livestock economy.",
        "True medical detective work! Pairing sharp physical observation with rapid lab testing catches disease early before it spreads through a herd.",
      ],
      ar: [
        "ملاحظة دقيقة وذكية! الطبيب البيطري الماهر يقرأ حركة الحيوان وشهيته وتنفسه كأنه كتاب مفتوح دون حاجة للكلام.",
        "اعتماد علمي دقيق! الفحص المخبري يحدد سبب المرض بدقة وسرعة، مما يحمي الثروة الحيوانية والاقتصاد الصومالي.",
        "منهج المحقق الطبي المتكامل! الجمع بين الملاحظة الميدانية والتحاليل المخبرية يكشف المرض مبكراً ويحمي القطيع بأكمله.",
      ],
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
    quickOptions: {
      so: ["Mar walba waan baadhaa", "Tijaabo ayaan jecelahay", "Xogta ayaan hubiyaa"],
      en: ["Always investigate", "I love experiments", "I check the data"],
      ar: ["أبحث دائماً", "أحب التجارب", "أتحقق من البيانات"],
    },
    optionInsights: {
      so: [
        "Su'aasha 'Sidee?' waa bilowga ogaansho kasta oo cusub! Ardayda aan iska dhaafin waxyaabaha yaabka leh waa kuwa berri hela daawooyin cusub iyo tamar nadiif ah.",
        "Shaybaarku waa garoonkaaga! Inaad gacantaada ku tijaabiso aragtiyaha ayaa sayniska ka dhigta xiiso nool halkii uu buug qallalan ka ahaan lahaa.",
        "Maskaxda Data-driven-ka! Adduunka casriga ah ee AI iyo cilmi-baarista wuxuu ku dhisan yahay dadka cabbira caddeynta ee aan hadal iska dhihin.",
      ],
      en: [
        "Refusing to walk past 'Why?' is how every major scientific discovery begins—from clean energy to next-generation medicine.",
        "The lab is your playground! Testing hypotheses with your own hands turns textbook formulas into living breakthroughs.",
        "A true data-first mind! Modern research, climate modeling, and AI all depend on scientists who measure the evidence instead of guessing.",
      ],
      ar: [
        "رفض تجاهل سؤال «لماذا؟» هو بداية كل اكتشاف علمي عظيم، من الطاقة النظيفة إلى العلاجات الحديثة.",
        "المختبر هو عالمك المفضل! اختبار النظريات عملياً بيديك يحوّل القوانين النظرية إلى اكتشافات حقيقية.",
        "عقلية تحليلية تعتمد على البيانات! الأبحاث الحديثة والذكاء الاصطناعي تقوم على من يتحقق من الأرقام والأدلة بدقة.",
      ],
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
    quickOptions: {
      so: ["$200 ayaan ka dhigayaa", "Qayb baan maalgashanayaa", "Qorshe ayaan dejinayaa"],
      en: ["Turn it into $200", "Invest half", "Build a budget first"],
      ar: ["أحولها إلى 200 دولار", "أستثمر نصفها", "أضع ميزانية أولاً"],
    },
    optionInsights: {
      so: [
        "Maskax ganacsato dhab ah! Waxaad eegaysaa wareegga lacagta iyo baahida suuqa si $100 ay u dhasho faa'iido—taasina waa aasaaska ganacsiga guulaysta.",
        "Isku-dheellitir caqli leh! Qayb maalgashi ah iyo qayb badbaado ah waa xeerka ay adeegsadaan maamulayaasha maaliyadda (Portfolio Managers) si ay khatarta u yareeyaan.",
        "Disibiliinka maaliyadeed (Budgeting) waa halka ay shirkadaha waaweyn ka bilaabmaan! Qofka aan xisaabin kharashka ma maamuli karo faa'iidada.",
      ],
      en: [
        "Pure entrepreneurial drive! Spotting market demand and multiplying capital is the core engine of business growth and startups.",
        "Smart risk-balancing! Splitting funds between growth investment and cash reserve is exactly how top finance managers build lasting wealth.",
        "Master of financial discipline! Every giant corporation starts with a clear budget—if you track every dollar, you control the outcome.",
      ],
      ar: [
        "روح ريادية حقيقية! التفكير في مضاعفة رأس المال وتلبية حاجة السوق هو محرك المشاريع والشركات الناجحة.",
        "توازن مالي ذكي! توزيع المال بين الاستثمار والاحتياط هو القاعدة التي يعتمدها مديرو الاستثمار لتقليل المخاطر.",
        "الانضباط المالي هو أساس كل مؤسسة ناجحة؛ فمن يضبط الميزانية قبل الصرف يتحكم دائماً في النتائج.",
      ],
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
    quickOptions: {
      so: ["Haa, mar walba", "Kaliya marka aan xaq leeyahay", "Caddeyn ayaan raadiyaa"],
      en: ["Yes, every time", "Only when I'm right", "I bring receipts"],
      ar: ["نعم دائماً", "فقط عندما أكون على حق", "أعتمد على الدليل"],
    },
    optionInsights: {
      so: [
        "Awoodda hadalka iyo qancinta waa hubka qareenka! Kulliyadda Sharciga waxay qaabaysaa xirfaddaas si aad u difaacdo heshiisyada iyo xuquuqda dadka.",
        "Taasi waa mabaadi'da cadaaladda! Qareenka iyo garsooraha sharafka leh kuma doodo guul-raadis madhan, balse wuxuu difaacaa xaqa iyo runta.",
        "Xirfadle maxkamadeed! Maxkamaduhu kuma go'aan qaataan hadal badan ee waxay eegaan caddeynta iyo qodobka sharciga—aad baad ugu diyaar tahay.",
      ],
      en: [
        "Natural courtroom persuasion! Law school sharpens that instinct into structured legal arguments that win cases and protect contracts.",
        "True sense of justice! The most respected judges and lawyers fight for principle and fairness—never just for the sake of arguing.",
        "Evidence wins verdicts! Bringing verified facts and clean documentation sets elite legal minds apart from loud talkers.",
      ],
      ar: [
        "قدرة طبيعية على الإقناع! دراسة القانون تصقل هذه المهارة إلى حجج منظمة تحمي الحقوق والعقود.",
        "هذا هو جوهر العدالة! القاضي والمحامي النزيه يدافعان عن الحق والمبدأ لا لمجرد الجدل.",
        "الدليل يحسم القضايا! الاعتماد على الوثائق والحقائق الدقيقة هو ما يميز القانوني المحترف.",
      ],
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
    quickOptions: {
      so: ["Haa, waan heshiisiiyaa", "Labada dhinac baan dhegaystaa", "Xal fog baan raadiyaa"],
      en: ["Yes, I mediate", "I listen to both sides", "I look for long-term solutions"],
      ar: ["نعم، أصلح بينهما", "أستمع للطرفين", "أبحث عن حل جذري"],
    },
    optionInsights: {
      so: [
        "Dhexdhexaadintaadu waa xirfad diblomaasiyadeed oo heer caalami ah! Waddamada iyo hay'aduhuba waxay u baahan yihiin qof dadka isku keeni kara.",
        "Dhegaysiga dhabta ah waa waxa hoggaamiyeyaasha waaweyn ka sooca kuwa kale. Marka dhinac walba dareemo in la fahmay, heshiisku wuu fududaadaa.",
        "Aragti fog (Strategic Thinking)! Siyaasadda wanaagsan ma xalliso muranka maanta oo keliya, ee waxay dejisaa nidaam aan khilaafku mar dambe ku soo noqon.",
      ],
      en: [
        "Born mediator! Turning conflict into cooperation is the heart of diplomacy, public policy, and international relations.",
        "Active listening is a rare leadership superpower. When both sides feel genuinely heard, agreement follows naturally.",
        "Strategic statesman mindset! Real public leadership prevents tomorrow's crisis instead of just patching up today's argument.",
      ],
      ar: [
        "موهبة دبلوماسية واضحة! تحويل الخلاف إلى توافق هو جوهر العلاقات الدولية والسياسة العامة.",
        "الإنصات الحقيقي قوة قيادية نادرة؛ فعندما يشعر كل طرف بأنه مسموع يصبح الاتفاق أسهل.",
        "تفكير استراتيجي بعيد المدى! القيادة الناجحة تعالج جذور المشكلة وتبني حلولاً تدوم للمستقبل.",
      ],
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
    quickOptions: {
      so: ["Haa, aad bay iigu fududdahay", "Waan jecelahay caawinta", "Tusaalooyin baan adeegsadaa"],
      en: ["Yes, comes naturally", "I love helping others", "I use simple examples"],
      ar: ["نعم، بسهولة", "أحب مساعدة الآخرين", "أستخدم أمثلة بسيطة"],
    },
    optionInsights: {
      so: [
        "Haddii aad fikrad adag si dhaqso ah u fududayn karto, macallinimo dabiici ah ayaad leedahay! Dad badan waxay yaqaannaan cilmiga, balse yar baa si cad u gudbin kara.",
        "Qalbiga baraha dhabta ah! Farxadda aad ka hesho marka saaxiibkaa yiraahdo 'Hadda ayaan fahmay!' waa waxa kaa dhiga hormuudka bulshada.",
        "Farsamada baraha xirfadlaha ah! Tusaalooyinka nolol-maalmeedka ayaa maskaxda ardayga u fura casharro buugaag dhan ku adkaa.",
      ],
      en: [
        "Natural clarity is a rare gift! Knowing a topic is common, but explaining it simply in minutes is the hallmark of a master educator.",
        "Pure heart of an educator! Seeing a classmate's eyes light up with 'Oh, now I get it!' is fuel that drives lifelong impact.",
        "Master teaching technique! Connecting tough theory to everyday real-life examples unlocks understanding faster than any lecture.",
      ],
      ar: [
        "تبسيط الأفكار الصعبة موهبة نادرة! كثيرون يملكون المعلومة، لكن القليل يجيد إيصالها بوضوح في دقائق.",
        "روح المعلم الملهم! لحظة الفهم التي تراها في عيون زملائك هي أعظم دافع لصناعة جيل متفوق.",
        "أسلوب تدريسي احترافي! ربط النظريات المعقدة بأمثلة من الحياة اليومية يرسخ الفهم بسرعة مذهلة.",
      ],
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
    quickOptions: {
      so: ["Haa, sheeko-xariir baan ahay", "Muuqaal & Design baan jecelahay", "Qoraal baan ku fiicanahay"],
      en: ["Yes, I'm a storyteller", "I love video & design", "Writing is my strength"],
      ar: ["نعم، أجيد سرد القصص", "أحب الفيديو والتصميم", "الكتابة قوتي"],
    },
    optionInsights: {
      so: [
        "Sheeko-tebintu waa awoodda ugu weyn ee warbaahinta casriga ah! Qofka yaqaanna sida dareenka dadka loo qabto wuxuu hoggaamiyaa saxaafadda, filimada, iyo xayeysiinta.",
        "Isha farshaxanka dijitaalka! Video editing, Motion Design, iyo UI/Visual storytelling maanta waxay kamid yihiin xirfadaha loogu baahida badan yahay shirkadaha caalamka.",
        "Qoraaga awoodda leh! Sheeko kasta, filim kasta, iyo olole kasta wuxuu ka bilowdaa qalin ama teeb sax ah (Scriptwriting & Copywriting) oo qalbiga taabta.",
      ],
      en: [
        "Storytelling is the #1 currency in modern media! Knowing how to hold attention opens doors in journalism, filmmaking, and brand leadership.",
        "Visual creator eye! Video production, motion graphics, and digital design are among the fastest-growing creative careers globally.",
        "The power of the pen! Every viral video, documentary, and brand campaign begins with sharp scriptwriting and memorable words.",
      ],
      ar: [
        "فن السرد هو القوة الأهم في الإعلام الحديث! من يجيد شدّ الانتباه يصنع التأثير في الصحافة وصناعة المحتوى والإعلان.",
        "عين المصمم المبدع! إنتاج الفيديو والموشن جرافيك والتصميم البصري من أكثر المهارات المطلوبة عالمياً اليوم.",
        "قوة الكلمة والكتابة! كل فيلم ناجح وحملة مؤثرة تبدأ بنص متقن وكتابة إبداعية تلامس القلوب.",
      ],
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
    quickOptions: {
      so: ["Run weeye", "Mustaqbalku waa AgriTech", "Deegaanka ayaan jecelahay"],
      en: ["100% true", "AgriTech is the future", "I care about nature"],
      ar: ["صحيح تماماً", "المستقبل للزراعة الذكية", "أهتم بالبيئة"],
    },
    optionInsights: {
      so: [
        "Xaqiiqo lama taabtaan ah! Waddan kasta oo isku filnaansho cunto gaara wuxuu haystaa xorriyad iyo dhaqaale adag—Soomaaliyana wabiyadeeda iyo dhulkeeda ayaa fursaddaas leh.",
        "Fikir casri ah! AgriTech (waraabka dhibicda, sensors-ka carrada, iyo beeraha smart-ka ah) waxay wax-soo-saarka labanlaabaan iyadoo biyo yar la isticmaalayo.",
        "Ilaaliyaha nolosha! Deegaanka nadiifka ah, dhirta, iyo maamulka biyaha ayaa hubiya in jiilalka soo socda helaan dhul barwaaqo ah.",
      ],
      en: [
        "Undeniable truth! Nations that secure their own food supply hold real independence—and Somalia's fertile rivers and farmland have huge untapped potential.",
        "Forward-thinking vision! AgriTech—drip irrigation, soil sensors, and climate-smart farming—doubles yields while saving precious water.",
        "Guardian of ecosystems! Protecting soil health, forests, and sustainable water systems keeps communities thriving for generations.",
      ],
      ar: [
        "حقيقة لا تقبل الجدل! الأمن الغذائي هو أساس الاستقلال الاقتصادي، وأنهار الصومال وأراضيه الخصبة تفتح فرصاً هائلة.",
        "نظرة مستقبلية ذكية! الزراعة الذكية بالري الحديث وحساسات التربة تضاعف الإنتاج بأقل استهلاك للمياه.",
        "حماية البيئة استثمار للحياة! العناية بالتربة والغابات والموارد المائية تضمن مستقبلاً مستداماً للأجيال القادمة.",
      ],
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
