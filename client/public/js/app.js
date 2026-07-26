// app.js
//
// Wiring. Every mutation here is optimistic: apply it locally, mark the row
// pending, then replace it with what the server returned — or roll it back and
// mark the row as failed, with a retry the user can actually reach.
//
// Rendering is keyed reconciliation, one DOM node per todo id, patched in
// place. The previous implementation rebuilt the list with innerHTML on every
// change, which cannot express a per-row pending state, destroys focus
// mid-edit, and makes the removal animation impossible.

import { api } from "./api.js";
import * as store from "./store.js";
import { createRow, patchRow, beginEdit } from "./row.js";
import { initComposer } from "./compose.js";
import { initTheme } from "./theme.js";
import { installKeys } from "./keys.js";

const listEl = document.getElementById("todo-list");
const emptyPanel = document.getElementById("state-empty");
const donePanel = document.getElementById("state-done");
const errorPanel = document.getElementById("state-error");
const retryLoadBtn = document.getElementById("retry-load");
const announcer = document.getElementById("announcer");

/** @type {Map<number, HTMLElement>} id → row node */
const nodes = new Map();
/** @type {Map<number, () => void>} id → what "Retry" should do */
const retries = new Map();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Matches --duration-enter. Reduced motion removes the row immediately rather
// than animating it out, so the wait has to go too — otherwise the row lingers
// for 180ms with nothing happening.
const exitDelay = () => (reducedMotion.matches ? 0 : 180);

