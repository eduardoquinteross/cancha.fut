import test from "node:test";
import assert from "node:assert/strict";
import { buildStandings, getSummary, sortMatches, validateMatch, validatePlayer, validateScore } from "../src/domain.js";

test("player validation accepts boundary shirt numbers and cleans the name", () => {
  assert.deepEqual(validatePlayer({ name: "  Ana Ruiz ", number: "1", position: "Portero" }), { name: "Ana Ruiz", number: 1, position: "Portero" });
  assert.equal(validatePlayer({ name: "Jugador", number: 99, position: "Defensa" }).number, 99);
});

test("player validation rejects empty names, duplicate/out-of-range numbers and invalid positions", () => {
  const existing = [{ number: 10 }];
  for (const data of [
    { name: "  ", number: 2, position: "Defensa" },
    { name: "Ana", number: 10, position: "Defensa" },
    { name: "Ana", number: 100, position: "Defensa" },
    { name: "Ana", number: 2, position: "Entrenador" },
  ]) assert.throws(() => validatePlayer(data, existing));
});

test("match validation accepts valid local match and rejects invalid date, self-match and duplicate", () => {
  const valid = { opponent: "Deportivo Norte", date: "2026-10-25", venue: "Local" };
  assert.deepEqual(validateMatch(valid, "Atlético del Barrio"), valid);
  assert.throws(() => validateMatch({ ...valid, date: "2026-02-30" }, "Atlético del Barrio"));
  assert.throws(() => validateMatch({ ...valid, opponent: " Atlético del Barrio " }, "Atlético del Barrio"));
  assert.throws(() => validateMatch(valid, "Atlético del Barrio", [{ ...valid, status: "scheduled" }]));
});

test("score validation permits nil-nil and rejects negative, decimal and non-numeric goals", () => {
  assert.deepEqual(validateScore("0", "0"), { teamGoals: 0, opponentGoals: 0 });
  for (const score of [[-1, 0], [1.5, 0], ["x", 1], [1, ""]]) assert.throws(() => validateScore(...score));
});

test("standings compute wins, draws, losses, goal difference and points; ignore scheduled matches", () => {
  const matches = [
    { opponent: "Los Pinos", status: "finished", teamGoals: 2, opponentGoals: 0 },
    { opponent: "Deportivo Sur", status: "finished", teamGoals: 1, opponentGoals: 1 },
    { opponent: "Los Pinos", status: "finished", teamGoals: 0, opponentGoals: 1 },
    { opponent: "Pendiente FC", status: "scheduled", teamGoals: 99, opponentGoals: 0 },
  ];
  const table = buildStandings("Atlético del Barrio", matches);
  const own = table.find((row) => row.name === "Atlético del Barrio");
  assert.deepEqual({ played: own.played, won: own.won, drawn: own.drawn, lost: own.lost, goalsFor: own.goalsFor, goalsAgainst: own.goalsAgainst, goalDifference: own.goalDifference, points: own.points },
    { played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 4 });
  assert.equal(table.some((row) => row.name === "Pendiente FC"), false);
});

test("standings tie-break by points, goal difference, goals for, then name", () => {
  const matches = [
    { opponent: "Zulu", status: "finished", teamGoals: 0, opponentGoals: 2 },
    { opponent: "Beta", status: "finished", teamGoals: 0, opponentGoals: 3 },
    { opponent: "Alfa", status: "finished", teamGoals: 0, opponentGoals: 3 },
  ];
  assert.deepEqual(buildStandings("Atlético", matches).map((row) => row.name), ["Alfa", "Beta", "Zulu", "Atlético"]);
  assert.equal(buildStandings("Atlético", []).length, 1);
});

test("summary and match ordering are derived consistently", () => {
  const matches = [
    { date: "2026-10-20", status: "finished", teamGoals: 1, opponentGoals: 2 },
    { date: "2026-10-22", status: "scheduled" },
    { date: "2026-10-25", status: "scheduled" },
  ];
  assert.deepEqual(getSummary("Equipo", [], matches), { teamName: "Equipo", playerCount: 0, played: 1, wins: 0, draws: 0, losses: 1, upcoming: 2 });
  assert.deepEqual(sortMatches(matches).map((match) => match.date), ["2026-10-22", "2026-10-25", "2026-10-20"]);
});
