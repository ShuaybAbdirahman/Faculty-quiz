import test from "node:test";
import assert from "node:assert/strict";
import {
  filterRankingBySubject,
  formatDurationClock,
  mergePredictRankings,
  readLocalPredictRankings,
  sanitizeStudentDisplayName,
  saveLocalPredictScore,
  sortPredictRankingEntries,
} from "./predictRanking";
import { generateSecureDeviceId, type StorageLike } from "./proSecurity";

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? map.get(k)! : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

test("predict ranking starts empty with zero mock students", () => {
  const storage = createMemoryStorage();
  assert.deepEqual(readLocalPredictRankings(storage, "school"), []);
  assert.deepEqual(readLocalPredictRankings(storage, "jus"), []);
});

test("sorts ranked students by highest scorePct, then correctCount, then fastest elapsedSec", () => {
  const devA = generateSecureDeviceId();
  const devB = generateSecureDeviceId();
  const devC = generateSecureDeviceId();
  const storage = createMemoryStorage();

  saveLocalPredictScore(storage, {
    scope: "school",
    subjectId: "bio",
    subjectName: "Bayoolaji",
    studentName: "Xasan",
    deviceId: devA,
    scorePct: 88,
    correctCount: 44,
    totalQuestions: 50,
    elapsedSec: 1800,
    submittedAt: 1000,
  });
  saveLocalPredictScore(storage, {
    scope: "school",
    subjectId: "bio",
    subjectName: "Bayoolaji",
    studentName: "Fartuun",
    deviceId: devB,
    scorePct: 88,
    correctCount: 44,
    totalQuestions: 50,
    elapsedSec: 1400,
    submittedAt: 2000,
  });
  saveLocalPredictScore(storage, {
    scope: "school",
    subjectId: "math",
    subjectName: "Xisaab",
    studentName: "Cabdi",
    deviceId: devC,
    scorePct: 96,
    correctCount: 48,
    totalQuestions: 50,
    elapsedSec: 2100,
    submittedAt: 3000,
  });
  // Separate scope must stay isolated
  saveLocalPredictScore(storage, {
    scope: "jus",
    subjectId: "jus_bio",
    subjectName: "Bayoolaji",
    studentName: "Maryan",
    deviceId: devC,
    scorePct: 92,
    correctCount: 46,
    totalQuestions: 50,
    elapsedSec: 1500,
    submittedAt: 3500,
  });

  const schoolRows = readLocalPredictRankings(storage, "school", devB);
  assert.equal(schoolRows.length, 3);

  const rankedAll = sortPredictRankingEntries(schoolRows);
  assert.equal(rankedAll[0].rank, 1);
  assert.equal(rankedAll[0].studentName, "Cabdi");
  assert.equal(rankedAll[1].rank, 2);
  assert.equal(rankedAll[1].studentName, "Fartuun");
  assert.equal(rankedAll[1].isSelf, true);
  assert.equal(rankedAll[2].rank, 3);
  assert.equal(rankedAll[2].studentName, "Xasan");

  const bioOnly = filterRankingBySubject(schoolRows, "bio");
  assert.equal(bioOnly.length, 2);
  assert.equal(bioOnly[0].studentName, "Fartuun");

  const jusRows = readLocalPredictRankings(storage, "jus", devC);
  assert.equal(jusRows.length, 1);
  assert.equal(jusRows[0].studentName, "Maryan");
});

test("sanitizes student names, formats clock, and merges remote/local without duplicates", () => {
  assert.equal(sanitizeStudentDisplayName("  <script>Nimco</script>  "), "scriptNimco/script");
  assert.equal(sanitizeStudentDisplayName("   "), "Arday");
  assert.equal(formatDurationClock(125), "2m 05s");
  assert.equal(formatDurationClock(45), "45s");

  const dev = generateSecureDeviceId();
  const storage = createMemoryStorage();
  const localItem = saveLocalPredictScore(storage, {
    scope: "jus",
    subjectId: "jus_math",
    subjectName: "Xisaab",
    studentName: "Axmed",
    deviceId: dev,
    scorePct: 90,
    correctCount: 45,
    totalQuestions: 50,
    elapsedSec: 1200,
  });

  const remoteDuplicate = { ...localItem, id: "remote_1", isSelf: false };
  const merged = mergePredictRankings([remoteDuplicate], [localItem], dev);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].isSelf, true);
});
