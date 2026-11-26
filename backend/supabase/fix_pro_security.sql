-- ============================================================================
-- HIRAAL (Hagaha Kulliyadda) Unlock+ | Security Hardening & 6-Month Plan Update
-- Run this script once in your Supabase Dashboard -> SQL Editor
-- ============================================================================
-- Fixes:
-- 1. Guarantees unlocking for one student NEVER unlocks for other users
--    (strict per-device isolation in pro_entitlements, pro_status,
--    pro_redeem with row-level FOR UPDATE locking).
-- 2. Stores and returns authoritative `scope` and `unlocked_items` on
--    pro_entitlements so scoped purchases (Languages, Departments, School
--    Predict, Gap Predict) cannot escalate on status refresh.
-- 3. Sets EVC Plus ONLY & 6-Month (180-day) seasonal Unlock+ model:
--    Number: 610999089 | Holder: Shuceyb Abdirahman | WhatsApp: 252610999089
-- ============================================================================

-- 1. Enforce strict device_id uniqueness, RLS, and scoped grant columns
ALTER TABLE IF EXISTS public.pro_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.pro_entitlements FROM anon, authenticated;

ALTER TABLE IF EXISTS public.pro_entitlements
  ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'departments';

ALTER TABLE IF EXISTS public.pro_entitlements
  ADD COLUMN IF NOT EXISTS unlocked_items text[] NOT NULL DEFAULT '{}';

ALTER TABLE IF EXISTS public.pro_codes
  ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT 'departments';

ALTER TABLE IF EXISTS public.pro_codes
  ADD COLUMN IF NOT EXISTS unlocked_items text[] NOT NULL DEFAULT '{}';

-- Remove any invalid / blank / short device rows that could collide across users
DELETE FROM public.pro_entitlements
WHERE device_id IS NULL
   OR length(trim(device_id)) < 16
   OR lower(trim(device_id)) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous');

