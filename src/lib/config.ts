export const supabaseUrl: string =
  import.meta.env.VITE_SUPABASE_URL || "https://dmwhyltkdjvnehyhtjak.supabase.co";

export const supabaseAnonKey: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_KJ3maGBUGCpUEn7vA464Ug_xUzJqGfU";

export const backendEnabled: boolean = Boolean(supabaseUrl && supabaseAnonKey);

export function supaHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    apikey: supabaseAnonKey,
    "Content-Type": "application/json",
  };
  if (!supabaseAnonKey.startsWith("sb_")) {
    h["Authorization"] = `Bearer ${supabaseAnonKey}`;
  }
  return h;
}
