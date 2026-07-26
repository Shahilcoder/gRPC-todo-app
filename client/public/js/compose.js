// compose.js
//
// The add-task composer: the single most-used control in the app.
//
// Labels are typed inline as #tags and parsed out of the title, with a live
// chip preview and one line of helper text so the syntax is discoverable
// rather than secret. Priority stays a visible segmented control — hidden
// syntax is a fair trade for an additive nicety, not for a primary field.

import { parseComposerInput } from "./format.js";

// Successive submits chain instead of overlapping, so two fast Enters cannot
// race each other into the wrong order.
let queue = Promise.resolve();

function enqueue(task) {
  // Attached to both settle paths: one failed create must not stall the queue.
  queue = queue.then(task, task);
  return queue;
}

/**
 * @param {object} opts
 * @param {HTMLFormElement} opts.form
 * @param {HTMLInputElement} opts.input
 * @param {HTMLElement} opts.chips
 * @param {(fields: {title: string, priority: string, labels: string[]}) => Promise<void>} opts.onSubmit
 */
export function initComposer({ form, input, chips, onSubmit }) {
  const selectedPriority = () => {
    const checked = form.querySelector('input[name="priority"]:checked');
    return checked ? checked.value : "none";
  };

  const resetPriority = () => {
    const none = form.querySelector('input[name="priority"][value="none"]');
    if (none) none.checked = true;
  };

  // Live preview of what the #tags will become, so the parse is never a
  // surprise after the fact.
  const preview = () => {
    const { labels } = parseComposerInput(input.value);
    chips.textContent = "";
    chips.hidden = labels.length === 0;
    for (const name of labels) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `#${name}`;
      chips.appendChild(chip);
    }
  };

  input.addEventListener("input", preview);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const { title, labels } = parseComposerInput(input.value);
    // An empty submit is a no-op, not an error — including a field holding
    // nothing but #tags, which has no task in it to create.
    if (!title) {
      input.focus();
      return;
    }

    const fields = { title, priority: selectedPriority(), labels };

    // Cleared and refocused immediately, and never disabled: blocking the
    // primary input on network latency is the fastest way to make a fast app
    // feel slow. The optimistic row is what stands in for the result.
    input.value = "";
    preview();
    resetPriority();
    input.focus();
    flashSuccess(input);

    enqueue(() => onSubmit(fields));
  });

  // A failed create surfaces on its own optimistic row, where the retry lives,
  // so the composer needs no error line of its own.
  return {
    focus() {
      input.focus();
    },
  };
}

// A ~1s confirmation on the input itself. The design system specifies this as a
// text colour, which an emptied field cannot show, so it lands on the border
// instead — the new row arriving is the real confirmation.
function flashSuccess(input) {
  input.classList.add("text-input--success");
  window.setTimeout(() => input.classList.remove("text-input--success"), 1000);
}
