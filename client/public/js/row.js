// row.js
//
// One task row: build it once, then patch it in place forever.
//
// Nothing here re-creates DOM on a data change. That is what lets a row hold
// focus while its title is being edited, show a per-row pending state, and
// animate itself out on delete.

import { formatTime, formatTimeFull, priorityTier, priorityWord } from "./format.js";

const MAX_VISIBLE_CHIPS = 3;

// The checkmark path, drawn inside a 20x20 box. Its length sets the
// stroke-dasharray in the stylesheet (24), which is what makes it draw rather
// than appear.
const CHECK_PATH = "M5 10.5l3.5 3.5L15 7";

// A pennant: pole plus flag. One path, filled with currentColor, so the tier
// colour comes from the .priority-flag--N modifier.
const FLAG_PATH = "M4 2h1.2v12H4z M6 2.6l7 2.4-7 2.4z";

function svg(className, viewBox, path) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("class", className);
  el.setAttribute("viewBox", viewBox);
  el.setAttribute("aria-hidden", "true");
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", path);
  el.appendChild(p);
  return el;
}

/**
 * Build a row. `handlers` is {onToggle, onEdit, onDelete, onRetry}.
 * Element references are cached on the node so patchRow never queries the DOM.
 */
export function createRow(todo, handlers) {
  const li = document.createElement("li");
  li.className = "task-row";
  li.dataset.id = String(todo.id);

  // --- checkbox ---
  // A real <input type="checkbox">, visually replaced but not removed: Space
  // toggles it natively, and assistive technology reads the state without any
  // aria bookkeeping on our side.
  const box = document.createElement("label");
  box.className = "checkbox";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "checkbox__input";
  input.addEventListener("change", () => handlers.onToggle(currentId(li)));
  box.append(input, svg("checkbox__check", "0 0 20 20", CHECK_PATH));

  // --- title ---
  // A button, because it is the edit trigger. There is an UpdateTodo RPC now,
  // so a row that looks editable is telling the truth.
  const title = document.createElement("button");
  title.type = "button";
  title.className = "task-title clay-focus";
  title.addEventListener("click", () => handlers.onEdit(currentId(li)));
  // The text lives in its own span so the strikethrough and the truncation can
  // be sized to the words rather than to the full-width button.
  const titleText = document.createElement("span");
  titleText.className = "task-title__text";
  title.appendChild(titleText);

  // --- timestamp ---
  // Dropped below 640px: on a phone the row is worth more than the metadata.
  const time = document.createElement("time");
  time.className = "num flex-none text-ink-faint hidden sm:block";

  // --- priority flag ---
  const flag = document.createElement("span");
  flag.className = "priority-flag";
  const flagText = document.createElement("span");
  flag.append(svg("priority-flag__glyph", "0 0 16 16", FLAG_PATH), flagText);

  // --- actions ---
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "button-ghost clay-focus row-action row-action--always";
  retry.textContent = "Retry";
  retry.hidden = true;
  retry.addEventListener("click", () => handlers.onRetry(currentId(li)));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "button-ghost-danger clay-focus row-action";
  del.textContent = "Delete";
  del.addEventListener("click", () => handlers.onDelete(currentId(li)));

  // --- chips ---
  const chips = document.createElement("div");
  chips.className = "chip-row";

  li.append(box, title, time, flag, retry, del, chips);

  li._refs = { input, title, titleText, time, flag, flagText, retry, del, chips };
  patchRow(li, todo, null, "");
  return li;
}

// The id is read from the DOM rather than closed over, because an optimistic
// row's temporary id is replaced by the real one while the node lives on.
function currentId(li) {
  return Number(li.dataset.id);
}

export function patchRow(li, todo, status, message) {
  const r = li._refs;
  li.dataset.id = String(todo.id);

  // --- checkbox + title ---
  r.input.checked = todo.completed;
  r.input.setAttribute("aria-label", todo.title);

  // Never overwrite the field the user is typing in.
  if (!li._editing) {
    r.titleText.textContent = todo.title;
    r.title.setAttribute("aria-label", `Edit task: ${todo.title}`);
    r.title.classList.toggle("task-title--done", todo.completed);
  }

  // --- timestamp ---
  r.time.textContent = formatTime(todo.createdAt);
  r.time.setAttribute("datetime", new Date(todo.createdAt * 1000).toISOString());
  r.time.title = formatTimeFull(todo.createdAt);

  // --- priority ---
  // Tier 4 renders nothing at all. A flag on every row is noise, and the
  // absence of a flag is the clearest available signal of "no priority".
  const tier = priorityTier(todo.priority);
  if (tier === 4) {
    r.flag.hidden = true;
  } else {
    r.flag.hidden = false;
    r.flag.className = `priority-flag priority-flag--${tier}`;
    // The visible P1/P2/P3 is not decoration: it is what keeps the tier
    // legible to someone who cannot separate the four hues.
    r.flagText.textContent = `P${tier}`;
    r.flag.setAttribute("aria-label", `Priority: ${priorityWord(todo.priority)}`);
  }

  // --- labels ---
  patchChips(r.chips, todo.labels || []);

  // --- status ---
  const pending = status === "pending";
  const errored = status === "error";
  li.classList.toggle("task-row--pending", pending);
  li.classList.toggle("task-row--error", errored);
  // A pending row stays interactive-*looking* and simply ignores further
  // input — the guard lives in app.js. Setting `disabled` here would be the
  // obvious alternative and is wrong: it drops focus out of a row the moment
  // you act on it, which is precisely the keyboard path this app is built
  // around.
  r.input.setAttribute("aria-busy", pending ? "true" : "false");
  r.retry.hidden = !errored;
  r.retry.title = message || "";
  r.del.setAttribute(
    "aria-label",
    pending ? `Deleting ${todo.title}` : `Delete task: ${todo.title}`
  );
}

function patchChips(container, labels) {
  container.hidden = labels.length === 0;
  container.textContent = "";
  if (labels.length === 0) return;

  const visible = labels.slice(0, MAX_VISIBLE_CHIPS);
  for (const name of visible) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = `#${name}`;
    container.appendChild(chip);
  }

  // Capped at three plus a count, so a heavily tagged task can never push the
  // title out of view.
  const hidden = labels.length - visible.length;
  if (hidden > 0) {
    const more = document.createElement("span");
    more.className = "chip chip--overflow";
    more.textContent = `+${hidden}`;
    more.title = labels.slice(MAX_VISIBLE_CHIPS).map((l) => `#${l}`).join(" ");
    container.appendChild(more);
  }
}

/**
 * Replace the title with an inline editor. Enter commits, Esc cancels, blur
 * commits — losing a typed edit silently is worse than committing one.
 *
 * `onCommit(id, title)` is only called when the text actually changed.
 */
export function beginEdit(li, todo, onCommit) {
  if (li._editing) return;
  li._editing = true;

  const r = li._refs;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "title-input";
  input.value = todo.title;
  input.setAttribute("aria-label", "Task title");

  let settled = false;
  const finish = (commit) => {
    if (settled) return;
    settled = true;
    li._editing = false;

    const next = input.value.trim();
    input.replaceWith(r.title);
    r.title.focus();

    if (commit && next && next !== todo.title) onCommit(todo.id, next);
    else patchRow(li, todo, null, "");
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finish(true);
    } else if (e.key === "Escape") {
      e.preventDefault();
      finish(false);
    }
  });
  input.addEventListener("blur", () => finish(true));

  r.title.replaceWith(input);
  input.focus();
  input.select();
}
