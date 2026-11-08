import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'data.dart';
import 'i18n.dart';

void main() => runApp(const GuideApp());

// ---------------------------------------------------------------- App & mawduuc
/// Mugdi (dark) waa caadi. Badhanka Iftiin/Mugdi ayaa beddela.
final ValueNotifier<bool> darkMode = ValueNotifier(true);

/// Magaca ardayga (ikhtiyaari). Waxaa loo isticmaalaa hambalyada oo kaliya; wuxuu ku hadhaa xusuusta app-ka (lama keydiyo, lama diro).
/// Waa global si uusan u lumin marka luqadda la beddelo (app-ku dib ayuu u dhismaa).
final ValueNotifier<String> userName = ValueNotifier('');

String cleanName(String s) => s.replaceAll(RegExp(r'\s+'), ' ').trim();

/// Xarfo-xarfo kaliya haddii qoraalku yahay Latin/Cyrillic/Greek (< U+0590). Carabi/Cibraani (xarfaha isku xiran) lama kala jabiyo, si aan u go'in.
bool _canSplit(String s) => s.runes.every((r) => r < 0x0590);

/// Xarfaha magaca; calaamadaha isku-dhafan (diacritics) waxay la socdaan xarafka hore.
List<String> _letters(String s) {
  final out = <String>[];
  for (final r in s.runes) {
    final ch = String.fromCharCode(r);
    if (out.isNotEmpty && r >= 0x0300 && r <= 0x036F) {
      out[out.length - 1] += ch;
    } else {
      out.add(ch);
    }
  }
  return out;
}

ThemeData _theme(bool dark) => ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      colorSchemeSeed: const Color(0xFF1F3A93),
      scaffoldBackgroundColor: dark ? const Color(0xFF0E1424) : const Color(0xFFF5F7FB),
    );

class GuideApp extends StatelessWidget {
  const GuideApp({super.key});

  /// Luqadda beddelashadu waxay dib u dhisaysaa app-ka oo dhan (key), sidaa darteed waxaa lagu beddelaa bogga hore.
  @override
  Widget build(BuildContext context) => ValueListenableBuilder<String>(
        valueListenable: langNotifier,
        builder: (_, lang, __) => ValueListenableBuilder<bool>(
          valueListenable: darkMode,
          builder: (_, dark, __) => MaterialApp(
            key: ValueKey(lang),
            debugShowCheckedModeBanner: false,
            title: tr('Hagaha Kulliyadda'),
            theme: _theme(dark),
            // Shaashadaha waaweyn (web/laptop): app-ka waxaa lagu hagaajiyaa bartamaha, ballac ugu badnaan 720px.
            builder: (context, child) => Directionality(
              textDirection: lang == 'ar' ? TextDirection.rtl : TextDirection.ltr,
              child: ColoredBox(
                color: dark ? const Color(0xFF080C16) : const Color(0xFFE4E9F2),
                child: Center(child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 720), child: child!)),
              ),
            ),
            home: const WelcomeScreen(),
          ),
        ),
      );
}

class _LangPicker extends StatelessWidget {
  const _LangPicker({this.color});
  final Color? color;

  @override
  Widget build(BuildContext context) => PopupMenuButton<String>(
        tooltip: tr('Luqadda'),
        onSelected: (v) => langNotifier.value = v,
        itemBuilder: (_) => [for (final e in langNames.entries) PopupMenuItem(value: e.key, child: Text(e.value))],
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(Icons.language, color: color, size: 20),
            const SizedBox(width: 6),
            Text(langNames[currentLang]!, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
          ]),
        ),
      );
}

class _ThemeToggle extends StatelessWidget {
  const _ThemeToggle({this.color});
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return TextButton.icon(
      style: TextButton.styleFrom(foregroundColor: color),
      onPressed: () => darkMode.value = !dark,
      icon: Icon(dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
      label: Tr(dark ? 'Iftiin' : 'Mugdi'),
    );
  }
}


// ---------------------------------------------------------------- Xisaabta (adaptive)
const interestKeys = ['R', 'I', 'A', 'S', 'E', 'C'];
const deepKeys = ['surg', 'lab', 'care', 'comm', 'anim', 'code', 'build', 'elec', 'fly', 'just', 'gov', 'teach', 'media', 'acct', 'mkt', 'ops', 'proj', 'crop', 'env', 'teeth', 'diag'];
const aptitudeKeys = ['math', 'bio', 'lang', 'ict', 'soc'];
const conditionKeys = ['blood', 'long', 'help', 'money', 'stable', 'field'];
const Map<String, String> interestNames = {
  'R': 'Farsamo iyo gacmeed',
  'I': 'Baadhis iyo sayniska',
  'A': 'Hal-abuur iyo naqshad',
  'S': 'Daryeel iyo barasho',
  'E': 'Hoggaamin iyo ganacsi',
  'C': 'Nidaam iyo xisaab',
};

/// Tirada ugu yar ee su'aalaha la jawaabay (60% qorshaha) si natiijadu kalsooni u yeelato.
int minNeeded(int planLen) => (planLen * .6).round();

class FacultyMatch {
  const FacultyMatch(this.f, this.percent, this.interest, this.aptitude, this.conditions, this.reasons, this.inPool);
  final Map<String, dynamic> f;
  final int percent; // ku habboonaanta guud 0-100 (0 haddii aysan ku jirin kooxda)
  final int interest; // xiisaha
  final int aptitude; // kartida
  final int conditions; // waxa kuu muhiim ah
  final List<String> reasons; // jawaabaha ugu saameeyay
  final bool inPool; // kulliyaddu waxay ku jirtaa kooxda la isbarbar dhigay
}

/// Qiimeynta (1-5): Likert iyo hordhac = doorashada + 1; tijaabo = sax ? 2 + heerka adag : 1; -1 = la boodey.
int ratingFor(Map<String, dynamic> it, int choice) {
  if (choice < 0) return -1;
  if (it['type'] == 'l' || it['type'] == 'sc') return choice + 1;
  return choice == (it['a'] as int) ? 2 + (it['d'] as int) : 1;
}

List<int> screeningIdx() => [for (var i = 0; i < items.length; i++) if (items[i]['type'] == 'sc') i];

/// Dhibcaha kooxaha ee su'aalaha hordhaca ah.
Map<String, int> clusterScores(List<int> r, List<int> idx) {
  final sc = {for (final c in clusterOrder) c: 0};
  for (final i in idx) {
    final v = r[i];
    if (v > 0) {
      ((items[i]['ow'] as List)[v - 1] as Map).forEach((c, x) => sc[c as String] = (sc[c] ?? 0) + (x as int));
    }
  }
  return sc;
}

List<String> _corder(Map<String, int> sc) {
  final o = [...clusterOrder];
  o.sort((a, b) {
    final d = sc[b]!.compareTo(sc[a]!);
    return d != 0 ? d : clusterOrder.indexOf(a).compareTo(clusterOrder.indexOf(b));
  });
  return o;
}

/// Kooxda (ama labada kooxood haddii ay isku dhow yihiin) ee ardayga u janjeedho.
List<String> focusClusters(List<int> r, List<int> idx) {
  final sc = clusterScores(r, idx);
  final o = _corder(sc);
  if (sc[o[0]]! <= 0) return [];
  final R = [o[0]];
  if (clusterFaculties[o[0]]!.length < 3 || (sc[o[1]]! > 0 && sc[o[0]]! - sc[o[1]]! <= 1)) R.add(o[1]);
  return R;
}

/// Qorshaha su'aalaha: 3 hordhac (+1 haddii aan la kala saari karin), kadib su'aalo gaar ah oo kooxda ku saabsan.
/// Haddii labo kooxood la isbarbar dhigayo, kaliya su'aalaha labadaba khuseeya + kuwa gaarka ah ayaa la weydiiyaa.
List<int> buildPlan(List<int> r) {
  final sc = screeningIdx();
  final f3 = sc.take(3).toList();
  final s3 = clusterScores(r, f3);
  final o = _corder(s3);
  final amb = s3[o[0]]! <= 0 || s3[o[0]]! - s3[o[1]]! <= 1;
  final idx = amb && sc.length > 3 ? [...f3, sc[3]] : f3;
  final R = focusClusters(r, idx);
  final plan = [...idx];
  for (var i = 0; i < items.length; i++) {
    final it = items[i];
    if (it['type'] == 'sc') continue;
    final c = it['c'] as List?;
    if (R.isEmpty) {
      if (it['deep'] != true) plan.add(i);
    } else if (it['deep'] == true) {
      if (c!.any((x) => R.contains(x))) plan.add(i);
    } else if (c == null || (R.length > 1 ? R.every((x) => c.contains(x)) : c.contains(R[0]))) {
      plan.add(i);
    }
  }
  return plan;
}

