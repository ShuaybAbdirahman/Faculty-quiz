import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'data.dart';

void main() => runApp(const GuideApp());

/// Dark mode waa caadi (default). Badhanka Light/Dark ayaa beddela.
final ValueNotifier<bool> darkMode = ValueNotifier(true);

ThemeData _theme(bool dark) => ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      colorSchemeSeed: const Color(0xFF1F3A93),
      scaffoldBackgroundColor: dark ? const Color(0xFF0E1424) : const Color(0xFFF5F7FB),
    );

class GuideApp extends StatelessWidget {
  const GuideApp({super.key});

  @override
  Widget build(BuildContext context) => ValueListenableBuilder<bool>(
        valueListenable: darkMode,
        builder: (_, dark, __) => MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Hagaha Kulliyadda',
          theme: _theme(dark),
          home: const WelcomeScreen(),
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
      icon: Icon(dark ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
      label: Text(dark ? 'Light' : 'Dark'),
    );
  }
}

// ---------------------------------------------------------------- Logic
const Map<String, IconData> facultyIcons = {
  'law': Icons.gavel_rounded,
  'edu': Icons.school_rounded,
  'econ': Icons.trending_up_rounded,
  'health': Icons.monitor_heart_rounded,
  'cs': Icons.computer_rounded,
  'pol': Icons.account_balance_rounded,
  'eng': Icons.engineering_rounded,
  'agri': Icons.eco_rounded,
  'med': Icons.medical_services_rounded,
  'vet': Icons.pets_rounded,
  'dent': Icons.mood_rounded,
  'avia': Icons.flight_rounded,
};

/// Kooxaha kulliyadaha isku dhow. Doorashada koowaad ayaa go'aamisa kooxda,
/// su'aalaha xiga waxay tusayaan oo kaliya doorashooyinka ku dhow kooxdaas.
const Map<String, List<String>> groups = {
  'tech': ['cs', 'eng', 'avia', 'edu', 'econ'],
  'health': ['health', 'med', 'dent', 'vet', 'agri'],
  'society': ['law', 'pol', 'edu', 'econ'],
  'business': ['econ', 'pol', 'cs', 'avia'],
};

/// Kulliyadda ugu muhiimsan ee doorashada koowaad => kooxda.
const Map<String, String> homeGroup = {
  'cs': 'tech', 'eng': 'tech', 'avia': 'tech',
  'health': 'health', 'med': 'health', 'dent': 'health', 'vet': 'health', 'agri': 'health',
  'law': 'society', 'pol': 'society', 'edu': 'society',
  'econ': 'business',
};

class Step {
  const Step(this.q, this.opts);
  final int q; // tusmada su'aasha
  final List<int> opts; // tusmooyinka doorashooyinka la tusayo
}

class Match {
  const Match(this.f, this.percent, this.score, this.reasons);
  final Map<String, dynamic> f;
  final int percent;
  final int score;
  final List<String> reasons; // doorashooyinkaagii ugu saameeyay natiijadan
}

/// Kooxda ka timaadda doorashada su'aasha 1aad (null = la boodey).
String? groupOf(int first) {
  if (first < 0) return null;
  String? primary;
  var top = 0;
  ((questions[0]['o'] as List)[first]['w'] as Map).forEach((k, v) {
    if ((v as int) > top) {
      top = v;
      primary = k as String;
    }
  });
  return homeGroup[primary];
}

/// first = doorashada su'aasha 1aad (-1 = la boodey: dhammaan su'aalaha way muuqdaan).
List<Step> buildPlan(int first) {
  final all = [
    for (var i = 0; i < questions.length; i++)
      Step(i, [for (var k = 0; k < (questions[i]['o'] as List).length; k++) k]),
  ];
  // Su'aalaha gaarka ah (g != null) waxay muuqdaan oo kaliya kooxdooda.
  final general = [for (final s in all) if (questions[s.q]['g'] == null) s];
  if (first < 0) return general;
  final group = groupOf(first);
  if (group == null) return general;
  final focus = groups[group]!;
  final plan = [all.first];
  for (var i = 1; i < questions.length; i++) {
    final g = questions[i]['g'] as String?;
    if (g != null) {
      if (g == group) plan.add(all[i]);
      continue;
    }
    final opts = questions[i]['o'] as List;
    final keep = [
      for (var k = 0; k < opts.length; k++)
        if ((opts[k]['w'] as Map).keys.any((z) => focus.contains(z))) k,
    ];
    if (keep.length >= 2) plan.add(Step(i, keep)); // su'aal aan khusayn waa la qariyaa
  }
  return plan;
}

