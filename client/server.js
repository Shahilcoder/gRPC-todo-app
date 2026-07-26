// server.js
//
// Express HTTP server for the browser UI. Each /api route is a thin
// translator: parse the HTTP request, call the gRPC stub, return JSON.
// This is the layer where "browser ↔ Node" meets "Node ↔ Go".

const path = require("path");
const express = require("express");
const grpc = require("./grpc-client");
const { httpStatusFor, codeNameFor, messageFor } = require("./lib/grpc-http");
const {
  PRIORITY_VALUES,
  toWirePriority,
  toHttpTodo,
} = require("./lib/todo-mapping");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Request helpers
// ---------------------------------------------------------------------------

/**
 * Path id → positive integer, or null.
 *
 * `Number(req.params.id)` alone let "abc" through as NaN, which reached the Go
 * server as id 0 and came back as a confusing internal error. Rejecting here
 * turns it into the 400 it always was.
 */
function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0 || id > Number.MAX_SAFE_INTEGER) {
    return null;
  }
  return id;
}

function badRequest(res, message) {
  return res.status(400).json({ error: message, code: "INVALID_ARGUMENT" });
}

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Validate an HTTP priority value and convert it to its wire name.
 *
 * Done here rather than left to the Go server because protobufjs drops an
 * unrecognised enum string without complaining: an unvalidated typo would
 * produce a request with no priority set, and a 200 that changed nothing.
 */
function wirePriorityOrThrow(value) {
  const wire = toWirePriority(value);
  if (wire === undefined) {
    const err = new Error(
      `priority must be one of: ${PRIORITY_VALUES.join(", ")}`
    );
    err.status = 400;
    throw err;
  }
  return wire;
}

/** Validate a labels array from a request body, returning it unchanged. */
function labelsOrThrow(value) {
  if (!Array.isArray(value) || value.some((l) => typeof l !== "string")) {
    const err = new Error("labels must be an array of strings");
    err.status = 400;
    throw err;
  }
  return value;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/api/todos", async (_req, res, next) => {
  try {
    const { todos = [] } = await grpc.listTodos({});
    res.json(todos.map(toHttpTodo));
  } catch (err) { next(err); }
});

app.post("/api/todos", async (req, res, next) => {
  try {
    const body = req.body || {};
    const title = (body.title || "").trim();
    if (!title) return badRequest(res, "title required");

    // Absent priority/labels fall through to proto3 defaults: no priority, no
    // labels. On a create there is no "leave unchanged" to express.
    const request = { title };
    if (has(body, "priority")) request.priority = wirePriorityOrThrow(body.priority);
    if (has(body, "labels")) request.labels = labelsOrThrow(body.labels);

    const todo = await grpc.createTodo(request);
    res.status(201).json(toHttpTodo(todo));
  } catch (err) { next(err); }
});

app.post("/api/todos/:id/toggle", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return badRequest(res, "id must be a positive integer");

    const todo = await grpc.toggleTodo({ id });
    res.json(toHttpTodo(todo));
  } catch (err) { next(err); }
});

// Partial update. Any subset of {title, priority, labels}; anything absent from
// the body is left alone by the server.
app.patch("/api/todos/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return badRequest(res, "id must be a positive integer");

    const body = req.body || {};
    const request = { id };

    // Presence is tested on the *key*, not the value, so {"title": null} is a
    // 400 rather than a field silently ignored.
    if (has(body, "title")) {
      if (typeof body.title !== "string") {
        return badRequest(res, "title must be a string");
      }
      request.title = body.title;
    }
    if (has(body, "priority")) {
      request.priority = wirePriorityOrThrow(body.priority);
    }
    if (has(body, "labels")) {
      // The LabelList wrapper is what carries presence: omitted means "leave
      // labels alone", {labels: []} means "remove every label".
      request.labels = { labels: labelsOrThrow(body.labels) };
    }

    if (Object.keys(request).length === 1) {
      return badRequest(res, "body must set at least one of title, priority, labels");
    }

    const todo = await grpc.updateTodo(request);
    res.json(toHttpTodo(todo));
  } catch (err) { next(err); }
});

app.delete("/api/todos/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return badRequest(res, "id must be a positive integer");

    await grpc.deleteTodo({ id });
    res.status(204).end();
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

// The body shape is {error, code}: `error` is the human string this app always
// returned, `code` is added so the UI can decide whether a failure is worth
// offering a retry for (UNAVAILABLE, DEADLINE_EXCEEDED) or not
// (INVALID_ARGUMENT, NOT_FOUND).
app.use((err, _req, res, _next) => {
  // Locally-thrown validation errors and Express's own body-parse failures
  // carry an HTTP status; honour it before consulting the gRPC map.
  const localStatus = err.status || err.statusCode;
  if (localStatus) {
    return res.status(localStatus).json({
      error: err.message,
      code: localStatus === 400 ? "INVALID_ARGUMENT" : "UNKNOWN",
    });
  }

  const status = httpStatusFor(err);
  const code = codeNameFor(err);
  const message = messageFor(err);

  // Client mistakes are not server incidents; only log the ones we caused.
  if (status >= 500) console.error(`gRPC ${code}: ${message}`);

  res.status(status).json({ error: message, code });
});

app.listen(PORT, () => {
  console.log(`Web UI on http://localhost:${PORT}`);
});
