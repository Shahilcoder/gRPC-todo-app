# Architecture

A todo app built in three layers. The browser talks plain HTTP/JSON, a small Node server turns that into gRPC calls, and a Go server saves everything in SQLite.

## The big picture

```mermaid
flowchart LR
    B["Browser UI<br/>(public/js)"] -- "HTTP / JSON" --> N["Node + Express<br/>port 3000"]
    N -- "gRPC" --> G["Go gRPC server<br/>port 50051"]
    G -- "SQL" --> D[("SQLite<br/>todos.db")]
    P["proto/todo.proto<br/>(shared contract)"] -.-> N
    P -.-> G
```

| Layer | Folder | Job |
|---|---|---|
| Browser UI | `client/public/` | Shows the list and sends requests. Updates the screen right away, before the server answers. |
| Express server (BFF) | `client/server.js` | Serves the web page and turns each HTTP call into a gRPC call. |
| gRPC server | `server/` | Checks the input, runs the SQL, and returns real error codes. |
| Database | `todos.db` | Stores todos, labels, and which labels belong to which todo. |
| Contract | `proto/todo.proto` | Defines the five RPCs. Go uses generated code from it, and Node reads it when it starts. |

### Why the middle layer?

Browsers can't make plain gRPC calls. The Express server sits in between, so the browser only ever sees simple JSON and can use friendly words like `"high"` instead of `PRIORITY_HIGH`.

## The API

| HTTP | gRPC | What it does |
|---|---|---|
| `GET /api/todos` | `ListTodos` | Get every todo, newest first |
| `POST /api/todos` | `CreateTodo` | Add a todo |
| `POST /api/todos/:id/toggle` | `ToggleTodo` | Mark a todo done or not done |
| `PATCH /api/todos/:id` | `UpdateTodo` | Change the title, priority, or labels |
| `DELETE /api/todos/:id` | `DeleteTodo` | Remove a todo |

## Request flow

Every request goes through the same steps:

```mermaid
flowchart TD
    A[User clicks or types] --> B[Browser updates the screen right away]
    B --> C[fetch /api/...]
    C --> D{Express: is the input OK?}
    D -- No --> E[400 error]
    D -- Yes --> F[gRPC call to Go]
    F --> G{Go: is the input OK?}
    G -- No --> H[INVALID_ARGUMENT]
    G -- Yes --> I[Run SQL inside a transaction]
    I -- Row missing --> J[NOT_FOUND]
    I -- Success --> K[Return the todo]
    H & J --> L[Express turns the gRPC code into an HTTP code]
    E & L --> M[Browser undoes its change and shows Retry]
    K --> N[Express converts it to JSON]
    N --> O[Browser shows the server's version]
```

How gRPC errors become HTTP errors: `INVALID_ARGUMENT → 400`, `NOT_FOUND → 404`, `UNAVAILABLE → 503`, and anything else → `500`. A `503` means the Go server is down. Because of that, the UI shows an error instead of an empty list.

## Sequence: adding a todo

```mermaid
sequenceDiagram
    actor U as User
    participant B as Browser
    participant E as Express
    participant G as Go server
    participant D as SQLite

    U->>B: Types "Pay rent #home" and presses Enter
    B->>B: Shows a temporary row (negative id, pending)
    B->>E: POST /api/todos {title, priority, labels}
    E->>E: Checks input and maps "high" to PRIORITY_HIGH
    E->>G: CreateTodo(request)
    G->>G: Checks title, priority, and labels
    G->>D: BEGIN, INSERT todo, save labels, COMMIT
    D-->>G: New id
    G-->>E: Todo
    E-->>B: 201 Created + JSON
    B->>B: Replaces the temporary row with the real one
```

## Lifecycle: server start and stop

```mermaid
stateDiagram-v2
    [*] --> OpenDB: start Go server
    OpenDB --> Migrate: foreign keys turned on
    Migrate --> Listening: schema is up to date
    Migrate --> [*]: DB is newer than the code (refuses to run)
    Listening --> Serving: Express connects
    Serving --> Draining: Ctrl-C or SIGTERM
    Draining --> [*]: running requests finish (GracefulStop)
```

## Lifecycle: a todo

```mermaid
stateDiagram-v2
    [*] --> Pending: user adds it (temporary row)
    Pending --> Active: server saves it
    Pending --> Failed: request fails
    Failed --> Pending: Retry
    Active --> Done: toggle
    Done --> Active: toggle
    Active --> Active: edit title, priority, or labels
    Active --> [*]: delete
    Done --> [*]: delete
```

## Database

```mermaid
erDiagram
    todos ||--o{ todo_labels : has
    labels ||--o{ todo_labels : used_by
    todos { int id PK
            text title
            int completed
            int created_at
            int priority }
    labels { int id PK
             text name "unique, case-insensitive" }
    todo_labels { int todo_id FK
                  int label_id FK }
```

- When a todo is deleted, its label links are deleted too (`ON DELETE CASCADE`).
- A label that no todo uses anymore is removed. That's why there's no "list labels" call: the browser just collects the labels from the todos it already has.
- Schema changes live in `server/migrate.go`. The current schema version is stored in SQLite's `PRAGMA user_version`.