/// Su'aalaha la boodey kuma jiraan xisaabta (kulliyadda lagama ganaaxayo).
List<Match> computeMatches(List<Step> plan, List<int> a, String? group) {
  final score = <String, int>{};
  final best = <String, int>{};
  final why = <String, List<MapEntry<int, String>>>{};
  for (final st in plan) {
    final ans = a[st.q];
    if (ans < 0) continue;
    final opts = questions[st.q]['o'] as List;
    final qMax = <String, int>{};
    for (final k in st.opts) {
      (opts[k]['w'] as Map).forEach((z, v) {
        qMax[z as String] = max(qMax[z] ?? 0, v as int);
      });
    }
    qMax.forEach((z, v) => best[z] = (best[z] ?? 0) + v);
    (opts[ans]['w'] as Map).forEach((z, v) {
      final key = z as String;
      final w = v as int;
      score[key] = (score[key] ?? 0) + w;
      (why[key] ??= []).add(MapEntry<int, String>(w, opts[ans]['t'] as String));
    });
  }
  List<String> reasonsFor(String id) {
    final l = [...?why[id]]..sort((x, y) => y.key.compareTo(x.key));
    return [for (final e in l) if (e.key >= 2) e.value].take(3).toList();
  }
  final all = [
    for (final f in faculties)
      if (group == null || groups[group]!.contains(f['id']))
        Match(
        f,
        (best[f['id']] ?? 0) == 0 ? 0 : (100 * (score[f['id']] ?? 0) / best[f['id']]!).round(),
        score[f['id']] ?? 0,
        reasonsFor(f['id'] as String),
      ),
  ]..sort((x, y) {
      final p = y.percent.compareTo(x.percent);
      return p != 0 ? p : y.score.compareTo(x.score);
    });
  return all; // dhammaan, la kala horreeyey (top 3 = take(3))
}

// ---------------------------------------------------------------- Widgets
/// Sawirka kulliyadda. Haddii faylka `assets/faculties/<id>.jpg` jiro waa la tusayaa,
/// haddii kale waxaa soo baxaya naqshad gradient + icon ah.
class FacultyBanner extends StatelessWidget {
  const FacultyBanner({
    super.key,
    required this.f,
    required this.height,
    this.badge,
    this.label = false,
  });

  final Map<String, dynamic> f;
  final double height;
  final String? badge;
  final bool label;

  @override
  Widget build(BuildContext context) {
    final c = Color(f['color'] as int);
    final dark = Color.lerp(c, Colors.black, .45)!;
    final fallback = Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [c, dark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(children: [
        const Positioned(right: -30, top: -30, child: CircleAvatar(radius: 70, backgroundColor: Colors.white12)),
        const Positioned(left: -40, bottom: -50, child: CircleAvatar(radius: 60, backgroundColor: Colors.white10)),
        Center(child: Icon(facultyIcons[f['id']], size: height * .45, color: Colors.white.withValues(alpha: .92))),
      ]),
    );
    return SizedBox(
      height: height,
      width: double.infinity,
      child: Stack(fit: StackFit.expand, children: [
        Image.asset('assets/faculties/${f['id']}.jpg', fit: BoxFit.cover, errorBuilder: (_, __, ___) => fallback),
        const DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.transparent, Colors.black54],
              begin: Alignment.center,
              end: Alignment.bottomCenter,
            ),
          ),
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
          Positioned(
            left: 12,
            bottom: 10,
            child: Text(f['short'] as String, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          ),
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
        decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(99)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: 16, color: Colors.white),
          const SizedBox(width: 6),
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 13)),
        ]),
      );
}

class _Footer extends StatelessWidget {
  const _Footer();

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
        child: Text(
          '© 2026 $appOwner. Xuquuqdu way dhowrsan tahay.\nMa ahan in la koobiyeeyo, la beddelo ama la iibiyo ogolaansho la’aan.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodySmall,
        ),
      );
}

