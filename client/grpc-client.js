// grpc-client.js
//
// Loads the shared todo.proto at runtime and exposes promisified wrappers
// around the five RPCs. No code generation step on the JS side — proto-loader
// builds the message types in memory. That means a change to todo.proto needs
// no build here, but it does need this Node process restarted.

const path = require("path");
const { promisify } = require("util");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.resolve(__dirname, "../proto/todo.proto");
const SERVER_ADDR = process.env.GRPC_SERVER || "localhost:50051";

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false, // → createdAt, not created_at
  longs: Number,   // int64 → JS number (fine for small ids and unix seconds)
  enums: String,   // → "PRIORITY_HIGH", translated in lib/todo-mapping.js
  defaults: true,
  oneofs: true,    // surfaces proto3 `optional` as a synthetic oneof
});

// A note on `defaults: true` and the `optional` fields in UpdateTodoRequest:
// it does *not* fabricate values for them. protobufjs compiles proto3
// `optional` into a synthetic oneof, and default-filling skips any field that
// belongs to a oneof — so an omitted title stays absent rather than becoming
// "", and "leave this field unchanged" survives the round trip.

const proto = grpc.loadPackageDefinition(packageDef).todo;

const client = new proto.TodoService(
  SERVER_ADDR,
  grpc.credentials.createInsecure()
);

// Wrap each unary RPC in a Promise so the Express handlers can `await`.
module.exports = {
  listTodos:  promisify(client.listTodos.bind(client)),
  createTodo: promisify(client.createTodo.bind(client)),
  toggleTodo: promisify(client.toggleTodo.bind(client)),
  updateTodo: promisify(client.updateTodo.bind(client)),
  deleteTodo: promisify(client.deleteTodo.bind(client)),
};
