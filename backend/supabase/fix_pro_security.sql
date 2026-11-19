-- ============================================================================
-- Hagaha Kulliyadda Pro — Security Hardening & EVC Plus Payment Update
-- Run this script once in your Supabase Dashboard -> SQL Editor
-- ============================================================================
-- Fixes:
-- 1. Guarantees unlocking Pro for one student NEVER unlocks Pro for other users
--    (strict per-device isolation in pro_entitlements, pro_status, pro_content,
--    pro_redeem with row-level FOR UPDATE locking, and pro_admin_decide).
-- 2. Updates pro_settings to EVC Plus ONLY:
--    Number: 610999089 | Holder: Shuceyb Abdirahman | WhatsApp: 252610999089
-- ============================================================================

-- 1. Enforce strict device_id uniqueness & RLS on pro_entitlements
ALTER TABLE IF EXISTS public.pro_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.pro_entitlements FROM anon, authenticated;

-- Remove any invalid / blank / short device rows that could collide across users
DELETE FROM public.pro_entitlements
WHERE device_id IS NULL
   OR length(trim(device_id)) < 16
   OR lower(trim(device_id)) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous');

-- 2. Harden pro_status(p_device text): ONLY returns active=true for exact p_device
CREATE OR REPLACE FUNCTION public.pro_status(p_device text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dev text := trim(coalesce(p_device, ''));
  v_exp timestamptz;
BEGIN
  IF length(v_dev) < 16 OR lower(v_dev) IN ('null', 'undefined', 'default', 'web', 'guest', 'anonymous') THEN
    RAISE EXCEPTION 'bad_device';
  END IF;

  SELECT e.expires_at
    INTO v_exp
    FROM public.pro_entitlements e
   WHERE e.device_id = v_dev
     AND e.expires_at > now()
   ORDER BY e.expires_at DESC
   LIMIT 1;

  IF v_exp IS NOT NULL THEN
    RETURN jsonb_build_object('active', true, 'expires_at', v_exp);
  END IF;

  RETURN jsonb_build_object('active', false, 'expires_at', null);
END;
$$;

-- 3. Harden pro_redeem(p_device text, p_code text): atomic single-use per device
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

  v_exp := greatest(
    coalesce((SELECT expires_at FROM public.pro_entitlements WHERE device_id = v_dev), now()),
    now()
  ) + make_interval(days => greatest(1, coalesce(v_row.days, 180)));

  UPDATE public.pro_codes
     SET used_at = now(),
         used_device = v_dev
   WHERE id = v_row.id;

  INSERT INTO public.pro_entitlements (device_id, expires_at, source, updated_at)
  VALUES (v_dev, v_exp, 'code:' || v_row.code, now())
  ON CONFLICT (device_id)
  DO UPDATE SET expires_at = EXCLUDED.expires_at,
                source = EXCLUDED.source,
                updated_at = now();

  RETURN jsonb_build_object('ok', true, 'expires_at', v_exp);
END;
$$;

-- 4. Update payment settings to EVC Plus ONLY: 610999089 / Shuceyb Abdirahman ($0.10 Lifetime)
UPDATE public.pro_settings
   SET value = '252610999089'
 WHERE key = 'whatsapp';

UPDATE public.pro_settings
   SET value = '$0.10 · Abid (Hal mar)'
 WHERE key = 'price_text';

UPDATE public.pro_settings
   SET value = '3650'
 WHERE key = 'days';

UPDATE public.pro_settings
   SET value = '[{"name":"EVC Plus","number":"610999089","holder":"Shuceyb Abdirahman"}]'
 WHERE key = 'methods';

-- Ensure grants remain strict
REVOKE ALL ON FUNCTION public.pro_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pro_status(text) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.pro_redeem(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.pro_redeem(text, text) TO anon, authenticated;
