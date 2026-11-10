# Hagaha Kulliyadda

App Flutter ah (web + mobile) oo ardayda dhammeysatay dugsiga sare ka caawiya inay doortaan kulliyadda ugu habboon. 25-30 su'aalood (~8 daqiiqo) → saddex kulliyadood oo ugu habboon, boqolkiiba, sababta, waaxaha iyo shaqooyinka.

**Luqadaha:** Soomaali · English · العربية (RTL) &nbsp;|&nbsp; **Mawduuc:** Iftiin / Mugdi &nbsp;|&nbsp; **Falanqayn:** Holland RIASEC oo la fududeeyay (adaptive)

🔗 **Tijaabi:** `https://USERNAME.github.io/REPO/` (ku beddel magacaaga iyo magaca repo-ga)

## Bilow degdeg ah
```bash
flutter create . --platforms=web,android   # hal mar (abuura web/, android/)
flutter pub get
flutter run -d chrome
```
Waxay u baahan tahay Flutter ≥ 3.27 (Dart ≥ 3.6).

## Qaab dhismeedka
| Fayl | Waxa uu qabto |
|---|---|
| `lib/main.dart` | UI, xisaabta ku habboonaanta, animation-ka |
| `lib/data.dart` | 14 kulliyadood (guud, dalka iyo caalamka), 67 su'aalood, kooxaha (3 luqadood) |
| `lib/i18n.dart` | Turjumaadda UI (`tr`, `trf`, `tx`) |
| `web/index.html`, `web/og-image.jpg` | Link preview (WhatsApp/Telegram) |
| `lib/config.dart`, `results_api.dart`, `save_card.dart` | Backend (Supabase), ogolaansho iyo diris |
| `lib/prefs.dart`, `settings_screen.dart` | Xusuusta dejinta iyo bogga Dejinta |
| `lib/reviews_api.dart`, `reviews_ui.dart` | Fikirrada ardayda (xiddigo + qoraal) |
| `backend/supabase/schema.sql` | Shaxanka, amniga (RLS) iyo dashboard SQL (+ `update_faculties.sql` oo loo isticmaalo isbeddelka kulliyadaha) |
| `admin/index.html` | Bogga maamulaha (`/admin/`) |
| `.github/workflows/pages.yml` | Dhis iyo daabac GitHub Pages |

## Daabac GitHub Pages (domain la'aan)
1. Ku soo rar mashruuca dhan GitHub (branch `main`).
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Tab-ka **Actions**: sug workflow-ga (~3-5 daqiiqo). Link-gu waa `https://USERNAME.github.io/REPO/`.
4. Haddii ay fashilanto, fur workflow-ga fashilmay oo koobi qoraalka khaladka.

## Backend (ikhtiyaari)
Eeg [`backend/README.md`](backend/README.md). Haddii `lib/config.dart` madhan yahay, app-ku wuu shaqeeyaa sidii hore oo kaarka diiwaangelinta wuu qarsoon yahay.

## Khusuusiga
Magaca ardayga (ikhtiyaari) waa hambalyo oo kaliya, wuxuu ku hadhaa xusuusta app-ka. Magaca waligiis lama diro. Natiijada waxaa la diiwaangelin karaa **magac la'aan** kaliya haddii ardaygu oggolaado.

## Link preview (WhatsApp)
`web/index.html` (Open Graph) iyo `web/og-image.jpg` (1200×630). Workflow-gu si toos ah ayuu `YOUR-DOMAIN` ugu beddelaa link-gaaga runta ah. WhatsApp wuu keydiyaa preview-ga hore; si loo cusboonaysiiyo ku dar `?v=2` link-ga. Naqshadda: `design/og-image.html`.

## Xusuus
- Turjumaadda English iyo Carabi waxaa qoray AI; ha la hubiyo qof afkaas ku hadla.
- Sawirrada rasmiga ah ee kulliyadaha (ikhtiyaari): `assets/faculties/` (eeg `README.txt`).
- Ma aha imtixaan rasmi ah; u isticmaal hage.

## Shatiga
Xuquuqda oo dhan waa dhowran tahay. Eeg [`LICENSE`](LICENSE).
