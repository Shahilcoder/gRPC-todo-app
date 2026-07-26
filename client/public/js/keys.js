// keys.js
//
// The keyboard map. Keyboard-first is one of the design system's five pillars,
// so this is designed rather than decorative.
//
// | /      | focus the composer            |
// | ↑ / ↓  | move focus between rows       |
// | Space  | toggle the focused row        |
// | Enter  | edit the focused row's title  |
// | Esc    | cancel the edit               |
// | Tab    | normal traversal of controls  |
//
// Space and Tab are absent from the code below on purpose: the rows contain a
// real checkbox and real buttons, so the browser already does the right thing.
// Arrow-key navigation is the only genuine addition, layered on top of a plain
// <ul>/<li> — a role="listbox" would be dishonest, since nothing is being
// selected.

const TEXT_ENTRY = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isTextEntry(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  if (!TEXT_ENTRY.has(el.tagName)) return false;
  // The row checkbox is an <input>, but typing "/" into it means nothing, so
  // it should not swallow the shortcut.
  return el.type !== "checkbox" && el.type !== "radio";
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.list          the <ul>
 * @param {() => void}  opts.focusComposer
 * @param {(id: number) => void} opts.onEdit
 */
export function installKeys({ list, focusComposer, onEdit }) {
  // Focus lands on each row's checkbox: it is the row's first control, so
  // Space then toggles natively and Enter is free for editing.
  const focusables = () => [...list.querySelectorAll(".checkbox__input")];

  const moveFocus = (delta) => {
    const items = focusables();
    if (items.length === 0) return false;

    const at = items.indexOf(document.activeElement);
    // From outside the list, ↓ enters at the top and ↑ at the bottom.
    const next =
      at === -1
        ? delta > 0
          ? 0
          : items.length - 1
        : Math.min(items.length - 1, Math.max(0, at + delta));

    items[next].focus();
    return true;
  };

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "/" && !isTextEntry(e.target)) {
      e.preventDefault();
      focusComposer();
      return;
    }

    if (e.key === "ArrowDown" && !isTextEntry(e.target)) {
      if (moveFocus(1)) e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp" && !isTextEntry(e.target)) {
      if (moveFocus(-1)) e.preventDefault();
      return;
    }

    // Enter on a focused row edits it. Enter does nothing to a checkbox
    // natively, so there is no default behaviour being stolen here.
    if (e.key === "Enter" && e.target.classList.contains("checkbox__input")) {
      const row = e.target.closest(".task-row");
      if (row) {
        e.preventDefault();
        onEdit(Number(row.dataset.id));
      }
    }
  });
}
