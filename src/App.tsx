import React, { useEffect, useState } from "react";
import type { Faculty } from "./data/quizData";
import { AppProvider, useApp } from "./context/AppContext";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { FounderIntroScreen } from "./screens/FounderIntroScreen";
import { QuizScreen, type QuizOutcome } from "./screens/QuizScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ReviewsScreen } from "./screens/ReviewsScreen";
import { ProGuideScreen } from "./screens/ProGuideScreen";
import { ProPaywallScreen } from "./screens/ProPaywallScreen";

type Route =
  | { name: "welcome" }
  | { name: "founder"; after: "quiz" | "back" }
  | { name: "quiz" }
  | { name: "result"; outcome: QuizOutcome }
  | { name: "compare"; outcome: QuizOutcome }
  | { name: "settings" }
  | { name: "reviews" }
  | { name: "pro_guide"; faculty: Faculty; outcome: QuizOutcome }
  | { name: "pro_paywall"; faculty: Faculty; outcome: QuizOutcome };

function AppShell() {
  const { darkMode, animationsOn, founderIntroSeen, proActive } = useApp();
  const [stack, setStack] = useState<Route[]>([{ name: "welcome" }]);

  const current = stack[stack.length - 1];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [current]);

  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const replace = (r: Route) => setStack((s) => [...s.slice(0, -1), r]);
  const resetToWelcome = () => setStack([{ name: "welcome" }]);

  let screen: React.ReactNode = null;
  switch (current.name) {
    case "welcome":
      screen = (
        <WelcomeScreen
          onStart={() => {
            if (founderIntroSeen) push({ name: "quiz" });
            else push({ name: "founder", after: "quiz" });
          }}
          onOpenSettings={() => push({ name: "settings" })}
          onOpenReviews={() => push({ name: "reviews" })}
        />
      );
      break;
    case "founder":
      screen = (
        <FounderIntroScreen
          onContinue={() => {
            if (current.after === "quiz") replace({ name: "quiz" });
            else pop();
          }}
        />
      );
      break;
    case "quiz":
      screen = (
        <QuizScreen
          onBackHome={pop}
          onComplete={(outcome) => replace({ name: "result", outcome })}
        />
      );
      break;
    case "result":
      screen = (
        <ResultScreen
          matches={current.outcome.matches}
          answered={current.outcome.answered}
          planLen={current.outcome.planLen}
          profile={current.outcome.profile}
          onCompare={() => push({ name: "compare", outcome: current.outcome })}
          onRestart={resetToWelcome}
          onOpenPro={(faculty) => {
            if (proActive) {
              push({ name: "pro_guide", faculty, outcome: current.outcome });
            } else {
              push({ name: "pro_paywall", faculty, outcome: current.outcome });
            }
          }}
        />
      );
      break;
    case "compare":
      screen = <CompareScreen matches={current.outcome.matches} onBack={pop} />;
      break;
    case "settings":
      screen = (
        <SettingsScreen
          onBack={pop}
          onOpenFounderIntro={() => push({ name: "founder", after: "back" })}
          onOpenReviews={() => push({ name: "reviews" })}
          onLangChanged={resetToWelcome}
        />
      );
      break;
    case "reviews":
      screen = <ReviewsScreen onBack={pop} />;
      break;
    case "pro_guide":
      screen = (
        <ProGuideScreen
          faculty={current.faculty}
          ratings={current.outcome.ratings}
          onBack={pop}
          onLocked={() =>
            replace({ name: "pro_paywall", faculty: current.faculty, outcome: current.outcome })
          }
        />
      );
      break;
    case "pro_paywall":
      screen = (
        <ProPaywallScreen
          onBack={pop}
          onUnlocked={() =>
            replace({ name: "pro_guide", faculty: current.faculty, outcome: current.outcome })
          }
        />
      );
      break;
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors ${!animationsOn ? "no-anim" : ""} ${
        darkMode ? "bg-[#080C16] text-[#EEF1FA]" : "bg-[#E4E9F2] text-[#14213D]"
      }`}
    >
      <div
        className={`mx-auto max-w-[720px] min-h-screen shadow-2xl ${
          darkMode ? "bg-[#0E1424]" : "bg-[#F5F7FB]"
        }`}
      >
        {screen}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
