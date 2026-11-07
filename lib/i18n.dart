import 'dart:ui' show PlatformDispatcher;
import 'package:flutter/widgets.dart';

/// Luqadaha: 'so' (Soomaali, qoraalka asalka ah), 'en' (English), 'ar' (Carabi, midigta ka bilaabata).
/// Si loo daro luqad cusub: ku dar [qoraal] meel kasta oo hoos ku qoran `ui` (liiska) iyo `data.dart` (map-ka luqadda).
const Map<String, String> langNames = {'so': 'Soomaali', 'en': 'English', 'ar': 'العربية'};

String _initial() {
  final c = PlatformDispatcher.instance.locale.languageCode;
  return c == 'ar' ? 'ar' : (c == 'en' ? 'en' : 'so');
}

final ValueNotifier<String> langNotifier = ValueNotifier(_initial());
String get currentLang => langNotifier.value;

/// Qoraalka UI: furaha = Soomaali, qiimaha = [English, Carabi]. Haddii furaha la waayo, Soomaali ayaa soo baxaya.
String tr(String k) {
  final l = currentLang;
  if (l == 'so') return k;
  final v = ui[k];
  return v == null ? k : v[l == 'en' ? 0 : 1];
}

String trf(String k, Map<String, Object> a) => tr(k).replaceAllMapped(RegExp(r'\{(\w+)\}'), (m) => '${a[m[1]]}');

/// Qoraalka xogta ({so,en,ar}).
String tx(dynamic v) {
  final m = v as Map;
  return (m[currentLang] ?? m['en'] ?? m['so']) as String;
}

List<String> txl(dynamic v) {
  final m = v as Map;
  return List<String>.from((m[currentLang] ?? m['en'] ?? m['so']) as List);
}

class Tr extends StatelessWidget {
  const Tr(this.k, {super.key, this.style, this.textAlign, this.maxLines, this.overflow});
  final String k;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;

  @override
  Widget build(BuildContext context) => Text(tr(k), style: style, textAlign: textAlign, maxLines: maxLines, overflow: overflow);
}

