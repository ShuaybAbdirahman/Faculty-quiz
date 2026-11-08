import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'founder_photo.dart';
import 'i18n.dart';

/// Hordhaca aasaasaha waxaa la tusaa hal mar kasta oo app-ka la furo (ka hor su'aalaha).
bool founderIntroSeen = false;

final Uint8List _photoBytes = base64Decode(founderPhotoB64);

const _navy = Color(0xFF0B1533);
const _gold = Color(0xFFFFC93C);
const _goldSoft = Color(0xFFFFD86B);

/// Font casri ah: Outfit (Lataynka) / Cairo (Carabi).
TextStyle _font(double size, {FontWeight w = FontWeight.w500, Color c = Colors.white, double h = 1.4, double ls = 0}) {
  final base = TextStyle(fontSize: size, fontWeight: w, color: c, height: h, letterSpacing: ls);
  return currentLang == 'ar' ? GoogleFonts.cairo(textStyle: base) : GoogleFonts.outfit(textStyle: base);
}

/// Soo-muuqasho jilicsan (fade + kor u soo baxid) oo dib-u-dhigid leh.
class _Rise extends StatelessWidget {
  const _Rise({required this.child, this.delay = 0});
  final Widget child;
  final int delay;

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    final total = delay + 700;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: Duration(milliseconds: total),
      curve: Interval(delay / total, 1, curve: Curves.easeOutCubic),
      builder: (context, v, c) => Opacity(opacity: v.clamp(0.0, 1.0), child: Transform.translate(offset: Offset(0, (1 - v) * 26), child: c)),
      child: child,
    );
  }
}

class FounderIntroScreen extends StatefulWidget {
  const FounderIntroScreen({super.key, required this.onContinue});

  /// Marka ardaygu riixo "Bilow su'aalaha" ama "Ka bood".
  final void Function(BuildContext context) onContinue;

  @override
  State<FounderIntroScreen> createState() => _FounderIntroScreenState();
}

class _FounderIntroScreenState extends State<FounderIntroScreen> with TickerProviderStateMixin {
  late final AnimationController _ring = AnimationController(vsync: this, duration: const Duration(seconds: 7))..repeat();
  late final AnimationController _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat(reverse: true);
  Timer? _typer;
  late String _full;
  int _shown = 0;
  bool _ready = false;

