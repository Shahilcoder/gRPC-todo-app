package main

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"

	"todo-app/server/pb"
)

// ErrNotFound is returned when an id does not match a row. service.go
// translates it to codes.NotFound; the store deliberately knows nothing about
// gRPC, so this sentinel is the seam between the two layers.
var ErrNotFound = errors.New("todo not found")

// Store is a tiny SQLite-backed repository for todos.
// Plain database/sql — no ORM — to keep the SQL visible.
type Store struct {
	db *sql.DB
}

// querier is satisfied by both *sql.DB and *sql.Tx so the read helpers work
// inside or outside a transaction.
type querier interface {
	QueryContext(ctx context.Context, q string, args ...any) (*sql.Rows, error)
	QueryRowContext(ctx context.Context, q string, args ...any) *sql.Row
	ExecContext(ctx context.Context, q string, args ...any) (sql.Result, error)
}

// UpdateParams uses one presence idiom throughout: a nil pointer means "leave
// this field alone". A non-nil pointer to an empty Labels slice means "remove
// every label", which is why it is a *[]string and not a []string — an empty
// slice and an absent one look identical otherwise, and here they mean
// opposite things.
type UpdateParams struct {
	ID       int64
	Title    *string
	Priority *int32
	Labels   *[]string
}

// NewStore wraps an already-migrated database. Schema ownership lives in
// migrate.go, so this no longer runs any DDL.
func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

// List returns every todo, newest first, with labels attached.
//
// Two queries, not N+1: one for the rows, one for every join row, merged in
// Go. Reading *all* join rows is only correct because List returns all todos —
// the moment this gains a LIMIT or a filter, the second query needs a
// WHERE tl.todo_id IN (...) to match.
func (s *Store) List(ctx context.Context) ([]*pb.Todo, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, title, completed, created_at, priority FROM todos ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []*pb.Todo
	for rows.Next() {
		t := &pb.Todo{}
		var done int
		var priority int64
		if err := rows.Scan(&t.Id, &t.Title, &done, &t.CreatedAt, &priority); err != nil {
			return nil, err
		}
		t.Completed = done == 1
		t.Priority = pb.Priority(priority)
		todos = append(todos, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	if err := attachLabels(ctx, s.db, todos); err != nil {
		return nil, err
	}
	return todos, nil
}

func (s *Store) Create(ctx context.Context, title string, priority int32, labels []string) (*pb.Todo, error) {
	now := time.Now().Unix()

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	res, err := tx.ExecContext(ctx,
		`INSERT INTO todos (title, completed, created_at, priority) VALUES (?, 0, ?, ?)`,
		title, now, priority)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	if err := setLabels(ctx, tx, id, labels); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	// Every value is already known, so there is nothing to read back.
	return &pb.Todo{
		Id:        id,
		Title:     title,
		Completed: false,
		CreatedAt: now,
		Priority:  pb.Priority(priority),
		Labels:    labels,
	}, nil
}

// Toggle flips completed in one statement and returns the resulting row.
//
// The flip is relative — `completed = 1 - completed` — so it cannot lose an
// update to a concurrent toggle the way "set completed = <what I last saw>"
// could. A transaction is still needed because the labels are read back in the
// same snapshot.
func (s *Store) Toggle(ctx context.Context, id int64) (*pb.Todo, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	res, err := tx.ExecContext(ctx,
		`UPDATE todos SET completed = 1 - completed WHERE id = ?`, id)
	if err != nil {
		return nil, err
	}
	// SQLite's changes() counts rows *matched*, not rows whose values
	// differed, so zero here reliably means "no such id" rather than "the
	// update was a no-op".
	if n, err := res.RowsAffected(); err != nil {
		return nil, err
	} else if n == 0 {
		return nil, ErrNotFound
	}

	todo, err := loadTodo(ctx, tx, id)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return todo, nil
}

// Update applies a partial change. Fields whose pointer is nil are untouched.
func (s *Store) Update(ctx context.Context, p UpdateParams) (*pb.Todo, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Checked up front so a labels-only update — which runs no UPDATE against
	// `todos` at all — still reports a missing id as NotFound.
	var exists int
	err = tx.QueryRowContext(ctx, `SELECT 1 FROM todos WHERE id = ?`, p.ID).Scan(&exists)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	} else if err != nil {
		return nil, err
	}

	var sets []string
	var args []any
	if p.Title != nil {
		sets = append(sets, `title = ?`)
		args = append(args, *p.Title)
	}
	if p.Priority != nil {
		sets = append(sets, `priority = ?`)
		args = append(args, int64(*p.Priority))
	}
	if len(sets) > 0 {
		args = append(args, p.ID)
		if _, err := tx.ExecContext(ctx,
			`UPDATE todos SET `+strings.Join(sets, `, `)+` WHERE id = ?`, args...); err != nil {
			return nil, err
		}
	}

	if p.Labels != nil {
		if err := setLabels(ctx, tx, p.ID, *p.Labels); err != nil {
			return nil, err
		}
		if err := pruneUnusedLabels(ctx, tx); err != nil {
			return nil, err
		}
	}

	todo, err := loadTodo(ctx, tx, p.ID)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return todo, nil
}

func (s *Store) Delete(ctx context.Context, id int64) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// todo_labels rows go with it via ON DELETE CASCADE — which requires the
	// foreign_keys pragma set in main.go's DSN.
	res, err := tx.ExecContext(ctx, `DELETE FROM todos WHERE id = ?`, id)
	if err != nil {
		return err
	}
	if n, err := res.RowsAffected(); err != nil {
		return err
	} else if n == 0 {
		return ErrNotFound
	}

	if err := pruneUnusedLabels(ctx, tx); err != nil {
		return err
	}
	return tx.Commit()
}

