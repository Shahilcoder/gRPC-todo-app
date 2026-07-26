// Package main starts the todo gRPC server.
//
// Wiring is intentionally flat: open the database, migrate it, build the
// service, register it on a gRPC server, and listen.
package main

import (
	"context"
	"database/sql"
	"log"
	"net"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"todo-app/server/pb"

	"google.golang.org/grpc"
	_ "modernc.org/sqlite"
)

const (
	defaultDBFile = "todos.db"
	listenAddr    = ":50051"
)

// SQLite disables foreign keys by default, and the pragma is *per connection* —
// a one-shot db.Exec("PRAGMA foreign_keys = ON") only configures whichever
// pooled connection happened to serve it. modernc.org/sqlite applies _pragma=
// query parameters when it opens each new connection, so the DSN is the only
// place this can go and still hold for every connection in the pool.
//
// Without it, ON DELETE CASCADE silently does nothing and todo_labels
// accumulates orphans.
const dsnParams = "?_pragma=foreign_keys(1)&_pragma=busy_timeout(5000)"

func main() {
	dbPath := os.Getenv("TODO_DB")
	if dbPath == "" {
		dbPath = defaultDBFile
	}

	// Logged absolute because the default is relative: run the server from a
	// different directory and you silently get a different, empty database.
	if abs, err := filepath.Abs(dbPath); err == nil {
		log.Printf("database: %s", abs)
	}

	db, err := sql.Open("sqlite", "file:"+dbPath+dsnParams)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Before anything can query it.
	if err := Migrate(ctx, db); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	store := NewStore(db)

	lis, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterTodoServiceServer(grpcServer, &todoServer{store: store})

	// Without this, Ctrl-C mid-write hands the BFF an UNAVAILABLE instead of
	// letting in-flight RPCs finish and the stream end cleanly.
	go func() {
		<-ctx.Done()
		log.Println("shutting down")
		grpcServer.GracefulStop()
	}()

	log.Printf("gRPC server listening on %s", listenAddr)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("serve: %v", err)
	}
}