  bool get _done => _shown >= _full.length;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_ready) return;
    _ready = true;
    _full = tr('Asc! Waxaan ahay Shuayb. Arday badan oo dhammeeya dugsiga sare ayaa ku wareersan kulliyadda ay dooran lahaayeen, sidaas darteed waxaan dhisay Hagaha Kulliyadda. Waxay ku weydiinaysaa su’aalo gaagaaban oo ku saabsan waxa aad jeceshahay, waxa aad bartay iyo waxa kuu muhiim ah. Kadib waxay kuu soo bandhigaysaa saddexda kulliyadood ee kuugu habboon, boqolkiiba, sababta, waaxaha iyo shaqooyinka. Waa hage oo kaa caawinaya inaad si cad u fikirto, ma aha go’aan kama dambays ah, la tasho waalidkaa iyo macallimiinta. Guul!');
    if (MediaQuery.disableAnimationsOf(context)) {
      _shown = _full.length;
    } else {
      Future.delayed(const Duration(milliseconds: 1200), () {
        if (!mounted) return;
        _typer = Timer.periodic(const Duration(milliseconds: 14), (t) {
          if (!mounted) {
            t.cancel();
            return;
          }
          if (_shown >= _full.length) {
            t.cancel();
            return;
          }
          setState(() => _shown += 1);
        });
      });
    }
  }

  @override
  void dispose() {
    _typer?.cancel();
    _ring.dispose();
    _pulse.dispose();
    super.dispose();
  }



  void _finish() {
    if (_done) return;
    _typer?.cancel();
    setState(() => _shown = _full.length);
  }

  void _go() {
    founderIntroSeen = true;
    widget.onContinue(context);
  }

  Widget _avatar() {
    final calm = MediaQuery.disableAnimationsOf(context);
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: calm ? 1.0 : 0.0, end: 1.0),
      duration: const Duration(milliseconds: 1000),
      curve: Curves.easeOutBack,
      builder: (context, v, child) => Opacity(opacity: v.clamp(0.0, 1.0), child: Transform.scale(scale: 0.6 + 0.4 * v, child: child)),
      child: SizedBox(
        width: 176,
        height: 176,
        child: Stack(alignment: Alignment.center, children: [
          AnimatedBuilder(
            animation: _pulse,
            builder: (context, _) => Container(
              width: 164,
              height: 164,
              decoration: BoxDecoration(shape: BoxShape.circle, boxShadow: [
                BoxShadow(color: _gold.withValues(alpha: .22 + .22 * _pulse.value), blurRadius: 36 + 34 * _pulse.value, spreadRadius: 2),
              ]),
            ),
          ),
          AnimatedBuilder(
            animation: _ring,
            builder: (context, child) => Transform.rotate(angle: _ring.value * 2 * math.pi, child: child),
            child: Container(
              width: 164,
              height: 164,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: SweepGradient(colors: [_gold, Color(0xFFFF7EB6), Color(0xFF7AE7FF), Color(0xFFB79CFF), _gold]),
              ),
            ),
          ),
          Container(width: 152, height: 152, decoration: const BoxDecoration(shape: BoxShape.circle, color: _navy)),
          ClipOval(child: Image.memory(_photoBytes, width: 142, height: 142, fit: BoxFit.cover, gaplessPlayback: true)),
          Positioned(
            right: 8,
            bottom: 10,
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(colors: [_goldSoft, _gold], begin: Alignment.topLeft, end: Alignment.bottomRight),
                border: Border.all(color: _navy, width: 3),
              ),
              child: const Icon(Icons.school_rounded, color: _navy, size: 20),
            ),
          ),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final rtl = Directionality.of(context) == TextDirection.rtl;
    final typedStyle = _font(15.5, c: Colors.white.withValues(alpha: .93), h: 1.5);
    final typed = _full.substring(0, _shown.clamp(0, _full.length));
    return Scaffold(
      backgroundColor: _navy,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF0B1533), Color(0xFF1E3A8A), Color(0xFF5B3FD0)]),
        ),
        child: Stack(children: [
          // iftiin jilicsan oo gadaal ka muuqda
          Positioned(top: -120, right: -100, child: _glow(340, const Color(0xFFFF7EB6), .30)),
          Positioned(bottom: -140, left: -120, child: _glow(380, const Color(0xFF7AE7FF), .22)),
          SafeArea(
            child: Column(children: [
              Expanded(
                child: LayoutBuilder(
              builder: (context, box) => SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: box.maxHeight),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 520),
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(22, 4, 22, 16),
                        child: Column(mainAxisAlignment: MainAxisAlignment.start, children: [
                          Align(
                            alignment: AlignmentDirectional.centerEnd,
                            child: TextButton(
                              onPressed: _go,
                              style: TextButton.styleFrom(foregroundColor: Colors.white.withValues(alpha: .8)),
                              child: Tr('Ka bood', style: _font(15, w: FontWeight.w600, c: Colors.white.withValues(alpha: .85))),
                            ),
                          ),
                          _Rise(
                            child: Tr('Fariin ka timid aasaasaha', style: _font(14, w: FontWeight.w700, c: _goldSoft, ls: 2.4), textAlign: TextAlign.center),
                          ),
                          const SizedBox(height: 12),
                          _avatar(),
                          const SizedBox(height: 12),
                          _Rise(
                            delay: 350,
                            child: Tr('Eng. Shuayb Abdirahman', style: _font(26, w: FontWeight.w800, h: 1.15, ls: -.3), textAlign: TextAlign.center),
                          ),
                          const SizedBox(height: 4),
                          _Rise(
                            delay: 450,
                            child: Tr('Aasaasaha Hagaha Kulliyadda', style: _font(14, w: FontWeight.w600, c: _goldSoft), textAlign: TextAlign.center),
                          ),
                          const SizedBox(height: 18),
                          _Rise(
                            delay: 600,
                            child: GestureDetector(
                              onTap: _finish,
                              child: Container(
                                width: double.infinity,
                                padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: .10),
                                  borderRadius: BorderRadius.circular(26),
                                  border: Border.all(color: Colors.white.withValues(alpha: .24), width: 1.4),
                                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .25), blurRadius: 30, offset: const Offset(0, 14))],
                                ),
                                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  Row(children: [
                                    const Icon(Icons.waving_hand_rounded, color: _goldSoft, size: 24),
                                    const SizedBox(width: 10),
                                    Tr('Soo dhawoow!', style: _font(20, w: FontWeight.w800, c: _goldSoft)),
                                  ]),
                                  const SizedBox(height: 12),
                                  AnimatedBuilder(
                                    animation: _pulse,
                                    builder: (context, _) => Text.rich(
                                      TextSpan(style: typedStyle, children: [
                                        TextSpan(text: typed),
                                        if (!_done)
                                          WidgetSpan(
                                            alignment: PlaceholderAlignment.middle,
                                            child: Container(width: 3, height: 20, margin: const EdgeInsets.symmetric(horizontal: 2), color: _gold.withValues(alpha: .35 + .65 * _pulse.value)),
                                          ),
                                      ]),
                                    ),
                                  ),
                                  if (_done)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 12),
                                      child: Text(tr('Eng. Shuayb Abdirahman').toUpperCase(), style: _font(14.5, w: FontWeight.w800, c: _goldSoft, ls: 1.4)),
                                    ),
                                ]),
                              ),
                            ),
                          ),
                        ]),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
              // Badhanka hoose: had iyo jeer waa muuqdaa
              Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 520),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(22, 4, 22, 18),
                    child: _Rise(
                      delay: 900,
                      child: SizedBox(
                        width: double.infinity,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [BoxShadow(color: _gold.withValues(alpha: .45), blurRadius: 28, offset: const Offset(0, 10))],
                          ),
                          child: FilledButton(
                            style: FilledButton.styleFrom(
                              backgroundColor: _gold,
                              foregroundColor: _navy,
                              minimumSize: const Size.fromHeight(58),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                            onPressed: _go,
                            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                              Tr('Bilow su’aalaha', style: _font(19, w: FontWeight.w800, c: _navy)),
                              const SizedBox(width: 10),
                              Icon(rtl ? Icons.arrow_back_rounded : Icons.arrow_forward_rounded, color: _navy),
                            ]),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ]),
          ),
        ]),
      ),
    );
  }

  Widget _glow(double size, Color c, double a) => IgnorePointer(
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [c.withValues(alpha: a), c.withValues(alpha: 0)])),
        ),
      );
}
