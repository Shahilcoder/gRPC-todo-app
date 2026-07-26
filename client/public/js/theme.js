// theme.js
//
// Theme follows the OS by default; the header control overrides it, and the
// override persists.
//
// Three modes rather than two, because "dark" and "follow the OS, which is
// currently dark" are different intentions and collapsing them means a user who
// wanted to track their system setting silently stops doing so.
//
// The class is applied *before first paint* by an inline script in index.html.
// This module only handles changes after load.

const KEY = "clay-theme";
const MODES = ["system", "light", "dark"];

const LABELS = { system: "System", light: "Light", dark: "Dark" };
const NEXT_HINT = { system: "light", light: "dark", dark: "system" };

const media = window.matchMedia("(prefers-color-scheme: dark)");

function read() {
  try {
    const stored = localStorage.getItem(KEY);
    return MODES.includes(stored) ? stored : "system";
  } catch (e) {
    return "system";
  }
}

function write(mode) {
  try {
    if (mode === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch (e) {
    /* private mode: the choice just won't survive a reload. */
  }
}

function isDark(mode) {
  return mode === "dark" || (mode === "system" && media.matches);
}

function apply(mode) {
  document.documentElement.classList.toggle("dark", isDark(mode));
}

export function initTheme(button, labelEl) {
  let mode = read();

  const paint = () => {
    apply(mode);
    labelEl.textContent = LABELS[mode];
    button.setAttribute(
      "aria-label",
      `Theme: ${LABELS[mode]}. Switch to ${LABELS[NEXT_HINT[mode]]}.`
    );
  };

  button.addEventListener("click", () => {
    mode = NEXT_HINT[mode];
    write(mode);
    paint();
  });

  // Only meaningful in "system" mode, but harmless to keep attached: the OS
  // flipping to dark at sunset should move the page with it.
  media.addEventListener("change", () => {
    if (mode === "system") paint();
  });

  paint();
}
