import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { faculties } from "../data/quizData";
import type { FacultyMatch } from "./scoring";
import { buildComparisonMatrix, buildPersonalCareerStrategy } from "./careerFitInsights";

function makeMatch(id: string, percent: number, interest: number, aptitude: number, conditions: number): FacultyMatch {
  const f = faculties.find((item) => item.id === id) ?? faculties[0];
  return {
    f,
    percent,
    interest,
    aptitude,
    conditions,
    reasons: ["Test reason"],
    inPool: true,
  };
}

describe("careerFitInsights Pro Decision Engine", () => {
  it("detects a close race when top 1 and top 2 are within 4%", () => {
    const m1 = makeMatch("cs", 84, 90, 82, 76);
    const m2 = makeMatch("econ", 81, 78, 84, 83);
    const strategy = buildPersonalCareerStrategy([m1, m2], ["Xisaab", "Falanqayn"]);
    assert.ok(strategy);
    assert.equal(strategy.clarityLevel, "close_race");
    assert.equal(strategy.gap, 3);
    assert.equal(strategy.strongestPillar, "Xiisaha");
    assert.equal(strategy.growthPillar, "Qiimaha");
    assert.equal(strategy.actionPlan30Days.length, 3);
  });

  it("detects strong_fit when top 1 leads by 12% or more", () => {
    const m1 = makeMatch("med", 92, 91, 94, 88);
    const m2 = makeMatch("health", 76, 75, 77, 75);
    const strategy = buildPersonalCareerStrategy([m1, m2], ["Caafimaad"]);
    assert.ok(strategy);
    assert.equal(strategy.clarityLevel, "strong_fit");
    assert.equal(strategy.strongestPillar, "Kartida");
    assert.equal(strategy.growthPillar, "Qiimaha");
  });

  it("computes weighted comparison matrix winner and FinTech hybrid advice for cs vs econ", () => {
    const cs = faculties.find((f) => f.id === "cs")!;
    const econ = faculties.find((f) => f.id === "econ")!;
    const mCs = makeMatch("cs", 82, 92, 85, 65);
    const mEcon = makeMatch("econ", 80, 72, 78, 92);

    const passionHeavy = buildComparisonMatrix(cs, econ, mCs, mEcon, {
      interest: 3,
      aptitude: 1,
      conditions: 1,
    });
    assert.equal(passionHeavy.recommended, "a");
    assert.equal(passionHeavy.interestWinner, "a");
    assert.equal(passionHeavy.conditionsWinner, "b");
    assert.ok(passionHeavy.hybridComboNote.includes("FinTech"));
    assert.equal(passionHeavy.decisionQuestions.length, 3);

    const marketHeavy = buildComparisonMatrix(cs, econ, mCs, mEcon, {
      interest: 1,
      aptitude: 1,
      conditions: 4,
    });
    assert.equal(marketHeavy.recommended, "b");
  });
});
