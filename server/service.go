package main

import (
	"context"

	"todo-app/server/pb"
)

// todoServer implements pb.TodoServiceServer.
// Each RPC is a thin pass-through to the store.
type todoServer struct {
	pb.UnimplementedTodoServiceServer
	store *Store
}

func (s *todoServer) ListTodos(ctx context.Context, _ *pb.Empty) (*pb.TodoList, error) {
	todos, err := s.store.List(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.TodoList{Todos: todos}, nil
}

func (s *todoServer) CreateTodo(ctx context.Context, req *pb.CreateTodoRequest) (*pb.Todo, error) {
	return s.store.Create(ctx, req.GetTitle())
}

func (s *todoServer) ToggleTodo(ctx context.Context, req *pb.ToggleTodoRequest) (*pb.Todo, error) {
	return s.store.Toggle(ctx, req.GetId())
}

func (s *todoServer) DeleteTodo(ctx context.Context, req *pb.DeleteTodoRequest) (*pb.Empty, error) {
	if err := s.store.Delete(ctx, req.GetId()); err != nil {
		return nil, err
	}
	return &pb.Empty{}, nil
}