/// Kulliyadaha la isbarbar dhigayo (kooxda/kooxaha).
List<String> poolIds(List<int> r) {
  final R = focusClusters(r, screeningIdx());
  if (R.isEmpty) return [for (final f in faculties) f['id'] as String];
  final set = <String>[];
  for (final c in R) {
    for (final id in clusterFaculties[c]!) {
      if (!set.contains(id)) set.add(id);
    }
  }
  return set;
}

Map<String, double> _rawTraits(List<int> r) {
  final sum = <String, double>{};
  final cnt = <String, int>{};
  for (var i = 0; i < items.length; i++) {
    if (r[i] <= 0 || items[i]['type'] == 'sc') continue;
    final k = items[i]['k'] as String;
    sum[k] = (sum[k] ?? 0) + r[i];
    cnt[k] = (cnt[k] ?? 0) + 1;
  }
  return {for (final k in sum.keys) k: sum[k]! / cnt[k]!};
}

List<String> interestProfile(List<int> r) {
  final raw = _rawTraits(r);
  final ks = interestKeys.where(raw.containsKey).toList()..sort((a, b) => raw[b]!.compareTo(raw[a]!));
  return [for (final k in ks.take(3)) '${tr(interestNames[k]!)} ($k)'];
}

/// `r` waa jawaabaha ku jira qorshaha oo kaliya (kuwa kale = -1).
/// Ku habboonaan = 45% xiis (R-C + gaar) + 35% karti + 20% qiime, ka dibna 75% celcelis miisaaman + 25% isku-dhac (correlation dhexe).
/// Xiisaha waa la dhexeeyaa (ipsative) si loo yareeyo "dhammaan 5". Kulliyadaha u baahan karti sare waa la ganaaxaa haddii kartidu hooseyso.
/// Waxaa la isbarbar dhigaa kaliya kulliyadaha kooxda; kuwa kale waxay helaan 0 (inPool = false).
List<FacultyMatch> computeMatches(List<int> r) {
  final raw = _rawTraits(r);
  final pool = poolIds(r);
  double meanOf(List<String> ks, double d) {
    final v = [for (final k in ks) if (raw.containsKey(k)) raw[k]!];
    return v.isEmpty ? d : v.reduce((a, b) => a + b) / v.length;
  }

  final mean = meanOf(interestKeys, 3.0);
  final meanD = meanOf(deepKeys, 3.0);

  double u(String k) {
    final v = raw[k]!;
    final abs = (v - 1) / 4;
    if (interestKeys.contains(k)) return 0.5 * abs + 0.5 * (0.5 + (v - mean) / 4).clamp(0.0, 1.0).toDouble();
    if (deepKeys.contains(k)) return 0.5 * abs + 0.5 * (0.5 + (v - meanD) / 4).clamp(0.0, 1.0).toDouble();
    return abs;
  }

  final keys = raw.keys.toList();
  final xs = [for (final k in keys) u(k)];
  final mx = xs.isEmpty ? 0.0 : xs.reduce((a, b) => a + b) / xs.length;
  final allInterest = [...interestKeys, ...deepKeys];

  final out = <FacultyMatch>[];
  for (final f in faculties) {
    if (!pool.contains(f['id'])) {
      out.add(FacultyMatch(f, 0, 0, 0, 0, const [], false));
      continue;
    }
    final p = f['p'] as Map;
    double w(String k) => ((p[k] ?? 0) as num).toDouble();

    double? fit(List<String> ks) {
      var a = 0.0, b = 0.0;
      for (final k in ks) {
        if (w(k) <= 0 || !raw.containsKey(k)) continue;
        a += w(k) * u(k);
        b += w(k);
      }
      return b == 0 ? null : a / b;
    }

    final gi = fit(allInterest), ga = fit(aptitudeKeys), gc = fit(conditionKeys);
    final parts = [(gi, .45), (ga, .35), (gc, .20)].where((x) => x.$1 != null).toList();
    final ws = parts.fold<double>(0, (s, x) => s + x.$2);
    var t = parts.isEmpty ? 0.0 : parts.fold<double>(0, (s, x) => s + x.$1! * x.$2) / ws;

    final ys = [for (final k in keys) w(k) / 3];
    final my = ys.isEmpty ? 0.0 : ys.reduce((a, b) => a + b) / ys.length;
    var dot = 0.0, nu = 0.0, np = 0.0;
    for (var i = 0; i < xs.length; i++) {
      final a = xs[i] - mx, b = ys[i] - my;
      dot += a * b;
      nu += a * a;
      np += b * b;
    }
    final corr = (nu > 1e-9 && np > 1e-9) ? (dot / sqrt(nu * np) + 1) / 2 : 0.5;
    t = 0.75 * t + 0.25 * corr;

    if (ga != null) {
      final dem = aptitudeKeys.map(w).fold<double>(0, (m, x) => max(m, x)) / 3;
      t *= 1 - dem * max(0.0, 0.6 - ga) * 0.8;
    }
    if (w('blood') >= 2 && (raw['blood'] ?? 5) <= 2) t *= 0.7;
    if (w('long') >= 3 && (raw['long'] ?? 5) <= 2) t *= 0.85;

    final why = <MapEntry<double, String>>[];
    for (var i = 0; i < items.length; i++) {
      if (items[i]['type'] != 'l' || r[i] < 4) continue;
      final wt = w(items[i]['k'] as String);
      if (wt < 2) continue;
      why.add(MapEntry(wt * r[i], '${tx(items[i]['t'])}: ${r[i]}/5'));
    }
    why.sort((x, y) => y.key.compareTo(x.key));

    out.add(FacultyMatch(f, (t * 100).round(), ((gi ?? 0) * 100).round(), ((ga ?? 0) * 100).round(), ((gc ?? 0) * 100).round(), [for (final e in why.take(3)) e.value], true));
  }
  out.sort((x, y) {
    if (x.inPool != y.inPool) return x.inPool ? -1 : 1;
    return y.percent.compareTo(x.percent);
  });
  return out; // kulliyadaha kooxda marka hore (top 3 = take(3)), kuwa kale dabadeed
}

// ---------------------------------------------------------------- Qaybo guud
class _Heading extends StatelessWidget {
  const _Heading(this.icon, this.text);
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) => Row(children: [
        Icon(icon, size: 18, color: Theme.of(context).colorScheme.primary),
        const SizedBox(width: 8),
        Tr(text, style: Theme.of(context).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
      ]);
}

class _Footer extends StatelessWidget {
  const _Footer();

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
        child: Text(
          '© 2026 $appOwner. ${tr('Xuquuqda oo dhan waa dhowran tahay.')}',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      );
}

Widget _bar(BuildContext context, String label, int v, Color c) => Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(children: [
        SizedBox(width: 64, child: Tr(label, style: Theme.of(context).textTheme.bodySmall)),
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(value: v / 100, minHeight: 7, color: c, backgroundColor: c.withValues(alpha: .15)),
          ),
        ),
        SizedBox(width: 42, child: Text('$v%', textAlign: TextAlign.right, style: Theme.of(context).textTheme.bodySmall)),
      ]),
    );

// ---------------------------------------------------------------- Muuqaal iyo animation
String _svg(String inner) =>
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">$inner</g></svg>';

/// Icon-ka kulliyadda (SVG gaar ah, `faculties[i]['icon']`).
class FacultyIcon extends StatelessWidget {
  const FacultyIcon({super.key, required this.f, required this.size});
  final Map<String, dynamic> f;
  final double size;

  @override
  Widget build(BuildContext context) => SvgPicture.string(_svg(f['icon'] as String), width: size, height: size);
}

