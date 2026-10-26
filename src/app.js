import { POSITIONS, buildStandings, getSummary, sortMatches, validateMatch, validatePlayer, validateScore } from "./domain.js";
import { initialState, loadState, saveState } from "./storage.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const browserStorage = (() => {
  try { return window.localStorage; }
  catch { return { getItem() { throw new Error("storage unavailable"); }, setItem() { throw new Error("storage unavailable"); } }; }
})();
const storageResult = loadState(browserStorage);
let state = storageResult.ok ? storageResult.state : initialState();
let route = location.hash.slice(1) || "inicio";
let toastTimer;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const id = () => globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const dateLabel = (value) => new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

function notify(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function persist(message = "Cambios guardados") {
  const result = saveState(state, browserStorage);
  if (!result.ok) { notify(result.error, true); return false; }
  render();
  notify(message);
  return true;
}

function emptyState(title, message, action = "") {
  return `<div class="empty-state"><span class="empty-ball">⚽</span><h3>${title}</h3><p>${message}</p>${action}</div>`;
}

function sectionHeader(eyebrow, title, description, action = "") {
  return `<div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="section-description">${description}</p></div>${action}</div>`;
}

function playerRows(limit = Infinity) {
  if (!state.players.length) return emptyState("Todavía no hay jugadores", "Añade la plantilla para tener a todo el equipo en un solo lugar.", `<button class="button button-primary" data-route="plantilla">Añadir primer jugador</button>`);
  return `<div class="player-grid">${state.players.slice().sort((a, b) => a.number - b.number).slice(0, limit).map((player) => `<article class="player-card"><span class="player-number">${player.number}</span><div class="player-info"><b>${escapeHTML(player.name)}</b><span>${escapeHTML(player.position)}</span></div><button class="icon-button danger" data-action="delete-player" data-id="${escapeHTML(player.id)}" aria-label="Eliminar a ${escapeHTML(player.name)}" title="Eliminar jugador">×</button></article>`).join("")}</div>`;
}

function matchCard(match) {
  const finished = match.status === "finished";
  const score = finished ? `<span class="match-score">${match.teamGoals} <i>—</i> ${match.opponentGoals}</span>` : `<span class="badge badge-upcoming">PRÓXIMO</span>`;
  const action = finished ? "" : `<button class="button button-small button-outline" data-action="finish-match" data-id="${escapeHTML(match.id)}">Registrar resultado</button>`;
  return `<article class="match-card"><div class="match-date"><b>${dateLabel(match.date)}</b><span>${escapeHTML(match.venue)}</span></div><div class="match-versus"><span class="team-initial">AB</span><div><b>Atlético del Barrio</b><span>vs. ${escapeHTML(match.opponent)}</span></div></div><div class="match-outcome">${score}${action}<button class="icon-button danger" data-action="delete-match" data-id="${escapeHTML(match.id)}" aria-label="Eliminar partido contra ${escapeHTML(match.opponent)}" title="Eliminar partido">×</button></div></article>`;
}

function matchList(matches, limit = Infinity) {
  const sorted = sortMatches(matches).slice(0, limit);
  return sorted.length ? `<div class="match-list">${sorted.map(matchCard).join("")}</div>` : emptyState("El calendario está libre", "Programa el próximo partido para que el equipo esté listo.", `<button class="button button-primary" data-route="partidos">Programar partido</button>`);
}

function standingsTable(compact = false) {
  const rows = buildStandings(state.teamName, state.matches);
  return `<div class="table-wrap"><table><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>DG</th><th>PTS</th></tr></thead><tbody>${rows.map((row, index) => `<tr class="${index === 0 ? "own-team" : ""}"><td class="rank">${String(index + 1).padStart(2, "0")}</td><td><span class="table-team"><span class="team-mini ${index === 0 ? "own" : ""}">${index === 0 ? "AB" : escapeHTML(row.name.slice(0, 2).toUpperCase())}</span><b>${escapeHTML(row.name)}</b></span></td><td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td><td class="${row.goalDifference > 0 ? "positive" : row.goalDifference < 0 ? "negative" : ""}">${row.goalDifference > 0 ? "+" : ""}${row.goalDifference}</td><td class="points">${row.points}</td></tr>`).join("")}</tbody></table></div>${compact ? "" : `<p class="table-note">Puntos: victoria 3 · empate 1 · derrota 0</p>`}`;
}

function renderHome() {
  const summary = getSummary(state.teamName, state.players, state.matches);
  return `${sectionHeader("TEMPORADA 2026", `¡Vamos, ${escapeHTML(state.teamName)}!`, "Todo lo que pasa con tu equipo, en un solo lugar.", `<span class="season-pill"><span class="live-dot"></span> Temporada activa</span>`)}
    <section class="stat-grid" aria-label="Resumen de temporada">
      <article class="stat-card"><span class="stat-label">PLANTILLA</span><div class="stat-value">${summary.playerCount}<span> jugadores</span></div><span class="stat-foot">El equipo al completo</span><span class="stat-icon green">♙</span></article>
      <article class="stat-card"><span class="stat-label">PARTIDOS JUGADOS</span><div class="stat-value">${summary.played}</div><span class="stat-foot">${summary.upcoming} por disputar</span><span class="stat-icon blue">◷</span></article>
      <article class="stat-card"><span class="stat-label">BALANCE</span><div class="stat-value balance"><span>${summary.wins} <small>G</small></span><i>·</i><span>${summary.draws} <small>E</small></span><i>·</i><span>${summary.losses} <small>P</small></span></div><span class="stat-foot">Ganados · Empatados · Perdidos</span><span class="stat-icon gold">↗</span></article>
    </section>
    <div class="dashboard-columns"><section class="panel"><div class="panel-heading"><div><p class="eyebrow">EN EL CALENDARIO</p><h2>Próximos partidos</h2></div><button class="text-button" data-route="partidos">Ver todos <span>→</span></button></div>${matchList(state.matches.filter((match) => match.status === "scheduled"), 3)}</section>
    <section class="panel standings-preview"><div class="panel-heading"><div><p class="eyebrow">ASÍ VAMOS</p><h2>Clasificación</h2></div><button class="text-button" data-route="tabla">Tabla completa <span>→</span></button></div>${standingsTable(true)}</section></div>
    <section class="panel squad-preview"><div class="panel-heading"><div><p class="eyebrow">LOS PROTAGONISTAS</p><h2>La plantilla</h2></div><button class="text-button" data-route="plantilla">Ver plantilla <span>→</span></button></div>${playerRows(4)}</section>`;
}

function renderSquad() {
  return `${sectionHeader("EL EQUIPO", "Nuestra plantilla", "Cada dorsal tiene una historia. Aquí empieza la de esta temporada.", `<button class="button button-primary" data-action="toggle-form" data-form="player-form">＋ Añadir jugador</button>`)}
    <form id="player-form" class="form-panel hidden"><div class="form-heading"><div><p class="eyebrow">NUEVO INTEGRANTE</p><h2>Añadir a la plantilla</h2></div><button type="button" class="icon-button" data-action="toggle-form" data-form="player-form" aria-label="Cerrar formulario">×</button></div><div class="form-grid"><label>Nombre del jugador<input name="name" required maxlength="60" placeholder="Ej. Marcos Rojas" /></label><label>Dorsal<input name="number" required type="number" min="1" max="99" step="1" placeholder="10" /></label><label>Posición<select name="position" required>${POSITIONS.map((position) => `<option>${position}</option>`).join("")}</select></label></div><div class="form-actions"><button type="button" class="button button-outline" data-action="toggle-form" data-form="player-form">Cancelar</button><button class="button button-primary" type="submit">Guardar jugador</button></div></form>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">PRIMER EQUIPO</p><h2>${state.players.length} ${state.players.length === 1 ? "jugador" : "jugadores"}</h2></div><span class="count-pill">Temporada 2026</span></div>${playerRows()}</section>`;
}

function renderMatches() {
  const scheduled = sortMatches(state.matches.filter((match) => match.status === "scheduled"));
  const finished = sortMatches(state.matches.filter((match) => match.status === "finished"));
  return `${sectionHeader("CALENDARIO", "Partidos", "Programa la jornada y guarda cada resultado para actualizar la clasificación.", `<button class="button button-primary" data-action="toggle-form" data-form="match-form">＋ Programar partido</button>`)}
    <form id="match-form" class="form-panel hidden"><div class="form-heading"><div><p class="eyebrow">NUEVA JORNADA</p><h2>Programar partido</h2></div><button type="button" class="icon-button" data-action="toggle-form" data-form="match-form" aria-label="Cerrar formulario">×</button></div><div class="form-grid"><label>Equipo rival<input name="opponent" required maxlength="60" placeholder="Ej. Deportivo Central" /></label><label>Fecha<input name="date" required type="date" min="2020-01-01" value="${today}" /></label><label>Condición<select name="venue" required><option>Local</option><option>Visitante</option></select></label></div><div class="form-actions"><button type="button" class="button button-outline" data-action="toggle-form" data-form="match-form">Cancelar</button><button class="button button-primary" type="submit">Guardar partido</button></div></form>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">LO QUE VIENE</p><h2>Próximos partidos</h2></div><span class="count-pill">${scheduled.length} programados</span></div>${scheduled.length ? `<div class="match-list">${scheduled.map(matchCard).join("")}</div>` : emptyState("No hay partidos programados", "Cuando tengas fecha, añádela aquí.")}</section>
    <section class="panel"><div class="panel-heading"><div><p class="eyebrow">EL CAMINO RECORRIDO</p><h2>Resultados</h2></div><span class="count-pill">${finished.length} finalizados</span></div>${finished.length ? `<div class="match-list">${finished.map(matchCard).join("")}</div>` : emptyState("Todavía no hay resultados", "Al finalizar un partido, registra el marcador para verlo aquí.")}</section>`;
}

function renderStandings() {
  const rows = buildStandings(state.teamName, state.matches);
  return `${sectionHeader("TEMPORADA 2026", "La clasificación", "Cada partido cuenta. La tabla se calcula automáticamente con los resultados registrados.")}
    <section class="panel table-panel"><div class="panel-heading"><div><p class="eyebrow">TABLA GENERAL</p><h2>Todos contra todos</h2></div><span class="count-pill">${rows.length} ${rows.length === 1 ? "equipo" : "equipos"}</span></div>${standingsTable()}<div class="legend"><span><b>PJ</b> Jugados</span><span><b>PG</b> Ganados</span><span><b>PE</b> Empatados</span><span><b>PP</b> Perdidos</span><span><b>DG</b> Dif. goles</span><span><b>PTS</b> Puntos</span></div></section>
    <div class="info-banner"><span>✦</span><p><b>¿Cómo se ordena?</b> Puntos, diferencia de goles, goles a favor y, si persiste el empate, orden alfabético.</p></div>`;
}

function render() {
  const views = { inicio: renderHome, plantilla: renderSquad, partidos: renderMatches, tabla: renderStandings };
  const labels = { inicio: "RESUMEN", plantilla: "PLANTILLA", partidos: "PARTIDOS", tabla: "CLASIFICACIÓN" };
  if (!views[route]) route = "inicio";
  document.querySelector("#page-label").textContent = labels[route];
  document.querySelectorAll("[data-route].nav-link").forEach((link) => link.classList.toggle("active", link.dataset.route === route));
  app.innerHTML = `${!storageResult.ok ? `<div class="alert-banner" role="alert"><span>!</span><p>${escapeHTML(storageResult.error)}</p><button class="button button-small button-outline" data-action="recover">Empezar con datos vacíos</button></div>` : ""}${views[route]()}`;
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route]");
  if (routeLink) { event.preventDefault(); route = routeLink.dataset.route; history.replaceState(null, "", `#${route}`); render(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id: itemId, form: formId } = button.dataset;
  if (action === "toggle-form") { document.getElementById(formId)?.classList.toggle("hidden"); return; }
  if (action === "delete-player") { state.players = state.players.filter((player) => player.id !== itemId); persist("Jugador eliminado"); return; }
  if (action === "delete-match") { state.matches = state.matches.filter((match) => match.id !== itemId); persist("Partido eliminado"); return; }
  if (action === "recover") { storageResult.ok = true; storageResult.error = ""; state = initialState(); render(); notify("Puedes empezar una lista nueva."); return; }
  if (action === "finish-match") { const match = state.matches.find((item) => item.id === itemId); if (match) showScoreForm(match); }
});

