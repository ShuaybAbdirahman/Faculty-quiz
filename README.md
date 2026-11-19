# Hagaha Kulliyadda

A React + TypeScript + Vite web application that helps high school graduates choose the university faculty best suited to their interests, aptitudes, and priorities. 25–30 adaptive questions (~8 minutes) → top 3 matching faculties with percentages, breakdown, departments, careers, and tips.

**Languages:** Soomaali · English · العربية (RTL) &nbsp;|&nbsp; **Theme:** Light / Dark &nbsp;|&nbsp; **Scoring:** Adaptive simplified Holland RIASEC

## Getting Started

```bash
npm install
npm run dev
```

The development server listens on `http://0.0.0.0:3000`.

## Build & Type-Check

```bash
npm run build
npm run lint
```

## Project Structure

- `src/App.tsx` — Navigation stack and responsive centered shell
- `src/context/AppContext.tsx` — Preferences (`localStorage`), i18n, theme, animations, text scale, Pro status
- `src/data/` — 14 faculties, 67 questions, 5 sections, 179 UI translations (Soomaali, English, Arabic), QR matrix, Pro trait labels, founder photo
- `src/lib/scoring.ts` — Adaptive screening plan builder, RIASEC matching engine, and Pro department ranking
- `src/lib/api.ts` — Supabase RPC client for anonymous result saving, student reviews, and Pro Department Guide
- `src/screens/` — Welcome, Founder Intro, Quiz, Result (+ Celebration), Compare, Settings, Reviews, Pro Guide, and Pro Paywall screens
- `src/components/` — Aurora hero, ShinyButton, FacultyBanner, ShareCard (with 1080×1440 PNG Canvas export), SaveResultCard, and Reviews UI
- `admin/index.html` — Admin dashboard (preserved)

## Privacy

The student's optional name stays in local browser storage and is never sent with quiz results. Quiz results can be saved anonymously only with explicit consent.

## License

All rights reserved. See [`LICENSE`](LICENSE).