Route<T> fadeSlide<T>(Widget page) => PageRouteBuilder<T>(
      transitionDuration: const Duration(milliseconds: 420),
      reverseTransitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (_, __, ___) => page,
      transitionsBuilder: (_, a, __, child) {
        final c = CurvedAnimation(parent: a, curve: Curves.easeOutCubic);
        return FadeTransition(
          opacity: c,
          child: SlideTransition(position: Tween<Offset>(begin: const Offset(0, .04), end: Offset.zero).animate(c), child: child),
        );
      },
    );

/// Kor iyo hoos si tartiib ah ayuu u dhaqaaqaa (floating).
class Float extends StatefulWidget {
  const Float({super.key, required this.child, this.amount = 5, this.seconds = 3.4, this.delay = 0});
  final Widget child;
  final double amount;
  final double seconds;
  final int delay;

  @override
  State<Float> createState() => _FloatState();
}

class _FloatState extends State<Float> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: Duration(milliseconds: (widget.seconds * 1000).round()));

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _c.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    return AnimatedBuilder(
      animation: _c,
      builder: (_, child) => Transform.translate(offset: Offset(0, (Curves.easeInOut.transform(_c.value) - .5) * 2 * widget.amount), child: child),
      child: widget.child,
    );
  }
}

/// Si jilicsan ayuu u soo muuqdaa (fade + slide), dib-u-dhigid ikhtiyaari ah.
class Reveal extends StatefulWidget {
  const Reveal({super.key, required this.child, this.delay = 0, this.dy = .08});
  final Widget child;
  final int delay;
  final double dy;

  @override
  State<Reveal> createState() => _RevealState();
}

class _RevealState extends State<Reveal> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 560));
  late final Animation<double> _a = CurvedAnimation(parent: _c, curve: Curves.easeOutCubic);

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _c.forward();
    });
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
        opacity: _a,
        child: SlideTransition(position: Tween<Offset>(begin: Offset(0, widget.dy), end: Offset.zero).animate(_a), child: widget.child),
      );
}

/// Cabbir yar oo soo noqnoqda (badhanka bilowga).
class Pulse extends StatefulWidget {
  const Pulse({super.key, required this.child});
  final Widget child;

  @override
  State<Pulse> createState() => _PulseState();
}

class _PulseState extends State<Pulse> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600))..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    return ScaleTransition(scale: Tween<double>(begin: 1, end: 1.025).animate(CurvedAnimation(parent: _c, curve: Curves.easeInOut)), child: widget.child);
  }
}

class CountUp extends StatelessWidget {
  const CountUp({super.key, required this.value, this.style, this.ms = 1400});
  final int value;
  final TextStyle? style;
  final int ms;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
        tween: Tween<double>(begin: 0, end: value.toDouble()),
        duration: Duration(milliseconds: ms),
        curve: Curves.easeOutCubic,
        builder: (_, v, __) => Text('${v.round()}%', style: style),
      );
}

class ProgressRing extends StatelessWidget {
  const ProgressRing({super.key, required this.percent, required this.color, this.size = 68, this.stroke = 6, this.ms = 1300, this.track, this.child});
  final int percent;
  final Color color;
  final double size;
  final double stroke;
  final int ms;
  final Color? track;
  final Widget? child;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
        tween: Tween<double>(begin: 0, end: percent / 100),
        duration: Duration(milliseconds: ms),
        curve: Curves.easeOutCubic,
        builder: (_, v, __) => SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _RingPainter(v, color, track ?? Theme.of(context).colorScheme.outlineVariant, stroke),
            child: Center(child: child),
          ),
        ),
      );
}

class _RingPainter extends CustomPainter {
  _RingPainter(this.v, this.color, this.track, this.stroke);
  final double v;
  final Color color;
  final Color track;
  final double stroke;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).deflate(stroke / 2);
    final p = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(rect, 0, 2 * pi, false, p..color = track);
    canvas.drawArc(rect, -pi / 2, 2 * pi * v, false, p..color = color);
  }

  @override
  bool shouldRepaint(_RingPainter o) => o.v != v || o.color != color;
}

// ---- Confetti (gacmo-ku-samaysan, package la'aan)
class _Particle {
  _Particle(Random r, List<Color> colors)
      : vx = cos(-pi * (.08 + r.nextDouble() * .84)) * (.35 + r.nextDouble() * .75),
        vy = sin(-pi * (.08 + r.nextDouble() * .84)) * (.35 + r.nextDouble() * .75),
        size = 7 + r.nextDouble() * 8,
        rot = r.nextDouble() * 6,
        spin = (r.nextDouble() - .5) * 14,
        delay = r.nextDouble() * .35,
        shape = r.nextInt(4),
        color = colors[r.nextInt(colors.length)];
  final double vx, vy, size, rot, spin, delay;
  final int shape;
  final Color color;
}

class ConfettiBurst extends StatefulWidget {
  const ConfettiBurst({super.key, this.accent = const Color(0xFF7C5CFF)});
  final Color accent;

  @override
  State<ConfettiBurst> createState() => _ConfettiBurstState();
}

class _ConfettiBurstState extends State<ConfettiBurst> with SingleTickerProviderStateMixin {
  static const _secs = 4.4;
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 4400))..forward();
  late final List<_Particle> _ps;

  @override
  void initState() {
    super.initState();
    final r = Random();
    final colors = [const Color(0xFFFFD86B), Colors.white, const Color(0xFF7C5CFF), const Color(0xFF4C6EF5), const Color(0xFFFF7A90), const Color(0xFF3DDC97), widget.accent];
    _ps = List.generate(150, (_) => _Particle(r, colors));
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, __) => SizedBox.expand(child: CustomPaint(painter: _ConfettiPainter(_c.value * _secs, _ps))),
        ),
      );
}

class _ConfettiPainter extends CustomPainter {
  _ConfettiPainter(this.t, this.ps);
  final double t;
  final List<_Particle> ps;

  @override
  void paint(Canvas canvas, Size size) {
    final origin = Offset(size.width / 2, size.height * .40);
    final paint = Paint();
    for (final p in ps) {
      final tau = t - p.delay;
      if (tau < 0 || tau > 3.8) continue;
      final x = origin.dx + p.vx * size.width * tau * .9;
      final y = origin.dy + p.vy * size.height * tau * .9 + .5 * 1.25 * size.height * tau * tau * .55;
      final alpha = (3.8 - tau).clamp(0.0, 1.0).toDouble();
      paint.color = p.color.withValues(alpha: alpha);
      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(p.rot + p.spin * tau);
      switch (p.shape) {
        case 0:
          canvas.drawRect(Rect.fromCenter(center: Offset.zero, width: p.size, height: p.size * .55), paint);
        case 1:
          canvas.drawCircle(Offset.zero, p.size * .35, paint);
        default:
          canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset.zero, width: p.size * .32, height: p.size * 1.1), const Radius.circular(2)), paint);
      }
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_ConfettiPainter o) => o.t != t;
}

/// Banner-ka kulliyadda: gradient + goobo + icon la nalay. Sawirka rasmiga ah: assets/faculties/<id>.jpg (haddii uu jiro wuu daboolayaa).
class FacultyBanner extends StatelessWidget {
  const FacultyBanner({super.key, required this.f, required this.height, this.badge, this.label = false, this.float = false, this.floatDelay = 0});

  final Map<String, dynamic> f;
  final double height;
  final String? badge;
  final bool label;
  final bool float;
  final int floatDelay;

