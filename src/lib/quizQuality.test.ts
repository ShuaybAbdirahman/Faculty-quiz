import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { items, faculties } from "../data/quizData";
import { proFacultyQuestions, getProQuestionsForFaculty } from "../data/proQuestions";
import { traitsFrom, rankDepts, type ProDeptData } from "./scoring";

describe("Upgraded Free Quiz Quality", () => {
  it("contains zero legacy elementary/trivial questions (Faadumo, 2 4 6 8, 3 buug)", () => {
    const allText = items
      .map((q) => {
        const opts = q.o ? [...q.o.so, ...q.o.en, ...q.o.ar].join(" ") : "";
        return `${q.t.so} ${q.t.en} ${q.t.ar} ${opts}`;
      })
      .join("\n");

    assert.ok(!allText.includes("Faadumo"), "Legacy Faadumo question must be removed");
    assert.ok(!allText.includes("2, 4, 6, 8"), "Legacy trivial sequence question must be removed");
    assert.ok(!allText.includes("3 buug"), "Legacy trivial multiplication question must be removed");
  });

  it("has 9 university-grade Section 3 aptitude questions with complete trilingual options", () => {
    const sec3 = items.filter((q) => q.s === 3);
    assert.equal(sec3.length, 9);
    for (const q of sec3) {
      assert.ok(q.t.so.length > 15, `SO prompt too short for ${q.k}`);
      assert.ok(q.t.en.length > 15, `EN prompt too short for ${q.k}`);
      assert.ok(q.t.ar.length > 15, `AR prompt too short for ${q.k}`);
      assert.ok(q.o && q.o.so.length === 4 && q.o.en.length === 4 && q.o.ar.length === 4, `Expected 4 trilingual options for ${q.k}`);
      assert.ok(typeof q.a === "number" && q.a >= 0 && q.a < 4, `Invalid answer index for ${q.k}`);
    }
  });
});

describe("Dedicated Pro Faculty Precision Questions", () => {
  it("provides 5 trilingual Pro questions for every single one of the 14 faculties", () => {
    assert.equal(faculties.length, 14);
    for (const f of faculties) {
      const qs = getProQuestionsForFaculty(f.id);
      assert.equal(qs.length, 5, `Faculty ${f.id} should have exactly 5 Pro questions`);
      for (const q of qs) {
        assert.ok(q.t.so.trim().length > 10, `Missing SO text for ${q.id}`);
        assert.ok(q.t.en.trim().length > 10, `Missing EN text for ${q.id}`);
        assert.ok(q.t.ar.trim().length > 10, `Missing AR text for ${q.id}`);
        assert.ok(q.k.length > 0, `Missing trait key for ${q.id}`);
      }
    }
    const totalProQs = Object.values(proFacultyQuestions).reduce((acc, arr) => acc + arr.length, 0);
    assert.equal(totalProQs, 70);
  });

  it("dynamically updates Pro department rankings when Pro answers are provided", () => {
    const sampleDepts: ProDeptData[] = [
      {
        name: "Software Engineering",
        d: { so: "Dhismaha barnaamijyada", en: "Software dev", ar: "هندسة البرمجيات" },
        jobs: { so: ["Developer"], en: ["Developer"], ar: ["مطور"] },
        p: { code: 3, A: 2, ict: 2 },
      },
      {
        name: "AI & Data Science",
        d: { so: "Sirdoonka macmalka ah", en: "AI & Data", ar: "الذكاء الاصطناعي" },
        jobs: { so: ["AI Engineer"], en: ["AI Engineer"], ar: ["مهندس ذكاء اصطناعي"] },
        p: { I: 3, math: 3, code: 1 },
      },
    ];

    const csQuestions = getProQuestionsForFaculty("cs");
    const aiAnswers = csQuestions.map((q) => ({
      k: q.k,
      k2: q.k2,
      v: q.k === "I" || q.k2 === "math" ? 5 : 1,
    }));
    const devAnswers = csQuestions.map((q) => ({
      k: q.k,
      k2: q.k2,
      v: q.k === "code" || q.k2 === "A" ? 5 : 1,
    }));

    const aiRanked = rankDepts(sampleDepts, traitsFrom([], {}, aiAnswers));
    const devRanked = rankDepts(sampleDepts, traitsFrom([], {}, devAnswers));

    assert.equal(aiRanked[0].d.name, "AI & Data Science");
    assert.equal(devRanked[0].d.name, "Software Engineering");
  });
});

import {
  worldFacultyPioneers,
  futureJobsNews,
  highIncomeSkills,
  somaliaStudentGrowthPillars,
} from "../data/proWorldData";

