# Makefile — the one place the protoc invocation is written down.
#
# protoc resolves --go_out / --go-grpc_out to plugin *binaries on PATH*, and
# `go install` puts those in $(go env GOPATH)/bin, which is not on PATH in a
# default macOS shell. Without this line codegen fails with
# "protoc-gen-go: program not found or is not executable".
export PATH := $(shell go env GOPATH)/bin:$(PATH)

PROTO_DIR := proto
PB_DIR    := server/pb

# Pinned to the versions that produced the committed generated code. A
# different protoc or plugin version rewrites the `// versions:` header and
# produces a diff that looks like a change but isn't one.
PROTOC_GEN_GO_VERSION      := v1.36.11
PROTOC_GEN_GO_GRPC_VERSION := v1.6.1

.PHONY: proto tools check-proto server client css

# protoc itself is not `go install`-able: brew install protobuf (28.3).
tools:
	go install google.golang.org/protobuf/cmd/protoc-gen-go@$(PROTOC_GEN_GO_VERSION)
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@$(PROTOC_GEN_GO_GRPC_VERSION)

proto:
	protoc -I $(PROTO_DIR) \
	  --go_out=$(PB_DIR)      --go_opt=paths=source_relative \
	  --go-grpc_out=$(PB_DIR) --go-grpc_opt=paths=source_relative \
	  todo.proto

# Fails if the committed stubs are stale relative to the .proto.
check-proto: proto
	git diff --exit-code -- $(PB_DIR)

server:
	cd server && go run .

client:
	cd client && npm start

css:
	cd client && npm run build:css
