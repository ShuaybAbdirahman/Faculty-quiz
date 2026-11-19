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
import { ProPaywallScreen, type ProPlanType } from "./screens/ProPaywallScreen";
import { ProHubScreen, type HubTab } from "./screens/ProHubScreen";

type Route =
  | { name: "welcome" }
  | { name: "founder"; after: "quiz" | "back" }
  | { name: "quiz" }
  | { name: "result"; outcome: QuizOutcome }
  | { name: "compare"; outcome: QuizOutcome }
  | { name: "settings" }
  | { name: "reviews" }
  | { name: "pro_hub"; tab?: HubTab; facultyId?: string }
  | { name: "pro_guide"; faculty: Faculty; outcome: QuizOutcome }
  | { name: "pro_paywall"; faculty?: Faculty; outcome?: QuizOutcome; plan?: ProPlanType };

function initialStack(): Route[] {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autostart") === "1") {
      return [{ name: "welcome" }, { name: "quiz" }];
    }
  }
  return [{ name: "welcome" }];
}

function AppShell() {
  const { darkMode, animationsOn, founderIntroSeen, proActive, refreshPro } = useApp();
  const [stack, setStack] = useState<Route[]>(initialStack);

  const current = stack[stack.length - 1];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [current]);

  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const replace = (r: Route) => setStack((s) => [...s.slice(0, -1), r]);
  const resetToWelcome = () => setStack([{ name: "welcome" }]);

  const handleOpenPro = async (faculty: Faculty, outcome: QuizOutcome) => {
    const verified = proActive ? await refreshPro() : false;
    if (verified) {
      push({ name: "pro_guide", faculty, outcome });
    } else {
      push({ name: "pro_paywall", faculty, outcome });
    }
  };

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
          onOpenProHub={(tab, facultyId) => push({ name: "pro_hub", tab, facultyId })}
          onOpenPaywall={() => push({ name: "pro_paywall" })}
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
            void handleOpenPro(faculty, current.outcome);
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
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "languages" })}
        />
      );
      break;
    case "reviews":
      screen = <ReviewsScreen onBack={pop} />;
      break;
    case "pro_hub":
      screen = (
        <ProHubScreen
          initialTab={current.tab}
          initialFacultyId={current.facultyId}
          onBack={pop}
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "departments" })}
        />
      );
      break;
    case "pro_guide":
      screen = (
        <ProGuideScreen
          faculty={current.faculty}
          ratings={current.outcome.ratings}
          onBack={pop}
          onLocked={() =>
            replace({ name: "pro_paywall", faculty: current.faculty, outcome: current.outcome, plan: "departments" })
          }
        />
      );
      break;
    case "pro_paywall":
      screen = (
        <ProPaywallScreen
          initialPlan={current.plan ?? "departments"}
          onBack={pop}
          onUnlocked={() => {
            if (current.faculty && current.outcome) {
              replace({ name: "pro_guide", faculty: current.faculty, outcome: current.outcome });
            } else {
              replace({ name: "pro_hub", tab: "roadmaps" });
            }
          }}
        />
      );
      break;
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 ${!animationsOn ? "no-anim" : ""} ${
        darkMode ? "bg-[#090F1E] text-[#EEF2FF]" : "bg-[#F6F8FC] text-[#0F172A]"
      }`}
    >
      {screen}
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
