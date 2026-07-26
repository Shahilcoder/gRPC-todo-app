// api.js
//
// The only module that talks to /api. Every response goes through checkOk, so
// a failure can never reach the UI disguised as data.
//
// This is the fix for a specific bug the old app.js had: it called
// `await res.json()` with no res.ok check, so a 503 produced {error: "..."},
// `todos.length` was undefined, and the list rendered its empty state. A dead
// backend looked exactly like an empty database.

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  /** True for failures where trying the same request again might work. */
  get retryable() {
    return (
      this.status === 0 ||
      this.status === 503 ||
      this.status === 504 ||
      this.status >= 500
    );
  }
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (cause) {
    // Network-level failure: no response at all. Status 0 distinguishes it
    // from a server that answered with an error.
    throw new ApiError("Couldn't reach the server.", 0, "UNAVAILABLE");
  }

  if (!res.ok) {
    // The BFF returns {error, code}; fall back gracefully if it didn't.
    let body = null;
    try {
      body = await res.json();
    } catch (e) {
      /* not JSON — use the status alone */
    }
    throw new ApiError(
      (body && body.error) || `Request failed (${res.status})`,
      res.status,
      (body && body.code) || "UNKNOWN"
    );
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => request("/api/todos"),

  create: (fields) =>
    request("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }),

  toggle: (id) => request(`/api/todos/${id}/toggle`, { method: "POST" }),

  // `patch` carries only the keys the caller means to change: an absent key is
  // "leave it alone" all the way down to the SQL.
  update: (id, patch) =>
    request(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }),

  remove: (id) => request(`/api/todos/${id}`, { method: "DELETE" }),
};
