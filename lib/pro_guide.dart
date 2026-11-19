import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'data.dart';
import 'i18n.dart';
import 'modern_ui.dart';
import 'prefs.dart';
import 'pro_api.dart';
import 'pro_data.dart';
import 'pro_paywall.dart';
import 'results_api.dart' show backendEnabled;
import 'share_card.dart' show plainFacultyName;

const _navy = Color(0xFF050A1E);
const _gold = Color(0xFFFFC93C);
const _goldSoft = Color(0xFFFFD86B);

typedef FacultyIconBuilder = Widget Function(Map<String, dynamic> faculty, double size);

/// Kulliyad ka mid ah saddexda ugu sarreeya (loo isticmaalo doorashada Pro).
class ProFacultyRef {
  const ProFacultyRef({required this.f, required this.percent});
  final Map<String, dynamic> f;
  final int percent;
}

TextStyle _s(double size, {FontWeight w = FontWeight.w500, Color c = Colors.white, double h = 1.3, double ls = 0, bool head = false}) {
  final ar = currentLang == 'ar';
  final base = TextStyle(fontSize: size, fontWeight: w, color: c, height: h, letterSpacing: ar ? 0 : ls);
  if (ar) return GoogleFonts.cairo(textStyle: base);
  return head ? GoogleFonts.outfit(textStyle: base) : GoogleFonts.plusJakartaSans(textStyle: base);
}

String _traitLabel(String k) {
  final l = proTraitLabels[k];
  if (l == null) return k;
  return l[currentLang == 'so' ? 0 : (currentLang == 'en' ? 1 : 2)];
}

// ---------------------------------------------------------------- Xisaabinta waaxaha
class DeptScore {
  const DeptScore(this.d, this.pct, this.why);
  final Map<String, dynamic> d;
  final int pct;
  final List<String> why;
}

/// Sifooyinka ardayga (celcelis 1-5) ee jawaabihii hore iyo kuwa cusub.
Map<String, double> traitsFrom(List<int> ratings, Map<int, int> extra) {
  final sum = <String, double>{};
  final cnt = <String, int>{};
  void add(int i, int v) {
    if (v <= 0 || items[i]['type'] == 'sc') return;
    final k = items[i]['k'] as String;
    sum[k] = (sum[k] ?? 0) + v;
    cnt[k] = (cnt[k] ?? 0) + 1;
  }

  for (var i = 0; i < items.length && i < ratings.length; i++) {
    add(i, ratings[i]);
  }
  extra.forEach(add);
  return {for (final k in sum.keys) k: sum[k]! / cnt[k]!};
}

/// Waaxaha kulliyadda oo loo kala saaray ku habboonaanta. Haddii sifooyin badan aan la aqoon, natiijadu waxay u dhowaataa 50% (kalsooni yar).
List<DeptScore> rankDepts(List<Map<String, dynamic>> depts, Map<String, double> raw) {
  final out = <DeptScore>[];
  for (final d in depts) {
    final p = Map<String, dynamic>.from(d['p'] as Map);
    var acc = 0.0;
    var ws = 0.0;
    var tot = 0.0;
    var pen = 0;
    final contrib = <MapEntry<double, String>>[];
    p.forEach((k, wv) {
      final w = (wv as num).toDouble();
      tot += w;
      final v = raw[k];
      if (v == null) return;
      final u = (v - 1) / 4;
      acc += w * u;
      ws += w;
      if (w >= 3 && v <= 2) pen++;
      if (u >= 0.6) contrib.add(MapEntry(w * u, k));
    });
    var fit = ws == 0 ? 0.5 : acc / ws;
    fit *= math.max(0.7, 1 - 0.06 * pen);
    final cov = tot == 0 ? 0.0 : ws / tot;
    fit = 0.5 + (fit - 0.5) * (0.4 + 0.6 * math.min(1.0, cov / 0.7));
    contrib.sort((a, b) => b.key.compareTo(a.key));
    final pct = math.min(98, math.max(20, (fit * 100).round()));
    out.add(DeptScore(d, pct, [for (final e in contrib.take(3)) e.value]));
  }
  out.sort((a, b) => b.pct.compareTo(a.pct));
  return out;
}

