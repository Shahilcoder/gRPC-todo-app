package main

import (
	"context"
	"database/sql"
	"time"

	"todo-app/server/pb"
)

// Store is a tiny SQLite-backed repository for todos.
// Plain database/sql — no ORM — to keep the SQL visible.
type Store struct {
	db *sql.DB
}

const schema = `
CREATE TABLE IF NOT EXISTS todos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);`

func NewStore(db *sql.DB) (*Store, error) {
	if _, err := db.Exec(schema); err != nil {
		return nil, err
	}
	return &Store{db: db}, nil
}

func (s *Store) List(ctx context.Context) ([]*pb.Todo, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT id, title, completed, created_at FROM todos ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []*pb.Todo
	for rows.Next() {
		t := &pb.Todo{}
		var done int
		if err := rows.Scan(&t.Id, &t.Title, &done, &t.CreatedAt); err != nil {
			return nil, err
		}
		t.Completed = done == 1
		todos = append(todos, t)
	}
	return todos, rows.Err()
}

func (s *Store) Create(ctx context.Context, title string) (*pb.Todo, error) {
	now := time.Now().Unix()
	res, err := s.db.ExecContext(ctx,
		`INSERT INTO todos (title, completed, created_at) VALUES (?, 0, ?)`,
		title, now)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	return &pb.Todo{Id: id, Title: title, Completed: false, CreatedAt: now}, nil
}

func (s *Store) Toggle(ctx context.Context, id int64) (*pb.Todo, error) {
	// Flip the bit in one statement, then read back the row.
	if _, err := s.db.ExecContext(ctx,
		`UPDATE todos SET completed = 1 - completed WHERE id = ?`, id); err != nil {
		return nil, err
	}
	t := &pb.Todo{}
	var done int
	err := s.db.QueryRowContext(ctx,
		`SELECT id, title, completed, created_at FROM todos WHERE id = ?`, id).
		Scan(&t.Id, &t.Title, &done, &t.CreatedAt)
	if err != nil {
		return nil, err
	}
	t.Completed = done == 1
	return t, nil
}

func (s *Store) Delete(ctx context.Context, id int64) error {
	_, err := s.db.ExecContext(ctx, `DELETE FROM todos WHERE id = ?`, id)
	return err
}