const Map<String, List<String>> ui = {
 "Hagaha Kulliyadda": [
  "Faculty Guide",
  "دليل الكلية"
 ],
 "Iftiin": [
  "Light",
  "فاتح"
 ],
 "Mugdi": [
  "Dark",
  "داكن"
 ],
 "Farsamo iyo gacmeed": [
  "Technical & hands-on",
  "فنّي وعملي"
 ],
 "Baadhis iyo sayniska": [
  "Investigation & science",
  "بحث وعلوم"
 ],
 "Hal-abuur iyo naqshad": [
  "Creativity & design",
  "إبداع وتصميم"
 ],
 "Daryeel iyo barasho": [
  "Caring & teaching",
  "رعاية وتعليم"
 ],
 "Hoggaamin iyo ganacsi": [
  "Leadership & business",
  "قيادة وأعمال"
 ],
 "Nidaam iyo xisaab": [
  "Order & numbers",
  "تنظيم وحساب"
 ],
 "Su’aalo gaagaaban ayaa kaa caawinaya inaad garatid kulliyadda kuu ugu habboon, adigoo ku saleynaya waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah.": [
  "Short questions help you find the faculty that suits you best, based on what you enjoy, what you have studied, and what matters to you.",
  "أسئلة قصيرة تساعدك على معرفة الكلية الأنسب لك، بناءً على ما تحبه وما درسته وما يهمّك."
 ],
 "{n} su’aalood": [
  "{n} questions",
  "{n} سؤالاً"
 ],
 "Ku dhawaad 8 daqiiqo": [
  "About 8 minutes",
  "حوالي 8 دقائق"
 ],
 "Saddex kulliyadood": [
  "Three faculties",
  "ثلاث كليات"
 ],
 "Kulliyadaha": [
  "Faculties",
  "الكليات"
 ],
 "Magacaaga (ikhtiyaari) waxaa loo isticmaalaa hambalyada oo kaliya. Waxay ku hadhaysaa qalabkaaga, waxbana lama diro.": [
  "Your name (optional) is only used for your congratulations. It stays on your device and nothing is sent.",
  "اسمك (اختياري) يُستخدم للتهنئة فقط. يبقى على جهازك ولا يُرسل أي شيء."
 ],
 "Magacaaga (ikhtiyaari)": [
  "Your name (optional)",
  "اسمك (اختياري)"
 ],
 "Ku qor magacaaga si hambalyadaada ugu soo baxdo.": [
  "Enter your name to see it in your congratulations.",
  "اكتب اسمك ليظهر في رسالة التهنئة."
 ],
 "Soo dhawoow,": [
  "Welcome,",
  "أهلاً،"
 ],
 "Bilow": [
  "Start",
  "ابدأ"
 ],
 "Ma hubo, ka bood": [
  "Not sure, skip",
  "لست متأكداً، تخطَّ"
 ],
 "Su’aashii hore": [
  "Previous question",
  "السؤال السابق"
 ],
 "← Su’aashii hore": [
  "← Previous question",
  "السؤال السابق →"
 ],
 "Su’aal {a} / {b}": [
  "Question {a} / {b}",
  "السؤال {a} / {b}"
 ],
 "Natiijadaada": [
  "Your result",
  "نتيجتك"
 ],
 "Saddexda kulliyadood ee kuu ugu habboon": [
  "Your three best-matching faculties",
  "الكليات الثلاث الأنسب لك"
 ],
 "Waxaad ka jawaabtay {a} / {b} su’aalood. Natiijadu waxay noqotaa mid kalsooni yar haddii su’aalo badan la boodo. Dib u bilow oo ka jawaab ugu yaraan {c} su’aalood.": [
  "You answered {a} / {b} questions. The result is less reliable when many questions are skipped. Start again and answer at least {c} questions.",
  "أجبت عن {a} / {b} سؤالاً. تقلّ موثوقية النتيجة عند تخطي أسئلة كثيرة. أعد المحاولة وأجب عن {c} سؤالاً على الأقل."
 ],
 "Doorbidkaagu ma cadda": [
  "Your preference is not clear",
  "ميولك غير واضحة"
 ],
 "Saddexda kulliyadood waa isku dhow yihiin. Jawaabahaagu ma muujinayaan doorbid cad, sidaas awgeed isbarbar dhig dhammaan saddexda, oo la hadal qof ku aqaan.": [
  "The three faculties are very close. Your answers do not show a clear preference, so compare all three and talk to someone who knows you.",
  "الكليات الثلاث متقاربة. لا تُظهر إجاباتك ميلاً واضحاً، لذا قارن بين الثلاث وتحدّث مع شخص يعرفك."
 ],
 "Astaanta xiisahaaga": [
  "Your interest profile",
  "ملف اهتماماتك"
 ],
 "Isbarbardhig kulliyadaha": [
  "Compare faculties",
  "قارن بين الكليات"
 ],
 "Natiijadayda, Hagaha Kulliyadda:": [
  "My result, Faculty Guide:",
  "نتيجتي، دليل الكلية:"
 ],
 "Waa la koobiyeeyay": [
  "Copied",
  "تم النسخ"
 ],
 "Nuqul ka samee natiijada": [
  "Copy my result",
  "انسخ النتيجة"
 ],
 "Dib u bilow": [
  "Start again",
  "ابدأ من جديد"
 ],
 "Qiimeyntani waxay ku salaysan tahay qaab Holland RIASEC oo la fududeeyay. Ma aha imtixaan rasmi ah. U isticmaal hage, ma aha go’aan kama dambeys ah.": [
  "This assessment is based on a simplified Holland RIASEC model. It is not an official exam. Use it as a guide, not a final decision.",
  "يستند هذا التقييم إلى نموذج هولاند (RIASEC) المبسّط. وهو ليس امتحاناً رسمياً. استخدمه كدليل وليس كقرار نهائي."
 ],
 "Hambalyo!": [
  "Congratulations!",
  "مبروك!"
 ],
 "Kulliyadda kuu ugu habboon waa": [
  "Your best-matching faculty is",
  "الكلية الأنسب لك هي"
 ],
 "ku habboonaan": [
  "match",
  "مطابقة"
 ],
 "Eeg faahfaahinta": [
  "See the details",
  "عرض التفاصيل"
 ],
 "Kuu ugu habboon": [
  "Best match",
  "الأنسب لك"
 ],
 "Xiisaha": [
  "Interest",
  "الاهتمام"
 ],
 "Kartida": [
  "Ability",
  "القدرة"
 ],
 "Qiimaha": [
  "Values",
  "القيم"
 ],
 "Sababta natiijada": [
  "Why this result",
  "سبب النتيجة"
 ],
 "Jawaabaha ugu saameeyay:": [
  "Answers that influenced it most:",
  "الإجابات الأكثر تأثيراً:"
 ],
 "Waaxaha": [
  "Departments",
  "الأقسام"
 ],
 "Shaqooyinka laga helo": [
  "Career options",
  "فرص العمل"
 ],
 "Talooyin": [
  "Tips",
  "نصائح"
 ],
 "La hadal arday hadda ku jira kulliyaddan, ama macallinkaaga.": [
  "Talk to a current student of this faculty, or to your teacher.",
  "تحدّث مع طالب حالي في هذه الكلية، أو مع معلمك."
 ],
 "La xiriir xafiiska diiwaangelinta si aad u hesho shuruudaha gelitaanka, khidmadda iyo waqtiyada diiwaangelinta.": [
  "Contact the admissions office to get the entry requirements, fees, and registration dates.",
  "تواصل مع مكتب القبول لمعرفة شروط القبول والرسوم ومواعيد التسجيل."
 ],
 "Isbarbar dhig labada kulliyadood ee ugu sarreeya: waxbarashada, shaqada iyo kharashka.": [
  "Compare your top two faculties: the study, the careers, and the cost.",
  "قارن بين أعلى كليتين لديك: الدراسة والعمل والتكلفة."
 ],
 "U hay hal usbuuc ugu yaraan ka hor intaadan go’aan gaarin, oo la tasho qoyskaaga.": [
  "Give yourself at least a week before deciding, and consult your family.",
  "امنح نفسك أسبوعاً على الأقل قبل أن تقرر، واستشر عائلتك."
 ],
 "Tallaabooyinka xiga": [
  "Next steps",
  "الخطوات التالية"
 ],
 "Isbarbardhig": [
  "Compare",
  "مقارنة"
 ],
 "Ku habboonaanta": [
  "Match",
  "نسبة المطابقة"
 ],
 "Xiisaha · Kartida · Qiimaha": [
  "Interest · Ability · Values",
  "الاهتمام · القدرة · القيم"
 ],
 "Magaca": [
  "Name",
  "الاسم"
 ],
 "Sharaxaad": [
  "Description",
  "الوصف"
 ],
 "{n} waax: {list}": [
  "{n} departments: {list}",
  "{n} أقسام: {list}"
 ],
 "Shaqooyinka": [
  "Careers",
  "الوظائف"
 ],
 "Talo": [
  "Tip",
  "نصيحة"
 ],
 "Xuquuqda oo dhan waa dhowran tahay.": [
  "All rights reserved.",
  "جميع الحقوق محفوظة."
 ],
 "Luqadda": [
  "Language",
  "اللغة"
 ],
 "Su’aalaha waxaa lagu habeeyay: {c}": [
  "Questions tailored to: {c}",
  "الأسئلة مخصصة لـ: {c}"
 ],
 "Caafimaad": [
  "Health",
  "الصحة"
 ],
 "Tignoolajiyada iyo injineerinka": [
  "Technology & engineering",
  "التقنية والهندسة"
 ],
 "Sharciga, siyaasadda iyo waxbarashada": [
  "Law, politics & education",
  "القانون والسياسة والتعليم"
 ],
 "Ganacsiga iyo dhaqaalaha": [
  "Business & economics",
  "الأعمال والاقتصاد"
 ],
 "Beeraha iyo deegaanka": [
  "Agriculture & environment",
  "الزراعة والبيئة"
 ],
 "Doorbidkaaga ma garan karno": [
  "We cannot tell your preference",
  "ميولك غير واضحة بعد"
 ],
 "← Natiijada": [
  "← Result",
  "النتيجة →"
 ]
};