// loadTodo reads one row plus its labels. Returns ErrNotFound for a missing id.
func loadTodo(ctx context.Context, q querier, id int64) (*pb.Todo, error) {
	t := &pb.Todo{}
	var done int
	var priority int64
	err := q.QueryRowContext(ctx,
		`SELECT id, title, completed, created_at, priority FROM todos WHERE id = ?`, id).
		Scan(&t.Id, &t.Title, &done, &t.CreatedAt, &priority)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	} else if err != nil {
		return nil, err
	}
	t.Completed = done == 1
	t.Priority = pb.Priority(priority)

	labels, err := labelsFor(ctx, q, id)
	if err != nil {
		return nil, err
	}
	t.Labels = labels
	return t, nil
}

func labelsFor(ctx context.Context, q querier, todoID int64) ([]string, error) {
	rows, err := q.QueryContext(ctx, `
		SELECT l.name
		  FROM todo_labels tl
		  JOIN labels l ON l.id = tl.label_id
		 WHERE tl.todo_id = ?
		 ORDER BY l.name`, todoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		names = append(names, name)
	}
	return names, rows.Err()
}

// attachLabels fills in Labels for a whole page of todos with one query.
func attachLabels(ctx context.Context, q querier, todos []*pb.Todo) error {
	if len(todos) == 0 {
		return nil
	}

	rows, err := q.QueryContext(ctx, `
		SELECT tl.todo_id, l.name
		  FROM todo_labels tl
		  JOIN labels l ON l.id = tl.label_id
		 ORDER BY tl.todo_id, l.name`)
	if err != nil {
		return err
	}
	defer rows.Close()

	byTodo := make(map[int64][]string)
	for rows.Next() {
		var todoID int64
		var name string
		if err := rows.Scan(&todoID, &name); err != nil {
			return err
		}
		byTodo[todoID] = append(byTodo[todoID], name)
	}
	if err := rows.Err(); err != nil {
		return err
	}

	for _, t := range todos {
		t.Labels = byTodo[t.Id]
	}
	return nil
}

// setLabels replaces a todo's labels wholesale. Names are expected to arrive
// already normalised (see normalizeLabels in service.go).
func setLabels(ctx context.Context, q querier, todoID int64, names []string) error {
	if _, err := q.ExecContext(ctx,
		`DELETE FROM todo_labels WHERE todo_id = ?`, todoID); err != nil {
		return err
	}

	// At the capped handful of labels a row can carry, preparing these two
	// statements once per transaction would not pay for itself. A hot path
	// would.
	for _, name := range names {
		if _, err := q.ExecContext(ctx,
			`INSERT INTO labels (name) VALUES (?) ON CONFLICT(name) DO NOTHING`, name); err != nil {
			return err
		}
		var labelID int64
		if err := q.QueryRowContext(ctx,
			`SELECT id FROM labels WHERE name = ?`, name).Scan(&labelID); err != nil {
			return err
		}
		if _, err := q.ExecContext(ctx,
			`INSERT INTO todo_labels (todo_id, label_id) VALUES (?, ?)`, todoID, labelID); err != nil {
			return err
		}
	}
	return nil
}

// pruneUnusedLabels keeps the invariant "the labels table is exactly the set of
// labels in use". That is what makes the browser deriving its label list from
// the todos it already holds exactly equal to the table, instead of merely
// close — which is why there is no ListLabels RPC.
//
// It is a full-table sweep on every write. At this scale that is free; at a
// larger one it would need to be scoped to the labels just detached.
func pruneUnusedLabels(ctx context.Context, q querier) error {
	_, err := q.ExecContext(ctx,
		`DELETE FROM labels WHERE id NOT IN (SELECT label_id FROM todo_labels)`)
	return err
}