// ---------------------------------------------------------------- Welcome
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Scaffold(
      body: ListView(padding: EdgeInsets.zero, children: [
        Container(
          padding: EdgeInsets.fromLTRB(24, MediaQuery.of(context).padding.top + 40, 24, 32),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: const [Color(0xFF14213D), Color(0xFF2A4BA0)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(32)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Icon(Icons.school_rounded, color: Colors.white, size: 44),
              _ThemeToggle(color: Colors.white),
            ]),
            const SizedBox(height: 16),
            Text('Hagaha Kulliyadda', style: t.headlineLarge?.copyWith(color: Colors.white, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Text(
              'Ma ku wareersan tahay kulliyadda aad dooran lahayd? Ka jawaab su’aalaha, oo hel 3-da kulliyadood ee kuugu habboon.',
              style: t.bodyLarge?.copyWith(color: Colors.white70, height: 1.4),
            ),
            const SizedBox(height: 20),
            const Wrap(spacing: 8, runSpacing: 8, children: [
              _Pill(Icons.quiz_outlined, '12 su’aalood'),
              _Pill(Icons.timer_outlined, '≈ 3 daqiiqo'),
              _Pill(Icons.emoji_events_outlined, 'Top 3 + boqolkiiba'),
            ]),
          ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 10),
          child: Text('12-ka kulliyadood', style: t.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
        ),
        SizedBox(
          height: 110,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            itemCount: faculties.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (_, i) => ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: SizedBox(width: 150, child: FacultyBanner(f: faculties[i], height: 110, label: true)),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(24),
          child: FilledButton.icon(
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(56),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const QuizScreen())),
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text('Bilow imtixaanka', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
          ),
        ),
        const _Footer(),
      ]),
    );
  }
}

// ---------------------------------------------------------------- Quiz
class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _s = 0;
  bool _busy = false;
  List<Step> _plan = buildPlan(-1);
  final List<int> _a = List.filled(questions.length, -1);

  Step get _step => _plan[_s];

  /// k = tusmada doorashada; -1 = ka bood.
  void _answer(int k) {
    if (_busy) return;
    setState(() {
      _a[_step.q] = k;
      _busy = true;
      if (_step.q == 0) _plan = buildPlan(k); // su'aalaha xiga ayaa la habeeyay
    });
    Future.delayed(const Duration(milliseconds: 280), () {
      if (!mounted) return;
      if (_s < _plan.length - 1) {
        setState(() {
          _s++;
          _busy = false;
        });
      } else {
        final answered = _plan.where((st) => _a[st.q] >= 0).length;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => ResultScreen(
              matches: computeMatches(_plan, _a, groupOf(_a[0])),
              answered: answered,
              total: _plan.length,
            ),
          ),
        );
      }
    });
  }

  void _back() {
    if (_s > 0 && !_busy) setState(() => _s--);
  }

  @override
  Widget build(BuildContext context) {
    final st = _step;
    final q = questions[st.q];
    final opts = q['o'] as List;
    final t = Theme.of(context).textTheme;
    final narrowed = _s > 0 && _a[0] >= 0;
    return PopScope(
      canPop: _s == 0,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _back();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Hagaha Kulliyadda'),
          backgroundColor: Colors.transparent,
          actions: const [_ThemeToggle()],
        ),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(
                'Su’aal ${_s + 1} / ${_plan.length}${narrowed ? '  ·  lagu habeeyay doorashadaada' : ''}',
                style: t.bodyMedium,
              ),
              const SizedBox(height: 8),
              TweenAnimationBuilder<double>(
                tween: Tween<double>(end: (_s + 1) / _plan.length),
                duration: const Duration(milliseconds: 300),
                builder: (_, v, __) => ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(value: v, minHeight: 8),
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  child: SingleChildScrollView(
                    key: ValueKey(_s),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(q['q'] as String, style: t.titleLarge?.copyWith(fontWeight: FontWeight.w800, height: 1.3)),
                      const SizedBox(height: 20),
                      for (var j = 0; j < st.opts.length; j++)
                        _OptionTile(
                          letter: 'ABCDE'[j],
                          text: opts[st.opts[j]]['t'] as String,
                          selected: _a[st.q] == st.opts[j],
                          onTap: () => _answer(st.opts[j]),
                        ),
                      Center(
                        child: TextButton.icon(
                          onPressed: () => _answer(-1),
                          icon: const Icon(Icons.skip_next_rounded),
                          label: const Text('Midna ma habboona: ka bood'),
                        ),
                      ),
                    ]),
                  ),
                ),
              ),
              if (_s > 0)
                Align(
                  alignment: Alignment.centerLeft,
                  child: TextButton.icon(
                    onPressed: _back,
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('Su’aashii hore'),
                  ),
                ),
            ]),
          ),
        ),
      ),
    );
  }
}

class _OptionTile extends StatelessWidget {
  const _OptionTile({required this.letter, required this.text, required this.selected, required this.onTap});
  final String letter;
  final String text;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Material(
        color: selected ? cs.primaryContainer : cs.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: selected ? cs.primary : cs.outlineVariant, width: selected ? 1.8 : 1.2),
            ),
            child: Row(children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: selected ? cs.primary : cs.surfaceContainerHighest,
                foregroundColor: selected ? cs.onPrimary : cs.onSurface,
                child: Text(letter, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text(text, style: const TextStyle(fontSize: 15.5, height: 1.3))),
            ]),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------- Result
