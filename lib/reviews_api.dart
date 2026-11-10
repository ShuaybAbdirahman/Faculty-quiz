import 'dart:convert';
import 'package:http/http.dart' as http;
import 'config.dart';
import 'results_api.dart';

class ReviewItem {
  const ReviewItem({this.name, required this.comment, required this.rating, this.faculty});
  final String? name;
  final String comment;
  final int rating;
  final String? faculty;
}

class ReviewsData {
  const ReviewsData({required this.count, required this.avg, required this.items});
  final int count;
  final double avg;
  final List<ReviewItem> items;
}

ReviewItem _parseItem(dynamic e) {
  final m = Map<String, dynamic>.from(e as Map);
  return ReviewItem(
    name: m['name'] as String?,
    comment: (m['comment'] as String?) ?? '',
    rating: ((m['rating'] as num?) ?? 5).toInt(),
    faculty: m['faculty'] as String?,
  );
}

/// Fikirrada la ansixiyay (kaliya) ee dadweynaha. Waxay soo celisaa null haddii server-ku la waayo.
Future<ReviewsData?> fetchReviews({int limit = 20}) async {
  if (!backendEnabled) return null;
  try {
    final res = await http
        .post(Uri.parse('$supabaseUrl/rest/v1/rpc/public_reviews'), headers: supaHeaders(), body: jsonEncode({'p_limit': limit}))
        .timeout(const Duration(seconds: 12));
    if (res.statusCode < 200 || res.statusCode >= 300) return null;
    final m = Map<String, dynamic>.from(jsonDecode(res.body) as Map);
    final raw = (m['items'] as List?) ?? const [];
    return ReviewsData(
      count: ((m['count'] as num?) ?? 0).toInt(),
      avg: ((m['avg'] as num?) ?? 0).toDouble(),
      items: [for (final e in raw) _parseItem(e)],
    );
  } catch (_) {
    return null;
  }
}

/// U dir fikir (waxaa la hubiyaa ka hor intaan la muujin).
Future<bool> submitReview({required String lang, required int rating, required String comment, String? name, String? faculty}) async {
  if (!backendEnabled || rating < 1 || rating > 5) return false;
  try {
    final res = await http
        .post(
          Uri.parse('$supabaseUrl/rest/v1/rpc/submit_review'),
          headers: supaHeaders(),
          body: jsonEncode({
            'p_lang': lang,
            'p_rating': rating,
            'p_comment': comment,
            'p_name': (name == null || name.isEmpty) ? null : name,
            'p_faculty': faculty,
            'p_consent': true,
          }),
        )
        .timeout(const Duration(seconds: 15));
    return res.statusCode >= 200 && res.statusCode < 300;
  } catch (_) {
    return false;
  }
}
