/**
 * Tests for the localStorage-backed data layer.
 *
 * The module talks to the browser's localStorage directly, so the suite installs
 * a minimal in-memory implementation before importing it. Only the pure storage
 * functions are exercised; export helpers that need Blob/URL are out of scope.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

globalThis.localStorage = new MemoryStorage();

const storage = await import("./storage.js");

test("initializeData seeds users, research records, messages and settings", () => {
  localStorage.clear();
  storage.initializeData();

  const users = storage.getUsers();
  assert.ok(users.length > 0, "expected seeded users");
  assert.ok(users.every((u) => u.username && u.role));

  assert.ok(storage.getResearchData().length > 0);
  assert.ok(storage.getMessages().length > 0);
  assert.equal(storage.getSettings().institutionName, "ScholarSync");
});

test("initializeData does not overwrite existing data", () => {
  localStorage.clear();
  storage.initializeData();
  const before = storage.getUsers().length;
  storage.initializeData();
  assert.equal(storage.getUsers().length, before);
});

test("getNextId starts at 1 and continues from the highest id", () => {
  localStorage.clear();
  assert.equal(storage.getNextId("users"), 1);

  storage.setUsers([{ id: 4 }, { id: 9 }]);
  assert.equal(storage.getNextId("users"), 10);
});

test("users round-trip through storage", () => {
  localStorage.clear();
  const users = [{ id: 1, username: "researcher", role: "researcher" }];
  storage.setUsers(users);
  assert.deepEqual(storage.getUsers(), users);
});

test("settings are merged over the defaults", () => {
  localStorage.clear();
  storage.setSettings({ institutionName: "Example College" });
  const settings = storage.getSettings();
  assert.equal(settings.institutionName, "Example College");
  assert.ok(settings.database, "defaults survive a partial override");
});

test("messages round-trip through storage", () => {
  localStorage.clear();
  const messages = [{ id: 1, content: "hello", isAnnouncement: false }];
  storage.setMessages(messages);
  assert.deepEqual(storage.getMessages(), messages);
});

test("empty storage reads return empty lists", () => {
  localStorage.clear();
  assert.deepEqual(storage.getUsers(), []);
  assert.deepEqual(storage.getResearchData(), []);
  assert.deepEqual(storage.getMessages(), []);
});
