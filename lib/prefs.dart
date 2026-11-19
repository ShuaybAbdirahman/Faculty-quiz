import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'i18n.dart';

/// Dejinta ardayga. Waxay ku xusuusan yihiin qalabka (localStorage / SharedPreferences), looma diro server.
final ValueNotifier<bool> darkMode = ValueNotifier(true);

/// Magaca ardayga (ikhtiyaari). Waxaa loo isticmaalaa hambalyada oo kaliya. Waa global si uusan u lumin marka luqadda la beddelo.
final ValueNotifier<String> userName = ValueNotifier('');

/// Dhaqdhaqaaqyada (animation) shid / demi.
final ValueNotifier<bool> animationsOn = ValueNotifier(true);

/// Cabbirka qoraalka (0.9 - 1.3).
final ValueNotifier<double> textScale = ValueNotifier(1.0);

final RegExp _nameRe = RegExp(r"^[\p{L}][\p{L}\p{M}\s'’\-]{1,19}$", unicode: true);
final RegExp _letterRe = RegExp(r'\p{L}', unicode: true);

/// Magac sax ah: xarfo kaliya (luqad kasta), 2-20 xaraf, oo loo oggol yahay meel bannaan, ' iyo -. Tiro iyo calaamado kale lama oggola.
bool isValidName(String s) => _nameRe.hasMatch(s) && _letterRe.allMatches(s).length >= 2;

/// Magaca koowaad (loo isticmaalo fikirrada).
String firstName(String s) {
  final t = s.trim().split(RegExp(r'\s+'));
  return t.isEmpty ? '' : t.first;
}

/// Pro: tirada milliseconds ee uu dhammaanayo gelitaanka (xusuus gudaha ah oo UI-ga loo isticmaalo; server-ku ayaa go'aamiya xogta runta ah).
final ValueNotifier<bool> proActive = ValueNotifier(false);

class Prefs {
  static SharedPreferences? _p;
  static String? _device;
  static int proUntilMs = 0;

  /// Aqoonsi random ah oo qalabkan u gaar ah (waa lagu xusuustaa qalabka). Waxaa loo isticmaalaa Pro, ma aha magaca ardayga.
  static String get deviceId {
    var id = _device ?? _p?.getString('device_id');
    if (id == null || id.length < 16) {
      final r = Random.secure();
      id = List<String>.generate(24, (_) => r.nextInt(16).toRadixString(16)).join();
      _p?.setString('device_id', id);
    }
    _device = id;
    return id;
  }

  static void setProUntil(int ms) {
    proUntilMs = ms;
    _p?.setInt('pro_until', ms);
    proActive.value = ms > DateTime.now().millisecondsSinceEpoch;
  }

  /// Marka la dirayo codsi lacag-bixin: waqtiga (ms), si loo muujiyo "waa la hubinayaa".
  static int get pendingAt => _p?.getInt('pro_pending') ?? 0;
  static void setPendingAt(int ms) => _p?.setInt('pro_pending', ms);

  static Future<void> init() async {
    try {
      final p = await SharedPreferences.getInstance();
      _p = p;
      final l = p.getString('lang');
      if (l != null && langNames.containsKey(l)) langNotifier.value = l;
      final d = p.getBool('dark');
      if (d != null) darkMode.value = d;
      final a = p.getBool('anim');
      if (a != null) animationsOn.value = a;
      final t = p.getDouble('textScale');
      if (t != null && t >= 0.85 && t <= 1.35) textScale.value = t;
      final pu = p.getInt('pro_until');
      if (pu != null) {
        proUntilMs = pu;
        proActive.value = pu > DateTime.now().millisecondsSinceEpoch;
      }
      final n = p.getString('name');
      if (n != null && isValidName(n)) userName.value = n;
    } catch (_) {
      // Haddii xusuusta la waayo, app-ku wuu shaqaynayaa sidii caadiga ah.
    }
    langNotifier.addListener(() => _p?.setString('lang', langNotifier.value));
    darkMode.addListener(() => _p?.setBool('dark', darkMode.value));
    animationsOn.addListener(() => _p?.setBool('anim', animationsOn.value));
    textScale.addListener(() => _p?.setDouble('textScale', textScale.value));
    userName.addListener(() => _p?.setString('name', userName.value));
  }

  /// Dib u deji mugdiga, dhaqdhaqaaqa, cabbirka qoraalka iyo magaca (luqadda waa la ilaaliyaa).
  static void resetAll() {
    darkMode.value = true;
    animationsOn.value = true;
    textScale.value = 1.0;
    userName.value = '';
  }
}