  Widget _ring(double d) => Container(
        width: d,
        height: d,
        decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white.withValues(alpha: .10), width: 14)),
      );

  @override
  Widget build(BuildContext context) {
    final c = Color(f['color'] as int);
    final dark = Color.lerp(c, Colors.black, .5)!;
    final b = height * .52;
    Widget badgeW = Container(
      width: b,
      height: b,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white.withValues(alpha: .14),
        border: Border.all(color: Colors.white.withValues(alpha: .4), width: 1.4),
        boxShadow: [BoxShadow(color: Colors.white.withValues(alpha: .25), blurRadius: 24, spreadRadius: 2)],
      ),
      child: Center(child: FacultyIcon(f: f, size: b * .55)),
    );
    if (float) badgeW = Float(delay: floatDelay, child: badgeW);
    return SizedBox(
      height: height,
      width: double.infinity,
      child: Stack(fit: StackFit.expand, children: [
        DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(colors: [c, dark], begin: Alignment.topLeft, end: Alignment.bottomRight))),
        Positioned(right: -height * .3, top: -height * .45, child: _ring(height * 1.2)),
        Positioned(left: -height * .25, bottom: -height * .6, child: _ring(height * 1.0)),
        Center(child: badgeW),
        Image.asset('assets/faculties/${f['id']}.jpg', fit: BoxFit.cover, errorBuilder: (_, __, ___) => const SizedBox.shrink()),
        const DecoratedBox(
          decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.transparent, Colors.black54], begin: Alignment.center, end: Alignment.bottomCenter)),
        ),
        if (badge != null)
          Positioned(
            left: 12,
            top: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(color: Colors.black38, borderRadius: BorderRadius.circular(99)),
              child: Text(badge!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)),
            ),
          ),
        if (label)
          Positioned(left: 12, bottom: 10, child: Text(f['short'] as String, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
      ]),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill(this.icon, this.text);
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: .16), borderRadius: BorderRadius.circular(99), border: Border.all(color: Colors.white24)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: 16, color: Colors.white),
          const SizedBox(width: 6),
          Tr(text, style: const TextStyle(color: Colors.white, fontSize: 13)),
        ]),
      );
}

// ---------------------------------------------------------------- Magaca ardayga (animation)
/// Magaca oo xarfo-xarfo ah ayaa u soo booda marka la qorayo. Xarfaha cusub oo kaliya ayaa animation sameeya.
class _PopText extends StatelessWidget {
  const _PopText(this.text, {required this.style});
  final String text;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    if (!_canSplit(text) || MediaQuery.disableAnimationsOf(context)) return Text(text, style: style);
    final chars = _letters(text);
    return Row(
      mainAxisSize: MainAxisSize.min,
      textDirection: TextDirection.ltr,
      children: [
        for (var i = 0; i < chars.length; i++)
          TweenAnimationBuilder<double>(
            key: ValueKey('$i${chars[i]}'),
            tween: Tween<double>(begin: 0, end: 1),
            duration: const Duration(milliseconds: 460),
            curve: Curves.easeOutBack,
            builder: (_, v, child) => Opacity(
              opacity: v.clamp(0.0, 1.0).toDouble(),
              child: Transform.translate(offset: Offset(0, (1 - v) * 12), child: Transform.scale(scale: .55 + .45 * v, child: child)),
            ),
            child: Text(chars[i], style: style),
          ),
      ],
    );
  }
}

/// Goobta magaca ee bogga hore: xad iftiin leh oo meeraysa marka la gelayo, calaamad saxan, iyo salaan xarfo-xarfo ah.
class _NameField extends StatefulWidget {
  const _NameField();

  @override
  State<_NameField> createState() => _NameFieldState();
}

class _NameFieldState extends State<_NameField> with TickerProviderStateMixin {
  static const _gold = Color(0xFFFFD86B);
  late final TextEditingController _c = TextEditingController(text: userName.value);
  final FocusNode _focus = FocusNode();
  late final AnimationController _spin = AnimationController(vsync: this, duration: const Duration(seconds: 3));
  late final AnimationController _wave = AnimationController(vsync: this, duration: const Duration(milliseconds: 2600));

  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocus);
    _wave.repeat();
  }

  void _onFocus() {
    if (_focus.hasFocus) {
      _spin.repeat();
    } else {
      _spin.stop();
    }
    setState(() {});
  }

  void _changed(String v) {
    userName.value = cleanName(v);
    setState(() {});
  }

  @override
  void dispose() {
    _focus.removeListener(_onFocus);
    _focus.dispose();
    _c.dispose();
    _spin.dispose();
    _wave.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final name = userName.value;
    final focused = _focus.hasFocus;
    final reduce = MediaQuery.disableAnimationsOf(context);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      AnimatedBuilder(
        animation: _spin,
        builder: (_, child) => Container(
          padding: const EdgeInsets.all(1.8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            color: focused ? null : Colors.white.withValues(alpha: .30),
            gradient: focused
                ? SweepGradient(
                    transform: GradientRotation(_spin.value * 2 * pi),
                    colors: const [Color(0xFFFFD86B), Color(0xFFFF7EB6), Color(0xFF7AE7FF), Color(0xFFFFD86B)],
                  )
                : null,
            boxShadow: focused ? [BoxShadow(color: _gold.withValues(alpha: .30), blurRadius: 26)] : const [],
          ),
          child: child,
        ),
        child: Container(
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(20.2), color: const Color(0xFF111B45)),
          child: Row(children: [
            const Padding(padding: EdgeInsetsDirectional.only(start: 16, end: 10), child: Icon(Icons.person_rounded, color: Colors.white70, size: 22)),
            Expanded(
              child: TextField(
                controller: _c,
                focusNode: _focus,
                onChanged: _changed,
                onSubmitted: (_) => _focus.unfocus(),
                textCapitalization: TextCapitalization.words,
                textInputAction: TextInputAction.done,
                inputFormatters: [LengthLimitingTextInputFormatter(20)],
                cursorColor: _gold,
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 18),
                  hintText: tr('Magacaaga (ikhtiyaari)'),
                  hintStyle: const TextStyle(color: Colors.white54, fontWeight: FontWeight.w500),
                ),
              ),
            ),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (c, a) => ScaleTransition(scale: CurvedAnimation(parent: a, curve: Curves.elasticOut), child: c),
              child: name.isEmpty
                  ? const SizedBox(key: ValueKey('empty'), width: 16)
                  : const Padding(key: ValueKey('ok'), padding: EdgeInsetsDirectional.only(start: 6, end: 14), child: Icon(Icons.check_circle_rounded, color: _gold, size: 24)),
            ),
          ]),
        ),
      ),
      AnimatedSize(
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeOutCubic,
        alignment: AlignmentDirectional.topStart,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 260),
          child: name.isEmpty
              ? const Padding(
                  key: ValueKey('hint'),
                  padding: EdgeInsets.only(top: 10),
                  child: Tr('Ku qor magacaaga si hambalyadaada ugu soo baxdo.', style: TextStyle(color: Colors.white70, fontSize: 13)),
                )
              : Padding(
                  key: const ValueKey('hello'),
                  padding: const EdgeInsets.only(top: 12),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    AnimatedBuilder(
                      animation: _wave,
                      builder: (_, child) {
                        final v = _wave.value;
                        final a = (!reduce && v < .55) ? sin(v / .55 * 5 * pi) * .5 * (1 - v / .55) : 0.0;
                        return Transform.rotate(angle: a, alignment: Alignment.bottomRight, child: child);
                      },
                      child: const Icon(Icons.waving_hand_rounded, color: _gold, size: 22),
                    ),
                    const SizedBox(width: 8),
                    const Tr('Soo dhawoow,', style: TextStyle(color: Colors.white, fontSize: 16)),
                    const SizedBox(width: 6),
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: _PopText(name, style: const TextStyle(color: _gold, fontSize: 20, fontWeight: FontWeight.w800)),
                      ),
                    ),
                  ]),
                ),
        ),
      ),
    ]);
  }
}

// ---------------------------------------------------------------- Bogga hore
/// Cinwaanka bogga hore: font casri ah (Outfit / Cairo), erayada way soo galaan mid mid,
/// iftiin dahab ah ayaa dul maraya, xariiq dahab ahna way kordhaysaa.
class _HeroTitle extends StatefulWidget {
  const _HeroTitle(this.k);
  final String k;

  @override
  State<_HeroTitle> createState() => _HeroTitleState();
}

class _HeroTitleState extends State<_HeroTitle> with TickerProviderStateMixin {
  late final AnimationController _in = AnimationController(vsync: this, duration: const Duration(milliseconds: 1300))..forward();
  late final AnimationController _shine = AnimationController(vsync: this, duration: const Duration(milliseconds: 3600))..repeat();

