package main

import (
	"context"
	"errors"
	"log"
	"sort"
	"strings"
	"unicode/utf8"

	"todo-app/server/pb"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Input limits. These are not arbitrary politeness: without them a single
// request can put an unbounded string in a row that every subsequent list read
// has to carry.
const (
	maxTitleRunes = 500
	maxLabelRunes = 32
	maxLabels     = 16
)

// todoServer implements pb.TodoServiceServer. Each RPC validates its input,
// calls the store, and maps failures onto real status codes.
type todoServer struct {
	pb.UnimplementedTodoServiceServer
	store *Store
}

func (s *todoServer) ListTodos(ctx context.Context, _ *pb.Empty) (*pb.TodoList, error) {
	todos, err := s.store.List(ctx)
	if err != nil {
		return nil, rpcError("list todos", err)
	}
	return &pb.TodoList{Todos: todos}, nil
}

func (s *todoServer) CreateTodo(ctx context.Context, req *pb.CreateTodoRequest) (*pb.Todo, error) {
	title, err := validateTitle(req.GetTitle())
	if err != nil {
		return nil, err
	}
	if err := validatePriority(req.GetPriority()); err != nil {
		return nil, err
	}
	labels, err := normalizeLabels(req.GetLabels())
	if err != nil {
		return nil, err
	}

	todo, err := s.store.Create(ctx, title, int32(req.GetPriority()), labels)
	if err != nil {
		return nil, rpcError("create todo", err)
	}
	return todo, nil
}

func (s *todoServer) ToggleTodo(ctx context.Context, req *pb.ToggleTodoRequest) (*pb.Todo, error) {
	if err := validateID(req.GetId()); err != nil {
		return nil, err
	}
	todo, err := s.store.Toggle(ctx, req.GetId())
	if err != nil {
		return nil, rpcError("toggle todo", err)
	}
	return todo, nil
}

func (s *todoServer) UpdateTodo(ctx context.Context, req *pb.UpdateTodoRequest) (*pb.Todo, error) {
	if err := validateID(req.GetId()); err != nil {
		return nil, err
	}

	params := UpdateParams{ID: req.GetId()}

	// Presence is a nil check on the pointer, never `GetTitle() != ""`.
	// proto3 `optional` generates *string with no Has* accessor under the
	// default open API, and the whole point of the pointer is that "" is a
	// legitimate value distinct from absent.
	if req.Title != nil {
		title, err := validateTitle(*req.Title)
		if err != nil {
			return nil, err
		}
		params.Title = &title
	}
	if req.Priority != nil {
		if err := validatePriority(*req.Priority); err != nil {
			return nil, err
		}
		p := int32(*req.Priority)
		params.Priority = &p
	}
	// Message presence: an absent LabelList means "leave labels alone", a
	// present but empty one means "remove every label".
	if req.Labels != nil {
		labels, err := normalizeLabels(req.Labels.GetLabels())
		if err != nil {
			return nil, err
		}
		params.Labels = &labels
	}

	if params.Title == nil && params.Priority == nil && params.Labels == nil {
		return nil, status.Error(codes.InvalidArgument,
			"update must set at least one of title, priority, labels")
	}

	todo, err := s.store.Update(ctx, params)
	if err != nil {
		return nil, rpcError("update todo", err)
	}
	return todo, nil
}

func (s *todoServer) DeleteTodo(ctx context.Context, req *pb.DeleteTodoRequest) (*pb.Empty, error) {
	if err := validateID(req.GetId()); err != nil {
		return nil, err
	}
	if err := s.store.Delete(ctx, req.GetId()); err != nil {
		return nil, rpcError("delete todo", err)
	}
	return &pb.Empty{}, nil
}

func validateID(id int64) error {
	if id <= 0 {
		return status.Error(codes.InvalidArgument, "id must be a positive integer")
	}
	return nil
}

// validateTitle trims and bounds a title, returning the value to store.
func validateTitle(raw string) (string, error) {
	title := strings.TrimSpace(raw)
	if title == "" {
		return "", status.Error(codes.InvalidArgument, "title must not be empty")
	}
	// Runes, not bytes: a 500-character title of non-ASCII text is not an
	// abuse case, and len() would reject it.
	if utf8.RuneCountInString(title) > maxTitleRunes {
		return "", status.Errorf(codes.InvalidArgument,
			"title must be at most %d characters", maxTitleRunes)
	}
	return title, nil
}

// validatePriority rejects values outside the enum.
//
// This is not defensive clutter: proto3 enums are open, so a client sending 7
// arrives here as pb.Priority(7) with no complaint from the runtime and would
// be written straight into the column.
func validatePriority(p pb.Priority) error {
	if _, ok := pb.Priority_name[int32(p)]; !ok {
		return status.Errorf(codes.InvalidArgument, "unknown priority %d", int32(p))
	}
	return nil
}

// normalizeLabels turns whatever the client sent into the canonical form the
// database stores: a leading '#' stripped, trimmed, lowercased, deduped, and
// sorted.
//
// Lowercasing here means the labels table's COLLATE NOCASE is belt-and-braces
// rather than the only thing keeping #Admin and #admin from becoming two
// labels.
//
// Sorting is part of the canonical form rather than a nicety. Create builds its
// response from these values directly, while every other RPC reads labels back
// from SQL with ORDER BY name — so without sorting here, the same task would
// come back with its chips in one order after a create and another after a
// reload.
func normalizeLabels(raw []string) ([]string, error) {
	if len(raw) == 0 {
		return nil, nil
	}

	labels := make([]string, 0, len(raw))
	seen := make(map[string]bool, len(raw))

	for _, r := range raw {
		name := strings.ToLower(strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(r), "#")))
		if name == "" {
			return nil, status.Error(codes.InvalidArgument, "label must not be empty")
		}
		if utf8.RuneCountInString(name) > maxLabelRunes {
			return nil, status.Errorf(codes.InvalidArgument,
				"label %q must be at most %d characters", name, maxLabelRunes)
		}
		if strings.ContainsAny(name, " \t\n") {
			return nil, status.Errorf(codes.InvalidArgument, "label %q must not contain whitespace", name)
		}
		if seen[name] {
			continue
		}
		seen[name] = true
		labels = append(labels, name)
	}

	if len(labels) > maxLabels {
		return nil, status.Errorf(codes.InvalidArgument,
			"at most %d labels per task", maxLabels)
	}

	sort.Strings(labels)
	return labels, nil
}

// rpcError is the one place store failures stop leaking as codes.Unknown.
//
// The client depends on the distinction: Clay's per-row error state with a
// retry affordance, and its rule that a failed list load must not be dressed as
// an empty one, both need the browser to tell "not found" from "server down"
// from "bad input".
func rpcError(op string, err error) error {
	switch {
	case errors.Is(err, ErrNotFound):
		return status.Error(codes.NotFound, "todo not found")
	case errors.Is(err, context.Canceled):
		return status.Error(codes.Canceled, "request canceled")
	case errors.Is(err, context.DeadlineExceeded):
		return status.Error(codes.DeadlineExceeded, "request deadline exceeded")
	default:
		// Full detail stays server-side; the client gets a code it can act on.
		log.Printf("%s: %v", op, err)
		return status.Error(codes.Internal, "internal error")
	}
}
