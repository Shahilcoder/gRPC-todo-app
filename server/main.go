// Package main starts the todo gRPC server.
//
// Wiring is intentionally flat: open the database, build the service,
// register it on a gRPC server, and listen.
package main

import (
	"database/sql"
	"log"
	"net"

	"todo-app/server/pb"

	"google.golang.org/grpc"
	_ "modernc.org/sqlite"
)

const (
	dbFile     = "todos.db"
	listenAddr = ":50051"
)

func main() {
	db, err := sql.Open("sqlite", dbFile)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer db.Close()

	store, err := NewStore(db)
	if err != nil {
		log.Fatalf("init store: %v", err)
	}

	lis, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterTodoServiceServer(grpcServer, &todoServer{store: store})

	log.Printf("gRPC server listening on %s", listenAddr)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("serve: %v", err)
	}
}