  @override
  void dispose() {
    _in.dispose();
    _shine.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final words = tr(widget.k).split(' ');
    final isAr = currentLang == 'ar';
    final base = TextStyle(color: Colors.white, fontSize: isAr ? 40 : 42, fontWeight: FontWeight.w800, height: 1.12, letterSpacing: isAr ? 0 : -.5);
    final style = isAr ? GoogleFonts.cairo(textStyle: base) : GoogleFonts.outfit(textStyle: base);
    final calm = MediaQuery.disableAnimationsOf(context);
    return AnimatedBuilder(
      animation: Listenable.merge([_in, _shine]),
      builder: (context, _) {
        final p = calm ? 1.0 : _in.value;
        final c = -0.3 + _shine.value * 1.6;
        return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ShaderMask(
            blendMode: BlendMode.srcIn,
            shaderCallback: (rect) => LinearGradient(
              colors: const [Colors.white, Color(0xFFFFD86B), Colors.white],
              stops: [(c - .18).clamp(0.0, 1.0), c.clamp(0.0, 1.0), (c + .18).clamp(0.0, 1.0)],
            ).createShader(rect),
            child: Wrap(spacing: isAr ? 12 : 11, runSpacing: 0, children: [
              for (var i = 0; i < words.length; i++)
                () {
                  final b = (i * .14).clamp(0.0, .6);
                  final v = Curves.easeOutCubic.transform(Interval(b, (b + .55).clamp(0.0, 1.0)).transform(p));
                  return Opacity(
                    opacity: v,
                    child: Transform.translate(offset: Offset(0, (1 - v) * 26), child: Text(words[i], style: style)),
                  );
                }(),
            ]),
          ),
          const SizedBox(height: 8),
          Container(
            width: 64 * Curves.easeOut.transform(Interval(.55, 1).transform(p)),
            height: 4,
            decoration: BoxDecoration(color: const Color(0xFFFFD86B), borderRadius: BorderRadius.circular(4)),
          ),
        ]);
      },
    );
  }
}

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _bg = AnimationController(vsync: this, duration: const Duration(seconds: 9))..repeat(reverse: true);

  @override
  void dispose() {
    _bg.dispose();
    super.dispose();
  }

  Widget _bubble(int idx, double size, int i) => Float(
        amount: 8,
        seconds: 3.0 + i * .45,
        delay: i * 280,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: .10), border: Border.all(color: Colors.white.withValues(alpha: .28))),
          child: Center(child: FacultyIcon(f: faculties[idx], size: size * .5)),
        ),
      );

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final top = MediaQuery.of(context).padding.top;
    return Scaffold(
      body: ListView(padding: EdgeInsets.zero, children: [
        AnimatedBuilder(
          animation: _bg,
          builder: (_, child) => Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment(-1 + _bg.value * .8, -1),
                end: Alignment(1, 1 - _bg.value * .8),
                colors: const [Color(0xFF0F1B3D), Color(0xFF2A4BA0), Color(0xFF6C4BDD)],
              ),
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(34)),
            ),
            child: child,
          ),
          child: Stack(children: [
            Positioned(right: 22, top: top + 176, child: _bubble(4, 58, 0)),
            Positioned(right: 96, top: top + 196, child: _bubble(8, 46, 1)),
            Positioned(right: 18, top: top + 178, child: _bubble(6, 50, 2)),
            Positioned(right: 150, top: top + 236, child: _bubble(0, 40, 3)),
            Positioned(right: 84, top: top + 222, child: _bubble(3, 42, 4)),
            Padding(
              padding: EdgeInsets.fromLTRB(24, top + 28, 24, 32),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  const Icon(Icons.school_rounded, color: Colors.white, size: 44),
                  const Row(mainAxisSize: MainAxisSize.min, children: [
                    _LangPicker(color: Colors.white),
                    _ThemeToggle(color: Colors.white),
                  ]),
                ]),
                const SizedBox(height: 16),
                const _HeroTitle('Hagaha Kulliyadda'),
                const SizedBox(height: 8),
                Reveal(
                  delay: 120,
                  child: Tr('Su’aalo gaagaaban ayaa kaa caawinaya inaad garatid kulliyadda kuu ugu habboon, adigoo ku saleynaya waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah.',
                    style: t.bodyLarge?.copyWith(color: Colors.white70, height: 1.4),
                  ),
                ),
                const SizedBox(height: 20),
                Reveal(
                  delay: 240,
                  child: Wrap(spacing: 8, runSpacing: 8, children: [
                    _Pill(Icons.quiz_outlined, trf('{n} su’aalood', {'n': '25-30'})),
                    const _Pill(Icons.timer_outlined, 'Ku dhawaad 8 daqiiqo'),
                    const _Pill(Icons.emoji_events_outlined, 'Saddex kulliyadood'),
                  ]),
                ),
                const SizedBox(height: 22),
                const Reveal(delay: 360, child: _NameField()),
              ]),
            ),
          ]),
        ),
        Padding(padding: const EdgeInsets.fromLTRB(24, 24, 24, 10), child: Tr('Kulliyadaha', style: t.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
        SizedBox(
          height: 118,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            itemCount: faculties.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, i) => Reveal(
              delay: 200 + i * 70,
              dy: .0,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: SizedBox(width: 156, child: FacultyBanner(f: faculties[i], height: 118, label: true, float: true, floatDelay: i * 220)),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(Icons.lock_outline, size: 18, color: t.bodySmall?.color),
            const SizedBox(width: 8),
            Expanded(child: Tr('Magacaaga (ikhtiyaari) waxaa loo isticmaalaa hambalyada oo kaliya. Waxay ku hadhaysaa qalabkaaga, waxbana lama diro.', style: t.bodySmall)),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.all(24),
          child: Pulse(
            child: FilledButton.icon(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(58), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18))),
              onPressed: () {
                FocusManager.instance.primaryFocus?.unfocus();
                Navigator.push(context, fadeSlide(const QuizScreen()));
              },
              icon: const Icon(Icons.play_arrow_rounded),
              label: const Tr('Bilow', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
            ),
          ),
        ),
        const _Footer(),
      ]),
    );
  }
}

