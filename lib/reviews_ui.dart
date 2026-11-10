import 'package:flutter/material.dart';

import 'data.dart';
import 'i18n.dart';
import 'prefs.dart';
import 'results_api.dart';
import 'reviews_api.dart';

const _starColor = Color(0xFFFFB703);

String _facultyName(String? id) {
  if (id == null) return '';
  for (final f in faculties) {
    if (f['id'] == id) return tx(f['name']);
  }
  return '';
}

/// Xiddigaha (0-5), xaaladda badhkii ayaa la taageeraa.
class Stars extends StatelessWidget {
  const Stars(this.value, {super.key, this.size = 18});
  final double value;
  final double size;

  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
        for (var i = 1; i <= 5; i++)
          Icon(
            value >= i - 0.25 ? Icons.star_rounded : (value >= i - 0.75 ? Icons.star_half_rounded : Icons.star_outline_rounded),
            size: size,
            color: _starColor,
          ),
      ]);
}

// ---------------------------------------------------------------- Bogga hore: waxa ay yiraahdaan ardayda
class ReviewsSection extends StatefulWidget {
  const ReviewsSection({super.key});

  @override
  State<ReviewsSection> createState() => _ReviewsSectionState();
}

class _ReviewsSectionState extends State<ReviewsSection> {
  ReviewsData? _data;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final d = await fetchReviews(limit: 12);
    if (!mounted) return;
    setState(() => _data = d);
  }

  @override
  Widget build(BuildContext context) {
    final d = _data;
    if (!backendEnabled || d == null || d.count == 0) return const SizedBox.shrink();
    final shown = d.items.where((r) => r.comment.trim().isNotEmpty).toList();
    if (shown.isEmpty) return const SizedBox.shrink();
    final t = Theme.of(context).textTheme;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(24, 26, 24, 4),
        child: Row(children: [
          Expanded(child: Tr('Waxa ay yiraahdaan ardayda', style: t.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
        ]),
      ),
      Padding(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 10),
        child: Row(children: [
          Stars(d.avg, size: 20),
          const SizedBox(width: 8),
          Text('${d.avg.toStringAsFixed(1)}  ·  ${trf('{n} fikir', {'n': d.count})}', style: t.bodyMedium),
        ]),
      ),
      SizedBox(
        height: 190,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          itemCount: shown.length,
          separatorBuilder: (_, __) => const SizedBox(width: 12),
          itemBuilder: (_, i) => SizedBox(width: 290, child: ReviewTile(item: shown[i], maxLines: 4)),
        ),
      ),
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 0),
        child: TextButton(
          onPressed: () => Navigator.push(context, MaterialPageRoute<void>(builder: (_) => const ReviewsScreen())),
          child: Tr('Eeg dhammaan', style: const TextStyle(fontWeight: FontWeight.w700)),
        ),
      ),
    ]);
  }
}

class ReviewTile extends StatelessWidget {
  const ReviewTile({super.key, required this.item, this.maxLines});
  final ReviewItem item;
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final cs = Theme.of(context).colorScheme;
    final name = (item.name == null || item.name!.trim().isEmpty) ? tr('Arday') : item.name!.trim();
    final fac = _facultyName(item.faculty);
    return Card(
      margin: EdgeInsets.zero,
      elevation: 0,
      color: cs.surfaceContainerHighest.withValues(alpha: .55),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: cs.outlineVariant)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: maxLines == null ? MainAxisSize.min : MainAxisSize.max, children: [
          Stars(item.rating.toDouble(), size: 18),
          const SizedBox(height: 8),
          if (maxLines == null)
            Text(item.comment.trim(), style: t.bodyMedium?.copyWith(height: 1.4))
          else
            Expanded(child: Text(item.comment.trim(), maxLines: maxLines, overflow: TextOverflow.ellipsis, style: t.bodyMedium?.copyWith(height: 1.4))),
          const SizedBox(height: 10),
          Row(children: [
            CircleAvatar(radius: 14, backgroundColor: cs.primaryContainer, child: Text(String.fromCharCode(name.runes.first).toUpperCase(), style: TextStyle(color: cs.onPrimaryContainer, fontWeight: FontWeight.w800, fontSize: 13))),
            const SizedBox(width: 8),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(name, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
                if (fac.isNotEmpty) Text(fac, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodySmall),
              ]),
            ),
          ]),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- Bog buuxa: dhammaan fikirrada la ansixiyay
class ReviewsScreen extends StatefulWidget {
  const ReviewsScreen({super.key});

