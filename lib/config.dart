// Habaynta Supabase (backend). Labadan qiimood waa DADWEYNE oo la ogol yahay in ay ku jiraan koodhka
// (anon / publishable key). Amniga waxaa leh RLS ee `backend/supabase/schema.sql`, ma aha qarsoodiga furaha.
// HA GELIN "service_role" key halkan waligaa.
//
// Haddii labaduba madhan yihiin, app-ku wuxuu u shaqeeyaa sida caadiga ah, kaarka diiwaangelinta wuu qarsoon yahay.
const String supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: '');
const String supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');