// ---------------------------------------------------------------- Su'aalaha
const sectionIcons = [Icons.explore_outlined, Icons.favorite_border_rounded, Icons.school_outlined, Icons.psychology_outlined, Icons.balance_outlined];

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _pos = 0;
  bool _busy = false;
  List<int> _plan = screeningIdx().take(3).toList(); // su'aalaha la weydiinayo (tusmooyin) - waxay koraan kadib hordhaca
  final List<int> _sel = List.filled(items.length, -1); // doorashada la riixay
  final List<int> _r = List.filled(items.length, -1); // qiimeynta (1-5) ee xisaabta

  int get _idx => _plan[_pos];

  /// choice = tusmada doorashada; -1 = ka bood.
  void _answer(int choice) {
    if (_busy) return;
    final it = items[_idx];
    setState(() {
      _sel[_idx] = choice;
      _r[_idx] = ratingFor(it, choice);
      _busy = true;
      // Su'aalaha hordhaca kadib, qorshaha waxaa loo habeeyaa kooxda ardayga.
      if (it['type'] == 'sc' && _pos >= 2) _plan = buildPlan(_r);
    });
    Future.delayed(const Duration(milliseconds: 320), () {
      if (!mounted) return;
      if (_pos < _plan.length - 1) {
        setState(() {
          _pos++;
          _busy = false;
        });
      } else {
        final inPlan = _plan.toSet();
        final masked = [for (var i = 0; i < _r.length; i++) inPlan.contains(i) ? _r[i] : -1];
        Navigator.pushReplacement(
          context,
          fadeSlide(ResultScreen(
            matches: computeMatches(masked),
            answered: masked.where((x) => x > 0).length,
            planLen: _plan.length,
            profile: interestProfile(masked),
          )),
        );
      }
    });
  }

  void _back() {
    if (_pos > 0 && !_busy) setState(() => _pos--);
  }

  Widget _segments() {
    final adapt = _plan.length > 3;
    final counts = [for (var s = 0; s < sections.length; s++) _plan.where((i) => items[i]['s'] == s).length];
    if (!adapt) counts.add(25); // qaybta hadhay (lama oga weli)
    var start = 0;
    final segs = <Widget>[];
    for (var s = 0; s < counts.length; s++) {
      if (counts[s] == 0) continue;
      final v = ((_pos + 1 - start) / counts[s]).clamp(0.0, 1.0).toDouble();
      segs.add(Expanded(
        flex: counts[s],
        child: Padding(
          padding: const EdgeInsetsDirectional.only(end: 4),
          child: TweenAnimationBuilder<double>(
            tween: Tween<double>(end: v),
            duration: const Duration(milliseconds: 380),
            builder: (_, x, __) => ClipRRect(borderRadius: BorderRadius.circular(6), child: LinearProgressIndicator(value: x, minHeight: 7)),
          ),
        ),
      ));
      start += counts[s];
    }
    return Row(children: segs);
  }

  @override
  Widget build(BuildContext context) {
    final it = items[_idx];
    final secIdx = it['s'] as int;
    final sec = sections[secIdx];
    final type = it['type'] as String;
    final opts = txl(type == 'l' ? sec['sc'] : it['o']);
    final adapt = _plan.length > 3;
    final total = adapt ? _plan.length : 28;
    final focus = adapt ? focusClusters(_r, screeningIdx().where(_plan.contains).toList()) : <String>[];
    final t = Theme.of(context).textTheme;
    final cs = Theme.of(context).colorScheme;
    return PopScope(
      canPop: _pos == 0,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _back();
      },
      child: Scaffold(
        appBar: AppBar(title: const Tr('Hagaha Kulliyadda'), backgroundColor: Colors.transparent, actions: const [_ThemeToggle()]),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(trf('Su’aal {a} / {b}', {'a': _pos + 1, 'b': total}), style: t.bodyMedium),
              if (focus.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Text(trf('Su’aalaha waxaa lagu habeeyay: {c}', {'c': focus.map((c) => tr(clusterNames[c]!)).join(' · ')}), style: t.bodySmall?.copyWith(color: cs.primary)),
                ),
              const SizedBox(height: 8),
              _segments(),
              const SizedBox(height: 16),
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 320),
                  transitionBuilder: (child, anim) => FadeTransition(
                    opacity: anim,
                    child: SlideTransition(position: Tween<Offset>(begin: const Offset(.07, 0), end: Offset.zero).animate(anim), child: child),
                  ),
                  child: SingleChildScrollView(
                    key: ValueKey(_idx),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(color: cs.primaryContainer.withValues(alpha: .6), borderRadius: BorderRadius.circular(99)),
                        child: Row(mainAxisSize: MainAxisSize.min, children: [
                          Icon(sectionIcons[secIdx], size: 16, color: cs.primary),
                          const SizedBox(width: 6),
                          Text(tx(sec['n']), style: TextStyle(color: cs.primary, fontWeight: FontWeight.w700, fontSize: 13)),
                        ]),
                      ),
                      const SizedBox(height: 10),
                      Text(tx(sec['h']), style: t.bodySmall),
                      const SizedBox(height: 10),
                      Text(tx(it['t']), style: t.titleLarge?.copyWith(fontWeight: FontWeight.w800, height: 1.3)),
                      const SizedBox(height: 20),
                      for (var j = 0; j < opts.length; j++)
                        Reveal(
                          delay: j * 60,
                          dy: .12,
                          child: _OptionTile(letter: type == 'l' ? '${j + 1}' : 'ABCDE'[j], text: opts[j], selected: _sel[_idx] == j, onTap: () => _answer(j)),
                        ),
                      Center(child: TextButton.icon(onPressed: () => _answer(-1), icon: const Icon(Icons.skip_next_rounded), label: const Tr('Ma hubo, ka bood'))),
                    ]),
                  ),
                ),
              ),
              if (_pos > 0)
                Align(alignment: AlignmentDirectional.centerStart, child: TextButton.icon(onPressed: _back, icon: const Icon(Icons.arrow_back), label: const Tr('Su’aashii hore'))),
            ]),
          ),
        ),
      ),
    );
  }
}

class _OptionTile extends StatefulWidget {
  const _OptionTile({required this.letter, required this.text, required this.selected, required this.onTap});
  final String letter;
  final String text;
  final bool selected;
  final VoidCallback onTap;

  @override
  State<_OptionTile> createState() => _OptionTileState();
}

class _OptionTileState extends State<_OptionTile> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final sel = widget.selected;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTapDown: (_) => setState(() => _down = true),
        onTapCancel: () => setState(() => _down = false),
        onTapUp: (_) => setState(() => _down = false),
        onTap: widget.onTap,
        child: AnimatedScale(
          scale: _down ? .975 : 1,
          duration: const Duration(milliseconds: 120),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeOut,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: sel ? cs.primaryContainer : cs.surfaceContainerLow,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: sel ? cs.primary : cs.outlineVariant, width: sel ? 1.8 : 1.2),
              boxShadow: sel ? [BoxShadow(color: cs.primary.withValues(alpha: .25), blurRadius: 14, offset: const Offset(0, 4))] : const [],
            ),
            child: Row(children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 220),
                width: 32,
                height: 32,
                decoration: BoxDecoration(shape: BoxShape.circle, color: sel ? cs.primary : cs.surfaceContainerHighest),
                child: Center(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    transitionBuilder: (c, a) => ScaleTransition(scale: a, child: c),
                    child: sel
                        ? Icon(Icons.check_rounded, key: const ValueKey('c'), size: 18, color: cs.onPrimary)
                        : Text(widget.letter, key: const ValueKey('t'), style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: cs.onSurface)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text(widget.text, style: const TextStyle(fontSize: 15.5, height: 1.3))),
            ]),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------- Natiijada iyo hambalyada
class ResultScreen extends StatefulWidget {
  const ResultScreen({super.key, required this.matches, required this.answered, required this.planLen, required this.profile});
  final List<FacultyMatch> matches;
  final int answered;
  final int planLen;
  final List<String> profile;

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  late bool _celebrate = widget.answered >= minNeeded(widget.planLen); // hambalyo: kaliya haddii natiijadu kalsooni leedahay
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    if (_celebrate) _timer = Timer(const Duration(seconds: 9), _done);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _done() {
    if (mounted && _celebrate) setState(() => _celebrate = false);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        body: AnimatedSwitcher(
          duration: const Duration(milliseconds: 600),
          child: _celebrate
              ? _Celebration(key: const ValueKey('celebrate'), top: widget.matches.first, onDone: _done)
              : _content(context),
        ),
      );