describe("Verified Pro World Hub Data", () => {
  it("ensures every pioneer, future job, skill, and growth pillar has verified HTTPS sources and trilingual copy", () => {
    assert.ok(worldFacultyPioneers.length >= 6);
    for (const p of worldFacultyPioneers) {
      assert.ok(p.sourceUrl.startsWith("https://"), `Invalid sourceUrl for ${p.id}`);
      assert.ok(p.achievement.so.length > 20 && p.achievement.en.length > 20 && p.achievement.ar.length > 20);
    }

    assert.ok(futureJobsNews.length >= 5);
    for (const j of futureJobsNews) {
      assert.ok(j.sourceUrl.startsWith("https://"), `Invalid sourceUrl for ${j.id}`);
      assert.ok(j.summary.so.length > 20 && j.summary.en.length > 20 && j.summary.ar.length > 20);
    }

    assert.ok(highIncomeSkills.length >= 4);
    for (const s of highIncomeSkills) {
      assert.ok(s.freeResourceUrl.startsWith("https://"), `Invalid resource URL for ${s.id}`);
      assert.ok(s.monthPlan.length >= 2);
    }

    assert.ok(somaliaStudentGrowthPillars.length >= 4);
    for (const g of somaliaStudentGrowthPillars) {
      assert.ok(g.verifiedLinks.length >= 2);
      for (const l of g.verifiedLinks) {
        assert.ok(l.url.startsWith("https://"), `Invalid verified link for ${g.id}`);
      }
    }
  });
});

import { baseHeroSlides, buildHeroTickerSlides, getFridaySalawatSlide } from "./heroTicker";

describe("Hero Spotlight Ticker & Automatic Friday Salawat", () => {
  it("contains 10 rich app highlight slides with trilingual copy", () => {
    assert.equal(baseHeroSlides.length, 10);
    for (const s of baseHeroSlides) {
      assert.ok(s.text.so.length > 10 && s.text.en.length > 10 && s.text.ar.length > 10);
    }
  });

  it("automatically switches between Friday Night (Thu 18:00 - Fri 06:59) and Friday Day (Fri 07:00 - Fri 17:59)", () => {
    // 2026-11-19 is Thursday; 2026-11-20 is Friday; 2026-11-21 is Saturday
    const thu1759 = new Date(2026, 10, 19, 17, 59, 0);
    const thu1800 = new Date(2026, 10, 19, 18, 0, 0);
    const fri0659 = new Date(2026, 10, 20, 6, 59, 0);
    const fri0700 = new Date(2026, 10, 20, 7, 0, 0);
    const fri1759 = new Date(2026, 10, 20, 17, 59, 0);
    const fri1800 = new Date(2026, 10, 20, 18, 0, 0);

    assert.equal(getFridaySalawatSlide(thu1759), null);
    assert.equal(getFridaySalawatSlide(thu1800)?.id, "friday_night_salawat");
    assert.ok(getFridaySalawatSlide(thu1800)?.arabicLine?.includes("اللَّهُمَّ صَلِّ"));
    assert.equal(getFridaySalawatSlide(fri0659)?.id, "friday_night_salawat");
    assert.equal(getFridaySalawatSlide(fri0700)?.id, "friday_day_salawat");
    assert.equal(getFridaySalawatSlide(fri1759)?.id, "friday_day_salawat");
    assert.equal(getFridaySalawatSlide(fri1800), null);

    // Build slides prepends the Salawat slide during Friday Eve/Day (11 total) and keeps 10 otherwise
    assert.equal(buildHeroTickerSlides(thu1759).length, 10);
    assert.equal(buildHeroTickerSlides(thu1800).length, 11);
    assert.equal(buildHeroTickerSlides(thu1800)[0].id, "friday_night_salawat");
    assert.equal(buildHeroTickerSlides(fri0700)[0].id, "friday_day_salawat");
  });
});

import { facultyFunPrompts, getFacultyFunPrompt } from "../data/facultyFunPrompts";

describe("Smart-Witty Faculty Fun Prompts", () => {
  it("provides a complete trilingual prompt with quick options and insight for all 14 faculties", () => {
    assert.equal(Object.keys(facultyFunPrompts).length, 14);
    for (const f of faculties) {
      const p = getFacultyFunPrompt(f.id);
      assert.equal(p.facultyId, f.id, `Missing fun prompt for ${f.id}`);
      assert.ok(p.question.so.length > 15 && p.question.en.length > 15 && p.question.ar.length > 15);
      assert.ok(p.quickOptions.so.length >= 3 && p.quickOptions.en.length >= 3 && p.quickOptions.ar.length >= 3);
      assert.ok(p.insight.so.length > 30 && p.insight.en.length > 30 && p.insight.ar.length > 30);
    }
    assert.ok(facultyFunPrompts.cs.question.so.toLowerCase().includes("gamers"));
    assert.ok(facultyFunPrompts.eng.question.so.includes("1 + 1"));
  });
});