function announce(message) {
  announcer.textContent = message;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render(s) {
  const failed = s.listState === store.LIST_ERROR;
  const loading = s.listState === store.LIST_LOADING;
  const count = s.order.length;
  const allDone =
    count > 0 && s.order.every((id) => s.todos.get(id).completed);

  errorPanel.hidden = !failed;
  listEl.hidden = failed || (loading && count === 0);
  emptyPanel.hidden = failed || loading || count > 0;
  // Shown *below* a full list rather than in place of one: this app keeps
  // completed tasks visible, so "everything is done" is a state the list still
  // has rows in. Pretending otherwise would mean hiding the user's work.
  donePanel.hidden = failed || loading || !allDone;

  let prev = null;
  for (const id of s.order) {
    const todo = s.todos.get(id);

    let node = nodes.get(id);
    if (!node) {
      node = createRow(todo, handlers);
      nodes.set(id, node);
      node.classList.add("row-enter");
    }
    patchRow(node, todo, s.status.get(id) || null, s.errors.get(id) || "");

    // Only touch the DOM when the position is actually wrong: re-inserting a
    // node that is already in place restarts its animations and drops focus.
    const target = prev ? prev.nextSibling : listEl.firstChild;
    if (node !== target) listEl.insertBefore(node, target);
    prev = node;
  }

  for (const [id, node] of [...nodes]) {
    if (!s.todos.has(id)) {
      node.remove();
      nodes.delete(id);
      retries.delete(id);
    }
  }
}

/** Carry a live node across the swap from optimistic id to real id. */
function rekey(fromId, toId) {
  const node = nodes.get(fromId);
  if (!node) return;
  nodes.delete(fromId);
  nodes.set(toId, node);
}

// A row with an RPC in flight ignores further input. Guarding here rather than
// setting `disabled` on the controls keeps focus where the user put it while
// still making a double-tap a single toggle.
function busy(id) {
  return store.state.status.get(id) === "pending";
}

function failRow(id, err, retry) {
  store.setStatus(id, "error", err.message);
  retries.set(id, retry);
  announce(err.message);
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

async function loadTodos() {
  store.setListState(store.LIST_LOADING);
  try {
    const todos = await api.list();
    // Reconciliation is keyed by id, and setTodos replaces the whole set, so
    // drop the node cache with it.
    nodes.clear();
    retries.clear();
    listEl.textContent = "";
    store.setTodos(Array.isArray(todos) ? todos : []);
  } catch (err) {
    store.setListState(store.LIST_ERROR);
    announce("Couldn't load your tasks.");
  }
}

async function createTodo(fields) {
  const id = store.tempId();
  store.putTodo({
    id,
    title: fields.title,
    completed: false,
    createdAt: Math.floor(Date.now() / 1000),
    priority: fields.priority,
    labels: fields.labels,
  });
  store.setStatus(id, "pending");

  try {
    const real = await api.create(fields);
    rekey(id, real.id);
    store.replaceTodo(id, real);
    announce(`Added ${real.title}`);
  } catch (err) {
    // The optimistic row stays put rather than vanishing: it is holding text
    // the user typed, and throwing that away to signal a failure is a worse
    // trade than leaving a row they can retry.
    failRow(id, err, () => retryCreate(id));
  }
}

async function retryCreate(id) {
  const todo = store.getTodo(id);
  if (!todo) return;

  store.setStatus(id, "pending");
  try {
    const real = await api.create({
      title: todo.title,
      priority: todo.priority,
      labels: todo.labels,
    });
    rekey(id, real.id);
    store.replaceTodo(id, real);
    announce(`Added ${real.title}`);
  } catch (err) {
    failRow(id, err, () => retryCreate(id));
  }
}

async function toggleTodo(id) {
  const before = store.getTodo(id);
  if (!before || id < 0 || busy(id)) return;

  store.putTodo({ ...before, completed: !before.completed });
  store.setStatus(id, "pending");

  try {
    store.putTodo(await api.toggle(id));
    store.setStatus(id, null);
    announce(
      before.completed
        ? `${before.title} marked incomplete`
        : `${before.title} completed`
    );
  } catch (err) {
    store.putTodo(before); // roll back
    failRow(id, err, () => toggleTodo(id));
  }
}

async function updateTitle(id, title) {
  const before = store.getTodo(id);
  if (!before || id < 0 || busy(id)) return;

  store.putTodo({ ...before, title });
  store.setStatus(id, "pending");

  try {
    store.putTodo(await api.update(id, { title }));
    store.setStatus(id, null);
    announce(`Renamed to ${title}`);
  } catch (err) {
    store.putTodo(before);
    failRow(id, err, () => updateTitle(id, title));
  }
}

async function deleteTodo(id) {
  // A row that never reached the server has nothing to delete remotely.
  if (id < 0) {
    store.removeTodo(id);
    return;
  }

  const todo = store.getTodo(id);
  if (!todo || busy(id)) return;

  store.setStatus(id, "pending");
  try {
    await api.remove(id);
    await animateOut(id);
    store.removeTodo(id);
    announce(`Deleted ${todo.title}`);
  } catch (err) {
    failRow(id, err, () => deleteTodo(id));
  }
}

// The 180ms collapse-and-fade, awaited so the row is not yanked out from under
// its own animation.
function animateOut(id) {
  const node = nodes.get(id);
  if (!node) return Promise.resolve();

  const ms = exitDelay();
  node.classList.add("row-leave");
  if (ms === 0) return Promise.resolve();
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Handlers passed into each row
// ---------------------------------------------------------------------------

const handlers = {
  onToggle: toggleTodo,
  onDelete: deleteTodo,
  onEdit(id) {
    const node = nodes.get(id);
    const todo = store.getTodo(id);
    if (node && todo) beginEdit(node, todo, updateTitle);
  },
  onRetry(id) {
    const retry = retries.get(id);
    if (!retry) return;
    retries.delete(id);
    retry();
  },
};

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

const composer = initComposer({
  form: document.getElementById("composer"),
  input: document.getElementById("composer-title"),
  chips: document.getElementById("composer-chips"),
  onSubmit: createTodo,
});

initTheme(
  document.getElementById("theme-toggle"),
  document.getElementById("theme-label")
);

installKeys({
  list: listEl,
  focusComposer: composer.focus,
  onEdit: handlers.onEdit,
});

retryLoadBtn.addEventListener("click", loadTodos);

store.subscribe(render);
render(store.state);
loadTodos();
