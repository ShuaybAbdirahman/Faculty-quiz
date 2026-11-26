import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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
    assert.ok(worldFacultyPioneers.length >= 10);
    const somaliaPioneers = worldFacultyPioneers.filter((p) => p.region === "somalia");
    const worldPioneers = worldFacultyPioneers.filter((p) => p.region === "world");
    assert.ok(somaliaPioneers.length > worldPioneers.length, "Somalia pioneers must outnumber global pioneers");
    assert.ok(worldPioneers.length >= 4, "Should include verified 21st-century global pioneers");
    for (const p of worldFacultyPioneers) {
      assert.ok(p.region === "somalia" || p.region === "world", `Invalid region for ${p.id}`);
      assert.ok(!p.name.toLowerCase().includes("nikola tesla"), "Legacy historical pioneer Nikola Tesla must be removed");
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
  it("provides a complete trilingual prompt with 3 distinct optionInsights for all 14 faculties", () => {
    assert.equal(Object.keys(facultyFunPrompts).length, 14);
    for (const f of faculties) {
      const p = getFacultyFunPrompt(f.id);
      assert.equal(p.facultyId, f.id, `Missing fun prompt for ${f.id}`);
      assert.ok(p.question.so.length > 15 && p.question.en.length > 15 && p.question.ar.length > 15);
      assert.equal(p.quickOptions.so.length, 3, `Expected 3 SO options for ${f.id}`);
      assert.equal(p.quickOptions.en.length, 3, `Expected 3 EN options for ${f.id}`);
      assert.equal(p.quickOptions.ar.length, 3, `Expected 3 AR options for ${f.id}`);
      assert.equal(p.optionInsights.so.length, 3, `Expected 3 SO insights for ${f.id}`);
      assert.equal(p.optionInsights.en.length, 3, `Expected 3 EN insights for ${f.id}`);
      assert.equal(p.optionInsights.ar.length, 3, `Expected 3 AR insights for ${f.id}`);
      assert.equal(new Set(p.optionInsights.so).size, 3, `SO optionInsights must be unique for ${f.id}`);
      assert.equal(new Set(p.optionInsights.en).size, 3, `EN optionInsights must be unique for ${f.id}`);
      assert.equal(new Set(p.optionInsights.ar).size, 3, `AR optionInsights must be unique for ${f.id}`);
      for (let i = 0; i < 3; i++) {
        assert.ok(p.optionInsights.so[i].length > 30, `SO optionInsight ${i} too short for ${f.id}`);
        assert.ok(p.optionInsights.en[i].length > 30, `EN optionInsight ${i} too short for ${f.id}`);
        assert.ok(p.optionInsights.ar[i].length > 30, `AR optionInsight ${i} too short for ${f.id}`);
      }
      assert.ok(p.insight.so.length > 30 && p.insight.en.length > 30 && p.insight.ar.length > 30);
    }
    assert.ok(facultyFunPrompts.cs.question.so.toLowerCase().includes("gamers"));
    assert.ok(facultyFunPrompts.eng.question.so.includes("1 + 1"));
  });
});

import { FORM4_EXAM_DATE, form4Subjects } from "../data/schoolForm4Data";
import { bridgeExamTracks, bridgeSubjects, GAP_EXAM_DATE } from "../data/bridgingPrepData";
import {
  examHallRules,
  HIRAAL_INTEGRITY_CHARTER,
  legalSubjectSecrets,
  top10StudyTricks,
} from "../data/topStudentData";

