# HIRAAL (CAAWIYE)

A modern React + TypeScript + Vite web application built for Somali students, uniting academic guidance, national exam preparation, university entrance training, and career readiness in one Somalia Flag Blue (`#4189DD` & `#165FB8`) and Gold (`#FFC93C`) platform.

- **Languages:** Soomaali (mandatory for School & Diyaarinta Jaamacadda) · Soomaali / English / العربية (RTL) for University & Hagaha Kulliyadda
- **Theme:** Deep Navy Dark Mode (`#0B1324`) & Crisp Slate Light Mode (`#F8FAFC`)
- **Typography:** `Outfit` (Display) + `Plus Jakarta Sans` (Body) + `Cairo` / `Amiri` (Arabic RTL)

## Core Academic Tracks

1. **School (Form 4 National Exam, June 2027)**
   - Covers all 12 official Form 4 subjects across Science (Biology, Chemistry, Physics, Math), Languages (Soomaali, English, Arabic), Humanities & Applied Studies (History, Geography, Business, Technology, Islamic Studies).
   - Free public past-paper PDF archives (`2018`-`2026` upload-ready), official blueprint Predict Exams, and live Form 4 leaderboards.
2. **Diyaarinta Jaamacadda (October 2027)**
   - General university entrance preparation across the 5 core entrance subjects (Biology, Chemistry, Physics, Math, and English) covering Somali universities and national competitive tracks such as JUS.
   - Includes a structured 90-day university readiness tracker, Somali student challenge guides, and Predict Exam rankings.
3. **Jaamacad (Hagaha Kulliyadda & RIASEC Assessment)**
   - Adaptive 25 to 30-question Holland RIASEC assessment (~8 minutes) matching students to their top 3 out of 14 university faculties.
   - Includes side-by-side comparison, 1080x1440 share card & promo poster PNG export, student reviews, and deep faculty department precision guides (70 faculty-tailored questions).
4. **HIRAAL Pro (Per-Stage & Progressive Levels 1, 2, 3+)**
   - Independent stage unlocks: **School (Form 4)**, **Diyaarinta Jaamacadda**, and **University (Hagaha Kulliyadda)**, plus an optional **Total (-20%)** bundle.
   - Progressive **Levels 1, 2 & 3+** bound to **Asbuucle (Level 1)**, **Bille (Level 2)**, and **Sanadle (Level 3+)** via a 3-step guided EVC Plus checkout (merchant details revealed only at final confirmation step) or activation code:
     - **Heerka 1 (Weekly):** Student GPA & Focus Tools + 70 Department Precision Questions.
     - **Heerka 2 (Monthly):** Top-10 Study Strategies & 12-Subject Secrets, Somalia Universities Directory, Future Job Market Outlook (2025-2030), and Exam Rankings.
     - **Heerka 3+ (Yearly):** Complete Career Roadmaps, 21st-Century Pioneers (Somalia & World), International Scholarship & Growth Strategies, and Multi-Stage Mastery.
   - Protected by `ProContentShield` (device-bound signed entitlements with scope + level signatures, shortcut/print/copy prevention, idle privacy lock, and subtle personal watermark).

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
npx tsx --test src/lib/*.test.ts
```

## Project Structure

- `src/App.tsx` - Navigation stack, responsive layout shell, and persistent bottom navigation (`BottomNavBar`)
- `src/context/AppContext.tsx` - Local preferences (`localStorage`), i18n, Dark/Light theme, animations, text scale, and device-bound Pro entitlement sync
- `src/screens/` - `HomeScreen`, `SchoolForm4Screen`, `BridgingPrepScreen`, `WelcomeScreen`, `FounderIntroScreen`, `QuizScreen`, `ResultScreen`, `CompareScreen`, `SettingsScreen`, `ReviewsScreen`, `ProGuideScreen`, `ProHubScreen`, and `ProPaywallScreen`
- `src/components/` - `ProStudentTools`, `ProContentShield`, `ProHubContent`, `ProWorldHubSections`, `TopStudentHubSection`, `PredictExamRunner`, `PredictRankingBoard`, `BottomNavBar`, `ModernUI`, `HeroSpotlightTicker`, `ShareCard`, `PromoPosterModal`, `SaveResultCard`, and `ReviewsComponents`
- `src/data/` - Official Form 4 & University Entrance structures, 14 faculties, 67 RIASEC questions, 70 Pro department questions, ethical Top-10 guides, roadmaps, Somalia universities, and translations
- `src/lib/` - Adaptive RIASEC scoring (`scoring.ts`), Pro security & billing (`proSecurity.ts`), GPA & study tools (`proTools.ts`), rankings (`predictRanking.ts`), API client (`api.ts`), and `node:test` suites (`*.test.ts`)
- `backend/` & `admin/` - Backend verification service and admin dashboard

## Privacy & Academic Integrity

The student's optional name stays in local browser storage and is never shared unexpectedly. HIRAAL strictly prohibits exam cheating and focuses exclusively on lawful past-paper mastery and ethical study strategies.

## License

All rights reserved. See [`LICENSE`](LICENSE).