  @override
  State<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends State<ReviewsScreen> {
  ReviewsData? _data;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final d = await fetchReviews(limit: 50);
    if (!mounted) return;
    setState(() {
      _data = d;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final d = _data;
    Widget body;
    if (_loading) {
      body = const Center(child: CircularProgressIndicator());
    } else if (d == null) {
      body = Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Tr('Lama soo qaadi karin. Hubi internetka oo mar kale isku day.', textAlign: TextAlign.center, style: t.bodyMedium),
            const SizedBox(height: 12),
            FilledButton(onPressed: _load, child: const Tr('Isku day mar kale')),
          ]),
        ),
      );
    } else if (d.count == 0) {
      body = Center(child: Tr('Weli fikir ma jiro.', style: t.bodyLarge));
    } else {
      final list = d.items.where((r) => r.comment.trim().isNotEmpty).toList();
      body = RefreshIndicator(
        onRefresh: _load,
        child: ListView(padding: const EdgeInsets.all(20), children: [
          Column(children: [
            Text(d.avg.toStringAsFixed(1), style: t.displaySmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 4),
            Stars(d.avg, size: 26),
            const SizedBox(height: 6),
            Text(trf('{n} fikir', {'n': d.count}), style: t.bodyMedium),
          ]),
          const SizedBox(height: 18),
          for (final r in list) Padding(padding: const EdgeInsets.only(bottom: 12), child: ReviewTile(item: r)),
        ]),
      );
    }
    return Scaffold(appBar: AppBar(title: const Tr('Fikirrada ardayda')), body: body);
  }
}

// ---------------------------------------------------------------- Natiijada: qor fikir
class ReviewCard extends StatefulWidget {
  const ReviewCard({super.key, required this.facultyId});
  final String facultyId;

  @override
  State<ReviewCard> createState() => _ReviewCardState();
}

enum _RPhase { idle, sending, done, error }

class _ReviewCardState extends State<ReviewCard> {
  final TextEditingController _c = TextEditingController();
  int _rating = 0;
  bool _agree = false;
  _RPhase _phase = _RPhase.idle;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    setState(() => _phase = _RPhase.sending);
    final n = firstName(userName.value);
    final ok = await submitReview(lang: currentLang, rating: _rating, comment: _c.text.trim(), name: n, faculty: widget.facultyId);
    if (!mounted) return;
    setState(() => _phase = ok ? _RPhase.done : _RPhase.error);
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final cs = t.colorScheme;
    final sending = _phase == _RPhase.sending;
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Icon(Icons.rate_review_outlined, color: cs.primary),
            const SizedBox(width: 8),
            Expanded(child: Tr('Fikirkaaga (ikhtiyaari)', style: t.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
          ]),
          const SizedBox(height: 6),
          Tr('Fikirkaaga wuxuu caawin doonaa ardayda kale. Waa la hubinayaa ka hor intaan la muujin.', style: t.textTheme.bodySmall),
          const SizedBox(height: 10),
          if (_phase == _RPhase.done)
            Row(children: [
              const Icon(Icons.check_circle_rounded, color: Colors.green),
              const SizedBox(width: 8),
              Expanded(child: Tr('Mahadsanid! Fikirkaaga waa la hubinayaa, marka la ansixiyo ayaa la muujin doonaa.', style: t.textTheme.bodyMedium)),
            ])
          else ...[
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              for (var i = 1; i <= 5; i++)
                IconButton(
                  onPressed: sending ? null : () => setState(() => _rating = i),
                  padding: const EdgeInsets.all(4),
                  constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                  icon: AnimatedScale(
                    scale: _rating == i ? 1.25 : 1.0,
                    duration: const Duration(milliseconds: 160),
                    child: Icon(i <= _rating ? Icons.star_rounded : Icons.star_outline_rounded, size: 38, color: i <= _rating ? _starColor : cs.outline),
                  ),
                ),
            ]),
            const SizedBox(height: 6),
            TextField(
              controller: _c,
              enabled: !sending,
              maxLength: 200,
              minLines: 2,
              maxLines: 4,
              textCapitalization: TextCapitalization.sentences,
              decoration: InputDecoration(
                hintText: tr('Waxa aad ka qabto app-ka (ikhtiyaari)'),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
            CheckboxListTile(
              value: _agree,
              onChanged: sending ? null : (v) => setState(() => _agree = v ?? false),
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              title: Tr('Waan oggolahay in fikirkayga la muujiyo marka la ansixiyo (magaca koowaad kaliya, haddii aad gelisay).', style: t.textTheme.bodyMedium),
            ),
            if (_phase == _RPhase.error)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Tr('Lama diri karin. Hubi internetka oo mar kale isku day.', style: t.textTheme.bodySmall?.copyWith(color: cs.error)),
              ),
            FilledButton(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
              onPressed: (_rating > 0 && _agree && !sending) ? _send : null,
              child: sending ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Tr('Dir fikirka'),
            ),
          ],
        ]),
      ),
    );
  }
}
