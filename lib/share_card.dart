import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:cross_file/cross_file.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';

import 'i18n.dart';
import 'modern_ui.dart';
import 'qr_data.dart';

/// Hal kulliyad ee kaarka wadaagista.
class ShareEntry {
  const ShareEntry({required this.name, required this.percent, required this.color, required this.icon});
  final String name;
  final int percent;
  final Color color;
  final Widget icon;
}

/// Ka saar erayga hore ("Kulliyadda", "Faculty of", "كلية") si magaca u gaabto.
String plainFacultyName(String full) => full.replaceFirst(RegExp(r'^(Kulliyadda|Faculty of|كلية)\s+'), '');

const _gold = Color(0xFFFFC93C);
const _goldSoft = Color(0xFFFFD86B);

TextStyle _f(double size, {FontWeight w = FontWeight.w500, Color c = Colors.white, double h = 1.25, double ls = 0, bool head = false}) {
  final ar = currentLang == 'ar';
  final base = TextStyle(fontSize: size, fontWeight: w, color: c, height: h, letterSpacing: ar ? 0 : ls);
  if (ar) return GoogleFonts.cairo(textStyle: base);
  return head ? GoogleFonts.outfit(textStyle: base) : GoogleFonts.plusJakartaSans(textStyle: base);
}

Widget _glow(double size, Color c, double a) => IgnorePointer(
      child: Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [c.withValues(alpha: a), c.withValues(alpha: 0)]))),
    );

/// Kaarka natiijada ee la wadaago (naqshad go'an 360x480; waxaa lagu sawiraa 1080px ballac).
/// Ma laha animation si sawirka la qaaday uu had iyo jeer yahay natiijada dhammaystiran.
class ShareCard extends StatelessWidget {
  const ShareCard({super.key, required this.entries, required this.name});
  final List<ShareEntry> entries;
  final String name;

  static const double w = 360;
  static const double h = 480;

  @override
  Widget build(BuildContext context) {
    final top = entries.first;
    final others = entries.skip(1).take(2).toList();
    final title = name.isEmpty ? tr('Natiijadayda') : trf('Natiijada {n}', {'n': name});
    return SizedBox(
      width: w,
      height: h,
      child: Stack(clipBehavior: Clip.hardEdge, children: [
        const Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF070D26), Color(0xFF1B3A9E), Color(0xFF6A47E0)])),
          ),
        ),
        Positioned(top: -110, left: -90, child: _glow(300, const Color(0xFF22D3EE), .34)),
        Positioned(top: 60, right: -130, child: _glow(300, const Color(0xFFFF6AA2), .30)),
        Positioned(bottom: -130, left: 20, child: _glow(280, _gold, .22)),
        const Positioned.fill(child: CustomPaint(painter: _CardDots())),
        Padding(
          padding: const EdgeInsets.fromLTRB(22, 18, 22, 16),
          child: Column(children: [
            Row(children: [
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: .14), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.white.withValues(alpha: .3))),
                child: const Icon(Icons.school_rounded, color: Colors.white, size: 18),
              ),
              const SizedBox(width: 8),
              Expanded(child: Text(tr('Hagaha Kulliyadda').toUpperCase(), maxLines: 1, overflow: TextOverflow.ellipsis, style: _f(11, w: FontWeight.w700, c: Colors.white.withValues(alpha: .9), ls: 2.2))),
            ]),
            const SizedBox(height: 10),
            Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center, style: _f(14, w: FontWeight.w600, c: Colors.white.withValues(alpha: .82))),
            const SizedBox(height: 8),
            SizedBox(
              width: 128,
              height: 118,
              child: Stack(clipBehavior: Clip.none, alignment: Alignment.center, children: [
                SizedBox(width: 118, height: 118, child: CustomPaint(painter: _CardRing(top.percent / 100))),
                Column(mainAxisSize: MainAxisSize.min, children: [
                  Text('${top.percent}%', style: _f(34, w: FontWeight.w800, c: _goldSoft, h: 1.0, head: true)),
                  const SizedBox(height: 2),
                  Text(tr('Ku habboonaan'), style: _f(10.5, w: FontWeight.w600, c: Colors.white.withValues(alpha: .78))),
                ]),
                PositionedDirectional(
                  end: -8,
                  top: -4,
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(colors: [top.color, top.color.withValues(alpha: .65)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                      border: Border.all(color: Colors.white.withValues(alpha: .6), width: 1.5),
                    ),
                    child: Center(child: top.icon),
                  ),
                ),
              ]),
            ),
            const SizedBox(height: 8),
            Text(top.name, maxLines: 2, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center, style: _f(top.name.length > 36 ? 17 : 20, w: FontWeight.w800, h: 1.15, head: true)),
            const SizedBox(height: 4),
            Text(tr('Kulliyadda kugu habboon'), style: _f(11.5, w: FontWeight.w700, c: _goldSoft, ls: 1.1)),
            const SizedBox(height: 10),
            for (var i = 0; i < others.length; i++) ...[
              if (i > 0) const SizedBox(height: 6),
              _OtherRow(rank: i + 2, e: others[i]),
            ],
            const Spacer(),
            Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                  Text(tr('Qaado imtixaanka Hagaha Kulliyadda'), maxLines: 2, overflow: TextOverflow.ellipsis, style: _f(12, w: FontWeight.w700, h: 1.25)),
                  const SizedBox(height: 4),
                  Text(qrDisplayUrl, maxLines: 1, overflow: TextOverflow.ellipsis, style: _f(9.5, w: FontWeight.w500, c: Colors.white.withValues(alpha: .75))),
                ]),
              ),
              const SizedBox(width: 12),
              Container(
                width: 70,
                height: 70,
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                child: const CustomPaint(painter: _QrPainter()),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }
}

