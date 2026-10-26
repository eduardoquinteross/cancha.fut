export const STORAGE_KEY = "cancha:data:v1";
export const initialState = () => ({ version: 1, teamName: "Atlético del Barrio", players: [], matches: [] });

function isValidState(value) {
  if (!value || value.version !== 1 || typeof value.teamName !== "string" || !value.teamName.trim() || !Array.isArray(value.players) || !Array.isArray(value.matches)) return false;
  const positions = ["Portero", "Defensa", "Mediocampista", "Delantero"];
  const playerIds = new Set();
  const shirtNumbers = new Set();
  for (const player of value.players) {
    if (!player || typeof player.id !== "string" || !player.id || typeof player.name !== "string" || !player.name.trim()
      || !Number.isInteger(player.number) || player.number < 1 || player.number > 99 || !positions.includes(player.position)
      || playerIds.has(player.id) || shirtNumbers.has(player.number)) return false;
    playerIds.add(player.id);
    shirtNumbers.add(player.number);
  }
  const matchIds = new Set();
  for (const match of value.matches) {
    if (!match || typeof match.id !== "string" || !match.id || typeof match.opponent !== "string" || !match.opponent.trim()
      || !/^\d{4}-\d{2}-\d{2}$/.test(match.date) || !["Local", "Visitante"].includes(match.venue)
      || !["scheduled", "finished"].includes(match.status) || matchIds.has(match.id)) return false;
    const [year, month, day] = match.date.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
    if (match.status === "finished" && (!Number.isInteger(match.teamGoals) || match.teamGoals < 0 || !Number.isInteger(match.opponentGoals) || match.opponentGoals < 0)) return false;
    matchIds.add(match.id);
  }
  return true;
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, state: initialState(), fresh: true };
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) return { ok: false, error: "Los datos guardados no tienen un formato compatible." };
    return { ok: true, state: parsed, fresh: false };
  } catch {
    return { ok: false, error: "No se pudieron leer los datos guardados. Puedes iniciar una lista nueva; los datos anteriores no se han recuperado." };
  }
}

export function saveState(state, storage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudieron guardar los cambios en este navegador." };
  }
}
