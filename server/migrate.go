package main

// Schema migrations, versioned on SQLite's own PRAGMA user_version.
//
// user_version is a 32-bit integer stored in the database header that SQLite
// itself never touches, so it costs no table and no extra file. It is also
// transactional: bumping it inside a migration's transaction rolls back with
// the rest if any statement fails, which is what makes each step atomic.
//
// The live database this replaces reports user_version = 0 while already
// holding a populated `todos` table — indistinguishable from a fresh file by
// the counter alone. Migration 1 is therefore deliberately idempotent.

import (
	"context"
	"database/sql"
	"fmt"
	"log"
)

// migration is one forward-only step. version must equal its index + 1.
type migration struct {
	version int
	name    string
	stmts   []string
}

var migrations = []migration{
	{
		version: 1,
		name:    "base schema",
		// Byte-for-byte the schema that used to live inline in NewStore. The
		// IF NOT EXISTS is what lets an existing populated database at
		// user_version = 0 no-op its way to version 1 without losing rows.
		stmts: []string{`
CREATE TABLE IF NOT EXISTS todos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);`},
	},
	{
		version: 2,
		name:    "priority and labels",
		stmts: []string{
			// Existing rows get priority 0 = PRIORITY_UNSPECIFIED, which is
			// the design system's tier 4 ("none"). No backfill needed.
			`ALTER TABLE todos ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;`,

			// Labels are normalised into their own table rather than stuffed
			// into a CSV or JSON column: COLLATE NOCASE UNIQUE makes #Admin
			// and #admin the same label for free, and a join table is the
			// honest model for a repo whose point is showing the SQL.
			`CREATE TABLE IF NOT EXISTS labels (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE
);`,

			// ON DELETE CASCADE only fires when foreign keys are enabled, and
			// they are OFF by default in SQLite. main.go opens the database
			// with ?_pragma=foreign_keys(1) for exactly this reason.
			`CREATE TABLE IF NOT EXISTS todo_labels (
    todo_id  INTEGER NOT NULL REFERENCES todos(id)  ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, label_id)
);`,

			// The composite primary key already indexes (todo_id, ...), which
			// serves "labels of this todo". This index serves the reverse
			// direction and the unreferenced-label sweep.
			`CREATE INDEX IF NOT EXISTS idx_todo_labels_label ON todo_labels(label_id);`,
		},
	},
}

// Migrate brings db up to the newest known schema version, applying each
// pending step in its own transaction.
func Migrate(ctx context.Context, db *sql.DB) error {
	current, err := currentVersion(ctx, db)
	if err != nil {
		return fmt.Errorf("read user_version: %w", err)
	}

	if current > len(migrations) {
		return fmt.Errorf(
			"database is at schema version %d but this binary only knows %d: refusing to downgrade",
			current, len(migrations))
	}

	for _, m := range migrations {
		if m.version <= current {
			continue
		}
		log.Printf("migrating schema to v%d (%s)", m.version, m.name)
		if err := applyMigration(ctx, db, m); err != nil {
			return err
		}
	}
	return nil
}

func currentVersion(ctx context.Context, db *sql.DB) (int, error) {
	var v int
	err := db.QueryRowContext(ctx, `PRAGMA user_version`).Scan(&v)
	return v, err
}

func applyMigration(ctx context.Context, db *sql.DB, m migration) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback() // no-op once Commit succeeds

	for _, stmt := range m.stmts {
		if _, err := tx.ExecContext(ctx, stmt); err != nil {
			return fmt.Errorf("migration %d (%s): %q: %w", m.version, m.name, stmt, err)
		}
	}

	// PRAGMA does not accept bind parameters — "PRAGMA user_version = ?" is a
	// syntax error — so the version is interpolated. It is an int from the
	// table above, never user input.
	if _, err := tx.ExecContext(ctx, fmt.Sprintf(`PRAGMA user_version = %d`, m.version)); err != nil {
		return fmt.Errorf("migration %d (%s): bump user_version: %w", m.version, m.name, err)
	}

	return tx.Commit()
}
