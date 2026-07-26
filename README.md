# gRPC-todo-app

A todo app whose point is the plumbing: a Go gRPC service over SQLite, an
Express BFF that translates HTTP to gRPC, and a no-build browser UI.

```
browser  ──HTTP/JSON──▶  Express :3000  ──gRPC──▶  Go :50051  ──▶  SQLite
                         (client/)                 (server/)       todos.db
```

The shared contract is `proto/todo.proto`. Go consumes it through generated
stubs in `server/pb/`; Node loads the same file at runtime with
`@grpc/proto-loader`, so there is no codegen step on the JS side.

The UI implements **Clay**, the design system in
[`client/DESIGN.md`](client/DESIGN.md). That document is normative — its YAML
front matter is the source of truth for every colour, type step, and spacing
value, mirrored into `client/tailwind.config.js` and `client/src/input.css`.

## Prerequisites

| Tool | Version used here | Notes |
|---|---|---|
| Go | 1.24+ | `server/go.mod` says `go 1.24.0` |
| Node | 22 | |
| protoc | 28.3 | `brew install protobuf`. Only needed to change the proto. |
| protoc-gen-go | v1.36.11 | `make tools` |
| protoc-gen-go-grpc | 1.6.1 | `make tools` |

The protoc plugin versions are pinned because they stamp themselves into the
`// versions:` header of the generated files — a different version produces a
diff that looks like a change but is only a version bump.

`make tools` installs the plugins into `$(go env GOPATH)/bin`. That directory is
**not** on `PATH` in a default macOS shell, and `protoc` resolves plugins via
`PATH`, so the `proto` target prepends it. If you invoke `protoc` by hand
instead, expect `protoc-gen-go: program not found or is not executable`.

## Running it

Two processes, in two terminals:

```sh
make server    # cd server && go run .    → gRPC on :50051
make client    # cd client && npm start   → web UI on http://localhost:3000
```

`npm start` runs `prestart`, which builds `public/output.css` with Tailwind.
That matters because `output.css` is gitignored and generated: without the
prestart step a fresh clone renders completely unstyled. For iterating on CSS,
run `npm run watch:css` in a third terminal.

Other targets:

```sh
make proto        # regenerate server/pb from proto/todo.proto
make check-proto  # fail if the committed stubs are stale
make tools        # install the pinned protoc plugins
make css          # build client/public/output.css once
```

## HTTP API

The Express layer is a thin translator. Errors come back as `{error, code}`,
where `code` is the gRPC status name.

| Method | Path | RPC | Notes |
|---|---|---|---|
| `GET` | `/api/todos` | `ListTodos` | newest first |
| `POST` | `/api/todos` | `CreateTodo` | `{title, priority?, labels?}` |
| `POST` | `/api/todos/:id/toggle` | `ToggleTodo` | flips `completed` |
| `PATCH` | `/api/todos/:id` | `UpdateTodo` | any subset of `{title, priority, labels}` |
| `DELETE` | `/api/todos/:id` | `DeleteTodo` | `204`, or `404` if the id is gone |

`priority` is one of `none` \| `urgent` \| `high` \| `medium` over HTTP. The wire
enum spells these `PRIORITY_UNSPECIFIED` \| `PRIORITY_URGENT` \| `PRIORITY_HIGH`
\| `PRIORITY_MEDIUM`, and `client/lib/todo-mapping.js` is the only place the two
vocabularies meet. `PRIORITY_UNSPECIFIED` is the design system's tier 4 — "no
priority" — because proto3 requires the default to be the zero value, and that
is exactly what tier 4 means.

`PATCH` distinguishes absent from empty. A key that is not in the body is left
alone; `{"labels": []}` removes every label; `{"priority": "none"}` clears the
priority. That distinction is why `UpdateTodoRequest` uses proto3 `optional`
scalars and a `LabelList` wrapper rather than bare fields.

Labels are entered in the UI as inline `#tag` tokens in the title field. They
are lowercased, deduped, and normalised into a `labels` table plus a
`todo_labels` join table; a label that no todo references any more is deleted.
That last part is why there is no `ListLabels` RPC — the browser can derive the
complete label set from the todos it already holds.

Status codes are mapped from gRPC in `client/lib/grpc-http.js`:

| gRPC | HTTP |
|---|---|
| `INVALID_ARGUMENT` | 400 |
| `NOT_FOUND` | 404 |
| `DEADLINE_EXCEEDED` | 504 |
| `UNAVAILABLE` | 503 |
| everything else | 500 |

`UNAVAILABLE → 503` is the one that matters most: it is what lets the browser
tell "the Go server is not running" from "you have no tasks", so a dead backend
shows an error state instead of an empty list.

## Schema migrations

`server/migrate.go` holds an ordered list of migrations and tracks the applied
version in SQLite's own `PRAGMA user_version` — no bookkeeping table. Each step
runs in its own transaction, and `user_version` is transactional too, so a step
either lands completely or not at all.

Migration 1 is the original schema with `CREATE TABLE IF NOT EXISTS`, which is
load-bearing rather than defensive: an existing populated `todos.db` reports
`user_version = 0`, indistinguishable from a fresh file, so step 1 has to be a
no-op on a database that already has the table.

`TODO_DB` overrides the database path. It defaults to the *relative* `todos.db`,
so the server logs the absolute path at startup — running it from the wrong
directory otherwise silently creates a second, empty database.

## Keyboard

| Key | Action |
|---|---|
| `/` | focus the composer |
| `↑` `↓` | move between rows |
| `Space` | toggle the focused row |
| `Enter` | edit the focused row's title |
| `Esc` | cancel the edit |

## Gotchas

- **SQLite foreign keys are off by default, and the pragma is per-connection.**
  `db.Exec("PRAGMA foreign_keys = ON")` configures one pooled connection and
  nothing else. `server/main.go` opens the database as
  `file:todos.db?_pragma=foreign_keys(1)` so every connection gets it. Without
  it, `ON DELETE CASCADE` silently does nothing and `todo_labels` accumulates
  orphans.
- **`PRAGMA user_version = ?` is a syntax error.** Pragmas take no bind
  parameters, so the version is interpolated — safe here because it is an `int`
  from a table in the source, never input.
- **`proto-loader`'s `defaults: true` does not break presence.** protobufjs
  compiles proto3 `optional` into a synthetic oneof, and default-filling skips
  oneof members, so an omitted `title` stays absent instead of becoming `""`.
- **protobufjs drops an unknown enum string silently.** Sending
  `priority: "urgnet"` would encode a message with no priority at all — a
  request that succeeds having changed nothing. The BFF validates the value and
  returns 400 rather than relying on the server to catch it.
- **A proto change needs `make proto` for Go, but only a restart for Node.**
  `proto-loader` reads the file at startup, so the Node process has to be
  restarted to see an edit; no build step is involved.
- **Tailwind's preflight puts `[hidden]{display:none}` in the base layer**, so
  any component class that sets `display` beats it and the `hidden` attribute
  stops working. `client/src/input.css` restores it with one unlayered rule.