-- 2. Harden pro_status(p_device text): ONLY returns active=true & authoritative scope/items for exact p_device
CREATE OR REPLACE FUNCTION public.pro_status(p_device text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dev text := trim(coalesce(p_device, ''));
  v_exp timestamptz;
  v_scope text;
  v_items text[];
BEGIN
  IF length(v_dev) < 16 OR lower(v_dev) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous') THEN
    RAISE EXCEPTION 'bad_device';
  END IF;

  SELECT e.expires_at, coalesce(e.scope, 'departments'), coalesce(e.unlocked_items, '{}')
    INTO v_exp, v_scope, v_items
    FROM public.pro_entitlements e
   WHERE e.device_id = v_dev
     AND e.expires_at > now()
   ORDER BY e.expires_at DESC
   LIMIT 1;

  IF v_exp IS NOT NULL THEN
    RETURN jsonb_build_object(
      'active', true,
      'expires_at', v_exp,
      'scope', v_scope,
      'unlocked_items', to_jsonb(v_items)
    );
  END IF;

  RETURN jsonb_build_object(
    'active', false,
    'expires_at', null,
    'scope', 'none',
    'unlocked_items', '[]'::jsonb
  );
END;
$$;

-- 3. Harden pro_redeem(p_device text, p_code text): atomic single-use per device with scoped merge
CREATE OR REPLACE FUNCTION public.pro_redeem(p_device text, p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dev text := trim(coalesce(p_device, ''));
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_row record;
  v_exp timestamptz;
  v_old_scope text;
  v_old_items text[];
  v_code_scope text;
  v_merged_scope text;
  v_merged_items text[];
BEGIN
  IF length(v_dev) < 16 OR lower(v_dev) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous') THEN
    RAISE EXCEPTION 'bad_device';
  END IF;

  IF length(v_code) < 8 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;

  -- Lock the exact code row to prevent race conditions or multi-user reuse
  SELECT *
    INTO v_row
    FROM public.pro_codes
   WHERE upper(regexp_replace(code, '[^A-Za-z0-9]', '', 'g')) = v_code
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;

  IF v_row.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'code_used');
  END IF;

  SELECT e.expires_at, e.scope, e.unlocked_items
    INTO v_exp, v_old_scope, v_old_items
    FROM public.pro_entitlements e
   WHERE e.device_id = v_dev;

  v_exp := greatest(coalesce(v_exp, now()), now())
         + make_interval(days => greatest(1, least(730, coalesce(v_row.days, 180))));

  v_code_scope := coalesce(v_row.scope, 'university');
  v_merged_scope := CASE
    WHEN v_old_scope IS NULL OR v_old_scope = 'none' THEN v_code_scope
    WHEN v_code_scope = 'none' THEN v_old_scope
    WHEN v_old_scope = 'full' OR v_code_scope = 'full' THEN 'full'
    ELSE v_code_scope
  END;

  v_merged_items := ARRAY(
    SELECT DISTINCT x
    FROM unnest(coalesce(v_old_items, '{}') || coalesce(v_row.unlocked_items, '{}')) AS x
    WHERE x ~ '^(school|bridge|stage):[a-z0-9_]{2,32}$'
  );

  UPDATE public.pro_codes
     SET used_at = now(),
         used_device = v_dev
   WHERE id = v_row.id;

  INSERT INTO public.pro_entitlements (device_id, expires_at, scope, unlocked_items, source, updated_at)
  VALUES (v_dev, v_exp, v_merged_scope, v_merged_items, 'code:' || v_row.code, now())
  ON CONFLICT (device_id)
  DO UPDATE SET expires_at = EXCLUDED.expires_at,
                scope = EXCLUDED.scope,
                unlocked_items = EXCLUDED.unlocked_items,
                source = EXCLUDED.source,
                updated_at = now();

  RETURN jsonb_build_object(
    'ok', true,
    'expires_at', v_exp,
    'scope', v_merged_scope,
    'unlocked_items', to_jsonb(v_merged_items)
  );
END;
$$;

-- 4. Update payment settings to EVC Plus ONLY: 610999089 / Shuceyb Abdirahman ($0.50 · 6 Bilood / 180 Days)
UPDATE public.pro_settings
   SET value = '252610999089'
 WHERE key = 'whatsapp';

UPDATE public.pro_settings
   SET value = '$0.50 · 6 Bilood'
 WHERE key = 'price_text';

UPDATE public.pro_settings
   SET value = '180'
 WHERE key = 'days';

UPDATE public.pro_settings
   SET value = '[{"name":"EVC Plus","number":"610999089","holder":"Shuceyb Abdirahman"}]'
 WHERE key = 'methods';

-- Ensure grants remain strict
REVOKE ALL ON FUNCTION public.pro_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pro_status(text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.pro_redeem(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pro_redeem(text, text) TO anon, authenticated;

-- 5. Predict Exam Rankings Table & RPCs (Real student results only)
CREATE TABLE IF NOT EXISTS public.predict_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id_short text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('school', 'jus')),
  subject_id text NOT NULL,
  subject_name text NOT NULL,
  student_name text NOT NULL,
  score_pct integer NOT NULL CHECK (score_pct BETWEEN 0 AND 100),
  correct_count integer NOT NULL CHECK (correct_count >= 0),
  total_questions integer NOT NULL CHECK (total_questions BETWEEN 1 AND 200),
  elapsed_sec integer NOT NULL CHECK (elapsed_sec >= 0 AND elapsed_sec <= 14400),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.predict_rankings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.predict_rankings FROM anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_predict_rankings_scope_score
  ON public.predict_rankings (scope, score_pct DESC, correct_count DESC, elapsed_sec ASC, created_at ASC);

CREATE OR REPLACE FUNCTION public.submit_predict_ranking(
  p_device text,
  p_scope text,
  p_subject_id text,
  p_subject_name text,
  p_student_name text,
  p_score_pct integer,
  p_correct_count integer,
  p_total_questions integer,
  p_elapsed_sec integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dev text := trim(coalesce(p_device, ''));
  v_short text;
  v_name text;
  v_id uuid;
BEGIN
  IF length(v_dev) < 16 OR lower(v_dev) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous') THEN
    RAISE EXCEPTION 'bad_device';
  END IF;
  IF p_scope NOT IN ('school', 'jus') THEN
    RAISE EXCEPTION 'bad_scope';
  END IF;
  IF p_total_questions < 1 OR p_total_questions > 200 OR p_correct_count < 0 OR p_correct_count > p_total_questions THEN
    RAISE EXCEPTION 'bad_score';
  END IF;

  v_short := upper(left(regexp_replace(v_dev, '^hkd_', ''), 5) || '-' || right(regexp_replace(v_dev, '^hkd_', ''), 4));
  v_name := left(regexp_replace(trim(coalesce(p_student_name, 'Arday')), '[<>`"'']', '', 'g'), 36);
  IF v_name = '' THEN
    v_name := 'Arday';
  END IF;

  INSERT INTO public.predict_rankings (
    device_id_short,
    scope,
    subject_id,
    subject_name,
    student_name,
    score_pct,
    correct_count,
    total_questions,
    elapsed_sec
  )
  VALUES (
    v_short,
    p_scope,
    left(trim(p_subject_id), 40),
    left(trim(p_subject_name), 64),
    v_name,
    greatest(0, least(100, p_score_pct)),
    p_correct_count,
    p_total_questions,
    greatest(0, least(14400, p_elapsed_sec))
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('ok', true, 'id', v_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.public_predict_rankings(
  p_scope text,
  p_subject_id text DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_limit integer := greatest(1, least(100, coalesce(p_limit, 50)));
  v_items jsonb;
BEGIN
  IF p_scope NOT IN ('school', 'jus') THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT coalesce(jsonb_agg(t), '[]'::jsonb)
    INTO v_items
    FROM (
      SELECT
        id,
        device_id_short,
        scope,
        subject_id,
        subject_name,
        student_name,
        score_pct,
        correct_count,
        total_questions,
        elapsed_sec,
        extract(epoch from created_at) * 1000 AS submitted_at
      FROM public.predict_rankings
      WHERE scope = p_scope
        AND (p_subject_id IS NULL OR p_subject_id = 'all' OR subject_id = p_subject_id)
      ORDER BY score_pct DESC, correct_count DESC, elapsed_sec ASC, created_at ASC
      LIMIT v_limit
    ) t;

  RETURN v_items;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_predict_ranking(text, text, text, text, text, integer, integer, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_predict_ranking(text, text, text, text, text, integer, integer, integer, integer) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.public_predict_rankings(text, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_predict_rankings(text, text, integer) TO anon, authenticated;