  Widget _content(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final top = widget.matches.take(3).toList();
    final unclear = top.length == 3 && top[0].percent - top[2].percent < 6;
    var d = 0;
    int next() => (d++) * 140;
    return ListView(
      key: const ValueKey('content'),
      padding: EdgeInsets.fromLTRB(16, MediaQuery.of(context).padding.top + 8, 16, 32),
      children: [
        const Align(alignment: Alignment.centerRight, child: _ThemeToggle()),
        Reveal(
          delay: next(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Tr('Natiijadaada', style: t.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Tr('Saddexda kulliyadood ee kuu ugu habboon', style: t.bodyMedium),
            ]),
          ),
        ),
        if (widget.answered < minNeeded(widget.planLen))
          Reveal(
            delay: next(),
            child: Card(
              color: Theme.of(context).colorScheme.errorContainer,
              margin: const EdgeInsets.only(top: 12),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Text(trf('Waxaad ka jawaabtay {a} / {b} su’aalood. Natiijadu waxay noqotaa mid kalsooni yar haddii su’aalo badan la boodo. Dib u bilow oo ka jawaab ugu yaraan {c} su’aalood.', {'a': widget.answered, 'b': widget.planLen, 'c': minNeeded(widget.planLen)})),
              ),
            ),
          ),
        if (unclear)
          Reveal(
            delay: next(),
            child: Card(
              margin: const EdgeInsets.only(top: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const _Heading(Icons.help_outline, 'Doorbidkaagu ma cadda'),
                  const SizedBox(height: 4),
                  Tr('Saddexda kulliyadood waa isku dhow yihiin. Jawaabahaagu ma muujinayaan doorbid cad, sidaas awgeed isbarbar dhig dhammaan saddexda, oo la hadal qof ku aqaan.', style: t.bodyMedium),
                ]),
              ),
            ),
          ),
        Reveal(
          delay: next(),
          child: Card(
            margin: const EdgeInsets.only(top: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const _Heading(Icons.explore_outlined, 'Astaanta xiisahaaga'),
                const SizedBox(height: 4),
                Text(widget.profile.isEmpty ? '—' : widget.profile.join(' · '), style: t.bodyMedium),
              ]),
            ),
          ),
        ),
        for (var i = 0; i < top.length; i++) Reveal(delay: next(), child: _ResultCard(rank: i + 1, m: top[i])),
        const SizedBox(height: 16),
        Reveal(delay: next(), child: const _NextSteps()),
        const SizedBox(height: 12),
        Reveal(
          delay: next(),
          child: FilledButton.icon(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
            onPressed: () => Navigator.push(context, fadeSlide(CompareScreen(matches: widget.matches))),
            icon: const Icon(Icons.compare_arrows_rounded),
            label: const Tr('Isbarbardhig kulliyadaha'),
          ),
        ),
        const SizedBox(height: 12),
        FilledButton.tonalIcon(
          style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
          onPressed: () {
            final text = '${tr('Natiijadayda, Hagaha Kulliyadda:')}\n${[for (var i = 0; i < top.length; i++) '${i + 1}) ${tx(top[i].f['name'])}: ${top[i].percent}%'].join('\n')}';
            Clipboard.setData(ClipboardData(text: text));
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Tr('Waa la koobiyeeyay')));
          },
          icon: const Icon(Icons.copy_rounded),
          label: const Tr('Nuqul ka samee natiijada'),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
          onPressed: () => Navigator.pushAndRemoveUntil(context, fadeSlide(const WelcomeScreen()), (_) => false),
          icon: const Icon(Icons.replay_rounded),
          label: const Tr('Dib u bilow'),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 16, 12, 0),
          child: Tr('Qiimeyntani waxay ku salaysan tahay qaab Holland RIASEC oo la fududeeyay. Ma aha imtixaan rasmi ah. U isticmaal hage, ma aha go’aan kama dambeys ah.', style: t.bodySmall),
        ),
        const _Footer(),
      ],
    );
  }
}

/// Shaashadda hambalyada: confetti, icon-ka kulliyadda oo soo baxaya, "Hambalyo!" iyo boqolkiiba oo kordhaya. Si toos ah ayay u xidhmaysaa.
class _Celebration extends StatefulWidget {
  const _Celebration({super.key, required this.top, required this.onDone});
  final FacultyMatch top;
  final VoidCallback onDone;

  @override
  State<_Celebration> createState() => _CelebrationState();
}

class _CelebrationState extends State<_Celebration> with TickerProviderStateMixin {
  late final AnimationController _in = AnimationController(vsync: this, duration: const Duration(milliseconds: 2200))..forward();
  late final AnimationController _ripple = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400))..repeat();

  @override
  void dispose() {
    _in.dispose();
    _ripple.dispose();
    super.dispose();
  }

  Animation<double> _iv(double a, double b, [Curve cv = Curves.easeOutCubic]) => CurvedAnimation(parent: _in, curve: Interval(a, b, curve: cv));

  Widget _enter(double a, double b, Widget child) => FadeTransition(
        opacity: _iv(a, b),
        child: SlideTransition(position: Tween<Offset>(begin: const Offset(0, .35), end: Offset.zero).animate(_iv(a, b)), child: child),
      );

  /// Xarf kasta wuu soo booda (fade + kor + weyn), si isku xigta.
  Widget _letter(String ch, double a, TextStyle style) {
    final b = a + .26;
    final fade = _iv(a, b, Curves.easeOut);
    final pop = _iv(a, b, Curves.easeOutBack);
    return FadeTransition(
      opacity: fade,
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, .6), end: Offset.zero).animate(pop),
        child: ScaleTransition(scale: Tween<double>(begin: .5, end: 1).animate(pop), child: Text(ch, style: style)),
      ),
    );
  }

  /// Magaca ardayga hoos u dhaca "Hambalyo!": xarfo-xarfo ayuu u soo booda, kadibna iftiin dahab ah ayaa dul maraya.
  /// Carabi/Cibraani waa isku mar (xarfaha ha go'in), iyo haddii animation-ku xiran yahay.
  Widget _nameLine(String name, bool reduce) {
    const style = TextStyle(color: Color(0xFFFFD86B), fontSize: 40, fontWeight: FontWeight.w800, height: 1.15, letterSpacing: .5);
    if (reduce || !_canSplit(name)) {
      return FittedBox(fit: BoxFit.scaleDown, child: _enter(.34, .7, Text(name, textAlign: TextAlign.center, style: style)));
    }
    final chars = _letters(name);
    final n = chars.length;
    final row = Row(
      mainAxisSize: MainAxisSize.min,
      textDirection: TextDirection.ltr,
      children: [for (var i = 0; i < n; i++) _letter(chars[i], .34 + .3 * i / n, style)],
    );
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: AnimatedBuilder(
        animation: _ripple,
        builder: (_, child) {
          final v = min(1.0, _ripple.value * 1.7); // iftiinku wuu dhaqaaqaa, kadibna wuu nasanayaa
          return ShaderMask(
            blendMode: BlendMode.srcIn,
            shaderCallback: (r) => LinearGradient(
              begin: Alignment(-2.4 + 4.8 * v, 0),
              end: Alignment(-1.4 + 4.8 * v, 0),
              colors: const [Color(0xFFFFD86B), Colors.white, Color(0xFFFFD86B)],
              stops: const [0, .5, 1],
            ).createShader(r),
            child: child,
          );
        },
        child: row,
      ),
    );
  }

  Widget _wave(double phase) => AnimatedBuilder(
        animation: _ripple,
        builder: (_, __) {
          final v = (_ripple.value + phase) % 1;
          return Opacity(
            opacity: (1 - v) * .55,
            child: Transform.scale(scale: 1 + v * 1.1, child: Container(width: 170, height: 170, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)))),
          );
        },
      );

  @override
  Widget build(BuildContext context) {
    final f = widget.top.f;
    final c = Color(f['color'] as int);
    final reduce = MediaQuery.disableAnimationsOf(context);
    return Container(
      decoration: BoxDecoration(gradient: RadialGradient(center: const Alignment(0, -.25), radius: 1.1, colors: [Color.lerp(c, Colors.black, .3)!, const Color(0xFF070B18)])),
      child: Stack(children: [
        if (!reduce) Positioned.fill(child: ConfettiBurst(accent: c)),
        SafeArea(
          child: LayoutBuilder(
            builder: (_, bc) => SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: bc.maxHeight),
                child: Center(
                  child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    ScaleTransition(
                      scale: _iv(0, .5, Curves.elasticOut),
                      child: SizedBox(
                        width: 190,
                        height: 190,
                        child: Stack(alignment: Alignment.center, children: [
                          if (!reduce) ...[_wave(0), _wave(.5)],
                          ProgressRing(
                            percent: widget.top.percent,
                            color: const Color(0xFFFFD86B),
                            track: Colors.white24,
                            size: 170,
                            stroke: 7,
                            ms: 2000,
                            child: Container(
                              width: 124,
                              height: 124,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withValues(alpha: .14),
                                border: Border.all(color: Colors.white.withValues(alpha: .45), width: 1.5),
                                boxShadow: [BoxShadow(color: Colors.white.withValues(alpha: .3), blurRadius: 40, spreadRadius: 2)],
                              ),
                              child: Center(child: FacultyIcon(f: f, size: 66)),
                            ),
                          ),
                        ]),
                      ),
                    ),
                    const SizedBox(height: 22),
                    _enter(.28, .6, const Tr('Hambalyo!', style: TextStyle(color: Colors.white, fontSize: 44, fontWeight: FontWeight.w800, letterSpacing: .5))),
                    if (userName.value.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      _nameLine(userName.value, reduce),
                    ],
                    const SizedBox(height: 6),
                    _enter(.4, .7, const Tr('Kulliyadda kuu ugu habboon waa', style: TextStyle(color: Colors.white70, fontSize: 15))),
                    const SizedBox(height: 6),
                    _enter(.5, .8, Text(tx(f['name']), textAlign: TextAlign.center, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700, height: 1.25))),
                    const SizedBox(height: 12),
                    _enter(.6, .9, Column(children: [
                      CountUp(value: widget.top.percent, ms: 1900, style: const TextStyle(color: Color(0xFFFFD86B), fontSize: 42, fontWeight: FontWeight.w800)),
                      const Tr('ku habboonaan', style: TextStyle(color: Colors.white70, fontSize: 13)),
                    ])),
                    const SizedBox(height: 26),
                    FadeTransition(
                      opacity: _iv(.75, 1),
                      child: FilledButton.icon(
                        style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF14213D), minimumSize: const Size(230, 52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                        onPressed: widget.onDone,
                        icon: const Icon(Icons.arrow_forward_rounded),
                        label: const Tr('Eeg faahfaahinta', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ]),
                ),
                ),
              ),
            ),
          ),
        ),
      ]),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({required this.rank, required this.m});
  final int rank;
  final FacultyMatch m;

  @override
  Widget build(BuildContext context) {
    final f = m.f;
    final c = Color(f['color'] as int);
    final t = Theme.of(context).textTheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.only(top: 16),
      elevation: rank == 1 ? 6 : 2,
      shadowColor: c.withValues(alpha: .45),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        FacultyBanner(f: f, height: rank == 1 ? 200 : 146, badge: rank == 1 ? tr('Kuu ugu habboon') : '#$rank', float: true),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(tx(f['name']), style: t.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  if (currentLang != 'en') Text(f['en'] as String, style: t.bodySmall),
                ]),
              ),
              const SizedBox(width: 12),
              ProgressRing(
                percent: m.percent,
                color: c,
                size: 68,
                stroke: 6,
                ms: 1200 + rank * 200,
                child: CountUp(value: m.percent, ms: 1200 + rank * 200, style: TextStyle(color: c, fontWeight: FontWeight.w800, fontSize: 16)),
              ),
            ]),
            const SizedBox(height: 10),
            _bar(context, 'Xiisaha', m.interest, c),
            _bar(context, 'Kartida', m.aptitude, c),
            _bar(context, 'Qiimaha', m.conditions, c),
            const SizedBox(height: 12),
            Text(tx(f['desc']), style: t.bodyMedium?.copyWith(height: 1.4)),
            if (m.reasons.isNotEmpty) ...[
              const SizedBox(height: 14),
              const _Heading(Icons.fact_check_outlined, 'Sababta natiijada'),
              const SizedBox(height: 2),
              Tr('Jawaabaha ugu saameeyay:', style: t.bodySmall),
              for (final r in m.reasons) Padding(padding: const EdgeInsets.only(top: 4), child: Text(r, style: t.bodyMedium?.copyWith(height: 1.35))),
            ],
            const SizedBox(height: 14),
            const _Heading(Icons.account_tree_outlined, 'Waaxaha'),
            const SizedBox(height: 6),
            Wrap(spacing: 6, runSpacing: 6, children: [
              for (final d in f['depts'] as List)
                Chip(label: Text(d as String, style: const TextStyle(fontSize: 12.5)), visualDensity: VisualDensity.compact, backgroundColor: c.withValues(alpha: .12), side: BorderSide.none),
            ]),
            const SizedBox(height: 12),
            const _Heading(Icons.work_outline, 'Shaqooyinka laga helo'),
            const SizedBox(height: 4),
            Text(txl(f['jobs']).join(' · '), style: t.bodyMedium),
            const SizedBox(height: 12),
            const _Heading(Icons.lightbulb_outline, 'Talooyin'),
            const SizedBox(height: 4),
            for (final tip in txl(f['tips']))
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('•  ', style: TextStyle(color: c, fontWeight: FontWeight.w800)),
                  Expanded(child: Text(tip, style: t.bodyMedium?.copyWith(height: 1.35))),
                ]),
              ),
          ]),
        ),
      ]),
    );
  }
}

