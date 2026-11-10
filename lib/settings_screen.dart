import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'founder_intro.dart';
import 'i18n.dart';
import 'prefs.dart';
import 'reviews_ui.dart';

const String appVersion = '1.0.0';

/// Dejinta: luqadda, muuqaalka, dhaqdhaqaaqa, cabbirka qoraalka, magaca, xog-ilaalinta iyo fikirrada.
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Tr('Dejinta')),
      body: Align(
        alignment: Alignment.topCenter,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
          children: [
            _Section(icon: Icons.language, title: 'Luqadda', children: [
              ValueListenableBuilder<String>(
                valueListenable: langNotifier,
                builder: (_, lang, __) => SegmentedButton<String>(
                  showSelectedIcon: false,
                  segments: [for (final e in langNames.entries) ButtonSegment<String>(value: e.key, label: Text(e.value))],
                  selected: {lang},
                  onSelectionChanged: (s) => langNotifier.value = s.first,
                ),
              ),
              const SizedBox(height: 8),
              Tr('Beddelka luqadda wuxuu ku celinayaa bogga hore.', style: t.bodySmall),
            ]),
            _Section(icon: Icons.palette_outlined, title: 'Muuqaalka', children: [
              ValueListenableBuilder<bool>(
                valueListenable: darkMode,
                builder: (_, dark, __) => SegmentedButton<bool>(
                  showSelectedIcon: false,
                  segments: [
                    ButtonSegment<bool>(value: false, icon: const Icon(Icons.light_mode_outlined), label: Text(tr('Iftiin'))),
                    ButtonSegment<bool>(value: true, icon: const Icon(Icons.dark_mode_outlined), label: Text(tr('Mugdi'))),
                  ],
                  selected: {dark},
                  onSelectionChanged: (s) => darkMode.value = s.first,
                ),
              ),
              ValueListenableBuilder<bool>(
                valueListenable: animationsOn,
                builder: (_, on, __) => SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  value: on,
                  onChanged: (v) => animationsOn.value = v,
                  title: Tr('Dhaqdhaqaaqyada (animation)', style: t.bodyLarge),
                ),
              ),
              const SizedBox(height: 4),
              Tr('Cabbirka qoraalka', style: t.bodyLarge),
              ValueListenableBuilder<double>(
                valueListenable: textScale,
                builder: (_, v, __) => Row(children: [
                  const Text('A', style: TextStyle(fontSize: 14)),
                  Expanded(child: Slider(value: v, min: 0.9, max: 1.3, divisions: 4, label: '${(v * 100).round()}%', onChanged: (x) => textScale.value = double.parse(x.toStringAsFixed(2)))),
                  const Text('A', style: TextStyle(fontSize: 24)),
                ]),
              ),
            ]),
            const _Section(icon: Icons.person_outline, title: 'Magacaaga', children: [_NameEditor()]),
            _Section(icon: Icons.info_outline, title: 'Ku saabsan', children: [
              _Tile(
                icon: Icons.record_voice_over_outlined,
                text: 'Fariinta aasaasaha',
                onTap: () => Navigator.push(context, MaterialPageRoute<void>(builder: (_) => FounderIntroScreen(onContinue: (c) => Navigator.pop(c)))),
              ),
              _Tile(icon: Icons.reviews_outlined, text: 'Fikirrada ardayda', onTap: () => Navigator.push(context, MaterialPageRoute<void>(builder: (_) => const ReviewsScreen()))),
              _Tile(icon: Icons.lock_outline, text: 'Xog-ilaalinta', onTap: () => _privacy(context)),
              _Tile(
                icon: Icons.restart_alt_rounded,
                text: 'Dib u deji dejinta',
                onTap: () {
                  Prefs.resetAll();
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(tr('Dejinta waa la dib u dejiyay.'))));
                },
              ),
              const SizedBox(height: 8),
              Row(children: [
                Expanded(child: Tr('Nooca app-ka', style: t.bodySmall)),
                Text(appVersion, style: t.bodySmall),
              ]),
            ]),
          ],
        ),
      ),
    );
  }

  void _privacy(BuildContext context) => showDialog<void>(
        context: context,
        builder: (_) => AlertDialog(
          title: const Tr('Xog-ilaalinta'),
          content: SingleChildScrollView(
            child: Tr('Magacaaga (ikhtiyaari) wuxuu ku hadhaa qalabkaaga oo kaliya, lamana diro waligeed. Natiijadaada waxaa la diiwaangelin karaa magac la’aan, kaliya haddii aad oggolaato. Fikirkaaga waxaa la muujin karaa kaliya marka aad oggolaato oo la ansixiyo (magaca koowaad ee ikhtiyaariga ah kaliya). Dejinta (luqadda, mugdiga, cabbirka qoraalka) waxay ku xusuusan tahay qalabkaaga.'),
          ),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Tr('Xidh'))],
        ),
      );
}

class _Section extends StatelessWidget {
  const _Section({required this.icon, required this.title, required this.children});
  final IconData icon;
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Card(
        margin: EdgeInsets.zero,
        elevation: 0,
        color: t.colorScheme.surfaceContainerHighest.withValues(alpha: .45),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: t.colorScheme.outlineVariant)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Icon(icon, color: t.colorScheme.primary),
              const SizedBox(width: 10),
              Tr(title, style: t.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            ]),
            const SizedBox(height: 12),
            ...children,
          ]),
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({required this.icon, required this.text, required this.onTap});
  final IconData icon;
  final String text;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(
        contentPadding: EdgeInsets.zero,
        dense: true,
        leading: Icon(icon),
        title: Tr(text),
        trailing: const Icon(Icons.chevron_right_rounded),
        onTap: onTap,
      );
}

/// Beddel ama tirtir magaca (isla xeerarka bogga hore: xarfo kaliya, 2-20).
class _NameEditor extends StatefulWidget {
  const _NameEditor();

  @override
  State<_NameEditor> createState() => _NameEditorState();
}

class _NameEditorState extends State<_NameEditor> {
  late final TextEditingController _c = TextEditingController(text: userName.value);
  String? _error;

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _save() {
    final n = _c.text.replaceAll(RegExp(r'\s+'), ' ').trim();
    if (n.isEmpty) {
      userName.value = '';
      setState(() => _error = null);
      return;
    }
    if (!isValidName(n)) {
      setState(() => _error = tr('Magaca waa inuu ahaadaa ugu yaraan 2 xaraf, xarfo kaliya (tiro iyo calaamado lama oggola).'));
      return;
    }
    userName.value = n;
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() => _error = null);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(tr('Magaca waa la keydiyay.'))));
  }

  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        TextField(
          controller: _c,
          textCapitalization: TextCapitalization.words,
          inputFormatters: [
            FilteringTextInputFormatter.allow(RegExp(r"[\p{L}\p{M}\s'’\-]", unicode: true)),
            LengthLimitingTextInputFormatter(20),
          ],
          decoration: InputDecoration(
            hintText: tr('Magacaaga (ikhtiyaari)'),
            errorText: _error,
            errorMaxLines: 3,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
          ),
          onSubmitted: (_) => _save(),
        ),
        const SizedBox(height: 10),
        Row(children: [
          Expanded(child: FilledButton(onPressed: _save, child: const Tr('Keydi'))),
          const SizedBox(width: 10),
          OutlinedButton(
            onPressed: () {
              _c.clear();
              userName.value = '';
              setState(() => _error = null);
            },
            child: const Tr('Tirtir magacayga'),
          ),
        ]),
      ]);
}