/// Su'aalaha (likert) aan hore loo weydiin ee kala saara waaxaha kulliyadda: ugu badnaan 6.
List<int> refineItems(List<Map<String, dynamic>> depts, List<int> ratings) {
  final ds = [for (final d in depts) Map<String, dynamic>.from(d['p'] as Map)];
  final keys = <String>{for (final p in ds) ...p.keys};
  final spread = <String, double>{};
  for (final k in keys) {
    final ws = [for (final p in ds) ((p[k] as num?) ?? 0).toDouble()];
    spread[k] = ws.reduce(math.max) - ws.reduce(math.min);
  }
  final cand = <MapEntry<double, int>>[];
  for (var i = 0; i < items.length; i++) {
    final it = items[i];
    if (it['type'] != 'l') continue;
    if (i < ratings.length && ratings[i] > 0) continue;
    final sp = spread[it['k'] as String] ?? 0;
    if (sp < 2) continue;
    cand.add(MapEntry(sp, i));
  }
  cand.sort((a, b) => b.key.compareTo(a.key));
  final seen = <String>{};
  final out = <int>[];
  for (final e in cand) {
    if (seen.add(items[e.value]['k'] as String)) out.add(e.value);
    if (out.length == 6) break;
  }
  return out;
}

// ---------------------------------------------------------------- Qaybo yar
class ProBadge extends StatelessWidget {
  const ProBadge({super.key, this.small = false});
  final bool small;

  @override
  Widget build(BuildContext context) => Container(
        padding: EdgeInsets.symmetric(horizontal: small ? 8 : 10, vertical: small ? 3 : 4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(99),
          gradient: const LinearGradient(colors: [Color(0xFFFFE28F), _gold, Color(0xFFFFA927)]),
          boxShadow: [BoxShadow(color: _gold.withValues(alpha: .4), blurRadius: 12)],
        ),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.auto_awesome, size: small ? 11 : 13, color: _navy),
          const SizedBox(width: 4),
          Text('PRO', style: _s(small ? 10 : 11.5, w: FontWeight.w900, c: _navy, ls: 1.2, h: 1.1)),
        ]),
      );
}

class _Rise extends StatelessWidget {
  const _Rise({required this.child, this.delay = 0});
  final Widget child;
  final int delay;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    final total = delay + 650;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: Duration(milliseconds: total),
      curve: Interval(delay / total, 1, curve: Curves.easeOutCubic),
      builder: (context, v, c) => Opacity(opacity: v.clamp(0.0, 1.0), child: Transform.translate(offset: Offset(0, (1 - v) * 22), child: c)),
      child: child,
    );
  }
}

class _GoldBorder extends CustomPainter {
  const _GoldBorder(this.angle);
  final double angle;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final rr = RRect.fromRectAndRadius(rect.deflate(1), const Radius.circular(24));
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8
      ..shader = SweepGradient(
        colors: const [Color(0x00FFC93C), Color(0xFFFFE08A), Color(0x00FFC93C), Color(0x66FFC93C), Color(0x00FFC93C)],
        stops: const [0.0, 0.2, 0.45, 0.7, 1.0],
        transform: GradientRotation(angle),
      ).createShader(rect);
    canvas.drawRRect(rr, paint);
  }

  @override
  bool shouldRepaint(covariant _GoldBorder old) => old.angle != angle;
}

class _Ring extends CustomPainter {
  const _Ring(this.v);
  final double v;

  @override
  void paint(Canvas canvas, Size size) {
    const stroke = 8.0;
    final rect = (Offset.zero & size).deflate(stroke / 2);
    canvas.drawArc(
      rect,
      0,
      2 * math.pi,
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke
        ..color = Colors.white.withValues(alpha: .18),
    );
    canvas.drawArc(
      rect,
      -math.pi / 2,
      2 * math.pi * math.min(1.0, math.max(0.0, v)),
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke
        ..strokeCap = StrokeCap.round
        ..shader = SweepGradient(
          startAngle: 0,
          endAngle: 2 * math.pi,
          colors: const [Color(0xFFFFE28F), Color(0xFFFFC93C), Color(0xFFFF9F5B), Color(0xFFFFE28F)],
          transform: const GradientRotation(-math.pi / 2),
        ).createShader(rect),
    );
  }

