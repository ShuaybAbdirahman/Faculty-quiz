# CAAWIYE

A React + TypeScript + Vite web application built for Somali students, combining three distinct academic stages in one Somalia Flag Blue (`#4189DD` & `#165FB8`) platform: **School (Form 4)**, **Gap (School-to-University)**, and **University (Hagaha Kulliyadda)**.

- **Languages:** Soomaali (mandatory for School & Gap) · Soomaali / English / العربية (RTL) for University
- **Theme:** Somalia Flag Blue Dark Mode (`#051428`) & Crisp Ice-Blue Light Mode (`#F1F6FD`)
- **Typography:** `Bricolage Grotesque` + `DM Sans`

## Three Core Sections

1. **01 · School (Form 4 National Exam, June 2027)** *(Somali Sky Blue)*
   - Covers all 12 Form 4 national exam subjects across Science (Biology, Chemistry, Physics, Math), Languages (Soomaali, English, Arabic), Humanities & Applied Studies (History, Geography, Business, Technology, Islamic Studies).
   - Prepared with clean upload-ready structures for free subject PDFs and `$0.10` Predict Exams per subject ahead of the **June 2027** exams.
2. **02 · Gap (University Entrance & Bridging, October 2027)** *(Emerald Teal)*
   - Dedicated bridge between high school graduation and university admission (including Somali National University / JUS entrance competition tracks).
   - Prepared with upload-ready containers for free PDFs, `$0.10` Predict Exams, 90-day readiness schedules, and transition problem-solving guides ahead of **October 2027**.
3. **03 · University (Hagaha Kulliyadda & Pro Hub)** *(Royal Indigo & Gold)*
   - Adaptive 25 to 30-question Holland RIASEC assessment (~8 minutes) matching students to their top 3 out of 14 university faculties.
   - Includes side-by-side comparison, 1080x1440 share card & promo poster PNG export, student reviews, and the Pro Hub (`$0.10` one-time unlock) featuring department guides, roadmaps, Somalia universities directory, Somalia & global role models, AI & 2030 insights, and 90-day action plans.

## Getting Started

```bash
npm install
npm run dev
```

The development server listens on `http://0.0.0.0:3000`.

## Build, Type-Check & Tests

```bash
npm run build
npm run lint
npx tsx --test src/lib/proSecurity.test.ts src/lib/quizQuality.test.ts
```

## Project Structure

- `src/App.tsx` - Navigation stack, responsive centered shell, and Somalia Flag Blue theming
- `src/context/AppContext.tsx` - Preferences (`localStorage`), i18n, Dark/Light theme, animations, text scale, and Pro unlock state
- `src/screens/` - `HomeScreen` (3-section entry & live June/Oct 2027 countdowns), `SchoolForm4Screen`, `BridgingPrepScreen`, `WelcomeScreen`, `FounderIntroScreen`, `QuizScreen`, `ResultScreen`, `CompareScreen`, `SettingsScreen`, `ReviewsScreen`, `ProGuideScreen`, `ProHubScreen`, and `ProPaywallScreen`
- `src/components/` - `ModernUI` (`SomaliStarIcon`, `ShinyButton`, banners), `HeroSpotlightTicker`, `PredictExamRunner`, `ProHubContent`, `ProWorldHubSections`, `ShareCard`, `PromoPosterModal`, `SaveResultCard`, and `ReviewsComponents`
- `src/data/` - `schoolForm4Data` (12 Form 4 subjects, June 2027), `bridgingPrepData` (Gap & JUS tracks, October 2027), 14 faculties, 67 RIASEC questions, Pro Hub & role model datasets, Somalia universities, translations, and QR matrix
- `src/lib/` - Adaptive RIASEC scoring (`scoring.ts`), Pro security & gating (`proSecurity.ts`), ticker metadata (`heroTicker.ts`), API client (`api.ts`), and unit tests (`*.test.ts`)
- `admin/index.html` - Admin dashboard

## Privacy

The student's optional name stays in local browser storage and is never sent with quiz results. Quiz results can be saved anonymously only with explicit consent.

## License

All rights reserved. See [`LICENSE`](LICENSE).
