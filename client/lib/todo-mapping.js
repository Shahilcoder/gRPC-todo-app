// todo-mapping.js
//
// The boundary where proto vocabulary stops. The browser talks about
// priorities as "none" | "urgent" | "high" | "medium"; the wire calls them
// PRIORITY_UNSPECIFIED | PRIORITY_URGENT | PRIORITY_HIGH | PRIORITY_MEDIUM.
// Translating in one module means the enum spelling appears exactly once
// outside the .proto.
//
// Strings rather than the numeric enum, deliberately. With enums: Number the
// browser would receive priority 0 for "no priority", which is falsy — every
// `if (todo.priority)` becomes a latent bug — and the wire's 0..3 does not
// match the design system's tier numbering 1..4 either, so a third stable
// vocabulary at this boundary is cheaper than an off-by-one in the UI.

const WIRE_TO_HTTP = {
  PRIORITY_UNSPECIFIED: "none",
  PRIORITY_URGENT: "urgent",
  PRIORITY_HIGH: "high",
  PRIORITY_MEDIUM: "medium",
};

const HTTP_TO_WIRE = {
  none: "PRIORITY_UNSPECIFIED",
  urgent: "PRIORITY_URGENT",
  high: "PRIORITY_HIGH",
  medium: "PRIORITY_MEDIUM",
};

/** Wire enum name → HTTP value. Unknown names degrade to "none" so a server
 *  that learns a fifth tier does not break an older browser. */
function toHttpPriority(wire) {
  return WIRE_TO_HTTP[wire] || "none";
}

/**
 * HTTP value → wire enum name, or undefined if the value is not one of ours.
 *
 * The undefined is load-bearing. protobufjs silently drops an unrecognised
 * enum string instead of throwing, so `priority: "urgnet"` would encode to a
 * message with no priority field at all: a PATCH that returns 200 having
 * changed nothing. Callers must treat undefined as a 400.
 */
function toWirePriority(value) {
  return HTTP_TO_WIRE[value];
}

/**
 * Wire Todo → HTTP Todo.
 *
 * Not ceremony: proto-loader is configured with `oneofs: true`, so any
 * response message that ever gains an `optional` field starts carrying
 * synthetic-oneof keys (`_title: "title"`). Forwarding the decoded object
 * verbatim, as this route used to, would leak those to the browser. Naming the
 * fields closes that off permanently.
 *
 * `keepCase: false` already gives us createdAt; `longs: Number` makes it a
 * plain number of unix seconds.
 */
function toHttpTodo(t) {
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    createdAt: t.createdAt,
    priority: toHttpPriority(t.priority),
    labels: t.labels || [],
  };
}

module.exports = {
  PRIORITY_VALUES: Object.keys(HTTP_TO_WIRE),
  toHttpPriority,
  toWirePriority,
  toHttpTodo,
};
