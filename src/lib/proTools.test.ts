import test from "node:test";
import assert from "node:assert/strict";
import { calculateGradeInsight, DEFAULT_GRADE_SUBJECTS, WEEKLY_STUDY_BLUEPRINT } from "./proTools";

test("calculateGradeInsight computes accurate GPA, letter grade, and scholarship readiness", () => {
  const high = calculateGradeInsight(
    [
      { id: "bio", label: "Biology", score: 92 },
      { id: "chem", label: "Chemistry", score: 88 },
      { id: "math", label: "Math", score: 90 },
    ],
    "science"
  );
  assert.equal(high.averagePct, 90);
  assert.equal(high.letter, "A+");
  assert.equal(high.gpa4, 3.6);
  assert.equal(high.scholarshipReady, true);
  assert.ok(high.eligibleFaculties.some((f) => f.includes("Dhakhtarnimada")));

  const mid = calculateGradeInsight(
    [
      { id: "som", label: "Soomaali", score: 74 },
      { id: "eng", label: "English", score: 70 },
    ],
    "arts"
  );
  assert.equal(mid.averagePct, 72);
  assert.equal(mid.letter, "B");
  assert.equal(mid.scholarshipReady, false);

  // Clamps out-of-range scores safely
  const clamped = calculateGradeInsight(
    [{ id: "x", label: "Test", score: 150 }],
    "tech"
  );
  assert.equal(clamped.averagePct, 100);
  assert.equal(clamped.gpa4, 4);
});

test("default grade subjects and weekly study blueprint are complete", () => {
  assert.equal(DEFAULT_GRADE_SUBJECTS.science.length, 5);
  assert.equal(DEFAULT_GRADE_SUBJECTS.tech.length, 5);
  assert.equal(DEFAULT_GRADE_SUBJECTS.arts.length, 5);
  assert.ok(WEEKLY_STUDY_BLUEPRINT.length >= 6);
});
