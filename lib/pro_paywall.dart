import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import 'i18n.dart';
import 'prefs.dart';
import 'pro_api.dart';
import 'pro_guide.dart' show ProBadge, AccentTitleLight;

const _navy = Color(0xFF050A1E);
const _gold = Color(0xFFFFC93C);
const _goldSoft = Color(0xFFFFD86B);

TextStyle _s(double size, {FontWeight w = FontWeight.w500, Color c = Colors.white, double h = 1.3, double ls = 0, bool head = false}) {
  final ar = currentLang == 'ar';
  final base = TextStyle(fontSize: size, fontWeight: w, color: c, height: h, letterSpacing: ar ? 0 : ls);
  if (ar) return GoogleFonts.cairo(textStyle: base);
  return head ? GoogleFonts.outfit(textStyle: base) : GoogleFonts.plusJakartaSans(textStyle: base);
}

BoxDecoration _glass({double radius = 20, Color? border}) => BoxDecoration(
      borderRadius: BorderRadius.circular(radius),
      gradient: LinearGradient(colors: [Colors.white.withValues(alpha: .12), Colors.white.withValues(alpha: .05)], begin: Alignment.topLeft, end: Alignment.bottomRight),
      border: Border.all(color: border ?? Colors.white.withValues(alpha: .22)),
    );

class _Msg {
  const _Msg(this.k, this.ok);
  final String k;
  final bool ok;
}

/// Bogga lacag-bixinta ee Pro: qiimaha, habka lacag-bixinta, dirista codsiga, hubinta xaaladda iyo isticmaalka koodh.
class ProPaywallScreen extends StatefulWidget {
  const ProPaywallScreen({super.key, required this.onUnlocked});

  /// Waxaa la wacaa marka gelitaanka Pro la furo (bogga ayaa isagu xidhma).
  final VoidCallback onUnlocked;

  @override
  State<ProPaywallScreen> createState() => _ProPaywallScreenState();
}

class _ProPaywallScreenState extends State<ProPaywallScreen> {
  ProInfo? _info;
  bool _loadingInfo = true;
  String? _infoErr;

  final TextEditingController _phone = TextEditingController();
  final TextEditingController _txn = TextEditingController();
  final TextEditingController _name = TextEditingController(text: userName.value);
  final TextEditingController _code = TextEditingController();
  String? _method;

  bool _sending = false;
  bool _checking = false;
  bool _redeeming = false;
  _Msg? _reqMsg;
  _Msg? _statMsg;
  _Msg? _codeMsg;

  @override
  void initState() {
    super.initState();
    _loadInfo();
  }

  @override
  void dispose() {
    _phone.dispose();
    _txn.dispose();
    _name.dispose();
    _code.dispose();
    super.dispose();
  }