class _OtherRow extends StatelessWidget {
  const _OtherRow({required this.rank, required this.e});
  final int rank;
  final ShareEntry e;

  @override
  Widget build(BuildContext context) => Container(
        height: 40,
        padding: const EdgeInsets.symmetric(horizontal: 10),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [Colors.white.withValues(alpha: .18), Colors.white.withValues(alpha: .07)], begin: Alignment.topLeft, end: Alignment.bottomRight),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withValues(alpha: .26)),
        ),
        child: Row(children: [
          Container(
            width: 22,
            height: 22,
            alignment: Alignment.center,
            decoration: BoxDecoration(shape: BoxShape.circle, color: e.color.withValues(alpha: .9)),
            child: Text('$rank', style: _f(11, w: FontWeight.w800, h: 1.0)),
          ),
          const SizedBox(width: 10),
          Expanded(child: Text(e.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: _f(12.5, w: FontWeight.w600))),
          const SizedBox(width: 8),
          Text('${e.percent}%', style: _f(13, w: FontWeight.w800, c: _goldSoft, head: true)),
        ]),
      );
}

class _CardDots extends CustomPainter {
  const _CardDots();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.white.withValues(alpha: .07);
    const gap = 24.0;
    for (double y = gap / 2; y < size.height; y += gap) {
      for (double x = gap / 2; x < size.width; x += gap) {
        canvas.drawCircle(Offset(x, y), 1.2, p);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CardRing extends CustomPainter {
  const _CardRing(this.v);
  final double v;

  @override
  void paint(Canvas canvas, Size size) {
    const stroke = 9.0;
    final rect = (Offset.zero & size).deflate(stroke / 2);
    final track = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..color = Colors.white.withValues(alpha: .2);
    canvas.drawArc(rect, 0, 2 * math.pi, false, track);
    final arc = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..shader = SweepGradient(
        startAngle: 0,
        endAngle: 2 * math.pi,
        colors: const [Color(0xFFFFE28F), Color(0xFFFFC93C), Color(0xFFFF9F5B), Color(0xFFFFE28F)],
        transform: const GradientRotation(-math.pi / 2),
      ).createShader(rect);
    canvas.drawArc(rect, -math.pi / 2, 2 * math.pi * v.clamp(0.0, 1.0), false, arc);
  }

  @override
  bool shouldRepaint(covariant _CardRing old) => old.v != v;
}

/// QR-ka app-ka oo laga sawiray `qrRows` (modulo 1 = madow).
class _QrPainter extends CustomPainter {
  const _QrPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final n = qrRows.length;
    final cell = size.width / n;
    final p = Paint()
      ..color = const Color(0xFF0B1533)
      ..isAntiAlias = false;
    for (var y = 0; y < n; y++) {
      final row = qrRows[y];
      for (var x = 0; x < n; x++) {
        if (row.codeUnitAt(x) == 0x31) canvas.drawRect(Rect.fromLTWH(x * cell, y * cell, cell + 0.4, cell + 0.4), p);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Qaybta wadaagista: kaarka + badhamada "Wadaag" iyo "Soo deji".
class ShareSection extends StatefulWidget {
  const ShareSection({super.key, required this.entries, required this.name});
  final List<ShareEntry> entries;
  final String name;

  @override
  State<ShareSection> createState() => _ShareSectionState();
}

class _ShareSectionState extends State<ShareSection> {
  final GlobalKey _key = GlobalKey();
  bool _busy = false;

  Future<XFile?> _capture() async {
    final obj = _key.currentContext?.findRenderObject();
    if (obj is! RenderRepaintBoundary) return null;
    final ratio = 1080 / obj.size.width;
    final ui.Image img = await obj.toImage(pixelRatio: ratio);
    final ByteData? data = await img.toByteData(format: ui.ImageByteFormat.png);
    if (data == null) return null;
    final Uint8List bytes = data.buffer.asUint8List();
    return XFile.fromData(bytes, mimeType: 'image/png', name: 'hagaha-kulliyadda-natiijo.png');
  }

  void _snack(String k) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(tr(k))));
  }

  Future<void> _download(XFile f) async {
    try {
      await f.saveTo('hagaha-kulliyadda-natiijo.png');
      _snack('Sawirka waa la soo dejiyay');
    } catch (_) {
      _snack('Lama wadaagi karin. Mar kale isku day.');
    }
  }

  Future<void> _run(bool share) async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      final f = await _capture();
      if (f == null) {
        _snack('Lama wadaagi karin. Mar kale isku day.');
        return;
      }
      if (!share) {
        await _download(f);
        return;
      }
      final top = widget.entries.first;
      final text = trf('Natiijadayda ee Hagaha Kulliyadda: {f} ({p}%). Tijaabi adigu: {url}', {'f': top.name, 'p': top.percent, 'url': qrUrl});
      try {
        await Share.shareXFiles([f], text: text, subject: tr('Hagaha Kulliyadda'));
      } catch (_) {
        await _download(f);
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          boxShadow: [BoxShadow(color: const Color(0xFF6A47E0).withValues(alpha: .35), blurRadius: 28, offset: const Offset(0, 14))],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(26),
          child: AspectRatio(
            aspectRatio: ShareCard.w / ShareCard.h,
            child: RepaintBoundary(
              key: _key,
              child: FittedBox(fit: BoxFit.contain, child: ShareCard(entries: widget.entries, name: widget.name)),
            ),
          ),
        ),
      ),
      const SizedBox(height: 14),
      Opacity(
        opacity: _busy ? .6 : 1,
        child: ShinyButton(label: 'Wadaag natiijada', icon: Icons.ios_share_rounded, showArrow: false, onPressed: () => _run(true)),
      ),
      const SizedBox(height: 10),
      FilledButton.tonalIcon(
        style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(50), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
        onPressed: _busy ? null : () => _run(false),
        icon: const Icon(Icons.download_rounded),
        label: const Tr('Soo deji sawirka'),
      ),
    ]);
  }
}