class ResultScreen extends StatelessWidget {
  const ResultScreen({super.key, required this.matches, required this.answered, required this.total});
  final List<Match> matches;
  final int answered;
  final int total;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final top = matches.take(3).toList();
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.fromLTRB(16, MediaQuery.of(context).padding.top + 8, 16, 32),
        children: [
          const Align(alignment: Alignment.centerRight, child: _ThemeToggle()),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Natiijadaada 🎯', style: t.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
              const SizedBox(height: 4),
              Text('3-da kulliyadood ee kuugu habboon', style: t.bodyMedium),
            ]),
          ),
          if (answered < 4)
            Card(
              color: Theme.of(context).colorScheme.errorContainer,
              margin: const EdgeInsets.only(top: 12),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Text(
                  '⚠️ Waxaad ka jawaabtay $answered / $total su’aalood oo kaliya, sidaas darteed natiijadu kuma kalsoona tahay. Dib u bilow oo ka jawaab ugu yaraan 5 su’aalood.',
                ),
              ),
            ),
          const SizedBox(height: 8),
          for (var i = 0; i < top.length; i++) _ResultCard(rank: i + 1, m: top[i]),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              'Boqolkiiba waa hage, ma aha go’aan. La hadal macallimiin, ardayda kulliyadda jirta iyo qoyskaaga ka hor intaadan dooran.',
              style: t.bodySmall,
            ),
          ),
          const SizedBox(height: 16),
          const _NextSteps(),
          const SizedBox(height: 12),
          FilledButton.icon(
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CompareScreen(matches: matches))),
            icon: const Icon(Icons.compare_arrows_rounded),
            label: const Text('Isbarbar dhig kulliyadaha'),
          ),
          const SizedBox(height: 12),
          FilledButton.tonalIcon(
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: () {
              final text = 'Natiijadayda Hagaha Kulliyadda:\n' +
                  [for (final m in top) '${m.percent}% - ${m.f['so']}'].join('\n');
              Clipboard.setData(ClipboardData(text: text));
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Natiijada waa la koobiyeeyay ✅')));
            },
            icon: const Icon(Icons.copy_rounded),
            label: const Text('Koobiyee natiijada'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: () => Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const WelcomeScreen()),
              (_) => false,
            ),
            icon: const Icon(Icons.replay_rounded),
            label: const Text('Dib u bilow'),
          ),
          const _Footer(),
        ],
      ),
    );
  }
}

class _ResultCard extends StatelessWidget {
  const _ResultCard({required this.rank, required this.m});
  final int rank;
  final Match m;

  @override
  Widget build(BuildContext context) {
    final f = m.f;
    final c = Color(f['color'] as int);
    final t = Theme.of(context).textTheme;
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.only(top: 16),
      elevation: rank == 1 ? 4 : 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        FacultyBanner(
          f: f,
          height: rank == 1 ? 190 : 140,
          badge: rank == 1 ? '🏆 Ku habboonaanta ugu sarreysa' : '#$rank',
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(f['so'] as String, style: t.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
                  Text(f['en'] as String, style: t.bodySmall),
                ]),
              ),
              Text('${m.percent}%', style: t.headlineMedium?.copyWith(color: c, fontWeight: FontWeight.w800)),
            ]),
            const SizedBox(height: 12),
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0, end: m.percent / 100),
              duration: Duration(milliseconds: 800 + rank * 200),
              curve: Curves.easeOutCubic,
              builder: (_, v, __) => ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: v,
                  minHeight: 10,
                  color: c,
                  backgroundColor: c.withValues(alpha: .15),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(f['desc'] as String, style: t.bodyMedium?.copyWith(height: 1.4)),
            if (m.reasons.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text('🔍 Sababta natiijada', style: t.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: 2),
              Text('Waxaad dooratay:', style: t.bodySmall),
              for (final r in m.reasons)
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text('“$r”', style: t.bodyMedium?.copyWith(fontStyle: FontStyle.italic, height: 1.35)),
                ),
            ],
            const SizedBox(height: 14),
            Text('Waaxyada', style: t.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 6),
            Wrap(spacing: 6, runSpacing: 6, children: [
              for (final d in f['depts'] as List)
                Chip(
                  label: Text(d as String, style: const TextStyle(fontSize: 12.5)),
                  visualDensity: VisualDensity.compact,
                  backgroundColor: c.withValues(alpha: .12),
                  side: BorderSide.none,
                ),
            ]),
            const SizedBox(height: 12),
            Text('Shaqooyin laga helo', style: t.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            Text((f['jobs'] as List).join(' · '), style: t.bodyMedium),
            const SizedBox(height: 12),
            Text('💡 Talooyin', style: t.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            for (final tip in f['tips'] as List)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('•  ', style: TextStyle(color: c, fontWeight: FontWeight.w800)),
                  Expanded(child: Text(tip as String, style: t.bodyMedium?.copyWith(height: 1.35))),
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
      'La hadal ardayda hadda ku jirta kulliyadda 1-2-da ugu sarreysa.',
      'U tag ama wac xafiiska diiwaangelinta: weydii shuruudaha, khidmadda iyo waqtiga imtixaanka.',
      'Isbarbar dhig labada kulliyadood ee ugu sarreeya: waxbarasho, shaqo, iyo kharash.',
      'Hal usbuuc sug ka hor go’aanka kama dambeysta ah, oo la tasho qoyskaaga.',
    ];
    final t = Theme.of(context).textTheme;
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('🧭 Talaabooyinka xiga', style: t.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          for (var i = 0; i < steps.length; i++)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                CircleAvatar(radius: 11, child: Text('${i + 1}', style: const TextStyle(fontSize: 12))),
                const SizedBox(width: 10),
                Expanded(child: Text(steps[i], style: t.bodyMedium?.copyWith(height: 1.35))),
              ]),
            ),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- Compare