  @override
  bool shouldRepaint(covariant _Ring old) => old.v != v;
}

BoxDecoration _glass({double radius = 20, double a1 = .12, double a2 = .05, Color? border}) => BoxDecoration(
      borderRadius: BorderRadius.circular(radius),
      gradient: LinearGradient(colors: [Colors.white.withValues(alpha: a1), Colors.white.withValues(alpha: a2)], begin: Alignment.topLeft, end: Alignment.bottomRight),
      border: Border.all(color: border ?? Colors.white.withValues(alpha: .22)),
    );

// ---------------------------------------------------------------- Kaarka gelitaanka (bogga natiijada)
class ProEntryCard extends StatefulWidget {
  const ProEntryCard({super.key, required this.entries, required this.ratings, required this.iconBuilder});
  final List<ProFacultyRef> entries;
  final List<int> ratings;
  final FacultyIconBuilder iconBuilder;

  @override
  State<ProEntryCard> createState() => _ProEntryCardState();
}

class _ProEntryCardState extends State<ProEntryCard> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(seconds: 7))..repeat();
  int _sel = 0;

  @override
  void initState() {
    super.initState();
    // Hubi gelitaanka server-ka (si aamusnaan ah); haddii internet la'aan yahay, xusuusta ayaa la isticmaalaa.
    if (backendEnabled) refreshProStatus().then((_) {}, onError: (Object _) {});
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _openGuide() {
    if (!mounted) return;
    final f = widget.entries[_sel].f;
    Navigator.push(context, MaterialPageRoute<void>(builder: (_) => ProGuideScreen(faculty: f, ratings: widget.ratings, iconBuilder: widget.iconBuilder)));
  }

  void _open() {
    if (proActive.value) {
      _openGuide();
    } else {
      Navigator.push(context, MaterialPageRoute<void>(builder: (_) => ProPaywallScreen(onUnlocked: _openGuide)));
    }
  }

  Widget _feat(IconData icon, String k) => Padding(
        padding: const EdgeInsets.only(top: 8),
        child: Row(children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(color: _gold.withValues(alpha: .16), borderRadius: BorderRadius.circular(9)),
            child: Icon(icon, size: 16, color: _goldSoft),
          ),
          const SizedBox(width: 10),
          Expanded(child: Tr(k, style: _s(13.5, c: Colors.white.withValues(alpha: .9)))),
        ]),
      );

  @override
  Widget build(BuildContext context) {
    final calm = MediaQuery.disableAnimationsOf(context);
    return ValueListenableBuilder<bool>(
      valueListenable: proActive,
      builder: (context, active, _) => AnimatedBuilder(
        animation: _c,
        builder: (context, child) => CustomPaint(foregroundPainter: _GoldBorder(calm ? 0 : _c.value * 2 * math.pi), child: child),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(colors: [_navy, Color(0xFF16276F)], begin: Alignment.topLeft, end: Alignment.bottomRight),
            boxShadow: [BoxShadow(color: _gold.withValues(alpha: .16), blurRadius: 30, offset: const Offset(0, 12))],
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const ProBadge(),
              const Spacer(),
              Icon(active ? Icons.verified_rounded : Icons.lock_rounded, color: _goldSoft),
            ]),
            const SizedBox(height: 12),
            Tr('Hagaha Waaxda', style: _s(24, w: FontWeight.w800, head: true, h: 1.15)),
            const SizedBox(height: 4),
            Tr('Dooro waaxda saxda ah ee kulliyaddaada', style: _s(13.5, c: Colors.white.withValues(alpha: .78), h: 1.4)),
            const SizedBox(height: 14),
            Tr('Ka dooro kulliyadda', style: _s(11.5, w: FontWeight.w700, c: _goldSoft, ls: 1)),
            const SizedBox(height: 8),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (var i = 0; i < widget.entries.length; i++)
                _FacChip(
                  selected: i == _sel,
                  color: Color(widget.entries[i].f['color'] as int),
                  label: plainFacultyName(tx(widget.entries[i].f['name'])),
                  icon: widget.iconBuilder(widget.entries[i].f, 18),
                  onTap: () => setState(() => _sel = i),
                ),
            ]),
            const SizedBox(height: 10),
            _feat(Icons.leaderboard_rounded, 'Kala saar waaxaha ku habboon'),
            _feat(Icons.work_outline_rounded, 'Shaqooyinka waaxda kasta'),
            _feat(Icons.tune_rounded, 'Xoojiso natiijada su’aalo yar'),
            const SizedBox(height: 16),
            ShinyButton(
              label: active ? 'Fur Hagaha Pro' : 'Fur Pro',
              icon: active ? Icons.auto_awesome : Icons.lock_open_rounded,
              onPressed: _open,
            ),
          ]),
        ),
      ),
    );
  }
}

