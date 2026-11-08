import 'package:flutter/material.dart';
import 'i18n.dart';
import 'results_api.dart';

/// Kaarka ogolaanshaha: ardaygu wuxuu go'aansadaa in natiijadiisa (magac la'aan) la diiwaangeliyo.
/// Waxaa la diraa kaliya marka sanduuqa la calaamadeeyo.
class SaveResultCard extends StatefulWidget {
  const SaveResultCard({super.key, required this.ids, required this.pcts});
  final List<String> ids;
  final List<int> pcts;

  @override
  State<SaveResultCard> createState() => _SaveResultCardState();
}

enum _Phase { idle, sending, done, error }

class _SaveResultCardState extends State<SaveResultCard> {
  bool _agree = false;
  _Phase _phase = _Phase.idle;

  Future<void> _send() async {
    setState(() => _phase = _Phase.sending);
    final ok = await submitResult(lang: currentLang, ids: widget.ids, pcts: widget.pcts);
    if (!mounted) return;
    setState(() => _phase = ok ? _Phase.done : _Phase.error);
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final cs = t.colorScheme;
    final sending = _phase == _Phase.sending;
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Icon(Icons.shield_outlined, color: cs.primary),
            const SizedBox(width: 8),
            Expanded(child: Tr('Diiwaangeli natiijadayda (ikhtiyaari)', style: t.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
          ]),
          const SizedBox(height: 6),
          Tr(
            'Saddexda kulliyadood ee kuu soo baxay iyo boqolkiiba ayaa la keydinayaa si magac la’aan ah, si kulliyadaha loo ogaado waxa ardaydu doortaan. Magac, telefoon ama meel lama keydiyo.',
            style: t.textTheme.bodySmall,
          ),
          const SizedBox(height: 8),
          if (_phase == _Phase.done)
            Row(children: [
              const Icon(Icons.check_circle_rounded, color: Colors.green),
              const SizedBox(width: 8),
              Expanded(child: Tr('Mahadsanid! Natiijadaada waa la diiwaangeliyay.', style: t.textTheme.bodyMedium)),
            ])
          else ...[
            CheckboxListTile(
              value: _agree,
              onChanged: sending ? null : (v) => setState(() => _agree = v ?? false),
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              title: Tr('Waan oggolahay in natiijadayda la diiwaangeliyo (magac la’aan)', style: t.textTheme.bodyMedium),
            ),
            if (_phase == _Phase.error)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Tr('Lama diri karin. Hubi internetka oo mar kale isku day.', style: t.textTheme.bodySmall?.copyWith(color: cs.error)),
              ),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              onPressed: (_agree && !sending) ? _send : null,
              child: sending ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Tr('Diiwaangeli'),
            ),
          ],
        ]),
      ),
    );
  }
}