class CompareScreen extends StatefulWidget {
  const CompareScreen({super.key, required this.matches});
  final List<Match> matches;

  @override
  State<CompareScreen> createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  late String _a = widget.matches[0].f['id'] as String;
  late String _b = widget.matches[1].f['id'] as String;

  Map<String, dynamic> _f(String id) => faculties.firstWhere((f) => f['id'] == id);

  String _pct(String id) {
    final i = widget.matches.indexWhere((m) => m.f['id'] == id);
    return i < 0 ? '—' : '${widget.matches[i].percent}%';
  }

  Widget _drop(String value, ValueChanged<String> on) => DropdownButtonFormField<String>(
        value: value,
        isExpanded: true,
        decoration: const InputDecoration(border: OutlineInputBorder(), isDense: true),
        items: [
          for (final f in faculties)
            DropdownMenuItem(value: f['id'] as String, child: Text(f['short'] as String)),
        ],
        onChanged: (v) => on(v!),
      );

  Widget _pair(String title, Widget Function(Map<String, dynamic>) cell) => Column(children: [
        Padding(
          padding: const EdgeInsets.only(top: 18, bottom: 6),
          child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
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
      appBar: AppBar(title: const Text('⚖️ Isbarbar-dhig'), actions: const [_ThemeToggle()]),
      body: ListView(padding: const EdgeInsets.fromLTRB(16, 8, 16, 32), children: [
        Row(children: [
          Expanded(child: _drop(_a, (v) => setState(() => _a = v))),
          const SizedBox(width: 12),
          Expanded(child: _drop(_b, (v) => setState(() => _b = v))),
        ]),
        const SizedBox(height: 14),
        _pair('', (f) => ClipRRect(borderRadius: BorderRadius.circular(16), child: FacultyBanner(f: f, height: 100, label: true))),
        _pair('Ku habboonaanta', (f) => Text(_pct(f['id'] as String), style: t.headlineSmall?.copyWith(color: Color(f['color'] as int), fontWeight: FontWeight.w800))),
        _pair('Magaca', (f) => Text(f['so'] as String, style: t.bodyMedium?.copyWith(fontWeight: FontWeight.w600))),
        _pair('Sharaxaad', (f) => Text(f['desc'] as String, style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('Waaxyada', (f) => Text('${(f['depts'] as List).length} waax: ${(f['depts'] as List).join(', ')}', style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('Shaqooyin', (f) => Text((f['jobs'] as List).join(' · '), style: t.bodySmall?.copyWith(height: 1.4))),
        _pair('💡 Talo koowaad', (f) => Text((f['tips'] as List).first as String, style: t.bodySmall?.copyWith(height: 1.4))),
        const SizedBox(height: 16),
        Text('Boqolkiiba "—" waxay la micno tahay in kulliyaddu aanay ku jirin kooxda doorashadaada.', style: t.bodySmall),
        const _Footer(),
      ]),
    );
  }
}
