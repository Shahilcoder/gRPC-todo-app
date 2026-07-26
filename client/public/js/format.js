// format.js
//
// Presentation-only helpers. No DOM, no state.

const PRIORITY_TIER = { urgent: 1, high: 2, medium: 3, none: 4 };

const PRIORITY_WORD = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  none: "None",
};

/**
 * Design-system tier number for an HTTP priority value.
 *
 * Note the mapping: tier 4 is "none", which is wire value 0. The design system
 * numbers its tiers 1..4 most-urgent-first and treats tier 4 as the silent
 * default; proto3 needs the default to be zero. This function is where those
 * two numbering schemes meet, and it is the only place they do.
 */
export function priorityTier(priority) {
  return PRIORITY_TIER[priority] || 4;
}

export function priorityWord(priority) {
  return PRIORITY_WORD[priority] || "None";
}

/**
 * A short, column-friendly timestamp: time of day for today, otherwise the
 * date. Rendered in mono with tabular figures, so the width does not jitter as
 * the digits change.
 */
export function formatTime(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

/** The full timestamp, for the title attribute. */
export function formatTimeFull(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}

/**
 * Split composer input into a title and its inline #labels.
 *
 * "Pay invoice #admin #finance" → {title: "Pay invoice",
 *                                 labels: ["admin", "finance"]}
 *
 * Only a '#' at a word boundary counts, so "C#" in a title survives intact.
 */
export function parseComposerInput(raw) {
  const labels = [];

  const title = raw
    .replace(/(^|\s)#([^\s#]+)/g, (_match, lead, tag) => {
      labels.push(tag.toLowerCase());
      return lead;
    })
    .replace(/\s+/g, " ")
    .trim();

  // Sorted to match what the server stores and returns, so the optimistic
  // row's chips are in their final order and do not visibly reshuffle when the
  // real response lands.
  return { title, labels: [...new Set(labels)].sort() };
}