function showScoreForm(match) {
  const existing = document.querySelector("#score-form");
  existing?.remove();
  const form = document.createElement("form");
  form.id = "score-form";
  form.dataset.matchId = match.id;
  form.className = "score-form";
  form.innerHTML = `<strong>Resultado vs. ${escapeHTML(match.opponent)}</strong><label class="visually-hidden" for="our-score">Goles Atlético del Barrio</label><input id="our-score" name="teamGoals" type="number" min="0" step="1" required aria-label="Goles Atlético del Barrio"><span>—</span><label class="visually-hidden" for="their-score">Goles ${escapeHTML(match.opponent)}</label><input id="their-score" name="opponentGoals" type="number" min="0" step="1" required aria-label="Goles ${escapeHTML(match.opponent)}"><button class="button button-primary button-small">Guardar</button><button type="button" class="button button-outline button-small" data-action="close-score">Cancelar</button>`;
  document.querySelector(`[data-id="${CSS.escape(match.id)}"][data-action="finish-match"]`)?.closest(".match-card")?.after(form);
}

document.addEventListener("click", (event) => { if (event.target.closest('[data-action="close-score"]')) document.querySelector("#score-form")?.remove(); });

document.addEventListener("submit", (event) => {
  const form = event.target;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  try {
    if (form.id === "player-form") {
      const player = validatePlayer(values, state.players);
      state.players.push({ id: id(), ...player });
      if (persist("Jugador añadido a la plantilla")) form.reset();
    } else if (form.id === "match-form") {
      const match = validateMatch(values, state.teamName, state.matches);
      state.matches.push({ id: id(), ...match, status: "scheduled" });
      if (persist("Partido programado")) form.reset();
    } else if (form.id === "score-form") {
      const score = validateScore(values.teamGoals, values.opponentGoals);
      const target = state.matches.find((item) => item.id === form.dataset.matchId);
      if (!target) throw new Error("No se encontró el partido seleccionado.");
      Object.assign(target, score, { status: "finished" });
      persist("Resultado guardado; clasificación actualizada");
    }
  } catch (error) { notify(error.message, true); }
});

window.addEventListener("hashchange", () => { route = location.hash.slice(1) || "inicio"; render(); });
render();
