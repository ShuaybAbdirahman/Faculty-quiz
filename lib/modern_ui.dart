import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'i18n.dart';

/// Aurora: iftiin midabbo leh oo si tartiib ah u dhaqaaqa, oo leh dhibco jilicsan.
/// `t` waa animation 0..1 (tusaale `AnimationController` oo is-celinaya).
class AuroraBackground extends StatelessWidget {
  const AuroraBackground({super.key, required this.t});
  final Animation<double> t;

  @override
  Widget build(BuildContext context) {
    final calm = MediaQuery.disableAnimationsOf(context);
    return IgnorePointer(
      child: RepaintBoundary(
        child: LayoutBuilder(
          builder: (context, box) {
            final w = box.maxWidth.isFinite ? box.maxWidth : 400.0;

            Widget blob(Color color, double size, double phase, Alignment base, double dx, double dy) => AnimatedBuilder(
                  animation: t,
                  builder: (context, _) {
                    final a = t.value * 2 * math.pi;
                    final x = calm ? 0.0 : math.sin(a + phase);
                    final y = calm ? 0.0 : math.cos(a * .8 + phase);
                    return Align(
                      alignment: Alignment(base.x + dx * x, base.y + dy * y),
                      child: Container(
                        width: size,
                        height: size,
                        decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [color, color.withValues(alpha: 0)])),
                      ),
                    );
                  },
                );

            return Stack(fit: StackFit.expand, children: [
              blob(const Color(0x5222D3EE), w * 1.05, 0.0, const Alignment(-1.0, -0.8), .30, .18),
              blob(const Color(0x4AFF6AA2), w * 1.0, 2.1, const Alignment(1.1, -0.2), .25, .25),
              blob(const Color(0x33FFC93C), w * .8, 4.2, const Alignment(0.2, 1.1), .35, .12),
              CustomPaint(painter: _DotsPainter()),
            ]);
          },
        ),
      ),
    );
  }
}

class _DotsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.white.withValues(alpha: .08);
    const gap = 26.0;
    for (double y = gap / 2; y < size.height; y += gap) {
      for (double x = gap / 2; x < size.width; x += gap) {
        canvas.drawCircle(Offset(x, y), 1.3, p);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Badhanka ugu weyn: dahab, iftiin dul maraya (shimmer), iftiin garaacaya iyo dareen riixid.
class ShinyButton extends StatefulWidget {
  const ShinyButton({super.key, required this.label, required this.onPressed, this.icon = Icons.play_arrow_rounded, this.showArrow = true});
  final String label;
  final VoidCallback onPressed;
  final IconData icon;
  final bool showArrow;

  @override
  State<ShinyButton> createState() => _ShinyButtonState();
}

class _ShinyButtonState extends State<ShinyButton> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 2800))..repeat();
  bool _down = false;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final calm = MediaQuery.disableAnimationsOf(context);
    const navy = Color(0xFF0B1533);
    final rtl = Directionality.of(context) == TextDirection.rtl;
    return Semantics(
      button: true,
      label: tr(widget.label),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTapDown: (_) => setState(() => _down = true),
        onTapCancel: () => setState(() => _down = false),
        onTapUp: (_) => setState(() => _down = false),
        onTap: widget.onPressed,
        child: AnimatedScale(
          scale: _down ? 0.97 : 1.0,
          duration: const Duration(milliseconds: 120),
          child: AnimatedBuilder(
            animation: _c,
            builder: (context, _) {
              final pulse = calm ? 0.0 : (0.5 + 0.5 * math.sin(_c.value * 2 * math.pi));
              final sweep = calm ? -2.0 : (-1.5 + 3.0 * (_c.value / 0.55).clamp(0.0, 1.0));
              final nudge = calm ? 0.0 : 4.0 * math.sin(_c.value * 2 * math.pi);
              return Container(
                height: 62,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: const LinearGradient(colors: [Color(0xFFFFE28F), Color(0xFFFFC93C), Color(0xFFFFA927)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                  boxShadow: [BoxShadow(color: const Color(0xFFFFC93C).withValues(alpha: .30 + .22 * pulse), blurRadius: 26 + 10 * pulse, offset: const Offset(0, 10))],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Stack(alignment: Alignment.center, children: [
                    Positioned.fill(
                      child: Align(
                        alignment: Alignment(sweep, 0),
                        child: Transform.rotate(
                          angle: -0.45,
                          child: Container(
                            width: 70,
                            height: 140,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(colors: [Colors.white.withValues(alpha: 0), Colors.white.withValues(alpha: .55), Colors.white.withValues(alpha: 0)]),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(widget.icon, color: navy, size: 28),
                      const SizedBox(width: 8),
                      Tr(widget.label, style: Theme.of(context).textTheme.titleMedium?.copyWith(color: navy, fontSize: 19, fontWeight: FontWeight.w800)),
                      if (widget.showArrow) ...[
                        const SizedBox(width: 10),
                        Transform.translate(offset: Offset(rtl ? -nudge : nudge, 0), child: Icon(rtl ? Icons.arrow_back_rounded : Icons.arrow_forward_rounded, color: navy, size: 22)),
                      ],
                    ]),
                  ]),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

/// Cinwaan qayb leh xariiq yar oo dahab ah.
class AccentTitle extends StatelessWidget {
  const AccentTitle(this.k, {super.key});
  final String k;

  @override
  Widget build(BuildContext context) => Row(children: [
        Container(
          width: 4,
          height: 20,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(4), gradient: const LinearGradient(colors: [Color(0xFFFFD86B), Color(0xFFFF9F5B)], begin: Alignment.topCenter, end: Alignment.bottomCenter)),
        ),
        const SizedBox(width: 10),
        Expanded(child: Tr(k, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
      ]);
}