class _FacChip extends StatelessWidget {
  const _FacChip({required this.selected, required this.color, required this.label, required this.icon, required this.onTap});
  final bool selected;
  final Color color;
  final String label;
  final Widget icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          constraints: const BoxConstraints(maxWidth: 260),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(99),
            gradient: selected
                ? LinearGradient(colors: [color.withValues(alpha: .95), color.withValues(alpha: .6)])
                : LinearGradient(colors: [Colors.white.withValues(alpha: .12), Colors.white.withValues(alpha: .05)]),
            border: Border.all(color: selected ? _gold : Colors.white.withValues(alpha: .25), width: selected ? 1.6 : 1),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            icon,
            const SizedBox(width: 6),
            Flexible(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: _s(12.5, w: selected ? FontWeight.w700 : FontWeight.w500))),
          ]),
        ),
      );
}

// ---------------------------------------------------------------- Bogga Pro
class ProGuideScreen extends StatefulWidget {
  const ProGuideScreen({super.key, required this.faculty, required this.ratings, required this.iconBuilder});
  final Map<String, dynamic> faculty;
  final List<int> ratings;
  final FacultyIconBuilder iconBuilder;

  @override
  State<ProGuideScreen> createState() => _ProGuideScreenState();
}

class _ProGuideScreenState extends State<ProGuideScreen> {
  final Map<int, int> _extra = {};
  List<Map<String, dynamic>>? _depts;
  List<int> _ask = const [];
  bool _loading = true;
  String? _err;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _err = null;
    });
    try {
      final d = await fetchProContent(widget.faculty['id'] as String);
      if (!mounted) return;
      if (d.isEmpty) {
        setState(() {
          _loading = false;
          _err = 'empty';
        });
        return;
      }
      setState(() {
        _depts = d;
        _ask = refineItems(d, widget.ratings);
        _loading = false;
      });
    } on ProApiException catch (e) {
      if (!mounted) return;
      if (e.locked) {
        // Gelitaanku wuu dhammaaday ama lama hayo: tus bogga lacag-bixinta, kadibna dib u fur hagaha.
        Prefs.setProUntil(0);
        final nav = Navigator.of(context);
        final faculty = widget.faculty;
        final ratings = widget.ratings;
        final iconBuilder = widget.iconBuilder;
        nav.pushReplacement(MaterialPageRoute<void>(
          builder: (_) => ProPaywallScreen(
            onUnlocked: () => nav.push(MaterialPageRoute<void>(builder: (_) => ProGuideScreen(faculty: faculty, ratings: ratings, iconBuilder: iconBuilder))),
          ),
        ));
        return;
      }
      setState(() {
        _loading = false;
        _err = e.code;
      });
    }
  }

  Widget _shell(Widget body) => Scaffold(
        backgroundColor: _navy,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          scrolledUnderElevation: 0,
          foregroundColor: Colors.white,
          title: Row(mainAxisSize: MainAxisSize.min, children: [Tr('Hagaha Waaxda', style: _s(18, w: FontWeight.w800, head: true)), const SizedBox(width: 8), const ProBadge(small: true)]),
        ),
        body: Container(
          width: double.infinity,
          decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [_navy, Color(0xFF0B1647), Color(0xFF1A1450)])),
          child: body,
        ),
      );

  Widget _errorView() => Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.cloud_off_rounded, color: _goldSoft, size: 40),
            const SizedBox(height: 12),
            Tr('Lama soo qaadi karin. Hubi internetka oo mar kale isku day.', textAlign: TextAlign.center, style: _s(14, c: Colors.white.withValues(alpha: .85), h: 1.45)),
            const SizedBox(height: 16),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: _gold, foregroundColor: _navy),
              onPressed: _load,
              child: Tr('Isku day mar kale', style: _s(14, w: FontWeight.w800, c: _navy)),
            ),
          ]),
        ),
      );

  Widget _chip(String text, {bool gold = false}) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(99),
          color: gold ? _gold.withValues(alpha: .16) : Colors.white.withValues(alpha: .1),
          border: Border.all(color: gold ? _gold.withValues(alpha: .5) : Colors.white.withValues(alpha: .22)),
        ),
        child: Text(text, style: _s(12, w: FontWeight.w600, c: gold ? _goldSoft : Colors.white)),
      );

  Widget _hero(DeptScore s, Color color) {
    final jobs = txl(s.d['jobs']);
    return _Rise(
      delay: 120,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: _glass(radius: 26, a1: .16, a2: .06, border: _gold.withValues(alpha: .6)).copyWith(
          boxShadow: [BoxShadow(color: _gold.withValues(alpha: .18), blurRadius: 28, offset: const Offset(0, 12))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Tr('Waaxda ugu habboon', style: _s(12, w: FontWeight.w700, c: _goldSoft, ls: 1))),
            const Icon(Icons.emoji_events_rounded, color: _gold),
          ]),
          const SizedBox(height: 12),
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            SizedBox(
              width: 92,
              height: 92,
              child: TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: 0, end: s.pct / 100),
                duration: const Duration(milliseconds: 1000),
                curve: Curves.easeOutCubic,
                builder: (context, t, _) => CustomPaint(
                  painter: _Ring(t),
                  child: Center(child: Text('${(t * 100).round()}%', style: _s(22, w: FontWeight.w800, c: _goldSoft, head: true, h: 1.0))),
                ),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(s.d['name'] as String, style: _s(20, w: FontWeight.w800, head: true, h: 1.15)),
                const SizedBox(height: 6),
                Text(tx(s.d['d']), style: _s(13, c: Colors.white.withValues(alpha: .86), h: 1.45)),
              ]),
            ),
          ]),
          if (s.why.isNotEmpty) ...[
            const SizedBox(height: 14),
            Tr('Waxa ay kuugu habboon tahay', style: _s(11.5, w: FontWeight.w700, c: _goldSoft, ls: 1)),
            const SizedBox(height: 8),
            Wrap(spacing: 8, runSpacing: 8, children: [for (final k in s.why) _chip(_traitLabel(k), gold: true)]),
          ],
          const SizedBox(height: 14),
          Tr('Shaqooyin suurtagal ah', style: _s(11.5, w: FontWeight.w700, c: _goldSoft, ls: 1)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [for (final j in jobs) _chip(j)]),
        ]),
      ),
    );
  }

  Widget _row(int rank, DeptScore s) {
    final jobs = txl(s.d['jobs']);
    return _Rise(
      delay: 160 + rank * 60,
      child: Container(
        margin: const EdgeInsets.only(top: 12),
        padding: const EdgeInsets.all(14),
        decoration: _glass(),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(
              width: 26,
              height: 26,
              alignment: Alignment.center,
              decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: .14)),
              child: Text('$rank', style: _s(12, w: FontWeight.w800, h: 1.0)),
            ),
            const SizedBox(width: 10),
            Expanded(child: Text(s.d['name'] as String, style: _s(15, w: FontWeight.w700, head: true, h: 1.2))),
            Text('${s.pct}%', style: _s(15, w: FontWeight.w800, c: _goldSoft, head: true)),
          ]),
          const SizedBox(height: 10),
          TweenAnimationBuilder<double>(
            tween: Tween<double>(begin: 0, end: s.pct / 100),
            duration: const Duration(milliseconds: 900),
            curve: Curves.easeOutCubic,
            builder: (context, t, _) => Container(
              height: 7,
              decoration: BoxDecoration(color: Colors.white.withValues(alpha: .12), borderRadius: BorderRadius.circular(7)),
              child: Align(
                alignment: AlignmentDirectional.centerStart,
                child: FractionallySizedBox(
                  widthFactor: math.min(1.0, math.max(0.0, t)),
                  child: Container(decoration: BoxDecoration(borderRadius: BorderRadius.circular(7), gradient: const LinearGradient(colors: [Color(0xFFFFE28F), _gold, Color(0xFFFF9F5B)]))),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(tx(s.d['d']), style: _s(12.5, c: Colors.white.withValues(alpha: .8), h: 1.45)),
          const SizedBox(height: 10),
          Wrap(spacing: 6, runSpacing: 6, children: [for (final j in jobs.take(3)) _chip(j)]),
        ]),
      ),
    );
  }

  Widget _question(int n, int idx) {
    final it = items[idx];
    final opts = txl(sections[it['s'] as int]['sc']);
    final sel = _extra[idx];
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(14),
      decoration: _glass(border: sel != null ? _gold.withValues(alpha: .55) : null),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            width: 24,
            height: 24,
            alignment: Alignment.center,
            decoration: BoxDecoration(shape: BoxShape.circle, color: sel != null ? _gold : Colors.white.withValues(alpha: .16)),
            child: sel != null ? const Icon(Icons.check_rounded, size: 15, color: _navy) : Text('$n', style: _s(11.5, w: FontWeight.w800, h: 1.0)),
          ),
          const SizedBox(width: 10),
          Expanded(child: Text(tx(it['t']), style: _s(14, w: FontWeight.w600, h: 1.4))),
        ]),
        const SizedBox(height: 10),
        Wrap(spacing: 8, runSpacing: 8, children: [
          for (var i = 0; i < opts.length; i++)
            GestureDetector(
              onTap: () => setState(() => _extra[idx] = i + 1),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(99),
                  color: sel == i + 1 ? _gold : Colors.white.withValues(alpha: .08),
                  border: Border.all(color: sel == i + 1 ? _gold : Colors.white.withValues(alpha: .24)),
                ),
                child: Text(opts[i], style: _s(12.5, w: FontWeight.w600, c: sel == i + 1 ? _navy : Colors.white)),
              ),
            ),
        ]),
      ]),
    );
  }

  @override
  Widget build(BuildContext context) {
    final f = widget.faculty;
    final fid = f['id'] as String;
    final color = Color(f['color'] as int);
    if (_loading) return _shell(const Center(child: CircularProgressIndicator(color: _gold)));
    if (_err != null || _depts == null) return _shell(_errorView());
    final raw = traitsFrom(widget.ratings, _extra);
    final ranked = rankDepts(_depts!, raw);
    return Scaffold(
      backgroundColor: _navy,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        foregroundColor: Colors.white,
        title: Row(mainAxisSize: MainAxisSize.min, children: [Tr('Hagaha Waaxda', style: _s(18, w: FontWeight.w800, head: true)), const SizedBox(width: 8), const ProBadge(small: true)]),
      ),
      body: Container(
        decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [_navy, Color(0xFF0B1647), Color(0xFF1A1450)])),
        child: Stack(children: [
          Positioned(top: -120, right: -100, child: _glow(320, _gold, .16)),
          Positioned(bottom: -140, left: -120, child: _glow(360, const Color(0xFF6A47E0), .35)),
          Align(
            alignment: Alignment.topCenter,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 640),
              child: ListView(padding: const EdgeInsets.fromLTRB(18, 4, 18, 36), children: [
                _Rise(
                  child: Row(children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(shape: BoxShape.circle, gradient: LinearGradient(colors: [color, color.withValues(alpha: .6)]), border: Border.all(color: Colors.white.withValues(alpha: .5))),
                      child: Center(child: widget.iconBuilder(f, 28)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(plainFacultyName(tx(f['name'])), style: _s(18, w: FontWeight.w800, head: true, h: 1.15)),
                        const SizedBox(height: 2),
                        Text(trf('{n} waaxood oo la barbar dhigay', {'n': ranked.length}), style: _s(12.5, c: Colors.white.withValues(alpha: .7))),
                      ]),
                    ),
                  ]),
                ),
                if (fid == 'med')
                  Container(
                    margin: const EdgeInsets.only(top: 14),
                    padding: const EdgeInsets.all(12),
                    decoration: _glass(radius: 16),
                    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Icon(Icons.info_outline_rounded, size: 18, color: _goldSoft),
                      const SizedBox(width: 8),
                      Expanded(child: Tr('Dhakhtarnimada waa waax keliya; kuwan waa waddooyinka takhasuska ee aad dooran karto kadib.', style: _s(12.5, c: Colors.white.withValues(alpha: .85), h: 1.4))),
                    ]),
                  ),
                const SizedBox(height: 16),
                _hero(ranked.first, color),
                if (ranked.length > 1) ...[
                  const SizedBox(height: 22),
                  const AccentTitleLight('Waaxaha loo kala saaray ku habboonaantaada'),
                  for (var i = 1; i < ranked.length; i++) _row(i + 1, ranked[i]),
                ],
                const SizedBox(height: 24),
                if (_ask.isNotEmpty) ...[
                  Row(children: [
                    const Expanded(child: AccentTitleLight('Xoojiso natiijada')),
                    Text('${_extra.length}/${_ask.length}', style: _s(12.5, w: FontWeight.w700, c: _goldSoft)),
                  ]),
                  const SizedBox(height: 6),
                  Tr('Ka jawaab su’aalahan yaryar si natiijada u sii saxnaato.', style: _s(12.5, c: Colors.white.withValues(alpha: .75), h: 1.4)),
                  for (var i = 0; i < _ask.length; i++) _question(i + 1, _ask[i]),
                ] else
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: _glass(radius: 18),
                    child: Row(children: [
                      const Icon(Icons.verified_rounded, color: _goldSoft),
                      const SizedBox(width: 10),
                      Expanded(child: Tr('Natiijadaada waa dhammaystiran tahay; wax su’aalo ah oo dheeraad ah looma baahna.', style: _s(12.5, c: Colors.white.withValues(alpha: .85), h: 1.4))),
                    ]),
                  ),
                const SizedBox(height: 22),
                Tr('Waa hage, ma aha go’aan kama dambays ah. La tasho macallimiin ama arday jaamacad.', textAlign: TextAlign.center, style: _s(12, c: Colors.white.withValues(alpha: .6), h: 1.45)),
              ]),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _glow(double size, Color c, double a) => IgnorePointer(
        child: Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [c.withValues(alpha: a), c.withValues(alpha: 0)]))),
      );
}

/// Cinwaan leh xariiq dahab ah, oo loogu talagalay asalka mugdiga ah.
class AccentTitleLight extends StatelessWidget {
  const AccentTitleLight(this.k, {super.key});
  final String k;

  @override
  Widget build(BuildContext context) => Row(children: [
        Container(
          width: 4,
          height: 20,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(4), gradient: const LinearGradient(colors: [Color(0xFFFFD86B), Color(0xFFFF9F5B)], begin: Alignment.topCenter, end: Alignment.bottomCenter)),
        ),
        const SizedBox(width: 10),
        Expanded(child: Tr(k, style: _s(16, w: FontWeight.w700, head: true))),
      ]);
}
