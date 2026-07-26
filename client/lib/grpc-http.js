// grpc-http.js
//
// gRPC status code → HTTP status code, replacing the blanket 500 this app used
// to return for every failure.
//
// This is not tidiness. The UI's error states are specified to distinguish
// "you sent something invalid" from "that task is gone" from "the Go server is
// not running", and a uniform 500 makes all three identical to the browser.
// UNAVAILABLE → 503 in particular is the case that stops a dead backend
// rendering as an empty task list.

const grpc = require("@grpc/grpc-js");

const HTTP_FOR_CODE = {
  [grpc.status.OK]: 200,
  [grpc.status.CANCELLED]: 499,
  [grpc.status.UNKNOWN]: 500,
  [grpc.status.INVALID_ARGUMENT]: 400,
  [grpc.status.DEADLINE_EXCEEDED]: 504,
  [grpc.status.NOT_FOUND]: 404,
  [grpc.status.ALREADY_EXISTS]: 409,
  [grpc.status.PERMISSION_DENIED]: 403,
  [grpc.status.RESOURCE_EXHAUSTED]: 429,
  [grpc.status.FAILED_PRECONDITION]: 400,
  [grpc.status.ABORTED]: 409,
  [grpc.status.OUT_OF_RANGE]: 400,
  [grpc.status.UNIMPLEMENTED]: 501,
  [grpc.status.INTERNAL]: 500,
  [grpc.status.UNAVAILABLE]: 503,
  [grpc.status.DATA_LOSS]: 500,
  [grpc.status.UNAUTHENTICATED]: 401,
};

/**
 * Pull the gRPC code off an error, or null if it is not a gRPC error.
 *
 * The type guard matters: grpc-js builds errors with a *numeric* `code`, but
 * Node's own system errors use a *string* one ("ECONNREFUSED"), and both reach
 * this middleware. Without the check, ECONNREFUSED would index the table by a
 * string and fall through as a 500 for the wrong reason.
 */
function grpcCodeOf(err) {
  return typeof err.code === "number" ? err.code : null;
}

function httpStatusFor(err) {
  const code = grpcCodeOf(err);
  if (code === null) return 500;
  return HTTP_FOR_CODE[code] ?? 500;
}

/** Machine-readable code name for the JSON body, e.g. "NOT_FOUND". */
function codeNameFor(err) {
  const code = grpcCodeOf(err);
  if (code === null) return "UNKNOWN";
  return grpc.status[code] || "UNKNOWN";
}

/**
 * The message to show. grpc-js sets `details` to the clean server message and
 * `message` to "5 NOT_FOUND: todo not found" — the prefix is noise in a UI.
 */
function messageFor(err) {
  return err.details || err.message || "request failed";
}

module.exports = { httpStatusFor, codeNameFor, messageFor };
