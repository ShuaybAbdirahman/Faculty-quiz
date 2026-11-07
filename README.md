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
| `lib/data.dart` | 12 kulliyadood, 67 su'aalood, kooxaha (3 luqadood) |
| `lib/i18n.dart` | Turjumaadda UI (`tr`, `trf`, `tx`) |
| `web/index.html`, `web/og-image.jpg` | Link preview (WhatsApp/Telegram) |
| `.github/workflows/pages.yml` | Dhis iyo daabac GitHub Pages |

## Daabac GitHub Pages (domain la'aan)
1. Ku soo rar mashruuca dhan GitHub (branch `main`).
2. Repo → **Settings → Pages → Source: GitHub Actions**.
3. Tab-ka **Actions**: sug workflow-ga (~3-5 daqiiqo). Link-gu waa `https://USERNAME.github.io/REPO/`.
4. Haddii ay fashilanto, fur workflow-ga fashilmay oo koobi qoraalka khaladka.

## Khusuusiga
Magaca ardayga (ikhtiyaari) waa hambalyo oo kaliya, ku hadha xusuusta app-ka, lamana diro. Natiijadu waxay ku hadhaysaa qalabka. App-ku server ma isticmaalo; wax xog ah lama diro.

## Link preview (WhatsApp)
`web/index.html` (Open Graph) iyo `web/og-image.jpg` (1200×630). Workflow-gu si toos ah ayuu `YOUR-DOMAIN` ugu beddelaa link-gaaga runta ah. WhatsApp wuu keydiyaa preview-ga hore; si loo cusboonaysiiyo ku dar `?v=2` link-ga. Naqshadda: `design/og-image.html`.

## Xusuus
- Turjumaadda English iyo Carabi waxaa qoray AI; ha la hubiyo qof afkaas ku hadla.
- Sawirrada rasmiga ah ee kulliyadaha (ikhtiyaari): `assets/faculties/` (eeg `README.txt`).
- Ma aha imtixaan rasmi ah; u isticmaal hage.

## Shatiga
Xuquuqda oo dhan waa dhowran tahay. Eeg [`LICENSE`](LICENSE).
