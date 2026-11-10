import 'dart:convert';
import 'package:http/http.dart' as http;
import 'config.dart';

/// Backend-ku wuu diyaar yahay haddii URL iyo key la dhigay `config.dart`.
bool get backendEnabled => supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

/// Madaxyada codsiga Supabase (apikey; Authorization kaliya haddii key-gu yahay JWT).
Map<String, String> supaHeaders() {
  final h = <String, String>{'apikey': supabaseAnonKey, 'Content-Type': 'application/json'};
  // Furayaasha cusub ("sb_publishable_...") ma aha JWT, kuma dirno Authorization.
  if (!supabaseAnonKey.startsWith('sb_')) h['Authorization'] = 'Bearer $supabaseAnonKey';
  return h;
}

/// U dir saddexda kulliyadood ee ugu sarreeya (magac la'aan) hawsha `submit_result`.
/// Waxay soo celisaa true marka server-ku aqbalo. Ma tuuro khalad.
Future<bool> submitResult({required String lang, required List<String> ids, required List<int> pcts}) async {
  if (!backendEnabled || ids.isEmpty || ids.length != pcts.length) return false;
  try {
    final top = [
      for (var i = 0; i < ids.length && i < 3; i++) {'id': ids[i], 'pct': pcts[i].clamp(0, 100)},
    ];
    final headers = supaHeaders();
    final res = await http
        .post(
          Uri.parse('$supabaseUrl/rest/v1/rpc/submit_result'),
          headers: headers,
          body: jsonEncode({'p_lang': lang, 'p_top': top, 'p_consent': true}),
        )
        .timeout(const Duration(seconds: 15));
    return res.statusCode >= 200 && res.statusCode < 300;
  } catch (_) {
    return false;
  }
}