  Future<void> _loadInfo() async {
    setState(() {
      _loadingInfo = true;
      _infoErr = null;
    });
    try {
      final i = await fetchProInfo();
      if (!mounted) return;
      setState(() {
        _info = i;
        _loadingInfo = false;
        if (i.methods.length == 1) _method = i.methods.first.name;
      });
    } on ProApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingInfo = false;
        _infoErr = e.code;
      });
    }
  }

  String _errKey(String code) {
    switch (code) {
      case 'offline':
        return 'Lama xiriiri karo server-ka. Hubi internetka.';
      case 'duplicate_txn':
        return 'Lambarka xaqiijinta hore ayaa loo isticmaalay.';
      case 'rate_limited':
        return 'Isku-day badan. Fadlan mar dambe isku day.';
      case 'bad_phone':
        return 'Lambarka taleefanka waa khalad.';
      case 'bad_txn':
        return 'Lambarka xaqiijinta waa khalad (4-40 xaraf ama tiro).';
      default:
        return 'Wax khalad ah ayaa dhacay. Mar kale isku day.';
    }
  }

  void _unlocked() {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(tr('Pro waa la furay!'))));
    Navigator.pop(context);
    widget.onUnlocked();
  }

  Future<void> _sendRequest() async {
    final ph = _phone.text.replaceAll(RegExp(r'[^0-9+]'), '');
    final tx = _txn.text.trim();
    final nm = _name.text.trim();
    if (_method == null) {
      setState(() => _reqMsg = const _Msg('Dooro habka lacag-bixinta.', false));
      return;
    }
    if (ph.length < 6 || ph.length > 20) {
      setState(() => _reqMsg = const _Msg('Lambarka taleefanka waa khalad.', false));
      return;
    }
    if (!RegExp(r'^[A-Za-z0-9 .:_-]{4,40}$').hasMatch(tx)) {
      setState(() => _reqMsg = const _Msg('Lambarka xaqiijinta waa khalad (4-40 xaraf ama tiro).', false));
      return;
    }
    setState(() {
      _sending = true;
      _reqMsg = null;
    });
    try {
      await submitProRequest(phone: ph, method: _method!, txn: tx, name: nm.isEmpty ? null : nm);
      if (mounted) setState(() => _reqMsg = const _Msg('Codsigaaga waa la helay. Waan hubin doonaa, kadibna riix “Hubi xaaladda”.', true));
    } on ProApiException catch (e) {
      if (mounted) setState(() => _reqMsg = _Msg(_errKey(e.code), false));
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  Future<void> _check() async {
    setState(() {
      _checking = true;
      _statMsg = null;
    });
    try {
      final ok = await refreshProStatus();
      if (!mounted) return;
      if (ok) {
        _unlocked();
      } else {
        setState(() => _statMsg = const _Msg('Weli lama xaqiijin. Fadlan sug ama la xiriir maamulaha.', false));
      }
    } on ProApiException catch (e) {
      if (mounted) setState(() => _statMsg = _Msg(_errKey(e.code), false));
    } finally {
      if (mounted) setState(() => _checking = false);
    }
  }

  Future<void> _redeem() async {
    final c = _code.text.trim();
    if (c.replaceAll(RegExp(r'[^A-Za-z0-9]'), '').length < 8) {
      setState(() => _codeMsg = const _Msg('Koodhku waa khalad.', false));
      return;
    }
    setState(() {
      _redeeming = true;
      _codeMsg = null;
    });
    try {
      final err = await redeemProCode(c);
      if (!mounted) return;
      if (err == null) {
        _unlocked();
      } else {
        setState(() => _codeMsg = _Msg(err == 'code_used' ? 'Koodhkan hore ayaa loo isticmaalay.' : 'Koodhku waa khalad.', false));
      }
    } on ProApiException catch (e) {
      if (mounted) setState(() => _codeMsg = _Msg(_errKey(e.code), false));
    } finally {
      if (mounted) setState(() => _redeeming = false);
    }
  }

  Future<void> _whatsapp(String number) async {
    final uri = Uri.parse('https://wa.me/$number?text=${Uri.encodeComponent(tr('Salaan, waxaan rabaa inaan furo Hagaha Waaxda Pro.'))}');
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {}
  }

  Future<void> _copy(String number) async {
    await Clipboard.setData(ClipboardData(text: number));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(tr('Lambarka waa la koobiyay'))));
  }

  // ---------------------------------------------------------------- qaybo yar
  Widget _msg(_Msg? m) => m == null
      ? const SizedBox.shrink()
      : Padding(
          padding: const EdgeInsets.only(top: 10),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(m.ok ? Icons.check_circle_rounded : Icons.error_outline_rounded, size: 18, color: m.ok ? const Color(0xFF7CF0A8) : const Color(0xFFFFB4AB)),
            const SizedBox(width: 8),
            Expanded(child: Tr(m.k, style: _s(12.5, c: m.ok ? const Color(0xFFB8F7D0) : const Color(0xFFFFD0CB), h: 1.4))),
          ]),
        );

  InputDecoration _dec(String hintKey) => InputDecoration(
        hintText: tr(hintKey),
        hintStyle: _s(13.5, c: Colors.white.withValues(alpha: .45)),
        filled: true,
        fillColor: Colors.white.withValues(alpha: .08),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withValues(alpha: .22))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: Colors.white.withValues(alpha: .22))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: _gold, width: 1.5)),
      );

  Widget _step(String titleKey, List<Widget> children) => Container(
        margin: const EdgeInsets.only(top: 14),
        padding: const EdgeInsets.all(16),
        decoration: _glass(),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Tr(titleKey, style: _s(15.5, w: FontWeight.w800, head: true)),
          const SizedBox(height: 12),
          ...children,
        ]),
      );

  Widget _feat(String k) => Padding(
        padding: const EdgeInsets.only(top: 9),
        child: Row(children: [
          const Icon(Icons.check_circle_rounded, size: 18, color: _gold),
          const SizedBox(width: 10),
          Expanded(child: Tr(k, style: _s(13.5, c: Colors.white.withValues(alpha: .92)))),
        ]),
      );

  Widget _outlined(String labelKey, IconData icon, VoidCallback? onTap, {bool busy = false}) => SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          style: OutlinedButton.styleFrom(
            foregroundColor: _goldSoft,
            minimumSize: const Size.fromHeight(50),
            side: BorderSide(color: _gold.withValues(alpha: .7)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          onPressed: busy ? null : onTap,
          icon: busy ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: _gold)) : Icon(icon),
          label: Tr(labelKey, style: _s(14.5, w: FontWeight.w700, c: _goldSoft)),
        ),
      );

  Widget _goldButton(String labelKey, VoidCallback? onTap, {bool busy = false}) => SizedBox(
        width: double.infinity,
        child: FilledButton(
          style: FilledButton.styleFrom(
            backgroundColor: _gold,
            foregroundColor: _navy,
            disabledBackgroundColor: _gold.withValues(alpha: .5),
            minimumSize: const Size.fromHeight(52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          onPressed: busy ? null : onTap,
          child: busy ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: _navy)) : Tr(labelKey, style: _s(15, w: FontWeight.w800, c: _navy)),
        ),
      );

  Widget _payBlock() {
    if (_loadingInfo) return const Padding(padding: EdgeInsets.symmetric(vertical: 12), child: Center(child: CircularProgressIndicator(color: _gold)));
    if (_infoErr != null) {
      return Column(children: [
        Tr(_errKey(_infoErr!), style: _s(13, c: Colors.white.withValues(alpha: .85))),
        const SizedBox(height: 10),
        _outlined('Isku day mar kale', Icons.refresh_rounded, _loadInfo),
      ]);
    }
    final info = _info!;
    if (info.methods.isEmpty) {
      return Tr('Habka lacag-bixinta weli lama dejin. Fadlan mar dambe isku day ama la xiriir maamulaha.', style: _s(13, c: Colors.white.withValues(alpha: .85), h: 1.45));
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (info.priceText.isNotEmpty)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Text(trf('Qiimaha: {p}', {'p': info.priceText}), style: _s(14, w: FontWeight.w800, c: _goldSoft)),
        ),
      for (final m in info.methods)
        Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.fromLTRB(14, 10, 6, 10),
          decoration: _glass(radius: 14),
          child: Row(children: [
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(m.name, style: _s(13, w: FontWeight.w700, c: _goldSoft)),
                const SizedBox(height: 2),
                SelectableText(m.number, style: _s(17, w: FontWeight.w800, head: true, ls: 1)),
                if (m.holder.isNotEmpty) Text(m.holder, style: _s(12, c: Colors.white.withValues(alpha: .7))),
              ]),
            ),
            IconButton(tooltip: tr('Koobi lambarka'), color: _goldSoft, onPressed: () => _copy(m.number), icon: const Icon(Icons.copy_rounded)),
          ]),
        ),
      if (info.note.isNotEmpty) Text(info.note, style: _s(12.5, c: Colors.white.withValues(alpha: .78), h: 1.45)),
    ]);
  }

  Widget _formBlock() {
    final methods = _info?.methods ?? const <ProMethod>[];
    final pending = Prefs.pendingAt > 0 && DateTime.now().millisecondsSinceEpoch - Prefs.pendingAt < const Duration(days: 7).inMilliseconds;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (pending && _reqMsg == null)
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Icon(Icons.hourglass_top_rounded, size: 18, color: _goldSoft),
            const SizedBox(width: 8),
            Expanded(child: Tr('Codsi hore ayaa socda; sug xaqiijinta ama riix “Hubi xaaladda”.', style: _s(12.5, c: Colors.white.withValues(alpha: .85), h: 1.4))),
          ]),
        ),
      if (methods.isNotEmpty) ...[
        Tr('Habka lacag-bixinta', style: _s(12, w: FontWeight.w700, c: _goldSoft, ls: .6)),
        const SizedBox(height: 8),
        Wrap(spacing: 8, runSpacing: 8, children: [
          for (final m in methods)
            GestureDetector(
              onTap: () => setState(() => _method = m.name),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 160),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(99),
                  color: _method == m.name ? _gold : Colors.white.withValues(alpha: .08),
                  border: Border.all(color: _method == m.name ? _gold : Colors.white.withValues(alpha: .24)),
                ),
                child: Text(m.name, style: _s(13, w: FontWeight.w700, c: _method == m.name ? _navy : Colors.white)),
              ),
            ),
        ]),
        const SizedBox(height: 12),
      ],
      TextField(controller: _phone, keyboardType: TextInputType.phone, style: _s(15), inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9+ ]')), LengthLimitingTextInputFormatter(20)], decoration: _dec('Lambarka taleefankaaga (kii aad ka bixisay)')),
      const SizedBox(height: 10),
      TextField(controller: _txn, style: _s(15), textCapitalization: TextCapitalization.characters, inputFormatters: [LengthLimitingTextInputFormatter(40)], decoration: _dec('Lambarka xaqiijinta (Transaction ID)')),
      const SizedBox(height: 10),
      TextField(controller: _name, style: _s(15), inputFormatters: [LengthLimitingTextInputFormatter(40)], decoration: _dec('Magacaaga (ikhtiyaari)')),
      const SizedBox(height: 14),
      _goldButton('Dir codsiga', _sendRequest, busy: _sending),
      _msg(_reqMsg),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final info = _info;
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
        width: double.infinity,
        decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [_navy, Color(0xFF0B1647), Color(0xFF1A1450)])),
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 640),
            child: ListView(padding: const EdgeInsets.fromLTRB(18, 4, 18, 40), children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: _glass(radius: 26, border: _gold.withValues(alpha: .6)).copyWith(boxShadow: [BoxShadow(color: _gold.withValues(alpha: .16), blurRadius: 28, offset: const Offset(0, 12))]),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [const ProBadge(), const Spacer(), const Icon(Icons.lock_rounded, color: _goldSoft)]),
                  const SizedBox(height: 14),
                  Tr('Hel Hagaha Waaxda Pro', style: _s(26, w: FontWeight.w800, head: true, h: 1.15)),
                  if (info != null) ...[
                    const SizedBox(height: 8),
                    Text(trf('Gelitaan {n} maalmood', {'n': info.days}), style: _s(13, c: Colors.white.withValues(alpha: .78))),
                  ],
                  const SizedBox(height: 6),
                  _feat('Kala saar waaxaha ku habboon'),
                  _feat('Shaqooyinka waaxda kasta'),
                  _feat('Xoojiso natiijada su’aalo yar'),
                  _feat('Waaxaha 14-ka kulliyadood oo dhan'),
                ]),
              ),
              _step('1. Bixi lacagta', [_payBlock()]),
              _step('2. Dir xogta lacag-bixinta', [_formBlock()]),
              _step('3. Hubi xaaladda', [
                _outlined('Hubi xaaladda', Icons.sync_rounded, _check, busy: _checking),
                _msg(_statMsg),
              ]),
              const SizedBox(height: 18),
              const AccentTitleLight('Koodh ma haysaa?'),
              const SizedBox(height: 10),
              TextField(controller: _code, style: _s(16, w: FontWeight.w800, ls: 1.5), textCapitalization: TextCapitalization.characters, inputFormatters: [LengthLimitingTextInputFormatter(14)], decoration: _dec('Geli koodhka')),
              const SizedBox(height: 10),
              _goldButton('Isticmaal koodhka', _redeem, busy: _redeeming),
              _msg(_codeMsg),
              if (info != null && info.whatsapp.isNotEmpty) ...[
                const SizedBox(height: 18),
                _outlined('La xiriir WhatsApp', Icons.chat_rounded, () => _whatsapp(info.whatsapp)),
              ],
              const SizedBox(height: 18),
              Tr('Lacag-bixinta waxaa gacanta ku xaqiijiya maamulka (badanaa ilaa 24 saac). Gelitaanku wuxuu ku xidhan yahay qalabkan.', textAlign: TextAlign.center, style: _s(12, c: Colors.white.withValues(alpha: .6), h: 1.45)),
            ]),
          ),
        ),
      ),
    );
  }
}
