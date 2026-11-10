# Backend: Supabase (xog magac la'aan ah, amni, dashboard)

## Waxa la keydiyo
Marka ardaygu oggolaado: saddexda kulliyadood ee ugu sarreeya + boqolkiiba, luqadda, taariikhda. **Magac, telefoon, meel: MAYA.**
Ka-hortagga spam: hash la gooyay (md5 + erayga sirta ah) oo ka yimid IP, lama keydiyo IP-ga dhabta ah.

## Amniga (sida uu u shaqeeyo)
- **RLS** waa shidan: dadweynaha ma akhriyi karo, ma qori karo shaxanka `results` tooska ah.
- Dadweynuhu wuxuu wici karaa **hal hawl**: `submit_result` (waxay hubisaa ogolaansho, kulliyadaha, boqolkiiba, iyo xaddidaad 5 / 10 daqiiqo).
- Xogta akhrisku waa **maamulayaasha** oo kaliya (`admins` shax) iyada oo loo marayo `admin_overview()`.
- `anon` key waa dadweyne (waa ogolyahay in uu ku jiro koodhka). **Ha geliyin `service_role` key waligaa.**

## Dejinta (15 daqiiqo, telefoon ayaa ku filan)
1. `supabase.com` → **New project** (bilaash). Dooro password iyo region.
2. **SQL Editor → New query**: paste-garee waxa ku jira `backend/supabase/schema.sql` → **Run**. Waa inuu yiraahdo "Success".
3. Erayga sirta ah: gudaha SQL, beddel `BEDDEL-ERAYGAN-SIR-AH-1` eray kale oo dheer, kadib Run mar kale.
4. **Authentication → Providers → Email**: dami **"Allow new users to sign up"** (si qof aan kuu soo diiwaangelin).
5. **Authentication → Users → Add user**: email + furaha sirta ah (Auto confirm). Kani waa akoonkaaga maamulaha.
6. **SQL Editor** → orod (beddel email-ka):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'EMAILKAAGA@example.com';
   ```
7. **Project Settings → API** (ama **Connect**): koobiyee **Project URL** iyo **anon / publishable key**.
8. Geli labadaas:
   - `lib/config.dart`: ku dhex qor `defaultValue: '...'` URL iyo key.
   - `admin/index.html`: `SUPABASE_URL` iyo `SUPABASE_ANON_KEY` (kor ka).
9. Commit → sug Actions ✅. Maamulaha: `https://USERNAME.github.io/REPO/admin/`

## Tijaabo
- Qaado imtixaanka app-ka → natiijada hoosteeda ka dooro **Diiwaangeli** → calaamadee → Dir.
- Gal `/admin/` → waa inaad aragtaa tirada.
- Supabase **Table Editor → results**: waa inaad aragtaa safka cusub.

## Xusuus muhiim ah
- Tirtir xogta da'da weyn: eeg qaybta 6 ee `schema.sql`.
- Haddii aad doonayso xogta tooska ah (CSV): bogga maamulaha ayaa leh badhanka **CSV**.
- Free plan: mashruuca wuu "hurdaa" haddii 7 maalmood aan la isticmaalin; Supabase dashboard ka dami "Restore".

## Fikirrada ardayda (xiddigo + qoraal, ansixin ka hor)
1. Supabase -> SQL Editor -> New query: paste-garee `backend/supabase/reviews.sql`.
   Xariiqda `salt constant text := '...'`, ku qor isla erayga sirta ah ee aad hore u isticmaashay.
2. Run. Waa inuu yiraahdo Success.
3. Arday kasta natiijada hoosteeda wuu qori karaa fikir (xiddigo + ugu badnaan 200 xaraf). Fikirku wuxuu galaa **Sugaya**.
4. Gal `/admin/` -> tab-ka **Fikirrada** -> **Ansix** (waa muuqdaa app-ka), **Qari**, ama **Tirtir**.
5. Fikirrada la ansixiyay waxay ka soo muuqdaan bogga hore (**Waxa ay yiraahdaan ardayda**) iyo bogga **Fikirrada ardayda** (Dejinta).

Amniga: dadweynuhu ma gaadhi karo shaxanka; server-ku wuu diidaa xidhiidhada (link), lambarrada taleefanka iyo qoraal dheer; xaddidaad 3 fikir / saacad qof kasta.
