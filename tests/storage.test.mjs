import test from "node:test";
import assert from "node:assert/strict";
import { initialState, loadState, saveState, STORAGE_KEY } from "../src/storage.js";

function memoryStorage(initial = null, fail = false) {
  let value = initial;
  return {
    getItem() { if (fail) throw new Error("blocked"); return value; },
    setItem(_key, next) { if (fail) throw new Error("blocked"); value = next; },
    value: () => value,
  };
}

test("missing storage returns fresh initial state", () => {
  const result = loadState(memoryStorage());
  assert.equal(result.ok, true);
  assert.equal(result.fresh, true);
  assert.deepEqual(result.state, initialState());
});

test("state survives a save/load round trip", () => {
  const storage = memoryStorage();
  const state = { ...initialState(), players: [{ id: "p1", name: "Ana", number: 7, position: "Defensa" }] };
  assert.deepEqual(saveState(state, storage), { ok: true });
  assert.equal(storage.value().includes(STORAGE_KEY), false);
  assert.deepEqual(loadState(storage).state, state);
});

test("corrupt or incompatible data reports an error and is not overwritten", () => {
  const corrupt = memoryStorage("{bad json");
  assert.equal(loadState(corrupt).ok, false);
  assert.equal(corrupt.value(), "{bad json");
  const incompatible = memoryStorage(JSON.stringify({ version: 99, players: [], matches: [] }));
  assert.equal(loadState(incompatible).ok, false);
  const malformedEntity = memoryStorage(JSON.stringify({ ...initialState(), matches: [{ id: "m1", opponent: "Rival", status: "finished" }] }));
  assert.equal(loadState(malformedEntity).ok, false);
});

test("storage access failures return errors rather than false success", () => {
  assert.equal(loadState(memoryStorage(null, true)).ok, false);
  assert.equal(saveState(initialState(), memoryStorage(null, true)).ok, false);
});