class _NextSteps extends StatelessWidget {
  const _NextSteps();

  @override
  Widget build(BuildContext context) {
    const steps = [
      'La hadal arday hadda ku jira kulliyaddan, ama macallinkaaga.',
      'La xiriir xafiiska diiwaangelinta si aad u hesho shuruudaha gelitaanka, khidmadda iyo waqtiyada diiwaangelinta.',
      'Isbarbar dhig labada kulliyadood ee ugu sarreeya: waxbarashada, shaqada iyo kharashka.',
      'U hay hal usbuuc ugu yaraan ka hor intaadan go’aan gaarin, oo la tasho qoyskaaga.',
    ];
    final t = Theme.of(context).textTheme;
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const _Heading(Icons.checklist_rounded, 'Tallaabooyinka xiga'),
          for (var i = 0; i < steps.length; i++)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                CircleAvatar(radius: 11, child: Text('${i + 1}', style: const TextStyle(fontSize: 12))),
                const SizedBox(width: 10),
                Expanded(child: Tr(steps[i], style: t.bodyMedium?.copyWith(height: 1.35))),
              ]),
            ),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- Isbarbardhig
class CompareScreen extends StatefulWidget {
  const CompareScreen({super.key, required this.matches});
  final List<FacultyMatch> matches;

  @override
  State<CompareScreen> createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  late String _a = widget.matches[0].f['id'] as String;
  late String _b = widget.matches[1].f['id'] as String;

  Map<String, dynamic> _f(String id) => faculties.firstWhere((f) => f['id'] == id);
  FacultyMatch _m(String id) => widget.matches.firstWhere((m) => m.f['id'] == id);

  Widget _drop(String value, ValueChanged<String> on) => DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        decoration: const InputDecoration(border: OutlineInputBorder(), isDense: true),
        items: [for (final f in faculties) DropdownMenuItem(value: f['id'] as String, child: Text(f['short'] as String))],
        onChanged: (v) => on(v!),
      );

  Widget _pair(String title, Widget Function(Map<String, dynamic>) cell) => Column(children: [
        if (title.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 18, bottom: 6),
            child: Tr(title, style: const TextStyle(fontWeight: FontWeight.w800)),
          ),
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: Padding(padding: const EdgeInsets.only(right: 6), child: cell(_f(_a)))),
          Expanded(child: Padding(padding: const EdgeInsets.only(left: 6), child: cell(_f(_b)))),
        ]),
      ]);

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Tr('Isbarbardhig'), actions: const [_ThemeToggle()]),
      body: ListView(padding: const EdgeInsets.fromLTRB(16, 8, 16, 16), children: [
        Row(children: [
          Expanded(child: _drop(_a, (v) => setState(() => _a = v))),
          const SizedBox(width: 12),
          Expanded(child: _drop(_b, (v) => setState(() => _b = v))),
        ]),
        const SizedBox(height: 14),
        _pair('', (f) => ClipRRect(borderRadius: BorderRadius.circular(16), child: FacultyBanner(f: f, height: 100, label: true))),
        _pair('Ku habboonaanta', (f) => Text(_m(f['id'] as String).inPool ? '${_m(f['id'] as String).percent}%' : '—', style: t.headlineSmall?.copyWith(color: Color(f['color'] as int), fontWeight: FontWeight.w800))),
        _pair('Xiisaha · Kartida · Qiimaha', (f) {
          final m = _m(f['id'] as String);
          return Text(m.inPool ? '${m.interest}% · ${m.aptitude}% · ${m.conditions}%' : '—', style: t.bodySmall);
        }),
        _pair('Magaca', (f) => Text(tx(f['name']), style: t.bodyMedium?.copyWith(fontWeight: FontWeight.w600))),
        _pair('Sharaxaad', (f) => Text(tx(f['desc']), style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('Waaxaha', (f) => Text(trf('{n} waax: {list}', {'n': (f['depts'] as List).length, 'list': (f['depts'] as List).join(', ')}), style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('Shaqooyinka', (f) => Text(txl(f['jobs']).join(' · '), style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('Talo', (f) => Text(txl(f['tips']).first, style: t.bodySmall?.copyWith(height: 1.4))),
        const _Footer(),
      ]),
    );
  }
}
