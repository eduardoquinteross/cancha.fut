export const POSITIONS = ["Portero", "Defensa", "Mediocampista", "Delantero"];
const normalize = (value) => String(value).trim().toLocaleLowerCase("es");
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export function validatePlayer({ name, number, position }, players = []) {
  const cleanName = String(name ?? "").trim();
  const shirtNumber = Number(number);
  if (!cleanName) throw new Error("Escribe el nombre del jugador.");
  if (!Number.isInteger(shirtNumber) || shirtNumber < 1 || shirtNumber > 99) throw new Error("El dorsal debe ser un número entero entre 1 y 99.");
  if (players.some((player) => player.number === shirtNumber)) throw new Error("Ese dorsal ya está asignado.");
  if (!POSITIONS.includes(position)) throw new Error("Selecciona una posición válida.");
  return { name: cleanName, number: shirtNumber, position };
}

export function validateMatch({ opponent, date, venue }, teamName, matches = []) {
  const cleanOpponent = String(opponent ?? "").trim();
  if (!cleanOpponent) throw new Error("Escribe el nombre del rival.");
  if (normalize(cleanOpponent) === normalize(teamName)) throw new Error("El equipo no puede jugar contra sí mismo.");
  if (!validDate(String(date ?? ""))) throw new Error("Indica una fecha válida.");
  if (!["Local", "Visitante"].includes(venue)) throw new Error("Selecciona Local o Visitante.");
  if (matches.some((match) => normalize(match.opponent) === normalize(cleanOpponent) && match.date === date && match.venue === venue && match.status === "scheduled")) {
    throw new Error("Ya hay un partido programado contra ese rival en esa fecha.");
  }
  return { opponent: cleanOpponent, date, venue };
}

export function validateScore(teamGoals, opponentGoals) {
  if (String(teamGoals).trim() === "" || String(opponentGoals).trim() === "") {
    throw new Error("Completa los goles de ambos equipos.");
  }
  const home = Number(teamGoals);
  const away = Number(opponentGoals);
  if (!Number.isInteger(home) || home < 0 || !Number.isInteger(away) || away < 0) {
    throw new Error("Los goles deben ser números enteros iguales o mayores que cero.");
  }
  return { teamGoals: home, opponentGoals: away };
}

export function buildStandings(teamName, matches) {
  const rows = new Map();
  const getRow = (name) => {
    const key = normalize(name);
    if (!rows.has(key)) rows.set(key, { name: String(name).trim(), played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 });
    return rows.get(key);
  };
  getRow(teamName);
  for (const match of matches) {
    if (match.status !== "finished") continue;
    const team = getRow(teamName);
    const rival = getRow(match.opponent);
    const ours = match.teamGoals;
    const theirs = match.opponentGoals;
    team.played++; rival.played++;
    team.goalsFor += ours; team.goalsAgainst += theirs;
    rival.goalsFor += theirs; rival.goalsAgainst += ours;
    if (ours > theirs) { team.won++; rival.lost++; team.points += 3; }
    else if (ours < theirs) { rival.won++; team.lost++; rival.points += 3; }
    else { team.drawn++; rival.drawn++; team.points++; rival.points++; }
  }
  return [...rows.values()].map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || normalize(a.name).localeCompare(normalize(b.name), "es"));
}

export function getSummary(teamName, players, matches) {
  const finished = matches.filter((match) => match.status === "finished");
  const wins = finished.filter((match) => match.teamGoals > match.opponentGoals).length;
  const draws = finished.filter((match) => match.teamGoals === match.opponentGoals).length;
  const losses = finished.length - wins - draws;
  return { teamName, playerCount: players.length, played: finished.length, wins, draws, losses, upcoming: matches.filter((match) => match.status === "scheduled").length };
}

export function sortMatches(matches) {
  return [...matches].sort((a, b) => {
    if (a.status !== b.status) return a.status === "scheduled" ? -1 : 1;
    return a.status === "scheduled" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });
}