describe("CAAWIYE School (June 2027) & Diyaarinta Jaamacadda (Oct 2027) Clean Prepared Structures", () => {
  it("contains all 12 official Form 4 subjects (4 scientific, 3 languages, 2 social, 3 applied) ready for June 2027 uploads with zero pre-written mock content", () => {
    assert.equal(FORM4_EXAM_DATE, "June 2027");
    assert.equal(form4Subjects.length, 12);
    assert.equal(form4Subjects.filter((s) => s.group === "science").length, 4);
    assert.equal(form4Subjects.filter((s) => s.group === "language").length, 3);
    assert.equal(form4Subjects.filter((s) => s.group === "social").length, 2);
    assert.equal(form4Subjects.filter((s) => s.group === "applied").length, 3);

    for (const sub of form4Subjects) {
      assert.equal(sub.examDate, "June 2027");
      assert.equal(sub.predictPrice, "$0.50");
      assert.equal(sub.predictDurationMin, 60);
      assert.ok(sub.examBlueprint.totalMarks === 100);
      assert.ok(sub.examBlueprint.pastPaperPolicy.toLowerCase().includes("qish ma ahan"));
      assert.equal(sub.pdfs.length, 0, `PDFs should remain empty until founder uploads for ${sub.id}`);
      assert.equal(sub.freeTopics.length, 0, `Topics should remain empty until founder uploads for ${sub.id}`);
      assert.equal(sub.predictQuestions.length, 0, `Predict questions should remain empty until founder uploads for ${sub.id}`);
      assert.equal(sub.summary, "");
      assert.equal(sub.freeExamTip, "");
    }
  });

  it("prepares exact 5 university entrance subjects (4 scientific + English) and 60-min general entrance tracks for October 2027", () => {
    assert.equal(GAP_EXAM_DATE, "October 2027");
    assert.equal(bridgeSubjects.length, 5);
    assert.equal(bridgeSubjects.filter((s) => s.group === "science").length, 4);
    assert.equal(bridgeSubjects.filter((s) => s.group === "language").length, 1);
    assert.deepEqual(
      bridgeSubjects.map((s) => s.id),
      ["jus_bio", "jus_chem", "jus_phys", "jus_math", "jus_eng"]
    );
    for (const sub of bridgeSubjects) {
      assert.equal(sub.examDate, "October 2027");
      assert.equal(sub.price, "$0.50");
      assert.equal(sub.durationMin, 60);
      assert.ok(sub.examBlueprint.totalMarks === 100);
      assert.ok(sub.examBlueprint.pastPaperPolicy.toLowerCase().includes("qish ma ahan"));
      assert.equal(sub.pdfs.length, 0);
      assert.equal(sub.predictQuestions.length, 0);
    }

    assert.equal(bridgeExamTracks.length, 1, "Section 2 keeps one unified entrance track across universities");
    assert.equal(bridgeExamTracks[0].id, "snu_tartanka");
    assert.ok(!/keliya|kaliya/i.test(bridgeExamTracks[0].title));
    for (const tr of bridgeExamTracks) {
      assert.equal(tr.examDate, "October 2027");
      assert.equal(tr.price, "$0.50");
      assert.equal(tr.durationMin, 60);
      assert.equal(tr.subjectCount, 5);
      assert.equal(tr.pdfs.length, 0);
      assert.equal(tr.freeTips.length, 0);
      assert.equal(tr.predictQuestions.length, 0);
      assert.equal(tr.subtitle, "");
      assert.equal(tr.description, "");
    }
  });

  it("provides ethical Top-10 study tricks and legal marking secrets covering all 12 Form 4 subjects with explicit anti-cheating charter and zero AI dashes", () => {
    assert.ok(HIRAAL_INTEGRITY_CHARTER.headline.toLowerCase().includes("qishku waa xaaraam"));
    assert.ok(HIRAAL_INTEGRITY_CHARTER.body.toLowerCase().includes("100% xalaal"));

    assert.equal(top10StudyTricks.length, 6);
    for (const trick of top10StudyTricks) {
      assert.ok(trick.title.trim().length > 5);
      assert.ok(trick.steps.length >= 3, `Expected at least 3 concrete steps for ${trick.id}`);
      assert.ok(trick.avoid.trim().length > 10);
    }

    assert.equal(examHallRules.length, 4);
    for (const rule of examHallRules) {
      assert.ok(rule.title.trim().length > 3, `Expected title for rule ${rule.id}`);
      assert.ok(rule.detail.trim().length > 10, `Expected detail for rule ${rule.id}`);
    }

    assert.equal(legalSubjectSecrets.length, 12);
    const form4Ids = new Set(form4Subjects.map((s) => s.id));
    for (const sec of legalSubjectSecrets) {
      assert.ok(form4Ids.has(sec.id), `Subject secret ${sec.id} should match form4Subjects id`);
      assert.ok(sec.examinerFocus.trim().length > 20);
      assert.equal(sec.legalSecrets.length, 3, `Expected 3 legal secrets for ${sec.id}`);
      assert.ok(sec.highYieldTopics.length >= 3);
      assert.ok(sec.commonTrap.trim().length > 20);
    }

    const serializedData = JSON.stringify({
      HIRAAL_INTEGRITY_CHARTER,
      top10StudyTricks,
      examHallRules,
      legalSubjectSecrets,
      facultyFunPrompts,
      bridgeSubjects,
      bridgeExamTracks,
      form4Subjects,
    });
    assert.ok(!serializedData.includes("—"), "Em-dash (—) must be permanently removed");
    assert.ok(!serializedData.includes("–"), "En-dash (–) must be permanently removed");
    assert.ok(!/kala.?guur/i.test(serializedData), "Old label Kala-Guurka must not appear");
  });

  it("enforces universal fonts, zero AI dashes, and hides merchant phone outside checkout across index.html and src/", () => {
    const filesToCheck: string[] = [path.resolve("index.html")];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.(ts|tsx|css|html)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
          filesToCheck.push(full);
        }
      }
    };
    walk(path.resolve("src"));

    const forbiddenPatterns: Array<[RegExp, string]> = [
      [/—/, "Em-dash (—)"],
      [/–/, "En-dash (–)"],
      [/kala.?guur/i, "Old Kala-Guur label"],
      [/Diyaarinta JUS\s*\((?:Keliya|Kaliya)\)/i, "Exclusive JUS-only stage label"],
      [/Bricolage Grotesque/i, "Legacy Bricolage Grotesque font"],
      [/\bDM Sans\b/i, "Legacy DM Sans font"],
      [/Instrument Serif/i, "Legacy Instrument Serif font"],
    ];

    for (const filePath of filesToCheck) {
      const content = fs.readFileSync(filePath, "utf8");
      const rel = path.relative(process.cwd(), filePath);
      for (const [re, label] of forbiddenPatterns) {
        assert.ok(!re.test(content), `${label} found in ${rel}`);
      }
      if (!rel.endsWith("proSecurity.ts") && !rel.endsWith("ProPaywallScreen.tsx")) {
        assert.ok(!/610999089/.test(content), `Merchant phone leaked in ${rel}`);
        assert.ok(!/Shuceyb Abdirahman/i.test(content), `Merchant name leaked in ${rel}`);
      }
    }
  });
});
