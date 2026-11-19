import 'dart:convert';

import 'package:http/http.dart' as http;

import 'config.dart';
import 'prefs.dart';
import 'results_api.dart';

/// Khalad ka yimid server-ka Pro: `code` waa fariinta (tusaale `locked`, `duplicate_txn`, `rate_limited`, `offline`).
class ProApiException implements Exception {
  const ProApiException(this.code);
  final String code;
  bool get locked => code == 'locked';
  @override
  String toString() => 'ProApiException($code)';
}

class ProMethod {
  const ProMethod({required this.name, required this.number, required this.holder});
  final String name;
  final String number;
  final String holder;
}

class ProInfo {
  const ProInfo({required this.priceText, required this.days, required this.whatsapp, required this.note, required this.methods});
  final String priceText;
  final int days;
  final String whatsapp;
  final String note;
  final List<ProMethod> methods;

  bool get ready => methods.isNotEmpty || whatsapp.isNotEmpty;
}

String _errCode(http.Response r) {
  try {
    final m = jsonDecode(r.body);
    if (m is Map && m['message'] != null) return m['message'].toString();
  } catch (_) {}
  return 'error';
}

Future<dynamic> _rpc(String fn, Map<String, dynamic> body, {int seconds = 15}) async {
  if (!backendEnabled) throw const ProApiException('offline');
  try {
    final res = await http.post(Uri.parse('$supabaseUrl/rest/v1/rpc/$fn'), headers: supaHeaders(), body: jsonEncode(body)).timeout(Duration(seconds: seconds));
    if (res.statusCode >= 200 && res.statusCode < 300) return res.body.isEmpty ? null : jsonDecode(res.body);
    throw ProApiException(_errCode(res));
  } on ProApiException {
    rethrow;
  } catch (_) {
    throw const ProApiException('offline');
  }
}

/// Xogta lacag-bixinta ee maamuluhu dejiyay (qiimaha, habab, lambar WhatsApp).
Future<ProInfo> fetchProInfo() async {
  final j = Map<String, dynamic>.from(await _rpc('pro_info', {}) as Map);
  final raw = (j['methods'] as List?) ?? const [];
  return ProInfo(
    priceText: (j['price_text'] as String?) ?? '',
    days: ((j['days'] as num?) ?? 180).toInt(),
    whatsapp: ((j['whatsapp'] as String?) ?? '').replaceAll(RegExp(r'[^0-9]'), ''),
    note: (j['note'] as String?) ?? '',
    methods: [
      for (final e in raw)
        ProMethod(
          name: ((e as Map)['name'] ?? '').toString(),
          number: (e['number'] ?? '').toString(),
          holder: (e['holder'] ?? '').toString(),
        ),
    ].where((m) => m.name.isNotEmpty && m.number.isNotEmpty).toList(),
  );
}

void _applyStatus(dynamic j) {
  final m = Map<String, dynamic>.from(j as Map);
  final exp = m['expires_at'];
  if (m['active'] == true && exp is String) {
    Prefs.setProUntil(DateTime.parse(exp).millisecondsSinceEpoch);
  } else {
    Prefs.setProUntil(0);
  }
}

/// Hubi gelitaanka Pro ee qalabkan (server-ka ayaa runta ah) oo cusboonaysii xusuusta.
Future<bool> refreshProStatus() async {
  final j = await _rpc('pro_status', {'p_device': Prefs.deviceId});
  _applyStatus(j);
  return proActive.value;
}

/// Dir codsi lacag-bixin (maamuluhu ayaa gacanta ku xaqiijin doona).
Future<void> submitProRequest({required String phone, required String method, required String txn, String? amount, String? name}) async {
  await _rpc('pro_submit_request', {
    'p_device': Prefs.deviceId,
    'p_phone': phone,
    'p_method': method,
    'p_txn': txn,
    'p_amount': amount,
    'p_name': name,
  });
  Prefs.setPendingAt(DateTime.now().millisecondsSinceEpoch);
}

/// Isticmaal koodh. Waxay soo celisaa null haddii ay guulaysato, ama koodhka khaladka (`invalid_code`, `code_used`).
Future<String?> redeemProCode(String code) async {
  final j = Map<String, dynamic>.from(await _rpc('pro_redeem', {'p_device': Prefs.deviceId, 'p_code': code}) as Map);
  if (j['ok'] == true) {
    _applyStatus(j);
    return null;
  }
  return (j['error'] as String?) ?? 'invalid_code';
}

/// Waaxaha Pro ee kulliyadda. Waxay tuuraysaa `ProApiException('locked')` haddii aan gelitaan lahayn.
Future<List<Map<String, dynamic>>> fetchProContent(String faculty) async {
  final j = await _rpc('pro_content', {'p_device': Prefs.deviceId, 'p_faculty': faculty});
  return [for (final e in (j as List)) Map<String, dynamic>.from(e as Map)];
}
