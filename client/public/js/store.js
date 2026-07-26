// store.js
//
// All UI state in one place, with a subscribe/notify loop.
//
// The shape is keyed rather than a plain array because the renderer needs a
// stable identity per row: one DOM node per todo id, patched in place. The old
// full-innerHTML rebuild could not express a per-row pending state, threw away
// focus mid-edit, and made the removal animation impossible.

export const LIST_LOADING = "loading";
export const LIST_READY = "ready";
export const LIST_ERROR = "error";

export const state = {
  /** @type {Map<number, object>} id → todo */
  todos: new Map(),
  /** @type {number[]} display order, newest first (matches ORDER BY id DESC) */
  order: [],
  /** @type {Map<number, 'pending'|'error'>} absent means idle */
  status: new Map(),
  /** @type {Map<number, string>} per-row error message */
  errors: new Map(),
  listState: LIST_LOADING,
};

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn(state);
}

export function setListState(next) {
  state.listState = next;
  notify();
}

export function setTodos(todos) {
  state.todos.clear();
  state.order = [];
  for (const t of todos) {
    state.todos.set(t.id, t);
    state.order.push(t.id);
  }
  state.status.clear();
  state.errors.clear();
  state.listState = LIST_READY;
  notify();
}

/** Insert or replace a todo. New ids land at the top, matching the sort. */
export function putTodo(todo) {
  const isNew = !state.todos.has(todo.id);
  state.todos.set(todo.id, todo);
  if (isNew) state.order.unshift(todo.id);
  notify();
}

/**
 * Swap an optimistic placeholder for the row the server actually created,
 * keeping its position so the list does not jump.
 *
 * Placeholders use negative ids, which real AUTOINCREMENT ids can never
 * collide with.
 */
export function replaceTodo(tempId, todo) {
  const at = state.order.indexOf(tempId);
  state.todos.delete(tempId);
  state.status.delete(tempId);
  state.errors.delete(tempId);

  state.todos.set(todo.id, todo);
  if (at === -1) state.order.unshift(todo.id);
  else state.order[at] = todo.id;

  notify();
}

export function removeTodo(id) {
  state.todos.delete(id);
  state.status.delete(id);
  state.errors.delete(id);
  state.order = state.order.filter((x) => x !== id);
  notify();
}

export function setStatus(id, status, message = "") {
  if (status) {
    state.status.set(id, status);
    if (message) state.errors.set(id, message);
    else state.errors.delete(id);
  } else {
    state.status.delete(id);
    state.errors.delete(id);
  }
  notify();
}

export function getTodo(id) {
  return state.todos.get(id);
}

/**
 * Every label currently in use, sorted.
 *
 * Derived from the todos already in memory rather than fetched: the server
 * prunes labels the moment nothing references them, so this set is exactly
 * equal to the labels table — not merely close to it. That is what makes a
 * ListLabels RPC unnecessary rather than merely skipped.
 */
export function knownLabels() {
  const all = new Set();
  for (const t of state.todos.values()) {
    for (const l of t.labels || []) all.add(l);
  }
  return [...all].sort();
}

let nextTempId = -1;

/** A placeholder id for an optimistic row, guaranteed not to collide. */
export function tempId() {
  return nextTempId--;
}
