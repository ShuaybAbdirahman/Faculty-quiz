import React, { useEffect, useState } from "react";
import type { Faculty } from "./data/quizData";
import type { ProItemKey } from "./lib/proSecurity";
import { backendEnabled } from "./lib/config";
import { AppProvider, useApp } from "./context/AppContext";
import { HomeScreen } from "./screens/HomeScreen";
import { SchoolForm4Screen } from "./screens/SchoolForm4Screen";
import { BridgingPrepScreen, type BridgingSectionTab } from "./screens/BridgingPrepScreen";
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
import { BottomNavBar, type MainNavTab } from "./components/BottomNavBar";

type Route =
  | { name: "home" }
  | { name: "school"; subjectId?: string }
  | { name: "bridging"; section?: BridgingSectionTab }
  | { name: "faculty_home" }
  | { name: "founder"; after: "quiz" | "back" }
  | { name: "quiz" }
  | { name: "result"; outcome: QuizOutcome }
  | { name: "compare"; outcome: QuizOutcome }
  | { name: "settings" }
  | { name: "reviews" }
  | { name: "pro_hub"; tab?: HubTab; facultyId?: string }
  | { name: "pro_guide"; faculty: Faculty; outcome: QuizOutcome }
  | {
      name: "pro_paywall";
      faculty?: Faculty;
      outcome?: QuizOutcome;
      plan?: ProPlanType;
      itemKey?: ProItemKey;
      returnTo?: "school" | "bridging" | "faculty_home";
    };

function initialStack(): Route[] {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autostart") === "1") {
      return [{ name: "home" }, { name: "faculty_home" }, { name: "quiz" }];
    }
  }
  return [{ name: "home" }];
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
  const resetToHome = () => setStack([{ name: "home" }]);
  const resetToFacultyHome = () => setStack([{ name: "home" }, { name: "faculty_home" }]);

  const handleOpenPro = async (faculty: Faculty, outcome: QuizOutcome) => {
    const verified = backendEnabled ? await refreshPro() : proActive;
    if (verified) {
      push({ name: "pro_guide", faculty, outcome });
    } else {
      push({ name: "pro_paywall", faculty, outcome, plan: "total" });
    }
  };

  const handleSelectMainTab = (tab: MainNavTab) => {
    switch (tab) {
      case "home":
        setStack([{ name: "home" }]);
        break;
      case "school":
        setStack([{ name: "home" }, { name: "school" }]);
        break;
      case "bridging":
        setStack([{ name: "home" }, { name: "bridging", section: "exams" }]);
        break;
      case "faculty_home":
        setStack([{ name: "home" }, { name: "faculty_home" }]);
        break;
      case "pro_hub":
        setStack([{ name: "home" }, { name: "pro_hub", tab: "roadmaps" }]);
        break;
    }
  };

  const mainNavTab: MainNavTab | null =
    current.name === "home" ||
    current.name === "school" ||
    current.name === "bridging" ||
    current.name === "faculty_home" ||
    current.name === "pro_hub"
      ? current.name
      : null;

  let screen: React.ReactNode = null;
  switch (current.name) {
    case "home":
      screen = (
        <HomeScreen
          onEnterSchool={(subjectId) => push({ name: "school", subjectId })}
          onEnterBridging={(section) => push({ name: "bridging", section })}
          onEnterFacultyGuide={() => push({ name: "faculty_home" })}
          onOpenProHub={(tab, facultyId) => push({ name: "pro_hub", tab, facultyId })}
          onOpenSettings={() => push({ name: "settings" })}
          onOpenReviews={() => push({ name: "reviews" })}
        />
      );
      break;
    case "school":
      screen = (
        <SchoolForm4Screen
          initialSubjectId={current.subjectId}
          onBackHome={pop}
          onUnlockSubject={(subject) =>
            push({
              name: "pro_paywall",
              plan: "school_subject",
              itemKey: `school:${subject.id}`,
              returnTo: "school",
            })
          }
          onOpenPaywall={() =>
            push({
              name: "pro_paywall",
              plan: "total",
              returnTo: "school",
            })
          }
        />
      );
      break;
    case "bridging":
      screen = (
        <BridgingPrepScreen
          initialSection={current.section}
          onBackHome={pop}
          onUnlockBridge={(track) =>
            push({
              name: "pro_paywall",
              plan: "bridge_exam",
              itemKey: `bridge:${track.id}`,
              returnTo: "bridging",
            })
          }
          onOpenPaywall={() =>
            push({
              name: "pro_paywall",
              plan: "total",
              returnTo: "bridging",
            })
          }
        />
      );
      break;
    case "faculty_home":
      screen = (
        <WelcomeScreen
          onBackHome={resetToHome}
          onStart={() => {
            if (founderIntroSeen) push({ name: "quiz" });
            else push({ name: "founder", after: "quiz" });
          }}
          onOpenSettings={() => push({ name: "settings" })}
          onOpenReviews={() => push({ name: "reviews" })}
          onOpenProHub={(tab, facultyId) => push({ name: "pro_hub", tab, facultyId })}
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "total" })}
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
          onRestart={resetToFacultyHome}
          onOpenPro={(faculty) => {
            void handleOpenPro(faculty, current.outcome);
          }}
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "total" })}
        />
      );
      break;
    case "compare":
      screen = (
        <CompareScreen
          matches={current.outcome.matches}
          onBack={pop}
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "total" })}
        />
      );
      break;
    case "settings":
      screen = (
        <SettingsScreen
          onBack={pop}
          onOpenFounderIntro={() => push({ name: "founder", after: "back" })}
          onOpenReviews={() => push({ name: "reviews" })}
          onLangChanged={resetToFacultyHome}
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
          onOpenPaywall={() => push({ name: "pro_paywall", plan: "total" })}
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
            replace({ name: "pro_paywall", faculty: current.faculty, outcome: current.outcome, plan: "total" })
          }
        />
      );
      break;
    case "pro_paywall":
      screen = (
        <ProPaywallScreen
          initialPlan={current.plan ?? "total"}
          initialItemKey={current.itemKey}
          onBack={pop}
          onUnlocked={(unlockedItem) => {
            if (current.returnTo === "school") {
              const sid = unlockedItem?.startsWith("school:") ? unlockedItem.slice("school:".length) : undefined;
              replace({ name: "school", subjectId: sid });
            } else if (current.returnTo === "bridging") {
              replace({ name: "bridging", section: "exams" });
            } else if (current.faculty && current.outcome) {
              replace({ name: "pro_guide", faculty: current.faculty, outcome: current.outcome });
            } else if (current.plan === "languages") {
              pop();
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
        darkMode ? "bg-[#051428] text-[#EEF5FF]" : "bg-[#F1F6FD] text-[#081A33]"
      }`}
    >
      {screen}
      {mainNavTab && <BottomNavBar activeTab={mainNavTab} onSelect={handleSelectMainTab} />}
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
